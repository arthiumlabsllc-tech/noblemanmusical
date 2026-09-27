"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { ShimmerButton } from "@/components/motion/shimmer-button";
import { registerAction } from "@/lib/auth/actions";
import { PHONE_INPUT_EXAMPLE } from "@/lib/config";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await registerAction(formData);
      if (!result.success && result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-navy-deep">Create Account</h1>
        <p className="mt-2 text-sm text-charcoal/60">Join the Nobleman Circle</p>
      </div>

      <div className="space-y-4 rounded-2xl border border-cream-dark bg-white p-6">
          {error && (
            <div className="rounded-lg bg-kente-red/10 p-3 text-center text-sm text-kente-red">
              {error}
            </div>
          )}

          <form action={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal">Full Name</label>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none"
                placeholder="Kwame Asante"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal">Email</label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none"
                placeholder="you@example.com"
                disabled={isPending}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal">Phone</label>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none"
                placeholder={PHONE_INPUT_EXAMPLE}
                disabled={isPending}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-charcoal">Password</label>
              <input
                type="password"
                name="password"
                required
                autoComplete="new-password"
                minLength={8}
                className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none"
                placeholder="Min 8 characters"
                disabled={isPending}
              />
            </div>
            <label className="flex items-start gap-2 text-sm text-charcoal/60">
              <input type="checkbox" required className="mt-0.5 rounded accent-gold" />
              <span>I agree to the <Link href="/terms" className="text-gold">Terms</Link> and <Link href="/privacy" className="text-gold">Privacy Policy</Link></span>
            </label>
            <ShimmerButton type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? "Creating account..." : "Create Account"}
            </ShimmerButton>
          </form>

          <p className="text-center text-sm text-charcoal/60">
            Already have an account? <Link href="/login" className="font-medium text-gold hover:underline">Sign in</Link>
          </p>
      </div>
    </div>
  );
}
