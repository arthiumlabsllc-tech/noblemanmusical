"use client";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { GoldDivider } from "@/components/brand/gold-divider";
import { ShimmerButton } from "@/components/motion/shimmer-button";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-cream pt-20 lg:pt-24">
      <div className="bg-navy-deep py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
          <RevealOnScroll>
            <span className="font-accent text-sm italic tracking-widest text-gold-light">Get in Touch</span>
            <h1 className="mt-3 font-display text-3xl font-bold text-cream md:text-5xl">Contact Us</h1>
            <GoldDivider className="mt-6" />
            <p className="mt-6 text-cream/70">Visit our showroom in Accra or reach us via phone, email, or WhatsApp.</p>
          </RevealOnScroll>
        </div>
      </div>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <RevealOnScroll direction="left">
              <div className="space-y-6">
                <h2 className="font-display text-2xl font-bold text-navy-deep">Visit Our Showroom</h2>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, label: "Address", value: "Accra, Zongo Lane" },
                    { icon: Phone, label: "Phone", value: "+233 244 916 034" },
                    { icon: Mail, label: "Email", value: "info@noblemanmusical.com" },
                    { icon: Clock, label: "Hours", value: "Mon–Sat: 9AM – 7PM" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4 rounded-xl border border-cream-dark bg-white p-4">
                      <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-charcoal/50">{item.label}</p>
                        <p className="text-sm text-charcoal">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "233244916034"}?text=${encodeURIComponent("Hello Nobleman Musical Center, I'd like to inquire about your instruments.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-kente-green px-6 py-3 font-semibold text-cream hover:bg-kente-green/90"
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </a>
              </div>
            </RevealOnScroll>

            {/* Contact Form */}
            <RevealOnScroll direction="right">
              <div className="rounded-2xl border border-cream-dark bg-white p-6">
                {submitted ? (
                  <div className="py-12 text-center">
                    <p className="font-display text-xl font-bold text-kente-green">Message Sent!</p>
                    <p className="mt-2 text-sm text-charcoal/60">We&apos;ll get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                    <h2 className="font-display text-xl font-bold text-navy-deep">Send a Message</h2>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-charcoal">Name</label>
                      <input type="text" required className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none" placeholder="Your name" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-charcoal">Email</label>
                        <input type="email" required className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none" placeholder="you@example.com" />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-charcoal">Phone</label>
                        <input type="tel" className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none" placeholder="+233 244 916 034" />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-charcoal">Message</label>
                      <textarea rows={4} required className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none" placeholder="How can we help?" />
                    </div>
                    <ShimmerButton type="submit" size="lg" className="w-full">Send Message</ShimmerButton>
                  </form>
                )}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </div>
  );
}
