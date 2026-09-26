"use server";

import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";
import { initializeTransaction, generatePaystackReference } from "@/lib/payments/paystack";
import { requestToPay, generateMomoReference } from "@/lib/payments/momo";
import { auth } from "@/lib/auth";

/* ═══════════════════════════════════════════════════════════
   Schemas
   ═══════════════════════════════════════════════════════════ */

const cartItemSchema = z.object({
  productId: z.string().uuid().optional(),
  slug: z.string().optional(),
  name: z.string(),
  price: z.number().int().positive(),
  quantity: z.number().int().positive(),
  image: z.string().optional(),
});

const createOrderSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10, "Phone number is required"),
  name: z.string().min(2, "Name is required"),
  region: z.string().min(1),
  city: z.string().min(1),
  address: z.string().min(1),
  landmark: z.string().optional(),
  paymentMethod: z.enum(["paystack", "momo", "cod"]),
  items: z.array(cartItemSchema).min(1, "Cart is empty"),
});

/* ═══════════════════════════════════════════════════════════
   Result types
   ═══════════════════════════════════════════════════════════ */

type CreateOrderResult =
  | { success: true; orderNumber: string; redirectUrl?: string }
  | { success: false; error: string };

type VerifyResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string };

/* ═══════════════════════════════════════════════════════════
   Generate order number
   ═══════════════════════════════════════════════════════════ */

function generateOrderNumber(): string {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NMC-${y}${m}${d}-${rand}`;
}

/* ═══════════════════════════════════════════════════════════
   Create Order
   ═══════════════════════════════════════════════════════════ */

export async function createOrderAction(
  formData: Record<string, unknown>
): Promise<CreateOrderResult> {
  const session = await auth();

  const parsed = createOrderSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message };
  }

  const data = parsed.data;

  // Calculate totals
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = subtotal >= 50000 ? 0 : 5000; // Free delivery above GHS 500
  const total = subtotal + deliveryFee;

  // Resolve product IDs from slugs if needed, and check stock
  const resolvedItems: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }> = [];

  for (const item of data.items) {
    let productId = item.productId;

    // If no productId, look up by slug
    if (!productId && item.slug) {
      const [found] = await db
        .select({ id: products.id })
        .from(products)
        .where(eq(products.slug, item.slug))
        .limit(1);
      if (found) productId = found.id;
    }

    if (!productId) {
      return { success: false, error: `Product not found: ${item.name}` };
    }

    const [product] = await db
      .select({ stock: products.stock, name: products.name })
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return { success: false, error: `Product not found: ${item.name}` };
    }
    if (product.stock < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for ${product.name}. Only ${product.stock} available.`,
      };
    }

    resolvedItems.push({
      productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    });
  }

  const orderNumber = generateOrderNumber();

  // Create order
  const [order] = await db
    .insert(orders)
    .values({
      orderNumber,
      userId: session?.user?.id ?? null,
      email: data.email,
      phone: data.phone,
      status: data.paymentMethod === "cod" ? "pending" : "pending",
      subtotal,
      deliveryFee,
      discount: 0,
      total,
      paymentMethod: data.paymentMethod,
      deliveryAddress: {
        region: data.region,
        city: data.city,
        area: data.address,
        landmark: data.landmark,
      },
    })
    .returning({ id: orders.id, orderNumber: orders.orderNumber });

  // Create order items from resolved items
  for (const item of resolvedItems) {
    await db.insert(orderItems).values({
      orderId: order.id,
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image ?? null,
    });
  }

  // Handle payment
  if (data.paymentMethod === "paystack") {
    try {
      const reference = generatePaystackReference();
      const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/checkout/success?order=${orderNumber}&ref=${reference}`;

      const result = await initializeTransaction({
        email: data.email,
        amount: total,
        reference,
        callback_url: callbackUrl,
        metadata: { orderId: order.id, orderNumber },
      });

      // Update order with payment reference
      await db
        .update(orders)
        .set({ paymentRef: reference })
        .where(eq(orders.id, order.id));

      return {
        success: true,
        orderNumber,
        redirectUrl: result.data.authorization_url,
      };
    } catch (err) {
      // If Paystack fails, still keep the order but mark as pending
      console.error("Paystack initialization failed:", err);
      return {
        success: false,
        error: "Payment initialization failed. Please try again or choose a different payment method.",
      };
    }
  }

  if (data.paymentMethod === "momo") {
    try {
      const reference = generateMomoReference();
      await requestToPay({
        amount: total,
        phone: data.phone,
        reference,
        externalId: order.id,
      });

      await db
        .update(orders)
        .set({ paymentRef: reference })
        .where(eq(orders.id, order.id));

      return { success: true, orderNumber };
    } catch (err) {
      console.error("MoMo request failed:", err);
      return {
        success: false,
        error: "Mobile Money request failed. Please check your phone number and try again.",
      };
    }
  }

  // COD — order created, no payment needed
  return { success: true, orderNumber };
}

/* ═══════════════════════════════════════════════════════════
   Verify Payment (called by webhook or success page)
   ═══════════════════════════════════════════════════════════ */

export async function verifyPaymentAction(
  reference: string
): Promise<VerifyResult> {
  try {
    // Find order by payment reference
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.paymentRef, reference))
      .limit(1);

    if (!order) {
      return { success: false, error: "Order not found" };
    }

    if (order.status === "paid") {
      return { success: true, orderNumber: order.orderNumber };
    }

    // Verify with Paystack
    const { verifyTransaction } = await import("@/lib/payments/paystack");
    const result = await verifyTransaction(reference);

    if (result.status === "success") {
      // Update order status
      await db
        .update(orders)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(orders.id, order.id));

      // Decrement stock for each order item
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      for (const item of items) {
        await db
          .update(products)
          .set({ stock: sql`${products.stock} - ${item.quantity}` })
          .where(eq(products.id, item.productId));
      }

      return { success: true, orderNumber: order.orderNumber };
    }

    return { success: false, error: "Payment verification failed" };
  } catch (err) {
    console.error("Payment verification error:", err);
    return { success: false, error: "Verification failed. Please contact support." };
  }
}
