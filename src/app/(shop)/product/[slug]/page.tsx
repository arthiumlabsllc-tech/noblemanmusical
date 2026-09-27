import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/data/products";
import Link from "next/link";
import { GoldDivider } from "@/components/brand/gold-divider";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ProductCard } from "@/components/product/product-card";
import { JsonLd } from "@/components/seo/json-ld";
import { productLd, breadcrumbLd } from "@/lib/seo/json-ld";
import { formatGHS } from "@/lib/utils";
import { ProductDetail } from "./product-detail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Prerender every product at build time. The catalogue is known ahead of time,
 * so static HTML is strictly better for crawlers (and First Contentful Paint)
 * than rendering on each request.
 */
export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) {
    // A dead slug should not be indexed, and must not canonicalise onto a live
    // product either.
    return { title: "Product Not Found", robots: { index: false, follow: false } };
  }

  const canonical = `/product/${product.slug}`;
  // Lead with price and stock status: those are the two things a searcher
  // comparing instruments in Ghana is actually deciding on.
  const availability =
    product.stock > 0 ? `In stock — ${product.stock} available` : "Currently out of stock";
  const description = `${product.name} by ${product.brand} — ${formatGHS(
    product.price
  )} at Nobleman Musical Center, Accra. ${availability}. ${product.description}`.slice(
    0,
    155
  );

  return {
    // product.name already contains the brand, so appending it again only
    // pushes the title past the ~60 characters Google displays.
    title: product.name,
    description,
    keywords: [product.brand, product.categoryName, ...product.tags, "musical instruments Ghana", "Accra"],
    alternates: { canonical },
    openGraph: {
      title: `${product.name} — ${product.brand}`,
      description,
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${product.brand}`,
      description,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-cream pt-chrome">
      {/* Product rich results + breadcrumb trail for the SERP. */}
      <JsonLd
        data={[
          productLd(product),
          breadcrumbLd([
            { name: "Shop", path: "/shop" },
            { name: product.categoryName, path: `/shop/${product.categorySlug}` },
            { name: product.name, path: `/product/${product.slug}` },
          ]),
        ]}
      />

      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 lg:px-8">
        <nav className="flex items-center gap-2 text-xs text-charcoal/50">
          <Link href="/" className="hover:text-charcoal">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-charcoal">Shop</Link>
          <span>/</span>
          <Link href={`/shop/${product.categorySlug}`} className="hover:text-charcoal">{product.categoryName}</Link>
          <span>/</span>
          <span className="text-charcoal">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <ProductDetail product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
          <RevealOnScroll className="mb-8 text-center">
            <h2 className="font-display text-2xl font-bold text-navy-deep">
              You May Also Like
            </h2>
            <GoldDivider className="mt-3" />
          </RevealOnScroll>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.slug} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
