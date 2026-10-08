# Nobleman Musical Center v2

> "Where Music Meets Majesty"

Premium ecommerce platform + POS system for Nobleman Musical Center — a musical instrument retailer in Accra, Ghana.

## Quick Start

See [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) for full setup instructions.

## Documentation

All documentation is in the [`docs/`](docs/) directory:

- [Architecture](docs/ARCHITECTURE.md)
- [Agent Guide](docs/AGENT_GUIDE.md) — for AI agents working on this codebase
- [Client Actions](docs/CLIENT_ACTIONS.md) — items the client needs to provide
- [Getting Started](docs/GETTING_STARTED.md)

## Tech Stack

- **Framework:** Next.js 15 (App Router, RSC, Turbopack)
- **Language:** TypeScript 5.8 strict
- **Styling:** Tailwind CSS v4
- **UI:** shadcn/ui (customized)
- **Database:** PostgreSQL via Neon + Drizzle ORM
- **Auth:** Auth.js v5
- **Payments:** Paystack + MTN MoMo
- **Deployment:** Vercel

## Critical Rules

1. Documentation is a first-class deliverable
2. Full-bleed layout — no narrow containers
3. Mobile-first (375px first)
4. Every screen ships with loading, empty, and error states
5. Every server action validates with Zod
6. TypeScript strict mode, no `any`
7. No new dependency without an ADR
8. Conventional commits
