# Technical Debt

Tracked defects and deferred work surfaced during implementation. Each entry
states the user-visible impact, not just the code smell, so it can be
prioritised honestly.

---

## 1. Mobile drawer and mega menu fake modal semantics

**Found:** Phase 23 Sub-Phase A, item 1 (raised again in item 2).
**Severity:** Medium — assistive-tech users, not a visual bug.

The mobile navigation drawer sets `role="dialog"` + `aria-modal="true"`, but
nothing behind it is `inert` or `aria-hidden`. Screen-reader users can tab out
of the "modal" into page content that is visually covered, and the announcement
that the rest of the page is unavailable is false.

The desktop mega menu now uses the same overlay pattern (deliberately, so both
get fixed in one pass).

**Fix:** one shared `<Sheet>` primitive: `inert` on the background container, a
single focus trap, scroll lock, and `aria-modal` only when the background really
is unreachable. Both `Navbar`'s drawer and `MegaMenuPanel` consume it.

**Deferred to:** Sub-Phase F (global widgets). Decided in the item-3 review: not
launch-blocking, and building the `<Sheet>` primitive alongside the navbar work
would have been scope creep. The existing fake-modal pattern stays as-is until
the drawers are next touched.
**Markers:** `TODO(sub-phase-f)` in `src/components/layout/navbar.tsx`,
`src/components/layout/mega-menu.tsx`,
`src/components/layout/departments-accordion.tsx`.

---

## 2. `/brands` is linked before the route exists

**Found:** Phase 23 Sub-Phase A, item 2 (per approved decision #2).
**Severity:** Medium — a 404 for anyone who clicks it.

"Brands" now appears three times — the desktop nav row, the mega menu footer and
the mobile drawer — all pointing at `/brands`, which is created in Sub-Phase E.
Every other nav link resolves today. The 404 is deliberate: it fails loudly
rather than letting a silently broken route ship.

**Interim options** (pick one at Sub-Phase E, or earlier if it gets clicked):
- create the route now (brand data already exists via `getBrands()`), or
- hide the links behind a flag until the route lands.

No code change is needed at Sub-Phase E beyond creating the route: all three
links already derive their active state from the real pathname.

**Markers:** `TODO(phase-23-sub-e)` in `src/components/layout/navbar.tsx` and
`src/components/layout/mega-menu.tsx`, plus a `data-todo="phase-23-sub-e"` DOM
attribute on every Brands link so the three anchors are greppable from the
rendered HTML as well as from source.

---

## 3. Contact details were hardcoded in 21 places — RESOLVED

**Found:** Phase 23 Sub-Phase A, item 2 (decision #4 audit).
**Resolved:** Sub-Phase A, item 3 (spec 3.5).
**Severity was:** High if the number ever changes — and one live display bug
already removed.

`SITE.contact` (`src/lib/seo/config.ts`) was the intended source of truth, but the
number was repeated literally across marketing pages, email templates, PDP and
checkout — 19 files carrying `wa.me` hrefs, display strings, `tel:` hrefs or input
placeholders. Ten of the digit-bearing lines wrapped them in their own
`process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233244916034"` env fallback (counted
across the tracked files alone — untracked files have no git baseline); the rest
were bare literals with no env read at all, so moving the number in `.env`
reached only some of them.

Two separate WhatsApp link builders also existed (`lib/utils.ts` `whatsappUrl()`
and `lib/whatsapp/client.ts`) with independent fallbacks, so they could drift.

**Now:** `src/lib/config.ts` is the only module that reads
`NEXT_PUBLIC_WHATSAPP_NUMBER`, and `src/lib/whatsapp/build-url.ts` is the only
place that assembles a `wa.me` URL.

| Export | Role |
| --- | --- |
| `WHATSAPP_NUMBER` | digits only; the single env read |
| `formatPhoneDisplay()` | groups a Ghanaian number, falls back to raw international form |
| `PHONE_DISPLAY` | visible text and JSON-LD `telephone`; derived, so it cannot disagree with the digits |
| `PHONE_TEL_HREF` | `tel:` href built from the same digits |
| `PHONE_INPUT_EXAMPLE` | placeholder format hint |

`whatsappUrl()` is deleted; `whatsappOrderLink()` and `whatsappLink()` delegate to
`buildWhatsAppUrl()`. `SITE.contact.phone` / `.whatsapp` re-export from config.

**Deliberate exception:** `PHONE_INPUT_EXAMPLE` is a *format hint for the
customer's own number* in four `placeholder` attributes (`register`, `checkout`,
`contact`, `b2b-quote-form`). It is intentionally not derived from the business
line — moving the shop's number must not silently rewrite the example a shopper
is told to follow. It is a separate constant rather than `PHONE_DISPLAY` for
exactly that reason.

**Already fixed in item 2:** `app\(shop)\returns\page.tsx` printed
`NEXT_PUBLIC_WHATSAPP_NUMBER` directly, which stores digits only, so the page
rendered "WhatsApp: 233244916034" with no clickable link.

**Verification gotcha — why an audit of this must not use `git grep`:** part of
this repo has never been committed, so `git grep` silently searches a smaller
tree than the working directory and reports "no matches" (exit 1) for real code.
One item-2 audit used it and concluded that `product-detail.tsx` carried no phone
reference. It carried four: the `whatsappUrl()` call, its import, the `tel:`
href and the visible number beside it. Every reference count in this file was
therefore taken from a filesystem-wide scan of `src/`, and cross-checked against
the rendered HTML at `localhost:3010`, not from git.

### 3.1 The same class, catalogued (item 4)

The `git grep` incident is not a git problem. It is one instance of a shape: **a
tool that fails in a way that produces a clean-looking result.** Absence of output
is being read as absence of a problem. Item 4 hit eight more instances, all in the
verification layer, all of which reported "fine" while wrong:

| Silent failure | What it claimed | What was true | Durable fix |
| --- | --- | --- | --- |
| `next build *> build.log` through PowerShell | `route table markers: NONE PARSED` | PowerShell decoded Next's UTF-8 glyphs through code page 437 and re-wrote UTF-16; the log no longer said what the build said | `scripts/build.mjs` captures raw bytes from a pipe; `check-build.mjs` refuses to certify a transcoded log (exit 2) |
| Matching the first `Generating static pages (N/M)` | `static pages: 0/85` | It is a progress line, rewritten; the build generated 85 | `matchAll` + take the last tick + refuse unless `done === total` |
| Parsing `getComputedStyle().color` as RGB | footer text is `1.07:1`, an AA failure | Tailwind v4 emits `text-cream/70` as `color-mix(in oklab,…)`, so "r,g,b" were a lightness, a chroma and a hue. Real value: 8.46:1 | oklab/oklch conversion in `verify-item4.mjs`; unparseable colours are an error, not a score |
| Asserting on `fails.length` | `PASS … worst 99:1 ("undefined")` | The loop had skipped every element (one name-match bug), so it measured *nothing* | `seen >= 20` is asserted before anything is said about failures |
| `input.value = ''` in a test | the newsletter accepted a fresh address | React's value tracker kept the old state and the submit re-sent the previous case | clear with real `Backspace` key events, then assert the field holds exactly the new value |
| Reading rects after `scrollTo` | footer clearance `-5684px` | `html { scroll-behavior: smooth }` animates; the geometry read was pre-scroll | set `scrollBehavior = 'auto'` and wait two frames before measuring |
| `node script.mjs > out 2>&1` in this shell | an `out` file existed, so the run looked captured | **the child never ran at all** — 0-byte file, and `$LASTEXITCODE` came back *empty*, which PowerShell prints as nothing and reads as 0. Twice. A build and a whole suite were each "run" this way and did nothing | `Start-Process -FilePath node -ArgumentList … -RedirectStandardOutput … -Wait`, then `-PassThru`.ExitCode. Better still: let the script write its own artifact (`verify-item4.mjs` appends `verification.txt` and ends with `exit N`) |
| `Get-NetTCPConnection -LocalPort 3010` said "no listener" | the port was free, so the build could not be colliding with a server | a server was in fact listening (found with `Get-CimInstance Win32_Process`, and the port answered `200` afterwards) | treat a single-API "not found" as unproven; confirm with a second, different probe before concluding absence |

Two of these were written by this project's own tooling *while it was being built
to catch the others* — `check-build.mjs` produced the `0/85` number and
`verify-item4.mjs` invented a font-inflation story to explain a 66px tab bar that
was simply real. That is the argument for the three rules now baked into every
script here:

1. **Print the denominator.** "0 broken" is meaningless without "of N examined".
2. **Refuse rather than report.** A log without a terminal marker, a crawl that
   fetched nothing, a measurement loop that measured nothing — those exit 2, not
   exit 0.
3. **Prove the artifact, not the command.** An exit code and a file of the expected
   shape (non-empty, ending in the run's own terminal line) is the evidence. "The
   command returned nothing" is not — see rows 1, 7 and 8.

`node --check` and a real build are the authorities for parse status; the IDE's
problem panel re-reported removed imports twice during item 4 and is not.

---

## 4. The `--z-*` design tokens generate no CSS

**Found:** Phase 23 Sub-Phase A, item 2 (proved against built CSS).
**Severity:** Medium — silent, because the values look centralised.

`globals.css` declares `--z-navbar: 50`, `--z-overlay: 60`, `--z-modal: 70`,
`--z-toast: 80`. Tailwind v4 has no `--z-*` theme namespace, so a class like
`z-navbar` compiles to nothing and the element silently falls back to
`z-index: auto`. The built stylesheet contains zero `.z-navbar` rules; components
use literals (`z-50`, `z-[60]`) that do not track the tokens.

Only `--z-drawer` is wired correctly today, via `z-[var(--z-drawer)]`.

**Fix:** either migrate the scale into `@theme` as real utilities, or delete the
dead custom properties so nobody trusts them.

---

## 5. Shop grids are absent from server-rendered HTML

**Found:** Phase 23 Sub-Phase A, item 2 — while trying to verify filter counts.
**Severity:** High for SEO and first visit.

Measured from `next start` on the production build, counting `href="/product/`
anchors in the delivered HTML:

| Page | product anchors | `application/ld+json` blocks |
| --- | --- | --- |
| `/` | 8 | 2 |
| `/product/yamaha-c40-classical-guitar` | 4 | 4 |
| `/shop` | **0** | 2 |
| `/shop/guitars` | **0** | 4 (16 product refs) |

Cause: `ShopContent` reads `useSearchParams()` and sits inside `<Suspense>`, so
for a statically generated page React ships the fallback and renders the grid
only after client hydration. `/shop/guitars` therefore emits **zero** product
links in HTML while its JSON-LD `itemListElement` advertises eight — the
structured data describes content that is not in the document. Anything without
JavaScript (and some crawlers' first pass) sees an empty category page, and LCP
on every listing page waits on hydration.

Not introduced by item 2 — `ShopContent` used `useSearchParams` before it — but
the mega menu raises the stakes because sub-category links point into it.

**Fix:** make the URL the single source of truth on the server: read
`searchParams` in `page.tsx` (a Promise in Next 15), pass the resolved filter
state to `ShopContent` as props, and let filter widgets change the URL rather
than read it. This is the same work Sub-Phase B/C already scopes as "URL-synced
filters", so it should be fixed there rather than as a side quest.

---

## 6. `text-gold-dark` on light backgrounds is below WCAG AA

**Found:** Phase 23 Sub-Phase A, item 2 (measured, not estimated).
**Severity:** Medium — legibility of prices, links and counts.

Relative-luminance ratios against the two light surfaces in use:

| Foreground | on cream `#F5F0E6` | on white | AA body (4.5) |
| --- | --- | --- | --- |
| `gold` `#D4AF37` | 1.85 | 2.10 | fail |
| `gold-dark` `#B8962E` | 2.49 | 2.82 | fail |
| `bronze` `#B08D57` | 2.72 | 3.09 | fail |
| `charcoal/60` | 4.35 | — | fail (narrowly) |
| `charcoal/70` | 6.05 | — | pass |
| `navy` `#0B1B3B` | 14.98 | 17.02 | pass |

Existing instances (pre-date this phase), e.g. `src/components/product/shop-filters.tsx`
uses `text-gold-dark` for the active category on a white card.

Rule applied in new code: **gold is for surfaces, borders and underlines; text
on cream/white is navy-family.** On navy backgrounds gold is excellent
(9.07:1), so the dark chrome is unchanged.

**Fix:** audit `text-gold-dark` / `text-charcoal/40` / `text-charcoal/50` on
light surfaces and move them to `text-navy-deep` or `text-charcoal/70`, keeping
gold as an underline, border or badge fill.

---

## 7. Seed product images are remote placeholders that rot

**Found:** Phase 23 Sub-Phase A, item 2 — the mega menu's featured card rendered
an empty box.
**Severity:** High — a product with a dead image looks broken, not merely
unpolished.

`src/lib/data/products.ts` points `images[]` at Unsplash. A `HEAD` request per
distinct URL found **3 of 15 returning 404**, affecting **7 of 36 products**
(19% of the catalogue):

| Dead URL | Products blanked |
| --- | --- |
| `photo-1543443374-…` | Pearl Export kit, Vic Firth 5A, Talking Drum, Atenteben Flute |
| `photo-1550985543-…` | Cort Earth 70 |
| `photo-1556449895-…` | Ibanez GRG121DX, Epiphone Les Paul Standard |

Replaced with live URLs of the same instrument class (verified `200`). Nothing
in the build or the page warns you when one of these dies — it fails at runtime
in the browser only.

**Structural fix:** the Cloudinary pipeline removes the external dependency
entirely. Until then, re-run a `HEAD` check over the distinct image URLs before
each release.

---

## 8. Bottom overlays painted over the open mobile drawer — RESOLVED

**Found:** Phase 23 Sub-Phase A, item 2 — `document.elementFromPoint()` inside
the open drawer returned the cookie banner, not the drawer.
**Resolved:** Sub-Phase A, item 3 (spec 3.4).
**Severity was:** Medium — on a first visit the banner covered the last department
links, which is exactly when a new shopper is most likely to open the menu.

The drawer sits at `--z-drawer: 45` (item 1), deliberately below the navbar so
its close button stays clickable. But two other layers sat above it:

```
before                        after
cookie consent   z-[60]  ->   z-[80]   <- consent is now always visible
mobile tab bar   z-50              <- worked around with pb-24, unchanged
drawer           z-45              <- unchanged
navbar           z-50              <- intentional, unchanged
```

The tab bar was already patched with `pb-24` padding rather than a z-index fix;
the cookie banner had no such clearance.

**Fix applied:** the banner moved to `z-[80]`, above every other layer in the
scale. That is the correct resolution rather than a stacking trick, because a
consent request the visitor cannot see is not a consent request — it is a legal
requirement that it is visible above all content. The drawer stays at 45, below
the navbar, so its close button keeps working.

**Constraint for future work:** nothing may claim `z-[80]` or higher except
consent and toasts. Raising `--z-drawer` past 50 still breaks the navbar close
button.

---

## 9. Four 40px icon targets in the drawer's footer row

**Found:** Phase 23 Sub-Phase A, item 2 — measured during the accordion work.
**Severity:** Low — pre-existing chrome, not introduced by the accordion.

The drawer's bottom row exposes Search, Wishlist, Cart and Account as
`p-2` wrapped `h-6 w-6` icons. That computes to a **40px** tap target, below the
44px the rest of this drawer's rows were held to in item 2 (and below WCAG
2.5.5's 44px and Material's 48px).

They are also duplicated: Search, Cart and Account already appear in the always-
visible navbar above the drawer, so a tap that misses one of these lands
somewhere else entirely.

**Fix:** raise the padding to `p-2.5` (44px) or drop the row and let the navbar
carry those three, keeping only Wishlist. Decide with Sub-Phase F's global widget
work, since the tab bar and drawer footer overlap in the same region.

**Deferred to:** Sub-Phase F (global widgets). Not launch-blocking.
**Marker:** none — this is a sizing constant inside the drawer's footer, see the
`flex items-center justify-center gap-6 border-t` row in
`src/components/layout/navbar.tsx`.

---

## 10. A working instant-results search component is dead code

**Found:** Phase 23 Sub-Phase A, item 3 — while extracting `<NavbarSearch />`.
**Severity:** Medium — the feature exists and is thrown away.

The item-3 spec said "the overlay's instant results, recent searches, trending
all still work as-is". Measured against the code, none of them do: the navbar
overlay has always been a single bare input that navigates to `/search?q=` on
Enter. There is no instant-results dropdown, no recent searches and no trending
list anywhere in the navbar.

They exist in `src/components/search/search-bar.tsx` — 220 lines of 300ms
debounced `/api/search` fetching, arrow-key `activeIndex` navigation, "View all
{total} results", outside-click close and full `combobox` / `aria-controls` /
`aria-activedescendant` wiring. A filesystem-wide scan finds **no importer**: it
is dead code. It is also styled for a light surface (white background,
`text-charcoal`), so mounting it on the dark navbar as-is would fail contrast.

**Fix:** render `<SearchBar />` inside `SearchOverlay` (adapted for the dark
surface) instead of the bare input. That gives item 3's "typing shows results"
intent real behaviour, reuses the one `/api/search` client that already exists,
and deletes nothing. Left out of item 3 deliberately — the spec asked to reuse
existing overlay logic, not to build a results UI.

**Note:** `search/page.tsx` already fetches `/api/search`, so the endpoint and
its types are live; only the component is orphaned.

---

## 11. Two navbar files are still over the 300-line limit

**Found:** Phase 23 Sub-Phase A, item 3 — measured after the search/NavLink
extractions, when re-checking the standing "split components >300 lines" rule.
**Severity:** Medium — maintainability, no user-visible impact today.

Item 3 pulled `navbar.tsx` from 424 lines to 360 by extracting
`nav-link.tsx` (66), `deals-nav-link.tsx` (109) and `navbar-search.tsx` (213),
but 360 still breaks the rule. `mega-menu.tsx` is 456 (item 2).

The remaining bulk of `navbar.tsx` is the mobile drawer's JSX plus its open
state, scroll lock and `mobileMenuRef` — roughly 95 lines that want to become
`<MobileDrawer />`. That extraction is deliberately *not* done here: Sub-Phase F
moves this same state into the shared `<Sheet>` primitive (debt #1), so splitting
now means rewriting the split twice.

**Plan:** extract `<MobileDrawer />` and `<MegaMenuPanel />`'s footer as part of
the debt-#1 `<Sheet>` work, so both land under 300 in one pass.

**Context, not an excuse:** 10 other files already exceed 300 lines
(`lib/data/products.ts` 747, `lib/db/seed.ts` 725, `lib/admin/actions.ts` 608,
`lib/db/schema.ts` 546, `components/admin/image-upload.tsx` 428, checkout page
331, `lib/account/actions.ts` 331, `admin/products/new` 330,
`product-detail.tsx` 325, `home/hero.tsx` 314). Data and schema modules are
naturally long; the component ones are the same kind of debt as these two.

---

## 12. The newsletter is wired end to end and cannot store or send anything

**Found:** Phase 23 Sub-Phase A, item 4 — while trying to satisfy review check #2,
"send a test email, confirm it arrives".
**Severity:** High for the feature, and a warning for the whole environment. It is
not a code defect: the write path is complete, correct and unreachable.

`<FooterNewsletter />` posts to `subscribeToNewsletter`
(`src/lib/newsletter/actions.ts`), which validates with zod, rate-limits by
`x-forwarded-for`, upserts into `subscribers` and only then sends
`NewsletterWelcome`. The last two steps cannot execute here, for two independent
reasons:

**1. The connected database has no tables.** Two probes agree:

```
connected to: neondb | PostgreSQL 18.6
pg_tables(public): 0
to_regclass(subscribers) -> NULL      to_regclass(users)    -> NULL
to_regclass(orders)      -> NULL      to_regclass(products) -> NULL
to_regclass(sessions)    -> NULL
```

A `count(*)` over `pg_tables` plus a per-table `to_regclass` is the second probe on
purpose: one query returning zero rows is also what a schema/permissions artifact
looks like. It is not one — nothing in `public` exists.

This is invisible in normal use because **every storefront page reads the static
seed modules in `src/lib/data/`, not the database.** The site renders 85 pages,
the build is clean, the catalogue is full, and accounts, orders, admin, coupons,
abandoned-cart recovery and the newsletter are all dead. `next build` does not
notice either. Only a submission surfaces it.

**2. `RESEND_API_KEY` is blank.** `src/lib/email/client.ts` treats empty the same
as absent, warns once at boot (`RESEND_API_KEY is not set — emails will not be
sent.`) and returns an error object for every send. Even with tables present, no
mail would leave this environment.

**Fix — operator actions, deliberately not taken by me:** `npm run db:push` creates
the schema from `src/lib/db/schema.ts`, but `DATABASE_URL` points at the
**production** Neon project, so pushing is a deploy decision (standing rule:
propose before schema changes). Then a real `RESEND_API_KEY` plus a verified
`EMAIL_FROM` domain. Steps and the verification queries are now written into
`docs/ENV_SETUP.md` §1 and §7.

**What item 4 did instead:** made the failure honest rather than theatrical. The
shopper sees "We couldn't sign you up just now. Please try again, or reach us on
WhatsApp and we'll add you.", the server logs
`[newsletter] subscribe failed: …`, and `verify-item4.mjs` asserts that a success
message appears *only* when the server granted it. Review check #2 is printed
under `NOT VERIFIED BY THIS SUITE` instead of being quietly dropped from the list.
**Marker:** `TODO(phase-23-newsletter)` in `src/lib/newsletter/actions.ts`.

---

## 13. Item-4 decisions that need a sign-off

Not defects — judgement calls where §5.1 of the spec and the current codebase
disagree, or where the spec's wording would have shipped something unverifiable.
Each is deliberately reversible.

| Decision | Why it was made | To reverse it |
| --- | --- | --- |
| **Press, FAQ and Affiliate are not linked at all.** §5.1 marks FAQ and Affiliate `[placeholder]` and lists Press outright. | A footer link to a 404 is worse than a missing link, and only `/careers` is allowlisted (it is the one the spec names as a placeholder *and* the review calls out by name). The links live in `src/lib/data/footer-nav.ts`, so each is a one-line addition once a route exists. | Add the entry; `audit.mjs links` will start reporting it. |
| **Payment badges are real text, not card images.** Review item 6 was "payment badges have alt text — don't ship blank images". | Visa/Mastercard/Paystack/MTN logos are not assets in this repo, so image tags would have meant either blank boxes or hotlinked trademarked art. A `<ul>` of four names has accessible names by construction, paints instantly, costs no requests and cannot rot. Measured: `0 <img>` in the payment row. | Drop in licensed SVGs with `alt="Visa"` etc. and keep the list markup. |
| **Social URLs are derived from one handle, and are marked unconfirmed.** | The only verified identity in the app is the configured WhatsApp number (`src/lib/config.ts`). Instagram/Facebook/YouTube handles were never supplied, so `SOCIAL_PROFILES` in `src/lib/seo/config.ts` builds all four URLs from a single `SOCIAL_HANDLE = "noblemanmusical"` and `<FooterConnect />` marks the row `data-todo="confirm-social-profiles"`. The handle is also **not** in `SITE.sameAs`, because JSON-LD asserting ownership of someone else's page is a bigger mistake than a link that may 404. | Change `SOCIAL_HANDLE` (or split it per network), delete the marker, add to `sameAs` — and update `verify-item4.mjs`, which scopes that check with `footer ul[data-todo="confirm-social-profiles"]`. It fails loudly ("no social row") rather than silently skipping, which is intentional: the footer's accessibility evidence should be re-read the moment its provenance changes. |
| **The homepage `<NewsletterCTA />` was wired to the same server action** (reported as a deviation). | It was a fake: `setSubmitted(true)` with no write. Leaving it fake next to a real footer form is the same lie in two places. | It is now two live forms. **Open question for Sub-Phase B:** keep both (different `source` values, so the list can tell them apart) or make the footer the only signup and revert the homepage block to a link to it. |
| **The footer carries no trust strip.** §5.1 does not ask for one; it specifies social + payment rows in column 1. | Review item 3 warns against duplicate trust messaging, so "nothing in the footer" was verified rather than assumed: measured per region, the footer contributes **0** copies of "Official Warranty", "Nationwide Delivery" and "Pay on Delivery in Accra". | Sub-Phase B item 11 decides where the strip lives. |
| **`sendWelcome` still has no importer.** | Pre-existing dead code (account-signup email), untouched by item 4, listed here so it is not mistaken for a new orphan. `sendNewsletterWelcome` — the one item 4 added — *is* wired. | Delete it, or call it from account creation. |

**Related pre-existing duplication, for the record:** at desktop widths those three
claims appear twice on the homepage — once in the utility bar (`hidden lg:flex`, so
it is `display: none` below 1024px) and once in `<Hero />`. On a phone only the
hero copy paints, so nothing looked wrong; the measured DOM tally at 1440 is 1 in
the utility bar region + 1 in page content. Item 4 neither caused nor fixed it.
`top-utility-bar.tsx` used to comment that a "trust strip above the footer" carried
these on small screens, which was never true, and that comment now says what really
is the case. Fixing the duplication is Sub-Phase B item 11's decision, not a footer
edit.

---

## 14. Fixed-chrome heights are hand-maintained duplicates

**Found:** Phase 23 Sub-Phase A, item 4 — the mobile tab bar measured 66px while
`--tabbar-h` said 60px. (The token is this phase's own work, not legacy: `git show
HEAD:src/styles/globals.css` has 207 lines and zero occurrences of `tabbar-h` or
`pb-chrome`, cross-checked against positive matches for `@theme` and `--color-navy`
in the same blob so the zero means something.)
**Severity:** Medium — the arithmetic is easy to get wrong and nothing notices.

Bottom chrome is declared twice: as Tailwind padding on the component and as the
CSS custom property pages clear themselves with (`.pb-chrome`,
`calc(var(--tabbar-h) + env(safe-area-inset-bottom))`). Nothing derives one from
the other, so changing a tab's `py-1.5` silently moves the bar and leaves the token
behind. `globals.css` is labelled "SINGLE SOURCE OF TRUTH" and its own first
paragraph concedes the duplication ("Navbar.tsx must keep its Tailwind height
classes in sync with these values") — that line is the debt, written as an
instruction.

The guess was 60px against a real 66px. That is 6px of footer clearance eaten, not
(yet) an occlusion: the legal row still hit-tested clear of the bar, so no bug was
observed. The reason to fix it is that the number was *derived by rounding up a
feeling* — and the correct value is not the obvious arithmetic either. 66px is
`1px top border + 8+8px row padding + a 49px tab`, and the tab is 49 because its
own `py-1.5` sits inside a 44px `min-h`. `44 + 16 + 1 = 61` is the number you get
without measuring, and it is still 5px short.

**Current mitigation:** `verify-item4.mjs` measures the bar, asserts
`--tabbar-h` equals border + row padding + tab height, and hit-tests each legal
link at max scroll with the cookie banner both up and dismissed. Drift now fails a
check instead of quietly narrowing the gap.

**Structural fix (unowned):** derive the clearance instead of duplicating it —
publish the height from the component the way `<CookieConsent />` already publishes
`--consent-h` from its measured rect, or move bottom chrome into a grid row on
`body` so overlap is impossible by construction. `--consent-h` is the proof the
pattern works here; the tab bar just predates it. Fold into Sub-Phase F's global
widget work, where the tab bar and drawer footer are being reconciled anyway
(see #9).
