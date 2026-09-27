/**
 * Carries a completed order from the checkout page to the success page so GA4
 * can record the `purchase` event with real values.
 *
 * Why not just read the totals on the success page? Because that page only
 * receives `?order=<number>` — no prices, no line items — and the Paystack path
 * leaves the app entirely (`window.location.href`) before coming back. Reading
 * the order from the database would need a new public endpoint that returns
 * amounts by order number, which is information you do not want to expose.
 *
 * sessionStorage is per-tab and per-origin, so nothing crosses users or
 * sessions. `takePurchase()` deletes after reading, which is what prevents the
 * classic double-counted purchase when a buyer refreshes or re-opens the
 * confirmation page.
 */

const LAST_ORDER_KEY = "nmc-last-purchase";

export interface TrackedOrder {
  orderId: string;
  orderNumber: string;
  /** All money fields are pesewas, matching the rest of the codebase. */
  total: number;
  subtotal: number;
  deliveryFee: number;
  itemCount: number;
  paymentMethod: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
}

export function stashPurchase(order: TrackedOrder): void {
  try {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    // Private browsing / quota errors must never block a completed order.
  }
}

/** Read and clear. Returns null if there is no unconsumed purchase. */
export function takePurchase(): TrackedOrder | null {
  try {
    const raw = sessionStorage.getItem(LAST_ORDER_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(LAST_ORDER_KEY);
    const parsed = JSON.parse(raw) as TrackedOrder;
    return typeof parsed?.orderNumber === "string" ? parsed : null;
  } catch {
    return null;
  }
}
