import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  AUTH_SECRET: z.string().min(32),
  AUTH_TRUST_HOST: z.string().optional(),

  // Google OAuth (optional)
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Payments - Paystack
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),

  // Payments - MoMo
  MOMO_API_USER: z.string().optional(),
  MOMO_API_KEY: z.string().optional(),
  MOMO_PRIMARY_KEY: z.string().optional(),
  MOMO_SUBSCRIPTION_KEY: z.string().optional(),
  MOMO_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),

  // File uploads
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // Email
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // WhatsApp
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.string().optional(),
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: z.string().optional(),

  // Search
  TYPESENSE_HOST: z.string().optional(),
  TYPESENSE_PORT: z.string().optional(),
  TYPESENSE_PROTOCOL: z.string().optional(),
  TYPESENSE_API_KEY: z.string().optional(),

  // Rate limiting
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Analytics
  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().url().optional(),

  // Error tracking
  SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),

  // Site config
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SITE_NAME: z.string().default("Nobleman Musical Center"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional(),

  // Cron
  CRON_SECRET: z.string().optional(),

  // Feature flags
  ENABLE_POS: z.string().default("true"),
  ENABLE_BLOG: z.string().default("true"),
  ENABLE_QUOTES: z.string().default("true"),
});

export type Env = z.infer<typeof envSchema>;

// This will validate env vars at build time
// For now, we export the schema for use in other files
export { envSchema };
