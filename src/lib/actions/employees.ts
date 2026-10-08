"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import { userRoleEnum, users, workerProfiles } from "@/lib/db/schema";
import { requireRoles, OWNER_ROLES } from "./_authz";

const BACK = "/admin/employees";

/** Create a staff login (with role + home store) and its worker profile. */
export async function registerEmployeeAction(formData: FormData) {
  await requireRoles(OWNER_ROLES);
  if (!isDatabaseConfigured()) redirect(`${BACK}?error=db`);

  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const phone = String(formData.get("phone") || "").trim();
  const role = String(formData.get("role") || "cashier");
  const storeId = String(formData.get("storeId") || "") || null;
  const employeeCode = String(formData.get("employeeCode") || "").trim();
  const department = String(formData.get("department") || "").trim();

  const isStaffRole = (userRoleEnum.enumValues as readonly string[]).includes(role) && role !== "customer";
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8 || !isStaffRole) {
    redirect(`${BACK}?error=invalid`);
  }

  try {
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing.length) redirect(`${BACK}?error=dupe`);

    const hash = await bcrypt.hash(password, 10);
    const [u] = await db
      .insert(users)
      .values({
        email,
        passwordHash: hash,
        name,
        phone: phone || undefined,
        role: role as (typeof userRoleEnum.enumValues)[number],
        storeId,
        emailVerified: new Date(),
      })
      .returning();

    await db.insert(workerProfiles).values({
      userId: u.id,
      employeeCode: employeeCode || null,
      department: department || null,
      hireDate: new Date(),
      status: "active",
    });

    revalidatePath(BACK);
    revalidatePath("/admin");
    redirect(`${BACK}?msg=registered`);
  } catch (err) {
    console.error("[actions] registerEmployee failed:", err);
    redirect(`${BACK}?error=failed`);
  }
}
