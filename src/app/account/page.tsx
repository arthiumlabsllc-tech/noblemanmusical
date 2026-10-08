import { formatGHS } from "@/lib/utils/formatGHS";
import Link from "next/link";

// Placeholder data
const recentOrders = [
  { id: "ORD-2024-001", date: "2024-09-25", total: 4599.99, status: "delivered", items: 1 },
  { id: "ORD-2024-002", date: "2024-09-20", total: 1249.98, status: "shipped", items: 2 },
  { id: "ORD-2024-003", date: "2024-09-10", total: 699.99, status: "processing", items: 1 },
];

const statusColors: Record<string, string> = {
  pending: "bg-charcoal/10 text-charcoal",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-kente-green/10 text-kente-green",
  cancelled: "bg-kente-red/10 text-kente-red",
};

export default function AccountDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-navy">Welcome back!</h1>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border border-line bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-body">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-navy">3</p>
        </div>
        <div className="border border-line bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-body">Total Spent</p>
          <p className="mt-1 text-2xl font-bold text-navy">{formatGHS(6549.96)}</p>
        </div>
        <div className="border border-line bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-body">Wishlist Items</p>
          <p className="mt-1 text-2xl font-bold text-navy">5</p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="border border-line bg-white">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-bold text-navy">Recent Orders</h2>
          <Link href="/account/orders" className="text-underline-gold text-xs font-medium text-navy hover:text-gold">
            View all
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-mist">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body">Order</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body">Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body">Items</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body">Total</th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-body">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-mist">
                <td className="px-6 py-4">
                  <Link href={`/account/orders/${order.id}`} className="font-mono text-xs font-medium text-gold hover:text-gold-light">
                    {order.id}
                  </Link>
                </td>
                <td className="px-6 py-4 text-body">{order.date}</td>
                <td className="px-6 py-4 text-body">{order.items}</td>
                <td className="px-6 py-4 font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(order.total)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/account/addresses" className="border border-line bg-white p-4 transition-colors hover:border-gold">
          <p className="text-sm font-bold text-navy">Manage Addresses</p>
          <p className="text-xs text-muted">Update your delivery addresses</p>
        </Link>
        <Link href="/account/profile" className="border border-line bg-white p-4 transition-colors hover:border-gold">
          <p className="text-sm font-bold text-navy">Edit Profile</p>
          <p className="text-xs text-muted">Update your personal information</p>
        </Link>
      </div>
    </div>
  );
}
