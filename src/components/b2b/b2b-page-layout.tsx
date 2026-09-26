import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { GoldDivider } from "@/components/brand/gold-divider";
import { B2BQuoteForm } from "./b2b-quote-form";

interface B2BPageConfig {
  title: string;
  subtitle: string;
  description: string;
  benefits: string[];
  orgType: string;
}

export function B2BPageLayout({ title, subtitle, description, benefits, orgType }: B2BPageConfig) {
  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
      {/* Hero */}
      <div className="bg-navy-deep py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <RevealOnScroll>
            <span className="font-accent text-sm italic tracking-widest text-gold-light">{subtitle}</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-cream md:text-5xl">{title}</h1>
            <GoldDivider className="mt-6" />
            <p className="mt-6 text-base leading-relaxed text-cream/70 md:text-lg">{description}</p>
          </RevealOnScroll>
        </div>
      </div>

      {/* Benefits */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <RevealOnScroll className="mb-10 text-center">
            <h2 className="font-display text-2xl font-bold text-navy-deep">Why Partner With Us?</h2>
          </RevealOnScroll>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div className="rounded-xl border border-cream-dark bg-white p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                    <span className="text-lg font-bold text-gold">{i + 1}</span>
                  </div>
                  <p className="text-sm leading-relaxed text-charcoal/70">{benefit}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="bg-navy-deep py-16">
        <div className="mx-auto max-w-2xl px-4 md:px-6">
          <RevealOnScroll className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold text-cream">Request a Quote</h2>
            <p className="mt-2 text-sm text-cream/60">Tell us what you need and we&apos;ll prepare a custom proposal.</p>
          </RevealOnScroll>
          <B2BQuoteForm orgType={orgType} />
        </div>
      </section>
    </div>
  );
}
