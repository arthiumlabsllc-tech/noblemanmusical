"use client";

import Link from "next/link";
import { XCircle, MessageCircle, RotateCcw } from "lucide-react";

export default function CheckoutFailedPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream">
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        {/* Error Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-kente-red/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-kente-red">
            <XCircle className="h-8 w-8 text-cream" />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-navy-deep">Payment Failed</h1>
        <p className="mt-3 text-charcoal/60">
          Something went wrong with your payment. No charges have been made.
        </p>

        <div className="mt-6 rounded-xl border border-cream-dark bg-white p-4">
          <p className="text-sm text-charcoal/60">
            If the problem persists, please contact us via WhatsApp and we&apos;ll help you complete your order.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/checkout"
            className="btn-shimmer flex items-center justify-center gap-2 rounded-lg bg-gold py-3.5 font-semibold text-navy-deep hover:bg-gold-light"
          >
            <RotateCcw className="h-5 w-5" />
            Try Again
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233244916034"}?text=${encodeURIComponent("Hi, I had an issue with my payment on Nobleman Musical Center. Can you help?")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-cream-dark py-3.5 font-medium text-charcoal hover:bg-cream-dark"
          >
            <MessageCircle className="h-5 w-5" />
            Contact Support via WhatsApp
          </a>
          <Link
            href="/shop"
            className="text-sm text-charcoal/50 hover:text-charcoal"
          >
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
