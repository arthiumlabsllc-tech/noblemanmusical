# API Reference

## Overview

API routes are under `/api/`. Server actions handle most mutations.

## Routes

### Auth
- `POST /api/auth/[...nextauth]` — Auth.js v5 handler

### Payments
- `POST /api/paystack/webhook` — Paystack payment webhook
- `POST /api/momo/webhook` — MTN MoMo payment webhook

### WhatsApp
- `POST /api/whatsapp/send` — Send WhatsApp message
- `POST /api/whatsapp/webhook` — WhatsApp Business webhook verification

### Newsletter
- `POST /api/newsletter` — Subscribe to newsletter

### Search
- `GET /api/search?q=query` — Search products

### POS
- `POST /api/pos/sale` — Create POS sale
- `POST /api/pos/return` — Process POS return
- `POST /api/pos/shift/open` — Open shift
- `POST /api/pos/shift/close` — Close shift
- `GET /api/pos/receipt/[id]` — Get receipt

### Cron
- `POST /api/cron/abandoned-cart` — Abandoned cart emails
- `POST /api/cron/low-stock` — Low stock alerts
- `POST /api/cron/cleanup-carts` — Clean expired carts
- `POST /api/cron/daily-report` — Daily sales report

### Health
- `GET /api/health` — Health check

<!-- To be expanded as routes are implemented -->
