# Database

## Overview

PostgreSQL via Neon (serverless), accessed through Drizzle ORM.

## Schema

<!-- To be documented in Phase 4 -->

### Core Tables
- `users` — User accounts
- `accounts`, `sessions`, `verificationTokens` — Auth.js v5
- `addresses` — User delivery addresses
- `categories` — Product categories (hierarchical)
- `brands` — Product brands
- `products` — Product catalog
- `productVariants` — Product variants (size, color, etc.)
- `carts` — Shopping carts
- `orders` — Customer orders
- `orderItems` — Order line items
- `quotes` — B2B quote requests
- `reviews` — Product reviews
- `wishlists` — User wishlists
- `discounts` — Discount codes
- `subscribers` — Newsletter subscribers

### Worker & Permissions
- `workerProfiles` — Employee profiles
- `roles` — System and custom roles
- `permissions` — Permission definitions
- `rolePermissions` — Role-permission mapping
- `userRoles` — User-role assignments

### POS
- `posTerminals` — POS terminal definitions
- `posShifts` — Shift tracking
- `posSales` — POS sale records
- `posSaleItems` — POS sale line items
- `posReturns` — Return records
- `posReturnItems` — Return line items

### Audit
- `auditLog` — Audit trail for admin/POS actions

## Migrations

```bash
pnpm db:generate   # Generate migration from schema changes
pnpm db:migrate    # Run pending migrations
pnpm db:push       # Push schema directly (dev only)
pnpm db:studio     # Open Drizzle Studio
```

## Seeding

```bash
pnpm db:seed
```

Seeds: 7 categories, 8 brands, 36 products, sample POS data, admin user, workers, roles.
