import type { Metadata } from "next";
import Link from "next/link";
import { getAdminOrders } from "@/lib/admin/actions";
import { formatGHS } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Orders" };

const statusColors: Record<string, string> = {
  pending: "bg-gold/10 text-gold",
  paid: "bg-blue-500/10 text-blue-600",
  processing: "bg-blue-500/10 text-blue-600",
  shipped: "bg-purple-500/10 text-purple-600",
  delivered: "bg-kente-green/10 text-kente-green",
  cancelled: "bg-kente-red/10 text-kente-red",
  refunded: "bg-kente-red/10 text-kente-red",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { items, total, totalPages } = await getAdminOrders({
    page,
    perPage: 20,
    status: params.status,
    search: params.search,
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy-deep">Orders</h1>
        <p className="text-sm text-charcoal/60">{total} orders total</p>
      </div>

      {/* Status filters */}
      <div className="mb-4 flex flex-wrap gap-2">
        {["", "pending", "paid", "processing", "shipped", "delivered", "cancelled"].map((status) => (
          <Link
            key={status}
            href={status ? `/admin/orders?status=${status}` : "/admin/orders"}
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

      <div className="overflow-hidden rounded-xl border border-cream-dark bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-cream-dark bg-cream/50">
              <tr>
                <th className="px-4 py-3 font-medium text-charcoal/60">Order</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Customer</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Total</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Payment</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Status</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Date</th>
                <th className="px-4 py-3 font-medium text-charcoal/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-dark">
              {items.length > 0 ? (
                items.map((order) => (
                  <tr key={order.id} className="hover:bg-cream/30">
                    <td className="px-4 py-3 font-medium text-navy-deep">{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="text-charcoal/70">{order.email}</p>
                      <p className="text-xs text-charcoal/60">{order.phone}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-navy-deep">{formatGHS(order.total)}</td>
                    <td className="px-4 py-3 text-charcoal/70 capitalize">{order.paymentMethod ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[order.status] ?? "bg-charcoal/10 text-charcoal"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal/50">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-sm text-gold hover:text-gold-light">
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-charcoal/50">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-charcoal/50">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={`/admin/orders?page=${page - 1}${params.status ? `&status=${params.status}` : ""}`} className="rounded-lg border border-cream-dark px-3 py-1.5 text-sm hover:bg-cream/50">Previous</Link>
            )}
            {page < totalPages && (
              <Link href={`/admin/orders?page=${page + 1}${params.status ? `&status=${params.status}` : ""}`} className="rounded-lg border border-cream-dark px-3 py-1.5 text-sm hover:bg-cream/50">Next</Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
