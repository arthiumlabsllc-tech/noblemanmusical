"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import {
  posSaleItems,
  posSales,
  posShifts,
  posTerminals,
  productStock,
} from "@/lib/db/schema";
import { requireRoles } from "./_authz";

const BACK = "/pos";
const POS_ROLES = ["super_admin", "admin", "manager", "cashier"];

type CartLine = { productId: string; name: string; unitPrice: number; quantity: number };

/**
 * Record an in-store POS sale for the active store and signed-in cashier.
 * Reuses the cashier's open shift at the store terminal (opening one on demand),
 * writes the sale + line items, and decrements that store's per-product stock.
 */
export async function recordSaleAction(formData: FormData) {
  const session = await requireRoles(POS_ROLES);
  if (!isDatabaseConfigured()) redirect(`${BACK}?error=db`);

  const storeId = String(formData.get("storeId") || "");
  const paymentMethod = String(formData.get("paymentMethod") || "cash");
  const customerName = String(formData.get("customerName") || "").trim();
  let items: CartLine[] = [];
  try {
    items = JSON.parse(String(formData.get("items") || "[]")) as CartLine[];
  } catch {
    items = [];
  }

  if (!storeId || items.length === 0) redirect(`${BACK}?error=invalid`);

  const cents = (n: number) => (Math.round(n * 100) / 100).toFixed(2);
  const subtotalNum = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
  const subtotal = cents(subtotalNum);

  try {
    // 1. store terminal (create on demand if none)
    const [terminal] = await db
      .select({ id: posTerminals.id })
      .from(posTerminals)
      .limit(1);
    const terminalId =
      terminal?.id ??
      (await db.insert(posTerminals).values({ name: "Store Terminal" }).returning({ id: posTerminals.id }))[0].id;

    // 2. open shift for this cashier/terminal, else open one
    let [shift] = await db
      .select({ id: posShifts.id })
      .from(posShifts)
      .where(and(eq(posShifts.terminalId, terminalId), eq(posShifts.status, "open")))
      .limit(1);
    if (!shift) {
      [shift] = await db
        .insert(posShifts)
        .values({ terminalId, storeId, openedByUserId: session.user.id, openingCash: "0.00", status: "open" })
        .returning({ id: posShifts.id });
    }

    // 3. the sale
    const receiptNumber = `RCT-${Date.now().toString().slice(-8)}`;
    const [sale] = await db
      .insert(posSales)
      .values({
        shiftId: shift.id,
        terminalId,
        storeId,
        cashierUserId: session.user.id,
        customerName: customerName || null,
        subtotal,
        total: subtotal,
        paymentMethod: paymentMethod as "cash" | "momo" | "card" | "paystack" | "split",
        receiptNumber,
      })
      .returning({ id: posSales.id });

    // 4. line items + stock decrement (per store)
    for (const line of items) {
      await db.insert(posSaleItems).values({
        saleId: sale.id,
        productId: line.productId,
        name: line.name,
        unitPrice: cents(line.unitPrice),
        quantity: line.quantity,
        lineTotal: cents(line.unitPrice * line.quantity),
      });
      await db
        .update(productStock)
        .set({ quantity: sql`GREATEST(0, ${productStock.quantity} - ${line.quantity})`, updatedAt: new Date() })
        .where(and(eq(productStock.productId, line.productId), eq(productStock.storeId, storeId)));
    }

    revalidatePath(BACK);
    revalidatePath("/pos/receipts");
    revalidatePath("/admin");
    redirect(`${BACK}?msg=sale&receipt=${receiptNumber}`);
  } catch (err) {
    console.error("[actions] recordSale failed:", err);
    redirect(`${BACK}?error=failed`);
  }
}
