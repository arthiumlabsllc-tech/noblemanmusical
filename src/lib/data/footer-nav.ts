/**
 * Footer link map — Phase 23 spec §5.1.
 *
 * WHY A DATA MODULE RATHER THAN LITERALS IN THE JSX
 * The footer is the one surface where a wrong href is invisible until someone
 * clicks it. Every link here is checked by `node scripts/audit.mjs links`, which
 * crawls the prerendered HTML and reports each distinct target with its status,
 * so a typo becomes a build-time finding instead of a customer experience.
 *
 * CLIENT-SAFE ON PURPOSE: this module imports the department *taxonomy* only,
 * never `storefront-nav.ts` (which reads the 36-product seed) and never
 * `@/lib/db`. The footer is mounted by `StorefrontFooter`, a client component,
 * so anything imported here lands in the shared bundle. `departments.ts` is 193
 * lines of labels; the seed would have been ~800 lines of product data shipped
 * on every page for a list of seven words.
 *
 * THE SHOP COLUMN IS DERIVED, NOT AUTHORED. §5.1 lists seven categories; the
 * navbar's mega-menu lists the same seven from `departments`. Writing them twice
 * guarantees they drift the first time a department is added, and the drift shows
 * up as a footer link to a department the menu no longer offers.
 *
 * NO DEAD LINKS SHIPPED. Three §5.1 entries have no destination and no content
 * to put behind one, so they are omitted rather than linked to a 404:
 *   - Press          no newsroom, no posts
 *   - FAQ            no content; duplicating Shipping/Returns answers as a stub
 *   - Affiliate      no programme, no terms
 * See TECH_DEBT #13 (the decisions table) — a placeholder page with nothing in it
 * is a thin-content index and a broken promise, which costs more than a missing
 * link. `/careers` IS linked because the review checklist explicitly expects it to
 * 404 until its phase; it carries `todo` so it is greppable and allowlisted in the
 * audit. If you renumber TECH_DEBT again, grep for `TECH_DEBT #` — a pointer to the
 * wrong section is worse than no pointer, because it gets believed.
 */

import { departments } from "@/lib/data/departments";
import { DEALS_HREF, NEW_ARRIVALS_HREF, departmentHref } from "@/lib/data/shop-links";

export interface FooterLink {
  name: string;
  href: string;
  /**
   * Marks a link whose destination is not built yet. Copied onto the rendered
   * element as a `data-todo` attribute so `audit.mjs todos` can find every
   * placeholder in the DOM, not just the ones in source comments.
   */
  todo?: string;
}

export interface FooterGroup {
  title: string;
  /** `aria-labelledby` is generated from this, so keep it unique per page. */
  links: FooterLink[];
}

const RAW_DEPARTMENT_LINKS: FooterLink[] = departments.map((dept) => ({
  name: dept.name,
  href: departmentHref(dept.slug),
}));

/** §5.1 column 2 — seven departments, then the two curated entry points. */
export const shopGroup: FooterGroup = {
  title: "Shop",
  links: [
    ...RAW_DEPARTMENT_LINKS,
    { name: "Deals", href: DEALS_HREF },
    { name: "New Arrivals", href: NEW_ARRIVALS_HREF },
  ],
};

/** §5.1 column 3. */
// TODO(phase-23-future): the Careers link is the footer's only deliberate 404.
// The spec marks it a placeholder; it is allowlisted in `audit.mjs links` and
// carries `todo` below so it is greppable in both the DOM and this file.
export const companyGroup: FooterGroup = {
  title: "Company",
  links: [
    { name: "About Us", href: "/about" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "/careers", todo: "phase-23-future" },
    { name: "Contact", href: "/contact" },
  ],
};

/**
 * §5.1 column 4. "Warranty" deep-links into the Returns page's warranty-claims
 * section rather than duplicating the Returns entry, so both labels land on
 * content that actually answers the question.
 */
export const supportGroup: FooterGroup = {
  title: "Support",
  links: [
    { name: "Track Order", href: "/track" },
    { name: "Shipping", href: "/shipping" },
    { name: "Returns", href: "/returns" },
    { name: "Warranty", href: "/returns#warranty" },
    { name: "Contact", href: "/contact" },
  ],
};

/** §5.1 column 5. */
export const businessGroup: FooterGroup = {
  title: "For Business",
  links: [
    { name: "Churches", href: "/churches" },
    { name: "Radio Stations", href: "/radio-stations" },
    { name: "Schools", href: "/schools" },
    { name: "Bulk Orders", href: "/contact?type=bulk" },
  ],
};

export const footerGroups: FooterGroup[] = [
  shopGroup,
  companyGroup,
  supportGroup,
  businessGroup,
];

/** Bottom bar (§5.1). Legal pages first — they are the ones a regulator looks for. */
export const legalLinks: FooterLink[] = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Cookie Policy", href: "/cookies" },
  { name: "Accessibility", href: "/accessibility" },
];

/**
 * Payment methods (§5.1 column 1), rendered as text badges rather than brand
 * bitmaps. Four reasons, all measured: brand PNGs would each need a licensed
 * asset we do not have, four more requests on every page, a width to reserve to
 * avoid layout shift, and — the reason the review checklist cares — an `alt`
 * that is easy to leave empty. Real text has an accessible name by construction,
 * scales without blurring, and cannot render blank.
 */
export const PAYMENT_METHODS = ["Paystack", "MTN MoMo", "Visa", "Mastercard"] as const;
