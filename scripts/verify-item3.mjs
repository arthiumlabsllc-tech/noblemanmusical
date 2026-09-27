// Phase 23 Sub-Phase A, item 3 — navbar regression suite.
//
//   node scripts/verify-item3.mjs --base http://localhost:3010
//
// Covers: 3.1 Deals link + query-param active state, 3.2 Brands placeholder,
// 3.3 inline search field + overlay handoff, 3.4 cookie-banner stacking vs the
// mobile drawer, and the responsive budget at 1440 / 1024 / 768 / 375.
//
// Two checks exist because a real defect shipped first:
//   - "1024 nav does not overflow" — with the inline field at lg, nav content
//     measured 1243px against 1009px available. The field moved to xl.
//   - "every drawer control is reachable" — raising the banner to z-[80] pushed
//     6 of 16 drawer controls underneath it. Fixed with measured clearance
//     padding (--consent-h), which is why this check scrolls each control into
//     view before hit-testing instead of sampling a static snapshot.
//
// Exit code = number of failures.

import { launchChrome, makeReporter } from "./cdp.mjs";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? fallback : argv[i + 1];
};
const BASE = arg("base", "http://localhost:3010");
const OUT = join(
  process.cwd(),
  arg("out", "docs/screenshots/phase-23-item-3")
);
const PORT = Number(arg("port", 9340));

mkdirSync(OUT, { recursive: true });
const { check, info, hygiene, summary } = makeReporter();

const NAV = `nav[aria-label="Main"]`;
const GOLD = "rgb(212, 175, 55)";

let session;
try {
  session = await launchChrome({ port: PORT });
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
const { cdp, dispose } = session;

/*
 * A crash must not look like a passing run, and it must not look like a list of
 * failed checks either. Exit 2 means "the harness broke"; exit N means "N checks
 * failed". Without this an exception mid-suite would print whatever passed so
 * far and exit 0 on some paths.
 */
process.on("uncaughtException", (e) => {
  console.error("\nSUITE CRASHED (exit 2, harness fault):");
  console.error(e?.stack || String(e));
  try {
    session.chrome.kill();
  } catch {
    /* already gone */
  }
  process.exit(2);
});

/* ── 1440: nav row, Deals, Brands, inline search ─────────── */
await cdp.goto(`${BASE}/`);
await cdp.metrics(1440, 900);

const nav = await cdp.evaluate(`(()=>{
  const nav=document.querySelector(${JSON.stringify(NAV)});
  const links=[...nav.querySelectorAll('a')].map(a=>({
    text:(a.textContent||'').trim().slice(0,20),
    href:a.getAttribute('href'),
    current:a.getAttribute('aria-current'),
    color:getComputedStyle(a).color,
    todo:a.getAttribute('data-todo')}));
  return {scrollW:nav.scrollWidth,clientW:nav.clientWidth,links,
    inline:!!document.querySelector('input[inputmode="search"]'),
    departments:[...nav.querySelectorAll('button')]
      .some(b=>/Departments/.test(b.textContent||''))};
})()`);

check("1440 nav does not overflow", nav.scrollW <= nav.clientW, `scrollW=${nav.scrollW} clientW=${nav.clientW}`);
const labels = nav.links.map((l) => l.text).filter(Boolean).join(",");
check("1440 nav order is Home,Deals,Shop,Brands,About,Contact",
  labels === "Home,Deals,Shop,Brands,About,Contact" && nav.departments,
  labels + ` departmentsTrigger=${nav.departments}`);

const deals = nav.links.find((l) => l.text === "Deals");
const brands = nav.links.find((l) => l.text === "Brands");
check("Deals href is the real filter", deals?.href === "/shop?deals=true", String(deals?.href));
check("Deals is gold", deals?.color === GOLD, String(deals?.color));
check("Brands href", brands?.href === "/brands", String(brands?.href));
check("Brands data-todo is greppable", brands?.todo === "phase-23-sub-e", String(brands?.todo));
check("inline search present at 1440", nav.inline === true);

const rest = await cdp.boxOf('input[inputmode="search"]');
check("inline search is 240px at rest", rest?.w === 240, JSON.stringify(rest));
await cdp.shot("01-desktop-1440", OUT);

/* focus → 320px, via a genuine click (see cdp.mjs header note #1) */
await cdp.clickSelector('input[inputmode="search"]');
const focused = await cdp.evaluate(`(()=>{const i=document.querySelector('input[inputmode="search"]');
  return {w:Math.round(i.getBoundingClientRect().width),active:document.activeElement===i,
          ring:getComputedStyle(i).boxShadow.slice(0,40)};})()`);
check("inline search expands to 320px on focus", focused.w === 320 && focused.active, JSON.stringify(focused));
await cdp.shot("02-search-focused", OUT);

/* typing hands off to the overlay, pre-filled, at human cadence */
await cdp.type("guit", 200);
await new Promise((r) => setTimeout(r, 900));
const overlay = await cdp.evaluate(`(()=>{
  const i=document.querySelector('input[placeholder="Search instruments..."]');
  const o=i?i.closest('div.fixed.inset-0'):null;
  return {open:!!o,value:i?i.value:null,z:o?getComputedStyle(o).zIndex:null,
          focused:!!(i&&document.activeElement===i)};})()`);
check("typing opens the overlay", overlay.open === true, JSON.stringify(overlay));
check("the whole query reaches the overlay", overlay.value === "guit", JSON.stringify(overlay));
check("overlay sits above page content", overlay.z === "60", String(overlay.z));
await cdp.shot("03-overlay-prefilled", OUT);

await cdp.evaluate(`document.querySelector('input[placeholder="Search instruments..."]').focus()`);
await cdp.key("Escape", "Escape");
await new Promise((r) => setTimeout(r, 700));
const afterEsc = await cdp.evaluate(`(()=>({
  overlayGone:!document.querySelector('input[placeholder="Search instruments..."]'),
  w:(()=>{const i=document.querySelector('input[inputmode="search"]');
       return i?Math.round(i.getBoundingClientRect().width):null})(),
  v:(()=>{const i=document.querySelector('input[inputmode="search"]');
       return i?i.value:null})()}))()`);
check("Escape closes the overlay", afterEsc.overlayGone === true, JSON.stringify(afterEsc));
check("inline search collapses back to 240px", afterEsc.w === 240, JSON.stringify(afterEsc));
/* Only the first keystroke is ever typed into the inline field, so on close it
   must adopt the overlay's text — otherwise it shows a stale one-character query. */
check("inline field adopts the overlay's final query", afterEsc.v === "guit", JSON.stringify(afterEsc));

await cdp.key("k", "KeyK", 2);
await new Promise((r) => setTimeout(r, 700));
const cmdK = await cdp.evaluate(`!!document.querySelector('input[placeholder="Search instruments..."]')`);
check("Ctrl+K opens the overlay from anywhere", cmdK === true, String(cmdK));
await cdp.key("Escape", "Escape");

/* ── 3.1 active state, and the clear-chip round trip ─────── */
await cdp.goto(`${BASE}/shop?deals=true`);
await cdp.metrics(1440, 900);
const active = await cdp.evaluate(`(()=>{
  const nav=document.querySelector(${JSON.stringify(NAV)});const out={};
  for(const a of nav.querySelectorAll('a')){
    const t=(a.textContent||'').trim().slice(0,20);
    const s=a.querySelector('span[aria-hidden="true"]');
    out[t]={current:a.getAttribute('aria-current'),
      // visible underline width: 0 parked, 24 drawn. Measuring the rect beats
      // parsing the computed transform scale.
      lineW:s?Math.round(s.getBoundingClientRect().width):null,
      color:getComputedStyle(a).color};}
  return out;})()`);
check("Deals is aria-current on ?deals=true", active.Deals?.current === "page", JSON.stringify(active.Deals));
check("Deals underline is held open", active.Deals?.lineW > 20, `lineW=${active.Deals?.lineW}`);
check("Deals stays gold while active", active.Deals?.color === GOLD, String(active.Deals?.color));
check("Shop underline yields to Deals", active.Shop?.lineW === 0, `Shop lineW=${active.Shop?.lineW}`);
check("Shop is not aria-current while Deals is", active.Shop?.current === null, String(active.Shop?.current));
await cdp.shot("04-deals-active", OUT);

const chip = await cdp.centerOfText("On sale only", "button");
check("deals filter chip is present", !!chip, JSON.stringify(chip));
if (chip) {
  await cdp.click(chip.x, chip.y, 1200);
  const cleared = await cdp.evaluate(`(()=>{
    const nav=document.querySelector(${JSON.stringify(NAV)});
    const pick=(t)=>[...nav.querySelectorAll('a')].find(a=>(a.textContent||'').trim()===t);
    const d=pick('Deals'),s=pick('Shop');
    return {search:location.search,
      dealsCurrent:d.getAttribute('aria-current'),
      dealsLineW:Math.round(d.querySelector('span[aria-hidden]').getBoundingClientRect().width),
      shopCurrent:s.getAttribute('aria-current'),
      shopLineW:Math.round(s.querySelector('span[aria-hidden]').getBoundingClientRect().width)};})()`);
  check("clearing the chip drops Deals active state",
    cleared.dealsCurrent === null && cleared.dealsLineW === 0, JSON.stringify(cleared));
  /* Query-only navigation: pathname never changed, so this is the round trip
     that an optimistic pathname-based active state would have failed. */
  check("Shop becomes active again once deals is cleared",
    cleared.shopCurrent === "page" && cleared.shopLineW > 20, JSON.stringify(cleared));
  await cdp.shot("05-after-clear-chip", OUT);
}

/* ── 1024: the width that clipped ────────────────────────── */
await cdp.goto(`${BASE}/`);
await cdp.metrics(1024, 768);
const w1024 = await cdp.evaluate(`(()=>{const nav=document.querySelector(${JSON.stringify(NAV)});
  const i=document.querySelector('input[inputmode="search"]');
  const icons=[...nav.querySelectorAll('button[aria-label="Search products"]')]
    .filter(b=>b.getBoundingClientRect().width>0).length;
  return {scrollW:nav.scrollWidth,clientW:nav.clientWidth,
    inlineVisible:!!i&&i.getBoundingClientRect().width>0,icons,
    labels:[...nav.querySelectorAll('a')].map(a=>(a.textContent||'').trim()).filter(Boolean).join(",")};})()`);
check("1024 nav does not overflow", w1024.scrollW <= w1024.clientW, JSON.stringify(w1024));
check("1024 keeps every nav item", w1024.labels === "Home,Deals,Shop,Brands,About,Contact", w1024.labels);
check("1024 falls back to icon-only search", w1024.inlineVisible === false, JSON.stringify(w1024));
check("1024 keeps a visible search button", w1024.icons >= 1, String(w1024.icons));
const pageOverflow = await cdp.overflow();
check("1024 no horizontal page scrollbar", pageOverflow.overflow === false, JSON.stringify(pageOverflow));
await cdp.shot("06-desktop-1024", OUT);

/* ── 768 tablet ──────────────────────────────────────────── */
await cdp.metrics(768, 900);
await new Promise((r) => setTimeout(r, 400));
const w768 = await cdp.evaluate(`(()=>{const nav=document.querySelector(${JSON.stringify(NAV)});
  const i=document.querySelector('input[inputmode="search"]');
  return {inlineVisible:!!i&&i.getBoundingClientRect().width>0,
    iconButtons:[...nav.querySelectorAll('button[aria-label="Search products"]')].length,
    scrollW:nav.scrollWidth,clientW:nav.clientWidth};})()`);
check("768 hides inline search", w768.inlineVisible === false, JSON.stringify(w768));
check("768 keeps icon-only search", w768.iconButtons >= 1, String(w768.iconButtons));
check("768 nav does not overflow", w768.scrollW <= w768.clientW, `${w768.scrollW}/${w768.clientW}`);
await cdp.shot("07-tablet-768", OUT);

/* ── 375 first visit: consent banner vs drawer (spec 3.4) ── */
await cdp.metrics(375, 812, true);
await cdp.evaluate(`localStorage.clear()`);
await cdp.goto(`${BASE}/`);
await cdp.metrics(375, 812, true);
await new Promise((r) => setTimeout(r, 2200));

const banner = await cdp.evaluate(`(()=>{
  const b=[...document.querySelectorAll('div.fixed')].find(d=>/We use cookies/.test(d.textContent||''));
  if(!b)return null;const r=b.getBoundingClientRect();
  const t=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
  return {z:getComputedStyle(b).zIndex,top:Math.round(r.y),h:Math.round(r.height),
    topmost:!!t&&(t===b||b.contains(t))};})()`);
check("cookie banner renders on a first visit", !!banner, JSON.stringify(banner));
check("cookie banner is z-[80]", banner?.z === "80", String(banner?.z));
check("cookie banner is topmost before the drawer opens", banner?.topmost === true, JSON.stringify(banner));

const burger = await cdp.centerOf('button[aria-label="Open menu"]');
await cdp.click(burger.x, burger.y, 900);

const controls = await cdp.hitTestControls('[role="dialog"] nav');
check("mobile drawer opened", controls.missing !== true, JSON.stringify(controls).slice(0, 100));
check("every drawer control is reachable (scrolled into view)",
  controls.count > 0 && controls.occluded.length === 0,
  `n=${controls.count} occluded=${JSON.stringify(controls.occluded)}`);

const consentH = await cdp.evaluate(
  `getComputedStyle(document.documentElement).getPropertyValue('--consent-h').trim()`
);
check("drawer publishes measured consent clearance", /^\d+px$/.test(consentH) && parseInt(consentH) > 0, `--consent-h=${consentH}`);

const stillVisible = await cdp.evaluate(`(()=>{
  const b=[...document.querySelectorAll('div.fixed')].find(d=>/We use cookies/.test(d.textContent||''));
  const d=document.querySelector('[role="dialog"]');
  const r=b.getBoundingClientRect();
  const t=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
  return {topmost:!!t&&(t===b||b.contains(t)),bannerZ:getComputedStyle(b).zIndex,
          drawerZ:getComputedStyle(d).zIndex};})()`);
check("banner stays visible above the open drawer", stillVisible.topmost === true,
  `bannerZ=${stillVisible.bannerZ} drawerZ=${stillVisible.drawerZ}`);
await cdp.shot("08-mobile-drawer-banner", OUT);

const drawerLinks = await cdp.evaluate(`(()=>{const d=document.querySelector('[role="dialog"]');
  const pick=(t)=>[...d.querySelectorAll('a')].find(a=>(a.textContent||'').trim()===t);
  const dl=pick('Deals'),bl=pick('Brands A–Z');
  return {deals:dl?{href:dl.getAttribute('href'),color:getComputedStyle(dl).color}:null,
    brands:bl?{href:bl.getAttribute('href'),todo:bl.getAttribute('data-todo')}:null};})()`);
check("drawer Deals is gold with the real href",
  drawerLinks.deals?.href === "/shop?deals=true" && drawerLinks.deals?.color === GOLD,
  JSON.stringify(drawerLinks.deals));
check("drawer Brands carries data-todo", drawerLinks.brands?.todo === "phase-23-sub-e",
  JSON.stringify(drawerLinks.brands));

await cdp.key("Escape", "Escape");
await new Promise((r) => setTimeout(r, 700));
const m375 = await cdp.overflow();
check("375 no horizontal overflow", m375.overflow === false, JSON.stringify(m375));
await cdp.shot("09-mobile-375", OUT);

/* ── 3.2 the placeholder route fails loudly ──────────────── */
const brandsRes = await fetch(`${BASE}/brands`);
check("/brands returns HTTP 404 by design", brandsRes.status === 404, `status=${brandsRes.status}`);

/* ── prerender check: the Suspense island must not eat links ─ */
const homeHtml = await (await fetch(`${BASE}/`)).text();
check("Deals + Shop are in the prerendered HTML (Suspense island works)",
  homeHtml.includes("/shop?deals=true") && homeHtml.includes('href="/brands"'),
  `deals=${homeHtml.includes("/shop?deals=true")} brands=${homeHtml.includes('href="/brands"')}`);

hygiene(cdp);
const failures = summary();
info(`screenshots → ${OUT}`);
await dispose();
process.exit(failures);
