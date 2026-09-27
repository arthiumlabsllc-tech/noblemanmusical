// Reference and link audits that cannot produce silent false negatives.
//
//   node scripts/audit.mjs refs   <pattern>     search src/ for real
//   node scripts/audit.mjs size   [limit]       files over N lines (default 300)
//   node scripts/audit.mjs todos                TODO(phase-*) / data-todo inventory
//   node scripts/audit.mjs links  [--base URL]  every internal link, with status
//   node scripts/audit.mjs env    [--quiet]     env vars referenced but unset
//
// WHY THIS EXISTS
// During Phase 23 an audit of hardcoded phone numbers concluded, from
// `git grep`, that `product-detail.tsx` carried no phone reference. It carried
// four. `git grep` searches only TRACKED files, and 19 files under src/ have
// never been committed — so it returned exit 1 with no output, which is
// indistinguishable from "no references exist". The same class of failure came
// from `Select-String -Path` treating `[slug]` as a wildcard (empty result, exit
// 0) and from a shell-escaped `$` in a `node -e` regex (matched zero files,
// reported "0 literals remaining"). All three look exactly like a clean bill of
// health.
//
// This tool refuses that failure mode: it always walks the real filesystem, it
// always prints how many files it read and how many are untracked, and an empty
// result is reported as "0 of N files matched" rather than silence.
//
// SECURITY NOTE: `env` reports which variables are set and how long the values
// are. It never prints a value. Keep it that way — this project's .env holds a
// live database URL and API secrets, and audit output gets pasted into tickets.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const ROOT = process.cwd();
const argv = process.argv.slice(2);
const cmd = argv[0];
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const BASE = flag("base", "http://localhost:3010");

const SKIP_DIRS = new Set([
  "node_modules",
  ".next",
  ".git",
  "coverage",
  "dist",
  "build",
]);
const SOURCE_EXT = /\.(ts|tsx|js|jsx|mjs)$/;

/** Every source file on disk — via readdir, never via git. */
function walk(dir, out = []) {
  const abs = join(ROOT, dir);
  if (!existsSync(abs)) return out;
  for (const entry of readdirSync(abs, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(join(dir, entry.name), out);
      continue;
    }
    if (SOURCE_EXT.test(entry.name)) out.push(join(dir, entry.name));
  }
  return out;
}

/**
 * Untracked paths, used only as a warning label: it tells whoever reads the
 * output that `git grep`/`git ls-files` would have missed these.
 */
function untrackedFiles() {
  try {
    const out = execFileSync("git", ["ls-files", "--others", "--exclude-standard"], {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
    return out.trim().split(/\r?\n/).filter(Boolean);
  } catch {
    return null; // git unavailable — say so rather than implying "none"
  }
}

function reportScope(files) {
  const un = untrackedFiles();
  const unUnder = un ? un.filter((f) => f.split(sep).join("/").startsWith("src/")) : [];
  console.log(
    `scanned ${files.length} source files under src/` +
      (un === null
        ? "  (git unavailable — untracked count unknown)"
        : `; ${unUnder.length} of them are UNTRACKED, which is why git grep is unsafe here`)
  );
  return un;
}

/* ── refs ──────────────────────────────────────────────────── */
function refs() {
  const pattern = argv.slice(1).join(" ");
  if (!pattern) {
    console.error('usage: node scripts/audit.mjs refs "<pattern>"');
    process.exit(2);
  }
  let re;
  try {
    re = new RegExp(pattern);
  } catch {
    re = null; // not a valid regex — fall back to a literal, and say so
  }
  const files = walk("src");
  reportScope(files);
  if (!re) console.log(`(pattern is not valid regex; matching literally)`);

  const hits = [];
  for (const f of files) {
    readFileSync(join(ROOT, f), "utf8")
      .split(/\r?\n/)
      .forEach((line, i) => {
        const match = re ? re.test(line) : line.includes(pattern);
        if (match) hits.push({ file: f, line: i + 1, text: line.trim().slice(0, 140) });
      });
  }

  for (const h of hits) console.log(`  ${h.file}:${h.line}  ${h.text}`);
  console.log(
    `\n${hits.length} matching lines in ${new Set(hits.map((h) => h.file)).size} files ` +
      `(0 of ${files.length} files matched is a real answer, not a clean one)`
  );
}

/* ── size ──────────────────────────────────────────────────── */
function size() {
  const limit = Number(argv[1] || 300);
  const files = walk("src");
  reportScope(files);
  const over = [];
  for (const f of files) {
    const n = readFileSync(join(ROOT, f), "utf8").split("\n").length;
    if (n > limit) over.push({ f, n });
  }
  over.sort((a, b) => b.n - a.n);
  for (const o of over) console.log(`  ${String(o.n).padStart(5)}  ${o.f}`);
  console.log(`\n${over.length} files exceed ${limit} lines`);
  const components = over.filter((o) => /^(src\/)?components\//.test(o.f.replace(/\\/g, "/")));
  if (components.length) {
    console.log(`  of which ${components.length} are components (the >300-line rule targets these)`);
  }
  process.exitCode = over.length ? 1 : 0;
}

/* ── todos ─────────────────────────────────────────────────── */
function todos() {
  const files = walk("src");
  reportScope(files);
  const markers = [];
  for (const f of files) {
    readFileSync(join(ROOT, f), "utf8")
      .split(/\r?\n/)
      .forEach((line, i) => {
        const m = line.match(/TODO\(([^)]+)\)|data-todo="([^"]+)"/);
        if (m) markers.push({ f, line: i + 1, tag: m[1] || m[2], kind: m[1] ? "code" : "dom" });
      });
  }
  const byTag = new Map();
  for (const m of markers) {
    if (!byTag.has(m.tag)) byTag.set(m.tag, []);
    byTag.get(m.tag).push(m);
  }
  for (const [tag, list] of [...byTag].sort((a, b) => b[1].length - a[1].length)) {
    console.log(`\n${tag} — ${list.length} marker${list.length === 1 ? "" : "s"}`);
    list.forEach((m) => console.log(`  ${m.kind === "dom" ? "DOM " : "code "} ${m.f}:${m.line}`));
  }
  console.log(`\n${markers.length} markers, ${byTag.size} distinct tags`);
}

/* ── links ─────────────────────────────────────────────────── */
async function links() {
  const allow = new Set(
    (flag("allow", "/brands") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
  console.log(`base: ${BASE}`);
  console.log(`expected-404 allowlist: ${[...allow].join(", ") || "(none)"}`);

  // Start from the sitemap so the crawl covers real pages, not just "/" —
  // the footer and nav render on all of them.
  //
  // Each <loc> is RE-BASED onto the server under test rather than trusted as
  // absolute: the sitemap is built from NEXT_PUBLIC_APP_URL, so a build made
  // with that set to another port yields URLs pointing at a server that is not
  // running. That silently produced "0 internal links, 0 broken" here — the
  // precise false negative this file exists to prevent.
  let pages = [];
  try {
    const xml = await (await fetch(`${BASE}/sitemap.xml`)).text();
    pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => {
        try {
          return new URL(m[1]).pathname;
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .map((p) => new URL(p, BASE).href);
    console.log(`sitemap: ${pages.length} urls, re-based onto ${BASE}`);
  } catch (e) {
    console.error(`could not read ${BASE}/sitemap.xml — is the server running? ${e.message}`);
    process.exit(2);
  }
  if (!pages.length) {
    console.error("sitemap returned no URLs — refusing to report 'no broken links'");
    process.exit(2);
  }

  const hrefs = new Set();
  const failures = [];
  const cap = Number(flag("pages", 40));
  for (const url of pages.slice(0, cap)) {
    try {
      const r = await fetch(url);
      if (!r.ok) {
        failures.push(`${url} -> ${r.status}`);
        continue;
      }
      const html = await r.text();
      for (const m of html.matchAll(/href="(\/[^"#?]*)/g)) hrefs.add(m[1]);
      for (const m of html.matchAll(/href="(\/[^"]*\?[^"]*)"/g)) hrefs.add(m[1]);
    } catch (e) {
      failures.push(`${url} -> ${e.message}`);
    }
  }
  failures.slice(0, 10).forEach((f) => console.log(`  FETCH FAIL ${f}`));
  console.log(
    `crawled ${Math.min(pages.length, cap)} pages (${failures.length} failed), ` +
      `${hrefs.size} distinct internal links`
  );
  // A crawl that found nothing is not a clean crawl.
  if (hrefs.size === 0 || failures.length > cap / 2) {
    console.error("\nREFUSING to report 'no broken links': the crawl produced nothing.");
    process.exit(2);
  }

  const broken = [];
  const allowed = [];
  const paths = [...hrefs].sort();
  for (const p of paths) {
    let status = 0;
    try {
      const r = await fetch(new URL(p, BASE), { redirect: "follow" });
      status = r.status;
    } catch (e) {
      status = -1;
    }
    if (status >= 400 || status === -1) {
      (allow.has(p.split("?")[0]) ? allowed : broken).push({ p, status });
    }
  }

  allowed.forEach((b) => console.log(`  EXPECTED ${b.status}  ${b.p}`));
  broken.forEach((b) => console.log(`  BROKEN   ${b.status}  ${b.p}`));
  console.log(
    `\n${paths.length - broken.length - allowed.length} resolve, ` +
      `${allowed.length} expected-404, ${broken.length} broken`
  );
  process.exitCode = broken.length ? 1 : 0;
}

/* ── env ───────────────────────────────────────────────────── */
function env() {
  const files = walk("src");
  reportScope(files);
  const referenced = new Map();
  for (const f of files) {
    const text = readFileSync(join(ROOT, f), "utf8");
    for (const m of text.matchAll(/process\.env\.([A-Z0-9_]+)/g)) {
      if (!referenced.has(m[1])) referenced.set(m[1], new Set());
      referenced.get(m[1]).add(f);
    }
  }

  const envPath = join(ROOT, ".env");
  const present = new Map();
  for (const candidate of [".env", ".env.local", ".env.development"]) {
    const p = join(ROOT, candidate);
    if (!existsSync(p)) continue;
    for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
      if (m) present.set(m[1], m[2].trim());
    }
  }

  // Injected by the platform, never stored in .env. Listing these would be
  // crying wolf, and a tool with known noise gets ignored.
  const RUNTIME_PROVIDED = new Set([
    "NODE_ENV",
    "VERCEL_ENV",
    "VERCEL_URL",
    "VERCEL_REGION",
    "PORT",
    "VERCEL",
  ]);

  const missing = [];
  const blank = [];
  const provided = [];
  for (const [key, where] of referenced) {
    if (RUNTIME_PROVIDED.has(key)) provided.push(key);
    else if (!present.has(key)) missing.push({ key, files: [...where] });
    else if (!present.get(key)) blank.push({ key, files: [...where] });
  }

  console.log(`\n${referenced.size} env vars referenced in src/`);
  if (provided.length) {
    console.log(`  ${provided.length} runtime-provided, skipped: ${provided.join(", ")}`);
  }
  [...blank, ...missing].forEach(({ key, files: fs }) => {
    const kind = present.has(key) ? "BLANK  " : "ABSENT ";
    console.log(`  ${kind} ${key}  — used in ${fs.length} file(s): ${fs.slice(0, 3).join(", ")}${fs.length > 3 ? ", …" : ""}`);
  });
  if (!blank.length && !missing.length) console.log("  all referenced vars have values");
  console.log("\n(values are never printed — this output goes in tickets)");
  process.exitCode = blank.length + missing.length ? 1 : 0;
}

const COMMANDS = { refs, size, todos, links, env };

if (!COMMANDS[cmd]) {
  console.error(
    "usage: node scripts/audit.mjs <refs|size|todos|links|env> [args]\n" +
      "  see the header comment for why each one exists"
  );
  process.exit(2);
}
Promise.resolve(COMMANDS[cmd]()).catch((e) => {
  console.error("audit crashed:", e?.stack || String(e));
  process.exit(2);
});
