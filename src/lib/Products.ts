import { serverApi } from "./serverApi";

type ProductListParams = Record<string, string | number | boolean | null | undefined>;

const products = async (URL: string, page = 1, limit = 10, filters: ProductListParams = {}) => {
  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  });
  return serverApi(`${URL}?${query.toString()}`);
};

export { products };
