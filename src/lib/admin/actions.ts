"use server";

import { db } from "@/lib/db";
import {
  products,
  orders,
  orderItems,
  categories,
  brands,
  quotes,
  discounts,
  users,
} from "@/lib/db/schema";
import { eq, desc, sql, and, like, or, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/guard";

/* ═══════════════════════════════════════════════════════════
   Products CRUD
   ═══════════════════════════════════════════════════════════ */

const productSchema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  description: z.string().min(1, "Description required"),
  longDescription: z.string().optional(),
  price: z.number().int().min(0, "Price required"),
  compareAtPrice: z.number().int().nullable().optional(),
  categoryId: z.string().min(1, "Category required"),
  brandId: z.string().min(1, "Brand required"),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).default(5),
  images: z.array(z.string()).default([]),
  specs: z.record(z.string()).default({}),
  tags: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export async function getAdminProducts(params?: {
  page?: number;
  perPage?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
}) {
  await requireAdmin();
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 20;
  const offset = (page - 1) * perPage;

  const conditions = [];
  if (params?.search) {
    conditions.push(like(products.name, `%${params.search}%`));
  }
  if (params?.categoryId) {
    conditions.push(eq(products.categoryId, params.categoryId));
  }
  if (params?.brandId) {
    conditions.push(eq(products.brandId, params.brandId));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, countResult] = await Promise.all([
    db
      .select({
        id: products.id,
        slug: products.slug,
        name: products.name,
        price: products.price,
        stock: products.stock,
        lowStockThreshold: products.lowStockThreshold,
        images: products.images,
        isFeatured: products.isFeatured,
        isActive: products.isActive,
        categoryId: products.categoryId,
        brandId: products.brandId,
        createdAt: products.createdAt,
        categoryName: categories.name,
        brandName: brands.name,
      })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .where(where)
      .orderBy(desc(products.createdAt))
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(where),
  ]);

  return {
    items,
    total: countResult[0]?.count ?? 0,
    page,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / perPage),
  };
}

export async function getAdminProduct(id: string) {
  await requireAdmin();
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result[0] ?? null;
}

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const data = productSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    longDescription: formData.get("longDescription"),
    price: Number(formData.get("price")),
    compareAtPrice: formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : null,
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId"),
    stock: Number(formData.get("stock")),
    lowStockThreshold: Number(formData.get("lowStockThreshold") ?? 5),
    images: JSON.parse(formData.get("images") as string ?? "[]"),
    specs: JSON.parse(formData.get("specs") as string ?? "{}"),
    tags: JSON.parse(formData.get("tags") as string ?? "[]"),
    isFeatured: formData.get("isFeatured") === "true",
    isActive: formData.get("isActive") !== "false",
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });

  await db.insert(products).values(data);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const data = productSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    longDescription: formData.get("longDescription"),
    price: Number(formData.get("price")),
    compareAtPrice: formData.get("compareAtPrice") ? Number(formData.get("compareAtPrice")) : null,
    categoryId: formData.get("categoryId"),
    brandId: formData.get("brandId"),
    stock: Number(formData.get("stock")),
    lowStockThreshold: Number(formData.get("lowStockThreshold") ?? 5),
    images: JSON.parse(formData.get("images") as string ?? "[]"),
    specs: JSON.parse(formData.get("specs") as string ?? "{}"),
    tags: JSON.parse(formData.get("tags") as string ?? "[]"),
    isFeatured: formData.get("isFeatured") === "true",
    isActive: formData.get("isActive") !== "false",
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });

  await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(products.id, id));
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await db.delete(products).where(eq(products.id, id));
  revalidatePath("/admin/products");
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   Orders CRUD
   ═══════════════════════════════════════════════════════════ */

export async function getAdminOrders(params?: {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
}) {
  await requireAdmin();
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 20;
  const offset = (page - 1) * perPage;

  const conditions = [];
  if (params?.status) {
    conditions.push(eq(orders.status, params.status as typeof orders.status.enumValues[number]));
  }
  if (params?.search) {
    conditions.push(
      or(
        like(orders.orderNumber, `%${params.search}%`),
        like(orders.email, `%${params.search}%`)
      )
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(orders)
      .where(where)
      .orderBy(desc(orders.createdAt))
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(orders)
      .where(where),
  ]);

  return {
    items,
    total: countResult[0]?.count ?? 0,
    page,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / perPage),
  };
}

export async function getAdminOrder(id: string) {
  await requireAdmin();
  const [orderResult, items] = await Promise.all([
    db.select().from(orders).where(eq(orders.id, id)).limit(1),
    db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id)),
  ]);
  return { order: orderResult[0] ?? null, items };
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  const validStatuses = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"] as const;
  if (!validStatuses.includes(status as typeof validStatuses[number])) {
    throw new Error("Invalid status");
  }

  await db
    .update(orders)
    .set({ status: status as typeof orders.status.enumValues[number], updatedAt: new Date() })
    .where(eq(orders.id, orderId));
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   Categories CRUD
   ═══════════════════════════════════════════════════════════ */

const categorySchema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  parentId: z.string().nullable().optional(),
  sortOrder: z.number().int().default(0),
});

export async function getAdminCategories() {
  await requireAdmin();
  return db.select().from(categories).orderBy(categories.sortOrder);
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const data = categorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    parentId: formData.get("parentId") || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });

  await db.insert(categories).values(data);
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin();
  const data = categorySchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    imageUrl: formData.get("imageUrl"),
    parentId: formData.get("parentId") || null,
    sortOrder: Number(formData.get("sortOrder") ?? 0),
  });

  await db.update(categories).set(data).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePath("/admin/categories");
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   Brands CRUD
   ═══════════════════════════════════════════════════════════ */

const brandSchema = z.object({
  name: z.string().min(1, "Name required"),
  slug: z.string().min(1, "Slug required"),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
});

export async function getAdminBrands() {
  await requireAdmin();
  return db.select().from(brands).orderBy(brands.name);
}

export async function createBrand(formData: FormData) {
  await requireAdmin();
  const data = brandSchema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    logoUrl: formData.get("logoUrl"),
    description: formData.get("description"),
  });

  await db.insert(brands).values(data);
  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteBrand(id: string) {
  await requireAdmin();
  await db.delete(brands).where(eq(brands.id, id));
  revalidatePath("/admin/products");
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   Quotes CRUD
   ═══════════════════════════════════════════════════════════ */

export async function getAdminQuotes(params?: {
  page?: number;
  perPage?: number;
  status?: string;
}) {
  await requireAdmin();
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 20;
  const offset = (page - 1) * perPage;

  const where = params?.status
    ? eq(quotes.status, params.status as typeof quotes.status.enumValues[number])
    : undefined;

  const [items, countResult] = await Promise.all([
    db
      .select()
      .from(quotes)
      .where(where)
      .orderBy(desc(quotes.createdAt))
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(quotes)
      .where(where),
  ]);

  return {
    items,
    total: countResult[0]?.count ?? 0,
    page,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / perPage),
  };
}

export async function updateQuoteStatus(quoteId: string, status: string, quotedAmount?: number) {
  await requireAdmin();
  const validStatuses = ["new", "sent", "won", "lost"] as const;
  if (!validStatuses.includes(status as typeof validStatuses[number])) {
    throw new Error("Invalid status");
  }

  await db
    .update(quotes)
    .set({
      status: status as typeof quotes.status.enumValues[number],
      quotedAmount: quotedAmount,
    })
    .where(eq(quotes.id, quoteId));
  revalidatePath("/admin/quotes");
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   Discounts CRUD
   ═══════════════════════════════════════════════════════════ */

const discountSchema = z.object({
  code: z.string().min(1, "Code required"),
  type: z.enum(["percent", "fixed"]),
  value: z.number().int().min(0),
  minOrder: z.number().int().min(0).default(0),
  usageLimit: z.number().int().nullable().optional(),
  startsAt: z.string().nullable().optional(),
  endsAt: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export async function getAdminDiscounts() {
  await requireAdmin();
  return db.select().from(discounts).orderBy(discounts.code);
}

export async function createDiscount(formData: FormData) {
  await requireAdmin();
  const data = discountSchema.parse({
    code: formData.get("code"),
    type: formData.get("type"),
    value: Number(formData.get("value")),
    minOrder: Number(formData.get("minOrder") ?? 0),
    usageLimit: formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null,
    startsAt: formData.get("startsAt") || null,
    endsAt: formData.get("endsAt") || null,
    isActive: formData.get("isActive") !== "false",
  });

  await db.insert(discounts).values({
    ...data,
    startsAt: data.startsAt ? new Date(data.startsAt) : null,
    endsAt: data.endsAt ? new Date(data.endsAt) : null,
  });
  revalidatePath("/admin/discounts");
  return { success: true };
}

export async function updateDiscount(id: string, formData: FormData) {
  await requireAdmin();
  const data = discountSchema.parse({
    code: formData.get("code"),
    type: formData.get("type"),
    value: Number(formData.get("value")),
    minOrder: Number(formData.get("minOrder") ?? 0),
    usageLimit: formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null,
    startsAt: formData.get("startsAt") || null,
    endsAt: formData.get("endsAt") || null,
    isActive: formData.get("isActive") !== "false",
  });

  await db
    .update(discounts)
    .set({
      ...data,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      endsAt: data.endsAt ? new Date(data.endsAt) : null,
    })
    .where(eq(discounts.id, id));
  revalidatePath("/admin/discounts");
  return { success: true };
}

export async function deleteDiscount(id: string) {
  await requireAdmin();
  await db.delete(discounts).where(eq(discounts.id, id));
  revalidatePath("/admin/discounts");
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   Customers
   ═══════════════════════════════════════════════════════════ */

export async function getAdminCustomers(params?: {
  page?: number;
  perPage?: number;
  search?: string;
}) {
  await requireAdmin();
  const page = params?.page ?? 1;
  const perPage = params?.perPage ?? 20;
  const offset = (page - 1) * perPage;

  const conditions = [];
  if (params?.search) {
    conditions.push(
      or(
        like(users.name, `%${params.search}%`),
        like(users.email, `%${params.search}%`)
      )
    );
  }
  // Only customers
  conditions.push(eq(users.role, "customer"));

  const where = and(...conditions);

  const [items, countResult] = await Promise.all([
    db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        phone: users.phone,
        createdAt: users.createdAt,
        emailVerified: users.emailVerified,
      })
      .from(users)
      .where(where)
      .orderBy(desc(users.createdAt))
      .limit(perPage)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(where),
  ]);

  return {
    items,
    total: countResult[0]?.count ?? 0,
    page,
    totalPages: Math.ceil((countResult[0]?.count ?? 0) / perPage),
  };
}

/* ═══════════════════════════════════════════════════════════
   Inventory
   ═══════════════════════════════════════════════════════════ */

export async function getLowStockProducts() {
  await requireAdmin();
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      stock: products.stock,
      lowStockThreshold: products.lowStockThreshold,
      images: products.images,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(sql`${products.stock} <= ${products.lowStockThreshold}`)
    .orderBy(sql`${products.stock} ASC`);
}

export async function updateProductStock(productId: string, stock: number) {
  await requireAdmin();
  await db
    .update(products)
    .set({ stock, updatedAt: new Date() })
    .where(eq(products.id, productId));
  revalidatePath("/admin/inventory");
  return { success: true };
}

/* ═══════════════════════════════════════════════════════════
   Dashboard Stats
   ═══════════════════════════════════════════════════════════ */

export async function getAdminStats() {
  await requireAdmin();
  const [totalRevenue, totalOrders, totalCustomers, totalProducts, lowStockCount] = await Promise.all([
    db
      .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)::int` })
      .from(orders)
      .where(inArray(orders.status, ["paid", "processing", "shipped", "delivered"])),
    db.select({ count: sql<number>`count(*)::int` }).from(orders),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.role, "customer")),
    db.select({ count: sql<number>`count(*)::int` }).from(products),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(sql`${products.stock} <= ${products.lowStockThreshold}`),
  ]);

  return {
    revenue: totalRevenue[0]?.total ?? 0,
    orders: totalOrders[0]?.count ?? 0,
    customers: totalCustomers[0]?.count ?? 0,
    products: totalProducts[0]?.count ?? 0,
    lowStock: lowStockCount[0]?.count ?? 0,
  };
}
