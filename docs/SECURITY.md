# Security

## Overview

Security practices for Nobleman v2.

## Practices

- Zod validation on every server action and API route
- Rate limiting via Upstash Redis
- CSRF protection
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Webhook signature verification (Paystack, MoMo)
- Audit logging for admin/POS actions
- Environment validation at build time

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Auth | 5/15min |
| Contact form | 3/10min |
| Quote | 3/hr |
| Search | 30/min |
| Newsletter | 3/hr |
| POS sale | 60/min |

## CSP Allowlist

- self
- js.paystack.co
- us.i.posthog.com
- va.vercel-scripts.com
- images.unsplash.com

<!-- To be expanded in Phase 19 -->
