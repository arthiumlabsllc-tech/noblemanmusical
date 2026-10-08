"use client";

import Link from "next/link";
import { useWishlistStore } from "@/lib/store/wishlist-store";
import { formatGHS } from "@/lib/utils/formatGHS";
import { useCartStore } from "@/lib/store/cart-store";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem: addCartItem } = useCartStore();

  const handleAddToCart = (item: typeof items[0]) => {
    addCartItem({
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      maxStock: 10,
    });
  };

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-navy">My Wishlist</h1>
        <div className="border border-line bg-white p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-line" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="mt-4 text-lg font-medium text-navy">Your wishlist is empty</p>
          <p className="mt-2 text-sm text-muted">Browse our collection and save items you love.</p>
          <Link href="/shop" className="mt-6 inline-block border border-navy bg-navy px-6 py-2.5 text-sm font-bold text-white transition-colors hover:border-gold hover:bg-gold">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">My Wishlist</h1>
          <p className="text-sm text-body">{items.length} item{items.length !== 1 ? "s" : ""} saved</p>
        </div>
        <button
          onClick={clearWishlist}
          className="border border-line px-3 py-1.5 text-xs font-medium text-body transition-colors hover:border-kente-red hover:text-kente-red"
        >
          Clear All
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 border border-line bg-white p-4">
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-mist">
              <div className="flex h-full w-full items-center justify-center text-3xl text-line">🎸</div>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted">{item.brand}{item.category && ` · ${item.category}`}</p>
              <Link href={`/shop/${item.slug}`} className="font-medium text-navy hover:text-gold line-clamp-1">
                {item.name}
              </Link>
              <p className="mt-1 font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>
                {formatGHS(item.price)}
              </p>
              <p className="mt-1 text-[10px] text-muted">
                Added {new Date(item.addedAt).toLocaleDateString("en-GB")}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="border border-navy bg-navy px-3 py-1.5 text-xs font-bold text-white transition-colors hover:border-gold hover:bg-gold"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="border border-line px-3 py-1.5 text-xs font-medium text-kente-red transition-colors hover:border-kente-red"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue shopping */}
      <div className="border border-line bg-mist p-6 text-center">
        <p className="text-sm text-body">Looking for more?</p>
        <Link href="/shop" className="text-underline-gold mt-2 inline-block text-sm font-medium text-navy hover:text-gold">
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}
