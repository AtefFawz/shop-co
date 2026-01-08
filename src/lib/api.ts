import { Product } from "../types/index";
export const data = await fetchProducts();
export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch("http://localhost:3000/api/products");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}
