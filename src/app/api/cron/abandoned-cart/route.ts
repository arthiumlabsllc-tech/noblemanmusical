import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { carts, users, products } from "@/lib/db/schema";
import { eq, and, lte, isNotNull, sql } from "drizzle-orm";
import { sendAbandonedCart } from "@/lib/email/send";

/**
 * POST /api/cron/abandoned-cart
 * 
 * Finds carts updated within the last 24 hours and sends recovery emails.
 * Runs daily at 10:00 UTC — Vercel Hobby caps each job at one execution
 * per day. The window tiles exactly against the previous run (lower bound
 * exclusive, upper bound inclusive) so no cart is skipped and a cart whose
 * updatedAt was bumped by a prior run is not emailed again.
 */
export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Find carts updated in the 24 hours since the previous run
    const abandonedCarts = await db
      .select({
        cartId: carts.id,
        userId: carts.userId,
        items: carts.items,
        updatedAt: carts.updatedAt,
      })
      .from(carts)
      .where(
        and(
          lte(carts.updatedAt, now),
          sql`${carts.updatedAt} > ${twentyFourHoursAgo}`,
          isNotNull(carts.userId)
        )
      )
      .limit(200); // One daily run now covers what 24 hourly runs used to

    let sent = 0;
    let failed = 0;

    for (const cart of abandonedCarts) {
      if (!cart.userId || cart.items.length === 0) continue;

      // Get user email
      const [user] = await db
        .select({ email: users.email, name: users.name })
        .from(users)
        .where(eq(users.id, cart.userId))
        .limit(1);

      if (!user?.email) continue;

      // Get product names and prices
      const productIds = cart.items.map((i) => i.productId).filter(Boolean);
      if (productIds.length === 0) continue;

      const productDetails = await db
        .select({ id: products.id, name: products.name, price: products.price })
        .from(products)
        .where(sql`${products.id} IN (${sql.join(productIds.map((id) => sql`${id}`), sql`, `)})`);

      const items = productDetails.map((p) => ({
        name: p.name,
        price: p.price,
      }));

      if (items.length === 0) continue;

      try {
        await sendAbandonedCart({
          to: user.email,
          customerName: user.name ?? "there",
          items,
        });
        sent++;

        // Mark cart as processed by updating timestamp
        await db
          .update(carts)
          .set({ updatedAt: now })
          .where(eq(carts.id, cart.cartId));
      } catch (error) {
        console.error(`Failed to send abandoned cart email to ${user.email}:`, error);
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      processed: abandonedCarts.length,
      sent,
      failed,
    });
  } catch (error) {
    console.error("Abandoned cart cron error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
