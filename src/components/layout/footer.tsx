import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/seo/config";
import { PHONE_TEL_HREF } from "@/lib/config";
import { footerGroups, legalLinks } from "@/lib/data/footer-nav";
import { FooterColumn } from "./footer-column";
import { FooterConnect } from "./footer-connect";
import { FooterNewsletter } from "./footer-newsletter";

/**
 * Footer — Phase 23 §5.1 "DENSIFY".
 *
 * Five columns: the brand block (logo, tagline, contact, social, payments,
 * newsletter) plus Shop / Company / Support / For Business. `lg:grid-cols-6`
 * gives the brand block two tracks and each link group one, which is the only
 * arrangement where the nine-item Shop column and the three-line contact block
 * finish at roughly the same height.
 *
 * EVERYTHING THAT WAS HERE IS STILL HERE. The pre-item-4 footer had no social
 * row, no payment row, no newsletter and no Deals/New Arrivals/Warranty links —
 * but its address, phone, email and opening hours were the site's only printed
 * contact details, so they are carried over verbatim rather than "simplified".
 * The phone is now a real `tel:` link built from `@/lib/config` like every other
 * number on the site, instead of text a shopper can only retype.
 *
 * THE LOGO IS NOT `priority`. It was, which made a 43KB below-the-fold image an
 * eager fetch competing with the homepage hero for bandwidth. Its intrinsic
 * aspect ratio (714×664) is now expressed as width/height so the browser
 * reserves the box before the bytes arrive — no reflow when the footer scrolls
 * into view.
 */

export function Footer() {
  return (
    <footer className="pb-chrome bg-navy-deep text-cream/70">
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Column 1 — brand, contact, social, payments, newsletter */}
          <div className="lg:col-span-2">
            <Image
              src="/logos/footer-logo.png"
              alt="Nobleman Musical Center"
              width={180}
              height={168}
              className="mb-4 h-auto w-[180px]"
            />
            <p className="font-accent text-sm italic tracking-widest text-gold-light">
              {SITE.tagline}
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${SITE.name} on Google Maps: ${SITE.address.street}, ${SITE.address.city}`}
                className="flex items-start gap-3 rounded-sm text-cream/70 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
              >
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" aria-hidden="true" />
                <span>{SITE.address.street}, {SITE.address.city}</span>
              </a>
              <a
                href={PHONE_TEL_HREF}
                aria-label={`Call ${SITE.name} on ${SITE.contact.phone}`}
                className="flex items-center gap-3 rounded-sm text-cream/70 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
              >
                <Phone className="h-4 w-4 flex-shrink-0 text-gold" aria-hidden="true" />
                <span className="tabular-nums">{SITE.contact.phone}</span>
              </a>
              <a
                href={`mailto:${SITE.contact.email}`}
                aria-label={`Email ${SITE.name} at ${SITE.contact.email}`}
                className="flex items-center gap-3 rounded-sm text-cream/70 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
              >
                <Mail className="h-4 w-4 flex-shrink-0 text-gold" aria-hidden="true" />
                <span>{SITE.contact.email}</span>
              </a>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0 text-gold" aria-hidden="true" />
                <span>Mon–Sat: 9AM – 7PM</span>
              </div>
            </div>

            <FooterConnect />
            <FooterNewsletter />
          </div>

          {/* Columns 2-5 */}
          {footerGroups.map((group) => (
            <FooterColumn key={group.title} group={group} />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6 lg:px-8">
          <p className="text-xs text-cream/60">
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <nav aria-label="Legal">
            {/* `min-h-6` on each link is a measured fix, not decoration: these
                rendered as 15px-tall targets and failed WCAG 2.5.8 (24px minimum
                target size) once the row wrapped on a 375px screen. */}
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-cream/60">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-todo={link.todo}
                    className="inline-flex min-h-6 items-center rounded-sm px-1 transition-colors hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy-deep"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
