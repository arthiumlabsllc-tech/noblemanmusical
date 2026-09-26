import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { GoldDivider } from "@/components/brand/gold-divider";

export function BrandStory() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
        <RevealOnScroll>
          <span className="font-accent text-sm italic tracking-widest text-bronze">
            Our Story
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy-deep md:text-4xl">
            A Legacy of Sound
          </h2>
          <GoldDivider className="mt-4" />
          <p className="mt-8 text-base leading-relaxed text-charcoal/70 md:text-lg">
            Nobleman Musical Center was founded with a single vision: to bring
            world-class musical instruments to Ghana&apos;s talented musicians,
            churches, and institutions. From the heart of Accra, we&apos;ve become
            the trusted name for quality, authenticity, and service — bridging
            Ghana&apos;s rich musical heritage with the finest instruments from
            around the globe.
          </p>
          <p className="mt-4 text-base leading-relaxed text-charcoal/70 md:text-lg">
            Whether you&apos;re a church music director, a radio engineer, a
            school teacher, or a performing artist — we exist to help you find
            your sound.
          </p>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div>
              <p className="font-display text-3xl font-bold text-gold md:text-4xl">
                500+
              </p>
              <p className="mt-1 text-xs text-charcoal/60 md:text-sm">
                Instruments Sold
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-gold md:text-4xl">
                50+
              </p>
              <p className="mt-1 text-xs text-charcoal/60 md:text-sm">
                Churches Equipped
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-gold md:text-4xl">
                100%
              </p>
              <p className="mt-1 text-xs text-charcoal/60 md:text-sm">
                Authentic Products
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
