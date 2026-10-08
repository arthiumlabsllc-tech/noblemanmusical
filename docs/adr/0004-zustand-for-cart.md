# ADR-0004: Zustand for Cart State

## Status
Accepted

## Context
We need client-side state management for:
- Shopping cart (ecommerce)
- POS cart (in-store sales)
- Wishlist

Requirements:
- Persist across page navigations
- Sync with server (cart persistence for logged-in users)
- Minimal re-renders
- Small bundle size
- Works with React Server Components (client boundary)

## Decision
Use Zustand for cart, POS cart, and wishlist state. Use TanStack Query for server state.

## Rationale
- **Minimal Bundle Size:** Zustand is ~1KB vs Redux's ~10KB+
- **No Provider Needed:** No context provider wrapping — works naturally with RSC boundaries
- **Simple API:** `create()` hook with direct state access, no reducers or actions boilerplate
- **Persistence:** Built-in `persist` middleware for localStorage (guest cart)
- **Selective Subscriptions:** `useStore(state => state.items)` prevents unnecessary re-renders
- **TypeScript:** Excellent type inference without manual type annotations
- **Two Stores:** Separate `useCart` and `usePosCart` stores prevent cross-contamination
- **TanStack Query Complement:** Zustand for optimistic local state, TanStack Query for server cache

## Consequences
- Cart state is client-only — must sync with server via server actions
- No time-travel debugging (Redux DevTools) — use Zustand DevTools middleware if needed
- Team must learn Zustand patterns (no Redux background)
- Guest cart (localStorage) must be merged with server cart on login
