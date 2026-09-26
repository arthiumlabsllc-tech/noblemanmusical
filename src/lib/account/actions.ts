"use server";

import { db } from "@/lib/db";
import {
  users,
  orders,
  orderItems,
  addresses,
  wishlists,
  products,
  quotes,
} from "@/lib/db/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

/* ═══════════════════════════════════════════════════════════
   Get current user from session
   ═══════════════════════════════════════════════════════════ */

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      image: users.image,
      role: users.role,
      marketingOptIn: users.marketingOptIn,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  return user[0] ?? null;
}

/* ═══════════════════════════════════════════════════════════
   Account Dashboard Stats
   ═══════════════════════════════════════════════════════════ */

export async function getAccountStats() {
  const user = await getCurrentUser();
  if (!user) return { totalOrders: 0, totalSpent: 0, wishlistCount: 0, addressCount: 0 };

  const [orderStats, wishlistCount, addressCount] = await Promise.all([
    db
      .select({
        count: sql<number>`count(*)::int`,
        total: sql<number>`coalesce(sum(${orders.total}), 0)::int`,
      })
      .from(orders)
      .where(eq(orders.userId, user.id)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(wishlists)
      .where(eq(wishlists.userId, user.id)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(addresses)
      .where(eq(addresses.userId, user.id)),
  ]);

  return {
    totalOrders: orderStats[0]?.count ?? 0,
    totalSpent: orderStats[0]?.total ?? 0,
    wishlistCount: wishlistCount[0]?.count ?? 0,
    addressCount: addressCount[0]?.count ?? 0,
  };
}

/* ═══════════════════════════════════════════════════════════
   Orders
   ═══════════════════════════════════════════════════════════ */

export async function getMyOrders() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, user.id))
    .orderBy(desc(orders.createdAt));
}

export async function getMyOrder(orderId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const [orderResult, items] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(and(eq(orders.id, orderId), eq(orders.userId, user.id)))
      .limit(1),
    db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId)),
  ]);

  return { order: orderResult[0] ?? null, items };
}

/* ═══════════════════════════════════════════════════════════
   Addresses CRUD
   ═══════════════════════════════════════════════════════════ */

const addressSchema = z.object({
  label: z.string().optional(),
  region: z.string().min(1, "Region required"),
  city: z.string().min(1, "City required"),
  area: z.string().optional(),
  landmark: z.string().optional(),
  phone: z.string().optional(),
  isDefault: z.boolean().default(false),
});

export async function getMyAddresses() {
  const user = await getCurrentUser();
  if (!user) return [];

  return db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, user.id))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
}

export async function createAddress(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const data = addressSchema.parse({
    label: formData.get("label"),
    region: formData.get("region"),
    city: formData.get("city"),
    area: formData.get("area"),
    landmark: formData.get("landmark"),
    phone: formData.get("phone"),
    isDefault: formData.get("isDefault") === "on",
  });

  await db.insert(addresses).values({ ...data, userId: user.id });
  revalidatePath("/account/addresses");
  return { success: true };
}

export async function deleteAddress(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  await db.delete(addresses).where(and(eq(addresses.id, id), eq(addresses.userId, user.id)));
  revalidatePath("/account/addresses");
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   Wishlist
   ═══════════════════════════════════════════════════════════ */

export async function getMyWishlist() {
  const user = await getCurrentUser();
  if (!user) return [];

  const items = await db
    .select({
      id: wishlists.id,
      productId: wishlists.productId,
      createdAt: wishlists.createdAt,
      name: products.name,
      slug: products.slug,
      price: products.price,
      images: products.images,
      stock: products.stock,
    })
    .from(wishlists)
    .innerJoin(products, eq(wishlists.productId, products.id))
    .where(eq(wishlists.userId, user.id))
    .orderBy(desc(wishlists.createdAt));

  return items;
}

export async function addToWishlist(productId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  await db.insert(wishlists).values({ userId: user.id, productId });
  revalidatePath("/account/wishlist");
  return { success: true };
}

export async function removeFromWishlist(productId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  await db
    .delete(wishlists)
    .where(and(eq(wishlists.userId, user.id), eq(wishlists.productId, productId)));
  revalidatePath("/account/wishlist");
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   Settings
   ═══════════════════════════════════════════════════════════ */

export async function updateProfile(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const name = formData.get("name") as string | null;
  const phone = formData.get("phone") as string | null;

  await db
    .update(users)
    .set({
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/account/settings");
  return { success: true };
}

export async function changePassword(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    throw new Error("Both current and new password are required");
  }

  if (newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters");
  }

  // Get current user with password hash
  const fullUser = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!fullUser[0]?.passwordHash) {
    throw new Error("No password set — use 'Forgot password' to set one");
  }

  const valid = await bcrypt.compare(currentPassword, fullUser[0].passwordHash);
  if (!valid) {
    throw new Error("Current password is incorrect");
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await db
    .update(users)
    .set({ passwordHash: hash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  revalidatePath("/account/settings");
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   GDPR Data Rights — Export & Delete
   ═══════════════════════════════════════════════════════════ */

export async function exportMyData() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  const [myOrders, myAddresses, myWishlist, myQuotes] = await Promise.all([
    db.select().from(orders).where(eq(orders.userId, user.id)),
    db.select().from(addresses).where(eq(addresses.userId, user.id)),
    db.select().from(wishlists).where(eq(wishlists.userId, user.id)),
    db.select().from(quotes).where(eq(quotes.email, user.email)),
  ]);

  return {
    profile: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      marketingOptIn: user.marketingOptIn,
      memberSince: user.createdAt,
    },
    orders: myOrders,
    addresses: myAddresses,
    wishlist: myWishlist,
    quotes: myQuotes,
    exportedAt: new Date().toISOString(),
  };
}

export async function deleteMyAccount() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  // Delete user-related data (orders kept for business records, personal data removed)
  await Promise.all([
    db.delete(addresses).where(eq(addresses.userId, user.id)),
    db.delete(wishlists).where(eq(wishlists.userId, user.id)),
  ]);

  // Anonymize orders (keep for legal/tax records but remove personal info)
  await db
    .update(orders)
    .set({ email: "deleted@anonymous", phone: "" })
    .where(eq(orders.userId, user.id));

  // Delete the user account
  await db.delete(users).where(eq(users.id, user.id));

  return { success: true };
}
