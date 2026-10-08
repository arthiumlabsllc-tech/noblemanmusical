# Getting Started

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- A Neon PostgreSQL database URL (or local PostgreSQL)

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in required values in `.env.local` (see [ENV_SETUP.md](./ENV_SETUP.md))
5. Push database schema:
   ```bash
   pnpm db:push
   ```
6. Seed the database:
   ```bash
   pnpm db:seed
   ```
7. Start development server:
   ```bash
   pnpm dev
   ```

## Useful Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm lint` | ESLint check |
| `pnpm format` | Format with Prettier |
| `pnpm db:push` | Push schema to DB |
| `pnpm db:seed` | Seed database |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |

## First Steps

After setup, visit:
- `http://localhost:3000` — Homepage (under construction placeholder)

## Need Help?

- Check [AGENT_GUIDE.md](./AGENT_GUIDE.md) for development patterns
- Check [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
- Check [CLIENT_ACTIONS.md](./CLIENT_ACTIONS.md) for client-provided assets
