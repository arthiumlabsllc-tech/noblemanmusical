import type { Metadata } from "next";
import { PolicyLayout } from "@/components/content/policy-layout";

export const metadata: Metadata = {
  title: "Terms of Service — Nobleman Musical Center",
  description: "Terms and conditions for using the Nobleman Musical Center website and services.",
};

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" lastUpdated="September 25, 2025">
      <p>By accessing or using the Nobleman Musical Center website, you agree to be bound by these terms. Please read them carefully.</p>

      <h2 className="text-lg font-bold text-navy-deep">1. About Us</h2>
      <p>Nobleman Musical Center is a musical instrument retailer based in Accra, Ghana. We sell instruments, audio equipment, and accessories both online and in-store.</p>

      <h2 className="text-lg font-bold text-navy-deep">2. Orders & Pricing</h2>
      <p>All prices are listed in Ghana Cedis (GHS) and include applicable taxes. We reserve the right to correct pricing errors. An order is confirmed only after payment is verified. We may cancel orders if items are out of stock or if we suspect fraudulent activity.</p>

      <h2 className="text-lg font-bold text-navy-deep">3. Payment</h2>
      <p>We accept:</p>
      <ul className="ml-4 list-disc space-y-1">
        <li>Paystack (debit/credit cards, mobile money)</li>
        <li>MTN Mobile Money (MoMo)</li>
        <li>Cash on Delivery (Accra metropolitan area only)</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">4. Delivery</h2>
      <p>Delivery times vary by location. Estimated delivery dates are provided at checkout but are not guaranteed. See our <a href="/shipping" className="text-gold hover:text-gold-light">Shipping Policy</a> for details.</p>

      <h2 className="text-lg font-bold text-navy-deep">5. Returns</h2>
      <p>We accept returns within 7 days of delivery for defective or incorrect items. See our <a href="/returns" className="text-gold hover:text-gold-light">Returns Policy</a> for full details.</p>

      <h2 className="text-lg font-bold text-navy-deep">6. Warranties</h2>
      <p>Products are covered by manufacturer warranties where applicable. Nobleman Musical Center does not provide additional warranties unless explicitly stated. Warranty claims should be directed to us first.</p>

      <h2 className="text-lg font-bold text-navy-deep">7. B2B & Bulk Orders</h2>
      <p>Special pricing and terms apply to churches, schools, radio stations, and studios. Submit a quote request through our B2B page for custom offers.</p>

      <h2 className="text-lg font-bold text-navy-deep">8. Limitation of Liability</h2>
      <p>Nobleman Musical Center is not liable for indirect, incidental, or consequential damages arising from the use of our products or services. Our total liability shall not exceed the amount paid for the specific product in question.</p>

      <h2 className="text-lg font-bold text-navy-deep">9. Governing Law</h2>
      <p>These terms are governed by the laws of the Republic of Ghana. Any disputes shall be resolved in the courts of Ghana.</p>
    </PolicyLayout>
  );
}
