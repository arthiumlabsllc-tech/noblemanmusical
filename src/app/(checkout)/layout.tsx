import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Lock } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {/* Minimal checkout header */}
      <header className="flex h-14 items-center justify-between border-b border-navy/10 bg-cream px-4 md:px-6">
        <Link href="/cart" className="flex items-center gap-2">
          <Logo variant="icon" tone="navy" width={32} useImage />
        </Link>
        <span className="text-sm font-medium text-charcoal/60">Secure Checkout</span>
        <div className="flex items-center gap-1.5 text-xs text-charcoal/50">
          <Lock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Encrypted</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
