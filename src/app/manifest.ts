import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nobleman Musical Center",
    short_name: "Nobleman",
    description: "Premium musical instruments in Accra, Ghana",
    start_url: "/",
    display: "standalone",
    background_color: "#F5F0E6",
    theme_color: "#0B1B3B",
    icons: [
      {
        src: "/brand/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/brand/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
