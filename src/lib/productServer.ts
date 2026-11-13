import type { Product } from "@/types";
import { cookies } from "next/headers";

/** Public (no auth) product fetch for server components, cached for 1 minute. */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://shop-co-jfqp.vercel.app"
).replace(/\/+$/, "");

export async function getProductServer(id: string): Promise<Product | null> {
  if (!API_BASE || !id) return null;
  try {
    const cookieStore = await cookies();
    const savedLocale = cookieStore.get("shopco-language")?.value;
    const locale = savedLocale === "en" ? "en" : "ar";
    const res = await fetch(`${API_BASE}/product/${encodeURIComponent(id)}`, {
      headers: { "X-Locale": locale },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const product = json?.data?.product ?? json?.product ?? json?.data ?? json;
    return product && typeof product === "object" && "name" in product
      ? (product as Product)
      : null;
  } catch {
    return null;
  }
}

/** Product ids for the sitemap. Never throws: the sitemap must always render. */
export async function getProductIdsServer(limit = 500): Promise<string[]> {
  if (!API_BASE || limit <= 0) return [];

  const pageSize = Math.min(60, Math.max(1, Math.floor(limit)));
  const readPage = async (page: number) => {
    const response = await fetch(
      `${API_BASE}/product?limit=${pageSize}&page=${page}&sort=newest`,
      { next: { revalidate: 3600 } },
    );
    if (!response.ok) return null;
    return response.json();
  };

  try {
    const firstPage = await readPage(1);
    const firstProducts = firstPage?.data?.Products ?? firstPage?.data?.products ?? [];
    if (!Array.isArray(firstProducts)) return [];

    const totalPages = Math.max(
      1,
      Math.min(
        Math.ceil(limit / pageSize),
        Number(firstPage?.pagination?.totalPages) || 1,
      ),
    );

    const remainingPages = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) => readPage(index + 2)),
    );
    const products = [
      ...firstProducts,
      ...remainingPages.flatMap((page) => {
        const pageProducts = page?.data?.Products ?? page?.data?.products ?? [];
        return Array.isArray(pageProducts) ? pageProducts : [];
      }),
    ];

    return products
      .slice(0, limit)
      .map((product: { _id?: string }) => product?._id)
      .filter((id: unknown): id is string => typeof id === "string");
  } catch {
    return [];
  }
}
