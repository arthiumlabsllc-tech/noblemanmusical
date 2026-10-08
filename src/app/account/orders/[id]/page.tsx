import Link from "next/link";
import { formatGHS } from "@/lib/utils/formatGHS";

// Placeholder data
const order = {
  id: "ORD-2024-001",
  date: "2024-09-25",
  status: "delivered",
  items: [
    { name: "Fender Player Stratocaster", slug: "fender-player-stratocaster", price: 4599.99, qty: 1, image: "/images/products/placeholder.svg" },
  ],
  subtotal: 4599.99,
  shipping: 0,
  tax: 0,
  total: 4599.99,
  shippingAddress: {
    name: "John Doe",
    phone: "+233 24 123 4567",
    address: "123 Independence Avenue",
    city: "Accra",
    region: "Greater Accra",
    landmark: "Near Accra Mall",
  },
  paymentMethod: "Paystack",
  trackingNumber: "TRK-2024-001",
};

const statusColors: Record<string, string> = {
  pending: "bg-charcoal/10 text-charcoal",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-amber-100 text-amber-700",
  delivered: "bg-kente-green/10 text-kente-green",
  cancelled: "bg-kente-red/10 text-kente-red",
};

export default function OrderDetailPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/account/orders" className="text-xs text-muted hover:text-gold">
          ← Back to Orders
        </Link>
        <div className="mt-2 flex items-center gap-3">
          <h1 className="font-display text-2xl font-bold text-navy">{order.id}</h1>
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>
        <p className="mt-1 text-sm text-body">Placed on {order.date}</p>
      </div>

      {/* Items */}
      <div className="rounded-lg border border-line bg-white">
        <div className="border-b border-line px-6 py-4">
          <h2 className="font-display text-lg font-bold text-navy">Items</h2>
        </div>
        <div className="divide-y divide-line">
          {order.items.map((item) => (
            <div key={item.slug} className="flex items-center gap-4 px-6 py-4">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden bg-mist">
                <div className="flex h-full w-full items-center justify-center text-2xl text-line">🎸</div>
              </div>
              <div className="flex-1">
                <Link href={`/shop/${item.slug}`} className="font-medium text-navy hover:text-gold">
                  {item.name}
                </Link>
                <p className="text-xs text-muted">Qty: {item.qty}</p>
              </div>
              <p className="font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(item.price * item.qty)}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-line px-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-body">Subtotal</span>
              <span className="text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-body">Shipping</span>
              <span className="text-kente-green" style={{ fontVariantNumeric: "tabular-nums" }}>Free</span>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <span className="font-bold text-navy">Total</span>
              <span className="text-lg font-bold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>{formatGHS(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping + Payment */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Shipping Address</h2>
          <div className="mt-4 space-y-1 text-sm text-body">
            <p className="font-medium text-navy">{order.shippingAddress.name}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.region}</p>
            <p className="text-xs text-muted">Landmark: {order.shippingAddress.landmark}</p>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-white p-6">
          <h2 className="font-display text-lg font-bold text-navy">Payment & Tracking</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Payment Method</p>
              <p className="text-navy">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Tracking Number</p>
              <p className="font-mono text-navy">{order.trackingNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="border border-navy bg-navy px-4 py-2 text-xs font-bold text-white transition-colors hover:border-gold hover:bg-gold">
          Buy Again
        </button>
        <button className="border border-line px-4 py-2 text-xs font-medium text-body transition-colors hover:border-gold hover:text-gold">
          Contact Support
        </button>
      </div>
    </div>
  );
}
