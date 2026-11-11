export default function manifest() {
  return {
    id: "/",
    name: "SHOP.CO — Contemporary Fashion",
    short_name: "SHOP.CO",
    description: "Discover curated fashion and shop your style with SHOP.CO.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["standalone", "minimal-ui"],
    orientation: "portrait-primary",
    background_color: "#111827",
    theme_color: "#111827",
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
  };
}
