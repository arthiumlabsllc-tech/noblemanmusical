# Architecture

## Overview

Nobleman v2 is a Next.js 15 application using the App Router with React Server Components.

## System Architecture

<!-- To be expanded in Phase 3 -->

### Frontend
- Next.js 15 with Turbopack
- React Server Components (RSC)
- Tailwind CSS v4 for styling
- Framer Motion for animations

### Backend
- API Routes for webhooks and integrations
- Server Actions for mutations
- Auth.js v5 for authentication

### Data
- PostgreSQL via Neon (serverless)
- Drizzle ORM for type-safe queries
- Zustand for client state (cart, POS)
- TanStack Query for server state

### Integrations
- Paystack + MTN MoMo for payments
- WhatsApp Business API for messaging
- Resend for transactional email
- Typesense for search
- Upstash Redis for rate limiting

## Route Groups

- `(marketing)` — Public marketing pages (homepage, about, blog, policies)
- `(shop)` — Shopping pages (shop, product, brands, search)
- `(checkout)` — Cart and checkout flow
- `(account)` — User account pages
- `(auth)` — Login, register, forgot password
- `(admin)` — Admin panel (protected)
- `(pos)` — Point of Sale terminal (protected)

## Key Decisions

See the `adr/` directory for detailed architecture decision records.
