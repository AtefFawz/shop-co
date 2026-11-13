import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "SHOP.CO — Contemporary Fashion",
    short_name: "SHOP.CO",
    description: "Discover curated fashion and shop your style with SHOP.CO.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "any",
    background_color: "#0b1020",
    theme_color: "#0b1020",
    lang: "ar",
    dir: "auto",
    categories: ["shopping", "lifestyle"],
    prefer_related_applications: false,
    icons: [
      {
        src: "/icons/shopco-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/shopco-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/shopco-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Shop new arrivals",
        short_name: "New arrivals",
        url: "/shop",
        icons: [{ src: "/icons/shopco-192.png", sizes: "192x192" }],
      },
      {
        name: "My orders",
        short_name: "Orders",
        url: "/my-orders",
        icons: [{ src: "/icons/shopco-192.png", sizes: "192x192" }],
      },
    ],
  };
}
