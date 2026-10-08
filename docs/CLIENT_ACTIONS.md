# Client Actions

Living checklist of items the client needs to provide or confirm. Items are checked off when received.

## Brand Assets

- [ ] Provide real owner photo → replace `public/images/team/owner-placeholder.jpg`
- [ ] Provide real logo SVG → replace placeholder logo in `src/components/brand/logo.tsx`
- [ ] Provide 5 hero images (1920×800 minimum) → replace `public/images/hero/*`
- [ ] Provide 7 category images → replace `public/images/categories/*`
- [ ] Provide brand logos (SVG preferred) → replace `public/brands/*`
- [ ] Provide favicon and app icons → replace `public/brand/favicon.ico`, `icon-192.png`, `icon-512.png`

## Payment Configuration

- [ ] Provide Paystack live public key
- [ ] Provide Paystack live secret key
- [ ] Provide Paystack webhook signing secret
- [ ] Provide MTN MoMo API credentials
- [ ] Provide MTN MoMo primary key
- [ ] Provide MTN MoMo subscription key

## Communication

- [ ] Verify Resend domain (configure SPF + DKIM records)
- [ ] Provide Resend API key
- [ ] Verify WhatsApp Business account
- [ ] Provide WhatsApp Business phone number ID
- [ ] Provide WhatsApp Business access token
- [ ] Confirm WhatsApp phone number for customer orders

## Social & Business

- [ ] Provide social media handles (Instagram, Facebook, Twitter/X, YouTube, TikTok)
- [ ] Confirm business registration details for footer
- [ ] Confirm physical store address for footer and LocalBusiness schema

## Business Configuration

- [ ] Confirm delivery fee structure by region:
  - Accra: GH₵ ?
  - Ashanti Region: GH₵ ?
  - Western Region: GH₵ ?
  - Northern Region: GH₵ ?
  - Other regions: GH₵ ?
- [ ] Confirm tax rate (if any) — currently set to 0%
- [ ] Confirm POS terminal names and locations
- [ ] Confirm store operating hours

## Content

- [ ] Provide "About Us" story text
- [ ] Provide testimonials (customer name, quote, optional photo)
- [ ] Provide blog posts (if any, in Markdown or Word)
- [ ] Provide B2B page content (churches, radio stations, schools)
- [ ] Provide FAQ content (if any)

## Policy Pages

- [ ] Review and approve shipping policy text
- [ ] Review and approve returns policy text
- [ ] Review and approve privacy policy text
- [ ] Review and approve terms of service text
- [ ] Review and approve cookie policy text

## Credentials

- [ ] Confirm admin email address
- [ ] Set initial admin password (via SEED_ADMIN_PASSWORD env var)
- [ ] Provide Google OAuth client ID and secret (if Google login desired)

---

*Last updated: Phase 1 scaffold*
