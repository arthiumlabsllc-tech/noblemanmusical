import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================================================
// ENUMS
// ============================================================================

export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "super_admin",
  "admin",
  "manager",
  "cashier",
  "stock_keeper",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "confirmed",
  "processing",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "paystack",
  "momo",
  "cash",
  "card",
  "split",
]);

export const quoteStatusEnum = pgEnum("quote_status", [
  "pending",
  "responded",
  "won",
  "lost",
  "converted",
]);

export const workerStatusEnum = pgEnum("worker_status", [
  "active",
  "inactive",
  "terminated",
]);

export const posSaleStatusEnum = pgEnum("pos_sale_status", [
  "completed",
  "refunded",
  "voided",
]);

export const posShiftStatusEnum = pgEnum("pos_shift_status", ["open", "closed"]);

export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed"]);

export const refundMethodEnum = pgEnum("refund_method", ["cash", "momo", "original"]);

// ============================================================================
// USERS & AUTH (Auth.js v5)
// ============================================================================

export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `usr_${crypto.randomUUID()}`),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: text("password_hash"),
    name: varchar("name", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    role: userRoleEnum("role").notNull().default("customer"),
    image: text("image"),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
    roleIdx: index("users_role_idx").on(table.role),
  })
);

export const accounts = pgTable(
  "accounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `acc_${crypto.randomUUID()}`),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    providerIdx: uniqueIndex("accounts_provider_idx").on(
      table.provider,
      table.providerAccountId
    ),
    userIdx: index("accounts_user_idx").on(table.userId),
  })
);

export const sessions = pgTable(
  "sessions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `ses_${crypto.randomUUID()}`),
    sessionToken: text("session_token").notNull().unique(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("sessions_token_idx").on(table.sessionToken),
  })
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    tokenIdx: uniqueIndex("vt_token_idx").on(table.token),
  })
);

// ============================================================================
// ADDRESSES
// ============================================================================

export const addresses = pgTable(
  "addresses",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `addr_${crypto.randomUUID()}`),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: varchar("label", { length: 100 }).notNull(),
    region: varchar("region", { length: 100 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    area: varchar("area", { length: 200 }),
    landmark: text("landmark"),
    phone: varchar("phone", { length: 20 }),
    isDefault: boolean("is_default").notNull().default(false),
  },
  (table) => ({
    userIdx: index("addresses_user_idx").on(table.userId),
  })
);

// ============================================================================
// CATEGORIES
// ============================================================================

export const categories = pgTable(
  "categories",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `cat_${crypto.randomUUID()}`),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    parentId: text("parent_id"),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (table) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
    parentIdx: index("categories_parent_idx").on(table.parentId),
    parentFk: index("categories_parent_fk_idx").on(table.parentId),
  })
);

// ============================================================================
// BRANDS
// ============================================================================

export const brands = pgTable(
  "brands",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `brd_${crypto.randomUUID()}`),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    logoUrl: text("logo_url"),
    description: text("description"),
  },
  (table) => ({
    slugIdx: uniqueIndex("brands_slug_idx").on(table.slug),
  })
);

// ============================================================================
// PRODUCTS
// ============================================================================

export const products = pgTable(
  "products",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `prod_${crypto.randomUUID()}`),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    longDescription: text("long_description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id),
    brandId: text("brand_id")
      .notNull()
      .references(() => brands.id),
    stock: integer("stock").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    specs: jsonb("specs").$type<Record<string, string>>().notNull().default({}),
    tags: jsonb("tags").$type<string[]>().notNull().default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    seoTitle: varchar("seo_title", { length: 255 }),
    seoDescription: text("seo_description"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
    categoryIdx: index("products_category_idx").on(table.categoryId),
    brandIdx: index("products_brand_idx").on(table.brandId),
    featuredIdx: index("products_featured_idx").on(table.isFeatured),
    activeIdx: index("products_active_idx").on(table.isActive),
    stockIdx: index("products_stock_idx").on(table.stock),
  })
);

// ============================================================================
// PRODUCT VARIANTS
// ============================================================================

export const productVariants = pgTable(
  "product_variants",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `var_${crypto.randomUUID()}`),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 100 }),
    price: decimal("price", { precision: 10, scale: 2 }),
    stock: integer("stock").notNull().default(0),
    attributes: jsonb("attributes").$type<Record<string, string>>().notNull().default({}),
  },
  (table) => ({
    productIdx: index("variants_product_idx").on(table.productId),
    skuIdx: index("variants_sku_idx").on(table.sku),
  })
);

// ============================================================================
// CARTS
// ============================================================================

export const carts = pgTable(
  "carts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `cart_${crypto.randomUUID()}`),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    sessionId: text("session_id"),
    items: jsonb("items")
      .$type<Array<{ productId: string; variantId?: string; quantity: number }>>()
      .notNull()
      .default([]),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { mode: "date" }),
  },
  (table) => ({
    userIdx: index("carts_user_idx").on(table.userId),
    sessionIdx: index("carts_session_idx").on(table.sessionId),
  })
);

// ============================================================================
// ORDERS
// ============================================================================

export const orders = pgTable(
  "orders",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `ord_${crypto.randomUUID()}`),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    userId: text("user_id").references(() => users.id),
    email: varchar("email", { length: 255 }),
    phone: varchar("phone", { length: 20 }),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    deliveryFee: decimal("delivery_fee", { precision: 10, scale: 2 }).notNull().default("0"),
    discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentRef: text("payment_ref"),
    deliveryAddress: jsonb("delivery_address").$type<{
      region: string;
      city: string;
      area?: string;
      landmark?: string;
      phone?: string;
    }>(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    orderNumIdx: uniqueIndex("orders_number_idx").on(table.orderNumber),
    userIdx: index("orders_user_idx").on(table.userId),
    statusIdx: index("orders_status_idx").on(table.status),
    createdAtIdx: index("orders_created_idx").on(table.createdAt),
  })
);

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `oi_${crypto.randomUUID()}`),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    variantId: text("variant_id").references(() => productVariants.id),
    name: varchar("name", { length: 255 }).notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    image: text("image"),
  },
  (table) => ({
    orderIdx: index("order_items_order_idx").on(table.orderId),
  })
);

// ============================================================================
// QUOTES
// ============================================================================

export const quotes = pgTable(
  "quotes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `qt_${crypto.randomUUID()}`),
    orgName: varchar("org_name", { length: 255 }).notNull(),
    orgType: varchar("org_type", { length: 100 }).notNull(),
    contactName: varchar("contact_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    items: jsonb("items")
      .$type<Array<{ productId: string; name: string; quantity: number }>>()
      .notNull()
      .default([]),
    message: text("message"),
    status: quoteStatusEnum("status").notNull().default("pending"),
    quotedAmount: decimal("quoted_amount", { precision: 10, scale: 2 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("quotes_status_idx").on(table.status),
  })
);

// ============================================================================
// REVIEWS
// ============================================================================

export const reviews = pgTable(
  "reviews",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `rev_${crypto.randomUUID()}`),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 255 }),
    body: text("body"),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    productIdx: index("reviews_product_idx").on(table.productId),
    userIdx: index("reviews_user_idx").on(table.userId),
  })
);

// ============================================================================
// WISHLISTS
// ============================================================================

export const wishlists = pgTable(
  "wishlists",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `wl_${crypto.randomUUID()}`),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("wishlists_user_idx").on(table.userId),
    uniqueWishlist: uniqueIndex("wishlists_unique_idx").on(table.userId, table.productId),
  })
);

// ============================================================================
// DISCOUNTS
// ============================================================================

export const discounts = pgTable(
  "discounts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `disc_${crypto.randomUUID()}`),
    code: varchar("code", { length: 100 }).notNull().unique(),
    type: discountTypeEnum("type").notNull(),
    value: decimal("value", { precision: 10, scale: 2 }).notNull(),
    minOrder: decimal("min_order", { precision: 10, scale: 2 }),
    usageLimit: integer("usage_limit"),
    usedCount: integer("used_count").notNull().default(0),
    startsAt: timestamp("starts_at", { mode: "date" }),
    endsAt: timestamp("ends_at", { mode: "date" }),
    isActive: boolean("is_active").notNull().default(true),
  },
  (table) => ({
    codeIdx: uniqueIndex("discounts_code_idx").on(table.code),
  })
);

// ============================================================================
// SUBSCRIBERS
// ============================================================================

export const subscribers = pgTable(
  "subscribers",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `sub_${crypto.randomUUID()}`),
    email: varchar("email", { length: 255 }).notNull().unique(),
    source: varchar("source", { length: 100 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: uniqueIndex("subscribers_email_idx").on(table.email),
  })
);

// ============================================================================
// WORKER PROFILES
// ============================================================================

export const workerProfiles = pgTable(
  "worker_profiles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `wk_${crypto.randomUUID()}`),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    employeeCode: varchar("employee_code", { length: 50 }),
    hireDate: timestamp("hire_date", { mode: "date" }),
    department: varchar("department", { length: 100 }),
    hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
    status: workerStatusEnum("status").notNull().default("active"),
  },
  (table) => ({
    userIdx: uniqueIndex("worker_profiles_user_idx").on(table.userId),
    codeIdx: index("worker_profiles_code_idx").on(table.employeeCode),
  })
);

// ============================================================================
// ROLES & PERMISSIONS
// ============================================================================

export const roles = pgTable(
  "roles",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `role_${crypto.randomUUID()}`),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    isSystem: boolean("is_system").notNull().default(false),
  },
  (table) => ({
    slugIdx: uniqueIndex("roles_slug_idx").on(table.slug),
  })
);

export const permissions = pgTable(
  "permissions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `perm_${crypto.randomUUID()}`),
    key: varchar("key", { length: 100 }).notNull().unique(),
    description: text("description"),
    category: varchar("category", { length: 100 }),
  },
  (table) => ({
    keyIdx: uniqueIndex("permissions_key_idx").on(table.key),
  })
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: text("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: uniqueIndex("role_permissions_pk_idx").on(table.roleId, table.permissionId),
  })
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { mode: "date" }).notNull().defaultNow(),
    assignedBy: text("assigned_by").references(() => users.id),
  },
  (table) => ({
    pk: uniqueIndex("user_roles_pk_idx").on(table.userId, table.roleId),
  })
);

// ============================================================================
// POS TERMINALS
// ============================================================================

export const posTerminals = pgTable(
  "pos_terminals",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `term_${crypto.randomUUID()}`),
    name: varchar("name", { length: 100 }).notNull(),
    location: varchar("location", { length: 255 }),
    isActive: boolean("is_active").notNull().default(true),
    assignedWorkerId: text("assigned_worker_id").references(() => workerProfiles.id),
  },
  (table) => ({
    workerIdx: index("pos_terminals_worker_idx").on(table.assignedWorkerId),
  })
);

// ============================================================================
// POS SHIFTS
// ============================================================================

export const posShifts = pgTable(
  "pos_shifts",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `shift_${crypto.randomUUID()}`),
    terminalId: text("terminal_id")
      .notNull()
      .references(() => posTerminals.id),
    openedByUserId: text("opened_by_user_id")
      .notNull()
      .references(() => users.id),
    openedAt: timestamp("opened_at", { mode: "date" }).notNull().defaultNow(),
    closedAt: timestamp("closed_at", { mode: "date" }),
    openingCash: decimal("opening_cash", { precision: 10, scale: 2 }).notNull().default("0"),
    closingCash: decimal("closing_cash", { precision: 10, scale: 2 }),
    expectedCash: decimal("expected_cash", { precision: 10, scale: 2 }),
    actualCash: decimal("actual_cash", { precision: 10, scale: 2 }),
    discrepancy: decimal("discrepancy", { precision: 10, scale: 2 }),
    notes: text("notes"),
    status: posShiftStatusEnum("status").notNull().default("open"),
  },
  (table) => ({
    terminalIdx: index("pos_shifts_terminal_idx").on(table.terminalId),
    statusIdx: index("pos_shifts_status_idx").on(table.status),
  })
);

// ============================================================================
// POS SALES
// ============================================================================

export const posSales = pgTable(
  "pos_sales",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `sale_${crypto.randomUUID()}`),
    shiftId: text("shift_id")
      .notNull()
      .references(() => posShifts.id),
    terminalId: text("terminal_id")
      .notNull()
      .references(() => posTerminals.id),
    cashierUserId: text("cashier_user_id")
      .notNull()
      .references(() => users.id),
    customerName: varchar("customer_name", { length: 255 }),
    customerPhone: varchar("customer_phone", { length: 20 }),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
    tax: decimal("tax", { precision: 10, scale: 2 }).notNull().default("0"),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: paymentMethodEnum("payment_method").notNull(),
    paymentRef: text("payment_ref"),
    status: posSaleStatusEnum("status").notNull().default("completed"),
    receiptNumber: varchar("receipt_number", { length: 50 }).notNull().unique(),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    shiftIdx: index("pos_sales_shift_idx").on(table.shiftId),
    cashierIdx: index("pos_sales_cashier_idx").on(table.cashierUserId),
    receiptIdx: uniqueIndex("pos_sales_receipt_idx").on(table.receiptNumber),
    createdAtIdx: index("pos_sales_created_idx").on(table.createdAt),
  })
);

export const posSaleItems = pgTable(
  "pos_sale_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `si_${crypto.randomUUID()}`),
    saleId: text("sale_id")
      .notNull()
      .references(() => posSales.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    variantId: text("variant_id").references(() => productVariants.id),
    name: varchar("name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 100 }),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    lineTotal: decimal("line_total", { precision: 10, scale: 2 }).notNull(),
    discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  },
  (table) => ({
    saleIdx: index("pos_sale_items_sale_idx").on(table.saleId),
  })
);

// ============================================================================
// POS RETURNS
// ============================================================================

export const posReturns = pgTable(
  "pos_returns",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `ret_${crypto.randomUUID()}`),
    saleId: text("sale_id")
      .notNull()
      .references(() => posSales.id),
    processedByUserId: text("processed_by_user_id")
      .notNull()
      .references(() => users.id),
    reason: text("reason"),
    refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
    refundMethod: refundMethodEnum("refund_method").notNull(),
    restocked: boolean("restocked").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    saleIdx: index("pos_returns_sale_idx").on(table.saleId),
  })
);

export const posReturnItems = pgTable(
  "pos_return_items",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `ri_${crypto.randomUUID()}`),
    returnId: text("return_id")
      .notNull()
      .references(() => posReturns.id, { onDelete: "cascade" }),
    saleItemId: text("sale_item_id")
      .notNull()
      .references(() => posSaleItems.id),
    quantity: integer("quantity").notNull(),
    refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }).notNull(),
  },
  (table) => ({
    returnIdx: index("pos_return_items_return_idx").on(table.returnId),
  })
);

// ============================================================================
// AUDIT LOG
// ============================================================================

export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => `audit_${crypto.randomUUID()}`),
    userId: text("user_id").references(() => users.id),
    action: varchar("action", { length: 100 }).notNull(),
    entity: varchar("entity", { length: 100 }).notNull(),
    entityId: text("entity_id"),
    metadata: jsonb("metadata"),
    ip: varchar("ip", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    userIdx: index("audit_log_user_idx").on(table.userId),
    entityIdx: index("audit_log_entity_idx").on(table.entity, table.entityId),
    createdAtIdx: index("audit_log_created_idx").on(table.createdAt),
  })
);

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many, one }) => ({
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  wishlists: many(wishlists),
  workerProfile: one(workerProfiles),
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
  parent: one(categories, { fields: [categories.parentId], references: [categories.id] }),
  children: many(categories),
  products: many(products),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  brand: one(brands, { fields: [products.brandId], references: [brands.id] }),
  variants: many(productVariants),
  reviews: many(reviews),
  wishlists: many(wishlists),
}));

export const productVariantsRelations = relations(productVariants, ({ one }) => ({
  product: one(products, {
    fields: [productVariants.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, { fields: [reviews.productId], references: [products.id] }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
}));

export const posSalesRelations = relations(posSales, ({ one, many }) => ({
  shift: one(posShifts, { fields: [posSales.shiftId], references: [posShifts.id] }),
  terminal: one(posTerminals, {
    fields: [posSales.terminalId],
    references: [posTerminals.id],
  }),
  cashier: one(users, { fields: [posSales.cashierUserId], references: [users.id] }),
  items: many(posSaleItems),
}));

export const posSaleItemsRelations = relations(posSaleItems, ({ one }) => ({
  sale: one(posSales, { fields: [posSaleItems.saleId], references: [posSales.id] }),
  product: one(products, {
    fields: [posSaleItems.productId],
    references: [products.id],
  }),
}));

export const posShiftsRelations = relations(posShifts, ({ one, many }) => ({
  terminal: one(posTerminals, {
    fields: [posShifts.terminalId],
    references: [posTerminals.id],
  }),
  sales: many(posSales),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  permissions: many(rolePermissions),
  users: many(userRoles),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  roles: many(rolePermissions),
}));
