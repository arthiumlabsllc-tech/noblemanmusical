import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { GoldDivider } from "@/components/brand/gold-divider";
import {
  Guitar,
  Piano,
  Drum,
  Speaker,
  Mic2,
  Music2,
  Headphones,
} from "lucide-react";

const categories = [
  {
    name: "Guitars",
    slug: "guitars",
    description: "Acoustic, Electric & Bass",
    icon: Guitar,
    gradient: "from-gold/20 to-bronze/10",
  },
  {
    name: "Keyboards",
    slug: "keyboards",
    description: "Pianos, Synths & Controllers",
    icon: Piano,
    gradient: "from-bronze/20 to-gold/10",
  },
  {
    name: "Drums & Percussion",
    slug: "drums-percussion",
    description: "Acoustic, Electronic & Traditional",
    icon: Drum,
    gradient: "from-gold/15 to-bronze/15",
  },
  {
    name: "PA & Sound",
    slug: "pa-sound",
    description: "Speakers, Mixers & Microphones",
    icon: Speaker,
    gradient: "from-bronze/15 to-gold/20",
  },
  {
    name: "Studio",
    slug: "studio",
    description: "Interfaces, Monitors & Mics",
    icon: Mic2,
    gradient: "from-gold/20 to-bronze/10",
  },
  {
    name: "Traditional Ghanaian",
    slug: "traditional-ghanaian",
    description: "Djembe, Kora & Talking Drums",
    icon: Music2,
    gradient: "from-bronze/20 to-gold/15",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Cables, Stands & More",
    icon: Headphones,
    gradient: "from-gold/10 to-bronze/20",
  },
];

export function FeaturedCategories() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <RevealOnScroll className="mb-12 text-center">
          <span className="font-accent text-sm italic tracking-widest text-bronze">
            Browse by Category
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-navy-deep md:text-4xl">
            Find Your Sound
          </h2>
          <GoldDivider className="mt-4" />
        </RevealOnScroll>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {categories.map((category, i) => {
            const Icon = category.icon;
            return (
              <RevealOnScroll key={category.slug} delay={i * 0.08}>
                <Link
                  href={`/shop/${category.slug}`}
                  className="card-lift group relative flex flex-col items-center gap-3 rounded-2xl border border-cream-dark bg-white p-6 text-center transition-all hover:border-gold/30 hover:shadow-gold md:p-8"
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.gradient} transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-bold text-navy-deep md:text-base">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-charcoal/60">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
