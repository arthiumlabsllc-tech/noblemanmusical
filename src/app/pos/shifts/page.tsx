import { formatGHS } from "@/lib/utils/formatGHS";

// Placeholder data
const shifts = [
  { id: 1, cashier: "John Doe", openedAt: "2024-09-27 08:00", closedAt: "2024-09-27 16:00", sales: 12, cashSales: 4500, cardSales: 2300, momoSales: 1200, status: "closed" },
  { id: 2, cashier: "Ama Serwaa", openedAt: "2024-09-27 16:00", closedAt: null, sales: 8, cashSales: 2100, cardSales: 1800, momoSales: 600, status: "open" },
  { id: 3, cashier: "Kwesi Appiah", openedAt: "2024-09-26 08:00", closedAt: "2024-09-26 16:00", sales: 15, cashSales: 5200, cardSales: 3100, momoSales: 1800, status: "closed" },
  { id: 4, cashier: "John Doe", openedAt: "2024-09-25 08:00", closedAt: "2024-09-25 16:00", sales: 10, cashSales: 3800, cardSales: 2500, momoSales: 900, status: "closed" },
];

export default function ShiftsPage() {
  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Shift Management</h1>
          <p className="text-sm text-white/40">Track and manage cashier shifts</p>
        </div>
        <button className="rounded-lg bg-gold px-4 py-2 text-sm font-bold text-navy hover:bg-gold-light">
          Open New Shift
        </button>
      </div>

      {/* Active shift banner */}
      <div className="mt-6 rounded-lg border border-gold/20 bg-gold/5 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gold">Active Shift</p>
            <p className="mt-1 text-lg font-bold text-white">Shift #2 — Ama Serwaa</p>
            <p className="text-sm text-white/40">Opened at 16:00 today</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">Sales so far</p>
            <p className="text-2xl font-bold text-gold">{formatGHS(4500)}</p>
            <p className="text-sm text-white/40">8 transactions</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button className="rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">
            View Details
          </button>
          <button className="rounded-lg bg-kente-red px-4 py-2 text-sm font-bold text-white hover:opacity-90">
            Close Shift
          </button>
        </div>
      </div>

      {/* Shift history */}
      <div className="mt-8">
        <h2 className="font-display text-lg font-bold text-white">Shift History</h2>
        <div className="mt-4 overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5">
              <tr>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Shift</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Cashier</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Opened</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Closed</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Sales</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Cash</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Card</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">MoMo</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {shifts.map((shift) => (
                <tr key={shift.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 font-mono text-xs text-white">#{shift.id}</td>
                  <td className="px-4 py-3 text-white">{shift.cashier}</td>
                  <td className="px-4 py-3 text-white/60">{shift.openedAt}</td>
                  <td className="px-4 py-3 text-white/60">{shift.closedAt || "—"}</td>
                  <td className="px-4 py-3 font-bold text-white">{shift.sales}</td>
                  <td className="px-4 py-3 text-white/60" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(shift.cashSales)}</td>
                  <td className="px-4 py-3 text-white/60" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(shift.cardSales)}</td>
                  <td className="px-4 py-3 text-white/60" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(shift.momoSales)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${shift.status === "open" ? "bg-kente-green/10 text-kente-green" : "bg-white/10 text-white/40"}`}>
                      {shift.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
