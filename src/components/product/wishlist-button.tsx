"use client";

import { Heart } from "lucide-react";

export function WishlistButton() {
  return (
    <button
      className="absolute right-3 bottom-3 rounded-full bg-navy-deep/60 p-2 text-cream/70 backdrop-blur-sm transition-colors hover:text-kente-red"
      aria-label="Add to wishlist"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Heart className="h-4 w-4" />
    </button>
  );
}
