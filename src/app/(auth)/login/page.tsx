import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign In",
  robots: { index: false, follow: false },
};

const inputCls =
  "mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none";

export default function LoginPage() {
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
          <h1 className="text-3xl font-bold text-navy">Welcome Back</h1>
          <p className="mt-2 text-sm text-body">Sign in to your Nobleman account</p>
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-body">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputCls}
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="remember"
                className="h-4 w-4 border-line accent-gold"
              />
              <span className="ml-2 text-sm text-body">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-underline-gold text-sm text-navy hover:text-gold">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full border border-navy bg-navy px-4 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:border-gold hover:bg-gold"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-3 text-muted">Or continue with</span>
          </div>
        </div>

        {/* Google */}
        <form action="/api/auth/signin/google" method="POST">
          <input type="hidden" name="csrfToken" />
          <button
            type="submit"
            className="w-full border border-line bg-white px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:border-gold hover:text-gold"
          >
            Sign in with Google
          </button>
        </form>

        {/* Register link */}
        <p className="mt-6 text-center text-sm text-body">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-underline-gold font-medium text-navy hover:text-gold">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
