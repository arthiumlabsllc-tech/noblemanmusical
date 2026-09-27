// Run `next build` and capture its output as RAW BYTES, then report it.
//
//   node scripts/build.mjs                  -> writes build.log, prints the report
//   node scripts/build.mjs --keep build.log -> custom log path
//
// WHY THIS EXISTS INSTEAD OF `npm run build *> build.log`
// PowerShell does not hand the redirection operator the bytes the child wrote. It
// decodes the child's output through the console code page (437 on this machine)
// and re-encodes it as UTF-16LE. Next.js writes its route table as UTF-8 box
// glyphs — ○ static, ƒ dynamic — and each byte of those glyphs survives as a
// *different, printable* character. The result is a log that looks fine to a human
// and matches nothing in a parser: the route-table check reported "no dynamic
// routes" about a log whose dynamic markers had been transcoded into noise.
//
// That is the dangerous part: the failure mode is a clean report, not an error.
// Node's pipe carries the child's bytes untouched, so capture them here and never
// ask a shell to do it again.
//
// Exit code is Next's own exit code, so CI does not pass on a good report about a
// failed build.

import { spawnSync } from "node:child_process";
import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const argKeep = process.argv.indexOf("--keep");
const logPath = argKeep !== -1 ? process.argv[argKeep + 1] : "build.log";

/*
 * Resolve the local Next CLI and run it with this same node binary. Spawning
 * `next` by name needs a shell (it is a .cmd shim) and a PATH that knows about
 * node_modules\.bin, and a shell is exactly what corrupts the output above.
 * node + script path needs neither, and its stdout stays raw bytes.
 */
const nextBin = join(process.cwd(), "node_modules", "next", "dist", "bin", "next");
if (!existsSync(nextBin)) {
  console.error(`next CLI not found at ${nextBin} — is the project installed?`);
  process.exit(1);
}

console.log(`> next build   (capturing raw bytes to ${logPath})`);

const result = spawnSync(process.execPath, [nextBin, "build"], {
  encoding: "buffer",
  maxBuffer: 64 * 1024 * 1024,
});

if (result.error) {
  console.error(`failed to run next build: ${result.error.message}`);
  process.exit(1);
}

const out = Buffer.concat([result.stdout ?? Buffer.alloc(0), result.stderr ?? Buffer.alloc(0)]);
writeFileSync(logPath, out);

// Echo the real text so the human watching is not reading a parser's summary of it.
process.stdout.write(out);

console.log(`\nnext build exited with code ${result.status}`);
console.log(`log written: ${logPath} (${out.length} bytes)\n`);

const check = spawnSync(process.execPath, ["scripts/check-build.mjs", logPath], {
  encoding: "utf8",
});
process.stdout.write(check.stdout ?? "");
process.stderr.write(check.stderr ?? "");

// Report failures, but never let a clean-looking report outrank a failed build.
process.exit(result.status !== 0 ? result.status : (check.status ?? 1));
