import Link from "next/link";
import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  // Auth and checkout are functional surfaces with no indexable content, and
  // Google has said plainly that login pages should not appear in results.
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
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

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4">
        {children}
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
          Help
        </Link>
      </footer>
    </div>
  );
}
