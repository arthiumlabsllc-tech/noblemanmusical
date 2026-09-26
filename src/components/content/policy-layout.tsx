import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const policyLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/shipping", label: "Shipping Policy" },
  { href: "/returns", label: "Returns & Refunds" },
];

export function PolicyLayout({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
      <div className="bg-navy-deep py-10 md:py-14">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <Link href="/" className="mb-4 inline-flex items-center gap-1 text-sm text-cream/60 hover:text-cream">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="font-display text-3xl font-bold text-cream md:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-cream/50">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl px-4 py-10 md:px-6">
        {/* Sidebar */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <nav className="sticky top-24 space-y-1">
            {policyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-sm text-charcoal/60 transition hover:bg-cream-dark/50 hover:text-navy-deep"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main className="max-w-3xl flex-1">
          <div className="prose-custom space-y-6 text-sm leading-relaxed text-charcoal/70">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
