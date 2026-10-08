"use client";

import { useState } from "react";

const inputCls =
  "mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none";
const labelCls = "block text-sm font-medium text-body";

const contactInfo = [
  {
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    title: "Visit Our Store",
    lines: ["123 Independence Avenue", "Accra, Greater Accra", "Ghana"],
  },
  {
    icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    title: "Call Us",
    lines: ["+233 24 123 4567", "+233 30 223 4567"],
  },
  {
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    title: "Email Us",
    lines: ["support@noblemanmusic.com", "b2b@noblemanmusic.com"],
  },
  {
    icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    title: "Business Hours",
    lines: ["Mon – Fri: 9AM – 6PM", "Saturday: 10AM – 4PM", "Sunday: Closed"],
  },
];

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 3000);
  };

  return (
    <div className="container-wide">
      {/* Hero */}
      <section className="py-16 text-center">
        <p className="font-script text-3xl text-gold">Get in Touch</p>
        <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-body">
          Have a question about an instrument, need a bulk quote, or want to visit our store?
          We&apos;d love to hear from you.
        </p>
      </section>

      {/* Contact info grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {contactInfo.map((info) => (
          <div key={info.title} className="border border-line bg-white p-6 text-center">
            <svg className="mx-auto h-8 w-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={info.icon} />
            </svg>
            <h3 className="mt-4 text-sm font-bold text-navy">{info.title}</h3>
            <div className="mt-2 space-y-0.5">
              {info.lines.map((line) => (
                <p key={line} className="text-sm text-body">{line}</p>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Contact form + Map */}
      <section className="mt-16 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-navy">Send Us a Message</h2>
          <p className="mt-2 text-sm text-body">
            Fill in the form below and we&apos;ll get back to you within 24 hours.
          </p>

          {formSubmitted ? (
            <div className="mt-4 border border-kente-green/20 bg-kente-green/5 p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-kente-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <h3 className="mt-4 text-lg font-bold text-navy">Message Sent!</h3>
              <p className="mt-2 text-sm text-body">We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-body">First Name</label>
                  <input type="text" required className={inputCls} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-body">Last Name</label>
                  <input type="text" required className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-body">Email</label>
                <input type="email" required className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-body">Phone (optional)</label>
                <input type="tel" className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-body">Subject</label>
                <select className={inputCls}>
                  <option value="">Select a topic</option>
                  <option value="product">Product Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="b2b">B2B / Bulk Order</option>
                  <option value="warranty">Warranty Claim</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-body">Message</label>
                <textarea rows={5} required className={inputCls} />
              </div>
              <button type="submit" className="w-full border border-navy bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:border-gold hover:bg-gold">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Map */}
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold text-navy">Find Us</h2>
          <p className="mt-2 text-sm text-body">
            Visit our showroom in the heart of Accra. We&apos;re located on Independence Avenue,
            easily accessible from all major roads.
          </p>
          <div className="mt-6 flex-1 overflow-hidden border border-line">
            <iframe
              title="Nobleman Musical Center Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.9170188989!2d-0.1869!3d5.556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzMnMjEuNiJOIDDCsDExJzEyLjQiVw!5e0!3m2!1sen!2sgh!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 350 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
