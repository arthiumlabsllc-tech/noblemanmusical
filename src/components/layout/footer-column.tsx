import Link from "next/link";
import { useId } from "react";
import type { FooterGroup } from "@/lib/data/footer-nav";

/**
 * One footer link column, rendered from a `FooterGroup`.
 *
 * The list is named by its heading via `aria-labelledby` rather than wrapped in
 * its own `<nav>`: five extra navigation landmarks would give a screen-reader
 * user five more things to tab past to reach the same page, while the labelled
 * list still announces "Shop, list, 9 items" — the count and the category are
 * the parts that actually help someone scanning a footer.
 */
export function FooterColumn({ group }: { group: FooterGroup }) {
  const headingId = `footer-col-${useId()}`;

  return (
    <div>
      <h3
        id={headingId}
        className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-gold"
      >
        {group.title}
      </h3>
      <ul aria-labelledby={headingId} className="space-y-2.5">
        {group.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              data-todo={link.todo}
              className="text-sm text-cream/70 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
