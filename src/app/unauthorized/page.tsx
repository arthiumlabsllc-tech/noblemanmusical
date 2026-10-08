import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "Unauthorized",
  robots: { index: false, follow: false },
};

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-4">
      <div className="text-center">
        <Logo variant="icon" tone="gold" className="mx-auto h-16 w-16" />
        <h1 className="mt-6 font-display text-4xl font-bold text-cream">Access Denied</h1>
        <p className="mt-4 text-lg text-cream/60">
          You don&apos;t have permission to view this page.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-gold px-6 py-2.5 text-sm font-semibold text-navy hover:bg-gold-light"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
