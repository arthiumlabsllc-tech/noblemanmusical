import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

interface SuccessPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: SuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order ?? "NMC-UNKNOWN";

  return (
    <div className="container-narrow py-16 text-center">
      {/* Success icon */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-kente-green/10">
        <svg className="h-10 w-10 text-kente-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="mt-6 font-display text-3xl font-bold text-navy">Order Confirmed!</h1>
      <p className="mt-4 text-base text-charcoal/60">
        Thank you for your order. We&apos;ve received your order and will begin processing it shortly.
      </p>

      {/* Order number */}
      <div className="mt-8 inline-block rounded-lg border border-charcoal/10 bg-white px-8 py-4">
        <p className="text-xs text-charcoal/40">Order Number</p>
        <p className="mt-1 font-mono text-lg font-bold text-navy">{orderNumber}</p>
      </div>

      {/* What's next */}
      <div className="mt-8 rounded-lg border border-charcoal/10 bg-white p-6 text-left">
        <h2 className="font-display text-lg font-bold text-navy">What happens next?</h2>
        <ol className="mt-4 space-y-3">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">1</span>
            <p className="text-sm text-charcoal">You&apos;ll receive a confirmation email with your order details.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">2</span>
            <p className="text-sm text-charcoal">Our team will prepare your instruments for delivery.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">3</span>
            <p className="text-sm text-charcoal">You&apos;ll get a tracking update once your order ships.</p>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gold text-xs font-bold text-navy">4</span>
            <p className="text-sm text-charcoal">Delivery within Accra typically takes 1-3 business days.</p>
          </li>
        </ol>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/shop"
          className="rounded-md bg-gold px-6 py-2.5 text-sm font-bold text-navy hover:bg-gold-light"
        >
          Continue Shopping
        </Link>
        <Link
          href="/contact"
          className="rounded-md border border-charcoal/20 px-6 py-2.5 text-sm font-medium text-charcoal hover:bg-cream"
        >
          Contact Support
        </Link>
      </div>

      {/* Logo */}
      <div className="mt-12">
        <Logo variant="icon" tone="gold" className="mx-auto h-10 w-10" />
        <p className="mt-2 font-accent text-sm italic text-bronze">Where Music Meets Majesty</p>
      </div>
    </div>
  );
}
