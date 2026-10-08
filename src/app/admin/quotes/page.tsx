import Link from "next/link";
import { formatGHS } from "@/lib/utils/formatGHS";

// Placeholder data
const quotes = [
  { id: "QT-001", orgName: "Grace Chapel International", orgType: "church", contactName: "Pastor John Addo", email: "pastor@gracechapel.org", phone: "+233 24 567 8901", items: 3, status: "pending", createdAt: "2024-09-27", quotedAmount: null },
  { id: "QT-002", orgName: "Joy FM Ghana", orgType: "radio", contactName: "Akua Boateng", email: "akua@joyfm.com", phone: "+233 30 223 4567", items: 2, status: "responded", createdAt: "2024-09-25", quotedAmount: 4399.98 },
  { id: "QT-003", orgName: "Accra Academy", orgType: "school", contactName: "Mr. Kwesi Appiah", email: "kwesi@accraacademy.edu", phone: "+233 20 345 6789", items: 10, status: "won", createdAt: "2024-09-20", quotedAmount: 12999.90 },
  { id: "QT-004", orgName: "SoundWave Studios", orgType: "studio", contactName: "Kofi Mensah", email: "kofi@soundwave.gh", phone: "+233 24 111 2222", items: 5, status: "lost", createdAt: "2024-09-18", quotedAmount: 8500.00 },
  { id: "QT-005", orgName: "Bethel Worship Center", orgType: "church", contactName: "Deaconess Ama", email: "ama@bethel.org", phone: "+233 20 999 8888", items: 7, status: "converted", createdAt: "2024-09-15", quotedAmount: 15200.00 },
];

const statusColors: Record<string, string> = {
  pending: "bg-charcoal/10 text-charcoal",
  responded: "bg-blue-100 text-blue-700",
  won: "bg-kente-green/10 text-kente-green",
  lost: "bg-kente-red/10 text-kente-red",
  converted: "bg-gold/10 text-gold",
};

export default function AdminQuotesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">B2B Quotes</h1>
          <p className="text-sm text-charcoal/60">{quotes.length} total quotes</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Pending", value: quotes.filter((q) => q.status === "pending").length, color: "text-charcoal" },
          { label: "Responded", value: quotes.filter((q) => q.status === "responded").length, color: "text-blue-700" },
          { label: "Won", value: quotes.filter((q) => q.status === "won").length, color: "text-kente-green" },
          { label: "Converted", value: quotes.filter((q) => q.status === "converted").length, color: "text-gold" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-charcoal/10 bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-charcoal/60">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["All", "Pending", "Responded", "Won", "Lost", "Converted"].map((filter) => (
          <button
            key={filter}
            className="rounded-md border border-charcoal/10 px-3 py-1.5 text-xs font-medium text-charcoal/60 hover:border-gold hover:text-gold"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-cream/50">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Quote</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Organization</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Contact</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Items</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Quoted</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Status</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {quotes.map((quote) => (
              <tr key={quote.id} className="hover:bg-cream/30">
                <td className="px-6 py-4">
                  <p className="font-mono text-xs font-medium text-navy">{quote.id}</p>
                  <p className="text-xs text-charcoal/40">{quote.createdAt}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-navy">{quote.orgName}</p>
                  <p className="text-xs capitalize text-charcoal/40">{quote.orgType}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-navy">{quote.contactName}</p>
                  <p className="text-xs text-charcoal/40">{quote.email}</p>
                </td>
                <td className="px-6 py-4 text-sm text-charcoal/60">{quote.items}</td>
                <td className="px-6 py-4 font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {quote.quotedAmount ? formatGHS(quote.quotedAmount) : "—"}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusColors[quote.status]}`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Link href={`/admin/quotes/${quote.id}`} className="text-xs font-medium text-gold hover:text-gold-light">
                      View
                    </Link>
                    {quote.status === "won" && (
                      <button className="text-xs font-medium text-kente-green hover:underline">
                        Convert →
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
