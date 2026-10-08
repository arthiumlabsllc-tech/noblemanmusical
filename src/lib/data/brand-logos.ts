// ─────────────────────────────────────────────────────────────────────────────
// BRAND LOGOS
// Original, brand-accurate vector logos for the "authorized dealer" band, served
// from WorldVectorLogo (a hotlink-friendly CDN). Replace with locally hosted,
// licensed assets later if preferred — this one file is the single source.
// ─────────────────────────────────────────────────────────────────────────────

export type BrandLogo = {
  name: string;
  logo: string;
};

// Order matters: rendered left → right in the brand band.
export const brandLogos: BrandLogo[] = [
  { name: "Fender", logo: "https://cdn.worldvectorlogo.com/logos/fender.svg" },
  { name: "Gibson", logo: "https://cdn.worldvectorlogo.com/logos/gibson.svg" },
  { name: "Yamaha", logo: "https://cdn.worldvectorlogo.com/logos/yamaha.svg" },
  { name: "Roland", logo: "https://cdn.worldvectorlogo.com/logos/roland-2.svg" },
  { name: "Pearl", logo: "https://cdn.worldvectorlogo.com/logos/pearl.svg" },
  { name: "Shure", logo: "https://cdn.worldvectorlogo.com/logos/shure-1.svg" },
  { name: "Ibanez", logo: "https://cdn.worldvectorlogo.com/logos/ibanez.svg" },
  { name: "Korg", logo: "https://cdn.worldvectorlogo.com/logos/korg.svg" },
];
