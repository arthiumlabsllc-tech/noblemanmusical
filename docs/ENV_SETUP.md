# Environment Setup

## Overview

All environment variables are documented in `.env.example`. Copy it to `.env.local` to get started.

## Required Variables (by Phase)

### Phase 1-3 (Scaffold, no external services needed)
The app runs with zero env vars until Phase 4.

### Phase 4 (Database)
- `DATABASE_URL` — Neon PostgreSQL connection string

### Phase 5 (Auth)
- `AUTH_SECRET` — Random 32+ char string
- `SEED_ADMIN_PASSWORD` — Admin password for seeding

### Phase 10 (Payments)
- `PAYSTACK_PUBLIC_KEY`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_WEBHOOK_SECRET`
- `MOMO_API_USER`, `MOMO_API_KEY`, `MOMO_PRIMARY_KEY`, `MOMO_SUBSCRIPTION_KEY`

### Phase 14 (Admin uploads)
- `BLOB_READ_WRITE_TOKEN` — Vercel Blob

### Phase 17 (Email + WhatsApp)
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, etc.

### Phase 16 (Search)
- `TYPESENSE_HOST`, `TYPESENSE_API_KEY`, etc.

### Phase 18 (Analytics)
- `POSTHOG_KEY`, `POSTHOG_HOST`

### Phase 19 (Security)
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

### Phase 20 (Monitoring)
- `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`

## Generating Secrets

```bash
# AUTH_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -base64 32
```
