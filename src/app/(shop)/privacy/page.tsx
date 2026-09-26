import type { Metadata } from "next";
import { PolicyLayout } from "@/components/content/policy-layout";

export const metadata: Metadata = {
  title: "Privacy Policy — Nobleman Musical Center",
  description: "How Nobleman Musical Center collects, uses, and protects your personal data.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" lastUpdated="September 25, 2025">
      <p>Nobleman Musical Center (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information when you use our website and services.</p>

      <h2 className="text-lg font-bold text-navy-deep">1. Information We Collect</h2>
      <p><strong>Personal Information:</strong> Name, email address, phone number, delivery address, and payment information when you place an order or create an account.</p>
      <p><strong>Order Information:</strong> Products purchased, order history, and communication related to your orders.</p>
      <p><strong>Technical Information:</strong> IP address, browser type, device information, and cookies when you visit our website.</p>

      <h2 className="text-lg font-bold text-navy-deep">2. How We Use Your Information</h2>
      <ul className="ml-4 list-disc space-y-1">
        <li>Process and deliver your orders</li>
        <li>Send order confirmations and shipping updates</li>
        <li>Provide customer support via WhatsApp, email, or phone</li>
        <li>Send marketing communications (with your consent)</li>
        <li>Improve our website and services</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">3. Data Sharing</h2>
      <p>We do not sell your personal data. We share information only with:</p>
      <ul className="ml-4 list-disc space-y-1">
        <li><strong>Payment processors</strong> (Paystack, MTN MoMo) to process transactions</li>
        <li><strong>Delivery partners</strong> to fulfill your orders</li>
        <li><strong>Service providers</strong> who help operate our business (hosting, email)</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">4. Data Security</h2>
      <p>We use industry-standard encryption (HTTPS/TLS) to protect data in transit. Passwords are hashed using bcrypt. Payment information is processed securely through PCI-compliant providers — we never store full card details.</p>

      <h2 className="text-lg font-bold text-navy-deep">5. Your Rights</h2>
      <p>Under Ghana&apos;s Data Protection Act, 2012 (Act 843), you have the right to:</p>
      <ul className="ml-4 list-disc space-y-1">
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request deletion of your data</li>
        <li>Opt out of marketing communications</li>
        <li>Lodge a complaint with the Data Protection Commission</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">6. Contact</h2>
      <p>For privacy inquiries, contact us at privacy@noblemanmusical.com or visit our store in Accra, Ghana.</p>
    </PolicyLayout>
  );
}
