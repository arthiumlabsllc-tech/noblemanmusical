# Nobleman Musical Center — Premium Ecommerce Platform

> Ghana's premier destination for premium musical instruments.  
> **"Where Music Meets Majesty"**

## Tech Stack

- **Framework:** Next.js 15 (App Router, RSC, Server Actions)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Animation:** Framer Motion
- **Database:** PostgreSQL (Neon) + Drizzle ORM
- **Auth:** Auth.js v5 (NextAuth)
- **Payments:** Paystack + MTN MoMo
- **Email:** Resend + React Email
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL database (Neon recommended)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Fill in your .env.local with actual values
# At minimum, set DATABASE_URL and AUTH_SECRET

# Push database schema (requires DATABASE_URL)
npm run db:push

# Seed the database with sample data
npm run db:seed

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

See `.env.example` for all required and optional environment variables. Key ones:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `AUTH_SECRET` | Random secret for Auth.js |
| `PAYSTACK_SECRET_KEY` | Paystack API secret key |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key |
| `RESEND_API_KEY` | Resend email API key |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp number (with country code) |

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Run migrations |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Drizzle Studio |

## Project Structure

```
src/
├── app/                    # Routes (App Router)
│   ├── (marketing)/        # Homepage, About, Contact, B2B
│   ├── (shop)/             # Shop, Product, Search
│   ├── (checkout)/         # Cart, Checkout
│   ├── (account)/          # Account, Orders, Wishlist
│   ├── (auth)/             # Login, Register
│   └── (admin)/            # Admin Dashboard
├── components/
│   ├── ui/                 # shadcn primitives
│   ├── brand/              # Logo, GoldDivider
│   ├── layout/             # Navbar, MobileTabBar, Footer
│   ├── product/            # ProductCard, Gallery, BuyBox
│   ├── cart/               # CartItem, CheckoutSteps
│   ├── home/               # Hero, Featured, B2B, Testimonials
│   ├── motion/             # RevealOnScroll, ShimmerButton
│   └── admin/              # DataTable, StatCard
├── lib/
│   ├── db/                 # Drizzle schema, migrations, seed
│   ├── auth/               # Auth.js config
│   ├── payments/           # Paystack, MoMo clients
│   ├── validators/         # Zod schemas
│   └── utils/              # cn, formatGHS, slugify
├── hooks/                  # useCart, useWishlist, useMediaQuery
└── styles/                 # globals.css with brand tokens
```

## Brand Identity

- **Colors:** Navy Deep (#060F24), Gold (#D4AF37), Cream (#F5F0E6)
- **Typography:** Playfair Display (headings), Inter (body), Cormorant Garamond (accents)
- **Color Rule:** Navy 60% · Cream 30% · Gold 10%

## Deployment

```bash
# Deploy to Vercel
npx vercel --prod
```

## License

Private — Nobleman Musical Center © 2025
