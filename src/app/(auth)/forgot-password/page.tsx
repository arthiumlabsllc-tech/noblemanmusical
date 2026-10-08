import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reset Password",
  robots: { index: false, follow: false },
};

const inputCls =
  "mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-mist px-4 py-12">
      <div className="w-full max-w-md border border-line bg-white p-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/">
            <Logo variant="icon" tone="navy" className="h-12 w-12" />
          </Link>
        </div>

        {/* Header */}
        <div className="mt-6 text-center">
          <h1 className="text-3xl font-bold text-navy">Reset Password</h1>
          <p className="mt-2 text-sm text-body">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        {/* Form */}
        <form action="#" method="POST" className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-body">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputCls}
            />
          </div>

          <button
            type="submit"
            className="w-full border border-navy bg-navy px-4 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:border-gold hover:bg-gold"
          >
            Send Reset Link
          </button>
        </form>

        {/* Back link */}
        <p className="mt-6 text-center text-sm text-body">
          <Link href="/login" className="text-underline-gold font-medium text-navy hover:text-gold">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
