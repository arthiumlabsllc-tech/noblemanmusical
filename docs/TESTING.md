# Testing

## Overview

Testing strategy for Nobleman v2.

## Test Types

### Unit Tests (Vitest)
- Components
- Utility functions
- Server actions (unit level)
- Hooks

### E2E Tests (Playwright)
- Key user flows (browse, add to cart, checkout)
- Admin flows (create product, process order)
- POS flows (create sale, close shift)

## Commands

```bash
pnpm test              # Run unit tests
pnpm test:watch        # Watch mode
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Playwright UI mode
```

## Coverage Targets

<!-- To be defined in Phase 21 -->

## Test File Convention

- Unit tests: `*.test.ts` / `*.test.tsx` next to source
- E2E tests: `e2e/*.spec.ts`
