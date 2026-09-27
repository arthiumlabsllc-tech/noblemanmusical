import type { Metadata } from "next";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { GoldDivider } from "@/components/brand/gold-divider";

export const metadata: Metadata = { title: "About Us", description: "Learn about Nobleman Musical Center — Ghana's premier destination for quality musical instruments since our founding in Accra." };

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream pt-chrome">
      <div className="bg-navy-deep py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <RevealOnScroll>
            <span className="font-accent text-sm italic tracking-widest text-gold-light">Our Story</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-cream md:text-5xl">About Nobleman Musical Center</h1>
            <GoldDivider className="mt-6" />
          </RevealOnScroll>
        </div>
      </div>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <RevealOnScroll>
            <div className="space-y-6 text-base leading-relaxed text-charcoal/70">
              <p>Nobleman Musical Center was founded with a single vision: to bring world-class musical instruments to Ghana&apos;s talented musicians, churches, and institutions. Based in the heart of Accra, we&apos;ve grown to become the most trusted name for quality, authenticity, and service in Ghana&apos;s music industry.</p>
              <p>Our journey began with a simple observation — Ghanaian musicians, churches, and schools deserved access to the same quality instruments available anywhere in the world, without the hassle and expense of international shipping. We set out to bridge that gap.</p>
              <p>Today, we carry over 500 products from the world&apos;s leading brands — Yamaha, Roland, Fender, Shure, JBL, and more — alongside carefully curated traditional Ghanaian instruments like djembe, kora, talking drum, and atenteben. We serve everyone from first-time guitar students to major churches, national radio stations, and professional recording studios.</p>
              <p>What sets us apart is our passion. Every member of our team is a musician. We don&apos;t just sell instruments — we play them, we understand them, and we&apos;re committed to helping you find the perfect sound for your needs and budget.</p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="mt-12">
            <div className="grid grid-cols-1 gap-6 rounded-2xl bg-navy-deep p-8 text-center sm:grid-cols-3 md:gap-8">
              <div>
                <p className="font-display text-3xl font-bold text-gold">500+</p>
                <p className="mt-1 text-xs text-cream/60">Products</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-gold">50+</p>
                <p className="mt-1 text-xs text-cream/60">Institutional Partners</p>
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-gold">100%</p>
                <p className="mt-1 text-xs text-cream/60">Authentic Products</p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
