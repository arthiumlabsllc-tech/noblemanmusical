"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ExternalLink } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { useFocusTrap } from "@/hooks/use-focus-trap";

const sectionLabels: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/categories": "Categories",
  "/admin/inventory": "Inventory",
  "/admin/quotes": "Quotes",
  "/admin/discounts": "Discounts",
};

function getSectionLabel(pathname: string): string {
  // Check for order detail page
  if (pathname.match(/^\/admin\/orders\/.+$/)) return "Order Detail";
  return sectionLabels[pathname] ?? "Admin";
}

interface AdminHeaderProps {
  sidebar: React.ReactNode;
}

export function AdminHeader({ sidebar }: AdminHeaderProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const section = getSectionLabel(pathname);
  const drawerRef = useFocusTrap(drawerOpen);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  // Close on ESC
  useEffect(() => {
    if (!drawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [drawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
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
        {/* Left: hamburger (mobile) + logo */}
        <div className="flex items-center gap-3">
          <button
            ref={hamburgerRef}
            className="rounded-lg p-2 text-cream/80 hover:bg-cream/10 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open admin navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Logo variant="icon" tone="gold" width={32} />
            <span className="text-sm font-semibold text-gold">Admin</span>
          </div>
        </div>

        {/* Center: section name */}
        <h1 className="hidden text-sm font-medium text-cream/80 sm:block">
          {section}
        </h1>

        {/* Right: view store */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-cream/60 transition-colors hover:bg-cream/10 hover:text-cream"
        >
          <span className="hidden sm:inline">View Store</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[60] bg-navy-deep/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
            />
            {/* Panel */}
            <motion.aside
              ref={drawerRef}
              className="fixed bottom-0 left-0 top-0 z-[60] w-72 bg-navy-deep lg:hidden"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              role="dialog"
              aria-modal="true"
              aria-label="Admin navigation"
              style={{ touchAction: "none" }}
            >
              <div className="flex h-full flex-col">
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-cream/10 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Logo variant="icon" tone="gold" width={32} />
                    <span className="text-sm font-semibold text-gold">Admin</span>
                  </div>
                  <button
                    onClick={closeDrawer}
                    className="rounded-lg p-2 text-cream/60 hover:bg-cream/10 hover:text-cream"
                    aria-label="Close admin navigation"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                {/* Sidebar content */}
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
