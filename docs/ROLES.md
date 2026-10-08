# Roles & Permissions

## Roles

| Role | Description |
|------|-------------|
| Super Admin | All permissions |
| Admin | All except worker/role management |
| Manager | Products, orders, quotes, POS, reports |
| Cashier | POS only (create sale, process return, view own sales) |
| Stock Keeper | Products, inventory only |

## Permissions Matrix

| Permission | Super Admin | Admin | Manager | Cashier | Stock Keeper |
|-----------|:-----------:|:-----:|:-------:|:-------:|:------------:|
| products.view | ✅ | ✅ | ✅ | ❌ | ✅ |
| products.create | ✅ | ✅ | ✅ | ❌ | ❌ |
| products.edit | ✅ | ✅ | ✅ | ❌ | ❌ |
| products.delete | ✅ | ✅ | ❌ | ❌ | ❌ |
| categories.view | ✅ | ✅ | ✅ | ❌ | ✅ |
| categories.manage | ✅ | ✅ | ✅ | ❌ | ❌ |
| brands.view | ✅ | ✅ | ✅ | ❌ | ✅ |
| brands.manage | ✅ | ✅ | ✅ | ❌ | ❌ |
| orders.view | ✅ | ✅ | ✅ | ❌ | ❌ |
| orders.edit | ✅ | ✅ | ✅ | ❌ | ❌ |
| orders.refund | ✅ | ✅ | ❌ | ❌ | ❌ |
| quotes.view | ✅ | ✅ | ✅ | ❌ | ❌ |
| quotes.respond | ✅ | ✅ | ✅ | ❌ | ❌ |
| quotes.convert | ✅ | ✅ | ✅ | ❌ | ❌ |
| inventory.view | ✅ | ✅ | ✅ | ❌ | ✅ |
| inventory.adjust | ✅ | ✅ | ✅ | ❌ | ✅ |
| customers.view | ✅ | ✅ | ✅ | ❌ | ❌ |
| discounts.view | ✅ | ✅ | ✅ | ❌ | ❌ |
| discounts.manage | ✅ | ✅ | ❌ | ❌ | ❌ |
| reports.view | ✅ | ✅ | ✅ | ❌ | ❌ |
| reports.export | ✅ | ✅ | ✅ | ❌ | ❌ |
| workers.view | ✅ | ❌ | ❌ | ❌ | ❌ |
| workers.manage | ✅ | ❌ | ❌ | ❌ | ❌ |
| roles.view | ✅ | ❌ | ❌ | ❌ | ❌ |
| roles.manage | ✅ | ❌ | ❌ | ❌ | ❌ |
| pos.use | ✅ | ✅ | ✅ | ✅ | ❌ |
| pos.shift.open | ✅ | ✅ | ✅ | ✅ | ❌ |
| pos.shift.close | ✅ | ✅ | ✅ | ✅ | ❌ |
| pos.refund | ✅ | ✅ | ✅ | ✅ | ❌ |
| pos.view_all_sales | ✅ | ✅ | ✅ | ❌ | ❌ |
| settings.view | ✅ | ✅ | ❌ | ❌ | ❌ |
| settings.edit | ✅ | ✅ | ❌ | ❌ | ❌ |

## System Roles

Super Admin, Admin, Manager, Cashier, Stock Keeper are system roles and cannot be deleted.

Custom roles can be created with any combination of permissions.
