import api from "@/lib/api";
import type { Product } from "@/types";

export type Engagement = { _id: string; type: "saved" | "recent" | "price-alert"; targetPrice?: number; triggeredAt?: string | null; lastViewedAt?: string; product: Product };

export async function fetchEngagements(type: Engagement["type"]) {
  const response = await api.get(`/features/me?type=${encodeURIComponent(type)}`);
  return (response.data?.data?.items || []) as Engagement[];
}
export async function saveForLater(productId: string) { return api.post(`/features/saved/${productId}`); }
export async function removeSaved(productId: string) { return api.delete(`/features/saved/${productId}`); }
export async function recordView(productId: string) { return api.post(`/features/recent/${productId}`); }
export async function setPriceAlert(productId: string, targetPrice: number) { return api.post(`/features/price-alerts/${productId}`, { targetPrice }); }
export async function removePriceAlert(productId: string) { return api.delete(`/features/price-alerts/${productId}`); }
export async function fetchRecommendations() {
  const response = await api.get("/features/recommendations");
  return (response.data?.data?.products || []) as Product[];
}
