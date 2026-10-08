"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { productStock } from "@/lib/db/schema";
import { requireRoles, ADMIN_ROLES } from "./_authz";

const BACK = "/admin/inventory";

/**
 * Add or adjust stock for one product in one store (shared catalog, per-store
 * quantity). Supports two modes:
 *   - "set"   → set the exact quantity for the store
 *   - "delta" → add (or remove, when negative) from the current quantity
 * Writes an upsert into `product_stock (productId, storeId)`.
 */
export async function adjustStockAction(formData: FormData) {
  await requireRoles(ADMIN_ROLES);
  if (!isDatabaseConfigured()) redirect(`${BACK}?error=db`);

  const productId = String(formData.get("productId") ?? "");
  const storeId = String(formData.get("storeId") ?? "");
  const mode = String(formData.get("mode") ?? "set");
  const rawQty = Number(formData.get("qty"));

  if (!productId || !storeId || !Number.isFinite(rawQty)) {
    redirect(`${BACK}?error=invalid`);
  }

  try {
    if (mode === "set") {
      const qty = Math.max(0, Math.round(rawQty));
      await db
        .insert(productStock)
        .values({ productId, storeId, quantity: qty })
        .onConflictDoUpdate({
          target: [productStock.productId, productStock.storeId],
          set: { quantity: qty, updatedAt: new Date() },
        });
    } else {
      const delta = Math.round(rawQty);
      await db
        .insert(productStock)
        .values({ productId, storeId, quantity: Math.max(0, delta) })
        .onConflictDoUpdate({
          target: [productStock.productId, productStock.storeId],
          set: {
            quantity: sql`GREATEST(0, ${productStock.quantity} + ${delta})`,
            updatedAt: new Date(),
          },
        });
    }
    revalidatePath(BACK);
    revalidatePath("/admin");
    redirect(`${BACK}?msg=updated`);
  } catch (err) {
    console.error("[actions] adjustStock failed:", err);
    redirect(`${BACK}?error=failed`);
  }
}
