export const SITE = {
  name: "Nobleman Musical Center",
  tagline: "Where Music Meets Majesty",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  location: "Accra, Ghana",
  currency: "GHS",
  currencySymbol: "GH₵",
} as const;

export const WHATSAPP_NUMBER = SITE.whatsappNumber;
export const CURRENCY = SITE.currency;
export const CURRENCY_SYMBOL = SITE.currencySymbol;
