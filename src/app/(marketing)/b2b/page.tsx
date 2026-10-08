"use client";

import { useState } from "react";
import Link from "next/link";

const inputCls =
  "mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none";
const labelCls = "block text-sm font-medium text-body";

const orgTypes = [
  { value: "church", label: "Church / Worship Center", icon: "🏛️" },
  { value: "school", label: "School / University", icon: "🎓" },
  { value: "radio", label: "Radio / TV Station", icon: "📻" },
  { value: "studio", label: "Recording Studio", icon: "🎙️" },
  { value: "band", label: "Band / Orchestra", icon: "🎵" },
  { value: "retail", label: "Retail / Reseller", icon: "🏪" },
  { value: "other", label: "Other Organization", icon: "🏢" },
];

const popularItems = [
  { slug: "fender-player-stratocaster", name: "Fender Player Stratocaster", price: 4599.99 },
  { slug: "yamaha-c40-classical", name: "Yamaha C40 Classical Guitar", price: 699.99 },
  { slug: "shure-sm58", name: "Shure SM58 Vocal Microphone", price: 549.99 },
  { slug: "yamaha-p-125", name: "Yamaha P-125 Digital Piano", price: 3299.99 },
  { slug: "roland-fp-30x", name: "Roland FP-30X Digital Piano", price: 3799.99 },
  { slug: "yamaha-stage-custom", name: "Yamaha Stage Custom Birch 5pc", price: 5999.99 },
];

interface QuoteItem {
  id: number;
  product: string;
  quantity: string;
}

export default function B2BPage() {
  const [items, setItems] = useState<QuoteItem[]>([
    { id: 1, product: "", quantity: "" },
    { id: 2, product: "", quantity: "" },
    { id: 3, product: "", quantity: "" },
  ]);
  const [submitted, setSubmitted] = useState(false);
  let nextId = 4;

  const addItem = () => {
    setItems((prev) => [...prev, { id: nextId++, product: "", quantity: "" }]);
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: number, field: keyof QuoteItem, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="container-wide py-12">
      {/* Hero */}
      <div className="mb-12 text-center">
        <p className="font-script text-3xl text-gold">For Organizations</p>
        <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          B2B & Bulk Orders
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-body">
          Whether you&apos;re outfitting a church, school, radio station, or studio — we offer
          custom pricing, dedicated support, and flexible payment terms for organizations.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Benefits */}
        <div className="space-y-6">
          <div className="border border-line bg-white p-6">
            <h2 className="text-lg font-bold text-navy">Why Choose Nobleman B2B?</h2>
            <ul className="mt-4 space-y-3">
              {[
                { title: "Volume Discounts", desc: "Save up to 20% on bulk orders" },
                { title: "Dedicated Account Manager", desc: "One point of contact for your org" },
                { title: "Flexible Payment Terms", desc: "Net-30 available for qualified orgs" },
                { title: "Free Delivery", desc: "Free shipping on all B2B orders" },
                { title: "Installation Support", desc: "We help set up your gear on-site" },
                { title: "Warranty & Service", desc: "Extended warranty options available" },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-navy">{item.title}</p>
                    <p className="text-xs text-body">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular items */}
          <div className="border border-line bg-white p-6">
            <h2 className="text-lg font-bold text-navy">Popular for Organizations</h2>
            <ul className="mt-4 space-y-2">
              {popularItems.map((item) => (
                <li key={item.slug} className="flex items-center justify-between border-b border-line py-2">
                  <Link href={`/shop/${item.slug}`} className="text-sm text-navy hover:text-gold">
                    {item.name}
                  </Link>
                  <span className="text-sm font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>
                    GH₵{item.price.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Quote form */}
        <div className="lg:col-span-2">
          <div className="border border-line bg-white p-6 sm:p-8">
            <h2 className="text-xl font-bold text-navy">Request a Quote</h2>
            <p className="mt-1 text-sm text-body">
              Fill in the details below and we&apos;ll get back to you within 24 hours.
            </p>

            {submitted ? (
              <div className="mt-6 border border-kente-green/20 bg-kente-green/5 p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-kente-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <h3 className="mt-4 text-lg font-bold text-navy">Quote Request Submitted!</h3>
                <p className="mt-2 text-sm text-body">Our B2B team will contact you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Organization info */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-navy">Organization Details</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-body">Organization Name</label>
                    <input type="text" required className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body">Organization Type</label>
                    <select required className={inputCls}>
                      <option value="">Select type</option>
                      {orgTypes.map((t) => (
                        <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-navy">Contact Information</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-body">Contact Name</label>
                    <input type="text" required className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body">Email</label>
                    <input type="email" required className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-body">Phone</label>
                    <input type="tel" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* Items needed */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-navy">Items Needed</h3>
                <p className="mb-3 text-xs text-muted">List the products and quantities you need. We&apos;ll provide custom pricing.</p>
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={item.id} className="flex items-stretch gap-2">
                      <select
                        value={item.product}
                        onChange={(e) => updateItem(item.id, "product", e.target.value)}
                        className="min-w-0 flex-1 border border-line bg-white px-3 py-2.5 text-sm text-navy focus:border-gold focus:outline-none"
                      >
                        <option value="">Select product...</option>
                        {popularItems.map((p) => (
                          <option key={p.slug} value={p.slug}>{p.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        min="1"
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                        className="w-16 shrink-0 border border-line bg-white px-2 py-2.5 text-sm text-navy placeholder:text-muted focus:border-gold focus:outline-none"
                      />
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 border border-line px-3 text-sm text-muted transition-colors hover:border-kente-red/40 hover:text-kente-red"
                          aria-label={`Remove item ${index + 1}`}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-gold transition-colors hover:text-gold-light"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add another item
                </button>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-body">Additional Notes</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your needs, timeline, budget, or any special requirements..."
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                className="w-full border border-navy bg-navy px-6 py-3 text-sm font-bold text-white transition-colors hover:border-gold hover:bg-gold"
              >
                Submit Quote Request
              </button>

              <p className="text-center text-xs text-muted">
                We typically respond within 24 hours during business days.
              </p>
            </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
