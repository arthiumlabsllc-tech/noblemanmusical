"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { formatGHS } from "@/lib/utils";
import { X, Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import Link from "next/link";

const FREE_DELIVERY_THRESHOLD = 50000; // ₵500 in pesewas

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalItems } = useCart();
  const subtotalAmount = subtotal();
  const remaining = FREE_DELIVERY_THRESHOLD - subtotalAmount;
  const drawerRef = useFocusTrap(isOpen);

  // Lock body scroll + ESC close
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[60] bg-navy-deep/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-white shadow-navy"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            style={{ touchAction: "none" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream-dark px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-gold" />
                <h2 className="font-display text-lg font-bold text-navy-deep">
                  Your Cart ({totalItems()})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="rounded-full p-2 text-charcoal/60 hover:bg-cream-dark hover:text-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free delivery progress */}
            {items.length > 0 && remaining > 0 && (
              <div className="border-b border-cream-dark px-6 py-3">
                <div className="flex items-center gap-2 text-xs text-charcoal/60">
                  <Truck className="h-4 w-4 text-gold" />
                  <span>
                    You&apos;re <strong className="text-gold-dark">{formatGHS(remaining)}</strong> away from free delivery in Accra
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-dark">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotalAmount / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShoppingBag className="mb-4 h-12 w-12 text-charcoal/50" />
                  <h3 className="font-display text-lg font-bold text-navy-deep">Your cart is empty</h3>
                  <p className="mt-2 text-sm text-charcoal/60">
                    Browse our collection and add items to your cart.
                  </p>
                  <Link
                    href="/shop"
                    onClick={closeCart}
                    className="mt-6 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.slug} className="flex gap-4 rounded-xl border border-cream-dark p-3">
                      {/* Image */}
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} width={80} height={100} className="h-full w-full object-cover" sizes="80px" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-navy/5 to-bronze/5" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-xs text-gold/70">{item.brand}</p>
                            <p className="text-sm font-medium text-charcoal line-clamp-1">{item.name}</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.slug)}
                            className="text-charcoal/60 hover:text-kente-red"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          {/* Quantity */}
                          <div className="flex items-center rounded border border-cream-dark">
                            <button
                              onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-charcoal/60 hover:text-charcoal"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="flex h-7 w-8 items-center justify-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center text-charcoal/60 hover:text-charcoal"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <span className="tabular-nums text-sm font-bold text-navy-deep">
                            {formatGHS(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-dark px-6 py-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm text-charcoal/60">Subtotal</span>
                  <span className="tabular-nums text-lg font-bold text-navy-deep">
                    {formatGHS(subtotalAmount)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-shimmer block w-full rounded-lg bg-gold py-3.5 text-center text-sm font-semibold text-navy-deep hover:bg-gold-light"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="mt-2 block w-full rounded-lg border border-cream-dark py-3 text-center text-sm font-medium text-charcoal hover:bg-cream-dark"
                >
                  View Full Cart
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
