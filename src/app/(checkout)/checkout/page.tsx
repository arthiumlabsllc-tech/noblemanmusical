"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import { formatGHS } from "@/lib/utils/formatGHS";

const regions = [
  "Greater Accra",
  "Ashanti",
  "Western",
  "Eastern",
  "Central",
  "Volta",
  "Northern",
  "Upper East",
  "Upper West",
  "Bono",
  "Bono East",
  "Ahafo",
  "Western North",
  "Oti",
  "Savannah",
  "North East",
];

const inputCls =
  "mt-1 block w-full border border-line bg-white px-3 py-2.5 text-sm text-navy focus:border-gold focus:outline-none";
const labelCls = "block text-sm font-medium text-body";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const [step, setStep] = useState<"shipping" | "payment" | "processing">("shipping");
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    name: "",
    region: "",
    city: "",
    area: "",
    landmark: "",
    notes: "",
  });

  const deliveryFee = subtotal() >= 500 ? 0 : 50;
  const total = subtotal() + deliveryFee;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="container-content py-20 text-center">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Nothing to Checkout</h1>
        <p className="mt-2 text-sm text-body">Your cart is empty.</p>
        <Link href="/shop" className="btn btn-outline mt-8" data-text="Start Shopping">
          <span>Start Shopping</span>
        </Link>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleShippingSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("payment");
  }

  function handlePlaceOrder() {
    setStep("processing");
    // TODO(Phase 10): Integrate with Paystack/MoMo
    setTimeout(() => {
      const orderNumber = `NMC-${Date.now().toString(36).toUpperCase()}`;
      clearCart();
      router.push(`/checkout/success?order=${orderNumber}`);
    }, 2000);
  }

  return (
    <div className="container-content py-10 sm:py-14">
      {/* Steps indicator */}
      <div className="mb-8 flex items-center justify-center gap-4">
        {["Shipping", "Payment"].map((label, i) => {
          const isActive = (i === 0 && step === "shipping") || (i === 1 && step === "payment");
          const isComplete = i === 0 && (step === "payment" || step === "processing");
          return (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                isComplete ? "bg-navy text-white" : isActive ? "bg-gold text-white" : "bg-mist text-muted"
              }`}>
                {isComplete ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-medium ${isActive || isComplete ? "text-navy" : "text-muted"}`}>
                {label}
              </span>
              {i === 0 && <div className="mx-2 h-px w-8 bg-line" />}
            </div>
          );
        })}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          {step === "shipping" && (
            <form onSubmit={handleShippingSubmit} className="space-y-6 border border-line bg-white p-6">
              <h2 className="text-xl font-bold text-navy">Delivery Information</h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Email</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Phone</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Full Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputCls} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Region</label>
                  <select name="region" required value={formData.region} onChange={handleChange} className={inputCls}>
                    <option value="">Select region</option>
                    {regions.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>City</label>
                  <input type="text" name="city" required value={formData.city} onChange={handleChange} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Area / Address</label>
                <input type="text" name="area" value={formData.area} onChange={handleChange} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Landmark (optional)</label>
                <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Order Notes (optional)</label>
                <textarea name="notes" rows={3} value={formData.notes} onChange={handleChange} className={inputCls} />
              </div>

              <button
                type="submit"
                className="w-full border border-navy bg-navy px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:border-gold hover:bg-gold"
              >
                Continue to Payment
              </button>
            </form>
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <div className="border border-line bg-white p-6">
                <h2 className="text-xl font-bold text-navy">Payment Method</h2>
                <p className="mt-2 text-sm text-body">Choose how you&apos;d like to pay</p>

                <div className="mt-6 space-y-3">
                  <label className="flex cursor-pointer items-center gap-3 border border-gold bg-gold/5 p-4">
                    <input type="radio" name="payment" defaultChecked className="accent-gold" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Paystack</p>
                      <p className="text-xs text-body">Card, mobile money, bank transfer</p>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 border border-line p-4 transition-colors hover:border-gold">
                    <input type="radio" name="payment" className="accent-gold" />
                    <div>
                      <p className="text-sm font-semibold text-navy">MTN Mobile Money</p>
                      <p className="text-xs text-body">Pay directly with MoMo</p>
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3 border border-line p-4 transition-colors hover:border-gold">
                    <input type="radio" name="payment" className="accent-gold" />
                    <div>
                      <p className="text-sm font-semibold text-navy">Cash on Delivery</p>
                      <p className="text-xs text-body">Available in Greater Accra only</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("shipping")}
                  className="btn btn-outline btn-sm"
                  data-text="Back"
                >
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  className="flex-1 border border-navy bg-navy px-6 py-3.5 text-sm font-semibold tracking-wide text-white transition-colors hover:border-gold hover:bg-gold"
                >
                  Place Order — {formatGHS(total)}
                </button>
              </div>
            </div>
          )}

          {step === "processing" && (
            <div className="py-16 text-center">
              <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gold border-t-transparent" />
              <h2 className="mt-6 text-xl font-bold text-navy">Processing your order...</h2>
              <p className="mt-2 text-sm text-body">Please wait while we confirm your payment.</p>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border border-line bg-white p-6">
            <h2 className="text-lg font-bold text-navy">Order Summary</h2>
            <div className="mt-4 max-h-48 space-y-3 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-body">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-navy tabular-nums">
                    {formatGHS(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <dl className="mt-4 space-y-2 border-t border-line pt-4">
              <div className="flex justify-between text-sm">
                <dt className="text-body">Subtotal</dt>
                <dd className="font-medium text-navy tabular-nums">{formatGHS(subtotal())}</dd>
              </div>
              <div className="flex justify-between text-sm">
                <dt className="text-body">Delivery</dt>
                <dd className="font-medium text-navy tabular-nums">
                  {deliveryFee === 0 ? <span className="text-kente-green">Free</span> : formatGHS(deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2">
                <dt className="font-semibold text-navy">Total</dt>
                <dd className="text-lg font-bold text-navy tabular-nums">{formatGHS(total)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
