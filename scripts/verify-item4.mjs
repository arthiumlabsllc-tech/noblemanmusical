// Phase 23 Sub-Phase A, item 4 — footer + newsletter regression suite.
//
//   node scripts/verify-item4.mjs --base http://localhost:3010
//
// Written against the review checklist, one block per check, so "it looks fine"
// is never the evidence:
//   1  all footer links resolve (except the sanctioned /careers 404)
//   3  no duplicate trust messaging
//   4  mobile stack is clean — no horizontal scroll, no cramped spacing
//   5  social icons all have proper aria-labels
//   6  payment badges have accessible names (no blank images)
//   7  build clean, no console noise from the footer
//   plus clearance: the footer's last row must beat the fixed tab bar AND the
//   cookie banner at the same time, which is the failure item 3 already shipped.
//
// Check 2 (newsletter delivers) cannot pass here: `neondb` has zero tables and
// RESEND_API_KEY is blank. What this suite DOES verify is the honest half — the
// form never claims success the server did not grant. See the report tail.
//
// Exit code = number of failures.

import { launchChrome, makeReporter } from "./cdp.mjs";
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const BASE = arg("base", "http://localhost:3010");
const OUT = join(process.cwd(), arg("out", "docs/screenshots/phase-23-item-4"));
const PORT = Number(arg("port", 9344));

// The two 404s a reviewer is told to expect. Anything else that 404s is broken.
const EXPECTED_404 = new Set(["/careers", "/brands"]);
const TRUST_CLAIMS = ["Official Warranty", "Nationwide Delivery", "Pay on Delivery in Accra"];

mkdirSync(OUT, { recursive: true });
const { check, info, hygiene, summary, results } = makeReporter({
  // The action logs its own DB failure by design; that line is the point of
  // check 11, not noise. Everything else stays visible.
  ignoreConsole: [/favicon/i, /Download the React DevTools/i, /third-party cookie/i, /\[newsletter\] subscribe failed/],
});

/*
 * The report is APPENDED LIVE into the screenshot folder, next to the PNGs, so the
 * numbers and the pictures are provably the same run — and so the file says whether
 * the run finished. Hand-copied artifacts are how the item-4 folder ended up with
 * two different "mobile 375 home" screenshots from two different runs; a truncated
 * verification.txt is now unmistakably a truncated run, not a passing one.
 */
const REPORT_FILE = join(OUT, "verification.txt");
const print = console.log.bind(console);
const printErr = console.error.bind(console);
writeFileSync(
  REPORT_FILE,
  `# node scripts/verify-item4.mjs\n# started ${new Date().toISOString()}  base ${BASE}\n` +
    `# written as it runs; the LAST line is the exit code, so a file without one is an incomplete run\n\n`
);
const tee = (sink) => (...a) => {
  appendFileSync(REPORT_FILE, a.map((x) => (typeof x === "string" ? x : String(x))).join(" ") + "\n");
  sink(...a);
};
console.log = tee(print);
console.error = tee(printErr);

let session;
try {
  session = await launchChrome({ port: PORT });
} catch (e) {
  console.error(e.message);
  appendFileSync(REPORT_FILE, "\nexit 1 — HARNESS NEVER STARTED, no checks were run\n");
  process.exit(1);
}
const { cdp, dispose } = session;

/* A crash must not read as a passing run, or as a list of failed checks. */
process.on("uncaughtException", (e) => {
  console.error("\nSUITE CRASHED (exit 2, harness fault):");
  console.error(e?.stack || String(e));
  appendFileSync(REPORT_FILE, "\nexit 2 — SUITE CRASHED, every line above is from an INCOMPLETE run\n");
  try {
    session.chrome.kill();
  } catch {
    /* already gone */
  }
  process.exit(2);
});

/** Snapshot of every footer link + the column it sits in. */
const FOOTER_DUMP = `(async()=>{
  const f=document.querySelector('footer');
  if(!f)return {missing:true};
  const cols=[...f.children[0].querySelectorAll(':scope > div > .lg\\\\:col-span-2, :scope > div > div')];
  const grid=f.querySelector('.grid');
  const groups=[...grid.children].map(c=>{
    const h=c.querySelector('h2,h3');
    return {title:h?(h.textContent||'').trim():'(untitled)',
            links:[...c.querySelectorAll('a')].length};
  });
  const links=[...f.querySelectorAll('a')].map(a=>({
    text:(a.getAttribute('aria-label')||a.textContent||'').trim().slice(0,42),
    href:a.getAttribute('href'), target:a.getAttribute('target'),
    rel:a.getAttribute('rel'), todo:a.closest('[data-todo]')?.getAttribute('data-todo')||null,
    svgHidden:!!a.querySelector('svg')&&a.querySelector('svg').getAttribute('aria-hidden')==='true',
    name:a.getAttribute('aria-label')||(a.textContent||'').trim()}));
  const images=[...f.querySelectorAll('img')].map(i=>({alt:i.getAttribute('alt'),
    w:i.getAttribute('width'),h:i.getAttribute('height'),loading:i.getAttribute('loading')}));
  const payList=[...f.querySelectorAll('ul')].find(u=>/Paystack/.test(u.textContent||''));
  return {groups,links,images,
    footerText:(f.textContent||'').replace(/\\s+/g,' '),
    payment:{found:!!payList, items:payList?[...payList.children].map(li=>(li.textContent||'').trim()):[],
             imgs:payList?payList.querySelectorAll('img').length:-1}};})()`;

/* ── 1440: structure, links, accessibility ─────────────────── */
await cdp.goto(`${BASE}/`);
await cdp.metrics(1440, 900);
const fo = await cdp.evaluate(FOOTER_DUMP);

check("footer exists", !fo.missing);
check("five columns", fo.groups?.length === 5, `found ${fo.groups?.length}: ${[fo.groups?.[0]?.title, fo.groups?.[1]?.title].join(", ")}…`);
info("columns (links per column; brand block's first heading is its social row):",
  (fo.groups || []).map((g) => `${g.title}(${g.links})`).join("  ") + `  | total links ${(fo.links || []).length}`);

// 1 — every internal footer link resolves.
const internal = (fo.links || []).filter((l) => l.href && l.href.startsWith("/"));
const statuses = new Map();
for (const href of [...new Set(internal.map((l) => l.href.split("#")[0]))]) {
  let status = -1;
  try {
    status = (await fetch(`${BASE}${href}`, { cache: "no-store" })).status;
  } catch {
    status = -1;
  }
  statuses.set(href, status);
}
const broken = [...statuses].filter(
  ([href, s]) => s >= 400 && !EXPECTED_404.has(href.split("?")[0])
);
const sanctioned = [...statuses].filter(
  ([href, s]) => s >= 400 && EXPECTED_404.has(href.split("?")[0])
);
check(`1. all ${statuses.size} footer link targets resolve`, broken.length === 0,
  broken.map(([h, s]) => `${h}=${s}`).join(" ") || `sanctioned 404: ${sanctioned.map(([h]) => h).join(" ") || "none"}`);
sanctioned.forEach(([h, s]) => info(`expected ${s}: ${h}`));

// …and the sanctioned one must be marked in the DOM, or it is just a dead link.
const careers = (fo.links || []).find((l) => l.href === "/careers");
check("…/careers carries a data-todo marker", !!careers?.todo, careers ? `todo=${careers.todo}` : "link absent");

// §5.1 asks for a Warranty link. Deep-linking it only works if the anchor exists.
const warrantyHref = (fo.links || []).find((l) => (l.href || "").includes("#"))?.href;
if (warrantyHref) {
  const [, frag] = warrantyHref.split("#");
  const html = await (await fetch(`${BASE}${warrantyHref.split("#")[0]}`, { cache: "no-store" })).text();
  check("4. deep-link anchor exists on its page", html.includes(`id="${frag}"`), warrantyHref);
}

// 5 — social icons, scoped to the social row itself. Counting "any cross-origin
// link in the footer" would have swept in the Google Maps pin and passed for the
// wrong reason.
const social = await cdp.evaluate(`(()=>{
  const ul=document.querySelector('footer ul[data-todo="confirm-social-profiles"]');
  if(!ul)return {missing:true};
  return {list:[...ul.querySelectorAll('a')].map(a=>({name:a.getAttribute('aria-label')||'',
    href:a.getAttribute('href'),target:a.getAttribute('target'),rel:a.getAttribute('rel'),
    svgHidden:a.querySelector('svg')?.getAttribute('aria-hidden')==='true',
    tap:Math.round(a.getBoundingClientRect().height)}))};})()`);
check("5. every social icon has a spoken name beyond 'link'", social.list?.length >= 4 && social.list.every((s) => /nobleman.*(instagram|facebook|youtube|whatsapp)/i.test(s.name)),
  (social.list || []).map((s) => s.name).join(" | ") || "no social row");
check("…and its icon is aria-hidden", social.list?.every((s) => s.svgHidden));
check("…and opens safely (target+rel)", social.list?.every((s) => s.target === "_blank" && /noopener/.test(s.rel || "")));
check("…and is a 44px touch target", social.list?.every((s) => s.tap >= 44), (social.list || []).map((s) => s.tap).join(",") + "px");

// 6 — payment badges.
check("6. payment badges have accessible names", fo.payment?.found && fo.payment.items.length === 4 && fo.payment.items.every(Boolean),
  (fo.payment?.items || []).join(", "));
check("…and are real text, not images", fo.payment?.imgs === 0, `${fo.payment?.imgs} <img> in the payment row`);

// Footer images must never render blank or shift.
check("footer images carry alt + intrinsic size", fo.images.length > 0 && fo.images.every((i) => i.alt && i.w && i.h),
  fo.images.map((i) => `${i.alt || "NO ALT"} ${i.w}x${i.h}`).join(" "));
check("footer logo is not eager-prioritised below the fold", !fo.images.some((i) => i.loading === "eager"),
  fo.images.map((i) => i.loading || "auto").join(","));

// Every footer anchor must have a name — the 2.4.4 case the checklist is about.
const nameless = (fo.links || []).filter((l) => !(l.name || "").trim());
check("no unnamed footer links", nameless.length === 0, nameless.map((l) => l.href).join(" "));

// 3 — duplicate trust messaging, counted per region. "Total on the page ≤ 1" is
// the wrong assertion: it fails on a pre-existing duplication (the utility bar and
// the hero both make these claims) and would then be "fixed" by deleting the
// check. What item 4 owns is whether the FOOTER adds a copy, and whether the two
// global chrome layers repeat each other. Anything else is reported, not asserted,
// and belongs to Sub-Phase B's homepage rebuild.
const trustByRegion = await cdp.evaluate(`(() => {
  const claims = ${JSON.stringify(TRUST_CLAIMS)};
  const tally = (el) => el ? claims.map((c) => ((el.textContent || '').replace(/\\s+/g, ' ').toLowerCase().split(c.toLowerCase()).length - 1)) : claims.map(() => 0);
  const chrome = tally(document.querySelector('[aria-label="Service guarantees"]'));
  const footer = tally(document.querySelector('footer'));
  const page = tally(document.body);
  return { claims, chrome, footer, elsewhere: page.map((n, i) => Math.max(0, n - chrome[i] - footer[i])) };
})()`);
check("3. the footer contributes no copy of the utility-bar claims", trustByRegion.footer.every((n) => n === 0),
  trustByRegion.claims.map((c, i) => `${c}=${trustByRegion.footer[i]}`).join(" | "));
check("…and no claim appears twice in global chrome", trustByRegion.chrome.every((n) => n <= 1),
  trustByRegion.claims.map((c, i) => `${c}=${trustByRegion.chrome[i]}`).join(" | "));
const dupNote = trustByRegion.claims.map((c, i) => [c, trustByRegion.elsewhere[i]]).filter(([, n]) => n > 0);
if (dupNote.length) {
  info("NOTE for Sub-Phase B (not item 4, not caused by the footer): these claims also appear in page content —",
    dupNote.map(([c, n]) => `${c} x${n}`).join(" | "),
    "— see TECH_DEBT; the homepage trust strip is Sub-Phase B item 11.");
}

// Newsletter form semantics — the accessible-name plumbing is easy to get wrong.
const form = await cdp.evaluate(`(()=>{
  const f=document.querySelector('footer form'); if(!f)return {missing:true};
  const i=f.querySelector('input[type=email]'), b=f.querySelector('button[type=submit]');
  const st=f.querySelector('[role=status][aria-live=polite]');
  const lb=f.getAttribute('aria-labelledby');
  const forId=i&&f.querySelector('label[for]')?.getAttribute('for');
  return {action:!!i&&!!b, described:i?.getAttribute('aria-describedby')===st?.id,
    labelPads:!!forId&&forId===i?.id, formNamed:!!(lb&&document.getElementById(lb)),
    statusMounted:!!st, statusText:(st?.textContent||'').trim(), btnName:b?.getAttribute('aria-label'),
    btnH:b?Math.round(b.getBoundingClientRect().height):0, inputH:i?Math.round(i.getBoundingClientRect().height):0};})()`);
check("newsletter input + submit are wired", form.action === true);
check("form named by its own heading, not the input label", form.formNamed === true);
check("status region is mounted before it has anything to say", form.statusMounted === true && form.statusText === "");
check("input describes the status region", form.described === true);
check("input has a real <label for>", form.labelPads === true);
check("gold arrow button has a name and a 44px target", !!form.btnName && form.btnH >= 44 && form.inputH >= 44,
  `${form.btnName} btn=${form.btnH}px input=${form.inputH}px`);

/* ── measured contrast: the footer is dark-on-dark by design ── */
/*
 * Two mistakes this block had to be backed out of, both of the "confident wrong
 * number" kind:
 *
 *  1. It first stopped at the nearest ancestor with a non-transparent background
 *     and treated it as opaque, scoring the `bg-cream/5` payment chip as solid
 *     cream. Alpha layers have to be composited bottom-up.
 *  2. It then parsed `getComputedStyle().color` as `rgb(...)`. Tailwind v4 emits
 *     every opacity-modified text colour (`text-cream/70`) as
 *     `color-mix(in oklab, …)`, which Chrome computes to `oklab(L a b / alpha)`.
 *     Reading those three numbers as r/g/b turns a 8.4:1 cream-on-navy into a
 *     1.07:1 "failure" for a lightness, a chroma and a hue angle. Routing the
 *     string through a canvas does NOT help — measured: `fillStyle` echoes
 *     `oklab(...)` straight back. So oklab/oklch are converted here, and any
 *     format this cannot parse is reported as an error instead of being scored,
 *     because a contrast number from misread channels is worse than no number.
 *  3. Matching only the literal name 'rgb' skipped every `rgba(0, 0, 0, 0)` in
 *     each ancestor chain, so nothing was measured and the loop's own "0
 *     failures" printed a PASS. Hence the `seen >= 20` gate below.
 *
 * (Comments like this one stay on THIS side of the string. Writing one inside the
 * page script with backticks around an identifier silently terminated the
 * template literal and the suite died with a parse error and no output at all.)
 */
const contrast = await cdp.evaluate(`(()=>{
  const oklab=(L,A,B)=>{const l=L+0.3963377774*A+0.2158037573*B,m=L-0.1055613458*A-0.0638541728*B,s=L-0.0894841775*A-1.2914855480*B;
    const l3=l*l*l,m3=m*m*m,s3=s*s*s;
    return [4.0767416621*l3-3.3077115913*m3+0.2309699292*s3,
      -1.2684380046*l3+2.6097574011*m3-0.3413193965*s3,
      -0.0041960863*l3-0.7034186147*m3+1.7076147010*s3];};
  const enc=(v)=>255*Math.max(0,Math.min(1,v<=0.0031308?12.92*v:1.055*Math.pow(v,1/2.4)-0.055));
  const UNPARSEABLE={r:0,g:0,b:0,a:0,bad:true};
  const parse=(s)=>{
    const str=String(s).trim();
    if(str[0]==='#'){const h=str.slice(1);const v=(i)=>parseInt(h.slice(i,i+2),16);
      return {r:v(0),g:v(2),b:v(4),a:h.length>=8?v(6)/255:1};}
    const fn=(str.match(/^([a-z-]+)\\(/i)||[])[1]||'';
    const n=(str.match(/-?\\d*\\.?\\d+(?:e[-+]?\\d+)?/gi)||[]).map(Number);
    if(n.length<3)return UNPARSEABLE;
    const a=n.length>3?n[3]:1;
    if(fn==='oklab')return {r:enc(oklab(n[0],n[1],n[2])[0]),g:enc(oklab(n[0],n[1],n[2])[1]),b:enc(oklab(n[0],n[1],n[2])[2]),a};
    if(fn==='oklch'){const h=n[2]*Math.PI/180;const c=oklab(n[0],n[1]*Math.cos(h),n[1]*Math.sin(h));
      return {r:enc(c[0]),g:enc(c[1]),b:enc(c[2]),a};}
    if(/^rgb/.test(fn))return {r:n[0],g:n[1],b:n[2],a};
    if(fn==='color')return n.slice(0,3).every((x)=>x<=1)?{r:n[0]*255,g:n[1]*255,b:n[2]*255,a}:{r:n[0],g:n[1],b:n[2],a};
    return UNPARSEABLE;};
  const ch=(v)=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);};
  const lum=(c)=>0.2126*ch(c.r)+0.7152*ch(c.g)+0.0722*ch(c.b);
  const over=(f,b)=>({r:f.r*f.a+b.r*(1-f.a),g:f.g*f.a+b.g*(1-f.a),b:f.b*f.a+b.b*(1-f.a),a:1});
  const bgOf=(el)=>{const layers=[];let p=el;let bad=0;
    while(p){const c=parse(getComputedStyle(p).backgroundColor);
      if(c.bad)bad++;
      else if(c.a>0){layers.push(c);if(c.a>=1)break;}
      p=p.parentElement;}
    let out={r:255,g:255,b:255,a:1};
    for(let i=layers.length-1;i>=0;i--)out=over(layers[i],out);
    return {c:out,bad};};
  const fails=[];const samples=[];const badFormats=new Set();let seen=0,worst={ratio:99};
  for(const el of document.querySelectorAll('footer a,footer p,footer li,footer h3,footer span')){
    const text=[...el.childNodes].filter(x=>x.nodeType===3).map(x=>x.textContent).join('').trim();
    if(!text)continue;
    const q=el.getBoundingClientRect(); if(!q.width||!q.height)continue;
    const cs=getComputedStyle(el);
    const fg=parse(cs.color); const b=bgOf(el);
    if(fg.bad)badFormats.add(cs.color);
    if(b.bad)badFormats.add('bg '+(el.parentElement?getComputedStyle(el.parentElement).backgroundColor:'-'));
    if(fg.bad||b.bad){if(samples.length<4)samples.push('SKIP "'+text.slice(0,14)+'" fg='+cs.color+' fgBad='+!!fg.bad+' bgBad='+b.bad+' nearestBg='+(el.parentElement?getComputedStyle(el.parentElement).backgroundColor:'-'));continue;}
    const bg=b.c; const eff=over(fg,bg);
    const L1=lum(eff),L2=lum(bg);
    const ratio=Math.round(((Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05))*100)/100;
    const size=Math.round(parseFloat(cs.fontSize)*10)/10; const bold=parseInt(cs.fontWeight,10)>=700;
    const need=(size>=24||(size>=18.66&&bold))?3:4.5;
    seen++;
    if(samples.length<3)samples.push('"'+text.slice(0,14)+'" '+cs.color+' -> rgb('+[eff.r|0,eff.g|0,eff.b|0]+') on rgb('+[bg.r|0,bg.g|0,bg.b|0]+') = '+ratio+':1');
    if(ratio<worst.ratio)worst={text:text.slice(0,30),ratio,size,need};
    if(ratio<need)fails.push({text:text.slice(0,30),ratio,size,need});}
  return {fails,worst,seen,samples,bad:[...badFormats]};})()`);
contrast.samples.forEach((s) => info("contrast measurement:", s));
/*
 * `seen` is asserted before `fails` is. A loop that skips every element passes
 * its own "0 failures" check, which is how the first version of this reported
 * "PASS, worst 99:1" while measuring nothing at all — the same silently-clean
 * shape as a `git grep` that searched no files. A contrast suite that measured
 * zero text nodes is not passing, it is disconnected.
 */
check("contrast sampling actually ran", contrast.seen >= 20 && contrast.bad.length === 0,
  contrast.bad.length
    ? `unparseable colour format(s): ${contrast.bad.join(" , ")}`
    : `${contrast.seen} text nodes measured (a loop that measures nothing cannot find nothing)`);
check("footer text meets WCAG AA contrast", contrast.fails.length === 0 && contrast.seen >= 20,
  contrast.fails.length
    ? contrast.fails.slice(0, 5).map((f) => `"${f.text}" ${f.ratio}:1 need ${f.need} @${f.size}px`).join(" | ")
    : `${contrast.seen} text nodes measured, worst ${contrast.worst?.ratio}:1 ("${contrast.worst?.text}")`);

await cdp.evaluate(`document.querySelector('footer').scrollIntoView()`);
await new Promise((r) => setTimeout(r, 500));
await cdp.shot("01-footer-1440", OUT);
await cdp.metrics(1440, 4000);
await cdp.shot("02-footer-full-1440", OUT);

/* ── 11/12: newsletter behaviour — the half that is testable today ── */
await cdp.metrics(1440, 900);
await cdp.evaluate(`document.querySelector('footer form').scrollIntoView({block:'center'})`);
await new Promise((r) => setTimeout(r, 400));

const SEL = "footer form input[type=email]";
await cdp.clickSelector(SEL, 200);
await cdp.type("not-an-email");
await cdp.clickSelector("footer form button[type=submit]");
await new Promise((r) => setTimeout(r, 900));
/*
 * A malformed address is stopped by native validation (`type=email required`), so
 * the live region stays empty — nothing was announced because nothing was sent.
 * The first version of this check demanded an error message here and therefore
 * asserted a React-path bug that did not exist. What matters is the pairing:
 * client-side syntax refusal sends no request, server-side refusal sends no
 * success (checked next), and zod re-validates either way.
 */
const refused = await cdp.evaluate(`(()=>{const f=document.querySelector('footer form');
  const i=f.querySelector('input');
  return {valid:i.validity.valid,msg:i.validationMessage,
    announced:(f.querySelector('[role=status]').textContent||'').trim(),
    disabled:!!f.querySelector('button').disabled};})()`);
check("11. a malformed address never reaches the server", refused.valid === false && refused.announced === "",
  `browser refused: "${refused.msg}"`);
check("…button is not left spinning", refused.disabled === false);
await cdp.shot("03-newsletter-invalid", OUT);

/*
 * The server's own answer, whatever it is. A green tick the server did not author
 * is the defect this check exists to catch.
 *
 * Two things item 4's first run got wrong here, both of them test bugs that would
 * have hidden a real one:
 *  - clearing the input without real key events, so the submit re-sent the
 *    previous case (see the clear below);
 *  - a fixed 3.5s sleep is a race against a cold Neon round trip (which is slow
 *    precisely because the database has no tables and the query has to fail).
 *    Poll until the button stops reporting aria-busy, with a deadline.
 */
/*
 * Clearing a controlled input. `el.value = ''` does NOT clear React's state (the
 * value tracker swallows the change), and Ctrl+A through `cdp.key()` did not
 * select either — the run proved it: the field ended up holding
 * "not-an-emailitem4+…@example.com", which is the previous case still in state
 * with the new case appended. Real Backspace key events, one per character, are
 * the only thing that keeps React's copy in step with the DOM's.
 */
await cdp.clickSelector(SEL, 200);
const stale = await cdp.evaluate(`document.querySelector('footer form input').value`);
for (let i = 0; i < stale.length + 2; i++) {
  for (const type of ["keyDown", "keyUp"]) {
    await cdp.send("Input.dispatchKeyEvent", {
      type, key: "Backspace", code: "Backspace", windowsVirtualKeyCode: 8, nativeVirtualKeyCode: 8,
    });
  }
}
await new Promise((r) => setTimeout(r, 250));
const cleared = await cdp.evaluate(`document.querySelector('footer form input').value`);
check("…the field really was emptied first", cleared === "", `held "${stale}", now "${cleared}"`);
await cdp.type(`item4+${Date.now()}@example.com`);
const typed = await cdp.evaluate(`document.querySelector('footer form input').value`);
check("…and holds exactly the new address", /^item4\+\d+@example\.com$/.test(typed), `"${typed}"`);
await cdp.clickSelector("footer form button[type=submit]");
let submit;
for (let waited = 0; waited < 20000; waited += 500) {
  await new Promise((r) => setTimeout(r, 500));
  submit = await cdp.evaluate(`(()=>{const f=document.querySelector('footer form');
    const st=f.querySelector('[role=status]'); const icon=st.querySelector('svg');
    return {text:(st.textContent||'').trim(),busy:f.querySelector('button').getAttribute('aria-busy'),
    icon:icon?(icon.getAttribute('class')||''):'',value:f.querySelector('input').value};})()`);
  if (submit.busy !== "true") break;
}
const serverSaidOk = /you're in|already on the list/i.test(submit.text);
check("12. success message only when the server granted it",
  serverSaidOk ? submit.icon.includes("text-kente-green") && submit.value === "" : submit.text.length > 10,
  `${serverSaidOk ? "STORED" : "NOT STORED"}: "${submit.text}"`);
check("…and the pending state is released, not stuck on a spinner", submit.busy !== "true", `aria-busy=${submit.busy}`);
info(submit.value === "" ? "input cleared after a completed attempt" : `input still holds "${submit.value}"`);
await cdp.shot("04-newsletter-submit-result", OUT);
hygiene(cdp);

/* ── 375: mobile stack, clearance, cramped spacing ─────────── */
/*
 * The tab bar and the legal links are measured in BOTH viewport modes and the two
 * numbers are compared, because this suite originally explained a 66px reading as
 * "Chrome font inflation" and that explanation was wrong: emulated and plain both
 * report 66px, scale 1. The height was real and `--tabbar-h: 60px` was the bug.
 * The comparison stays as a guard — if emulation ever does start inflating text,
 * every pixel assertion below becomes untrustworthy and it should say so out loud
 * rather than quietly reporting measurements of the emulator.
 */
const TAB_PROBE = `(()=>{const b=[...document.querySelectorAll('nav')].find(n=>{
  const cs=getComputedStyle(n);const q=n.getBoundingClientRect();
  return cs.position==='fixed'&&q.height>0&&q.bottom>=window.innerHeight-1;});
  if(!b)return null;
  const row=b.firstElementChild; const tab=[...b.querySelectorAll('a')].sort((x,y)=>y.getBoundingClientRect().height-x.getBoundingClientRect().height)[0];
  return {navH:Math.round(b.getBoundingClientRect().height*10)/10,
    borderTop:parseFloat(getComputedStyle(b).borderTopWidth),
    rowPad:row?(parseFloat(getComputedStyle(row).paddingTop)+parseFloat(getComputedStyle(row).paddingBottom)):0,
    tabH:tab?Math.round(tab.getBoundingClientRect().height*10)/10:0,
    tabMinH:tab?getComputedStyle(tab).minHeight:'-',
    scale:Math.round((window.visualViewport?.scale??1)*100)/100,dpr:window.devicePixelRatio};})()`;
await cdp.metrics(375, 720, true);
await cdp.goto(`${BASE}/`);
await new Promise((r) => setTimeout(r, 1600));
const emulated = await cdp.evaluate(TAB_PROBE);
await cdp.metrics(375, 720, false);
await new Promise((r) => setTimeout(r, 500));
const plain = await cdp.evaluate(TAB_PROBE);
info("tab bar breakdown (plain viewport):", JSON.stringify(plain));
info("emulated for comparison:", JSON.stringify(emulated));
check("viewport emulation agrees about pixel geometry", emulated && plain && Math.abs(emulated.navH - plain.navH) <= 1 && plain.scale === 1,
  `emulated ${emulated?.navH}px (scale ${emulated?.scale}) vs plain ${plain?.navH}px (scale ${plain?.scale}); if these diverge, every px number below is measuring the emulator`);
check("…and --tabbar-h equals border + row padding + tab height, not a guess",
  plain && Math.abs(plain.navH - (plain.borderTop + plain.rowPad + plain.tabH)) <= 1,
  `${plain?.borderTop} + ${plain?.rowPad} + ${plain?.tabH} = ${plain?.borderTop + plain?.rowPad + plain?.tabH} vs nav ${plain?.navH}`);

const ov = await cdp.overflow();
check("4. no horizontal scroll at 375", !ov.overflow, `${ov.scrollW} vs ${ov.clientW}`);
/*
 * Printed so "360 vs 360" is not read as a mis-set viewport: these passes use a
 * plain (non-emulated) 375x720 window, and headless Chrome gives classic, not
 * overlay, scrollbars — so 15px of the 375 is the scrollbar and the layout
 * viewport media queries actually see is 360. That is the NARROWER, stricter case,
 * and it is the same width the 375 PNGs come back at. The 768 pass reads 753 for
 * the same reason.
 */
info("viewport maths:", `375 requested -> clientWidth ${ov.clientW} (headless Chrome's 15px classic scrollbar; overlay scrollbars on a real phone give the full 375)`);

/*
 * Clearance, measured at MAX SCROLL, twice: once with the cookie banner up (its
 * height is published into --consent-h and added to the footer's padding) and once
 * after dismissing it. The second pass is the one that catches a wrong
 * --tabbar-h, because with the banner gone the tab bar is all the footer has to
 * clear. `html { scroll-behavior: smooth }` is switched off first — with it on,
 * reading rects immediately after scrolling returns the PRE-scroll geometry, which
 * is how the first run of this block reported a -5684px gap.
 */
const CLEARANCE = `(async()=>{
  const frames=(n)=>new Promise(r=>{let k=n;const step=()=>(--k<=0?r():requestAnimationFrame(step));requestAnimationFrame(step);});
  document.documentElement.style.scrollBehavior='auto';
  window.scrollTo(0,document.body.scrollHeight);
  await frames(6);
  const V=window.innerHeight;
  const overlays=[...document.querySelectorAll('body *')].filter(e=>{
    const cs=getComputedStyle(e);const q=e.getBoundingClientRect();
    return cs.position==='fixed'&&q.height>0&&q.bottom>=V-1&&q.top<V&&cs.visibility!=='hidden';})
    .map(e=>({tag:e.tagName+(e.getAttribute('aria-label')?'['+e.getAttribute('aria-label')+']':''),
      top:Math.round(e.getBoundingClientRect().top),h:Math.round(e.getBoundingClientRect().height),
      z:getComputedStyle(e).zIndex}));
  const legal=document.querySelector('footer nav[aria-label="Legal"]');
  const rows=[...legal.querySelectorAll('a')].map(a=>{const q=a.getBoundingClientRect();
    const t=document.elementFromPoint(q.x+q.width/2,Math.min(q.y+q.height/2,V-1));
    return {text:(a.textContent||'').trim(),ok:!!t&&(a===t||a.contains(t)||t.contains(a)),
      top:Math.round(q.top),bottom:Math.round(q.bottom),tap:Math.round(q.height*10)/10};});
  const tabEl=[...document.querySelectorAll('nav')].find(n=>{const cs=getComputedStyle(n);const q=n.getBoundingClientRect();
    return cs.position==='fixed'&&q.height>0&&q.bottom>=V-1;});
  return {overlays,rows,legalBottom:Math.round(legal.getBoundingClientRect().bottom),V,
    tabH:tabEl?Math.round(tabEl.getBoundingClientRect().height*10)/10:0,
    varH:getComputedStyle(document.documentElement).getPropertyValue('--tabbar-h').trim(),
    consentH:getComputedStyle(document.documentElement).getPropertyValue('--consent-h').trim()};})()`;

let cl = await cdp.evaluate(CLEARANCE);
check("…--tabbar-h matches the real tab bar height", Math.abs(cl.tabH - parseFloat(cl.varH)) <= 1,
  `measured ${cl.tabH}px vs --tabbar-h ${cl.varH}`);
const covered = cl.rows.filter((r) => !r.ok);
check("every legal link is tappable over the tab bar + cookie banner", covered.length === 0,
  covered.map((c) => `${c.text}@y${c.top}`).join(" ") || `${cl.rows.length} links hit-tested`);
const lowestOverlayTop = cl.overlays.length ? Math.min(...cl.overlays.map((o) => o.top)) : cl.V;
check("…with real space to spare, not 1px", lowestOverlayTop - cl.legalBottom >= 8,
  `gap ${lowestOverlayTop - cl.legalBottom}px (consent ${cl.consentH})`);
check("…and footer tap targets are >= 24px (WCAG 2.5.8)", cl.rows.every((r) => r.tap >= 24),
  cl.rows.map((r) => `${r.text}:${r.tap}`).join(" "));
await cdp.evaluate(`document.querySelector('footer').scrollIntoView()`);
await new Promise((r) => setTimeout(r, 400));
await cdp.shot("05-mobile-375-footer", OUT);

// Worst case for clearance: the banner is gone, so only the tab bar is left.
const dismissed = await cdp.evaluate(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.getAttribute('aria-label')==='Close');if(!b)return false;b.click();return true;})()`);
await new Promise((r) => setTimeout(r, 700));
const cl2 = await cdp.evaluate(CLEARANCE);
check("clearance survives the cookie banner being dismissed", dismissed && cl2.rows.every((r) => r.ok) && (cl2.V - cl2.legalBottom) >= cl2.tabH,
  dismissed ? `last row bottom y=${cl2.legalBottom} of ${cl2.V}, tab bar occupies ${cl2.tabH}px` : "no banner to dismiss (already consented?)");
await cdp.shot("06-mobile-375-footer-no-banner", OUT);

const stack = await cdp.evaluate(`(()=>{const g=document.querySelector('footer .grid');
  const cs=getComputedStyle(g); const kids=[...g.children].map(c=>c.getBoundingClientRect());
  const wrap=g.parentElement;
  return {rowGap:Math.round(parseFloat(cs.rowGap)), sidePad:Math.round(parseFloat(getComputedStyle(wrap).paddingLeft)),
    cols:cs.gridTemplateColumns.trim().split(/\s+/).length,
    minChildW:Math.round(Math.min(...kids.map(k=>k.width))),
    widestChild:Math.round(Math.max(...kids.map(k=>k.width))),vw:window.innerWidth,
    cw:document.documentElement.clientWidth};})()`);
check("mobile stack has breathing room (single column, >=32px between, no edge bleed)",
  stack.rowGap >= 32 && stack.sidePad >= 12 && stack.cols === 1 && stack.widestChild <= stack.cw,
  /* Both viewport numbers are printed: `innerWidth` includes headless Chrome's
   * 15px classic scrollbar and `clientWidth` does not, and the padding + column
   * arithmetic adds up against the second one. Printing only innerWidth made
   * "16 + 328 + 16 = 360 in a 375px viewport" look like it was 15px short. */
  `rowGap ${stack.rowGap}px, side pad ${stack.sidePad}px, ${stack.cols} column(s), children ${stack.minChildW}–${stack.widestChild}px in ${stack.cw}px content box (${stack.vw}px innerWidth incl. scrollbar)`);
await cdp.goto(`${BASE}/`);
await new Promise((r) => setTimeout(r, 1200));
await cdp.shotFull("07-mobile-375-home", OUT);

/* ── 768 ───────────────────────────────────────────────────── */
await cdp.metrics(768, 1024);
await cdp.goto(`${BASE}/`);
await new Promise((r) => setTimeout(r, 1400));
const tab = await cdp.overflow();
check("no horizontal scroll at 768", !tab.overflow, `${tab.scrollW} vs ${tab.clientW}`);
await cdp.evaluate(`document.querySelector('footer').scrollIntoView()`);
await new Promise((r) => setTimeout(r, 400));
await cdp.shot("08-tablet-768-footer", OUT);

/* ── 9: the harness itself is committed and documented ─────── */
const readme = existsSync("scripts/README.md") ? readFileSync("scripts/README.md", "utf8") : "";
check("9. CDP harness present", existsSync("scripts/cdp.mjs"));
check("…and documented in scripts/README.md", /verify-item4\.mjs/.test(readme) && /build\.mjs/.test(readme),
  existsSync("scripts/README.md")
    ? `README covers verify-item4.mjs: ${/verify-item4\.mjs/.test(readme)} / build.mjs: ${/build\.mjs/.test(readme)}`
    : "no scripts/README.md at all");

/*
 * Two checklist items are reported rather than silently omitted, because "not
 * measured" and "measured clean" are different sentences and only one of them is
 * true here.
 */
console.log(`
=== NOT VERIFIED BY THIS SUITE (blocked, see the item-4 report) ===
  #2 newsletter DELIVERY — the live neondb has 0 tables and RESEND_API_KEY is
     blank, so no row is written and no mail leaves. Verified instead: the form
     never claims a success the server did not grant.
  #8 Lighthouse >= 90 — no Lighthouse in this repo and none installed; adding it
     is a dependency decision. Measured proxies instead: logo is lazy with
     reserved width/height, form status region reserves min-h, 0 route became
     dynamic, build still prerenders 85/85.
`);

await dispose();
const failures = summary();
console.log(`\nscreenshots -> ${OUT}`);
if (failures) console.error("see FAIL lines above");
appendFileSync(REPORT_FILE, `\nexit ${failures} — ${failures ? `${failures} FAILED` : `all ${results.length} checks passed`}\n`);
process.exit(failures);
