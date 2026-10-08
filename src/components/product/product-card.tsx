import Link from "next/link";
import Image from "next/image";
import { formatGHS } from "@/lib/utils/formatGHS";

interface ProductCardProps {
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  image?: string;
  brand?: string;
  isFeatured?: boolean;
  stock?: number;
  rating?: number;
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-3.5 w-3.5 text-gold"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 17.6l1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

export function ProductCard({
  slug,
  name,
  price,
  compareAtPrice,
  image,
  brand,
  isFeatured,
  stock = 0,
}: ProductCardProps) {
  const discount = compareAtPrice
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className="pcard group">
      <div className="pcard-media">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="pcard-img"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-cream">
            {/* Line-art instrument placeholder */}
            <svg
              className="h-20 w-20 text-gold/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19V6l12-3v13M9 19c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zm12-3c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2z"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        {isFeatured && (
          <span className="pcard-badge bg-gold">Featured</span>
        )}
        {discount > 0 && (
          <span className="pcard-badge bg-kente-red">
            -{discount}%
          </span>
        )}

        {/* Overlapping info panel (also the product link) */}
        <Link href={`/shop/${slug}`} className="pcard-info">
          {brand && (
            <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
              {brand}
            </span>
          )}
          <span className="text-[17px] font-medium leading-none text-navy tabular-nums">
            {formatGHS(price)}
          </span>
          <span className="line-clamp-2 text-sm leading-snug text-body">
            {name}
          </span>
          <Stars />
        </Link>

        {/* Hover action circles */}
        <div className="pcard-actions">
          <button type="button" className="card-action" aria-label="Add to wishlist">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button type="button" className="card-action" aria-label="Add to cart">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
          <button type="button" className="card-action" aria-label="Quick preview">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Low stock note (below image, always visible) */}
      {stock > 0 && stock <= 5 && (
        <p className="mt-2 text-xs font-medium text-kente-red">Only {stock} left</p>
      )}
    </div>
  );
}
