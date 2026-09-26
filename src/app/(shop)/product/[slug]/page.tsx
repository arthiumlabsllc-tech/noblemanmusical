import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/lib/data/products";
import Link from "next/link";
import { GoldDivider } from "@/components/brand/gold-divider";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ProductCard } from "@/components/product/product-card";
import { ProductDetail } from "./product-detail";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description,
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
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
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
