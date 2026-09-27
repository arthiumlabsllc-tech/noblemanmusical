"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { subscribers } from "@/lib/db/schema";
import { sendNewsletterWelcome } from "@/lib/email/send";
import { limits } from "@/lib/security/rate-limit";
import { SITE, absoluteUrl } from "@/lib/seo/config";

/**
 * Newsletter subscription — the write path behind `<FooterNewsletter />`.
 *
 * ORDER OF OPERATIONS: persist, then greet. The subscription is the asset; the
 * welcome email is a courtesy that happens to be the thing a reviewer can see.
 * Reversing them would email someone whose address never made it into the
 * database, which is a promise the site cannot keep upholding.
 *
 * NOTHING THROWS AT THE CALLER. Every failure returns `{ ok: false, error }`
 * with a message written for a shopper, while the machine-readable detail goes
 * to `console.error` on the server. A thrown error here surfaces in the browser
 * as an unhandled action rejection — a red console line and a form that appears
 * to do nothing, which is exactly the failure mode this whole feature exists to
 * replace (the previous form called `setSubmitted(true)` without saving).
 */

const schema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter an email address")
    .max(255, "That address is too long")
    .email("Enter a valid email address"),
  source: z.enum(["footer", "homepage"]).default("footer"),
});

export interface NewsletterResult {
  ok: boolean;
  /** True when the address was already on the list — still a success for the visitor. */
  alreadySubscribed?: boolean;
  /** Shopper-facing. Never contains a stack trace, a table name or a SQL fragment. */
  error?: string;
}

const GENERIC_FAILURE =
  "We couldn't sign you up just now. Please try again, or reach us on WhatsApp and we'll add you.";

/**
 * Best available client key for the rate limiter.
 *
 * `x-forwarded-for` is the first entry on Vercel; absent that we fall back to a
 * shared bucket rather than skipping the limit, because an endpoint with no
 * identifiable caller is still an endpoint that can be flooded.
 */
async function clientKey(): Promise<string> {
  try {
    const h = await headers();
    const forwarded = h.get("x-forwarded-for");
    const first = forwarded?.split(",")[0]?.trim();
    return first || "unattributed";
  } catch {
    // `headers()` outside a request context (a direct script call) — degrade to
    // the shared bucket instead of throwing, so tests can still exercise the
    // validation and persistence paths.
    return "unattributed";
  }
}

export async function subscribeToNewsletter(input: {
  email: string;
  source?: "footer" | "homepage";
}): Promise<NewsletterResult> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Enter a valid email address" };
  }

  // Lowercased before the uniqueness check: `ML@x.com` and `ml@x.com` are one
  // person, and the unique index is case-sensitive so it would happily store
  // both and mail them twice.
  const email = parsed.data.email.toLowerCase();

  const rl = limits.newsletter(await clientKey());
  if (!rl.success) {
    const mins = Math.max(1, Math.round((rl.reset - Date.now()) / 60_000));
    return {
      ok: false,
      error: `Too many attempts from this connection — try again in about ${mins} minute${mins === 1 ? "" : "s"}.`,
    };
  }

  let addedId: string | undefined;
  try {
    /*
     * `onConflictDoNothing` + `returning` is what makes a repeat signup
     * idempotent: zero rows returned means the address was already there. The
     * alternative (select-then-insert) has a window between the two statements
     * where a double-click inserts twice and the unique index turns the second
     * into an error the shopper sees as a failed form.
     */
    const inserted = await db
      .insert(subscribers)
      .values({ email, source: parsed.data.source })
      .onConflictDoNothing({ target: subscribers.email })
      .returning({ id: subscribers.id });

    addedId = inserted[0]?.id;
  } catch (e) {
    /*
     * TODO(phase-23-newsletter): the configured Neon database has no tables at
     * all (`subscribers` included), so every live submission comes down this
     * path today. Greppable from `audit.mjs todos`; the evidence and the fix
     * (`npm run db:push`, an operator action) are in docs/TECH_DEBT.md #12.
     * The app cannot run its own migrations.
     */
    console.error("[newsletter] subscribe failed:", (e as Error)?.message ?? e);
    return { ok: false, error: GENERIC_FAILURE };
  }

  if (!addedId) {
    return { ok: true, alreadySubscribed: true };
  }

  try {
    const result = await sendNewsletterWelcome({
      to: email,
      shopUrl: absoluteUrl("/shop"),
      contactUrl: absoluteUrl("/contact"),
      mailingLine: `${SITE.name} — ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.countryName}`,
    });
    if (result?.error) {
      // Logged, not surfaced: the address is saved and the list owner can still
      // mail it. Reporting this to the visitor would claim a failure that did
      // not happen.
      console.error(
        `[newsletter] subscriber saved but welcome email was not delivered: ${result.error.message}`
      );
    }
  } catch (e) {
    console.error("[newsletter] welcome email threw:", (e as Error)?.message ?? e);
  }

  return { ok: true };
}
