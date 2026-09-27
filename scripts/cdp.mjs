// Zero-dependency Chrome DevTools Protocol client for visual verification.
//
// WHY THIS EXISTS
// The measurements that matter on this project cannot be answered by reading
// source: does the nav row overflow at 1024px, is a drawer link actually
// clickable behind the cookie banner, does the search field really widen to
// 320px, does every footer link resolve? Those need a real browser, a real
// viewport and a real click.
//
// NO npm PACKAGES ON PURPOSE. Node 24 ships a global WebSocket, so driving
// headless Chrome is ~300 lines of protocol plumbing: nothing to install,
// nothing to keep in lockstep with Next, no CI service to configure.
//
// TWO RULES LEARNED THE HARD WAY — both baked into the API below:
//
//   1. Click for real. `el.click()` and programmatic `el.focus()` do NOT
//      reliably drive React's onFocus/onClick in headless. Measured: the search
//      field stayed 240px under `.focus()` and widened to 320px under a genuine
//      Input.dispatchMouseEvent — the failure looked exactly like a product bug.
//      Use `click()` / `clickText()`, never `evaluate("el.click()")`.
//
//   2. Settle stacking with `document.elementFromPoint()`, never with z-index
//      arithmetic. `cdp.topElementAt()` and `scrollIntoViewAndHitTest()` answer
//      "what would this tap actually hit?". Reading the cascade tells you what
//      should happen; this tells you what does.
//
// A third, cheaper rule: type at human cadence. `type()` defaults to 200ms per
// key because firing every key in one tick outruns focus handoffs and timers,
// and the resulting measurement (a one-character prefill) is an artifact of the
// test, not the app.
//
// USAGE
//   import { launchChrome, makeReporter } from "./cdp.mjs";
//   const { chrome, cdp } = await launchChrome({ port: 9333 });
//   await cdp.goto("http://localhost:3010/");
//   await cdp.metrics(1440, 900);
//   const w = await cdp.evaluate(`document.querySelector('nav').scrollWidth`);
//   await cdp.shot("navbar-1440", OUT_DIR);
//   cdp.close(); chrome.kill();
//
// NOTE ON `cdp.evaluate()`: the name mirrors the CDP method it wraps
// (Runtime.evaluate). It evaluates strings written in THIS file against the
// page under test — never user input, never network data. The static scanner
// flags it as `eval`; that is the protocol, not a shortcut.

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir, platform } from "node:os";
import { join } from "node:path";

const CHROME_CANDIDATES = {
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ],
  win32: [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
  ],
  linux: [
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ],
};

export function findChrome() {
  const tried = CHROME_CANDIDATES[platform()] || [];
  for (const p of tried) if (p && existsSync(p)) return p;
  throw new Error(
    "No Chrome found. Tried:\n  " + tried.filter(Boolean).join("\n  ")
  );
}

async function waitForDebugger(port, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/json/version`)).ok) return true;
    } catch {
      /* not listening yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wrap a value as a JS literal safe to interpolate into an expression. */
const lit = (v) => JSON.stringify(v);

export class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    /** console.error / console.warning lines captured from the page. */
    this.console = [];
    /** Uncaught page exceptions. */
    this.pageErrors = [];
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error
          ? reject(new Error(JSON.stringify(m.error)))
          : resolve(m.result);
        return;
      }
      if (m.method === "Runtime.consoleAPICalled") {
        if (["error", "warning"].includes(m.params.type)) {
          this.console.push(
            m.params.type +
              ": " +
              m.params.args.map((a) => a.value ?? a.description ?? a.type).join(" ")
          );
        }
      }
      if (m.method === "Runtime.exceptionThrown") {
        this.pageErrors.push(
          m.params.exceptionDetails.exception?.description ||
            m.params.exceptionDetails.text
        );
      }
    };
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) =>
      this.pending.set(id, { resolve, reject })
    );
  }

  /**
   * Run an expression in the page and return a serialisable value.
   * Accepts an async IIFE — awaitPromise is on — which is what makes
   * scroll-then-hit-test sequences expressible in one call.
   */
  async evaluate(expression) {
    const r = await this.send("Runtime.evaluate", {
      expression,
      returnByValue: true,
      awaitPromise: true,
    });
    if (r.exceptionDetails) {
      throw new Error(
        "evaluate: " +
          (r.exceptionDetails.exception?.description || r.exceptionDetails.text)
      );
    }
    return r.result.value;
  }

  async goto(url, settleMs = 1400) {
    await this.send("Page.navigate", { url });
    await sleep(settleMs);
  }

  /** Emulate a viewport. `mobile: true` is what makes 375px behave like a phone. */
  async metrics(width, height, mobile = false) {
    await this.send("Emulation.setDeviceMetricsOverride", {
      width,
      height,
      deviceScaleFactor: mobile ? 2 : 1,
      mobile,
    });
    await sleep(500);
  }

  /** Center point + box of the first match, or null. */
  centerOf(selector) {
    return this.evaluate(
      `(()=>{const e=document.querySelector(${lit(selector)});if(!e)return null;` +
        `const r=e.getBoundingClientRect();` +
        `return {x:r.x+r.width/2,y:r.y+r.height/2,w:Math.round(r.width),` +
        `h:Math.round(r.height),top:Math.round(r.top),bottom:Math.round(r.bottom)};})()`
    );
  }

  /** Center of the first VISIBLE element whose text contains `fragment`. */
  centerOfText(fragment, selector = "a,button") {
    return this.evaluate(
      `(()=>{const els=[...document.querySelectorAll(${lit(selector)})];` +
        `const e=els.find(x=>(x.textContent||'').includes(${lit(
          fragment
        )})&&x.getBoundingClientRect().width>0);` +
        `if(!e)return null;const r=e.getBoundingClientRect();` +
        `return {x:r.x+r.width/2,y:r.y+r.height/2};})()`
    );
  }

  async click(x, y, settleMs = 700) {
    for (const type of ["mousePressed", "mouseReleased"]) {
      await this.send("Input.dispatchMouseEvent", {
        type,
        x,
        y,
        button: "left",
        clickCount: 1,
      });
    }
    await sleep(settleMs);
  }

  async clickSelector(selector, settleMs = 700) {
    const c = await this.centerOf(selector);
    if (!c) throw new Error(`clickSelector: no element for ${selector}`);
    await this.click(c.x, c.y, settleMs);
    return c;
  }

  async clickText(fragment, selector = "a,button", settleMs = 700) {
    const c = await this.centerOfText(fragment, selector);
    if (!c) throw new Error(`clickText: nothing visible containing "${fragment}"`);
    await this.click(c.x, c.y, settleMs);
    return c;
  }

  async hover(x, y, settleMs = 400) {
    await this.send("Input.dispatchMouseEvent", { type: "mouseMoved", x, y });
    await sleep(settleMs);
  }

  /** `modifiers`: 2 = Ctrl/Cmd on Windows+Linux, 4 = Cmd on macOS. */
  async key(k, code, modifiers = 0) {
    for (const type of ["keyDown", "keyUp"]) {
      await this.send("Input.dispatchKeyEvent", {
        type,
        key: k,
        code,
        modifiers,
        windowsVirtualKeyCode: 0,
      });
    }
    await sleep(500);
  }

  /** Type with a human cadence — see the header note on why 200ms. */
  async type(text, gapMs = 200) {
    for (const ch of text) {
      await this.send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: ch,
        text: ch,
        unmodifiedText: ch,
      });
      await sleep(gapMs);
    }
    await sleep(700);
  }

  async typeInto(selector, text, gapMs = 200) {
    await this.clickSelector(selector, 300);
    await this.type(text, gapMs);
  }

  /** Which element would actually receive a tap at this point? */
  topElementAt(x, y) {
    return this.evaluate(
      `(()=>{const t=document.elementFromPoint(${x},${y});if(!t)return null;` +
        `const r=t.getBoundingClientRect();` +
        `return {tag:t.tagName,cls:String(t.className).slice(0,60),` +
        `text:(t.textContent||'').trim().slice(0,40),` +
        `aria:t.getAttribute('aria-label'),z:getComputedStyle(t).zIndex,` +
        `box:{x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)}};})()`
    );
  }

  /**
   * Is this control reachable? Scrolls it to the middle of its container first,
   * because a control under a fixed bottom overlay in a scrollable panel is one
   * scroll away — not unreachable. Skipping that distinction produced a false
   * failure during item 3.
   */
  scrollIntoViewAndHitTest(selector) {
    return this.evaluate(
      `(async()=>{const el=document.querySelector(${lit(
        selector
      )});if(!el)return {missing:true};` +
        `el.scrollIntoView({block:'center'});` +
        `await new Promise(r=>setTimeout(r,200));` +
        `const q=el.getBoundingClientRect();` +
        `const t=document.elementFromPoint(q.x+q.width/2,q.y+q.height/2);` +
        `const hit=!!t&&(t===el||el.contains(t)||t.contains(el));` +
        `return {hit,top:t?t.tagName+'.'+String(t.className).slice(0,40):null,` +
        `box:{x:Math.round(q.x),y:Math.round(q.y),w:Math.round(q.width),h:Math.round(q.height)}};})()`
    );
  }

  /**
   * Hit-test every visible control inside `containerSelector`.
   * Returns { count, occluded: [{label, top, y}] }.
   */
  hitTestControls(containerSelector) {
    return this.evaluate(
      `(async()=>{const root=document.querySelector(${lit(
        containerSelector
      )});if(!root)return {missing:true};` +
        `const els=[...root.querySelectorAll('a,button')].filter(e=>{` +
        `const q=e.getBoundingClientRect();return q.width>0&&q.height>0;});` +
        `const out=[];` +
        `for(const el of els){el.scrollIntoView({block:'center'});` +
        `await new Promise(r=>setTimeout(r,140));` +
        `const q=el.getBoundingClientRect();` +
        `const t=document.elementFromPoint(q.x+q.width/2,q.y+q.height/2);` +
        `const hit=!!t&&(t===el||el.contains(t)||t.contains(el));` +
        `out.push({label:(el.getAttribute('aria-label')||el.textContent||'')` +
        `.trim().slice(0,24),hit,y:Math.round(q.y),` +
        `top:t?t.tagName+'.'+String(t.className).slice(0,30):null});}` +
        `return {count:out.length,occluded:out.filter(o=>!o.hit),all:out};})()`
    );
  }

  /** Page-level horizontal overflow — the "no horizontal scroll" check. */
  overflow() {
    return this.evaluate(
      `({scrollW:document.documentElement.scrollWidth,` +
        `clientW:document.documentElement.clientWidth,` +
        `overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth})`
    );
  }

  /** Box of the first match — handy for width assertions. */
  async boxOf(selector) {
    const c = await this.centerOf(selector);
    return c;
  }

  /** Screenshot to an absolute dir. Keep artifacts OUT of .next — builds wipe it. */
  async shot(name, outDir) {
    const { data } = await this.send("Page.captureScreenshot", { format: "png" });
    mkdirSync(outDir, { recursive: true });
    const file = join(outDir, `${name}.png`);
    writeFileSync(file, Buffer.from(data, "base64"));
    return file;
  }

  /** Full-page screenshot (viewport is stitched by Chrome). */
  async shotFull(name, outDir) {
    const { data } = await this.send("Page.captureScreenshot", {
      format: "png",
      captureBeyondViewport: true,
    });
    mkdirSync(outDir, { recursive: true });
    const file = join(outDir, `${name}.png`);
    writeFileSync(file, Buffer.from(data, "base64"));
    return file;
  }

  close() {
    try {
      this.ws.close();
    } catch {
      /* already gone */
    }
  }
}

/**
 * Launch headless Chrome and return a connected session.
 *
 * `profileDir` must be ABSOLUTE: a relative --user-data-dir is resolved against
 * Chrome's own cwd and the launch fails with a message that reads like a Chrome
 * bug rather than a path bug.
 *
 * In a sandboxed shell, spawning Chrome is blocked outright and the symptom is
 * "Chrome did not expose a debugger" — that is environmental, not a code fault.
 */
export async function launchChrome({
  port = 9333,
  headless = true,
  windowSize = [1500, 1000],
  profileDir,
} = {}) {
  const exe = findChrome();
  const profile = profileDir || join(tmpdir(), `nmc-cdp-${port}`);
  mkdirSync(profile, { recursive: true });

  const args = [
    headless ? "--headless=new" : "--window-position=0,0",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--disable-features=Translate",
    `--window-size=${windowSize.join(",")}`,
    "about:blank",
  ];

  const chrome = spawn(exe, args, { stdio: "ignore" });
  const exited = new Promise((resolve) => {
    chrome.once("exit", resolve);
    chrome.once("close", resolve);
    chrome.once("error", resolve);
  });
  const cleanup = async ({ keepProfile = false } = {}) => {
    try {
      chrome.kill();
    } catch {
      /* already dead */
    }
    // Chrome holds its profile directory open for a moment after SIGTERM, so
    // deleting immediately races it. Without this the suite threw EPERM from
    // teardown AFTER every check passed and exited 1 — a green run reported as
    // a failure, which is the worst possible thing a test harness can do.
    await Promise.race([exited, sleep(3000)]);
    if (keepProfile) return;
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
    } catch {
      /* Windows still has a lock; the OS temp cleaner gets it. Never fatal. */
    }
  };

  if (!(await waitForDebugger(port, 20000))) {
    await cleanup();
    throw new Error(
      `Chrome did not expose a debugger on :${port}. In a sandboxed shell this ` +
        "means the spawn was blocked — re-run with permissions, do not debug the page."
    );
  }

  const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const page = list.find((t) => t.type === "page");
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = () => reject(new Error("CDP websocket handshake failed"));
  });

  const cdp = new CDP(ws);
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await cdp.send("Log.enable");

  return {
    chrome,
    cdp,
    port,
    profile,
    /**
     * Close the socket, kill Chrome, remove the temp profile. Call from a
     * `finally` block. Pass `{ keepProfile: true }` to leave the profile behind
     * when reproducing a page-load problem by hand.
     */
    dispose: async (opts) => {
      cdp.close();
      await cleanup(opts);
    },
  };
}

/**
 * Checklist reporter: suites read as PASS/FAIL lines plus a final count.
 *
 * `ignoreConsole` is where the unavoidable noise goes — favicon 404s, React
 * DevTools, Chrome's third-party-cookie deprecation. Filter it deliberately and
 * print the counts, so a clean run is a measured clean run rather than an
 * unexplained absence of output.
 */
export function makeReporter({ ignoreConsole = [/favicon/i, /Download the React DevTools/i, /third-party cookie/i] } = {}) {
  const results = [];
  const log = (...a) => console.log(...a);

  const check = (name, ok, detail = "") => {
    results.push({ name, ok: !!ok, detail });
    log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? "  :: " + detail : ""}`);
  };
  const info = (...a) => log("  ", ...a);

  /** Report captured console/exception hygiene as two checks. */
  const hygiene = (cdp) => {
    const noisy = cdp.console.filter(
      (l) => !ignoreConsole.some((re) => re.test(l))
    );
    log("\n=== console errors/warnings ===");
    noisy.slice(0, 25).forEach((l) => log("  " + l.slice(0, 220)));
    log(`  (${noisy.length} relevant of ${cdp.console.length} total)`);
    log("=== page exceptions ===");
    cdp.pageErrors.slice(0, 10).forEach((l) => log("  " + String(l).slice(0, 220)));
    log(`  (${cdp.pageErrors.length})`);
    check("no unexplained console errors", noisy.length === 0, `${noisy.length} messages`);
    check("no page exceptions", cdp.pageErrors.length === 0, `${cdp.pageErrors.length} exceptions`);
  };

  /** Prints the summary and returns the failure count — use as exit code. */
  const summary = () => {
    const fails = results.filter((r) => !r.ok);
    log("\n=== SUMMARY ===");
    log(`${results.length - fails.length}/${results.length} passed`);
    fails.forEach((f) => log("  FAIL " + f.name + "  :: " + f.detail));
    return fails.length;
  };

  return { check, info, hygiene, summary, results };
}
