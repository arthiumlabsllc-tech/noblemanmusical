import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const footerLinks = {
  shop: [
    { name: "Guitars", href: "/shop/guitars" },
    { name: "Keyboards", href: "/shop/keyboards" },
    { name: "Drums & Percussion", href: "/shop/drums-percussion" },
    { name: "PA & Sound", href: "/shop/pa-sound" },
    { name: "Studio Equipment", href: "/shop/studio" },
    { name: "Traditional Ghanaian", href: "/shop/traditional-ghanaian" },
    { name: "Accessories", href: "/shop/accessories" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
  ],
  support: [
    { name: "Order Tracking", href: "/track" },
    { name: "Shipping Info", href: "/shipping" },
    { name: "Returns & Warranty", href: "/returns" },
  ],
  b2b: [
    { name: "Churches", href: "/churches" },
    { name: "Radio Stations", href: "/radio-stations" },
    { name: "Schools", href: "/schools" },
    { name: "Bulk Orders", href: "/contact?type=bulk" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-deep text-cream/70">
      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-6">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Image src="/logos/footer-logo.png" alt="Nobleman Musical Center" width={180} height={0} style={{ height: "auto" }} className="mb-6" priority />
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-gold" />
                <span>Accra, Zongo Lane</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0 text-gold" />
                <span>+233 244 916 034</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0 text-gold" />
                <span>info@noblemanmusical.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 flex-shrink-0 text-gold" />
                <span>Mon–Sat: 9AM – 7PM</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-gold">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-gold">
              Company
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-gold">
              Support
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* B2B Links */}
          <div>
            <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-gold">
              For Business
            </h3>
            <ul className="space-y-2.5">
              {footerLinks.b2b.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-gold"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 md:flex-row md:px-6 lg:px-8">
          <p className="text-xs text-cream/60">
            &copy; {new Date().getFullYear()} Nobleman Musical Center. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-cream/60">
            <Link href="/privacy" className="hover:text-cream/60">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-cream/60">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-cream/60">
              Cookie Policy
            </Link>
            <Link href="/accessibility" className="hover:text-cream/60">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
