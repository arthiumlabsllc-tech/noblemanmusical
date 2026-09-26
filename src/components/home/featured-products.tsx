import Link from "next/link";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { GoldDivider } from "@/components/brand/gold-divider";
import { formatGHS } from "@/lib/utils";
import { Eye } from "lucide-react";
import { WishlistButton } from "@/components/product/wishlist-button";

/* ── Seed products for initial display ── */
const featuredProducts = [
  {
    slug: "yamaha-c40-classical-guitar",
    name: "Yamaha C40 Classical Guitar",
    brand: "Yamaha",
    price: 185000, // ₵1,850.00
    compareAtPrice: 220000,
    image: "/products/yamaha-c40.jpg",
    stock: 12,
    isFeatured: true,
    category: "guitars",
  },
  {
    slug: "roland-go-piano-88",
    name: "Roland GO:PIANO 88",
    brand: "Roland",
    price: 450000,
    compareAtPrice: null,
    image: "/products/roland-go-piano.jpg",
    stock: 5,
    isFeatured: true,
    category: "keyboards",
  },
  {
    slug: "shure-sm58-vocal-microphone",
    name: "Shure SM58 Vocal Microphone",
    brand: "Shure",
    price: 135000,
    compareAtPrice: 155000,
    image: "/products/shure-sm58.jpg",
    stock: 20,
    isFeatured: true,
    category: "studio",
  },
  {
    slug: "fender-player-stratocaster",
    name: "Fender Player Stratocaster",
    brand: "Fender",
    price: 1250000,
    compareAtPrice: null,
    image: "/products/fender-strat.jpg",
    stock: 3,
    isFeatured: true,
    category: "guitars",
  },
  {
    slug: "yamaha-psr-e373",
    name: "Yamaha PSR-E373 Keyboard",
    brand: "Yamaha",
    price: 320000,
    compareAtPrice: 380000,
    image: "/products/yamaha-psr.jpg",
    stock: 8,
    isFeatured: true,
    category: "keyboards",
  },
  {
    slug: "djembe-professional-mali",
    name: "Professional Mali Djembe",
    brand: "Traditional",
    price: 95000,
    compareAtPrice: null,
    image: "/products/djembe-mali.jpg",
    stock: 6,
    isFeatured: true,
    category: "traditional-ghanaian",
  },
  {
    slug: "jbl-eon715-powered-speaker",
    name: "JBL EON715 Powered Speaker",
    brand: "JBL",
    price: 780000,
    compareAtPrice: 850000,
    image: "/products/jbl-eon715.jpg",
    stock: 4,
    isFeatured: true,
    category: "pa-sound",
  },
  {
    slug: "roland-td-07kv-drum-kit",
    name: "Roland TD-07KV Electronic Drum Kit",
    brand: "Roland",
    price: 1650000,
    compareAtPrice: null,
    image: "/products/roland-td07.jpg",
    stock: 2,
    isFeatured: true,
    category: "drums-percussion",
  },
];

function getStockBadge(stock: number) {
  if (stock <= 3) return { label: "Low Stock", className: "bg-bronze/90 text-cream" };
  return { label: "In Stock", className: "bg-kente-green/90 text-cream" };
}

export function FeaturedProducts() {
  return (
    <section className="bg-navy-deep py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <RevealOnScroll className="mb-12 text-center">
          <span className="font-accent text-sm italic tracking-widest text-gold-light">
            Curated Selection
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">
            Featured Instruments
          </h2>
          <GoldDivider className="mt-4" />
        </RevealOnScroll>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {featuredProducts.map((product, i) => {
            const badge = getStockBadge(product.stock);
            return (
              <RevealOnScroll key={product.slug} delay={i * 0.06}>
                <Link
                  href={`/product/${product.slug}`}
                  className="card-lift group relative block overflow-hidden rounded-2xl bg-navy"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-navy-light">
                    {/* Placeholder gradient for now */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-bronze/5" />

                    {/* Stock Badge */}
                    <span
                      className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold ${badge.className}`}
                    >
                      {badge.label}
                    </span>

                    {/* Quick View (desktop hover) */}
                    <div className="absolute inset-0 flex items-center justify-center bg-navy-deep/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="rounded-full bg-gold/90 p-3 text-navy-deep">
                        <Eye className="h-5 w-5" />
                      </span>
                    </div>

                    {/* Wishlist */}
                    <WishlistButton />
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-gold/70">
                      {product.brand}
                    </span>
                    <h3 className="mt-1 line-clamp-2 text-sm font-medium text-cream group-hover:text-gold">
                      {product.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="tabular-nums text-base font-bold text-gold">
                        {formatGHS(product.price)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="tabular-nums text-xs text-cream/60 line-through">
                          {formatGHS(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </RevealOnScroll>
            );
          })}
        </div>

        {/* View All */}
        <RevealOnScroll className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-gold px-8 py-3 font-semibold text-gold transition-all hover:bg-gold hover:text-navy-deep"
          >
            View All Products
          </Link>
        </RevealOnScroll>
      </div>
    </section>
  );
}
