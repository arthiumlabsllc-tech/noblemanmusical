import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-8xl font-bold text-gold/20">404</p>
        <h1 className="mt-4 font-display text-2xl font-bold text-navy">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-charcoal/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/"
            className="rounded-md bg-gold px-6 py-3 text-sm font-bold text-navy hover:bg-gold-light"
          >
            Go Home
          </Link>
          <Link
            href="/shop"
            className="rounded-md border border-charcoal/20 px-6 py-3 text-sm font-medium text-navy hover:border-gold hover:text-gold"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
