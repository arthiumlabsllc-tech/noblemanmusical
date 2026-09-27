"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Search state shared by the inline field, the icon buttons and the overlay.
 * Lives here so `Navbar` keeps no search logic of its own.
 */
export function useSearchOverlay() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [prefill, setPrefill] = useState("");
  /*
   * The overlay's live text, mirrored in a ref rather than state on purpose:
   * the overlay input stays uncontrolled and the navbar does not re-render on
   * every keystroke. The inline field adopts it once on close.
   */
  const liveQuery = useRef("");
  // Mirrors `searchOpen` for the global key handler, so ⌘K can go through the
  // same open()/close() pair instead of toggling state directly and skipping
  // the prefill seeding.
  const isOpenRef = useRef(false);

  const open = (value = "") => {
    isOpenRef.current = true;
    liveQuery.current = value;
    setPrefill(value);
    setSearchOpen(true);
  };
  const close = () => {
    isOpenRef.current = false;
    setSearchOpen(false);
  };
  const noteQuery = (value: string) => {
    liveQuery.current = value;
  };

  // ⌘K / Ctrl+K opens the overlay from anywhere on the page.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpenRef.current) close();
        else open(liveQuery.current);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return { searchOpen, prefill, liveQuery, open, close, noteQuery };
}

/* ── Inline desktop field ── */

/** 240px at rest, 320px focused — the two widths the spec asks for. */
const COLLAPSED_WIDTH = "w-60";
const EXPANDED_WIDTH = "w-80";

export function NavbarSearch({
  overlayOpen,
  queryRef,
  onOpenOverlay,
}: {
  overlayOpen: boolean;
  queryRef: RefObject<string>;
  onOpenOverlay: (prefill: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  // Guards against re-arming the overlay on every keystroke once typing starts.
  const handedOff = useRef(false);

  useEffect(() => {
    if (overlayOpen) return;
    handedOff.current = false;
    /*
     * Adopt the overlay's final text. Only the first keystroke is ever typed
     * into this field — focus moves to the overlay mid-word — so leaving the
     * local value alone measured a stale one-character field after ESC while
     * the query in use was the whole word.
     */
    setValue((prev) => (prev === queryRef.current ? prev : queryRef.current));
  }, [overlayOpen, queryRef]);

  return (
    <div className="relative" role="search">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cream/50"
        aria-hidden="true"
      />
      <input
        type="text"
        inputMode="search"
        value={value}
        onChange={(e) => {
          const next = e.target.value;
          setValue(next);
          if (next.trim() && !handedOff.current) {
            handedOff.current = true;
            onOpenOverlay(next);
          }
        }}
        onFocus={() => setExpanded(true)}
        onBlur={() => setExpanded(false)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.currentTarget.blur();
            setExpanded(false);
            return;
          }
          if (e.key === "Enter" && value.trim()) {
            window.location.href = `/search?q=${encodeURIComponent(value.trim())}`;
          }
        }}
        placeholder="Search products..."
        aria-label="Search products"
        className={cn(
          "rounded-full border border-cream/15 bg-cream/10 py-2 pl-9 pr-3 text-sm text-cream",
          "placeholder:text-cream/60 transition-[width,box-shadow,border-color] duration-200",
          "focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40",
          expanded ? EXPANDED_WIDTH : COLLAPSED_WIDTH
        )}
      />
    </div>
  );
}

/* ── Full-screen overlay ── */

/**
 * The overlay `NavbarSearch` and the icon buttons both hand off to.
 *
 * It is intentionally the same single input the navbar has always used — the
 * one place that turns a query into a `/search` navigation. No Typesense call
 * lives here or in the inline field, so the two entry points cannot drift.
 */
export function SearchOverlay({
  open,
  prefill,
  onClose,
  onQueryChange,
}: {
  open: boolean;
  prefill: string;
  onClose: () => void;
  onQueryChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] bg-navy-deep/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
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
                ref={inputRef}
                type="text"
                defaultValue={prefill}
                placeholder="Search instruments..."
                onChange={(e) => onQueryChange(e.target.value)}
                className="w-full rounded-xl border border-cream-dark bg-white py-4 pl-12 pr-16 text-base text-charcoal placeholder:text-charcoal/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
                onKeyDown={(e) => {
                  if (e.key === "Escape") onClose();
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    window.location.href = `/search?q=${encodeURIComponent(e.currentTarget.value.trim())}`;
                  }
                }}
              />
              <button
                onClick={onClose}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/60 hover:text-charcoal"
                aria-label="Close search"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-cream/60">
              Press{" "}
              <kbd className="rounded border border-cream/20 px-1.5 py-0.5 text-[10px]">ESC</kbd> to
              close
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
