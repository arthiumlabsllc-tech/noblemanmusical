import type { Metadata } from "next";
import { PolicyLayout } from "@/components/content/policy-layout";

export const metadata: Metadata = {
  title: "Shipping Policy — Nobleman Musical Center",
  description: "Delivery information for Nobleman Musical Center orders across Ghana.",
};

export default function ShippingPage() {
  return (
    <PolicyLayout title="Shipping Policy" lastUpdated="September 25, 2025">
      <p>We deliver musical instruments and equipment across Ghana. Here&apos;s what you need to know about our delivery process.</p>

      <h2 className="text-lg font-bold text-navy-deep">1. Delivery Areas</h2>
      <p>We deliver to all regions of Ghana. Delivery times and fees vary by location:</p>
      <ul className="ml-4 list-disc space-y-1">
        <li><strong>Greater Accra:</strong> 1–3 business days</li>
        <li><strong>Ashanti, Central, Eastern, Western:</strong> 3–5 business days</li>
        <li><strong>Northern, Upper East, Upper West, Volta, Bono, Oti, Savannah:</strong> 5–7 business days</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">2. Delivery Fees</h2>
      <p>Delivery fees are calculated at checkout based on your location and order size. Orders above ₵5,000 qualify for free delivery within Greater Accra.</p>

      <h2 className="text-lg font-bold text-navy-deep">3. Cash on Delivery</h2>
      <p>COD is available for orders within the Accra metropolitan area. A deposit may be required for high-value orders. COD orders are confirmed via phone before dispatch.</p>

      <h2 className="text-lg font-bold text-navy-deep">4. Large Items</h2>
      <p>Pianos, drum kits, PA systems, and other large items may require special delivery arrangements. We&apos;ll contact you after ordering to coordinate delivery.</p>

      <h2 className="text-lg font-bold text-navy-deep">5. Tracking</h2>
      <p>You can track your order status using our <a href="/track" className="text-gold hover:text-gold-light">Order Tracking</a> page. You&apos;ll also receive updates via WhatsApp and email.</p>

      <h2 className="text-lg font-bold text-navy-deep">6. Delays</h2>
      <p>While we strive to meet estimated delivery dates, delays may occur due to weather, road conditions, or product availability. We&apos;ll notify you of any significant delays.</p>
    </PolicyLayout>
  );
}
