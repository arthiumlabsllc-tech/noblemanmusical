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

// ── E-commerce Events ──

export function trackAddToCart(params: {
  productId: string;
  productName: string;
  price: number;
  category?: string;
  quantity?: number;
}) {
  trackEvent("add_to_cart", {
    product_id: params.productId,
    product_name: params.productName,
    value: params.price,
    category: params.category,
    quantity: params.quantity ?? 1,
    currency: "GHS",
  });
}

export function trackRemoveFromCart(params: {
  productId: string;
  productName: string;
  price: number;
}) {
  trackEvent("remove_from_cart", {
    product_id: params.productId,
    product_name: params.productName,
    value: params.price,
    currency: "GHS",
  });
}

export function trackBeginCheckout(params: {
  orderId: string;
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
}

export function trackPurchase(params: {
  orderId: string;
  orderNumber: string;
  total: number;
  subtotal: number;
  deliveryFee: number;
  itemCount: number;
  paymentMethod: string;
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
