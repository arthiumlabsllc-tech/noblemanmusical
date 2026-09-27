/**
 * Business event tracking for Nobleman Musical Center.
 *
 * Uses Vercel Analytics `track` when available, falls back to
 * console.log in development. All amounts are in pesewas.
 */

type EventProperties = Record<string, string | number | boolean | undefined>;

function trackEvent(name: string, properties?: EventProperties) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${name}`, properties ?? "");
    return;
  }

  // Dynamic import to avoid bundling in server components
  import("@vercel/analytics")
    .then(({ track }) => {
      track(name, properties);
    })
    .catch(() => {
      // Silently fail — analytics should never break UX
    });
}

/**
 * Push the same event to GA4.
 *
 * Kept separate from trackEvent because the two consumers need different
 * payloads: Vercel takes flat custom dimensions, GA4's ecommerce reports only
 * populate from its own reserved parameter names (`value`, `currency`,
 * `transaction_id`, `items[]`).
 *
 * Unlike the Vercel helper this never checks NODE_ENV — GA4 should record dev
 * traffic only if the tag was actually installed, and <GoogleAnalytics /> omits
 * the tag unless NEXT_PUBLIC_GOOGLE_ANALYTICS_ID is set, so the optional call
 * is the correct gate.
 */
function gaEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

/** GA4 expects decimal currency; this codebase stores pesewas. */
function ghs(amountInPesewas: number): number {
  return Math.round(amountInPesewas) / 100;
}

const CURRENCY = "GHS";

// ── E-commerce Events ──

export function trackAddToCart(params: {
  productId: string;
  productName: string;
  price: number;
  category?: string;
  brand?: string;
  quantity?: number;
}) {
  trackEvent("add_to_cart", {
    product_id: params.productId,
    product_name: params.productName,
    value: params.price,
    category: params.category,
    brand: params.brand,
    quantity: params.quantity ?? 1,
    currency: "GHS",
  });

  gaEvent("add_to_cart", {
    currency: CURRENCY,
    value: ghs(params.price) * (params.quantity ?? 1),
    items: [
      {
        item_id: params.productId,
        item_name: params.productName,
        price: ghs(params.price),
        quantity: params.quantity ?? 1,
        ...(params.brand ? { item_brand: params.brand } : {}),
        ...(params.category ? { item_category: params.category } : {}),
      },
    ],
  });
}

export function trackRemoveFromCart(params: {
  productId: string;
  productName: string;
  price: number;
  brand?: string;
  quantity?: number;
}) {
  trackEvent("remove_from_cart", {
    product_id: params.productId,
    product_name: params.productName,
    value: params.price,
    currency: "GHS",
  });

  gaEvent("remove_from_cart", {
    currency: CURRENCY,
    value: ghs(params.price) * (params.quantity ?? 1),
    items: [
      {
        item_id: params.productId,
        item_name: params.productName,
        price: ghs(params.price),
        quantity: params.quantity ?? 1,
        ...(params.brand ? { item_brand: params.brand } : {}),
      },
    ],
  });
}

export function trackBeginCheckout(params: {
  /** No order exists yet at this point, so this is optional. */
  orderId?: string;
  total: number;
  itemCount: number;
  paymentMethod?: string;
}) {
  trackEvent("begin_checkout", {
    order_id: params.orderId,
    value: params.total,
    items: params.itemCount,
    payment_method: params.paymentMethod,
    currency: "GHS",
  });

  gaEvent("begin_checkout", {
    currency: CURRENCY,
    value: ghs(params.total),
    items: params.itemCount,
  });
}

export function trackPurchase(params: {
  orderId: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  itemCount: number;
  paymentMethod: string;
  /**
   * Line items, so GA4 can build product-level purchase reports instead of
   * only a revenue total. Optional — existing callers keep working.
   */
  items?: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
}) {
  trackEvent("purchase", {
    order_id: params.orderId,
    order_number: params.orderNumber,
    value: params.total,
    subtotal: params.subtotal,
    delivery_fee: params.deliveryFee,
    items: params.itemCount,
    payment_method: params.paymentMethod,
    currency: "GHS",
  });

  // `transaction_id` is what lets GA4 dedupe a server-side and a client-side
  // confirmation of the same order, so it must be the real order number.
  gaEvent("purchase", {
    transaction_id: params.orderNumber,
    affiliation: "Online Store",
    currency: CURRENCY,
    value: ghs(params.total),
    tax: 0,
    shipping: ghs(params.deliveryFee),
    payment_details: { payment_type: params.paymentMethod },
    items:
      params.items?.map((item, index) => ({
        item_id: item.productId,
        item_name: item.productName,
        affiliation: "Online Store",
        price: ghs(item.price),
        quantity: item.quantity,
        index,
      })) ?? [
        {
          item_id: params.orderId,
          item_name: "Order items",
          price: ghs(params.subtotal),
          quantity: params.itemCount,
        },
      ],
  });
}

// ── Search Events ──

export function trackSearch(params: {
  query: string;
  resultCount: number;
}) {
  trackEvent("search", {
    query: params.query,
    result_count: params.resultCount,
  });

  gaEvent("search", { search_term: params.query, search_results: params.resultCount });
}

// ── Product Events ──

export function trackProductView(params: {
  productId: string;
  productName: string;
  price: number;
  category: string;
}) {
  trackEvent("view_item", {
    product_id: params.productId,
    product_name: params.productName,
    value: params.price,
    category: params.category,
    currency: "GHS",
  });

  gaEvent("view_item", {
    currency: CURRENCY,
    value: ghs(params.price),
    items: [
      {
        item_id: params.productId,
        item_name: params.productName,
        price: ghs(params.price),
        quantity: 1,
        item_category: params.category,
      },
    ],
  });
}

export function trackCategoryView(params: {
  category: string;
  productCount: number;
}) {
  trackEvent("view_item_list", {
    category: params.category,
    item_count: params.productCount,
  });
}

// ── Engagement Events ──

export function trackWhatsAppClick(params: {
  source: string;
  productId?: string;
}) {
  trackEvent("whatsapp_click", {
    source: params.source,
    product_id: params.productId,
  });
}

export function trackNewsletterSignup() {
  trackEvent("newsletter_signup");
}

export function trackB2BQuoteRequest(params: {
  companyName: string;
  category: string;
}) {
  trackEvent("b2b_quote_request", {
    company: params.companyName,
    category: params.category,
  });
}

export function trackOrderTracking(params: {
  orderNumber: string;
  success: boolean;
}) {
  trackEvent("order_tracking", {
    order_number: params.orderNumber,
    success: params.success,
  });
}

// ── Error Events ──

export function trackError(params: {
  action: string;
  message: string;
}) {
  trackEvent("error", {
    action: params.action,
    message: params.message,
  });
}
