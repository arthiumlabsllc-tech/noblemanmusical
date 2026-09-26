import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import { lt } from "drizzle-orm";
import { sendLowStockAlert } from "@/lib/email/send";

const LOW_STOCK_THRESHOLD = 5;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@noblemanmusical.com";

/**
 * POST /api/cron/low-stock
 * 
 * Checks for products below stock threshold, sends alert to admin.
 * Runs daily at 9 AM via Vercel Cron.
 */
export async function POST(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find products with stock below threshold
    const lowStockProducts = await db
      .select({
        id: products.id,
        name: products.name,
        stock: products.stock,
      })
      .from(products)
      .where(lt(products.stock, LOW_STOCK_THRESHOLD))
      .limit(100);

    if (lowStockProducts.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No low stock products",
        count: 0,
      });
    }

    const productsToSend = lowStockProducts.map((p) => ({
      name: p.name,
      currentStock: p.stock,
      threshold: LOW_STOCK_THRESHOLD,
    }));

    try {
      await sendLowStockAlert({
        to: ADMIN_EMAIL,
        products: productsToSend,
      });

      return NextResponse.json({
        success: true,
        count: lowStockProducts.length,
        sent: true,
      });
    } catch (error) {
      console.error("Failed to send low stock alert:", error);
      return NextResponse.json({
        success: true,
        count: lowStockProducts.length,
        sent: false,
        error: "Email send failed",
      });
    }
  } catch (error) {
    console.error("Low stock cron error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
