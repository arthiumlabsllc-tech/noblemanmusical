import type { Metadata } from "next";
import { PolicyLayout } from "@/components/content/policy-layout";

export const metadata: Metadata = {
  title: "Cookie Policy — Nobleman Musical Center",
  description: "How Nobleman Musical Center uses cookies and similar technologies.",
};

export default function CookiePolicyPage() {
  return (
    <PolicyLayout title="Cookie Policy" lastUpdated="September 25, 2025">
      <p>
        This Cookie Policy explains how Nobleman Musical Center (&quot;we&quot;, &quot;us&quot;) uses cookies and
        similar tracking technologies when you visit our website.
      </p>

      <h2 className="text-lg font-bold text-navy-deep">What Are Cookies?</h2>
      <p>
        Cookies are small text files placed on your device when you visit a website. They help the
        website remember your preferences and improve your experience.
      </p>

      <h2 className="text-lg font-bold text-navy-deep">Cookies We Use</h2>

      <h3 className="text-base font-semibold text-navy-deep">Essential Cookies</h3>
      <p>Required for the website to function. These cannot be disabled.</p>
      <ul className="ml-4 list-disc space-y-1">
        <li><strong>Session cookies</strong> — Keep you logged in during your visit</li>
        <li><strong>Cart cookies</strong> — Remember items in your shopping cart</li>
        <li><strong>Security cookies</strong> — Protect against cross-site request forgery</li>
      </ul>

      <h3 className="text-base font-semibold text-navy-deep">Analytics Cookies</h3>
      <p>Help us understand how visitors use our website.</p>
      <ul className="ml-4 list-disc space-y-1">
        <li><strong>Vercel Analytics</strong> — Page views, performance metrics, Core Web Vitals</li>
        <li><strong>Speed Insights</strong> — Real-user monitoring of page load times</li>
      </ul>

      <h3 className="text-base font-semibold text-navy-deep">Preference Cookies</h3>
      <p>Remember your choices to provide enhanced features.</p>
      <ul className="ml-4 list-disc space-y-1">
        <li><strong>Consent preference</strong> — Stores your cookie consent choice</li>
        <li><strong>Theme/language</strong> — Your display preferences</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">Managing Cookies</h2>
      <p>
        You can control cookies through your browser settings. Note that disabling essential cookies
        may prevent parts of the website from functioning.
      </p>
      <ul className="ml-4 list-disc space-y-1">
        <li><strong>Chrome</strong> — Settings → Privacy and Security → Cookies</li>
        <li><strong>Safari</strong> — Preferences → Privacy → Cookies</li>
        <li><strong>Firefox</strong> — Settings → Privacy & Security → Cookies</li>
        <li><strong>Edge</strong> — Settings → Cookies and Site Permissions</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">Your Consent</h2>
      <p>
        When you first visit our site, we show a cookie banner allowing you to accept or decline
        non-essential cookies. Your choice is stored and you can change it at any time by clearing
        your browser cookies.
      </p>

      <h2 className="text-lg font-bold text-navy-deep">Updates</h2>
      <p>
        We may update this Cookie Policy from time to time. Changes will be posted on this page
        with an updated revision date.
      </p>
    </PolicyLayout>
  );
}
