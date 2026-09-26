export interface HeroSlide {
  id: string;
  tag: string;
  imageSrc: string;
  imageAlt: string;
  focalPoint: "center" | "top" | "bottom" | string;
  overlayOpacity?: number;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "guitars",
    tag: "Acoustic Guitars",
    imageSrc:
      "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=85&w=2400&auto=format&fit=crop",
    imageAlt: "Handcrafted acoustic guitar in warm golden light",
    focalPoint: "center",
  },
  {
    id: "keyboards",
    tag: "Pianos & Keyboards",
    imageSrc:
      "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?q=85&w=2400&auto=format&fit=crop",
    imageAlt: "Grand piano keys in golden light",
    focalPoint: "center",
  },
  {
    id: "traditional",
    tag: "Traditional Ghanaian",
    imageSrc:
      "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=85&w=2400&auto=format&fit=crop",
    imageAlt: "Handmade Ghanaian djembe drum with kente rope",
    focalPoint: "center",
  },
  {
    id: "studio",
    tag: "Studio & Broadcast",
    imageSrc:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=85&w=2400&auto=format&fit=crop",
    imageAlt: "Professional studio mixing console",
    focalPoint: "center",
  },
  {
    id: "live",
    tag: "Live Sound & PA",
    imageSrc:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=85&w=2400&auto=format&fit=crop",
    imageAlt: "Concert stage with PA system in golden light",
    focalPoint: "center",
  },
];
