import type { Metadata } from "next";

// Base URL for the site
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://noblemanmusic.com";

// Default SEO metadata
export const defaultMetadata: Metadata = {
  title: {
    default: "Nobleman Musical Center — Premium Musical Instruments in Ghana",
    template: "%s | Nobleman Musical Center",
  },
  description:
    "Ghana's premier destination for premium musical instruments. Guitars, keyboards, drums, live sound & recording equipment. Authorized dealer for Fender, Yamaha, Gibson, Shure & more.",
  keywords: [
    "musical instruments Ghana",
    "guitars Accra",
    "keyboards Ghana",
    "drums Accra",
    "live sound equipment",
    "recording equipment Ghana",
    "Fender Ghana",
    "Yamaha Ghana",
    "Gibson Ghana",
    "Shure Ghana",
    "musical instruments Accra",
    "buy guitars Ghana",
    "Nobleman Musical Center",
  ],
  authors: [{ name: "Nobleman Musical Center" }],
  creator: "Nobleman Musical Center",
  publisher: "Nobleman Musical Center",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: SITE_URL,
    siteName: "Nobleman Musical Center",
    title: "Nobleman Musical Center — Premium Musical Instruments in Ghana",
    description:
      "Ghana's premier destination for premium musical instruments. Guitars, keyboards, drums, live sound & recording equipment.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Nobleman Musical Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nobleman Musical Center — Premium Musical Instruments in Ghana",
    description:
      "Ghana's premier destination for premium musical instruments. Guitars, keyboards, drums, live sound & recording equipment.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

// Generate metadata for product pages
export function generateProductMetadata(product: {
  name: string;
  description: string;
  price: number;
  brand: string;
  image?: string;
  slug: string;
}): Metadata {
  return {
    title: `${product.name} — ${product.brand}`,
    description: product.description,
    alternates: {
      canonical: `/shop/${product.slug}`,
    },
    openGraph: {
      type: "website",
      title: `${product.name} — ${product.brand}`,
      description: product.description,
      images: product.image
        ? [{ url: product.image, width: 1200, height: 630, alt: product.name }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} — ${product.brand}`,
      description: product.description,
    },
  };
}

// Generate metadata for category pages
export function generateCategoryMetadata(category: {
  name: string;
  description: string;
  slug: string;
}): Metadata {
  return {
    title: `${category.name} — Musical Instruments`,
    description: category.description,
    alternates: {
      canonical: `/shop?category=${category.slug}`,
    },
    openGraph: {
      type: "website",
      title: `${category.name} — Musical Instruments`,
      description: category.description,
    },
  };
}
