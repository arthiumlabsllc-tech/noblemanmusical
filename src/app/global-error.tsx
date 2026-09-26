"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-kente-red/5">
            <AlertTriangle className="h-10 w-10 text-kente-red" />
          </div>
          <h1 className="mb-3 font-display text-3xl font-bold text-navy-deep">
            Critical Error
          </h1>
          <p className="mb-8 max-w-md text-sm text-charcoal/60">
            A critical error occurred. Please try reloading the page or return to the homepage.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg bg-navy-deep px-5 py-2.5 text-sm font-medium text-cream hover:bg-navy"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-cream-dark bg-white px-5 py-2.5 text-sm font-medium text-charcoal hover:border-gold/50"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
