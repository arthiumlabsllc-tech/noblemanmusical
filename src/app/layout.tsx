import type { Metadata } from "next";
import { Josefin_Sans, Yellowtail } from "next/font/google";
import { defaultMetadata } from "@/lib/seo/metadata";
import RootStructuredData from "@/components/seo/root-structured-data";
import "@/styles/globals.css";

// Josefin Sans — the single geometric typeface used across the whole UI
const josefin = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-josefin",
  display: "swap",
});

// Yellowtail — loose brush script for the overlapping section-title accents
const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-yellowtail",
  display: "swap",
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${josefin.variable} ${yellowtail.variable}`}>
      <body className="min-h-screen bg-snow font-sans text-body antialiased">
        <RootStructuredData />
        {children}
      </body>
    </html>
  );
}
