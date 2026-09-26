import Link from "next/link";
import Image from "next/image";
import { cn, formatGHS } from "@/lib/utils";
import { Eye } from "lucide-react";
import { WishlistButton } from "@/components/product/wishlist-button";
import type { SeedProduct } from "@/lib/data/products";

interface ProductCardProps {
  product: SeedProduct;
  className?: string;
  index?: number;
}

function getStockBadge(stock: number) {
  if (stock <= 3) return { label: "Low Stock", className: "bg-bronze/90 text-cream" };
  if (stock <= 0) return { label: "Pre-Order", className: "bg-gold/90 text-navy-deep" };
  return { label: "In Stock", className: "bg-kente-green/90 text-cream" };
}

export function ProductCard({ product, className }: ProductCardProps) {
  const badge = getStockBadge(product.stock);
  const hasDiscount = product.compareAtPrice !== null;

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn("card-lift group relative block overflow-hidden rounded-2xl bg-white", className)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-gold/5 to-bronze/10" />
        )}

        {/* Stock Badge */}
        <span className={cn("absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold", badge.className)}>
          {badge.label}
        </span>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-kente-red/90 px-2.5 py-1 text-[10px] font-semibold text-cream">
            Sale
          </span>
        )}

        {/* Quick View (desktop hover) */}
        <div className="absolute inset-0 flex items-center justify-center bg-navy-deep/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="rounded-full bg-gold/90 p-3 text-navy-deep transition-transform duration-300 group-hover:scale-110">
            <Eye className="h-5 w-5" />
          </span>
        </div>

        {/* Wishlist */}
        <WishlistButton />

        {/* Brand chip */}
        <div className="absolute bottom-3 left-3">
          <span className="rounded-full bg-navy-deep/70 px-2.5 py-1 text-[10px] font-medium text-cream backdrop-blur-sm">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-gold/70">
          {product.categoryName}
        </p>
        <h3 className="mt-1 line-clamp-2 text-sm font-medium text-charcoal transition-colors group-hover:text-gold-dark md:text-base">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={cn("h-3 w-3", i < Math.floor(product.rating) ? "fill-gold text-gold" : "fill-cream-dark text-cream-dark")}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-[10px] text-charcoal/50">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center gap-2">
          <span className="tabular-nums text-base font-bold text-navy-deep md:text-lg">
            {formatGHS(product.price)}
          </span>
          {hasDiscount && (
            <span className="tabular-nums text-xs text-charcoal/60 line-through">
              {formatGHS(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
