"use client";

import { useState } from "react";
import Image from "next/image";
import { trackOrder } from "@/lib/tracking/actions";
import { formatGHS } from "@/lib/utils";
import { Package, Search, CheckCircle2, Truck, Clock, XCircle, AlertCircle } from "lucide-react";

interface OrderData {
  order: {
    orderNumber: string;
    status: string;
    total: number;
    subtotal: number;
    deliveryFee: number;
    discount: number;
    paymentMethod: string | null;
    createdAt: string;
    deliveryAddress: { region: string; city: string; area: string; landmark?: string } | null;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string | null;
  }>;
}

const statusSteps = [
  { key: "pending", label: "Pending", icon: Clock, description: "Order received" },
  { key: "paid", label: "Paid", icon: CheckCircle2, description: "Payment confirmed" },
  { key: "processing", label: "Processing", icon: Package, description: "Preparing your order" },
  { key: "shipped", label: "Shipped", icon: Truck, description: "On its way to you" },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, description: "Successfully delivered" },
];

export function OrderTrackingForm() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<OrderData | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await trackOrder(orderNumber, contactInfo);
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data as OrderData);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const currentStatusIndex = result
    ? statusSteps.findIndex((s) => s.key === result.order.status)
    : -1;

  return (
    <div>
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream/80">
              Order Number
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g. NMC-1234567890-abc"
              required
              className="w-full rounded-xl border border-cream/20 bg-navy px-4 py-3 text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-cream/80">
              Email or Phone
            </label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              placeholder="Your email or phone number"
              required
              className="w-full rounded-xl border border-cream/20 bg-navy px-4 py-3 text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 font-semibold text-navy-deep transition hover:bg-gold-light disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-navy-deep/20 border-t-navy-deep" />
                Tracking...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Track Order
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mx-auto mt-6 flex max-w-lg items-center gap-3 rounded-xl border border-kente-red/30 bg-kente-red/10 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-kente-red" />
          <p className="text-sm text-kente-red">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="mx-auto mt-8 max-w-2xl">
          {/* Order Header */}
          <div className="mb-6 rounded-xl border border-cream-dark bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-charcoal/50">Order</p>
                <p className="font-mono text-lg font-bold text-navy-deep">{result.order.orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-charcoal/50">Total</p>
                <p className="text-lg font-bold text-navy-deep">{formatGHS(result.order.total)}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4 text-sm text-charcoal/60">
              <span>Placed: {new Date(result.order.createdAt).toLocaleDateString()}</span>
              <span>·</span>
              <span className="capitalize">{result.order.paymentMethod ?? "—"}</span>
            </div>
          </div>

          {/* Status Timeline */}
          <div className="mb-6 rounded-xl border border-cream-dark bg-white p-6">
            <h3 className="mb-4 font-medium text-navy-deep">Order Status</h3>
            {result.order.status === "cancelled" || result.order.status === "refunded" ? (
              <div className="flex items-center gap-3 rounded-lg bg-kente-red/10 p-4">
                <XCircle className="h-6 w-6 text-kente-red" />
                <div>
                  <p className="font-medium text-kente-red capitalize">{result.order.status}</p>
                  <p className="text-sm text-charcoal/60">
                    {result.order.status === "cancelled" ? "This order was cancelled" : "This order was refunded"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative">
                {statusSteps.map((step, i) => {
                  const isCompleted = i <= currentStatusIndex;
                  const isCurrent = i === currentStatusIndex;
                  return (
                    <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                      {/* Connector line */}
                      {i < statusSteps.length - 1 && (
                        <div
                          className={`absolute left-[15px] top-[32px] h-full w-0.5 ${
                            i < currentStatusIndex ? "bg-kente-green" : "bg-cream-dark"
                          }`}
                        />
                      )}
                      {/* Icon */}
                      <div
                        className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isCompleted
                            ? "bg-kente-green text-cream"
                            : "bg-cream text-charcoal/60"
                        } ${isCurrent ? "ring-4 ring-kente-green/20" : ""}`}
                      >
                        <step.icon className="h-4 w-4" />
                      </div>
                      {/* Content */}
                      <div className="pt-1">
                        <p className={`text-sm font-medium ${isCompleted ? "text-navy-deep" : "text-charcoal/60"}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs ${isCompleted ? "text-charcoal/60" : "text-charcoal/60"}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="rounded-xl border border-cream-dark bg-white p-6">
            <h3 className="mb-4 font-medium text-navy-deep">Items</h3>
            <div className="divide-y divide-cream-dark">
              {result.items.map((item) => (
                <div key={item.name} className="flex items-center gap-3 py-3">
                  {item.image && (
                    <Image src={item.image} alt={item.name} width={48} height={48} className="h-12 w-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy-deep">{item.name}</p>
                    <p className="text-xs text-charcoal/50">Qty: {item.quantity} × {formatGHS(item.price)}</p>
                  </div>
                  <p className="text-sm font-medium text-navy-deep">{formatGHS(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-cream-dark pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/60">Subtotal</span>
                <span>{formatGHS(result.order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-charcoal/60">Delivery</span>
                <span>{result.order.deliveryFee === 0 ? "Free" : formatGHS(result.order.deliveryFee)}</span>
              </div>
              {result.order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">Discount</span>
                  <span className="text-kente-green">-{formatGHS(result.order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold">
                <span>Total</span>
                <span>{formatGHS(result.order.total)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          {result.order.deliveryAddress && (
            <div className="mt-4 rounded-xl border border-cream-dark bg-white p-6">
              <h3 className="mb-2 font-medium text-navy-deep">Delivery Address</h3>
              <p className="text-sm text-charcoal/70">
                {result.order.deliveryAddress.area}, {result.order.deliveryAddress.city}
                <br />
                {result.order.deliveryAddress.region}
                {result.order.deliveryAddress.landmark && (
                  <>
                    <br />
                    <span className="text-xs text-charcoal/50">Near: {result.order.deliveryAddress.landmark}</span>
                  </>
                )}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
