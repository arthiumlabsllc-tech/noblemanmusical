"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, MessageCircle, ShoppingBag } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "NMC-0000";

  useEffect(() => {
    // Gold confetti burst
    import("canvas-confetti").then(({ default: confetti }) => {
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#D4AF37", "#E8C766", "#B08D57"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#D4AF37", "#E8C766", "#B08D57"],
        });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    });
  }, []);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream">
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        {/* Animated Checkmark */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-kente-green/10">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-kente-green">
            <Check className="h-8 w-8 text-cream" />
          </div>
        </div>

        <h1 className="font-display text-3xl font-bold text-navy-deep">Order Confirmed!</h1>
        <p className="mt-3 text-charcoal/60">
          Thank you for your order. We&apos;ll send you a confirmation via WhatsApp shortly.
        </p>

        <div className="mt-6 rounded-xl border border-cream-dark bg-white p-4">
          <p className="text-xs text-charcoal/50">Order Number</p>
          <p className="font-mono text-lg font-bold text-gold">{orderNumber}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/shop"
            className="btn-shimmer flex items-center justify-center gap-2 rounded-lg bg-gold py-3.5 font-semibold text-navy-deep hover:bg-gold-light"
          >
            <ShoppingBag className="h-5 w-5" />
            Continue Shopping
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233244916034"}?text=${encodeURIComponent(`Hi, I just placed an order: ${orderNumber}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg border border-cream-dark py-3.5 font-medium text-charcoal hover:bg-cream-dark"
          >
            <MessageCircle className="h-5 w-5" />
            Contact via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
