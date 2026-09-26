import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // MoMo webhook verification
    // In production, verify the webhook signature with MTN credentials
    const { status, reference } = body;

    if (status === "SUCCESS" && reference) {
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.paymentRef, reference))
        .limit(1);

      if (order && order.status !== "paid") {
        await db
          .update(orders)
          .set({ status: "paid", updatedAt: new Date() })
          .where(eq(orders.id, order.id));

        // Decrement stock
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

        console.log(`Order ${order.orderNumber} marked as paid via MoMo webhook`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("MoMo webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
