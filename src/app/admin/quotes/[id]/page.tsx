import Link from "next/link";
import { formatGHS } from "@/lib/utils/formatGHS";

// Placeholder data
const quote = {
  id: "QT-001",
  orgName: "Grace Chapel International",
  orgType: "church",
  contactName: "Pastor John Addo",
  email: "pastor@gracechapel.org",
  phone: "+233 24 567 8901",
  status: "pending",
  createdAt: "2024-09-27",
  notes: "We need instruments for our new worship center opening in October. Budget is approximately GH₵ 15,000. We need delivery and setup included.",
  items: [
    { name: "Yamaha P-125 Digital Piano", qty: 2, unitPrice: 3299.99, quotedPrice: 2999.99 },
    { name: "Shure SM58 Vocal Microphone", qty: 4, unitPrice: 549.99, quotedPrice: 479.99 },
    { name: "Yamaha C40 Classical Guitar", qty: 3, unitPrice: 699.99, quotedPrice: 599.99 },
  ],
  subtotal: 11498.69,
  quotedTotal: 10438.69,
  discount: 1060.00,
};

const statusColors: Record<string, string> = {
  pending: "bg-charcoal/10 text-charcoal",
  responded: "bg-blue-100 text-blue-700",
  won: "bg-kente-green/10 text-kente-green",
  lost: "bg-kente-red/10 text-kente-red",
  converted: "bg-gold/10 text-gold",
};

export default function QuoteDetailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link href="/admin/quotes" className="text-xs text-charcoal/40 hover:text-gold">
            ← Back to Quotes
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold text-navy">{quote.id}</h1>
            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusColors[quote.status]}`}>
              {quote.status}
            </span>
          </div>
          <p className="mt-1 text-sm text-charcoal/60">Submitted {quote.createdAt}</p>
        </div>

        <div className="flex gap-2">
          {quote.status === "pending" && (
            <button className="rounded-md bg-gold px-4 py-2 text-xs font-bold text-navy hover:bg-gold-light">
              Respond with Quote
            </button>
          )}
          {quote.status === "won" && (
            <button className="rounded-md bg-kente-green px-4 py-2 text-xs font-bold text-white hover:opacity-90">
              Convert to Order
            </button>
          )}
          <button className="rounded-md border border-charcoal/10 px-4 py-2 text-xs font-medium text-charcoal/60 hover:border-charcoal/30">
            Mark as Lost
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: Items + Notes */}
        <div className="space-y-6 lg:col-span-2">
          {/* Items */}
          <div className="rounded-lg border border-charcoal/10 bg-white">
            <div className="border-b border-charcoal/10 px-6 py-4">
              <h2 className="font-display text-lg font-bold text-navy">Requested Items</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-cream/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-charcoal/60">Product</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-charcoal/60">Qty</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-charcoal/60">Unit Price</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-charcoal/60">Quoted Price</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-charcoal/60">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {quote.items.map((item) => (
                  <tr key={item.name}>
                    <td className="px-6 py-4 font-medium text-navy">{item.name}</td>
                    <td className="px-6 py-4 text-center text-charcoal/60">{item.qty}</td>
                    <td className="px-6 py-4 text-right text-charcoal/60" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(item.unitPrice)}</td>
                    <td className="px-6 py-4 text-right font-medium text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(item.quotedPrice)}</td>
                    <td className="px-6 py-4 text-right font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(item.quotedPrice * item.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-charcoal/10 px-6 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/60">Original Subtotal</span>
                <span className="text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(quote.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/60">B2B Discount</span>
                <span className="text-kente-green" style={{ fontVariantNumeric: "tabular-nums" }}>-{formatGHS(quote.discount)}</span>
              </div>
              <div className="mt-2 flex justify-between border-t border-charcoal/10 pt-2">
                <span className="font-bold text-navy">Quoted Total</span>
                <span className="text-lg font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(quote.quotedTotal)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-lg border border-charcoal/10 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-navy">Customer Notes</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/60">{quote.notes}</p>
          </div>
        </div>

        {/* Right: Contact + Actions */}
        <div className="space-y-6">
          <div className="rounded-lg border border-charcoal/10 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-navy">Contact Details</h2>
            <dl className="mt-4 space-y-3">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-charcoal/40">Organization</dt>
                <dd className="mt-0.5 text-sm text-navy">{quote.orgName}</dd>
                <dd className="text-xs capitalize text-charcoal/40">{quote.orgType}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-charcoal/40">Contact Person</dt>
                <dd className="mt-0.5 text-sm text-navy">{quote.contactName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-charcoal/40">Email</dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${quote.email}`} className="text-sm text-gold hover:text-gold-light">{quote.email}</a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-charcoal/40">Phone</dt>
                <dd className="mt-0.5">
                  <a href={`tel:${quote.phone}`} className="text-sm text-gold hover:text-gold-light">{quote.phone}</a>
                </dd>
              </div>
            </dl>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-charcoal/10 bg-white p-6">
            <h2 className="font-display text-lg font-bold text-navy">Activity</h2>
            <ul className="mt-4 space-y-3">
              {[
                { action: "Quote received", time: "Sep 27, 2024 — 2:30 PM", by: "System" },
                { action: "Assigned to Sales Team", time: "Sep 27, 2024 — 3:00 PM", by: "Admin" },
              ].map((event, i) => (
                <li key={i} className="flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-gold" />
                  <div>
                    <p className="text-sm text-navy">{event.action}</p>
                    <p className="text-xs text-charcoal/40">{event.time} · {event.by}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
