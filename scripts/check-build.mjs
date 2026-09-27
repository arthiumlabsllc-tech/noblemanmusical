// Parse a `next build` log and refuse to certify a build that cannot be read.
//
//   node scripts/check-build.mjs build-item4.log
//
// WHY THIS IS NOT JUST `Select-String Warning`
// Three separate traps turned up while building this repo's tooling, and all
// three fail silently:
//   1. PowerShell's `*>` / Tee-Object writes UTF-16LE with a BOM. Read as UTF-8
//      and every line becomes NUL-interleaved noise that matches nothing, so
//      "0 warnings" is reported about a file nobody actually parsed.
//   2. A killed or truncated build still leaves a log. Counting patterns in a
//      partial log can produce "0 errors, 0 warnings" about a build that never
//      reached the checks.
//   3. `next build` wraps stderr in a PowerShell NativeCommandError, so matching
//      the word "Error" produces hits that are not build errors at all.
//   4. PowerShell's redirection decodes the child's UTF-8 through code page 437
//      and re-writes UTF-16, so Next's route glyphs (○ ƒ ●) survive as printable
//      noise. The parser then finds no dynamic routes and reports a clean table.
//      Use `node scripts/build.mjs`, which captures raw bytes from a pipe.
//
// So: the encoding is detected, the log must contain a terminal marker to be
// believed at all, and every reported count carries its matched lines for
// inspection. Exit 0 clean, 1 findings, 2 the log is not trustworthy.

import { readFileSync } from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("usage: node scripts/check-build.mjs <build.log>");
  process.exit(2);
}

const raw = readFileSync(file);
// BOM check first: FF FE is UTF-16LE, which is what PowerShell writes by default.
const text =
  raw[0] === 0xff && raw[1] === 0xfe
    ? raw.toString("utf16le")
    : raw.toString("utf8");
const lines = text.split(/\r?\n/);

const fatal = [];
const warnings = [];

lines.forEach((line, i) => {
  const t = line.trim();
  if (!t) return;
  if (/^\s*Warning:/.test(line)) warnings.push(`${i + 1}: ${t}`);
  else if (/Type error|Failed to compile|Syntax error/.test(t)) fatal.push(`${i + 1}: ${t}`);
  // `next build` prints the word Error inside PowerShell's NativeCommandError
  // wrapper and inside intentional, expected console output — only count the
  // shapes that mean the build actually broke.
  else if (/^⨯/.test(t)) fatal.push(`${i + 1}: ${t}`);
});

/*
 * Route table markers, matched by CODE POINT rather than a literal glyph.
 * Next writes: U+25CB ○ static, U+25CF ● static-with-params, U+0192 ƒ dynamic,
 * U+2092 ₒ ISR. Literal glyphs in a source file are a guess about the file's
 * own encoding and about the log's; a code point is a fact about Unicode. Two
 * of the three earlier attempts at this block reported "no dynamic routes"
 * because the pattern silently matched nothing.
 */
const MARKERS = {
  "\u25CB": "static",
  "\u25CF": "static (params)",
  "\u0192": "dynamic",
  "\u2092": "edge/ISR",
};
const routeCounts = new Map();
const dynamicRoutes = [];
for (const line of lines) {
  const toks = line.trim().split(/\s+/);
  const pathIdx = toks.findIndex((t) => /^\/[\w[\]{}\-.?=&%/]*$/.test(t));
  if (pathIdx < 1) continue;
  const marker = toks.slice(0, pathIdx).find((t) => MARKERS[t] !== undefined);
  if (!marker) continue;
  routeCounts.set(marker, (routeCounts.get(marker) ?? 0) + 1);
  if (marker === "\u0192" || marker === "\u2092") {
    dynamicRoutes.push(`${MARKERS[marker]} ${toks[pathIdx]}`);
  }
}

const compiled = lines.some((l) => /Compiled successfully/.test(l));
/*
 * The FINAL count, not the first. `next build` rewrites one progress line, so a
 * non-global match returns "Generating static pages (0/85)" — the opening tick,
 * which reads as zero pages generated. This tool wrote that bug, saw it, and
 * fixed it here; a progress line is not a result line.
 */
const pageTicks = [...text.matchAll(/Generating static pages \((\d+)\/(\d+)\)/g)];
const pages = pageTicks.length
  ? { done: Number(pageTicks.at(-1)[1]), total: Number(pageTicks.at(-1)[2]) }
  : null;
const prerenderErrors = lines.filter((l) => /Failed to prerender|Error occurred prerendering/.test(l));

console.log(`log: ${file}  (${raw.length} bytes, ${lines.length} lines, ${raw[0] === 0xff ? "UTF-16LE" : "UTF-8"})`);
console.log(`compiled successfully: ${compiled}`);
console.log(`static pages: ${pages ? `${pages.done}/${pages.total}` : "NOT REPORTED"} (${pageTicks.length} progress ticks)`);
console.log(`lint warnings: ${warnings.length}`);
warnings.slice(0, 20).forEach((w) => console.log(`  ${w}`));
console.log(`fatal lines: ${fatal.length}`);
fatal.slice(0, 20).forEach((f) => console.log(`  ${f}`));
console.log(`prerender failures: ${prerenderErrors.length}`);
prerenderErrors.slice(0, 10).forEach((p) => console.log(`  ${p.trim()}`));
console.log(
  `route table markers: ${
    [...routeCounts]
      .map(([g, n]) => `U+${g.codePointAt(0).toString(16).toUpperCase()} (${MARKERS[g]}) = ${n}`)
      .join("; ") ||
      "NONE PARSED — this parser is wrong, do not read that as 'no routes'"
  }`
);

/*
 * A real `next build` route table always contains at least one marker glyph. If
 * none parsed but the line-drawing characters that code page 437 manufactures out
 * of UTF-8 bytes are present, the log was transcoded on the way to disk — every
 * count above was read out of a file that no longer says what the build said.
 */
const CP437_ARTIFACTS = ["\u2551", "\u2550", "\u2554", "\u255e", "\u2593", "\u2592"];
const transcoded = routeCounts.size === 0 && lines.some((l) => CP437_ARTIFACTS.some((c) => l.includes(c)));
if (transcoded) {
  console.error(
    "\nTHIS LOG HAS BEEN TRANSCODED: no route markers survived, but code page 437 " +
      "line-drawing characters did. The log was written through a shell redirect, so " +
      "re-run with `node scripts/build.mjs` (raw byte capture) before trusting any " +
      "number above."
  );
}
if (dynamicRoutes.length) {
  console.log(`non-prerendered routes — check each is intentional:`);
  dynamicRoutes.slice(0, 25).forEach((d) => console.log(`  ${d}`));
}

/*
 * The part that makes this worth having: a log without a terminal marker is not
 * evidence. "0 warnings" from a build that died at 40% is the same silent false
 * positive that `git grep` produced for the phone-number audit.
 */
const trustworthy =
  compiled && pages !== null && pages.done === pages.total && prerenderErrors.length === 0 && !transcoded;
if (!trustworthy) {
  console.error(
    "\nREFUSING to certify this build: " +
      [
        !compiled ? "no 'Compiled successfully' line" : null,
        pages === null
          ? "no 'Generating static pages (N/N)' line" : null,
        pages !== null && pages.done !== pages.total
          ? `only ${pages.done} of ${pages.total} pages finished` : null,
        prerenderErrors.length ? `${prerenderErrors.length} prerender failure(s)` : null,
        transcoded ? "route table glyphs were transcoded by the shell" : null,
      ]
        .filter(Boolean)
        .join("; ")
  );
  process.exit(2);
}

console.log("\nbuild is clean and the log covers the whole build.");

/*
 * `--show N` prints the last N lines with EVERY non-ASCII code point, so "the
 * parser found nothing" can be told apart from "the log has nothing", and so a
 * mojibake log (see the CP437 warning above) is visible instead of inferred.
 * Without this, every mismatch below would be a guess.
 */
const showAt = process.argv.indexOf("--show");
if (showAt !== -1) {
  const n = Number(process.argv[showAt + 1] || 30);
  console.log(`\n── last ${n} lines of the log ──`);
  for (const l of lines.slice(-n)) {
    const marks = [...l].filter((c) => c.codePointAt(0) > 0x7f);
    console.log(
      l.trimEnd() +
        (marks.length ? `      [${marks.map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase()).join(",")}]` : "")
    );
  }
}

process.exit(fatal.length + warnings.length > 0 ? 1 : 0);
