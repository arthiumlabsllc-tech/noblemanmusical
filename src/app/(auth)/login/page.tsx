"use client";

import Link from "next/link";
import { useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ShimmerButton } from "@/components/motion/shimmer-button";
import { loginAction, loginWithGoogle } from "@/lib/auth/actions";

function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/account";
  const callbackError = searchParams.get("error");

  function handleSubmit(formData: FormData) {
    formData.set("redirectTo", nextUrl);
    startTransition(() => {
      loginAction(formData);
    });
  }

  return (
    <div className="space-y-4 rounded-2xl border border-cream-dark bg-white p-6">
      {/* Error message */}
      {callbackError && (
        <div className="rounded-lg bg-kente-red/10 p-3 text-center text-sm text-kente-red">
          {callbackError === "CredentialsSignin"
            ? "Invalid email or password."
            : "An error occurred. Please try again."}
        </div>
      )}

      {/* Google OAuth */}
      <form action={loginWithGoogle}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-cream-dark px-4 py-3 text-sm font-medium text-charcoal transition hover:bg-cream/50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cream-dark" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-charcoal/60">Or</span>
        </div>
      </div>

      {/* Credentials form */}
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
        <div>
          <label className="mb-1 block text-sm font-medium text-charcoal">Password</label>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none"
            placeholder="••••••••"
            disabled={isPending}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-charcoal/60">
            <input type="checkbox" className="rounded accent-gold" /> Remember me
          </label>
          <Link href="/forgot-password" className="text-sm text-gold hover:underline">Forgot password?</Link>
        </div>
        <ShimmerButton type="submit" size="lg" className="w-full" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign In"}
        </ShimmerButton>
      </form>

      <p className="text-center text-sm text-charcoal/60">
        Don&apos;t have an account? <Link href="/register" className="font-medium text-gold hover:underline">Create one</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-navy-deep">Welcome Back</h1>
        <p className="mt-2 text-sm text-charcoal/60">Sign in to your Nobleman account</p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
