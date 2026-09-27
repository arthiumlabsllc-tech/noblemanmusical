import Link from "next/link";
import { Banknote, Phone, ShieldCheck, Truck, Wallet } from "lucide-react";
import { SITE } from "@/lib/seo/config";
import { PHONE_TEL_HREF } from "@/lib/config";

/**
 * TopUtilityBar — the thin service strip above the main nav row.
 *
 * MOUNTING: rendered INSIDE the fixed <header> in navbar.tsx, not as a sibling.
 * One header means one stacking context and one measurable height; `--chrome-h`
 * in globals.css adds `--utility-h` to `--navbar-h` and every storefront page
 * clears it with `pt-chrome`. Pulling this out of the header would desynchronise
 * that offset across ~13 pages.
 *
 * HEIGHT: `h-9` (36px) must stay equal to `--utility-h` in globals.css. Tailwind's
 * preflight sets border-box, so the hairline bottom border is included in the 36px.
 */

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "Official Warranty" },
  { icon: Truck, label: "Nationwide Delivery" },
  { icon: Wallet, label: "Pay on Delivery in Accra" },
] as const;

export function TopUtilityBar() {
  return (
    <div className="h-9 border-b border-cream/10 bg-navy-deep text-xs text-cream/80">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-4 px-4 md:px-6 lg:px-8">
        {/* Left — call us. Kept at every breakpoint: it is the highest-value
            trust affordance for a market that still phones shops. */}
        <div className="flex min-w-0 items-center gap-1.5">
          <a
            href={PHONE_TEL_HREF}
            className="flex shrink-0 items-center gap-1.5 rounded-sm font-medium text-cream transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            aria-label={`Call us on ${SITE.contact.phone}`}
          >
            <Phone className="h-3 w-3 text-gold" aria-hidden="true" />
            <span className="tabular-nums whitespace-nowrap">{SITE.contact.phone}</span>
          </a>
          <span className="hidden min-w-0 truncate text-cream/60 md:inline">
            · Order online or call us
          </span>
        </div>

        {/* Center — the three claims that close a sale in this market. Desktop
            only. NOTE (item 4): the footer deliberately does NOT repeat these —
            §5.1's footer has a social row and a payment row, not a trust strip,
            and the homepage TrustStrip (§1.13, Sub-Phase B item 11) is the place
            decided for them. Until that item lands, below 1024px shows only the
            phone number. Tracked in TECH_DEBT; `verify-item4.mjs` counts these
            phrases on the page so a later item cannot add a second copy by
            accident. */}
        <ul className="hidden items-center gap-5 lg:flex" aria-label="Service guarantees">
          {TRUST_POINTS.map(({ icon: Icon, label }) => (
            <li key={label} className="flex items-center gap-1.5 whitespace-nowrap">
              {/* Gold, not kente-green: #0A7B3E on navy-deep lands near 2.5:1
                  and reads as muddy at 12px. */}
              <Icon className="h-3 w-3 shrink-0 text-gold/80" aria-hidden="true" />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        {/* Right — currency note, Help, Track Order.
            The currency is deliberately static text, not a toggle: switching
            storefront currency needs FX handling, price rounding and payment
            rails behind it, and a dropdown that changes nothing reads as a
            broken site. It states the one currency prices are actually in. */}
        <nav aria-label="Utility" className="flex shrink-0 items-center gap-4">
          <span
            className="hidden items-center gap-1 text-cream/60 lg:flex"
            title="All prices are shown in Ghana cedis"
          >
            <Banknote className="h-3 w-3" aria-hidden="true" />
            {/* Spoken rather than aria-label: a <span> with no role is a generic
                element, and screen readers drop aria-label on it. This makes the
                currency explicit to assistive tech without a visible dropdown
                that changes nothing. */}
            <span className="sr-only">All prices are shown in Ghana cedis.</span>
            GHS ₵
          </span>
          <Link
            href="/contact"
            className="hidden rounded-sm transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold lg:inline"
          >
            Help
          </Link>
          <Link
            href="/track"
            className="rounded-sm font-medium whitespace-nowrap text-gold transition-colors hover:text-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Track Order
          </Link>
        </nav>
      </div>
    </div>
  );
}
