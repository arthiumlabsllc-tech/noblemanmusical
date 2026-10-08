"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/store/cart-store";
import { formatGHS } from "@/lib/utils/formatGHS";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();

  const deliveryFee = subtotal() >= 500 ? 0 : 50;
  const total = subtotal() + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="container-content py-20 text-center">
        <svg className="mx-auto h-24 w-24 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="mt-6 text-2xl font-bold text-navy sm:text-3xl">Your Cart is Empty</h1>
        <p className="mt-2 text-sm text-body">
          Looks like you haven&apos;t added any instruments yet.
        </p>
        <Link href="/shop" className="btn btn-outline mt-8" data-text="Start Shopping">
          <span>Start Shopping</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-content py-10 sm:py-14">
      <h1 className="mb-10 text-3xl font-bold text-navy sm:text-4xl">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="flex gap-4 border border-line bg-white p-4"
              >
                {/* Image */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden bg-mist sm:h-28 sm:w-28">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill sizes="128px" className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg className="h-10 w-10 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2zm12-3c0 1.1-1.3 2-3 2s-3-.9-3-2 1.3-2 3-2 3 .9 3 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      {item.brand && (
                        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gold">
                          {item.brand}
                        </p>
                      )}
                      <Link
                        href={`/shop/${item.productId}`}
                        className="text-underline-gold text-sm font-medium text-navy hover:text-gold sm:text-base"
                      >
                        {item.name}
                      </Link>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-muted transition-colors hover:text-kente-red"
                      aria-label="Remove item"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between pt-2">
                    {/* Quantity */}
                    <div className="flex items-center border border-line">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="flex h-9 w-9 items-center justify-center text-sm text-navy transition-colors hover:bg-mist"
                      >
                        −
                      </button>
                      <span className="w-10 text-center text-sm font-medium text-navy tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="flex h-9 w-9 items-center justify-center text-sm text-navy transition-colors hover:bg-mist disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <p className="text-base font-medium text-navy tabular-nums">
                      {formatGHS(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-[140px] border border-line bg-white p-6">
            <h2 className="text-xl font-bold text-navy">Order Summary</h2>

            <dl className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <dt className="text-body">Subtotal</dt>
                <dd className="font-medium text-navy tabular-nums">
                  {formatGHS(subtotal())}
                </dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-body">Delivery</dt>
                <dd className="font-medium text-navy tabular-nums">
                  {deliveryFee === 0 ? (
                    <span className="text-kente-green">Free</span>
                  ) : (
                    formatGHS(deliveryFee)
                  )}
                </dd>
              </div>
              {deliveryFee > 0 && (
                <p className="text-xs text-muted">
                  Free delivery for orders over GH₵ 500
                </p>
              )}
              <div className="flex justify-between border-t border-line pt-3">
                <dt className="text-base font-semibold text-navy">Total</dt>
                <dd className="text-lg font-bold text-navy tabular-nums">
                  {formatGHS(total)}
                </dd>
              </div>
            </dl>

            <Link
              href="/checkout"
              className="mt-6 block w-full border border-navy bg-navy px-6 py-3.5 text-center text-sm font-semibold tracking-wide text-white transition-colors hover:border-gold hover:bg-gold"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/shop"
              className="text-underline-gold mt-4 block text-center text-sm text-body hover:text-gold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
