"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/use-focus-trap";

const navItems = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/wishlist", label: "Wishlist" },
  { href: "/account/addresses", label: "Addresses" },
  { href: "/account/settings", label: "Settings" },
];

interface AccountHeaderProps {
  sidebar: React.ReactNode;
}

export function AccountHeader({ sidebar }: AccountHeaderProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useFocusTrap(drawerOpen);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  // Return focus to hamburger when drawer closes
  useEffect(() => {
    if (!drawerOpen && hamburgerRef.current) {
      hamburgerRef.current.focus();
    }
  }, [drawerOpen]);

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-gold/20 bg-navy-deep/95 px-4 backdrop-blur-md lg:px-6">
        {/* Left: logo */}
        <Link href="/account" className="flex-shrink-0">
          <Logo variant="horizontal" tone="gold" width={140} useImage />
        </Link>

        {/* Center: section tabs (desktop only) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/account"
                ? pathname === "/account"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-gold"
                    : "text-cream/60 hover:text-cream/90"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: hamburger (mobile) + back to store */}
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream sm:flex"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Store</span>
          </Link>
          <button
            ref={hamburgerRef}
            className="rounded-lg p-2 text-cream/80 hover:bg-cream/10 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open account navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-[60] bg-navy-deep/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
            />
            <motion.aside
              ref={drawerRef}
              className="fixed bottom-0 left-0 top-0 z-[60] w-72 bg-navy-deep lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="Account navigation"
              style={{ touchAction: "none" }}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-cream/10 px-5 py-4">
                  <Logo variant="horizontal" tone="gold" width={140} useImage />
                  <button
                    onClick={closeDrawer}
                    className="rounded-lg p-2 text-cream/60 hover:bg-cream/10 hover:text-cream"
                    aria-label="Close account navigation"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {sidebar}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
