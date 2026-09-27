# scripts/

Verification and audit tooling for this repo. **Zero npm dependencies** — Node 24
plus a locally installed Chrome is the whole requirement list. Nothing here runs
in the browser bundle or the app runtime.

```
cdp.mjs             shared headless-Chrome driver (CDP over WebSocket)
build.mjs           run `next build`, capturing RAW BYTES, then report it
check-build.mjs     parse a build log and refuse to certify an unreadable one
verify-item3.mjs    navbar regression suite (Phase 23 Sub-Phase A item 3)
verify-item4.mjs    footer + newsletter regression suite (item 4)
audit.mjs           reference / link / env audits that cannot lie by silence
```

## Before anything else: start a server

These tools measure a **production build**, not the dev server. Dev-mode layout
differs (Turbopack, no prerendered HTML), so a green run against `next dev` is
not the same claim.

```powershell
node scripts/build.mjs          # builds, writes build.log, prints the report
npx next start --port 3010      # the default --base for everything below
```

## The whole battery, in order

This is the "`scripts/audit.sh`" of it — six commands, no new wrapper to maintain
or to fail quietly. Run them in this order against a production server; each prints
its own denominator.

```powershell
node scripts/build.mjs                          # exit 0 clean, 1 findings, 2 untrustworthy log
node scripts/verify-item3.mjs                   # exit = failed check count
node scripts/verify-item4.mjs                   # same, + docs/screenshots/**/verification.txt
node scripts/audit.mjs links --allow /brands,/careers
node scripts/audit.mjs todos
node scripts/audit.mjs size 300
```

`--allow` on `links` is the sanctioned-404 list: `/brands` (Sub-Phase E) and
`/careers` (footer, phase-23-future). Anything else that 404s is a finding. Read
`todos` output as an inventory of what the site is promising — every tag there has
to be either fixed or still deliberately open.

## Running them from PowerShell: how to capture output without lying

`node scripts/verify-item4.mjs > out.txt 2>&1` **does not work here.** It creates
`out.txt` at 0 bytes, the child never runs, and `$LASTEXITCODE` comes back *empty*
— which prints as nothing and reads as success. Two runs were lost to it before the
artifact gap was noticed. Let the script write its own file where possible
(`verify-item4.mjs` appends `verification.txt` and ends with `exit N`); otherwise:

```powershell
$p = Start-Process -FilePath node -ArgumentList "scripts\verify-item4.mjs" `
     -WindowStyle Hidden -RedirectStandardOutput out.txt -PassThru -Wait
"exit=$($p.ExitCode)"          # empty means the process never ran — that is a failure
(Get-Item out.txt).Length      # 0 bytes means the same thing
```

Never conclude absence from one probe either: `Get-NetTCPConnection -LocalPort 3010`
reported "no listener" while the server was up and answering. Confirm with a second,
different check (`Get-CimInstance Win32_Process`, or an actual HTTP request).

## build.mjs / check-build.mjs — why not `npm run build *> build.log`

Because that command produced a **false clean**. PowerShell decodes the child's
output through the console code page (437 here) and re-encodes it as UTF-16, so
Next's route-table glyphs — `○` static, `ƒ` dynamic — survive as printable noise.
A parser reading that log finds no dynamic routes and reports a clean table about
a build that said something else. `build.mjs` spawns the local Next CLI with node
and pipes the bytes untouched.

`check-build.mjs` then refuses to certify a log it cannot believe: it requires
`Compiled successfully`, requires the *final* `Generating static pages (N/N)`
tick (matching the first one reported `0/85`), reports every count with its
matched lines, lists non-prerendered routes for confirmation, and exits 2 when the
log is partial or transcoded. Exit 0 clean, 1 findings, 2 untrustworthy.

## verify-item4.mjs — footer + newsletter regression suite

```powershell
node scripts/verify-item4.mjs                        # -> http://localhost:3010
node scripts/verify-item4.mjs --base http://localhost:3000 --port 9350
```

44 checks keyed to the item-4 review list: all 24 footer link targets resolve
(with `/careers` as the one sanctioned 404, and it must carry `data-todo` or it is
just a dead link), social icons named and `aria-hidden`, payment badges as real
text rather than blank images, the footer contributing zero duplicate trust
messaging, measured WCAG contrast on every footer text node, newsletter form
semantics and submit behaviour, and clearance against the fixed tab bar both with
and without the cookie banner up.

It prints a `NOT VERIFIED BY THIS SUITE` block for the two review items it cannot
measure (newsletter delivery, Lighthouse) rather than leaving them out and
implying they passed.

## verify-item3.mjs — navbar regression suite

```powershell
node scripts/verify-item3.mjs                          # -> http://localhost:3010
node scripts/verify-item3.mjs --base http://localhost:3000 --out docs/screenshots/phase-23-item-3
```

46 checks across 1440 / 1024 / 768 / 375, writing numbered PNGs and printing a
PASS/FAIL checklist. **Exit code = number of failed checks.** Exit 2 means the
harness itself crashed — that is deliberately distinguishable, because a broken
test that reports "all passed" is worse than no test.

Covers the things that broke in practice:

- `1024 nav does not overflow` — the inline search field at `lg` pushed nav
  content to 1243px against 1009px available. The field is `xl` for that reason.
- `every drawer control is reachable (scrolled into view)` — raising the cookie
  banner to `z-[80]` put 6 of 16 drawer controls underneath it. The fix is
  measured clearance (`--consent-h`), and the check scrolls each control into
  view before hit-testing, because a control under a fixed overlay in a
  scrollable panel is *one scroll away*, not unreachable. Asserting against a
  static snapshot produced a false failure here.
- `Deals + Shop are in the prerendered HTML` — the `useSearchParams()` island
  must not drop links out of the static shell.

## audit.mjs — the false-negative tool

```powershell
node scripts/audit.mjs refs  "233244916034"    # search src/ for real
node scripts/audit.mjs size  300               # files over N lines
node scripts/audit.mjs todos                   # TODO(phase-*) / data-todo inventory
node scripts/audit.mjs links --allow /brands    # crawl sitemap, status every internal link
node scripts/audit.mjs env                     # env vars referenced but unset (values never printed)
```

Every subcommand prints `scanned N source files under src/; M of them are
UNTRACKED`. Read that line before believing a zero.

**Why this exists.** An audit of hardcoded phone numbers once concluded from
`git grep` that `product-detail.tsx` had no phone reference. It had four. `git
grep` searches only tracked files, and 19 files under `src/` have never been
committed, so it exited 1 with no output — indistinguishable from "no
references". The same shape of failure came from `Select-String -Path` treating
`[slug]` as a wildcard (empty result, exit 0) and from a shell-escaped `$` in a
`node -e` regex (matched zero files, reported "0 literals remaining"). Tools
that fail quietly look identical to tools that succeed. `audit.mjs` walks the
filesystem, always reports its denominator, and refuses to print "0 broken" when
the crawl produced nothing.

`size` and `env` exit 1 when they find anything. That is a finding, not a crash —
`size` currently reports 12 files over 300 lines and `env` reports 14 blank keys.

## cdp.mjs — writing a new suite

```js
import { launchChrome, makeReporter } from "./cdp.mjs";
const { cdp, dispose } = await launchChrome({ port: 9341 });
const { check, hygiene, summary } = makeReporter();

await cdp.goto("http://localhost:3010/");
await cdp.metrics(375, 812, true);
await cdp.clickText("Accept");                    // a real mouse event
const hit = await cdp.hitTestControls('footer a');
check("footer links are clickable", hit.occluded.length === 0, JSON.stringify(hit.occluded));
hygiene(cdp);
await dispose();
process.exit(summary());
```

Three rules, each learned from a measurement that looked like a product bug and
wasn't:

1. **Click for real.** `el.click()` / `el.focus()` do not reliably drive React
   handlers in headless. Use `clickSelector` / `clickText`.
2. **Settle stacking with `elementFromPoint`, not z-index arithmetic.**
   `topElementAt()` and `hitTestControls()` answer what a tap actually hits.
3. **Type at human cadence** (`type()` defaults to 200ms/key). Firing all keys in
   one tick outruns focus handoffs and timers.

A fourth, from item 4: **check what the viewport mode is doing to your pixels
before you invent an explanation for a number.** The mobile tab bar measured 66px
while `--tabbar-h` said 60px, and this suite's first write-up blamed "Chrome font
inflation". Measured: emulated and plain both report 66px at `scale: 1`, so the
height was real and the token was the bug. The two modes are now compared against
each other as a check of their own (`viewport emulation agrees about pixel
geometry`) — if they ever diverge, every pixel assertion after it is measuring the
emulator and it says so instead of quietly reporting the emulator's numbers. And
with `html { scroll-behavior: smooth }` in the page, reading rects right after
`scrollTo`/`scrollIntoView` returns pre-scroll geometry; nudge `scrollBehavior` to
`auto` and wait two frames first.

`launchChrome({ port })` uses an absolute temp profile — a relative
`--user-data-dir` fails with an error that reads like a Chrome bug. In a
sandboxed shell the spawn is blocked and the symptom is "Chrome did not expose a
debugger"; that is environmental, not a code fault.

## Artifacts

Screenshots go to `docs/screenshots/phase-23-item-N/`, **never** `.next/` —
builds delete `.next` and the evidence goes with it. Commit the PNGs you want the
review to be able to re-check. `verify-item4.mjs` also writes its own PASS/FAIL
report next to them as `verification.txt`, so the numbers and the pictures come
from the same run.

When a suite's shot numbering changes, **delete the old files**. The item-4 folder
briefly held `06-mobile-375-home.png` at 750px wide (an earlier `deviceScaleFactor: 2`
emulated pass) alongside the current `07-mobile-375-home.png` at 360 — two images of
"the same" screen, from different runs with different results, and nothing in the
folder said which was which. Sort by modified time when in doubt.

Which is also why the 375 PNGs are 360px wide: the pixel-measuring passes use a
plain window, not `mobile: true`, and headless Chrome's classic scrollbar takes
15px off the layout viewport. Media queries therefore see 360 — the narrower,
stricter case — and `verify-item4.mjs` prints that arithmetic instead of leaving
"360 vs 360" to look like a mis-set viewport.
