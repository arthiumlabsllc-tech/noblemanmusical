import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";

export type PaidOrder = {
  id: string;
  orderNumber: string;
  email: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  items: Array<{ name: string; quantity: number; price: number }>;
};

export type MarkPaidResult =
  | { outcome: "paid"; order: PaidOrder }
  | { outcome: "already_paid" }
  | { outcome: "not_found" };

/**
 * Transition an order to "paid" by payment reference and decrement stock.
 *
 * WHY THIS IS SHAPED THIS WAY
 * --------------------------
 * `src/lib/db/index.ts` uses `drizzle-orm/neon-http`. The Neon HTTP driver
 * exposes `batch()` but NOT `transaction()` — `NeonHttpDatabase` has no
 * `transaction` method — so the usual "wrap it all in a transaction" fix for
 * payment finalisation is not available without migrating the whole app to a
 * socket driver (neon-serverless Pool or postgres.js).
 *
 * Instead the work is compressed into two statements that are each atomic on
 * their own:
 *
 *  1. A conditional `UPDATE ... WHERE status <> 'paid' RETURNING` claims the
 *     order. This is what makes webhook processing idempotent: when a gateway
 *     delivers `charge.success` twice (they all do), only the first call
 *     matches the predicate and claims it, so stock is decremented once and
 *     the confirmation email is sent once. The previous read-then-write
 *     (`if order.status !== "paid"` followed by a separate update) lost that
 *     guarantee to a race between the two requests.
 *  2. A single set-based `UPDATE products ... FROM order_items` decrements
 *     every line at once, replacing a per-item loop where a mid-loop failure
 *     left inventory partially adjusted with no way to roll back.
 *
 * RESIDUAL RISK (accepted, flagged): if statement 1 commits and statement 2
 * fails, the order is paid but stock was not adjusted. That is strictly
 * recoverable (stock can be corrected by hand) and no worse than the previous
 * behaviour, but full atomicity requires the driver migration noted above.
 *
 * Only the caller that successfully claims the order gets `outcome: "paid"`,
 * so side effects such as email should be driven off that branch alone.
 */
export async function markOrderPaidByReference(
  paymentRef: string
): Promise<MarkPaidResult> {
  if (!paymentRef) return { outcome: "not_found" };

  // 1. Atomic claim — succeeds for exactly one concurrent caller.
  const [claimed] = await db
    .update(orders)
    .set({ status: "paid", updatedAt: new Date() })
    .where(and(eq(orders.paymentRef, paymentRef), ne(orders.status, "paid")))
    .returning({ id: orders.id });

  if (!claimed) {
    // Distinguish "someone already paid this" from "no such order" so the
    // webhook can log the difference without guessing.
    const [existing] = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.paymentRef, paymentRef))
      .limit(1);

    return existing ? { outcome: "already_paid" } : { outcome: "not_found" };
  }

  // 2. Decrement every line of the order in one statement.
  await db
    .update(products)
    .set({ stock: sql`${products.stock} - ${orderItems.quantity}` })
    .from(orderItems)
    .where(eq(orderItems.orderId, claimed.id));

  // 3. Read back what the caller needs for the confirmation email.
  const [order] = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      email: orders.email,
      subtotal: orders.subtotal,
      deliveryFee: orders.deliveryFee,
      total: orders.total,
    })
    .from(orders)
    .where(eq(orders.id, claimed.id))
    .limit(1);

  const items = await db
    .select({
      name: orderItems.name,
      quantity: orderItems.quantity,
      price: orderItems.price,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, claimed.id));

  return { outcome: "paid", order: { ...order, items } };
}

/**
 * Delivery copy for the confirmation email. There is no delivery-ETA column on
 * `orders`, so this is a static promise rather than a computed date.
 */
export const DELIVERY_ETA = "2-5 business days within Accra, 3-7 business days nationwide";
