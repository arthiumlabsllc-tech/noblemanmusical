import {
  Facebook,
  Instagram,
  MessageCircle,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { SITE, SOCIAL_PROFILES } from "@/lib/seo/config";
import { PAYMENT_METHODS } from "@/lib/data/footer-nav";

/**
 * FooterConnect — §5.1 column 1's social row and payment row.
 *
 * ICONS ARE DECORATION; THE LINK IS THE CONTENT. Every anchor carries an
 * `aria-label` of the form "Nobleman Musical Center on Instagram" and the SVG
 * itself is `aria-hidden`, so a screen reader announces one clean name per link
 * instead of "link, Instagram" (the icon's own title) or, worse, a bare
 * "link". The visible text is empty on purpose, which is precisely the case
 * WCAG 2.4.4 is about.
 *
 * WHY `<a>` AND NOT `<Link>`. These are cross-origin destinations; `next/link`
 * would add a client-side router entry and a prefetch request for a host that
 * has nothing to do with this app. Internal links elsewhere in the footer use
 * `<Link>` because they should.
 *
 * `target="_blank"` pairs with `rel="noopener noreferrer"`: without `noopener`
 * the opened page holds a `window.opener` reference back to this site.
 */
const NETWORK_ICONS: Record<string, LucideIcon> = {
  Instagram,
  Facebook,
  YouTube: Youtube,
  // Lucide has no WhatsApp mark (brand icons were retired upstream), and the
  // contact page already uses MessageCircle for the same affordance.
  WhatsApp: MessageCircle,
};

export function FooterConnect() {
  return (
    <div className="mt-8">
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-gold">
        Follow Us
      </h3>
      {/*
        data-todo marks these as unverified: the profile URLs are derived from
        one handle in `lib/seo/config.ts`, not supplied by the business. They are
        deliberately absent from SITE.sameAs until confirmed — see that file.
      */}
      <ul className="mt-3 flex items-center gap-3" data-todo="confirm-social-profiles">
        {SOCIAL_PROFILES.map(({ network, href }) => {
          const Icon = NETWORK_ICONS[network] ?? MessageCircle;
          return (
            <li key={network}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SITE.name} on ${network}`}
                className="grid h-11 w-11 place-items-center rounded-lg border border-cream/15 text-cream/70 transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-8 font-display text-sm font-bold uppercase tracking-wider text-gold">
        We Accept
      </h3>
      <ul className="mt-3 flex flex-wrap items-center gap-2">
        {PAYMENT_METHODS.map((method) => (
          <li
            key={method}
            className="rounded-md border border-cream/15 bg-cream/5 px-2.5 py-1.5 text-xs font-medium tracking-wide text-cream/70"
          >
            {method}
          </li>
        ))}
      </ul>
      {/*
        NO "secure checkout / nationwide delivery" line here. Those claims
        already appear in the utility bar and are scheduled again as the
        homepage trust strip (§1.13, Sub-Phase B item 11). Repeating them in the
        footer makes three copies of one promise, which is the duplication the
        item-4 review explicitly checks for.
      */}
    </div>
  );
}
