import type { Metadata } from "next";
import Link from "next/link";
import { getAdminQuotes, updateQuoteStatus } from "@/lib/admin/actions";
import { formatGHS } from "@/lib/utils";
import { FileText } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Quotes" };

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600",
  sent: "bg-gold/10 text-gold",
  won: "bg-kente-green/10 text-kente-green",
  lost: "bg-kente-red/10 text-kente-red",
};

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { items, total } = await getAdminQuotes({
    page,
    perPage: 20,
    status: params.status,
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
          <FileText className="h-5 w-5 text-gold" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-deep">Quote Requests</h1>
          <p className="text-sm text-charcoal/60">{total} total requests</p>
        </div>
      </div>

      {/* Status filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["", "new", "sent", "won", "lost"].map((status) => (
          <Link
            key={status}
            href={status ? `/admin/quotes?status=${status}` : "/admin/quotes"}
            className={`rounded-full px-3 py-1.5 text-sm transition ${
              (params.status ?? "") === status
                ? "bg-navy-deep text-cream"
                : "bg-white border border-cream-dark text-charcoal/70 hover:border-gold/50"
            }`}
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "All"}
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((quote) => (
            <div key={quote.id} className="rounded-xl border border-cream-dark bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-navy-deep">{quote.orgName}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[quote.status] ?? ""}`}>
                      {quote.status}
                    </span>
                    <span className="rounded-full bg-charcoal/5 px-2 py-0.5 text-xs text-charcoal/50">
                      {quote.orgType}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-charcoal/60">
                    {quote.contactName} · {quote.email} · {quote.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-charcoal/60">{new Date(quote.createdAt).toLocaleDateString()}</p>
                  {quote.quotedAmount && (
                    <p className="mt-1 text-sm font-bold text-navy-deep">{formatGHS(quote.quotedAmount)}</p>
                  )}
                </div>
              </div>

              {quote.message && (
                <p className="mt-3 rounded-lg bg-cream/50 p-3 text-sm text-charcoal/70 italic">{quote.message}</p>
              )}

              {quote.items && quote.items.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-medium text-charcoal/50">Requested Items:</p>
                  <ul className="mt-1 text-sm text-charcoal/70">
                    {quote.items.map((item, i) => (
                      <li key={i}>• {item.name} × {item.quantity}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status actions */}
              <div className="mt-4 flex gap-2">
                {quote.status === "new" && (
                  <>
                    <form action={async () => { "use server"; await updateQuoteStatus(quote.id, "sent"); }}>
                      <button type="submit" className="rounded-lg bg-gold px-3 py-1.5 text-xs font-medium text-navy-deep hover:bg-gold-light">Mark Sent</button>
                    </form>
                    <form action={async () => { "use server"; await updateQuoteStatus(quote.id, "lost"); }}>
                      <button type="submit" className="rounded-lg border border-cream-dark px-3 py-1.5 text-xs text-charcoal/60 hover:bg-cream/50">Mark Lost</button>
                    </form>
                  </>
                )}
                {quote.status === "sent" && (
                  <form action={async () => { "use server"; await updateQuoteStatus(quote.id, "won"); }}>
                    <button type="submit" className="rounded-lg bg-kente-green px-3 py-1.5 text-xs font-medium text-cream hover:bg-kente-green/90">Mark Won</button>
                  </form>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-cream-dark bg-white py-12 text-center">
            <p className="text-charcoal/50">No quote requests found</p>
          </div>
        )}
      </div>
    </div>
  );
}
