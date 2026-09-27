"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { TopUtilityBar } from "@/components/layout/top-utility-bar";
import {
  MegaMenuPanel,
  MegaMenuTrigger,
  useMegaMenu,
} from "@/components/layout/mega-menu";
import { DepartmentsAccordion } from "@/components/layout/departments-accordion";
import { NavLink } from "@/components/layout/nav-link";
import { DrawerDealsLink, ShopNavLinks } from "@/components/layout/deals-nav-link";
import {
  NavbarSearch,
  SearchOverlay,
  useSearchOverlay,
} from "@/components/layout/navbar-search";
import { useCart } from "@/hooks/use-cart";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { cn } from "@/lib/utils";
import type { Department } from "@/lib/data/departments";
import type { MegaMenuFeature } from "@/lib/data/storefront-nav";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
} from "lucide-react";

interface NavbarProps {
  /** Departments with live counts, serialised in by the root layout. */
  departments: Department[];
  feature: MegaMenuFeature | null;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/* TODO(phase-23-sub-e): /brands is created with the category pages — the route
   does not exist yet, so this link 404s on purpose. A loud 404 beats a silent
   dead end, and Sub-Phase E makes it work with no change here: both links
   already read their active state from the real pathname. */
const BRANDS_HREF = "/brands";
/** Mirrored onto the DOM as `data-todo` so the temporary links are greppable. */
const BRANDS_TODO = "phase-23-sub-e";

// TODO(sub-phase-f): migrate drawer + megamenu to proper Sheet with inert background
// The drawer below and MegaMenuPanel both fake modal behaviour: `aria-modal="true"`
// without an `inert`/`aria-hidden` background, so the page behind stays reachable by
// Tab and screen-reader traversal. Tracked in docs/TECH_DEBT.md #1.

function isActiveLink(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar({ departments, feature }: NavbarProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const count = totalItems();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const search = useSearchOverlay();
  const mobileMenuRef = useFocusTrap(mobileMenuOpen);
  const mega = useMegaMenu();

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on ESC
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const shopActive = isActiveLink(pathname, "/shop");
  const brandsActive = isActiveLink(pathname, BRANDS_HREF);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 safe-top transition-colors duration-200",
          "bg-navy-deep/95 backdrop-blur-md",
          scrolled ? "border-b border-gold/40 shadow-navy" : "border-b border-gold/20"
        )}
      >
        <TopUtilityBar />
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px] md:px-6 lg:px-8"
        >
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo variant="horizontal" tone="gold" width={160} useImage />
          </Link>

          {/* Desktop Navigation.
              `gap-6` below xl and `gap-8` from xl up: the row's intrinsic width
              with seven items is 1243px, so at 1024px it clipped by 234px. Tightening
              the only breakpoint band that has no room is what makes Brands and Deals
              fit without dropping either. */}
          <div className="hidden items-center gap-6 lg:flex xl:gap-8">
            <NavLink href="/" active={isActiveLink(pathname, "/")}>
              Home
            </NavLink>

            {/* Departments owns the mega menu; Shop stays a direct link to the
                full catalogue so both discovery paths exist. */}
            <MegaMenuTrigger controller={mega} active={shopActive} />

            {/* Deals then Shop, per the spec's "after Departments, before Shop".
                One component because Shop's underline has to yield while the
                ?deals=true filter is the shopper's actual state. */}
            <ShopNavLinks shopActive={shopActive} />

            <NavLink
              href={BRANDS_HREF}
              active={brandsActive}
              dataTodo={BRANDS_TODO}
            >
              Brands
            </NavLink>

            {NAV_LINKS.filter((link) => link.href !== "/").map((link) => {
              const active = isActiveLink(pathname, link.href);
              return (
                <NavLink key={link.href} href={link.href} active={active}>
                  {link.label}
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* The inline field needs 240px the nav row only has from xl up: at
                1024px logo + seven links + the field measure 1243px against 1009px
                available. So the field is xl-and-up and the icon button carries
                1024–1279, instead of clipping the links. Deviation from "desktop =
                lg" is deliberate and measured; see the item-3 report. */}
            <button
              onClick={() => search.open()}
              className="rounded-full p-2 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream xl:hidden"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="hidden xl:block">
              <NavbarSearch
                overlayOpen={search.searchOpen}
                queryRef={search.liveQuery}
                onOpenOverlay={search.open}
              />
            </div>

            <Link
              href="/account/wishlist"
              className="rounded-full p-2 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart with badge */}
            <Link
              href="/cart"
              className="relative rounded-full p-2 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-navy-deep">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="rounded-full p-2 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>

          {/* Mobile: search + cart badge + hamburger */}
          <div className="flex items-center gap-1 lg:hidden">
            <button
              onClick={() => search.open()}
              className="rounded-full p-2 text-cream/80 transition-colors hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/cart"
              className="relative rounded-full p-2 text-cream/80 transition-colors hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
            >
              <ShoppingBag className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-semibold text-navy-deep">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <button
              className="rounded-full p-2 text-cream/80 transition-colors hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>

        {/* Rendered inside <header> so `inset-x-0 top-full` can span the full
            viewport width and sit flush under the nav row. */}
        <MegaMenuPanel controller={mega} departments={departments} feature={feature} />
      </header>

      <SearchOverlay
        open={search.searchOpen}
        prefill={search.prefill}
        onClose={search.close}
        onQueryChange={search.noteQuery}
      />

      {/* Mobile Menu Overlay
          z-[var(--z-drawer)] (45) deliberately sits BELOW the header's z-50: at
          the old z-[60] the overlay swallowed the header, so the only close
          control on screen was unpaintable and unclickable — an opened menu
          could not be closed by tapping. Written as an arbitrary var() because
          Tailwind v4 has no `--z-*` theme namespace, so a bare `z-drawer` class
          would generate no CSS at all and silently fall back to `z-index: auto`.
          Body scroll is already locked, so touch-action:none is not needed here
          and only prevented the menu itself from scrolling. */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            /* Fully opaque, not /98: measured in a real 375px browser the sheet is
               the topmost full-viewport layer with no backdrop-filter, so the 2%
               alpha bought nothing and just let the hero's large type ghost through
               the flat navy panel. */
            className="fixed inset-0 z-[var(--z-drawer)] overflow-y-auto overscroll-contain bg-navy-deep pt-chrome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
          >
            {/* pb clears both fixed bottom layers, which now sit ON TOP of this
                drawer: the tab bar (z-50, ~6rem of padding) and the cookie banner
                (z-[80], height published as `--consent-h` because it is 122px on a
                phone and one row on wider screens — it cannot be a magic number).
                Without the consent term, Deals / Brands / the icon row are
                unreachable behind the banner on a first visit. */}
            <nav className="flex flex-col gap-1 px-6 pb-[calc(6rem+var(--consent-h,0px))]">
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-lg px-4 py-4 text-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep",
                      active ? "text-gold" : "text-cream/80 hover:bg-cream/5 hover:text-cream"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              <div className="px-4 py-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-gold/60">
                  Shop by Department
                </span>
              </div>

              <DepartmentsAccordion
                departments={departments}
                pathname={pathname}
                onNavigate={() => setMobileMenuOpen(false)}
              />

              {/* Deals and Brands only — About and Contact were duplicated here,
                  they already come from the NAV_LINKS loop above. */}
              <div className="mt-4 border-t border-cream/10 pt-4">
                <DrawerDealsLink onNavigate={() => setMobileMenuOpen(false)} />
                <Link
                  href={BRANDS_HREF}
                  data-todo={BRANDS_TODO}
                  aria-current={brandsActive ? "page" : undefined}
                  className="block rounded-lg px-4 py-4 text-lg text-cream/80 transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Brands A–Z
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center gap-6 border-t border-cream/10 pt-6">
                <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep" aria-label="Search">
                  <Search className="h-6 w-6 text-cream/80" />
                </Link>
                <Link href="/account/wishlist" onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep" aria-label="Wishlist">
                  <Heart className="h-6 w-6 text-cream/80" />
                </Link>
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep" aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`}>
                  <ShoppingBag className="h-6 w-6 text-cream/80" />
                </Link>
                <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep" aria-label="Account">
                  <User className="h-6 w-6 text-cream/80" />
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
