// ─────────────────────────────────────────────────────────────────────────────
// PLACEHOLDER PRODUCT IMAGERY
// Temporary stock photos (Unsplash) used until real product photography is
// available. Replace the URLs below — or switch to DB-backed `products.images`
// — and every surface (home, shop, product detail) updates from this one file.
// ─────────────────────────────────────────────────────────────────────────────

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&h=800&q=70`;

/** Wide/atmospheric crop for banners and the homepage hero. */
const unsplashWide = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&h=1300&q=75`;

// ── Homepage hero (replace with a branded lifestyle shot later) ──
export const heroImage = unsplashWide("photo-1563358112-2da834bc0037"); // wall of hanged guitars

// A handful of distinct, category-appropriate stock shots.
const ELECTRIC_GUITAR = unsplash("photo-1564186763535-ebb21ef5277f");
const ACOUSTIC_GUITAR = unsplash("photo-1510915361894-db8b60106cb1");
const BASS = unsplash("photo-1543060749-aa3f115aad09");
const AMP = unsplash("photo-1778607237788-802e0ccc129c");
const DRUMS = unsplash("photo-1519892300165-cb5542fb47c7");
const CYMBALS = unsplash("photo-1625801821669-d11f0ede90cd");
const PIANO = unsplash("photo-1632008341003-5c6767c7d237");
const VOCAL_MIC = unsplash("photo-1585347110520-7a8a5c77af09");
const STUDIO_MIC = unsplash("photo-1660631228116-b3643559f611");
const RECORDING = unsplash("photo-1531651008558-ed1740375b39");

/** Product slug → primary image URL. */
export const productImages: Record<string, string> = {
  // Guitars
  "fender-player-stratocaster": ELECTRIC_GUITAR,
  "fender-acoustic-fa-115": ACOUSTIC_GUITAR,
  "gibson-les-paul-standard": ELECTRIC_GUITAR,
  "yamaha-c40-classical": ACOUSTIC_GUITAR,
  "yamaha-fg800-acoustic": ACOUSTIC_GUITAR,
  "gibson-sg-standard": ELECTRIC_GUITAR,

  // Basses
  "fender-player-jazz-bass": BASS,
  "yamaha-trbx304": BASS,
  "fender-player-precision-bass": BASS,
  "yamaha-trbx174": BASS,

  // Amps & Effects
  "marshall-dsl20cr": AMP,
  "fender-blues-junior": AMP,
  "yamaha-thr10ii": AMP,
  "marshall-guvs2": AMP,
  "roland-cube-20": AMP,

  // Drums
  "yamaha-stage-custom": DRUMS,
  "zildjian-a-custom-cymbal-set": CYMBALS,
  "roland-td-17kv": DRUMS,
  "yamaha-ryde-tompad": DRUMS,
  "zildjian-l80-low-volume": CYMBALS,

  // Keyboards
  "yamaha-p-125": PIANO,
  "roland-fp-30x": PIANO,
  "akai-mpk-mini-mk3": PIANO,
  "yamaha-psr-e373": PIANO,
  "roland-juno-ds61": PIANO,

  // Live Sound
  "shure-sm58": VOCAL_MIC,
  "shure-sm57": VOCAL_MIC,
  "yamaha-stagepas-400i": AMP,
  "roland-cube-street-ex": AMP,
  "shure-svx88": VOCAL_MIC,

  // Recording
  "roland-rubix22": RECORDING,
  "yamaha-hs5-monitor": RECORDING,
  "shure-sm7b": STUDIO_MIC,
  "akai-force": RECORDING,
  "yamaha-ag03-mk2": RECORDING,
  "roland-quad-capture": RECORDING,
};

/** Look up a product's placeholder image by slug (undefined if none). */
export function productImage(slug: string): string | undefined {
  return productImages[slug];
}
