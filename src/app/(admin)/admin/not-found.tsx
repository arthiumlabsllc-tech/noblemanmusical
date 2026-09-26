import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 text-center">
      <div>
        <p className="font-display text-6xl font-bold text-navy-deep">404</p>
        <h1 className="mt-3 font-display text-xl font-bold text-navy-deep">
          Page Not Found
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-charcoal/60">
          This admin page doesn&apos;t exist. Use the sidebar to navigate.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gold px-5 py-2.5 text-sm font-semibold text-navy-deep hover:bg-gold-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
