import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Container Test",
  robots: { index: false, follow: false },
};

const containers = [
  { name: "container-full", className: "container-full", maxWidth: "1920px", usage: "Homepage" },
  { name: "container-wide", className: "container-wide", maxWidth: "1600px", usage: "Shop, PDP" },
  {
    name: "container-content",
    className: "container-content",
    maxWidth: "1280px",
    usage: "General content",
  },
  { name: "container-narrow", className: "container-narrow", maxWidth: "720px", usage: "Blog, policies" },
];

const colors = [
  { name: "navy-deep", bg: "bg-[#060F24]", text: "text-cream", hex: "#060F24" },
  { name: "navy", bg: "bg-[#0B1B3B]", text: "text-cream", hex: "#0B1B3B" },
  { name: "gold", bg: "bg-[#D4AF37]", text: "text-navy", hex: "#D4AF37" },
  { name: "gold-light", bg: "bg-[#E8C766]", text: "text-navy", hex: "#E8C766" },
  { name: "cream", bg: "bg-[#F5F0E6]", text: "text-navy", hex: "#F5F0E6" },
  { name: "bronze", bg: "bg-[#B08D57]", text: "text-cream", hex: "#B08D57" },
  { name: "kente-red", bg: "bg-[#C1272D]", text: "text-cream", hex: "#C1272D" },
  { name: "kente-green", bg: "bg-[#0A7B3E]", text: "text-cream", hex: "#0A7B3E" },
  { name: "charcoal", bg: "bg-[#1A1A1A]", text: "text-cream", hex: "#1A1A1A" },
];

export default function ContainerTestPage() {
  return (
    <div className="space-y-16 pb-20">
      {/* Header */}
      <div className="container-content pt-8">
        <h1 className="font-display text-3xl font-bold text-navy">Layout System Test</h1>
        <p className="mt-2 text-sm text-charcoal/60">
          This page demonstrates all container classes and design tokens.
        </p>
      </div>

      {/* Container Classes */}
      <section>
        <h2 className="container-content mb-4 font-display text-2xl font-bold text-navy">
          Container Classes
        </h2>
        {containers.map((c) => (
          <div key={c.name} className="mb-6">
            <div className="container-content mb-2 flex items-baseline justify-between">
              <span className="font-mono text-sm font-semibold text-navy">
                .{c.name}
              </span>
              <span className="text-xs text-charcoal/60">
                max-width: {c.maxWidth} — {c.usage}
              </span>
            </div>
            <div className={c.className}>
              <div className="rounded-sm border-2 border-dashed border-gold bg-cream p-4 text-center font-mono text-sm text-navy">
                {c.name} — content area (resize browser to see gutter changes)
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Color Tokens */}
      <section className="container-content">
        <h2 className="mb-4 font-display text-2xl font-bold text-navy">Color Tokens</h2>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-9">
          {colors.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-lg shadow-sm">
              <div className={`${c.bg} flex h-20 items-end p-2`}>
                <span className={`${c.text} text-xs font-medium`}>{c.name}</span>
              </div>
              <div className="bg-white px-2 py-1">
                <span className="font-mono text-[10px] text-charcoal/60">{c.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="container-content">
        <h2 className="mb-4 font-display text-2xl font-bold text-navy">Typography</h2>
        <div className="space-y-4 rounded-lg border border-charcoal/10 bg-white p-6">
          <div>
            <p className="text-xs text-charcoal/40">Display — Playfair Display 900</p>
            <p className="font-display text-4xl font-black text-navy">Where Music Meets Majesty</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/40">Display — Playfair Display 700</p>
            <p className="font-display text-3xl font-bold text-navy">Premium Musical Instruments</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/40">Display — Playfair Display 400</p>
            <p className="font-display text-2xl text-navy">Nobleman Musical Center</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/40">Accent — Cormorant Garamond italic</p>
            <p className="font-accent text-xl italic text-bronze">Where Music Meets Majesty</p>
          </div>
          <div>
            <p className="text-xs text-charcoal/40">Body — Inter 400</p>
            <p className="font-sans text-base text-charcoal">
              Trusted by churches, radio stations, schools, professional musicians, and studios across
              Accra, Ghana.
            </p>
          </div>
          <div>
            <p className="text-xs text-charcoal/40">Price — Inter tabular-nums</p>
            <p className="font-sans text-2xl font-semibold text-navy" style={{ fontVariantNumeric: "tabular-nums" }}>
              GH₵ 1,299.99
            </p>
          </div>
        </div>
      </section>

      {/* Gutters */}
      <section className="container-content">
        <h2 className="mb-4 font-display text-2xl font-bold text-navy">Responsive Gutters</h2>
        <div className="overflow-hidden rounded-lg border border-charcoal/10 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy text-cream">
              <tr>
                <th className="px-4 py-2">Breakpoint</th>
                <th className="px-4 py-2">Gutter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              <tr><td className="px-4 py-2">&lt; 640px</td><td className="px-4 py-2 font-mono">16px</td></tr>
              <tr><td className="px-4 py-2">&ge; 640px</td><td className="px-4 py-2 font-mono">20px</td></tr>
              <tr><td className="px-4 py-2">&ge; 1024px</td><td className="px-4 py-2 font-mono">24px</td></tr>
              <tr><td className="px-4 py-2">&ge; 1536px</td><td className="px-4 py-2 font-mono">32px</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
