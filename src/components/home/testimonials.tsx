"use client";

import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { GoldDivider } from "@/components/brand/gold-divider";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Pastor Emmanuel Mensah",
    role: "Head Pastor, Grace Chapel International",
    text: "Nobleman Musical Center equipped our entire church with professional sound. Their understanding of worship audio is unmatched in Accra. The quality and service are truly premium.",
    rating: 5,
  },
  {
    name: "Abena Osei-Bonsu",
    role: "Music Director, West Africa Radio",
    text: "We've been sourcing our studio equipment from Nobleman for three years. Their expertise in professional audio and competitive pricing keeps us coming back.",
    rating: 5,
  },
  {
    name: "Kofi Asante",
    role: "Independent Artist & Producer",
    text: "From my first guitar to my full home studio setup — Nobleman has been with me every step. Their staff actually plays music and gives honest advice. That's rare.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="bg-navy-deep py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        {/* Header */}
        <RevealOnScroll className="mb-12 text-center">
          <span className="font-accent text-sm italic tracking-widest text-gold-light">
            What Our Clients Say
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-cream md:text-4xl">
            Voices of Trust
          </h2>
          <GoldDivider className="mt-4" />
        </RevealOnScroll>

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <RevealOnScroll key={testimonial.name} delay={i * 0.12}>
              <div className="relative rounded-2xl border border-cream/10 bg-navy p-8">
                <Quote className="absolute right-6 top-6 h-8 w-8 text-gold/10" />

                {/* Stars */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-gold text-gold"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed text-cream/70 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-6 border-t border-cream/10 pt-4">
                  <p className="font-display text-sm font-bold text-cream">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-cream/50">{testimonial.role}</p>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
