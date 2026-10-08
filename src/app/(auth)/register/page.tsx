import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create Account",
  robots: { index: false, follow: false },
};

const inputCls =
  "mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none";

export default function RegisterPage() {
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
          <h1 className="text-3xl font-bold text-navy">Create Account</h1>
          <p className="mt-2 text-sm text-body">Join the Nobleman community</p>
        </div>

        {/* Form */}
        <form action="#" method="POST" className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-body">
              Full Name
            </label>
            <input id="name" name="name" type="text" autoComplete="name" required className={inputCls} />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-body">
              Email
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required className={inputCls} />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-body">
              Phone (optional)
            </label>
            <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputCls} />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-body">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className={inputCls}
            />
            <p className="mt-1 text-xs text-muted">Minimum 8 characters</p>
          </div>

          <button
            type="submit"
            className="w-full border border-navy bg-navy px-4 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:border-gold hover:bg-gold"
          >
            Create Account
          </button>
        </form>

        {/* Login link */}
        <p className="mt-6 text-center text-sm text-body">
          Already have an account?{" "}
          <Link href="/login" className="text-underline-gold font-medium text-navy hover:text-gold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
