"use client";

/**
 * Departments mega menu — the signature "Musician's Friend" navigation panel.
 *
 * Rendered in two pieces because it occupies two places in the DOM:
 *   <MegaMenuTrigger> lives in the navbar row, <MegaMenuPanel> is a child of
 *   <header> so it can span the full width and hang off the header's bottom
 *   edge. `useMegaMenu()` holds the shared state, so Navbar owns nothing but
 *   the hook's return value.
 *
 * The panel and the mobile drawer both fake modal behaviour; see the marker
 * below and docs/TECH_DEBT.md #1.
 */

// TODO(sub-phase-f): migrate drawer + megamenu to proper Sheet with inert background

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Cable,
  ChevronDown,
  ChevronRight,
  Drum,
  Guitar,
  Mic,
  Music2,
  Piano,
  Speaker,
  type LucideIcon,
} from "lucide-react";
import { cn, formatGHS } from "@/lib/utils";
import { subCategoryHref, type Department, type DepartmentIconName } from "@/lib/data/departments";
import type { MegaMenuFeature } from "@/lib/data/storefront-nav";

/** `import type` only — pulling storefront-nav in for real would ship the catalogue. */

const ICONS: Record<DepartmentIconName, LucideIcon> = {
  Guitar,
  Piano,
  Drum,
  Speaker,
  Mic,
  Music2,
  Cable,
};

/* Hover intent: open lazily so a cursor crossing the navbar to reach the cart
   does not flash the panel; close lazily so the pointer can cross the seam
   between trigger and panel without the menu flickering shut. */
const OPEN_DELAY_MS = 150;
const CLOSE_DELAY_MS = 200;

export function useMegaMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* Focus is only moved into the panel when it was opened by keyboard, and the
     focus-leaves-close rule only arms once the panel has actually held focus —
     otherwise a hover-opened menu shuts itself immediately. */
  const focusOnOpen = useRef(false);
  const panelHeldFocus = useRef(false);

  const clearTimers = useCallback(() => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    openTimer.current = null;
    closeTimer.current = null;
  }, []);

  const close = useCallback(() => {
    clearTimers();
    setOpen(false);
  }, [clearTimers]);

  const scheduleOpen = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    if (!openTimer.current) {
      openTimer.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    }
  }, []);

  const scheduleClose = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (!closeTimer.current) {
      closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
    }
  }, []);

  /* Click toggles for touch and keyboard users. `detail === 0` means the click
     was synthesised from Enter/Space, so move focus into the panel. */
  const onTriggerClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    clearTimers();
    focusOnOpen.current = event.detail === 0;
    setOpen((prev) => !prev);
  }, [clearTimers]);

  // Route change, ESC and pointer-down-outside all dismiss the panel.
  useEffect(() => {
    setOpen(false);
    panelHeldFocus.current = false;
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        close();
        triggerRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close();
    }
    function onFocusOut(event: FocusEvent) {
      if (!panelHeldFocus.current) return;
      const next = event.relatedTarget as Node | null;
      if (next && (panelRef.current?.contains(next) || triggerRef.current?.contains(next))) return;
      panelHeldFocus.current = false;
      close();
    }

    // Captured once: by cleanup time `panelRef.current` may point at a
    // different node (or null), which would leave this listener attached.
    const panel = panelRef.current;

    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("pointerdown", onPointerDown, true);
    panel?.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      panel?.removeEventListener("focusout", onFocusOut);
    };
  }, [open, close]);

  // Adopt focus after the panel mounts (AnimatePresence renders it in the same commit).
  useEffect(() => {
    if (!open) return;
    if (panelHeldFocus.current && document.activeElement !== document.body) return;
    if (!focusOnOpen.current) return;
    const frame = requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => clearTimers, [clearTimers]);

  return {
    open,
    panelRef,
    triggerRef,
    close,
    scheduleOpen,
    scheduleClose,
    onTriggerClick,
    markPanelFocused: () => {
      panelHeldFocus.current = true;
    },
  };
}

/**
 * Declared after the hook: writing it as an explicit return annotation on
 * `useMegaMenu` would be a circular alias through `ReturnType<typeof …>`.
 */
export type MegaMenuController = ReturnType<typeof useMegaMenu>;

/* ── Trigger ── */

export function MegaMenuTrigger({
  controller,
  active,
}: {
  controller: MegaMenuController;
  active: boolean;
}) {
  const { open, triggerRef, scheduleOpen, scheduleClose, onTriggerClick } = controller;

  return (
    <button
      ref={triggerRef}
      type="button"
      id="mega-menu-trigger"
      aria-expanded={open}
      aria-haspopup="true"
      aria-controls="mega-menu"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onClick={onTriggerClick}
      className={cn(
        "relative flex items-center gap-1 text-sm font-medium uppercase tracking-wider transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep",
        open || active ? "text-gold" : "text-cream/80"
      )}
    >
      Departments
      <ChevronDown
        className={cn("h-3.5 w-3.5 transition-transform duration-200", open && "rotate-180")}
        aria-hidden="true"
      />
      {(open || active) && (
        <motion.span
          layoutId="mega-menu-underline"
          className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full bg-gold"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </button>
  );
}

/* ── Panel ── */

export function MegaMenuPanel({
  controller,
  departments,
  feature,
}: {
  controller: MegaMenuController;
  departments: Department[];
  feature: MegaMenuFeature | null;
}) {
  const { open, panelRef, scheduleOpen, scheduleClose, markPanelFocused } = controller;
  const pathname = usePathname();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const active =
    departments.find((d) => d.slug === activeSlug) ??
    departments.find((d) => pathname.startsWith(`/shop/${d.slug}`)) ??
    departments[0];

  if (departments.length === 0) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mega-menu"
          role="group"
          aria-label="Shop by department"
          /* Full-bleed inside <header>: `inset-x-0 top-full` pins the panel to
             the viewport width and the header's bottom edge, so it clears the
             utility bar + nav row as one stack. The 480px in the brief assumed
             fewer departments — 7 rows at 52px plus padding measures ~500px,
             hence min() against the real viewport instead of a fixed cap. */
          className={cn(
            "absolute inset-x-0 top-full z-[var(--z-overlay)] hidden max-h-[min(560px,calc(100dvh-var(--chrome-h)-1rem))] overflow-y-auto overscroll-contain",
            "rounded-b-2xl border-t-2 border-gold bg-cream p-8 shadow-2xl lg:block"
          )}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onMouseEnter={scheduleOpen}
          onMouseLeave={scheduleClose}
          onFocusCapture={markPanelFocused}
        >
          <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1.4fr)] gap-8">
            <DepartmentList departments={departments} pathname={pathname} onHover={setActiveSlug} />
            <SubCategoryColumn department={active} />
            <FeatureColumn feature={feature} />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-cream-dark pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-navy transition-colors hover:text-navy-deep hover:underline hover:decoration-gold/60 hover:underline-offset-4"
            >
              View All Products
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            {/* TODO(phase-23-sub-e): /brands ships with the category pages. Until
                the route exists this link 404s — remove this note when it lands. */}
            <Link
              href="/brands"
              data-todo="phase-23-sub-e"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-navy transition-colors hover:text-navy-deep hover:underline hover:decoration-gold/60 hover:underline-offset-4"
            >
              Brands A–Z
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DepartmentList({
  departments,
  pathname,
  onHover,
}: {
  departments: Department[];
  pathname: string;
  onHover: (slug: string) => void;
}) {
  return (
    <ul className="space-y-1">
      {departments.map((dept) => {
        const Icon = ICONS[dept.icon];
        const isCurrent = pathname === `/shop/${dept.slug}`;
        return (
          <li key={dept.slug}>
            <Link
              href={`/shop/${dept.slug}`}
              onMouseEnter={() => onHover(dept.slug)}
              onFocus={() => onHover(dept.slug)}
              className={cn(
                "group flex h-[52px] items-center gap-3 rounded-lg border-l-2 px-3 transition-colors duration-150",
                isCurrent
                  ? "border-gold bg-gold/15"
                  : "border-transparent hover:border-gold/40 hover:bg-gold/10"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0 text-bronze" aria-hidden="true" />
              <span className="flex-1 truncate text-sm font-medium text-navy">{dept.name}</span>
              {/* /70, not the brief's /60: charcoal/60 measures 4.35:1 on cream
                  and fails WCAG AA for 12px text. /70 is 6.05:1. */}
              <span className="text-xs text-charcoal/70">{dept.itemCount}</span>
              <ChevronRight
                className="h-3.5 w-3.5 flex-shrink-0 text-charcoal/40 transition-transform duration-150 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SubCategoryColumn({ department }: { department: Department }) {
  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={department.slug}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          <p className="mb-4 text-xs uppercase tracking-wider text-charcoal/60">
            {department.name}
          </p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3">
            {department.subCategories.map((sub) => (
              <li key={sub.slug}>
                <Link
                  href={subCategoryHref(department.slug, sub.slug)}
                  className="text-sm text-navy transition-colors duration-150 hover:text-navy-deep hover:underline hover:decoration-gold/60 hover:underline-offset-4"
                >
                  {sub.name}
                  <span className="ml-1 text-xs text-charcoal/70">{sub.itemCount}</span>
                </Link>
              </li>
            ))}
          </ul>
          {/* Gold stays on the underline, not the letters: gold-dark on cream is
              2.49:1 and unreadable at 14px, while a gold rule keeps the brand
              cue with navy text at 16.78:1. */}
          <Link
            href={`/shop/${department.slug}`}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy-deep underline decoration-gold/60 decoration-2 underline-offset-4 transition-colors hover:decoration-gold"
          >
            See all {department.name}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
          <p className="mt-3 text-xs text-charcoal/70">{department.blurb}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FeatureColumn({ feature }: { feature: MegaMenuFeature | null }) {
  if (!feature) {
    return (
      <div className="flex flex-col justify-center rounded-xl border border-cream-dark bg-white p-6 text-center">
        <p className="font-display text-lg font-bold text-navy">New arrivals weekly</p>
        <p className="mt-2 text-sm text-charcoal/70">
          Fresh stock lands from Accra every week — browse the full catalogue.
        </p>
        <Link
          href="/shop"
          className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-medium text-navy-deep underline decoration-gold/60 decoration-2 underline-offset-4 transition-colors hover:decoration-gold"
        >
          Shop all instruments
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    );
  }

  return (
    <Link
      href={`/product/${feature.productSlug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-cream-dark bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
    >
      {/* 16/9, not the 4/3 first draft: measured in a real 1440x900 browser the
          panel's content was 610px against a 558px budget, so the footer row
          (View All Products / Brands) rendered cut in half. At the ~340px column
          width this ratio saves 64px and the whole panel fits without scrolling. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-cream">
        {/* Empty alt: the product name is the adjacent heading, so the photo
            adds no information a screen reader should repeat. */}
        <Image
          src={feature.image}
          alt=""
          fill
          sizes="(max-width: 1024px) 0px, 340px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded bg-gold px-2 py-1 text-xs uppercase tracking-wide text-navy-deep">
          {feature.eyebrow}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl font-bold leading-snug text-navy">{feature.name}</h3>
        <p className="mt-1 text-sm text-charcoal/70">
          Save {feature.savingsPercent}% — was {formatGHS(feature.compareAtPrice)}
        </p>
        <p className="mt-2 font-medium text-navy-deep">{formatGHS(feature.price)}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-navy-deep group-hover:underline group-hover:decoration-gold group-hover:underline-offset-4">
          Shop Now
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
