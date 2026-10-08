# ADR-0002: Drizzle ORM over Prisma

## Status
Accepted

## Context
We need an ORM for PostgreSQL that:
- Is fully type-safe with TypeScript
- Works well with serverless PostgreSQL (Neon)
- Has minimal bundle size impact
- Allows close-to-SQL control for complex queries
- Supports migrations

## Decision
Use Drizzle ORM instead of Prisma.

## Rationale
- **Type Safety:** Drizzle infers types directly from schema definitions — no code generation step
- **Bundle Size:** Drizzle is ~10KB vs Prisma's ~100KB+ client
- **Serverless-Friendly:** No persistent connection pool required; works with Neon's serverless driver
- **SQL-Like API:** Queries read like SQL, making debugging and complex queries easier
- **Migration Control:** Drizzle Kit generates SQL migrations that can be reviewed and edited
- **No Prisma Engine:** Prisma requires a query engine binary; Drizzle is pure TypeScript
- **Performance:** No intermediate query engine means lower latency per query
- **Neon Integration:** Works directly with `@neondatabase/serverless` driver

## Consequences
- No visual schema editor (Prisma Studio equivalent) — use Drizzle Studio (`pnpm db:studio`)
- Smaller community than Prisma — fewer tutorials and examples
- Migration syntax is different — team must learn Drizzle Kit commands
- No built-in seeding framework — we write our own seed script
