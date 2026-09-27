"use client";

/**
 * Mobile departments accordion — the touch counterpart to <MegaMenuPanel />.
 *
 * The mega menu is deliberately desktop-only; on a phone the same taxonomy is
 * reached by repurposing the existing navigation drawer (spec 2.4), so there is
 * one sheet, one focus trap and one scroll lock rather than two competing ones.
 *
 * Rows are buttons rather than links because the tap has to reveal the
 * sub-categories first; the department page itself stays reachable through the
 * "All {department}" row inside the expanded panel.
 *
 * Shares the drawer's fake-modal semantics (aria-modal without an inert
 * background) — see the marker below and docs/TECH_DEBT.md #1.
 */

// TODO(sub-phase-f): migrate drawer + megamenu to proper Sheet with inert background

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { subCategoryHref, type Department } from "@/lib/data/departments";

export function DepartmentsAccordion({
  departments,
  pathname,
  onNavigate,
}: {
  departments: Department[];
  pathname: string;
  onNavigate: () => void;
}) {
  // Open the section the shopper is already standing in.
  const [openSlug, setOpenSlug] = useState<string | null>(
    () => departments.find((d) => pathname.startsWith(`/shop/${d.slug}`))?.slug ?? null
  );

  return (
    <ul className="space-y-1">
      {departments.map((dept) => {
        const isOpen = openSlug === dept.slug;
        const panelId = `dept-accordion-${dept.slug}`;

        return (
          <li key={dept.slug}>
            <button
              type="button"
              onClick={() => setOpenSlug(isOpen ? null : dept.slug)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className={cn(
                "flex min-h-[48px] w-full items-center justify-between gap-3 rounded-lg px-4 py-3 text-left text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep",
                isOpen ? "bg-cream/5 text-gold" : "text-cream/80 hover:bg-cream/5 hover:text-cream"
              )}
            >
              <span>{dept.name}</span>
              <span className="flex items-center gap-2">
                {/* cream/50 already clears AA on navy-deep at 4.82:1; /70 (6.44:1)
                   matches the sub-category counts below so the two numbers read
                   as one weight. cream/40 was the failing value at 3.48:1. */}
                <span className="text-xs text-cream/70">{dept.itemCount}</span>
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.ul
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  {dept.subCategories.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={subCategoryHref(dept.slug, sub.slug)}
                        onClick={onNavigate}
                        className="flex min-h-[48px] items-center justify-between gap-3 pl-6 pr-4 py-3 text-sm text-cream/70 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
                      >
                        <span>{sub.name}</span>
                        <span className="text-xs text-cream/70">{sub.itemCount}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href={`/shop/${dept.slug}`}
                      onClick={onNavigate}
                      className="flex min-h-[48px] items-center pl-6 pr-4 py-3 text-sm font-medium text-gold transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
                    >
                      All {dept.name}
                    </Link>
                  </li>
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
