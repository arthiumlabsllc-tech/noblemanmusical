import { formatGHS } from "@/lib/utils/formatGHS";

// Placeholder data
const todayStats = {
  sales: 20,
  revenue: 12500,
  avgOrder: 625,
  cash: 4500,
  card: 4100,
  momo: 3900,
};

const recentSales = [
  { id: "POS-001", time: "14:32", cashier: "Ama Serwaa", items: 2, total: 1249.98, payment: "Cash" },
  { id: "POS-002", time: "14:15", cashier: "Ama Serwaa", items: 1, total: 4599.99, payment: "Card" },
  { id: "POS-003", time: "13:48", cashier: "Ama Serwaa", items: 3, total: 899.97, payment: "MTN MoMo" },
  { id: "POS-004", time: "13:20", cashier: "Ama Serwaa", items: 1, total: 549.99, payment: "Cash" },
  { id: "POS-005", time: "12:55", cashier: "Ama Serwaa", items: 2, total: 3299.98, payment: "Card" },
  { id: "POS-006", time: "12:30", cashier: "Ama Serwaa", items: 1, total: 699.99, payment: "Cash" },
  { id: "POS-007", time: "11:45", cashier: "Ama Serwaa", items: 4, total: 1599.96, payment: "MTN MoMo" },
  { id: "POS-008", time: "11:20", cashier: "Ama Serwaa", items: 1, total: 349.99, payment: "Cash" },
];

const topProducts = [
  { name: "Shure SM58 Microphone", qty: 5, revenue: 2749.95 },
  { name: "Yamaha C40 Classical Guitar", qty: 3, revenue: 2099.97 },
  { name: "Boss DS-1 Distortion", qty: 4, revenue: 1399.96 },
  { name: "Fender Player Stratocaster", qty: 1, revenue: 4599.99 },
  { name: "Audio-Technica AT2020", qty: 2, revenue: 999.98 },
];

export default function ReportsPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Sales Reports</h1>
          <p className="text-sm text-white/40">Today&apos;s performance and history</p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5">
            Today
          </button>
          <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5">
            This Week
          </button>
          <button className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5">
            This Month
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">Total Sales</p>
          <p className="mt-1 text-2xl font-bold text-white">{todayStats.sales}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">Revenue</p>
          <p className="mt-1 text-2xl font-bold text-gold">{formatGHS(todayStats.revenue)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">Avg Order</p>
          <p className="mt-1 text-2xl font-bold text-white">{formatGHS(todayStats.avgOrder)}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">Payment Split</p>
          <div className="mt-1 flex gap-2 text-xs">
            <span className="text-kente-green">{formatGHS(todayStats.cash)}</span>
            <span className="text-blue-400">{formatGHS(todayStats.card)}</span>
            <span className="text-amber-400">{formatGHS(todayStats.momo)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent sales */}
        <div className="lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-white">Recent Sales</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Receipt</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Time</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Cashier</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Items</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Total</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-xs text-white">{sale.id}</td>
                    <td className="px-4 py-3 text-white/60">{sale.time}</td>
                    <td className="px-4 py-3 text-white/60">{sale.cashier}</td>
                    <td className="px-4 py-3 text-white/60">{sale.items}</td>
                    <td className="px-4 py-3 font-bold text-white" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(sale.total)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${sale.payment === "Cash" ? "bg-kente-green/10 text-kente-green" : sale.payment === "Card" ? "bg-blue-100/10 text-blue-400" : "bg-amber-100/10 text-amber-400"}`}>
                        {sale.payment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div>
          <h2 className="font-display text-lg font-bold text-white">Top Products</h2>
          <div className="mt-4 space-y-2">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white line-clamp-1">{product.name}</p>
                  <p className="text-xs text-white/40">{product.qty} sold</p>
                </div>
                <p className="text-sm font-bold text-gold" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
