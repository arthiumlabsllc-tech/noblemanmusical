"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Register on load
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          // Check for updates periodically (every 30 min)
          setInterval(() => {
            registration.update();
          }, 30 * 60 * 1000);
        })
        .catch((error) => {
          console.warn("SW registration failed:", error);
        });
    });
  }, []);

  return null;
}
