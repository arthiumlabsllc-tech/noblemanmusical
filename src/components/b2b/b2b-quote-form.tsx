"use client";

import { useState } from "react";
import { ShimmerButton } from "@/components/motion/shimmer-button";

interface B2BQuoteFormProps {
  orgType: string;
}

export function B2BQuoteForm({ orgType }: B2BQuoteFormProps) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="rounded-xl border border-kente-green/30 bg-kente-green/5 p-8 text-center">
        <p className="font-display text-lg font-bold text-kente-green">Quote Request Submitted!</p>
        <p className="mt-2 text-sm text-cream/60">We&apos;ll get back to you within 24 hours with a custom proposal.</p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-cream/80">Organization Name</label>
          <input type="text" required className="w-full rounded-lg border border-cream/20 bg-navy px-4 py-3 text-sm text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none" placeholder="Grace Chapel International" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-cream/80">Contact Person</label>
          <input type="text" required className="w-full rounded-lg border border-cream/20 bg-navy px-4 py-3 text-sm text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none" placeholder="Pastor Emmanuel" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-cream/80">Email</label>
          <input type="email" required className="w-full rounded-lg border border-cream/20 bg-navy px-4 py-3 text-sm text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none" placeholder="info@example.com" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-cream/80">Phone</label>
          <input type="tel" required className="w-full rounded-lg border border-cream/20 bg-navy px-4 py-3 text-sm text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none" placeholder="+233 244 916 034" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-cream/80">What do you need?</label>
        <textarea rows={4} required className="w-full rounded-lg border border-cream/20 bg-navy px-4 py-3 text-sm text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none" placeholder="Describe the instruments or equipment you need, quantities, and any specific requirements..." />
      </div>
      <input type="hidden" name="orgType" value={orgType} />
      <ShimmerButton type="submit" size="lg" className="w-full">Submit Quote Request</ShimmerButton>
    </form>
  );
}
