"use client";

import { useCart } from "@/hooks/use-cart";
import { formatGHS } from "@/lib/utils";
import { ShoppingBag, Minus, Plus, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const subtotalAmount = subtotal();
  const deliveryFee = subtotalAmount >= 50000 ? 0 : 5000; // Free over ₵500
  const total = subtotalAmount + deliveryFee;
  const FREE_DELIVERY_THRESHOLD = 50000;
  const remaining = FREE_DELIVERY_THRESHOLD - subtotalAmount;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream pt-chrome">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center md:px-6">
          <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-charcoal/50" />
          <h1 className="font-display text-3xl font-bold text-navy-deep">Your Cart is Empty</h1>
          <p className="mt-3 text-charcoal/60">Browse our collection and find your perfect instrument.</p>
          <Link
            href="/shop"
            className="mt-8 inline-flex rounded-lg bg-gold px-8 py-3 font-semibold text-navy-deep hover:bg-gold-light"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-chrome">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 lg:px-8">
        <h1 className="mb-4 font-display text-3xl font-bold text-navy-deep">Shopping Cart</h1>

        {/* Free delivery progress */}
        <div className="mb-6 rounded-xl border border-cream-dark bg-white p-4">
          {remaining > 0 ? (
            <>
              <div className="flex items-center gap-2 text-sm text-charcoal/60">
                <Truck className="h-4 w-4 text-gold" />
                <span>Add <strong className="text-gold-dark">{formatGHS(remaining)}</strong> more for free delivery in Accra</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-dark">
                <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${Math.min(100, (subtotalAmount / FREE_DELIVERY_THRESHOLD) * 100)}%` }} />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm font-medium text-kente-green">
              <span>🎉</span>
              <span>You&apos;ve unlocked free delivery in Accra!</span>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item) => (
              <div key={item.slug} className="flex gap-4 rounded-xl border border-cream-dark bg-white p-4 md:gap-6 md:p-6">
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-cream-dark md:h-32 md:w-32">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} width={128} height={128} className="h-full w-full object-cover" sizes="(max-width: 768px) 96px, 128px" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-navy/5 to-bronze/5" />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gold">{item.brand}</p>
                      <Link href={`/product/${item.slug}`} className="text-sm font-medium text-charcoal hover:text-gold-dark md:text-base">
                        {item.name}
                      </Link>
                    </div>
                    <button onClick={() => removeItem(item.slug)} className="text-charcoal/60 hover:text-kente-red" aria-label={`Remove ${item.name}`}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-cream-dark">
                      <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} className="flex h-9 w-9 items-center justify-center text-charcoal/60 hover:text-charcoal">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="flex h-9 w-10 items-center justify-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} className="flex h-9 w-9 items-center justify-center text-charcoal/60 hover:text-charcoal">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="tabular-nums text-lg font-bold text-navy-deep">
                      {formatGHS(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="rounded-xl border border-cream-dark bg-white p-6 lg:sticky lg:top-4 lg:self-start">
            <h2 className="mb-4 font-display text-lg font-bold text-navy-deep">Order Summary</h2>
            <div className="space-y-3 border-b border-cream-dark pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/60">Subtotal ({totalItems()} items)</span>
                <span className="tabular-nums font-medium">{formatGHS(subtotalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/60">Delivery</span>
                <span className="tabular-nums font-medium">
                  {deliveryFee === 0 ? (
                    <span className="text-kente-green">Free</span>
                  ) : (
                    formatGHS(deliveryFee)
                  )}
                </span>
              </div>
            </div>
            <div className="flex justify-between py-4">
              <span className="font-medium text-charcoal">Total</span>
              <span className="tabular-nums text-xl font-bold text-navy-deep">{formatGHS(total)}</span>
            </div>
            <Link
              href="/checkout"
              className="btn-shimmer block w-full rounded-lg bg-gold py-3.5 text-center font-semibold text-navy-deep hover:bg-gold-light"
            >
              Proceed to Checkout
            </Link>
            <Link href="/shop" className="mt-3 block text-center text-sm text-charcoal/60 hover:text-charcoal">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
