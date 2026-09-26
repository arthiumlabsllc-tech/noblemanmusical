import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nobleman Musical Center",
    short_name: "Nobleman",
    description:
      "Ghana's premier destination for premium musical instruments. Where Music Meets Majesty.",
    start_url: "/",
    display: "standalone",
    background_color: "#060F24",
    theme_color: "#060F24",
    orientation: "portrait-primary",
    lang: "en-GH",
    categories: ["music", "shopping"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      {
        src: "/icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Shop",
        short_name: "Shop",
        url: "/shop",
        description: "Browse all instruments",
      },
      {
        name: "Track Order",
        short_name: "Track",
        url: "/track",
        description: "Track your order status",
      },
      {
        name: "Contact Us",
        short_name: "Contact",
        url: "/contact",
        description: "Get in touch",
      },
    ],
    share_target: {
      action: "/search",
      method: "GET",
      params: { title: "q", text: "q", url: "q" },
    },
  };
}
