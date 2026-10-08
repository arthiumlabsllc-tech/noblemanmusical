# Agent Guide

This document is the primary reference for AI agents (and human developers) working on the Nobleman Musical Center v2 codebase.

## Project Overview

Nobleman Musical Center is a premium musical instrument retailer in Accra, Ghana. This v2 project builds a complete ecommerce platform + POS (Point of Sale) system.

### Goals
1. Mobile-first ecommerce experience (Musician's Friend reference)
2. Full POS system for in-store sales
3. Admin panel for complete store management
4. B2B quote system for churches, radio stations, schools
5. Integration with Ghanaian payment methods (Paystack, MTN MoMo)
6. WhatsApp ordering and communication

### Brand Identity
- **Colors:** Navy 60% · Cream 30% · Gold 10%
- **Typography:** Playfair Display (display), Inter (body), Cormorant Garamond (accent)
- **Positioning:** Premium heritage music house

## Architecture Summary

- **Framework:** Next.js 15 (App Router, RSC, Turbopack)
- **Language:** TypeScript 5.8 strict (no `any`)
- **Styling:** Tailwind CSS v4 with custom design tokens
- **UI:** shadcn/ui primitives (customized)
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **Auth:** Auth.js v5 (credentials + Google)
- **State:** Zustand (cart, POS) + TanStack Query (server state)
- **Payments:** Paystack + MTN MoMo
- **Deployment:** Vercel

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full overview.

## Coding Conventions

### TypeScript
- Strict mode, no `any` — ever
- Use `type` for unions/intersections, `interface` for object shapes
- Export types from `src/types/` when shared across modules
- Use Zod schemas for runtime validation, derive types with `z.infer`

### File Naming
- Components: `kebab-case.tsx` (e.g., `product-card.tsx`)
- Utilities: `camelCase.ts` (e.g., `formatGHS.ts`)
- Hooks: `use-kebab-case.ts` (e.g., `use-cart.ts`)
- Server actions: `actions.ts` in the relevant module
- Route pages: `page.tsx` in the route directory

### Component Patterns
- Server Components by default, add `"use client"` only when needed
- Use `cn()` from `@/lib/utils/cn` for className merging
- Use `class-variance-authority` for component variants
- Every component must handle loading, empty, and error states

### Server Actions
- Always validate input with Zod
- Check permissions before mutating
- Return typed results (never raw database objects)
- Log to `auditLog` for admin/POS actions

### Styling
- Full-bleed layout — use container classes, never `max-w-7xl mx-auto`
- Mobile-first (design at 375px)
- Touch targets >= 44px
- Use design tokens (CSS variables), not hardcoded colors

### Commits
Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`

## How To Add a New Route

1. Create the route directory under the appropriate route group:
   - Marketing pages → `src/app/(marketing)/`
   - Shop pages → `src/app/(shop)/`
   - Checkout → `src/app/(checkout)/`
   - Account → `src/app/(account)/`
   - Auth → `src/app/(auth)/`
   - Admin → `src/app/(admin)/`
   - POS → `src/app/(pos)/`

2. Create `page.tsx` in the route directory
3. Add `generateMetadata` export for SEO
4. Update `docs/ROUTES.md`

## How To Add a Server Action

1. Create or edit `actions.ts` in the relevant `src/lib/` module
2. Add Zod schema for input validation
3. Check permissions (for admin/POS actions)
4. Implement the mutation
5. Log to auditLog if admin/POS
6. Return typed result

## How To Extend the Schema

1. Edit `src/lib/db/schema.ts`
2. Run `pnpm db:generate` to create migration
3. Run `pnpm db:push` to apply (dev)
4. Update seed data if needed in `src/lib/db/seed.ts`
5. Update `docs/DATABASE.md`

## How To Write Tests

- Unit tests: `*.test.ts` / `*.test.tsx` next to source file
- E2E tests: `e2e/*.spec.ts`
- Use Vitest for unit, Playwright for E2E
- Test loading, empty, and error states for every screen

## How To Run Verification

```bash
pnpm build          # Must exit 0
pnpm typecheck      # Must pass
pnpm lint           # Must pass, zero warnings
pnpm test           # Unit tests
pnpm test:e2e       # E2E tests
pnpm audit          # Full site audit
pnpm lighthouse     # Performance audit
```

## Known Tech Debt

See [TECH_DEBT.md](./TECH_DEBT.md) for the full list.

### Silent Failure Patterns (Critical)

These tooling bugs cause false results in audits and scripts:

1. **git grep only searches tracked files** — Use filesystem scan for audits
2. **PowerShell [slug] is a wildcard in -Path** — Use -LiteralPath
3. **node script.mjs > out.txt** can create 0-byte file — Verify artifact exists and has content
4. **Get-NetTCPConnection can report empty** for a listening port — Probe with HTTP
5. **Select-String -SimpleMatch can return false negatives** — Verify with raw count
6. **node -e with shell-escaped vars** can silently match no files — Print the denominator

**Rules:**
- Every audit must print "X of Y matched," never just "X"
- Every scan that returns 0 matches must exit with error

## Never-Violate Rules

1. Documentation is a first-class deliverable
2. Full-bleed layout from day one
3. Mobile-first (375px)
4. Every screen ships with loading, empty, and error states
5. Every server action validates with Zod
6. TypeScript strict mode, no `any`
7. No new dependency without an ADR
8. Conventional commits
9. Placeholder assets ship with `TODO(client)` flags
10. Every phase ends with build/typecheck/lint passing
