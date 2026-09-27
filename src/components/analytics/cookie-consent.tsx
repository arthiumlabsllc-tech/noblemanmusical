"use client";

import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { applyAnalyticsConsent, CONSENT_KEY } from "./google-analytics";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  /*
   * Publish the banner's real height as `--consent-h` so the layers it now
   * paints over can clear it.
   *
   * Raising the banner to `z-[80]` fixed the occlusion *of* the banner (debt #8)
   * but reversed the collision the other way: the drawer's Deals, Brands and
   * icon row measured 6 of 16 controls sitting underneath it at 375px. The fix
   * cannot be a magic padding number — the banner is ~122px tall stacked on a
   * phone and a single row on wider viewports, and it reflows on rotate — so it
   * is measured and published instead.
   */
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--consent-h",
        `${el.offsetHeight}px`
      );
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.setProperty("--consent-h", "0px");
    };
  }, [show]);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      // Delay showing the banner slightly
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    // Un-gate the already-loaded tag so the current session is measured.
    applyAnalyticsConsent(true);
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    applyAnalyticsConsent(false);
    setShow(false);
  };

  if (!show) return null;

  return (
    /*
     * `z-[80]` sits above every other layer in the scale — navbar (z-50),
     * mobile tab bar (z-50), search overlay (z-[60]) and the mobile drawer
     * (z-45). A consent request that the visitor cannot see is not a consent
     * request, so this banner must never be occluded; the drawer in particular
     * used to paint over it (TECH_DEBT #8). Nothing else may claim this tier.
     */
    <div
      ref={bannerRef}
      className="fixed bottom-0 left-0 right-0 z-[80] border-t border-gold/10 bg-navy-deep/95 p-4 shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-4 fade-in duration-300"
    >
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 sm:flex-row">
        <p className="flex-1 text-xs leading-relaxed text-cream/70">
          We use cookies to enhance your browsing experience and analyze site
          traffic.{" "}
          <Link href="/privacy" className="text-gold underline underline-offset-2">
            Learn more
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={decline}
            className="rounded-full border border-cream/20 px-4 py-2 text-xs font-medium text-cream/60 transition hover:border-cream/40 hover:text-cream"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="rounded-full bg-gold px-5 py-2 text-xs font-semibold text-navy-deep transition hover:bg-gold/90"
          >
            Accept
          </button>
        </div>
        <button
          onClick={decline}
          className="absolute right-3 top-3 rounded-full p-1 text-cream/50 hover:text-cream"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
