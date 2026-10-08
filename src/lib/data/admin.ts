/**
 * Admin/POS data-access layer.
 *
 * Same contract as the storefront layer: every read runs against the real
 * schema through the lazy `db` client, and each falls back to seed-equivalent
 * mock data when the database isn't configured so the dashboards render during
 * development. Mutations live in `src/lib/actions/*`.
 */
import { and, asc, count, desc, eq, inArray, lte, sql } from "drizzle-orm";
import { db, isDatabaseConfigured } from "@/lib/db";
import {
  brands,
  discounts,
  orders,
  posSales,
  productStock,
  products,
  stores,
  users,
  workerProfiles,
} from "@/lib/db/schema";
import { getProducts } from "@/lib/data/storefront";

function toNumber(v: string | number | null | undefined): number {
  return typeof v === "number" ? v : Number(v ?? 0);
}

// ── Dashboard stats ───────────────────────────────────────────────────────────

export type DashboardStats = {
  revenue: number;
  orders: number;
  products: number;
  customers: number;
  lowStock: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isDatabaseConfigured()) {
    return { revenue: 45299.9, orders: 128, products: 36, customers: 89, lowStock: 5 };
  }
  try {
    const [orderAgg] = await db
      .select({
        revenue: sql<string>`coalesce(sum(${orders.total}), 0)`,
        orders: count(),
      })
      .from(orders)
      .where(inArray(orders.status, ["paid", "shipped", "delivered"]));

    const [{ count: productCount }] = await db
      .select({ count: count() })
      .from(products)
      .where(eq(products.isActive, true));

    const [{ count: customerCount }] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.role, "customer"));

    const [{ count: lowCount }] = await db
      .select({ count: count() })
      .from(products)
      .where(and(eq(products.isActive, true), lte(products.stock, products.lowStockThreshold)));

    return {
      revenue: toNumber(orderAgg?.revenue),
      orders: Number(orderAgg?.orders ?? 0),
      products: Number(productCount),
      customers: Number(customerCount),
      lowStock: Number(lowCount),
    };
  } catch (err) {
    console.error("[admin] getDashboardStats failed, using fallback:", err);
    return { revenue: 45299.9, orders: 128, products: 36, customers: 89, lowStock: 5 };
  }
}

// ── Recent orders (dashboard list) ────────────────────────────────────────────

export type RecentOrder = {
  orderNumber: string;
  customer: string;
  total: number;
  status: string;
  date: string;
};

export async function getRecentOrders(limit = 5): Promise<RecentOrder[]> {
  const fallback: RecentOrder[] = [
    { orderNumber: "NMC-ABC123", customer: "Pastor Mensah", total: 4599.99, status: "paid", date: "2026-10-06" },
    { orderNumber: "NMC-DEF456", customer: "Grace Chapel", total: 12999.99, status: "processing", date: "2026-10-05" },
    { orderNumber: "NMC-GHI789", customer: "Kwame A.", total: 699.99, status: "shipped", date: "2026-10-04" },
    { orderNumber: "NMC-JKL012", customer: "Joy FM", total: 2199.99, status: "delivered", date: "2026-10-03" },
    { orderNumber: "NMC-MNO345", customer: "Ama D.", total: 549.99, status: "pending", date: "2026-10-02" },
  ];
  if (!isDatabaseConfigured()) return fallback.slice(0, limit);
  try {
    const rows = await db
      .select({
        orderNumber: orders.orderNumber,
        customer: orders.email,
        total: orders.total,
        status: orders.status,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(limit);
    return rows.map((r) => ({
      orderNumber: r.orderNumber,
      customer: r.customer ?? "Guest",
      total: toNumber(r.total),
      status: r.status,
      date: r.createdAt.toISOString().slice(0, 10),
    }));
  } catch (err) {
    console.error("[admin] getRecentOrders failed, using fallback:", err);
    return fallback.slice(0, limit);
  }
}

// ── Inventory (per-store stock) ────────────────────────────────────────────────

export type InventoryRow = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  catalogStock: number;
  storeQty: number;
};

export async function getInventory(storeId: string): Promise<InventoryRow[]> {
  if (!isDatabaseConfigured()) {
    const catalog = await getProducts({ limit: 100 });
    return catalog.map((p) => ({
      productId: p.slug, // slug acts as the id in fallback mode (no persistence)
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      price: p.price,
      catalogStock: p.stock,
      storeQty: p.stock,
    }));
  }
  try {
    const rows = await db
      .select({
        productId: products.id,
        slug: products.slug,
        name: products.name,
        brand: brands.name,
        price: products.price,
        catalogStock: products.stock,
        storeQty: productStock.quantity,
      })
      .from(products)
      .innerJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(
        productStock,
        and(eq(productStock.productId, products.id), eq(productStock.storeId, storeId))
      )
      .where(eq(products.isActive, true))
      .orderBy(asc(products.name));
    return rows.map((r) => ({
      productId: r.productId,
      slug: r.slug,
      name: r.name,
      brand: r.brand,
      price: toNumber(r.price),
      catalogStock: r.catalogStock,
      // No explicit row yet → show the catalog stock as this store's starting qty.
      storeQty: r.storeQty ?? r.catalogStock,
    }));
  } catch (err) {
    console.error("[admin] getInventory failed:", err);
    return [];
  }
}

// ── Discounts ──────────────────────────────────────────────────────────────────

export type DiscountRow = {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrder: number | null;
  usageLimit: number | null;
  usedCount: number;
  startsAt: Date | null;
  endsAt: Date | null;
  isActive: boolean;
};

export async function listDiscounts(): Promise<DiscountRow[]> {
  const fallback: DiscountRow[] = [
    { id: "d1", code: "WELCOME10", type: "percentage", value: 10, minOrder: 200, usageLimit: 100, usedCount: 12, startsAt: null, endsAt: null, isActive: true },
    { id: "d2", code: "GHANA20", type: "percentage", value: 20, minOrder: 500, usageLimit: 50, usedCount: 3, startsAt: null, endsAt: null, isActive: true },
    { id: "d3", code: "FLAT50", type: "fixed", value: 50, minOrder: 300, usageLimit: 200, usedCount: 40, startsAt: null, endsAt: null, isActive: true },
    { id: "d4", code: "STUDIO15", type: "percentage", value: 15, minOrder: 1000, usageLimit: 25, usedCount: 0, startsAt: null, endsAt: null, isActive: true },
    { id: "d5", code: "EXPIRED", type: "percentage", value: 10, minOrder: null, usageLimit: null, usedCount: 0, startsAt: null, endsAt: null, isActive: false },
  ];
  if (!isDatabaseConfigured()) return fallback;
  try {
    const rows = await db.select().from(discounts).orderBy(desc(discounts.isActive), asc(discounts.code));
    return rows.map((r) => ({
      id: r.id,
      code: r.code,
      type: r.type,
      value: toNumber(r.value),
      minOrder: r.minOrder == null ? null : toNumber(r.minOrder),
      usageLimit: r.usageLimit,
      usedCount: r.usedCount,
      startsAt: r.startsAt,
      endsAt: r.endsAt,
      isActive: r.isActive,
    }));
  } catch (err) {
    console.error("[admin] listDiscounts failed, using fallback:", err);
    return fallback;
  }
}

// ── Employees ──────────────────────────────────────────────────────────────────

export type EmployeeRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  storeId: string | null;
  storeName: string | null;
  employeeCode: string | null;
  department: string | null;
  status: string;
};

const EMPLOYEE_ROLES = ["super_admin", "admin", "manager", "cashier", "stock_keeper"] as const;

export async function listEmployees(): Promise<EmployeeRow[]> {
  const fallback: EmployeeRow[] = [
    { id: "u1", name: "Nobleman Admin", email: "admin@noblemangh.com", role: "super_admin", storeId: "sto_accra_main", storeName: "Accra", employeeCode: "EMP-000", department: "Management", status: "active" },
    { id: "u2", name: "Ama Darko", email: "manager@noblemangh.com", role: "manager", storeId: "sto_accra_main", storeName: "Accra", employeeCode: "EMP-002", department: "Management", status: "active" },
    { id: "u3", name: "Kwame Mensah", email: "cashier@noblemangh.com", role: "cashier", storeId: "sto_accra_main", storeName: "Accra", employeeCode: "EMP-001", department: "Sales", status: "active" },
  ];
  if (!isDatabaseConfigured()) return fallback;
  try {
    const rows = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        storeId: users.storeId,
        storeName: stores.name,
        employeeCode: workerProfiles.employeeCode,
        department: workerProfiles.department,
        status: workerProfiles.status,
      })
      .from(users)
      .leftJoin(stores, eq(users.storeId, stores.id))
      .leftJoin(workerProfiles, eq(workerProfiles.userId, users.id))
      .where(inArray(users.role, EMPLOYEE_ROLES))
      .orderBy(asc(users.name));
    return rows.map((r) => ({
      id: r.id,
      name: r.name ?? "—",
      email: r.email,
      role: r.role,
      storeId: r.storeId,
      storeName: r.storeName,
      employeeCode: r.employeeCode,
      department: r.department,
      status: r.status ?? "active",
    }));
  } catch (err) {
    console.error("[admin] listEmployees failed, using fallback:", err);
    return fallback;
  }
}

// ── POS receipts (own / store-scoped) ──────────────────────────────────────────

export type ReceiptRow = {
  id: string;
  receiptNumber: string;
  customerName: string | null;
  total: number;
  paymentMethod: string;
  createdAt: string;
};

export async function getPosReceipts(opts: {
  storeId?: string;
  cashierUserId?: string;
  limit?: number;
}): Promise<ReceiptRow[]> {
  const { storeId, cashierUserId, limit = 25 } = opts;
  const fallback: ReceiptRow[] = [
    { id: "s1", receiptNumber: "RCT-001005", customerName: "Walk-in Customer", total: 549.99, paymentMethod: "cash", createdAt: "2026-10-08 09:12" },
    { id: "s2", receiptNumber: "RCT-001004", customerName: "Pastor Mensah", total: 4599.99, paymentMethod: "momo", createdAt: "2026-10-08 08:40" },
    { id: "s3", receiptNumber: "RCT-001003", customerName: "Walk-in Customer", total: 699.99, paymentMethod: "cash", createdAt: "2026-10-07 17:05" },
  ];
  if (!isDatabaseConfigured()) return fallback.slice(0, limit);
  try {
    const conds = [];
    if (storeId) conds.push(eq(posSales.storeId, storeId));
    if (cashierUserId) conds.push(eq(posSales.cashierUserId, cashierUserId));
    const rows = await db
      .select({
        id: posSales.id,
        receiptNumber: posSales.receiptNumber,
        customerName: posSales.customerName,
        total: posSales.total,
        paymentMethod: posSales.paymentMethod,
        createdAt: posSales.createdAt,
      })
      .from(posSales)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(posSales.createdAt))
      .limit(limit);
    return rows.map((r) => ({
      id: r.id,
      receiptNumber: r.receiptNumber,
      customerName: r.customerName,
      total: toNumber(r.total),
      paymentMethod: r.paymentMethod,
      createdAt: r.createdAt.toISOString().replace("T", " ").slice(0, 16),
    }));
  } catch (err) {
    console.error("[admin] getPosReceipts failed, using fallback:", err);
    return fallback.slice(0, limit);
  }
}
