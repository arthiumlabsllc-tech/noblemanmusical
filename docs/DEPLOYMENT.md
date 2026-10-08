# Deployment

## Overview

Deployed on Vercel with automatic CI/CD from the main branch.

## Pre-deployment Checklist

<!-- To be completed in Phase 22 -->

- [ ] All environment variables configured
- [ ] Database seeded in production
- [ ] Payment webhooks configured
- [ ] Cron jobs verified
- [ ] Lighthouse scores meet targets
- [ ] E2E tests passing

## Vercel Configuration

See `vercel.json` for cron schedules and function durations.

## Environment Variables

See [ENV_SETUP.md](./ENV_SETUP.md) for the complete reference.

## Database

Production database is Neon PostgreSQL. Schema is pushed via `pnpm db:push`.

## Monitoring

<!-- To be completed in Phase 20 -->

- Sentry for error tracking
- PostHog for analytics
- Vercel Analytics for web vitals
