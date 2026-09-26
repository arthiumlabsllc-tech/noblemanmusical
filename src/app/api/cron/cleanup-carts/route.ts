import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { carts } from "@/lib/db/schema";
import { lt, sql } from "drizzle-orm";

/**
 * POST /api/cron/cleanup-carts
 * 
 * Deletes expired carts (older than 7 days or past expiresAt).
 * Runs daily at 3 AM via Vercel Cron.
 */
export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Delete carts older than 7 days
    const oldCarts = await db
      .delete(carts)
      .where(lt(carts.updatedAt, sevenDaysAgo))
      .returning({ id: carts.id });

    // Delete carts past their expiration date
    const expiredCarts = await db
      .delete(carts)
      .where(
        sql`${carts.expiresAt} IS NOT NULL AND ${carts.expiresAt} < ${now}`
      )
      .returning({ id: carts.id });

    const totalDeleted = oldCarts.length + expiredCarts.length;

    return NextResponse.json({
      success: true,
      deleted: totalDeleted,
      oldCarts: oldCarts.length,
      expiredCarts: expiredCarts.length,
    });
  } catch (error) {
    console.error("Cart cleanup cron error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
