"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { formatGHS } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-url";
import { PHONE_DISPLAY, PHONE_TEL_HREF } from "@/lib/config";
import { trackProductView } from "@/lib/analytics/events";
import { ShimmerButton } from "@/components/motion/shimmer-button";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { useCart } from "@/hooks/use-cart";
import {
  MessageCircle,
  ShoppingCart,
  Shield,
  Truck,
  CreditCard,
  Star,
  Check,
  Minus,
  Plus,
} from "lucide-react";
import type { SeedProduct } from "@/lib/data/products";

interface ProductDetailProps {
  product: SeedProduct;
}

const tabs = ["Description", "Specifications", "Reviews", "Warranty"];

export function ProductDetail({ product }: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState("Description");
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();

  // GA4 view_item — the top of the product funnel, and the event that makes
  // product-level conversion rates readable in the Ecommerce reports.
  useEffect(() => {
    trackProductView({
      productId: product.slug,
      productName: product.name,
      price: product.price,
      category: product.categoryName,
    });
  }, [product.slug, product.name, product.price, product.categoryName]);

  const handleAddToCart = () => {
    addItem({
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.images[0] ?? "",
      maxStock: product.stock,
    }, quantity);
    openCart();
  };

  const hasDiscount = product.compareAtPrice !== null;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const whatsappMessage = `Hello Nobleman Musical Center, I'm interested in the ${product.name} (${formatGHS(product.price)}). Is it available?`;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 md:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <RevealOnScroll direction="left">
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-dark">
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-navy/5 via-gold/5 to-bronze/10" />
              )}
              {hasDiscount && (
                <span className="absolute left-4 top-4 rounded-full bg-kente-red px-3 py-1.5 text-xs font-bold text-cream">
                  -{discountPercent}%
                </span>
              )}
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.length > 0
                ? product.images.slice(0, 4).map((img, i) => (
                    <div
                      key={i}
                      className={`aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${
                        i === 0 ? "border-gold" : "border-cream-dark hover:border-gold/50"
                      }`}
                    >
                      <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" sizes="80px" />
                    </div>
                  ))
                : [1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition-colors ${
                        i === 1 ? "border-gold" : "border-cream-dark hover:border-gold/50"
                      }`}
                    >
                      <div className="h-full w-full bg-gradient-to-br from-navy/5 to-bronze/5" />
                    </div>
                  ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Buy Box */}
        <RevealOnScroll direction="right">
          <div className="space-y-6">
            {/* Brand & Category */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold">
                {product.brand}
              </span>
              <h1 className="mt-1 font-display text-2xl font-bold text-navy-deep md:text-3xl">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "fill-gold text-gold"
                        : "fill-cream-dark text-cream-dark"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-charcoal/60">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="tabular-nums text-3xl font-bold text-navy-deep">
                {formatGHS(product.price)}
              </span>
              {hasDiscount && (
                <span className="tabular-nums text-lg text-charcoal/60 line-through">
                  {formatGHS(product.compareAtPrice!)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock > 3 ? (
                <>
                  <Check className="h-4 w-4 text-kente-green" />
                  <span className="text-sm font-medium text-kente-green">In Stock</span>
                </>
              ) : product.stock > 0 ? (
                <>
                  <Check className="h-4 w-4 text-bronze" />
                  <span className="text-sm font-medium text-bronze">
                    Only {product.stock} left in stock
                  </span>
                </>
              ) : (
                <span className="text-sm font-medium text-gold">Available for Pre-Order</span>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-charcoal">Quantity:</span>
              <div className="flex items-center rounded-lg border border-cream-dark">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center text-charcoal/60 hover:text-charcoal"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-10 w-12 items-center justify-center text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="flex h-10 w-10 items-center justify-center text-charcoal/60 hover:text-charcoal"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <ShimmerButton size="lg" className="flex-1" onClick={handleAddToCart}>
                <span className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </span>
              </ShimmerButton>
              <ShimmerButton variant="outline" size="lg" className="flex-1" asChild>
                <a
                  href={buildWhatsAppUrl({ message: whatsappMessage })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Order via WhatsApp
                </a>
              </ShimmerButton>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 rounded-xl border border-cream-dark bg-white p-4">
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Shield className="h-5 w-5 text-gold" />
                <span className="text-[10px] font-medium text-charcoal/60">Official Warranty</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <Truck className="h-5 w-5 text-gold" />
                <span className="text-[10px] font-medium text-charcoal/60">Nationwide Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 text-center">
                <CreditCard className="h-5 w-5 text-gold" />
                <span className="text-[10px] font-medium text-charcoal/60">Pay on Delivery</span>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex gap-1 border-b border-cream-dark">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "text-navy-deep"
                  : "text-charcoal/50 hover:text-charcoal"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />
              )}
            </button>
          ))}
        </div>

        <div className="py-8">
          {activeTab === "Description" && (
            <p className="max-w-3xl text-sm leading-relaxed text-charcoal/70">
              {product.description}
            </p>
          )}
          {activeTab === "Specifications" && (
            <div className="max-w-lg">
              <table className="w-full text-sm">
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="border-b border-cream-dark">
                      <td className="py-3 font-medium text-charcoal/60">{key}</td>
                      <td className="py-3 text-charcoal">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === "Reviews" && (
            <div className="flex flex-col items-center py-8 text-center">
              <p className="text-sm text-charcoal/60">
                {product.reviewCount} reviews — Reviews coming soon.
              </p>
            </div>
          )}
          {activeTab === "Warranty" && (
            <div className="max-w-3xl space-y-4 text-sm text-charcoal/70">
              <p>All instruments purchased from Nobleman Musical Center come with the manufacturer&apos;s official warranty.</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Standard manufacturer warranty applies to all new instruments</li>
                <li>Warranty covers manufacturing defects only</li>
                <li>Physical damage, misuse, or normal wear not covered</li>
                <li>Keep your receipt as proof of purchase</li>
              </ul>
              <p>Contact us for warranty claims: <a href={PHONE_TEL_HREF} className="text-gold hover:underline">{PHONE_DISPLAY}</a></p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-cream-dark bg-white/95 p-3 backdrop-blur-md safe-bottom lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="tabular-nums text-lg font-bold text-navy-deep">{formatGHS(product.price)}</p>
            <p className="text-xs text-charcoal/50">{product.name}</p>
          </div>
          <ShimmerButton size="md" className="flex-shrink-0" onClick={handleAddToCart}>
            <span className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </span>
          </ShimmerButton>
        </div>
      </div>
    </div>
  );
}
