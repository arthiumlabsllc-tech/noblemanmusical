# Environment Setup Guide

Step-by-step instructions for obtaining every API key and credential needed to run Nobleman Musical Center.

---

## Table of Contents

1. [Neon (Database)](#1-neon-database)
2. [Auth.js (Authentication)](#2-authjs-authentication)
3. [Google OAuth](#3-google-oauth)
4. [Paystack (Payments)](#4-paystack-payments)
5. [MTN MoMo (Mobile Money)](#5-mtn-momo-mobile-money)
6. [WhatsApp Cloud API](#6-whatsapp-cloud-api)
7. [Resend (Email)](#7-resend-email)
8. [Typesense (Search)](#8-typesense-search)
9. [Vercel (Hosting + Crons)](#9-vercel-hosting--crons)
10. [Cost Estimates](#10-cost-estimates)

---

## 1. Neon (Database)

**What:** Serverless PostgreSQL database.

**Setup:**
1. Go to [neon.tech](https://neon.tech) and sign up (free tier available)
2. Create a new project — name it `nobleman-musical-center`
3. Select region closest to your users (e.g., `Europe West` for Ghana)
4. After creation, go to **Dashboard → Connection Details**
5. Copy the **connection string** — it looks like:
   ```
   postgresql://user:password@ep-cool-name-123456.eu-west-1.aws.neon.tech/db?sslmode=require
   ```
6. Set as `DATABASE_URL`

**For Drizzle Kit (local dev):**
- The same connection string works, but for local development you may want a separate dev database

**Sandbox vs Production:**
- Create two Neon projects: one for dev, one for production
- Use different `DATABASE_URL` values in `.env.local` vs Vercel production env

---

## 2. Auth.js (Authentication)

**What:** JWT-based session management.

**Setup:**
1. Generate a secret:
   ```bash
   openssl rand -base64 32
   ```
2. Set as `AUTH_SECRET`
3. `AUTH_URL` is auto-detected by Auth.js from your deployment URL — no manual config needed

---

## 3. Google OAuth

**What:** "Sign in with Google" option on the login page.

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://noblemanmusical.com/api/auth/callback/google` (production)
7. Click **Create**
8. Copy the **Client ID** → `GOOGLE_CLIENT_ID`
9. Copy the **Client Secret** → `GOOGLE_CLIENT_SECRET`

**Note:** This is optional. The app works with email/password only if Google OAuth is not configured.

---

## 4. Paystack (Payments)

**What:** Card payments and bank transfers for Ghana.

**Setup:**
1. Sign up at [paystack.com](https://paystack.com) (business account required)
2. Go to **Settings → API Keys & Webhooks**
3. **For testing:** Use the **Test** tab keys
   - Copy **Secret Key** (`sk_test_...`) → `PAYSTACK_SECRET_KEY`
4. **For production:** Switch to **Live** tab
   - Copy **Secret Key** (`sk_live_...`) → `PAYSTACK_SECRET_KEY`
5. For webhook secret:
   - Go to **Settings → Preferences → Webhooks**
   - Add webhook URL: `https://noblemanmusical.com/api/paystack/webhook`
   - Subscribe to events: `charge.success`, `charge.failed`
   - Copy the **Signing Key** → `PAYSTACK_WEBHOOK_SECRET`

**Sandbox vs Production:**
- Paystack provides separate test and live keys
- Use test keys during development, switch to live keys for production
- Test cards: `4084084084084081` (Visa, any future date, any CVV)

---

## 5. MTN MoMo (Mobile Money)

**What:** Mobile money payments (the most popular payment method in Ghana).

**Setup:**
1. Go to [MoMo Developer Portal](https://momodeveloper.mtn.com/)
2. Register and create an app
3. Subscribe to the **Collections** product
4. Go to **Subscriptions → Collections → Subscriptions**
5. Copy the **Ocp-Apim-Subscription-Key** → `MOMO_SUBSCRIPTION_KEY`
6. Create an API user (via the API or portal):
   - Copy the **User ID** → `MOMO_API_USER`
   - Copy the **API Key** → `MOMO_API_KEY`
7. Set `MOMO_TARGET_ENVIRONMENT`:
   - `sandbox` for testing
   - `production` for live

**Sandbox vs Production:**
- The MoMo sandbox uses virtual phone numbers for testing
- Production requires MTN business approval and real merchant accounts

---

## 6. WhatsApp Cloud API

**What:** Send order confirmations and updates via WhatsApp.

**Setup:**
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a Business app (or use existing)
3. Add the **WhatsApp** product
4. Go to **WhatsApp → API Setup**
5. Copy the **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID`
6. For the access token:
   - Go to **System Users** in Business Settings
   - Create a system user with **Admin** access
   - Generate a token for your WhatsApp Business app
   - Copy the token → `WHATSAPP_ACCESS_TOKEN`
7. For the display number (used in wa.me links):
   - Copy your WhatsApp business number in international format (no + or spaces)
   - Example: `233201234567` → `NEXT_PUBLIC_WHATSAPP_NUMBER`

**Note:** WhatsApp Cloud API has a free tier (1,000 conversations/month).

---

## 7. Resend (Email)

**What:** Transactional email delivery (order confirmations, password resets, etc.).

**Setup:**
1. Sign up at [resend.com](https://resend.com)
2. Go to **API Keys** → Create a new key
3. Copy the key → `RESEND_API_KEY`
4. Add and verify your domain:
   - Go to **Domains** → Add Domain
   - Enter your domain (e.g., `noblemanmusical.com`)
   - Add the DNS records Resend provides (SPF, DKIM, DMARC)
   - Wait for verification (usually minutes)
5. Once verified, set `EMAIL_FROM` to `orders@noblemanmusical.com` (or similar)

**Sandbox vs Production:**
- Resend free tier: 3,000 emails/month, 100/day
- For production, verify your domain to remove sandbox restrictions

---

## 8. Typesense (Search)

**What:** Full-text search engine. Optional — the app falls back to local DB search if Typesense is unavailable.

**Setup (self-hosted):**
1. Deploy Typesense on a server or use Typesense Cloud
2. Copy the node URL → `TYPESENSE_NODES` (e.g., `https://your-cluster.typesense.net:8108`)
3. Copy the API key → `TYPESENSE_API_KEY`

**Local development:**
```bash
docker run -p 8108:8108 typesense/typesense:27.1 --data-dir /data --api-key=xyz
```
Then set:
```
TYPESENSE_NODES=http://localhost:8108
TYPESENSE_API_KEY=xyz
```

**Note:** If not configured, search still works using the local database fallback.

---

## 9. Vercel (Hosting + Crons)

**What:** Hosting platform with automatic deployments, edge functions, and cron jobs.

**Setup:**
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no build config needed
4. Add all environment variables from `.env.example` in **Project → Settings → Environment Variables**
5. Deploy — Vercel provides a preview URL for each branch/PR
6. `CRON_SECRET` is automatically provided by Vercel for cron jobs

---

## 10. Cost Estimates

| Service | Free Tier | Low Scale (~100 orders/mo) | Medium Scale (~1000 orders/mo) |
|---|---|---|---|
| **Neon** | 0.5 GB storage, free | $0 (within free tier) | ~$19/mo (expanded storage) |
| **Vercel** | Hobby (free) | $20/mo (Pro) | $20/mo (Pro) |
| **Paystack** | No monthly fee | 1.5% + GHS 0.20 per transaction | Same rate, volume discounts |
| **MTN MoMo** | No monthly fee | Varies by agreement | Varies by agreement |
| **Resend** | 3,000 emails/mo free | $0 (within free tier) | $20/mo (expanded) |
| **WhatsApp API** | 1,000 conversations/mo | ~$5-15/mo | ~$25-50/mo |
| **Typesense** | Self-hosted or Cloud | $0 (self-hosted) | ~$30/mo (Typesense Cloud) |
| **Google OAuth** | Free | $0 | $0 |
| **Total** | **$0** | **~$50-80/mo** | **~$120-170/mo** |

**Notes:**
- Paystack/MoMo fees are per-transaction, not monthly
- Typesense is optional — local DB search works without it
- Vercel Hobby tier is sufficient for development/testing
- Most services have generous free tiers for early-stage traffic
