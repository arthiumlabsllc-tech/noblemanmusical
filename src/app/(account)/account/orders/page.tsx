import type { Metadata } from "next";
import Link from "next/link";
import { getMyOrders } from "@/lib/account/actions";
import { formatGHS } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Orders" };

const statusColors: Record<string, string> = {
  pending: "bg-gold/10 text-gold",
  paid: "bg-blue-500/10 text-blue-600",
  processing: "bg-blue-500/10 text-blue-600",
  shipped: "bg-purple-500/10 text-purple-600",
  delivered: "bg-kente-green/10 text-kente-green",
  cancelled: "bg-kente-red/10 text-kente-red",
  refunded: "bg-kente-red/10 text-kente-red",
};

export default async function OrdersPage() {
  const orders = await getMyOrders();

  return (
    <div className="p-6 lg:p-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-navy-deep">My Orders</h1>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-xl border border-cream-dark bg-white p-5 hover:border-gold/30"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-navy-deep">{order.orderNumber}</p>
                  <p className="text-xs text-charcoal/50">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-navy-deep">{formatGHS(order.total)}</p>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? ""}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-xs text-charcoal/50 capitalize">{order.paymentMethod ?? "—"} payment</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-cream-dark bg-white p-12 text-center">
          <p className="text-charcoal/60">No orders yet. Start shopping to see your orders here.</p>
          <Link href="/shop" className="mt-4 inline-flex rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-deep hover:bg-gold-light">Browse Products</Link>
        </div>
      )}
    </div>
  );
}
