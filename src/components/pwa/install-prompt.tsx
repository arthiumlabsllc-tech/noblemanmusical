"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;

    // Check if user previously dismissed
    if (localStorage.getItem("nmc-install-dismissed")) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Show prompt after 10 seconds of browsing
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 10000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem("nmc-install-dismissed", "true");
  };

  if (!showPrompt || dismissed) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[80] animate-in slide-in-from-bottom-4 fade-in duration-300 lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-sm">
      <div className="rounded-2xl border border-gold/20 bg-navy-deep p-4 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute right-3 top-3 rounded-full p-1 text-cream/60 hover:text-cream"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
            <Download className="h-5 w-5 text-gold" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-cream">
              Install Nobleman App
            </h3>
            <p className="mt-0.5 text-xs text-cream/60">
              Add to your home screen for quick access and offline browsing.
            </p>
            <button
              onClick={handleInstall}
              className="mt-3 rounded-full bg-gold px-4 py-1.5 text-xs font-semibold text-navy-deep transition hover:bg-gold/90"
            >
              Install Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
