import { formatGHS } from "@/lib/utils/formatGHS";
import Link from "next/link";

// Placeholder data
const orders = [
  { id: "ORD-2024-001", date: "2024-09-25", total: 4599.99, status: "delivered", items: 1 },
  { id: "ORD-2024-002", date: "2024-09-20", total: 1249.98, status: "shipped", items: 2 },
  { id: "ORD-2024-003", date: "2024-09-10", total: 699.99, status: "processing", items: 1 },
  { id: "ORD-2024-004", date: "2024-08-28", total: 3299.99, status: "delivered", items: 1 },
  { id: "ORD-2024-005", date: "2024-08-15", total: 1099.98, status: "delivered", items: 2 },
];

const statusColors: Record<string, string> = {
  pending: "bg-charcoal/10 text-charcoal",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-kente-green/10 text-kente-green",
  cancelled: "bg-kente-red/10 text-kente-red",
};

export default function AccountOrdersPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-navy">My Orders</h1>

      {/* Filters */}
      <div className="flex gap-2">
        {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map((filter) => (
          <button
            key={filter}
            className="border border-line px-3 py-1.5 text-xs font-medium text-body transition-colors hover:border-gold hover:text-gold"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-line bg-white p-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-4">
                <div>
                  <Link href={`/account/orders/${order.id}`} className="font-mono text-sm font-bold text-navy hover:text-gold">
                    {order.id}
                  </Link>
                  <p className="text-xs text-muted">Placed on {order.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusColors[order.status]}`}>
                  {order.status}
                </span>
                <p className="text-lg font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(order.total)}</p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-body">{order.items} item{order.items > 1 ? "s" : ""}</p>
              <div className="flex gap-2">
                <Link href={`/account/orders/${order.id}`} className="border border-line px-3 py-1.5 text-xs font-medium text-body transition-colors hover:border-gold hover:text-gold">
                  View Details
                </Link>
                {order.status === "delivered" && (
                  <button className="border border-navy bg-navy px-3 py-1.5 text-xs font-bold text-white transition-colors hover:border-gold hover:bg-gold">
                    Buy Again
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
