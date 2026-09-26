"use server";

import { db } from "@/lib/db";
import { orders, orderItems } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function trackOrder(orderNumber: string, contactInfo: string) {
  // Find order by order number
  const orderResult = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber.trim()))
    .limit(1);

  if (!orderResult.length) {
    return { error: "Order not found. Please check your order number." };
  }

  const order = orderResult[0];

  // Verify the contact info matches (email or phone)
  const normalizedContact = contactInfo.trim().toLowerCase();
  if (
    order.email.toLowerCase() !== normalizedContact &&
    order.phone !== contactInfo.trim()
  ) {
    return { error: "Contact information does not match this order." };
  }

  // Get order items
  const items = await db
    .select({
      id: orderItems.id,
      name: orderItems.name,
      price: orderItems.price,
      quantity: orderItems.quantity,
      image: orderItems.image,
    })
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return {
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      discount: order.discount,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt.toISOString(),
      deliveryAddress: order.deliveryAddress,
      notes: order.notes,
    },
    items,
  };
}
