import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Nobleman Musical Center has been Ghana's premier destination for premium musical instruments since 2010. Authorized dealer for Fender, Yamaha, Gibson, Shure, and more.",
};

const stats = [
  { value: "14+", label: "Years of Service" },
  { value: "5,000+", label: "Happy Customers" },
  { value: "200+", label: "Products in Stock" },
  { value: "15+", label: "Premium Brands" },
];

const values = [
  {
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    title: "Authenticity Guaranteed",
    desc: "Every instrument we sell is 100% genuine, sourced directly from authorized distributors. No counterfeits, ever.",
  },
  {
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    title: "Expert Guidance",
    desc: "Our team of musicians and sound engineers help you find the perfect instrument for your needs, whether you're a beginner or a pro.",
  },
  {
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    title: "Fast Delivery",
    desc: "Free delivery within Accra for orders over GH₵ 500. Nationwide shipping available with careful packaging to protect your instrument.",
  },
  {
    icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
    title: "After-Sales Support",
    desc: "We don't disappear after the sale. Warranty support, maintenance tips, and a community of fellow musicians to connect with.",
  },
];

const team = [
  { name: "Kwame Nobleman", role: "Founder & CEO", bio: "Musician and entrepreneur with 20+ years in the Ghanaian music industry." },
  { name: "Ama Serwaa", role: "Head of Sales", bio: "Former church music director who knows exactly what worship teams need." },
  { name: "Kofi Mensah", role: "Technical Advisor", bio: "Sound engineer and producer who ensures every product meets professional standards." },
];

export default function AboutPage() {
  return (
    <div className="container-wide">
      {/* Hero */}
      <section className="py-16 text-center">
        <p className="font-accent text-lg italic text-bronze">Our Story</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
          About Nobleman Musical Center
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-charcoal/60">
          Founded in 2010, Nobleman Musical Center has grown from a small shop in Accra to
          Ghana&apos;s most trusted destination for premium musical instruments. We serve churches,
          schools, radio stations, studios, and individual musicians across West Africa.
        </p>
      </section>

      {/* Stats */}
      <section className="border-y border-charcoal/10 bg-navy py-12">
        <div className="container-wide grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-bold text-gold">{stat.value}</p>
              <p className="mt-1 text-sm text-cream/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-16">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-navy">Why Choose Nobleman?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-charcoal/60">
            We&apos;re not just a store — we&apos;re a community of musicians dedicated to helping you find your sound.
          </p>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div key={value.title} className="rounded-lg border border-charcoal/10 bg-white p-6">
              <svg className="h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={value.icon} />
              </svg>
              <h3 className="mt-4 font-display text-lg font-bold text-navy">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/60">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-charcoal/10 py-16">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-navy">Our Team</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-charcoal/60">
            Musicians, engineers, and enthusiasts who live and breathe music.
          </p>
        </div>
        <div className="mt-10 grid gap-8 sm:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="rounded-lg border border-charcoal/10 bg-white p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                <span className="font-display text-xl font-bold text-gold">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-navy">{member.name}</h3>
              <p className="text-sm font-medium text-gold">{member.role}</p>
              <p className="mt-2 text-sm text-charcoal/60">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-charcoal/10 py-16 text-center">
        <h2 className="font-display text-2xl font-bold text-navy">Ready to Find Your Sound?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-charcoal/60">
          Visit our store in Accra or browse our collection online.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/shop"
            className="rounded-md bg-gold px-6 py-3 text-sm font-bold text-navy hover:bg-gold-light"
          >
            Shop Now
          </Link>
          <Link
            href="/contact"
            className="rounded-md border border-charcoal/20 px-6 py-3 text-sm font-medium text-navy hover:border-gold hover:text-gold"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
