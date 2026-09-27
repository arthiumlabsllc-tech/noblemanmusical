import type { Metadata, Viewport } from "next";
import { playfair, cormorant, inter } from "@/lib/fonts";
import { RouteChrome } from "@/components/layout/route-chrome";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { CookieConsent } from "@/components/analytics/cookie-consent";
import { SiteJsonLd } from "@/components/seo/json-ld";
import { absoluteUrl } from "@/lib/seo/config";
import { megaMenuFeature, storefrontDepartments } from "@/lib/data/storefront-nav";
import "@/styles/globals.css";

const siteVerificationGoogle = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://noblemanmusical.com"),
  title: {
    default: "Nobleman Musical Center — Premium Musical Instruments in Ghana",
    template: "%s | Nobleman Musical Center",
  },
  description:
    "Ghana's premier destination for premium musical instruments. Trusted by churches, radio stations, schools, and professional musicians. Guitars, keyboards, drums, PA systems, and traditional Ghanaian instruments.",
  keywords: [
    "musical instruments Ghana",
    "guitars Accra",
    "keyboards Ghana",
    "drums Accra",
    "PA systems Ghana",
    "church instruments",
    "Nobleman Musical Center",
  ],
  // Every page inherits this canonical unless it overrides with its own.
  alternates: {
    canonical: "/",
  },
  // Google's crawler needs index+follow by default; private route groups
  // override this with noindex in their own layouts.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Snippet/image/video caps left generous — thin results hurt more than
      // long ones help. These keys are kebab-cased because Next emits them
      // verbatim into the robots meta content.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: siteVerificationGoogle
    ? { google: siteVerificationGoogle }
    : undefined,
  category: "shopping",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "Nobleman Musical Center",
    url: absoluteUrl("/"),
  },
  twitter: {
    card: "summary_large_image",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Nobleman",
  },
};

export const viewport: Viewport = {
  themeColor: "#060F24",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-cream font-body text-charcoal antialiased">
        {/* Entity graph — one copy for every page, referenced by @id from the
            per-page Product / BlogPosting / Breadcrumb builders. */}
        <SiteJsonLd />
        <RouteChrome departments={storefrontDepartments} feature={megaMenuFeature} />
        {children}
        <StorefrontFooter />
        <CartDrawer />
        <ServiceWorkerRegistration />
        <InstallPrompt />
        <AnalyticsProvider />
        <GoogleAnalytics />
        <CookieConsent />
      </body>
    </html>
  );
}
