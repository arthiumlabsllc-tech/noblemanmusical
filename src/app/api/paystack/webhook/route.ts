import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify HMAC SHA512 signature
    const secret = process.env.PAYSTACK_WEBHOOK_SECRET;
    if (!secret) {
      console.error("PAYSTACK_WEBHOOK_SECRET not set");
      return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
    }

    const hash = crypto
      .createHmac("sha512", secret)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle charge.success
    if (event.event === "charge.success") {
      const reference = event.data.reference;

      // Find order by payment reference
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.paymentRef, reference))
        .limit(1);

      if (order && order.status !== "paid") {
        // Update order to paid
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

        // TODO: Send confirmation email + WhatsApp (Phase 4-5)
        console.log(`Order ${order.orderNumber} marked as paid via Paystack webhook`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
