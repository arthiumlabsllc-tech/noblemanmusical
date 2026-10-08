import { auth } from "@/lib/auth";
import { getActiveStore } from "@/lib/data/stores";
import { getPosReceipts } from "@/lib/data/admin";
import { formatGHS } from "@/lib/utils/formatGHS";

/**
 * My Receipts — recent in-store sales.
 *
 * Store-scoped for everyone; a plain cashier is further narrowed to the sales
 * they rung up themselves, while managers/admins see the whole store.
 */
export default async function PosReceiptsPage() {
  const session = await auth();
  const store = await getActiveStore();
  const isCashier = session?.user?.role === "cashier";

  const receipts = await getPosReceipts({
    storeId: store.id,
    ...(isCashier && session?.user?.id ? { cashierUserId: session.user.id } : {}),
    limit: 50,
  });

  const total = receipts.reduce((s, r) => s + r.total, 0);

  const tone: Record<string, string> = {
    cash: "text-kente-green",
    momo: "text-amber-400",
    card: "text-blue-400",
    split: "text-gold",
    paystack: "text-blue-400",
  };

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            {isCashier ? "My Receipts" : "Store Receipts"}
          </h1>
          <p className="text-sm text-white/40">{store.name}</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-wide text-white/40">{receipts.length} sales</p>
          <p className="text-2xl font-bold text-gold">{formatGHS(total)}</p>
        </div>
      </div>

      <div className="mt-6 border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Receipt</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">When</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Customer</th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Payment</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-white/40">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {receipts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-white/40">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              receipts.map((r) => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-xs text-white">{r.receiptNumber}</td>
                  <td className="px-4 py-3 text-white/60">{r.createdAt}</td>
                  <td className="px-4 py-3 text-white/80">{r.customerName || "Walk-in Customer"}</td>
                  <td className={`px-4 py-3 capitalize ${tone[r.paymentMethod] ?? "text-white/60"}`}>
                    {r.paymentMethod}
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {formatGHS(r.total)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
