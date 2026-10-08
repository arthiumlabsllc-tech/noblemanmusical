import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const footerLinks = {
  shop: [
    { href: "/shop", label: "All Products" },
    { href: "/shop?category=guitars", label: "Guitars" },
    { href: "/shop?category=basses", label: "Basses" },
    { href: "/shop?category=amps-and-effects", label: "Amps & Effects" },
    { href: "/shop?category=drums", label: "Drums" },
    { href: "/shop?category=keyboards", label: "Keyboards" },
    { href: "/shop?category=live-sound", label: "Live Sound" },
    { href: "/shop?category=recording", label: "Recording" },
  ],
  support: [
    { href: "/contact", label: "Contact Us" },
    { href: "/contact", label: "Shipping & Delivery" },
    { href: "/contact", label: "Returns & Exchanges" },
    { href: "/contact", label: "FAQ" },
    { href: "/contact", label: "Warranty" },
  ],
  company: [
    { href: "/about", label: "About Nobleman" },
    { href: "/brands", label: "Our Brands" },
    { href: "/b2b", label: "B2B & Bulk Orders" },
    { href: "/contact", label: "Blog" },
    { href: "/contact", label: "Careers" },
  ],
  legal: [
    { href: "/contact", label: "Privacy Policy" },
    { href: "/contact", label: "Terms of Service" },
    { href: "/contact", label: "Cookie Policy" },
  ],
};

function FooterCol({
  heading,
  links,
}: {
  heading: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="mb-6 text-xl font-bold leading-none text-navy">{heading}</h4>
      <ul className="space-y-3">
        {links.map((link, i) => (
          <li key={`${link.href}-${i}`}>
            <Link
              href={link.href}
              className="text-underline-gold text-base text-navy transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const socials = [
  { href: "https://www.facebook.com/noblemanmusic", label: "Facebook", path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
  { href: "https://www.instagram.com/noblemanmusic", label: "Instagram", path: "M16 4H8a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V8a4 4 0 00-4-4zm-4 11a3 3 0 110-6 3 3 0 010 6zm4.5-7.5a1 1 0 110-2 1 1 0 010 2z" },
  { href: "https://www.youtube.com/@noblemanmusic", label: "YouTube", path: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0C.488 3.45.029 5.804 0 12c.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0C23.512 20.55 23.971 18.196 24 12c-.029-6.185-.484-8.549-4.385-8.816zM9 16V8l8 4-8 4z" },
  { href: "https://wa.me/233241234567", label: "WhatsApp", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
];

export function Footer() {
  return (
    <footer className="bg-snow pt-16 sm:pt-24">
      <div className="container-wide">
        {/* Brand block — centered */}
        <div className="flex flex-col items-center text-center">
          <Link href="/" aria-label="Nobleman Musical Center home">
            <Logo variant="horizontal" tone="navy" width={170} />
          </Link>
          <p className="mt-6 max-w-[500px] text-base leading-relaxed text-body">
            Premium musical instruments for churches, radio stations, schools, professional
            musicians, and studios across Accra, Ghana.
          </p>
          <div className="mt-8 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-muted/40 text-muted transition-colors hover:border-gold hover:text-gold"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div className="mt-14 grid grid-cols-2 gap-10 sm:grid-cols-3 lg:flex lg:items-start lg:justify-between">
          <FooterCol heading="Shop" links={footerLinks.shop} />
          <FooterCol heading="Support" links={footerLinks.support} />
          <FooterCol heading="Company" links={footerLinks.company} />
          <FooterCol heading="Legal" links={footerLinks.legal} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line py-8 sm:flex-row">
          <p className="text-sm text-body">
            &copy; {new Date().getFullYear()} Nobleman Musical Center. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link, i) => (
              <Link
                key={`${link.href}-${i}`}
                href={link.href}
                className="text-underline-gold text-sm text-body hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
