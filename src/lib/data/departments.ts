/**
 * Departments taxonomy for the storefront navigation.
 *
 * CLIENT-SAFE: this module deliberately does NOT import the product seed, so it
 * can be used by the site-wide navbar without dragging ~36 products into the
 * main bundle. Counts are attached by the caller — see `withCounts`, which the
 * root layout runs on the server and passes down as plain serialised props.
 *
 * ITEM COUNTS ARE COMPUTED, NEVER AUTHORED. The spec proposed literal counts
 * ("142 products"); the catalogue currently holds 36 products across 7
 * departments, and a shopper who clicks "142" and finds eight guitars loses
 * trust faster than a smaller honest number costs us. The same rule applies
 * below the department level.
 */

export type DepartmentIconName =
  | "Guitar"
  | "Piano"
  | "Drum"
  | "Speaker"
  | "Mic"
  | "Music2"
  | "Cable";

/** A sub-category is a tag facet of its parent, not a separate DB row. */
export interface SubCategoryDef {
  name: string;
  slug: string;
  /** A product matches when it carries ANY of these tags. */
  tags: string[];
}

export interface DepartmentDef {
  name: string;
  slug: string;
  icon: DepartmentIconName;
  blurb: string;
  subCategories: SubCategoryDef[];
}

export interface SubCategory extends SubCategoryDef {
  itemCount: number;
}

export interface Department extends Omit<DepartmentDef, "subCategories"> {
  itemCount: number;
  subCategories: SubCategory[];
}

/**
 * Sub-categories are derived from the `tags` already present on each product,
 * so every link in the mega menu resolves to real inventory. Where the spec
 * suggested a sub-category with no matching stock (e.g. "Guitar Amps"), it is
 * omitted here rather than shipped as a dead end — amps live under PA & Sound.
 */
export const departments: DepartmentDef[] = [
  {
    name: "Guitars",
    slug: "guitars",
    icon: "Guitar",
    blurb: "Acoustic, electric, classical and bass",
    subCategories: [
      { name: "Acoustic Guitars", slug: "acoustic", tags: ["acoustic", "dreadnought"] },
      { name: "Electric Guitars", slug: "electric", tags: ["electric", "stratocaster", "telecaster", "les-paul", "humbucker"] },
      { name: "Classical Guitars", slug: "classical", tags: ["classical", "nylon-string"] },
      { name: "Bass Guitars", slug: "bass", tags: ["bass", "4-string"] },
    ],
  },
  {
    name: "Keyboards & Pianos",
    slug: "keyboards",
    icon: "Piano",
    blurb: "Digital pianos, synths and controllers",
    subCategories: [
      { name: "Digital Pianos", slug: "digital-pianos", tags: ["digital-piano", "piano", "weighted", "88-key"] },
      { name: "Stage & Studio", slug: "stage-keyboards", tags: ["stage", "production", "professional"] },
      { name: "Synthesizers", slug: "synthesizers", tags: ["synth"] },
      { name: "MIDI Controllers", slug: "midi-controllers", tags: ["midi", "controller"] },
      { name: "Portable Keyboards", slug: "portable", tags: ["portable", "compact", "keyboard"] },
      { name: "Organs", slug: "organs", tags: ["organ"] },
    ],
  },
  {
    name: "Drums & Percussion",
    slug: "drums-percussion",
    icon: "Drum",
    blurb: "Kits, electronic drums and cymbals",
    subCategories: [
      { name: "Acoustic Drum Kits", slug: "acoustic-kits", tags: ["drum-kit", "acoustic", "5-piece", "set"] },
      { name: "Electronic Drum Kits", slug: "electronic-kits", tags: ["electronic", "mesh-head"] },
      { name: "Cymbals", slug: "cymbals", tags: ["cymbals"] },
      { name: "Snares & Percussion", slug: "snares", tags: ["snare"] },
      { name: "Sticks & Heads", slug: "sticks-heads", tags: ["drumsticks", "hickory", "5a", "coated", "drum-head"] },
    ],
  },
  {
    name: "PA & Live Sound",
    slug: "pa-sound",
    icon: "Speaker",
    blurb: "Speakers, mixers and microphones",
    subCategories: [
      { name: "Powered Speakers", slug: "speakers", tags: ["powered-speaker", "pa", "15-inch", "portable-pa", "live"] },
      { name: "Mixers", slug: "mixers", tags: ["mixer", "analog"] },
      { name: "Microphones", slug: "microphones", tags: ["microphone", "dynamic", "wireless", "vocal"] },
      { name: "Church & Venue Systems", slug: "venue-systems", tags: ["church", "small-venue"] },
    ],
  },
  {
    name: "Studio & Recording",
    slug: "studio",
    icon: "Mic",
    blurb: "Interfaces, monitors and mics",
    subCategories: [
      { name: "Audio Interfaces", slug: "audio-interfaces", tags: ["audio-interface", "usb", "32-bit-float"] },
      { name: "Studio Monitors", slug: "monitors", tags: ["studio-monitor", "5-inch"] },
      { name: "Recording Microphones", slug: "recording-mics", tags: ["condenser", "recording"] },
    ],
  },
  {
    name: "Traditional Ghanaian",
    slug: "traditional-ghanaian",
    icon: "Music2",
    blurb: "Djembe, kora, talking drum & more",
    subCategories: [
      { name: "Djembes & Hand Drums", slug: "djembe", tags: ["djembe", "handmade"] },
      { name: "Kora", slug: "kora", tags: ["kora", "21-string", "harp-lute", "griot", "mali"] },
      { name: "Talking Drums", slug: "talking-drums", tags: ["talking-drum", "donno"] },
      { name: "Flutes & Winds", slug: "flutes", tags: ["flute", "atenteben", "bamboo"] },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    icon: "Cable",
    blurb: "Cables, stands, strings and cases",
    subCategories: [
      { name: "Cases & Gig Bags", slug: "cases", tags: ["case", "hardshell"] },
      { name: "Cables", slug: "cables", tags: ["cable", "xlr", "multi"] },
      { name: "Stands", slug: "stands", tags: ["stand"] },
      { name: "Strings", slug: "strings", tags: ["strings", "nickel"] },
    ],
  },
];

export function matchesSubCategory(
  product: { tags: string[] },
  def: SubCategoryDef
): boolean {
  return def.tags.some((tag) => product.tags.includes(tag));
}

/**
 * Attach live counts to the taxonomy. Sub-categories that match nothing are
 * dropped, so the navigation can never offer an empty result page, and an empty
 * department is removed entirely.
 *
 * `products` is passed in rather than imported to keep this module client-safe.
 */
export function withCounts(
  defs: DepartmentDef[],
  products: { categorySlug: string; tags: string[] }[]
): Department[] {
  return defs.flatMap((def) => {
    const inDept = products.filter((p) => p.categorySlug === def.slug);
    if (inDept.length === 0) return [];

    const subCategories = def.subCategories
      .map((sub) => ({
        ...sub,
        itemCount: inDept.filter((p) => matchesSubCategory(p, sub)).length,
      }))
      .filter((sub) => sub.itemCount > 0);

    return [{ ...def, subCategories, itemCount: inDept.length }];
  });
}

/**
 * Resolve a `?sub=` value to its definition within a department.
 * Exported for the shop filter, which runs client-side on serialised data.
 */
export function findSubCategory(
  dept: Department | DepartmentDef | undefined,
  slug: string | null
): SubCategoryDef | null {
  if (!dept || !slug) return null;
  return dept.subCategories.find((s) => s.slug === slug) ?? null;
}

/** Canonical link for a sub-category, kept in one place for menu + breadcrumb. */
export function subCategoryHref(deptSlug: string, subSlug: string): string {
  return `/shop/${deptSlug}?sub=${subSlug}`;
}
