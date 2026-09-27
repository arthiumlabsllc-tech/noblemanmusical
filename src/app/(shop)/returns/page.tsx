import type { Metadata } from "next";
import { PolicyLayout } from "@/components/content/policy-layout";
import { SITE } from "@/lib/seo/config";
import { buildWhatsAppUrl } from "@/lib/whatsapp/build-url";

export const metadata: Metadata = {
  title: "Returns & Refunds — Nobleman Musical Center",
  description: "Our returns and refund policy for Nobleman Musical Center purchases.",
};

export default function ReturnsPage() {
  return (
    <PolicyLayout title="Returns & Refunds" lastUpdated="September 25, 2025">
      <p>We want you to be happy with your purchase. If something isn&apos;t right, here&apos;s how we can help.</p>

      <h2 className="text-lg font-bold text-navy-deep">1. Return Window</h2>
      <p>You may return items within <strong>7 days</strong> of delivery for:</p>
      <ul className="ml-4 list-disc space-y-1">
        <li>Defective or damaged products</li>
        <li>Incorrect items received</li>
        <li>Products that don&apos;t match the description</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">2. Non-Returnable Items</h2>
      <p>The following cannot be returned unless defective:</p>
      <ul className="ml-4 list-disc space-y-1">
        <li>Strings, reeds, and other consumables (once opened)</li>
        <li>Custom-made or special-order items</li>
        <li>Items marked as &quot;final sale&quot;</li>
        <li>Products with removed serial numbers or tags</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">3. How to Return</h2>
      <ol className="ml-4 list-decimal space-y-1">
        <li>Contact us via WhatsApp or email within 7 days of delivery</li>
        <li>Provide your order number and reason for return</li>
        <li>We&apos;ll arrange a pickup or provide drop-off instructions</li>
        <li>Once received and inspected, we&apos;ll process your refund or replacement</li>
      </ol>

      <h2 className="text-lg font-bold text-navy-deep">4. Refunds</h2>
      <p>Refunds are processed to the original payment method within 5–10 business days after we receive and inspect the returned item. Paystack refunds go back to your card or MoMo. COD refunds are paid via MoMo.</p>

      <h2 className="text-lg font-bold text-navy-deep">5. Exchanges</h2>
      <p>Want a different size, color, or model? We&apos;re happy to exchange items subject to availability. Contact us to arrange an exchange.</p>

      {/* Anchored: the footer links "Warranty" to /returns#warranty so both the
          Returns and Warranty entries in §5.1 land on the paragraph that
          answers the question, instead of duplicating one link twice.
          scroll-mt-32 keeps the fixed utility bar + navbar from covering the
          heading the fragment just scrolled to. */}
      <section id="warranty" className="scroll-mt-32">
        <h2 className="text-lg font-bold text-navy-deep">6. Warranty Claims</h2>
        <p>For manufacturer warranty issues (beyond 7 days), contact us with your order number and a description of the issue. We&apos;ll coordinate with the manufacturer on your behalf.</p>
      </section>

      <h2 className="text-lg font-bold text-navy-deep">7. Contact</h2>
      <p>For returns or exchanges, reach us via:</p>
      <ul className="ml-4 list-disc space-y-1">
        {/* Link and displayed number both derive from `@/lib/config`, so the
            digits behind the href can never disagree with the text. */}
        <li>
          WhatsApp:{" "}
          <a
            href={buildWhatsAppUrl()}
            className="text-gold-dark underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
          >
            {SITE.contact.phone}
          </a>
        </li>
        <li>Email: returns@noblemanmusical.com</li>
        <li>In person: Nobleman Musical Center, Accra</li>
      </ul>
    </PolicyLayout>
  );
}
