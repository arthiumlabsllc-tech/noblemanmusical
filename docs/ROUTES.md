# Routes

## Marketing `(marketing)`
| Route | Description | Phase |
|-------|-------------|-------|
| `/` | Homepage | 7 |
| `/about` | About page | 13 |
| `/contact` | Contact page | 13 |
| `/churches` | B2B Churches page | 13 |
| `/radio-stations` | B2B Radio stations | 13 |
| `/schools` | B2B Schools page | 13 |
| `/blog` | Blog listing | 13 |
| `/blog/[slug]` | Blog post | 13 |
| `/policies/shipping` | Shipping policy | 13 |
| `/policies/returns` | Returns policy | 13 |
| `/policies/privacy` | Privacy policy | 13 |
| `/policies/terms` | Terms of service | 13 |
| `/policies/cookies` | Cookie policy | 13 |
| `/policies/accessibility` | Accessibility statement | 13 |

## Shop `(shop)`
| Route | Description | Phase |
|-------|-------------|-------|
| `/shop` | Shop listing | 8 |
| `/shop/[category]` | Category page | 8 |
| `/product/[slug]` | Product detail | 9 |
| `/brands` | Brands A-Z | 8 |
| `/brands/[brand]` | Brand page | 8 |
| `/search` | Search results | 16 |
| `/track` | Order tracking | 12 |

## Checkout `(checkout)`
| Route | Description | Phase |
|-------|-------------|-------|
| `/cart` | Shopping cart | 10 |
| `/checkout` | Checkout flow | 10 |
| `/checkout/success` | Order success | 10 |
| `/checkout/failed` | Payment failed | 10 |

## Account `(account)`
| Route | Description | Phase |
|-------|-------------|-------|
| `/account` | Account dashboard | 11 |
| `/account/orders` | Order history | 11 |
| `/account/orders/[id]` | Order detail | 11 |
| `/account/wishlist` | Wishlist | 11 |
| `/account/addresses` | Addresses | 11 |
| `/account/settings` | Account settings | 11 |

## Auth `(auth)`
| Route | Description | Phase |
|-------|-------------|-------|
| `/login` | Login page | 5 |
| `/register` | Register page | 5 |
| `/forgot-password` | Password reset | 5 |

## Admin `(admin)`
| Route | Description | Phase |
|-------|-------------|-------|
| `/admin` | Admin dashboard | 14 |
| `/admin/products` | Products list | 14 |
| `/admin/products/new` | Create product | 14 |
| `/admin/products/[id]/edit` | Edit product | 14 |
| `/admin/categories` | Categories CRUD | 14 |
| `/admin/brands` | Brands CRUD | 14 |
| `/admin/orders` | Orders list | 14 |
| `/admin/orders/[id]` | Order detail | 14 |
| `/admin/customers` | Customers list | 14 |
| `/admin/quotes` | Quotes inbox | 14 |
| `/admin/inventory` | Inventory management | 14 |
| `/admin/discounts` | Discount codes | 14 |
| `/admin/workers` | Workers list | 14 |
| `/admin/workers/new` | Create worker | 14 |
| `/admin/workers/[id]/edit` | Edit worker | 14 |
| `/admin/roles` | Roles management | 14 |
| `/admin/reports` | Reports | 14 |
| `/admin/settings` | Store settings | 14 |

## POS `(pos)`
| Route | Description | Phase |
|-------|-------------|-------|
| `/pos` | POS terminal | 15 |
| `/pos/sales` | Sales history | 15 |
| `/pos/sales/[id]` | Sale detail | 15 |
| `/pos/shift` | Shift management | 15 |
| `/pos/returns` | Returns | 15 |
| `/pos/receipts/[id]` | Receipt view | 15 |
