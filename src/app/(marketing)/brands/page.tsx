import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Brands",
  description:
    "Authorized dealer for the world's top musical instrument brands — Fender, Yamaha, Gibson, Roland, Shure, and more. All products come with full manufacturer warranty.",
};

const brands = [
  {
    name: "Fender",
    country: "USA",
    description: "Iconic guitars and amplifiers since 1946. The Stratocaster, Telecaster, and Precision Bass have defined modern music.",
    categories: ["Guitars", "Basses", "Amps"],
    featured: true,
  },
  {
    name: "Yamaha",
    country: "Japan",
    description: "From entry-level to professional, Yamaha offers exceptional quality across keyboards, guitars, drums, and audio equipment.",
    categories: ["Keyboards", "Guitars", "Drums", "Live Sound"],
    featured: true,
  },
  {
    name: "Gibson",
    country: "USA",
    description: "The legendary Les Paul, SG, and ES series. Gibson guitars are the choice of rock legends and blues masters worldwide.",
    categories: ["Guitars"],
    featured: true,
  },
  {
    name: "Roland",
    country: "Japan",
    description: "Pioneers in electronic musical instruments. Roland synthesizers, digital pianos, and drum machines shape modern music production.",
    categories: ["Keyboards", "Drums", "Recording"],
    featured: true,
  },
  {
    name: "Shure",
    country: "USA",
    description: "The gold standard in microphones. From the legendary SM58 to wireless systems, Shure is trusted on stages worldwide.",
    categories: ["Live Sound", "Recording"],
    featured: true,
  },
  {
    name: "Pearl",
    country: "Japan",
    description: "World-class drum kits and percussion instruments. Pearl drums are played by professionals in every genre.",
    categories: ["Drums", "Percussion"],
    featured: false,
  },
  {
    name: "Boss",
    country: "Japan",
    description: "The world's leading manufacturer of guitar effects pedals. From the DS-1 to the GT series, Boss pedals are industry standards.",
    categories: ["Effects", "Amps"],
    featured: false,
  },
  {
    name: "Audio-Technica",
    country: "Japan",
    description: "Premium microphones and headphones for recording and live sound. The AT2020 is a studio favorite worldwide.",
    categories: ["Recording", "Live Sound"],
    featured: false,
  },
  {
    name: "Sennheiser",
    country: "Germany",
    description: "German-engineered headphones and microphones. Sennheiser delivers audiophile-grade sound for professionals and enthusiasts.",
    categories: ["Recording", "Live Sound"],
    featured: false,
  },
  {
    name: "Korg",
    country: "Japan",
    description: "Innovative synthesizers, keyboards, and tuners. Korg pushes the boundaries of electronic music technology.",
    categories: ["Keyboards", "Effects"],
    featured: false,
  },
  {
    name: "Ibanez",
    country: "Japan",
    description: "Known for fast-necked guitars favored by rock and metal players. Ibanez also makes exceptional basses and effects.",
    categories: ["Guitars", "Basses"],
    featured: false,
  },
  {
    name: "Behringer",
    country: "Germany",
    description: "Affordable professional audio equipment. Behringer makes high-quality mixers, interfaces, and monitors accessible to all.",
    categories: ["Recording", "Live Sound"],
    featured: false,
  },
];

export default function BrandsPage() {
  const featuredBrands = brands.filter((b) => b.featured);
  const otherBrands = brands.filter((b) => !b.featured);

  return (
    <div className="container-wide">
      {/* Hero */}
      <section className="py-16 text-center">
        <p className="font-accent text-lg italic text-bronze">Authorized Dealer</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
          Our Brands
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-charcoal/60">
          We are an authorized dealer for the world&apos;s top musical instrument brands.
          Every product comes with full manufacturer warranty and genuine quality guarantee.
        </p>
      </section>

      {/* Featured brands */}
      <section>
        <h2 className="font-display text-xl font-bold text-navy">Featured Brands</h2>
        <p className="mt-1 text-sm text-charcoal/60">Our most popular brands, trusted by musicians across Ghana.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredBrands.map((brand) => (
            <div key={brand.name} className="rounded-lg border border-gold/20 bg-white p-6 transition-shadow hover:shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-xl font-bold text-navy">{brand.name}</h3>
                <span className="rounded bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                  {brand.country}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{brand.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {brand.categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/shop?category=${cat.toLowerCase().replace(/ /g, "-")}`}
                    className="rounded-full bg-cream px-2.5 py-0.5 text-[10px] font-medium text-navy hover:bg-gold/10"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Other brands */}
      <section className="mt-16 border-t border-charcoal/10 pt-12">
        <h2 className="font-display text-xl font-bold text-navy">All Brands We Carry</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherBrands.map((brand) => (
            <div key={brand.name} className="rounded-lg border border-charcoal/10 bg-white p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-bold text-navy">{brand.name}</h3>
                <span className="text-[10px] font-medium text-charcoal/40">{brand.country}</span>
              </div>
              <p className="mt-2 text-sm text-charcoal/60">{brand.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {brand.categories.map((cat) => (
                  <span key={cat} className="rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-charcoal/60">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 border-t border-charcoal/10 py-12 text-center">
        <h2 className="font-display text-2xl font-bold text-navy">Can&apos;t Find Your Brand?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-charcoal/60">
          We source instruments from many more manufacturers. Contact us and we&apos;ll help you find what you need.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-block rounded-md bg-gold px-6 py-3 text-sm font-bold text-navy hover:bg-gold-light"
        >
          Contact Us
        </Link>
      </section>
    </div>
  );
}
