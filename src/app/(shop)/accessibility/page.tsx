import type { Metadata } from "next";
import { PolicyLayout } from "@/components/content/policy-layout";

export const metadata: Metadata = {
  title: "Accessibility Statement — Nobleman Musical Center",
  description: "Our commitment to making Nobleman Musical Center accessible to everyone.",
};

export default function AccessibilityPage() {
  return (
    <PolicyLayout title="Accessibility Statement" lastUpdated="September 25, 2025">
      <p>
        Nobleman Musical Center is committed to ensuring digital accessibility for people with
        disabilities. We continually improve the user experience for everyone and apply the
        relevant accessibility standards.
      </p>

      <h2 className="text-lg font-bold text-navy-deep">Our Standards</h2>
      <p>
        We aim to conform to the{" "}
        <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>. These
        guidelines help make web content more accessible to people with a wide range of
        disabilities.
      </p>

      <h2 className="text-lg font-bold text-navy-deep">What We Do</h2>
      <ul className="ml-4 list-disc space-y-1">
        <li>Use semantic HTML for proper heading hierarchy and landmark regions</li>
        <li>Provide alternative text for all meaningful images</li>
        <li>Ensure sufficient color contrast ratios (minimum 4.5:1 for body text)</li>
        <li>Make all interactive elements keyboard-accessible</li>
        <li>Include ARIA labels and roles where native HTML semantics are insufficient</li>
        <li>Design responsive layouts that work across devices and zoom levels</li>
        <li>Use descriptive link text and form labels</li>
        <li>Provide visible focus indicators for keyboard navigation</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">Known Limitations</h2>
      <p>
        While we strive for full compliance, some content may not yet be fully accessible:
      </p>
      <ul className="ml-4 list-disc space-y-1">
        <li>Some older product images may lack detailed descriptions</li>
        <li>Certain third-party integrations (payment providers) may have varying accessibility</li>
      </ul>
      <p>We are actively working to address these gaps.</p>

      <h2 className="text-lg font-bold text-navy-deep">Keyboard Navigation</h2>
      <p>The entire site can be navigated using a keyboard:</p>
      <ul className="ml-4 list-disc space-y-1">
        <li><strong>Tab</strong> — Move forward through interactive elements</li>
        <li><strong>Shift + Tab</strong> — Move backward</li>
        <li><strong>Enter / Space</strong> — Activate buttons and links</li>
        <li><strong>Arrow keys</strong> — Navigate within menus and dropdowns</li>
        <li><strong>Escape</strong> — Close modals and dropdowns</li>
      </ul>

      <h2 className="text-lg font-bold text-navy-deep">Assistive Technologies</h2>
      <p>
        Our website is designed to work with screen readers including NVDA, JAWS, VoiceOver,
        and TalkBack. We test with these tools regularly.
      </p>

      <h2 className="text-lg font-bold text-navy-deep">Feedback</h2>
      <p>
        We welcome your feedback on the accessibility of Nobleman Musical Center. If you
        encounter an accessibility barrier, please contact us:
      </p>
      <ul className="ml-4 list-disc space-y-1">
        <li>
          Email:{" "}
          <a href="mailto:accessibility@noblemanmusical.com" className="text-gold hover:underline">
            accessibility@noblemanmusical.com
          </a>
        </li>
        <li>Phone: +233 244 916 034</li>
      </ul>
      <p>
        We aim to respond to accessibility feedback within 2 business days and to propose
        a solution within 5 business days.
      </p>
    </PolicyLayout>
  );
}
