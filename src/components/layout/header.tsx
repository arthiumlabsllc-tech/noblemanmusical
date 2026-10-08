"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Logo } from "@/components/brand/logo";
import { MegaMenu } from "@/components/layout/mega-menu";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* ── ROW 1: Promo bar ────────────────────────────────── */}
      <div
        className={cn(
          "overflow-hidden bg-navy transition-all duration-300",
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        )}
      >
        <div className="container-wide mx-auto flex items-center justify-center py-1.5 sm:justify-between" style={{ display: "flex" }}>
          <Link
            href="/about"
            className="text-underline-gold hidden text-xs text-cream/80 transition-colors hover:text-white sm:block"
          >
            Why Shop With Us?
          </Link>
          <p className="truncate px-2 text-center text-xs text-cream/80">
            <span className="font-semibold text-gold">Guitar Fest</span> — Up to 40% off select instruments.{" "}
            <Link href="/shop" className="font-semibold text-white underline hover:text-gold">
              Shop now
            </Link>
          </p>
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/account" className="text-underline-gold text-xs text-cream/80 hover:text-white">Rewards</Link>
            <Link href="/about" className="text-underline-gold text-xs text-cream/80 hover:text-white">Blog</Link>
            <Link href="/contact" className="text-underline-gold text-xs text-cream/80 hover:text-white">Help</Link>
          </div>
        </div>
      </div>

      {/* ─ ROW 2: Main header ────────────────────────────────── */}
      <div className="border-b border-line bg-white transition-all duration-300">
        <div
          className="container-wide mx-auto items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4"
          style={{ display: "flex" }}
        >
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Logo variant="horizontal" tone="navy" width={110} />
          </Link>

          {/* Desktop center: Search + Contact */}
          <div className="header-center-col min-w-0 flex-1 items-center">
            <div className="mx-auto w-full max-w-2xl items-center" style={{ display: "flex" }}>
              <form onSubmit={handleSearch} className="min-w-0 flex-1" style={{ maxWidth: "100%" }}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What can we help you find?"
                    className="w-full border-b border-navy bg-transparent py-2.5 pl-10 pr-4 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none"
                    style={{ maxWidth: "100%", boxSizing: "border-box" }}
                  />
                  <button
                    type="submit"
                    className="absolute left-0 top-1/2 -translate-y-1/2 text-navy transition-colors hover:text-gold"
                    aria-label="Search"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </form>

              <Link
                href="tel:+233241234567"
                className="ml-4 shrink-0"
              >
                <div className="items-center gap-2.5" style={{ display: "flex" }}>
                  <div className="flex h-10 w-10 items-center justify-center border border-gold/40 text-gold" style={{ display: "flex" }}>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="hidden leading-tight sm:block">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-muted">Call Us</div>
                    <div className="text-sm font-bold text-navy">+233 24 123 4567</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right actions */}
          <div className="shrink-0 items-center gap-4 sm:gap-6" style={{ display: "flex" }}>
            {/* Desktop: Sign In */}
            <Link href="/login" className="group hidden items-center gap-2 sm:flex" aria-label="Account">
              <svg className="h-6 w-6 text-navy transition-colors group-hover:text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden text-sm text-navy transition-colors group-hover:text-gold lg:block">Sign In</span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="group relative flex items-center" aria-label="Cart">
              <svg className="h-6 w-6 text-navy transition-colors group-hover:text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-kente-red text-[11px] font-bold text-white">
                0
              </span>
            </Link>

            {/* Mobile: search toggle */}
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-navy transition-colors hover:text-gold md:hidden"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle search"
              aria-expanded={mobileSearchOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center text-navy transition-colors hover:text-gold lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search bar (toggleable) */}
        <div
          className={cn(
            "overflow-hidden border-line bg-white transition-all duration-300 md:hidden",
            mobileSearchOpen ? "max-h-20 border-t opacity-100" : "max-h-0 border-t-0 opacity-0"
          )}
        >
          <div className="container-wide mx-auto py-2.5">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search instruments..."
                  className="w-full border-b border-navy bg-transparent py-2.5 pl-10 pr-4 text-base text-navy placeholder:text-muted focus:border-gold focus:outline-none"
                  style={{ maxWidth: "100%", boxSizing: "border-box" }}
                  autoFocus={mobileSearchOpen}
                />
                <svg className="absolute left-0 top-1/2 h-5 w-5 -translate-y-1/2 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Category navigation with mega menu ────────── */}
      <div className="hidden lg:block">
        <MegaMenu />
      </div>

      {/*  Mobile nav drawer (overlay) ──────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-white">
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo variant="horizontal" tone="navy" width={120} />
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center text-navy transition-colors hover:text-gold"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer nav links */}
            <nav className="flex flex-col gap-0.5 px-3 py-4">
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Shop</p>
              {[
                { href: "/shop", label: "All Instruments", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
                { href: "/shop?category=guitars", label: "Guitars", icon: "M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" },
                { href: "/shop?category=amps-and-effects", label: "Amps & Effects", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
                { href: "/shop?category=drums", label: "Drums", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
                { href: "/shop?category=keyboards", label: "Keyboards", icon: "M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" },
                { href: "/shop?category=live-sound", label: "Live Sound", icon: "M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 12h.01" },
                { href: "/shop?category=recording", label: "Recording", icon: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4 0h8m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-navy transition-colors hover:text-gold"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg className="h-5 w-5 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              ))}

              <div className="my-3 border-t border-line" />

              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted">More</p>
              {[
                { href: "/brands", label: "Brands", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" },
                { href: "/b2b", label: "B2B & Bulk Orders", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
                { href: "/about", label: "About Us", icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                { href: "/contact", label: "Contact", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-3 text-[15px] font-medium text-navy transition-colors hover:text-gold"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg className="h-5 w-5 shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              ))}

              <div className="my-3 border-t border-line" />

              <Link
                href="/login"
                className="mx-3 mt-1 flex items-center justify-center gap-2 bg-navy px-4 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-gold"
                onClick={() => setMobileOpen(false)}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Sign In / Register
              </Link>
              <Link
                href="tel:+233241234567"
                className="mx-3 mt-2 flex items-center justify-center gap-2 border border-gold px-4 py-3 text-[14px] font-medium text-navy transition-colors hover:bg-gold hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                <svg className="h-4 w-4 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +233 24 123 4567
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
