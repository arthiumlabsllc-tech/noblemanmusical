import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product/product-card";
import { CategoryCard } from "@/components/product/category-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { heroImage } from "@/lib/data/product-images";
import { brandLogos } from "@/lib/data/brand-logos";
import { getFeaturedProducts, getCategories } from "@/lib/data/storefront";

const trustBadges = [
  { icon: "truck", title: "Free Accra Delivery", desc: "Orders over GH₵ 500" },
  { icon: "shield", title: "Genuine Products", desc: "Authorized dealer" },
  { icon: "headphones", title: "Expert Support", desc: "Musicians helping musicians" },
  { icon: "refresh", title: "Easy Returns", desc: "14-day return policy" },
];

function TrustIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    truck: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
    ),
    shield: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    headphones: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M3 18v-6a9 9 0 0118 0v6M3 18a2 2 0 002 2h1a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4zm18 0a2 2 0 01-2 2h-1a1 1 0 01-1-1v-4a1 1 0 011-1h1a1 1 0 011 1v4z" />
    ),
    refresh: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    ),
  };
  return (
    <svg className="h-9 w-9" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[name]}
    </svg>
  );
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(8),
    getCategories(),
  ]);
  return (
    <div>
      {/* ── HERO — split text / photo with overlapping offer slab ── */}
      <section className="container-wide grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-16">
        {/* Text */}
        <div className="order-2 lg:order-1 lg:max-w-[540px]">
          <span className="font-script block text-3xl leading-none text-gold sm:text-4xl">
            Find your sound
          </span>
          <h1 className="mt-3 text-4xl font-bold leading-[0.95] text-navy sm:text-5xl xl:text-6xl">
            Get <span className="text-gold">25% Off</span> Premium Instruments
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-body">
            Trusted by churches, radio stations, schools, professional musicians, and studios
            across Ghana. Authorized dealer for Fender, Gibson, Yamaha, Roland, and more.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link href="/shop" className="btn btn-outline" data-text="Shop All Instruments">
              <span>Shop All Instruments</span>
            </Link>
            <Link href="/b2b" className="text-underline-gold text-base font-medium text-navy">
              B2B &amp; Bulk Orders
            </Link>
          </div>
        </div>

        {/* Visual — real product photo with offset accent + overlapping offer slab */}
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto w-full max-w-[440px] sm:max-w-[460px] lg:ml-auto lg:mr-0 lg:max-w-[520px]">
            <div className="relative h-[340px] w-full overflow-hidden bg-navy sm:h-[400px] lg:h-[460px]">
              <Image
                src={heroImage}
                alt="Wall of hanging guitars at Nobleman Musical Center"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 50vw"
                className="object-cover"
              />
              {/* thin inner frame accent */}
              <div className="pointer-events-none absolute inset-3 border border-white/25 sm:inset-4" aria-hidden />
            </div>

            {/* Overlapping offer slab */}
            <div className="absolute -bottom-6 left-3 flex max-w-[210px] flex-col items-start border border-line bg-white p-4 sm:left-6 sm:max-w-[240px] sm:p-5 lg:-left-10 lg:max-w-[260px] lg:p-6">
              <h4 className="text-base leading-tight text-navy sm:text-lg">
                Up to <span className="text-gold">20%</span> off studio gear
              </h4>
              <Link href="/shop?category=recording" className="btn btn-solid btn-sm mt-3 sm:mt-4" data-text="Explore">
                <span>Explore</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ─────────────────────────────────────────── */}
      <section className="border-y border-line">
        <div className="container-wide grid grid-cols-2 divide-line md:grid-cols-4 md:divide-x">
          {trustBadges.map((badge) => (
            <div key={badge.title} className="flex items-center gap-4 px-2 py-8 sm:px-6">
              <div className="text-gold">
                <TrustIcon name={badge.icon} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-navy">{badge.title}</h3>
                <p className="mt-1 text-sm text-body">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────── */}
      <section className="container-wide py-16 sm:py-24">
        <SectionHeading
          script="Featured"
          title="Instruments"
          subtitle="Hand-picked by our team of musicians"
        />
        <div className="mt-12 grid grid-cols-2 gap-5 lg:grid-cols-4 lg:gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link href="/shop" className="btn btn-outline" data-text="See All Products">
            <span>See All Products</span>
          </Link>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="bg-mist py-16 sm:py-24">
        <div className="container-wide">
          <SectionHeading script="Browse" title="Categories" />
          <div className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── B2B PROMO (dual banners) ─────────────────────────────── */}
      <section className="container-wide py-16 sm:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Organizations */}
          <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-navy-deep md:aspect-auto">
            <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-deep" />
            <div className="relative z-10 m-6 flex max-w-sm flex-col items-start bg-white/90 p-8">
              <h4 className="text-xl leading-tight text-navy">
                Bulk Pricing for <span className="text-gold">Churches &amp; Schools</span>
              </h4>
              <p className="mt-3 text-sm leading-relaxed text-body">
                Custom quotes and dedicated support for organizations, studios, and radio stations.
              </p>
              <Link href="/b2b" className="btn btn-solid btn-sm mt-5" data-text="Request a Quote">
                <span>Request a Quote</span>
              </Link>
            </div>
          </div>
          {/* Visit store */}
          <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-navy md:aspect-auto">
            <div className="absolute inset-6 border border-gold/20" />
            <div className="relative z-10 flex max-w-sm flex-col items-start p-8 text-center sm:text-left">
              <h2 className="text-3xl font-bold leading-tight text-cream">
                Visit Our Showroom in Accra
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-cream/60">
                Try before you buy. Speak with real musicians, seven days a week.
              </p>
              <Link href="/contact" className="btn btn-light-outline btn-sm mt-6" data-text="Get Directions">
                <span>Get Directions</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── BRAND BAND (dark strip, original logos) ──────────────── */}
      <section className="bg-navy py-12 md:py-16">
        <div className="container-wide">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-cream/50">
            Authorized Dealer For
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:justify-between">
            {brandLogos.map((brand) => (
              <div
                key={brand.name}
                title={brand.name}
                className="flex h-16 w-28 items-center justify-center border border-line bg-white p-3 transition-colors hover:border-gold sm:h-20 sm:w-32"
              >
                <Image
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  width={120}
                  height={120}
                  unoptimized
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────── */}
      <section className="container-wide py-16 sm:py-24">
        <div className="mx-auto max-w-xl text-center">
          <SectionHeading script="Stay" title="In Tune" />
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-body">
            Get notified about new arrivals, exclusive deals, and music tips.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-stretch">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              className="h-14 w-full min-w-0 flex-1 border border-gold bg-transparent px-4 text-base text-navy placeholder:text-muted focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="btn btn-gold-solid h-14 shrink-0"
              data-text="Subscribe"
            >
              <span>Subscribe</span>
            </button>
          </form>
          <p className="mt-3 text-xs text-muted">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
