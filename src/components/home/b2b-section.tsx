import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { Church, Radio, GraduationCap, ArrowRight } from "lucide-react";

const segments = [
  {
    title: "For Churches",
    description:
      "Complete sound solutions for worship — from PA systems to keyboards and microphones. Bulk pricing available.",
    icon: Church,
    href: "/churches",
    accent: "from-gold/20 to-transparent",
  },
  {
    title: "For Radio Stations",
    description:
      "Professional broadcast equipment — studio monitors, microphones, mixers, and accessories for on-air excellence.",
    icon: Radio,
    href: "/radio-stations",
    accent: "from-bronze/20 to-transparent",
  },
  {
    title: "For Schools",
    description:
      "Equip your music program with durable, quality instruments. Special educational pricing and package deals.",
    icon: GraduationCap,
    href: "/schools",
    accent: "from-gold/15 to-transparent",
  },
];

export function B2BSection() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <RevealOnScroll className="mb-12 text-center">
          <span className="font-accent text-sm italic tracking-widest text-bronze">
            Institutional Partners
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy-deep md:text-4xl">
            Trusted by Ghana&apos;s Leading Institutions
          </h2>
        </RevealOnScroll>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {segments.map((segment, i) => {
            const Icon = segment.icon;
            return (
              <RevealOnScroll key={segment.href} delay={i * 0.12}>
                <div className="card-lift group relative overflow-hidden rounded-2xl border border-cream-dark bg-white p-8">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${segment.accent} opacity-0 transition-opacity group-hover:opacity-100`}
                  />
                  <div className="relative">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-deep">
                      <Icon className="h-6 w-6 text-gold" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-navy-deep">
                      {segment.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                      {segment.description}
                    </p>
                    <Link
                      href={segment.href}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-dark"
                    >
                      Request a Quote
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
