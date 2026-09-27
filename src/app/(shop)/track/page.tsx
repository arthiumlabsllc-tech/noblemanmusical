import type { Metadata } from "next";
import { OrderTrackingForm } from "@/components/tracking/order-tracking-form";
import { Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Track Your Order",
  description:
    "Enter your Nobleman Musical Center order number and email to see live delivery status anywhere in Ghana.",
  // Deliberately indexable: people search "nobleman track order", and this is a
  // public tool with no personal data on load.
  alternates: { canonical: "/track" },
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-cream pt-chrome">
      {/* Hero */}
      <div className="bg-navy-deep py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <Package className="h-7 w-7 text-gold" />
            </div>
          </div>
          <h1 className="mb-3 font-display text-3xl font-bold text-cream md:text-4xl">
            Track Your Order
          </h1>
          <p className="text-sm text-cream/60">
            Enter your order number and email or phone to check the status.
          </p>
        </div>
      </div>

      {/* Form + Results */}
      <div className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <OrderTrackingForm />
      </div>
    </div>
  );
}
