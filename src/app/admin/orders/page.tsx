import Link from "next/link";
import { formatGHS } from "@/lib/utils/formatGHS";

// Placeholder data
const orders = [
  { id: "NMC-ABC123", customer: "Pastor Mensah", email: "pastor@gracechapel.org", total: 4599.99, status: "paid", date: "2024-09-27", items: 1 },
  { id: "NMC-DEF456", customer: "Grace Chapel", email: "admin@gracechapel.org", total: 12999.99, status: "processing", date: "2024-09-26", items: 3 },
  { id: "NMC-GHI789", customer: "Kwame A.", email: "kwame@email.com", total: 699.99, status: "shipped", date: "2024-09-25", items: 1 },
  { id: "NMC-JKL012", customer: "Joy FM", email: "akua@joyfm.com", total: 2199.99, status: "delivered", date: "2024-09-24", items: 2 },
  { id: "NMC-MNO345", customer: "Ama D.", email: "ama@email.com", total: 549.99, status: "pending", date: "2024-09-24", items: 1 },
  { id: "NMC-PQR678", customer: "Yaw M.", email: "yaw@email.com", total: 3799.99, status: "confirmed", date: "2024-09-23", items: 1 },
  { id: "NMC-STU901", customer: "Accra Academy", email: "kwesi@accraacademy.edu", total: 12999.90, status: "delivered", date: "2024-09-22", items: 10 },
  { id: "NMC-VWX234", customer: "Kofi B.", email: "kofi@email.com", total: 899.99, status: "cancelled", date: "2024-09-21", items: 1 },
];

const statusColors: Record<string, string> = {
  pending: "bg-charcoal/10 text-charcoal",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-gold/10 text-gold",
  paid: "bg-kente-green/10 text-kente-green",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-kente-green/10 text-kente-green",
  cancelled: "bg-kente-red/10 text-kente-red",
  refunded: "bg-charcoal/10 text-charcoal",
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Orders</h1>
          <p className="text-sm text-charcoal/60">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["All", "Pending", "Processing", "Paid", "Shipped", "Delivered", "Cancelled"].map((filter) => (
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
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Order</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Customer</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Date</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Total</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Status</th>
              <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-charcoal/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-cream/30">
                <td className="px-6 py-4">
                  <p className="font-mono text-xs font-medium text-navy">{order.id}</p>
                  <p className="text-xs text-charcoal/40">{order.items} item{order.items > 1 ? "s" : ""}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-navy">{order.customer}</p>
                  <p className="text-xs text-charcoal/40">{order.email}</p>
                </td>
                <td className="px-6 py-4 text-xs text-charcoal/60">{order.date}</td>
                <td className="px-6 py-4 font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>
                  {formatGHS(order.total)}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-xs font-medium text-gold hover:text-gold-light">
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
