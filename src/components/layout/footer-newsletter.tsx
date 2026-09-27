"use client";

import { useId, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { subscribeToNewsletter } from "@/lib/newsletter/actions";
import { trackNewsletterSignup } from "@/lib/analytics/events";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * FooterNewsletter — §5.1's "email input + gold arrow button" in column 1.
 *
 * THIS IS THE FIRST REAL FORM ON THE SITE. `/contact` and the homepage
 * `NewsletterCTA` both call `setSubmitted(true)` and save nothing; this one
 * posts to `subscribeToNewsletter`, which writes a row and mails a welcome.
 * The visible contract that follows from that: a green tick appears only after
 * the server says the address is stored.
 *
 * THE FORM STAYS MOUNTED AFTER SUCCESS. Two reasons, one of them measured:
 *  - a replaced form loses focus and screen-reader context at the moment the
 *    visitor most wants to hear the confirmation, and
 *  - item 3's regression suite hit-tests footer controls; a control that
 *    vanishes after use cannot be verified as reachable.
 * The message instead swaps inside a live region that is always present.
 *
 * `min-h` on that region reserves its height, so an error line expanding the
 * column cannot push the bottom bar down (CLS, which §SEO caps at 0.05).
 */
export function FooterNewsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const uid = useId();
  const inputId = `footer-newsletter-${uid}`;
  const statusId = `footer-newsletter-status-${uid}`;
  const headingId = `footer-newsletter-heading-${uid}`;

  const error = status === "error";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage("");
    try {
      const result = await subscribeToNewsletter({ email, source: "footer" });
      if (result.ok) {
        setStatus("success");
        setMessage(
          result.alreadySubscribed
            ? "You're already on the list — welcome back."
            : "You're in. A welcome email is on its way."
        );
        setEmail("");
        trackNewsletterSignup();
      } else {
        setStatus("error");
        setMessage(result.error ?? "Please check the address and try again.");
      }
    } catch {
      // The action swallows its own failures, so reaching here means the
      // request never completed (offline, aborted navigation). Say that rather
      // than reporting a rejection the server never sent.
      setStatus("error");
      setMessage("We couldn't reach the server. Please try again.");
    }
  }

  return (
    <div className="mt-8">
      <h3 id={headingId} className="font-display text-sm font-bold uppercase tracking-wider text-gold">
        Join the Nobleman Circle
      </h3>
      <p className="mt-2 text-sm text-cream/60">
        New arrivals and closeouts, straight to your inbox.
      </p>

      <form onSubmit={handleSubmit} aria-labelledby={headingId} className="mt-4">
        <label htmlFor={inputId} className="sr-only">
          Email address for the newsletter
        </label>
        <div className="flex items-stretch gap-2">
          <input
            id={inputId}
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            required
            maxLength={255}
            disabled={status === "submitting"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-describedby={statusId}
            aria-invalid={error || undefined}
            placeholder="you@example.com"
            className="min-w-0 flex-1 rounded-lg border border-cream/20 bg-white/5 px-3 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "submitting"}
            aria-busy={status === "submitting" || undefined}
            aria-label="Subscribe to the newsletter"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gold text-navy-deep transition-colors hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep disabled:opacity-60"
          >
            {status === "submitting" ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>

        {/*
          Always mounted so the live region exists before there is anything to
          announce — a region added at the same moment as its text is often
          missed entirely by assistive tech.

          WHY THE TEXT IS NOT RED OR GREEN. On navy-deep, kente-red measures
          3.27:1 and kente-green 3.56:1 — both under the 4.5:1 that 12px body
          text needs, and the palette is frozen for this phase (adding a lighter
          brand red would be a rebrand, not a fix). So legibility comes from
          cream text at 11:1 and the *status* comes from the icon, where 3:1 is
          the requirement. That also satisfies WCAG 1.4.1: the message is never
          carried by colour alone.
        */}
        <p
          id={statusId}
          role="status"
          aria-live="polite"
          className="mt-3 flex min-h-[1.25rem] items-start gap-1.5 text-xs leading-relaxed text-cream/80"
        >
          {status === "error" && (
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-kente-red" aria-hidden="true" />
          )}
          {status === "success" && (
            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-kente-green" aria-hidden="true" />
          )}
          {message}
        </p>
      </form>
    </div>
  );
}
