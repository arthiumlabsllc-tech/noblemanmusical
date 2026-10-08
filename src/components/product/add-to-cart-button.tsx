"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface AddToCartButtonProps {
  productId: string;
  stock: number;
  disabled?: boolean;
}

export function AddToCartButton({ productId, stock, disabled }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock <= 5;

  function handleAddToCart() {
    // TODO(Phase 10): Integrate with cart store
    console.log("Add to cart:", { productId, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-navy">Quantity:</label>
        <div className="flex items-center border border-line">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="px-3 py-2 text-navy transition-colors hover:bg-mist disabled:opacity-40"
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-medium text-navy tabular-nums">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(Math.min(stock, quantity + 1))}
            disabled={quantity >= stock}
            className="px-3 py-2 text-navy transition-colors hover:bg-mist disabled:opacity-40"
          >
            +
          </button>
        </div>
        {isLowStock && (
          <span className="text-xs text-kente-red">Only {stock} left in stock</span>
        )}
      </div>

      {/* Add to cart button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || disabled}
        className={cn(
          "w-full border px-6 py-3.5 text-sm font-semibold tracking-wide transition-colors",
          isOutOfStock
            ? "cursor-not-allowed border-line bg-mist text-muted"
            : added
              ? "border-kente-green bg-kente-green text-white"
              : "border-navy bg-navy text-white hover:border-gold hover:bg-gold"
        )}
      >
        {isOutOfStock ? "Out of Stock" : added ? "Added to Cart!" : "Add to Cart"}
      </button>

      {/* Stock status */}
      {!isOutOfStock && (
        <p className="text-center text-xs text-body">
          {stock > 10 ? "In stock" : `Only ${stock} left — order soon`}
        </p>
      )}
    </div>
  );
}
