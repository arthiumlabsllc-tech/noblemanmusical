# ADR-0001: Next.js App Router

## Status
Accepted

## Context
We need a React framework for a full-featured ecommerce platform with:
- Server-side rendering for SEO
- API routes for webhooks and integrations
- File-based routing with complex route groups
- React Server Components for performance
- Built-in image optimization and font optimization

## Decision
Use Next.js 15 with the App Router (not Pages Router).

## Rationale
- **React Server Components:** App Router is the only way to use RSC in Next.js, reducing client-side JS
- **Route Groups:** `(marketing)`, `(shop)`, `(admin)`, `(pos)` etc. allow logical grouping without URL segments
- **Nested Layouts:** Each route group can have its own layout (admin sidebar vs. storefront header)
- **Streaming:** Built-in support for Suspense and streaming SSR
- **Vercel Integration:** First-class deployment on Vercel with ISR, Edge Functions, cron jobs
- **API Routes:** Full-featured API routes for Paystack/MoMo webhooks, WhatsApp, cron jobs
- **Image Optimization:** `next/image` with AVIF/WebP, automatic sizing, lazy loading
- **Font Optimization:** `next/font/google` with automatic subsetting and `display: swap`

## Consequences
- Must use Turbopack for dev (faster than Webpack)
- Some third-party libraries may not yet support RSC — wrap with `"use client"` boundary
- App Router has a steeper learning curve than Pages Router
- `useEffect` and browser APIs require `"use client"` directive
