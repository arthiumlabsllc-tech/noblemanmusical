"use client";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ShimmerButton } from "@/components/motion/shimmer-button";
import { Mail } from "lucide-react";
import { useState } from "react";

export function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Server action to subscribe
    setSubmitted(true);
  };

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
                Welcome to the Circle. Check your inbox for a confirmation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-lg border border-cream-dark bg-white px-5 py-3.5 text-sm text-charcoal placeholder:text-charcoal/60 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
              />
              <ShimmerButton type="submit" size="lg" className="whitespace-nowrap">
                Subscribe
              </ShimmerButton>
            </form>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}
