/**
 * Permission keys used throughout the application.
 * Must match the keys seeded in the `permissions` table.
 */
export const PERMISSION_KEYS = {
  // Products
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_EDIT: "products.edit",
  PRODUCTS_DELETE: "products.delete",

  // Categories
  CATEGORIES_VIEW: "categories.view",
  CATEGORIES_MANAGE: "categories.manage",

  // Brands
  BRANDS_VIEW: "brands.view",
  BRANDS_MANAGE: "brands.manage",

  // Orders
  ORDERS_VIEW: "orders.view",
  ORDERS_EDIT: "orders.edit",
  ORDERS_REFUND: "orders.refund",

  // Quotes
  QUOTES_VIEW: "quotes.view",
  QUOTES_RESPOND: "quotes.respond",
  QUOTES_CONVERT: "quotes.convert",

  // Inventory
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_ADJUST: "inventory.adjust",

  // Customers
  CUSTOMERS_VIEW: "customers.view",

  // Discounts
  DISCOUNTS_VIEW: "discounts.view",
  DISCOUNTS_MANAGE: "discounts.manage",

  // Reports
  REPORTS_VIEW: "reports.view",
  REPORTS_EXPORT: "reports.export",

  // Workers
  WORKERS_VIEW: "workers.view",
  WORKERS_MANAGE: "workers.manage",

  // Roles
  ROLES_VIEW: "roles.view",
  ROLES_MANAGE: "roles.manage",

  // POS
  POS_USE: "pos.use",
  POS_SHIFT_OPEN: "pos.shift.open",
  POS_SHIFT_CLOSE: "pos.shift.close",
  POS_REFUND: "pos.refund",
  POS_VIEW_ALL_SALES: "pos.view_all_sales",

  // Settings
  SETTINGS_VIEW: "settings.view",
  SETTINGS_EDIT: "settings.edit",
} as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[keyof typeof PERMISSION_KEYS];

/**
 * Role-based permission map.
 * Used as a fallback when DB lookup isn't available (e.g., middleware).
 */
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: Object.values(PERMISSION_KEYS),
  admin: Object.values(PERMISSION_KEYS).filter(
    (k) => !k.startsWith("workers.") && !k.startsWith("roles.")
  ),
  manager: [
    "products.view",
    "products.create",
    "products.edit",
    "categories.view",
    "categories.manage",
    "brands.view",
    "brands.manage",
    "orders.view",
    "orders.edit",
    "quotes.view",
    "quotes.respond",
    "quotes.convert",
    "inventory.view",
    "inventory.adjust",
    "customers.view",
    "discounts.view",
    "reports.view",
    "reports.export",
    "pos.use",
    "pos.shift.open",
    "pos.shift.close",
    "pos.refund",
    "pos.view_all_sales",
  ],
  cashier: [
    "pos.use",
    "pos.shift.open",
    "pos.shift.close",
    "pos.refund",
  ],
  stock_keeper: [
    "products.view",
    "products.create",
    "products.edit",
    "categories.view",
    "brands.view",
    "inventory.view",
    "inventory.adjust",
  ],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: string, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(permission);
}

/**
 * Check if a role has all specified permissions.
 */
export function hasAllPermissions(role: string, requiredPermissions: string[]): boolean {
  return requiredPermissions.every((p) => hasPermission(role, p));
}

/**
 * Check if user can access a route group.
 */
export function canAccessRoute(role: string, path: string): boolean {
  // Public routes
  if (!path.startsWith("/admin") && !path.startsWith("/pos")) return true;

  // Admin routes
  if (path.startsWith("/admin")) {
    return ["super_admin", "admin", "manager", "stock_keeper"].includes(role);
  }

  // POS routes
  if (path.startsWith("/pos")) {
    return ["super_admin", "admin", "manager", "cashier"].includes(role);
  }

  return false;
}
