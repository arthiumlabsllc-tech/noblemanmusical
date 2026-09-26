"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { formatGHS } from "@/lib/utils";
import { ShimmerButton } from "@/components/motion/shimmer-button";
import { ShoppingBag, CreditCard, Smartphone, ChevronRight, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createOrderAction } from "@/lib/checkout/actions";

type Step = "contact" | "delivery" | "payment";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>("contact");
  const [contact, setContact] = useState({ email: "", phone: "", name: "" });
  const [delivery, setDelivery] = useState({ region: "Greater Accra", city: "", address: "", landmark: "" });
  const [paymentMethod, setPaymentMethod] = useState<"paystack" | "momo" | "cod">("paystack");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const subtotalAmount = subtotal();
  const deliveryFee = subtotalAmount >= 50000 ? 0 : 5000;
  const total = subtotalAmount + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <ShoppingBag className="mx-auto mb-6 h-16 w-16 text-charcoal/50" />
          <h1 className="font-display text-3xl font-bold text-navy-deep">Nothing to checkout</h1>
          <p className="mt-3 text-charcoal/60">Add items to your cart first.</p>
          <Link href="/shop" className="mt-8 inline-flex rounded-lg bg-gold px-8 py-3 font-semibold text-navy-deep hover:bg-gold-light">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const steps: { key: Step; label: string; number: number }[] = [
    { key: "contact", label: "Contact", number: 1 },
    { key: "delivery", label: "Delivery", number: 2 },
    { key: "payment", label: "Payment", number: 3 },
  ];

  async function handlePlaceOrder() {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await createOrderAction({
        email: contact.email,
        phone: contact.phone,
        name: contact.name,
        region: delivery.region,
        city: delivery.city,
        address: delivery.address,
        landmark: delivery.landmark,
        paymentMethod,
        items: items.map((item) => ({
          slug: item.slug,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
      });

      if (!result.success) {
        setError(result.error);
        setIsProcessing(false);
        return;
      }

      clearCart();

      if (result.redirectUrl) {
        // Paystack — redirect to payment page
        window.location.href = result.redirectUrl;
      } else {
        // COD or MoMo — go to success page
        router.push(`/checkout/success?order=${result.orderNumber}`);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setIsProcessing(false);
    }
  }

  // Validation helpers
  const contactErrors = {
    name: touched.name && !contact.name.trim() ? "Name is required" : "",
    email: touched.email && (!contact.email.trim() ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) ? "Enter a valid email" : ""),
    phone: touched.phone && !contact.phone.trim() ? "Phone is required" : "",
  };
  const deliveryErrors = {
    city: touched.city && !delivery.city.trim() ? "City is required" : "",
    address: touched.address && !delivery.address.trim() ? "Address is required" : "",
  };
  const contactValid = contact.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) && contact.phone.trim();
  const deliveryValid = delivery.city.trim() && delivery.address.trim();

  function blur(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  step === s.key
                    ? "bg-gold text-navy-deep"
                    : steps.indexOf(steps.find((x) => x.key === step)!) > i
                      ? "bg-kente-green text-cream"
                      : "bg-cream-dark text-charcoal/60"
                }`}
              >
                {steps.indexOf(steps.find((x) => x.key === step)!) > i ? (
                  <Check className="h-4 w-4" />
                ) : (
                  s.number
                )}
              </div>
              <span className={`text-sm font-medium ${step === s.key ? "text-navy-deep" : "text-charcoal/60"}`}>
                {s.label}
              </span>
              {i < steps.length - 1 && <ChevronRight className="h-4 w-4 text-charcoal/50" />}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Form */}
          <div className="lg:col-span-3">
            {step === "contact" && (
              <div className="rounded-xl border border-cream-dark bg-white p-6">
                <h2 className="mb-6 font-display text-xl font-bold text-navy-deep">Contact Information</h2>
                <p className="mb-4 text-xs text-charcoal/50">Guest checkout — no account required.</p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">Full Name</label>
                    <input type="text" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} onBlur={() => blur("name")} className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-1 ${contactErrors.name ? "border-kente-red focus:border-kente-red focus:ring-kente-red/30" : "border-cream-dark focus:border-gold focus:ring-gold/30"}`} placeholder="Kwame Asante" />
                    {contactErrors.name && <p className="mt-1 text-xs text-kente-red">{contactErrors.name}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">Email</label>
                    <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} onBlur={() => blur("email")} className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-1 ${contactErrors.email ? "border-kente-red focus:border-kente-red focus:ring-kente-red/30" : "border-cream-dark focus:border-gold focus:ring-gold/30"}`} placeholder="kwame@example.com" />
                    {contactErrors.email && <p className="mt-1 text-xs text-kente-red">{contactErrors.email}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">Phone Number</label>
                    <input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} onBlur={() => blur("phone")} className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-1 ${contactErrors.phone ? "border-kente-red focus:border-kente-red focus:ring-kente-red/30" : "border-cream-dark focus:border-gold focus:ring-gold/30"}`} placeholder="+233 244 916 034" />
                    {contactErrors.phone && <p className="mt-1 text-xs text-kente-red">{contactErrors.phone}</p>}
                  </div>
                </div>
                <ShimmerButton className="mt-6 w-full" size="lg" onClick={() => { setTouched({ name: true, email: true, phone: true }); if (contactValid) setStep("delivery"); }}>
                  Continue to Delivery
                </ShimmerButton>
              </div>
            )}

            {step === "delivery" && (
              <div className="rounded-xl border border-cream-dark bg-white p-6">
                <h2 className="mb-6 font-display text-xl font-bold text-navy-deep">Delivery Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">Region</label>
                    <select value={delivery.region} onChange={(e) => setDelivery({ ...delivery, region: e.target.value })} className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none">
                      <option>Greater Accra</option>
                      <option>Ashanti</option>
                      <option>Western</option>
                      <option>Central</option>
                      <option>Eastern</option>
                      <option>Volta</option>
                      <option>Northern</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">City / Town</label>
                    <input type="text" value={delivery.city} onChange={(e) => setDelivery({ ...delivery, city: e.target.value })} onBlur={() => blur("city")} className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-1 ${deliveryErrors.city ? "border-kente-red focus:border-kente-red focus:ring-kente-red/30" : "border-cream-dark focus:border-gold focus:ring-gold/30"}`} placeholder="Accra" />
                    {deliveryErrors.city && <p className="mt-1 text-xs text-kente-red">{deliveryErrors.city}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">Delivery Address</label>
                    <input type="text" value={delivery.address} onChange={(e) => setDelivery({ ...delivery, address: e.target.value })} onBlur={() => blur("address")} className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-1 ${deliveryErrors.address ? "border-kente-red focus:border-kente-red focus:ring-kente-red/30" : "border-cream-dark focus:border-gold focus:ring-gold/30"}`} placeholder="123 Independence Ave" />
                    {deliveryErrors.address && <p className="mt-1 text-xs text-kente-red">{deliveryErrors.address}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-charcoal">Landmark (optional)</label>
                    <input type="text" value={delivery.landmark} onChange={(e) => setDelivery({ ...delivery, landmark: e.target.value })} className="w-full rounded-lg border border-cream-dark px-4 py-3 text-sm focus:border-gold focus:outline-none" placeholder="Near Makola Market" />
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => setStep("contact")} className="rounded-lg border border-cream-dark px-6 py-3 text-sm font-medium text-charcoal hover:bg-cream-dark">Back</button>
                  <ShimmerButton className="flex-1" size="lg" onClick={() => { setTouched((p) => ({ ...p, city: true, address: true })); if (deliveryValid) setStep("payment"); }}>Continue to Payment</ShimmerButton>
                </div>
              </div>
            )}

            {step === "payment" && (
              <div className="rounded-xl border border-cream-dark bg-white p-6">
                <h2 className="mb-6 font-display text-xl font-bold text-navy-deep">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { key: "paystack" as const, label: "Pay with Card", desc: "Visa, Mastercard, MoMo via Paystack", icon: CreditCard },
                    { key: "momo" as const, label: "MTN Mobile Money", desc: "Pay directly via MoMo USSD", icon: Smartphone },
                    { key: "cod" as const, label: "Pay on Delivery", desc: "Available in Accra only", icon: ShoppingBag },
                  ].map((method) => {
                    const Icon = method.icon;
                    return (
                      <label
                        key={method.key}
                        className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors ${
                          paymentMethod === method.key ? "border-gold bg-gold/5" : "border-cream-dark hover:border-gold/30"
                        }`}
                      >
                        <input type="radio" name="payment" value={method.key} checked={paymentMethod === method.key} onChange={() => setPaymentMethod(method.key)} className="accent-gold" />
                        <Icon className="h-5 w-5 text-gold" />
                        <div>
                          <p className="text-sm font-medium text-charcoal">{method.label}</p>
                          <p className="text-xs text-charcoal/50">{method.desc}</p>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <div className="mt-4 flex gap-3">
                  <button onClick={() => setStep("delivery")} className="rounded-lg border border-cream-dark px-6 py-3 text-sm font-medium text-charcoal hover:bg-cream-dark">Back</button>
                  <ShimmerButton className="flex-1" size="lg" onClick={handlePlaceOrder} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : `Place Order — ${formatGHS(total)}`}
                  </ShimmerButton>
                </div>
                {error && (
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-kente-red/10 p-3 text-sm text-kente-red">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-cream-dark bg-white p-6 lg:sticky lg:top-4">
              <h3 className="mb-4 font-display text-base font-bold text-navy-deep">Order Summary</h3>
              <div className="max-h-64 space-y-3 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.slug} className="flex items-center gap-3">
                    <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} width={48} height={48} className="h-full w-full object-cover" sizes="48px" />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-navy/5 to-bronze/5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-medium text-charcoal">{item.name}</p>
                      <p className="text-xs text-charcoal/50">Qty: {item.quantity}</p>
                    </div>
                    <span className="tabular-nums text-xs font-medium">{formatGHS(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 border-t border-cream-dark pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">Subtotal</span>
                  <span className="tabular-nums">{formatGHS(subtotalAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal/60">Delivery</span>
                  <span className="tabular-nums">{deliveryFee === 0 ? <span className="text-kente-green">Free</span> : formatGHS(deliveryFee)}</span>
                </div>
                <div className="flex justify-between border-t border-cream-dark pt-2 font-bold">
                  <span>Total</span>
                  <span className="tabular-nums text-navy-deep">{formatGHS(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
