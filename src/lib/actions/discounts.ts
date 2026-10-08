"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { discounts } from "@/lib/db/schema";
import { requireRoles, MANAGER_ROLES } from "./_authz";

const BACK = "/admin/discounts";

/** Create a discount code (percentage or fixed). */
export async function createDiscountAction(formData: FormData) {
  await requireRoles(MANAGER_ROLES);
  if (!isDatabaseConfigured()) redirect(`${BACK}?error=db`);

  const code = String(formData.get("code") || "").trim().toUpperCase();
  const type = String(formData.get("type"));
  const value = Number(formData.get("value"));
  const minOrderRaw = String(formData.get("minOrder") || "").trim();
  const usageLimitRaw = String(formData.get("usageLimit") || "").trim();
  const startsRaw = String(formData.get("startsAt") || "").trim();
  const endsRaw = String(formData.get("endsAt") || "").trim();

  const validType = type === "percentage" || type === "fixed";
  if (code.length < 2 || !validType || !Number.isFinite(value) || value <= 0) {
    redirect(`${BACK}?error=invalid`);
  }
  if (type === "percentage" && value > 100) {
    redirect(`${BACK}?error=pct`);
  }

  try {
    await db.insert(discounts).values({
      code,
      type: type as "percentage" | "fixed",
      value: value.toFixed(2),
      minOrder: minOrderRaw ? Number(minOrderRaw).toFixed(2) : null,
      usageLimit: usageLimitRaw ? Math.round(Number(usageLimitRaw)) : null,
      startsAt: startsRaw ? new Date(startsRaw) : null,
      endsAt: endsRaw ? new Date(endsRaw) : null,
      isActive: true,
    });
    revalidatePath(BACK);
    redirect(`${BACK}?msg=created&code=${encodeURIComponent(code)}`);
  } catch (err) {
    console.error("[actions] createDiscount failed:", err);
    redirect(`${BACK}?error=exists`);
  }
}

/** Flip a discount between active and inactive. */
export async function toggleDiscountAction(formData: FormData) {
  await requireRoles(MANAGER_ROLES);
  if (!isDatabaseConfigured()) redirect(`${BACK}?error=db`);

  const id = String(formData.get("id") || "");
  if (!id) redirect(`${BACK}?error=invalid`);

  try {
    const [row] = await db
      .select({ isActive: discounts.isActive })
      .from(discounts)
      .where(eq(discounts.id, id))
      .limit(1);
    if (!row) redirect(`${BACK}?error=notfound`);
    await db.update(discounts).set({ isActive: !row.isActive }).where(eq(discounts.id, id));
    revalidatePath(BACK);
    redirect(`${BACK}?msg=toggled`);
  } catch (err) {
    console.error("[actions] toggleDiscount failed:", err);
    redirect(`${BACK}?error=failed`);
  }
}
