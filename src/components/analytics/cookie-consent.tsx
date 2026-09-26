"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

const CONSENT_KEY = "nmc-analytics-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

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
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-gold/10 bg-navy-deep/95 p-4 shadow-2xl backdrop-blur-sm animate-in slide-in-from-bottom-4 fade-in duration-300">
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
