"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { useCart } from "@/hooks/use-cart";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { cn } from "@/lib/utils";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Heart,
} from "lucide-react";

const categories = [
  { name: "Guitars", slug: "guitars" },
  { name: "Keyboards", slug: "keyboards" },
  { name: "Drums & Percussion", slug: "drums-percussion" },
  { name: "PA & Sound", slug: "pa-sound" },
  { name: "Studio", slug: "studio" },
  { name: "Traditional Ghanaian", slug: "traditional-ghanaian" },
  { name: "Accessories", slug: "accessories" },
];

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActiveLink(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const count = totalItems();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileMenuRef = useFocusTrap(mobileMenuOpen);

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

  // ⌘K / Ctrl+K shortcut for search
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [searchOpen]);

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

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 safe-top transition-colors duration-200",
          "bg-navy-deep/95 backdrop-blur-md",
          scrolled ? "border-b border-gold/40 shadow-navy" : "border-b border-gold/20"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-[72px] md:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Logo variant="horizontal" tone="gold" width={160} useImage />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isActiveLink(pathname, link.href);
              if (link.href === "/shop") return null; // handled separately with mega menu
              return (
                <NavLink key={link.href} href={link.href} active={active}>
                  {link.label}
                </NavLink>
              );
            })}

            {/* Shop with Mega Menu */}
            <div className="relative">
              <button
                className={cn(
                  "relative flex items-center gap-1 text-sm font-medium uppercase tracking-wider transition-colors hover:text-gold",
                  shopActive ? "text-gold" : "text-cream/80"
                )}
                onMouseEnter={() => setShopMenuOpen(true)}
                onMouseLeave={() => setShopMenuOpen(false)}
              >
                Shop
                <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", shopMenuOpen && "rotate-180")} />
                {shopActive && (
                  <motion.span
                    className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gold"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>

              <AnimatePresence>
                {shopMenuOpen && (
                  <motion.div
                    className="absolute left-1/2 top-full mt-2 w-[600px] -translate-x-1/2 rounded-xl bg-navy p-6 shadow-navy-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    onMouseEnter={() => setShopMenuOpen(true)}
                    onMouseLeave={() => setShopMenuOpen(false)}
                  >
                    <div className="grid grid-cols-2 gap-3">
                      {categories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/shop/${cat.slug}`}
                          className="rounded-lg px-4 py-3 text-sm text-cream/70 transition-colors hover:bg-gold/10 hover:text-gold"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-cream/10 pt-4">
                      <Link
                        href="/shop"
                        className="text-sm font-medium text-gold hover:text-gold-light"
                      >
                        View All Products →
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Search icon button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="rounded-full p-2 text-cream/70 transition-colors hover:bg-cream/10 hover:text-cream"
              aria-label="Search products"
            >
              <Search className="h-5 w-5" />
            </button>

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
              onClick={() => setSearchOpen(true)}
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
      </header>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-navy-deep/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              className="mx-auto mt-24 max-w-xl px-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/60" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search instruments..."
                  className="w-full rounded-xl border border-cream-dark bg-white py-4 pl-12 pr-16 text-base text-charcoal placeholder:text-charcoal/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setSearchOpen(false);
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
                    }
                  }}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/60 hover:text-charcoal"
                  aria-label="Close search"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-cream/60">
                Press <kbd className="rounded border border-cream/20 px-1.5 py-0.5 text-[10px]">ESC</kbd> to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            className="fixed inset-0 z-[60] bg-navy-deep/98 pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
            style={{ touchAction: "none" }}
          >
            <nav className="flex flex-col gap-1 px-6">
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
                  Shop by Category
                </span>
              </div>

              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}`}
                  className="rounded-lg px-6 py-3 text-cream/70 transition-colors hover:bg-cream/5 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}

              <div className="mt-4 border-t border-cream/10 pt-4">
                <Link
                  href="/about"
                  className="block rounded-lg px-4 py-4 text-lg text-cream/80 transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block rounded-lg px-4 py-4 text-lg text-cream/80 transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
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

/* ── Nav Link with active indicator ── */
function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative text-sm font-medium uppercase tracking-wider transition-colors hover:text-gold",
        active ? "text-gold" : "text-cream/80"
      )}
    >
      {children}
      {active && (
        <motion.span
          className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gold"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
}
