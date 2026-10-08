"use client";

import { useWishlistStore } from "@/lib/store/wishlist-store";

type AddToWishlistButtonProps = {
  productId: string;
  productSlug: string;
  productName: string;
  productBrand: string;
  productPrice: number;
  productImage?: string;
  productCategory?: string;
  className?: string;
};

export default function AddToWishlistButton({
  productId,
  productSlug,
  productName,
  productBrand,
  productPrice,
  productImage,
  productCategory,
  className = "",
}: AddToWishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(productId);

  const handleClick = () => {
    if (inWishlist) {
      removeItem(productId);
    } else {
      addItem({
        id: productId,
        slug: productSlug,
        name: productName,
        brand: productBrand,
        price: productPrice,
        image: productImage,
        category: productCategory,
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center rounded-md transition-colors ${
        inWishlist
          ? "bg-kente-red/10 text-kente-red hover:bg-kente-red/20"
          : "bg-charcoal/5 text-charcoal/40 hover:bg-charcoal/10 hover:text-charcoal"
      } ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <svg
        className="h-5 w-5"
        fill={inWishlist ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}
