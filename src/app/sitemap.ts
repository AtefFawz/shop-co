import type { MetadataRoute } from "next";
import { getProductIdsServer, SITE_URL } from "@/lib/productServer";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticRoutes = ["", "/shop"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const ids = await getProductIdsServer();
  return [
    ...staticRoutes,
    ...ids.map((id) => ({
      url: `${SITE_URL}/shop/details/${id}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
