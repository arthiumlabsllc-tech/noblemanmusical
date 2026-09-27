"use client";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ShimmerButton } from "@/components/motion/shimmer-button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter/actions";
import { trackNewsletterSignup } from "@/lib/analytics/events";

/**
 * Homepage newsletter.
 *
 * Wired to the same `subscribeToNewsletter` action as `<FooterNewsletter />` in
 * item 4. Until now this form called `setSubmitted(true)` and stored nothing —
 * it told every visitor "check your inbox" and sent nothing, which is a worse
 * outcome than not showing a form. The item-4 action made the fix three lines.
 *
 * The copy is deliberately not the footer's. §1.14 restyles this section in
 * Sub-Phase B and §5.1 owns the footer version; whether the homepage keeps its
 * own CTA once a footer signup exists on every page is an open question raised
 * in the item-4 report, not decided here.
 */
export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    const result = await subscribeToNewsletter({ email, source: "homepage" });
    setPending(false);
    if (result.ok) {
      setSubmitted(true);
      trackNewsletterSignup();
    } else {
      setError(result.error ?? "Please check the address and try again.");
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream to-cream-dark py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gold/5 via-transparent to-gold/5" />

      <div className="relative mx-auto max-w-2xl px-4 text-center md:px-6">
        <RevealOnScroll>
          <Mail className="mx-auto mb-4 h-10 w-10 text-gold" />
          <h2 className="font-display text-3xl font-bold text-navy-deep md:text-4xl">
            Join the Nobleman Circle
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
            Be first to know about new arrivals, exclusive deals, and events.
            No spam — just music.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-xl border border-kente-green/30 bg-kente-green/5 p-6">
              <p className="font-medium text-kente-green">
                You&apos;re on the list. New arrivals and deals will reach you
                first.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                aria-label="Email address for the newsletter"
                autoComplete="email"
                required
                disabled={pending}
                className="flex-1 rounded-lg border border-cream-dark bg-white px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              <ShimmerButton type="submit" size="lg" className="whitespace-nowrap" disabled={pending}>
                {pending ? "Joining…" : "Subscribe"}
              </ShimmerButton>
            </form>
          )}
          {error && (
            /* role="alert" on an element that appears with text: the region is
               created at the same moment as its content, which is what an alert
               role is for (a live region added empty and filled later is the
               case that AT handles inconsistently). */
            <p role="alert" className="mt-4 text-sm text-kente-red">
              {error}
            </p>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
