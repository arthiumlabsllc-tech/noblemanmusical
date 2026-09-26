import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ═══════════════════════════════════════════════════════════
   Enums
   ═══════════════════════════════════════════════════════════ */

export const userRoleEnum = pgEnum("user_role", ["customer", "staff", "admin"]);
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);
export const paymentMethodEnum = pgEnum("payment_method", [
  "paystack",
  "momo",
  "cod",
]);
export const orgTypeEnum = pgEnum("org_type", [
  "church",
  "radio",
  "school",
  "studio",
  "other",
]);
export const quoteStatusEnum = pgEnum("quote_status", [
  "new",
  "sent",
  "won",
  "lost",
]);
export const discountTypeEnum = pgEnum("discount_type", ["percent", "fixed"]);

/* ═══════════════════════════════════════════════════════════
   Users & Auth (Auth.js v5)
   ═══════════════════════════════════════════════════════════ */

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash"),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  role: userRoleEnum("role").notNull().default("customer"),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  marketingOptIn: boolean("marketing_opt_in").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    providerAccountIdx: uniqueIndex("account_provider_account_idx").on(
      table.provider,
      table.providerAccountId
    ),
  })
);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull().unique(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    identifierTokenIdx: uniqueIndex("vt_identifier_token_idx").on(
      table.identifier,
      table.token
    ),
  })
);

/* ═══════════════════════════════════════════════════════════
   Addresses
   ═══════════════════════════════════════════════════════════ */

export const addresses = pgTable("addresses", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 100 }),
  region: varchar("region", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  area: varchar("area", { length: 200 }),
  landmark: text("landmark"),
  phone: varchar("phone", { length: 20 }),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

/* ═══════════════════════════════════════════════════════════
   Categories
   ═══════════════════════════════════════════════════════════ */

export const categories = pgTable(
  "categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    parentId: uuid("parent_id"),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("category_slug_idx").on(table.slug),
  })
);

/* ═══════════════════════════════════════════════════════════
   Brands
   ═══════════════════════════════════════════════════════════ */

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  logoUrl: text("logo_url"),
  description: text("description"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

/* ═══════════════════════════════════════════════════════════
   Products
   ═══════════════════════════════════════════════════════════ */

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 300 }).notNull(),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    price: integer("price").notNull(), // in pesewas
    compareAtPrice: integer("compare_at_price"),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id),
    brandId: uuid("brand_id")
      .notNull()
      .references(() => brands.id),
    stock: integer("stock").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    specs: jsonb("specs").$type<Record<string, string>>().notNull().default({}),
    tags: text("tags").array().notNull().default([]),
    isFeatured: boolean("is_featured").notNull().default(false),
    isActive: boolean("is_active").notNull().default(true),
    seoTitle: varchar("seo_title", { length: 70 }),
    seoDescription: varchar("seo_description", { length: 160 }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    slugIdx: uniqueIndex("product_slug_idx").on(table.slug),
    categoryIdx: index("product_category_idx").on(table.categoryId),
    brandIdx: index("product_brand_idx").on(table.brandId),
  })
);

/* ═══════════════════════════════════════════════════════════
   Product Variants
   ═══════════════════════════════════════════════════════════ */

export const productVariants = pgTable("product_variants", {
  id: uuid("id").primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: integer("price").notNull(),
  stock: integer("stock").notNull().default(0),
  attributes: jsonb("attributes")
    .$type<Record<string, string>>()
    .notNull()
    .default({}),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

/* ═══════════════════════════════════════════════════════════
   Carts
   ═══════════════════════════════════════════════════════════ */

export type CartItem = {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
};

export const carts = pgTable("carts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  sessionId: varchar("session_id", { length: 255 }).unique(),
  items: jsonb("items").$type<CartItem[]>().notNull().default([]),
  updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  expiresAt: timestamp("expires_at", { mode: "date" }),
});

/* ═══════════════════════════════════════════════════════════
   Orders
   ═══════════════════════════════════════════════════════════ */

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 20 }).notNull().unique(),
    userId: uuid("user_id").references(() => users.id),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    status: orderStatusEnum("status").notNull().default("pending"),
    subtotal: integer("subtotal").notNull(),
    deliveryFee: integer("delivery_fee").notNull().default(0),
    discount: integer("discount").notNull().default(0),
    total: integer("total").notNull(),
    paymentMethod: paymentMethodEnum("payment_method"),
    paymentRef: varchar("payment_ref", { length: 255 }),
    deliveryAddress: jsonb("delivery_address").$type<{
      region: string;
      city: string;
      area: string;
      landmark?: string;
    }>(),
    notes: text("notes"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    orderNumberIdx: uniqueIndex("order_number_idx").on(table.orderNumber),
    emailIdx: index("order_email_idx").on(table.email),
  })
);

export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id),
  variantId: uuid("variant_id").references(() => productVariants.id),
  name: varchar("name", { length: 300 }).notNull(),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  image: text("image"),
});

/* ═══════════════════════════════════════════════════════════
   Quotes (B2B)
   ═══════════════════════════════════════════════════════════ */

export const quotes = pgTable(
  "quotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orgName: varchar("org_name", { length: 300 }).notNull(),
    orgType: orgTypeEnum("org_type").notNull(),
    contactName: varchar("contact_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    items: jsonb("items").$type<Array<{ productId?: string; name: string; quantity: number }>>().notNull().default([]),
    message: text("message"),
    status: quoteStatusEnum("status").notNull().default("new"),
    quotedAmount: integer("quoted_amount"),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("quote_status_idx").on(table.status),
  })
);

/* ═══════════════════════════════════════════════════════════
   Reviews
   ═══════════════════════════════════════════════════════════ */

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    rating: integer("rating").notNull(),
    title: varchar("title", { length: 200 }),
    body: text("body"),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    productIdx: index("review_product_idx").on(table.productId),
  })
);

/* ═══════════════════════════════════════════════════════════
   Wishlists
   ═══════════════════════════════════════════════════════════ */

export const wishlists = pgTable(
  "wishlists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    userProductIdx: uniqueIndex("wishlist_user_product_idx").on(
      table.userId,
      table.productId
    ),
  })
);

/* ═══════════════════════════════════════════════════════════
   Discounts
   ═══════════════════════════════════════════════════════════ */

export const discounts = pgTable("discounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: discountTypeEnum("type").notNull(),
  value: integer("value").notNull(),
  minOrder: integer("min_order").notNull().default(0),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").notNull().default(0),
  startsAt: timestamp("starts_at", { mode: "date" }),
  endsAt: timestamp("ends_at", { mode: "date" }),
  isActive: boolean("is_active").notNull().default(true),
});

/* ═══════════════════════════════════════════════════════════
   Subscribers
   ═══════════════════════════════════════════════════════════ */

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  source: varchar("source", { length: 100 }),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

/* ═══════════════════════════════════════════════════════════
   Self-referencing relation for categories
   ═══════════════════════════════════════════════════════════ */

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  products: many(products),
}));

/* ═══════════════════════════════════════════════════════════
   Relations
   ═══════════════════════════════════════════════════════════ */

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  addresses: many(addresses),
  orders: many(orders),
  reviews: many(reviews),
  wishlists: many(wishlists),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const addressesRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const brandsRelations = relations(brands, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  brand: one(brands, {
    fields: [products.brandId],
    references: [brands.id],
  }),
  variants: many(productVariants),
  orderItems: many(orderItems),
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
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one }) => ({
  user: one(users, {
    fields: [wishlists.userId],
    references: [users.id],
  }),
  product: one(products, {
    fields: [wishlists.productId],
    references: [products.id],
  }),
}));

/* ═══════════════════════════════════════════════════════════
   Type exports
   ═══════════════════════════════════════════════════════════ */

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type Brand = typeof brands.$inferSelect;
export type NewBrand = typeof brands.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
export type Quote = typeof quotes.$inferSelect;
export type NewQuote = typeof quotes.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type Wishlist = typeof wishlists.$inferSelect;
export type Discount = typeof discounts.$inferSelect;
export type NewDiscount = typeof discounts.$inferInsert;
export type Subscriber = typeof subscribers.$inferSelect;
export type Address = typeof addresses.$inferSelect;
export type NewAddress = typeof addresses.$inferInsert;
