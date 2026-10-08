import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageGallery } from "@/components/product/image-gallery";
import { AddToCartButton } from "@/components/product/add-to-cart-button";
import ReviewsSection from "@/components/product/reviews-section";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { formatGHS } from "@/lib/utils/formatGHS";
import { getProductBySlug, getRelatedProducts } from "@/lib/data/storefront";

// Placeholder reviews — to be wired to the reviews table in the dashboard phase
const sampleReviews = [
  {
    id: "1",
    author: "Kwame A.",
    rating: 5,
    title: "Absolutely love this instrument!",
    body: "The quality is outstanding. Sounds amazing and plays like a dream. Highly recommended for any serious musician.",
    date: "2024-08-15",
    verified: true,
    helpful: 12,
    recommend: true,
  },
  {
    id: "2",
    author: "Ama D.",
    rating: 4,
    title: "Great value for money",
    body: "Very happy with this purchase. The build quality is excellent and it arrived in perfect condition. Would buy from Nobleman again.",
    date: "2024-07-22",
    verified: true,
    helpful: 8,
    recommend: true,
  },
  {
    id: "3",
    author: "Yaw M.",
    rating: 5,
    title: "Professional quality",
    body: "I use this for my church and it never disappoints. The sound is rich and full. Nobleman's service was also top-notch.",
    date: "2024-06-10",
    verified: false,
    helpful: 5,
    recommend: true,
  },
];

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: `${product.name} | ${product.brand}`,
    description: product.description ?? product.name,
    openGraph: {
      title: product.name,
      description: product.description ?? product.name,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product.categorySlug, product.slug, 4);
  const galleryImages = product.image ? [product.image] : [];
  const description = product.longDescription || product.description;

  const discount = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) * 100
      )
    : 0;

  return (
    <div className="container-wide py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-body">
        <Link href="/" className="text-underline-gold hover:text-gold">Home</Link>
        <span className="mx-2 text-muted">/</span>
        <Link href="/shop" className="text-underline-gold hover:text-gold">Shop</Link>
        <span className="mx-2 text-muted">/</span>
        <Link href={`/shop?category=${product.categorySlug}`} className="text-underline-gold hover:text-gold">{product.category}</Link>
        <span className="mx-2 text-muted">/</span>
        <span className="text-navy">{product.name}</span>
      </nav>

      {/* Product section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image gallery */}
        <ImageGallery images={galleryImages} productName={product.name} />

        {/* Product info */}
        <div className="space-y-6">
          {/* Brand */}
          <p className="text-sm font-medium uppercase tracking-wider text-gold">{product.brand}</p>

          {/* Name */}
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">{product.name}</h1>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>
              {formatGHS(product.price)}
            </span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-muted line-through" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatGHS(product.compareAtPrice)}
                </span>
                <span className="bg-kente-red px-2 py-0.5 text-xs font-bold text-white">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <span className="h-2 w-2 rounded-full bg-kente-green" />
                <span className="text-sm text-kente-green">
                  {product.stock > 10 ? "In stock" : `Only ${product.stock} left`}
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-kente-red" />
                <span className="text-sm text-kente-red">Out of stock</span>
              </>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-sm leading-relaxed text-body">{description}</p>
          )}

          {/* Add to cart */}
          <AddToCartButton productId={product.slug} stock={product.stock} />

          {/* Specs table */}
          {Object.keys(product.specs).length > 0 && (
            <div className="border-t border-line pt-6">
              <h2 className="mb-4 text-lg font-semibold text-navy">Specifications</h2>
              <dl className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex border-b border-line py-2">
                    <dt className="w-1/3 text-sm font-medium text-muted">{key}</dt>
                    <dd className="w-2/3 text-sm text-body">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <ReviewsSection
          reviews={sampleReviews}
          averageRating={4.7}
          totalReviews={sampleReviews.length}
        />
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20">
          <SectionHeading script="You May" title="Also Like" />
          <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-8">
            {related.map((p) => (
              <ProductCard key={p.slug} {...p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
