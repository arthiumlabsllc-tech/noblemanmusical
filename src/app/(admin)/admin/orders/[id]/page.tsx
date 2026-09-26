import type { Metadata } from "next";
import Link from "next/link";
import { getAdminOrder, updateOrderStatus } from "@/lib/admin/actions";
import { formatGHS } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Order Details" };

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { order, items } = await getAdminOrder(id);

  if (!order) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-charcoal/60">Order not found.</p>
        <Link href="/admin/orders" className="mt-4 inline-block text-sm text-gold">← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-navy-deep">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-deep">{order.orderNumber}</h1>
          <p className="text-sm text-charcoal/50">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm font-medium ${
          order.status === "delivered" ? "bg-kente-green/10 text-kente-green" :
          order.status === "cancelled" ? "bg-kente-red/10 text-kente-red" :
          "bg-gold/10 text-gold"
        }`}>
          {order.status}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 rounded-xl border border-cream-dark bg-white">
          <div className="border-b border-cream-dark px-5 py-4">
            <h3 className="font-medium text-navy-deep">Items</h3>
          </div>
          <div className="divide-y divide-cream-dark">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-navy-deep">{item.name}</p>
                  <p className="text-xs text-charcoal/50">Qty: {item.quantity} × {formatGHS(item.price)}</p>
                </div>
                <p className="text-sm font-medium text-navy-deep">{formatGHS(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-cream-dark px-5 py-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-charcoal/60">Subtotal</span><span>{formatGHS(order.subtotal)}</span></div>
            <div className="flex justify-between text-sm"><span className="text-charcoal/60">Delivery</span><span>{formatGHS(order.deliveryFee)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-sm"><span className="text-charcoal/60">Discount</span><span className="text-kente-green">-{formatGHS(order.discount)}</span></div>}
            <div className="flex justify-between text-sm font-bold"><span>Total</span><span>{formatGHS(order.total)}</span></div>
          </div>
        </div>

        {/* Customer Info + Actions */}
        <div className="space-y-4">
          <div className="rounded-xl border border-cream-dark bg-white p-5">
            <h3 className="mb-3 font-medium text-navy-deep">Customer</h3>
            <p className="text-sm text-charcoal/70">{order.email}</p>
            <p className="text-sm text-charcoal/70">{order.phone}</p>
            {order.deliveryAddress && (
              <p className="mt-2 text-sm text-charcoal/50">
                {order.deliveryAddress.area}, {order.deliveryAddress.city}, {order.deliveryAddress.region}
              </p>
            )}
          </div>

          <div className="rounded-xl border border-cream-dark bg-white p-5">
            <h3 className="mb-3 font-medium text-navy-deep">Update Status</h3>
            <div className="space-y-2">
              {["pending", "paid", "processing", "shipped", "delivered", "cancelled"].map((status) => (
                <form key={status} action={async () => { "use server"; await updateOrderStatus(order.id, status); }}>
                  <button
                    type="submit"
                    className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                      order.status === status
                        ? "bg-navy-deep text-cream"
                        : "bg-cream/50 text-charcoal/70 hover:bg-gold/10"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
