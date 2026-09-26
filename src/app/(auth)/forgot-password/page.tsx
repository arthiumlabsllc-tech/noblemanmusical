"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { ShimmerButton } from "@/components/motion/shimmer-button";
import { forgotPasswordAction } from "@/lib/auth/actions";
import { CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await forgotPasswordAction(formData);
      if (result.success) {
        setSent(true);
      }
    });
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-navy-deep">Reset Password</h1>
        <p className="mt-2 text-sm text-charcoal/60">Enter your email and we&apos;ll send you a reset link</p>
      </div>

      <div className="rounded-2xl border border-cream-dark bg-white p-6">
          {sent ? (
            <div className="py-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-kente-green" />
              <h2 className="font-display text-lg font-bold text-navy-deep">Check your email</h2>
              <p className="mt-2 text-sm text-charcoal/60">
                If an account exists with that email, we&apos;ve sent a password reset link.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-flex rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form action={handleSubmit} className="space-y-4">
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
              <ShimmerButton type="submit" size="lg" className="w-full" disabled={isPending}>
                {isPending ? "Sending..." : "Send Reset Link"}
              </ShimmerButton>
              <p className="text-center text-sm text-charcoal/60">
                <Link href="/login" className="font-medium text-gold hover:underline">Back to Sign In</Link>
              </p>
            </form>
          )}
      </div>
    </div>
  );
}
