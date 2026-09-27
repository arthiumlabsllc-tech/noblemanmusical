"use client";

import Link from "next/link";
import { WifiOff, Home, RefreshCw } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 pt-chrome text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-navy-deep/5">
        <WifiOff className="h-10 w-10 text-navy-deep/40" />
      </div>
      <h1 className="mb-3 font-display text-3xl font-bold text-navy-deep md:text-4xl">
        You&apos;re Offline
      </h1>
      <p className="mb-8 max-w-md text-sm text-charcoal/60">
        It seems you&apos;ve lost your internet connection. Some features may not
        be available. Please check your connection and try again.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-full bg-navy-deep px-6 py-3 text-sm font-medium text-cream transition hover:bg-navy-deep/90"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-navy-deep/20 px-6 py-3 text-sm font-medium text-navy-deep transition hover:bg-navy-deep/5"
        >
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </div>
    </div>
  );
}
