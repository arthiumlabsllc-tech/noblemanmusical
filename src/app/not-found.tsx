import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Back to store">
          <Logo variant="horizontal" tone="navy" width={160} useImage />
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-charcoal/60 transition-colors hover:text-charcoal"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Link>
      </header>

      {/* Main content */}
      <div className="flex flex-1 items-center justify-center px-4 text-center">
        <div>
          <p className="font-display text-7xl font-bold text-navy-deep md:text-8xl">
            404
          </p>
          <h1 className="mt-4 font-display text-2xl font-bold text-navy-deep md:text-3xl">
            Page Not Found
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-charcoal/60">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let us help you find your way.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light"
            >
              Back Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-lg border border-cream-dark bg-white px-6 py-3 text-sm font-medium text-charcoal hover:border-gold/50"
            >
              Shop All
            </Link>
          </div>

          <Link
            href="/search"
            className="mt-4 inline-block text-sm font-medium text-gold hover:text-gold-light"
          >
            Search products →
          </Link>
        </div>
      </div>

      {/* Bottom footer */}
      <footer className="flex items-center justify-center gap-6 px-6 py-4">
        <Link href="/privacy" className="text-xs text-charcoal/60 hover:text-charcoal">
          Privacy
        </Link>
        <Link href="/terms" className="text-xs text-charcoal/60 hover:text-charcoal">
          Terms
        </Link>
        <Link href="/contact" className="text-xs text-charcoal/60 hover:text-charcoal">
          Contact
        </Link>
      </footer>
    </div>
  );
}
