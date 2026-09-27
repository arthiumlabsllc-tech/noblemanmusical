"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  active: boolean;
  /** "gold" marks a promotion link (Deals) without stealing nav hierarchy. */
  tone?: "cream" | "gold";
  /** Optional leading glyph. Decorative — hidden from screen readers. */
  icon?: LucideIcon;
  /** Greppable marker for a temporary link, e.g. a route that does not exist yet. */
  dataTodo?: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}

/**
 * Desktop nav link: uppercase cream (or gold) label with the gold underline.
 *
 * The underline is a CSS `scaleX` transition rather than a mount-triggered
 * motion so that it can serve both roles with one element — parked at zero for
 * hover to draw in, held at full for the active page. Tailwind v4 emits
 * `translate` and `scale` as independent properties, so `-translate-x-1/2`
 * centring and `scale-x-*` composing do not fight over a single `transform`.
 *
 * `aria-current="page"` is what screen readers actually need; colour alone was
 * the only active signal before.
 */
export function NavLink({
  href,
  active,
  tone = "cream",
  icon: Icon,
  dataTodo,
  onNavigate,
  children,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      data-todo={dataTodo}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        "group relative text-sm font-medium uppercase tracking-wider transition-colors",
        tone === "gold" ? "text-gold hover:text-gold-light" : "text-cream/80 hover:text-gold",
        active && tone !== "gold" && "text-gold"
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
        {children}
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute -bottom-1 left-1/2 h-0.5 w-6 origin-center -translate-x-1/2 rounded-full bg-gold transition-transform duration-200",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
        )}
      />
    </Link>
  );
}
