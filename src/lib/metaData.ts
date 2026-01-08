// دالة مساعدة لجلب معالج واحد فقط بناءً على الـ ID
// (Clean Code: Don't Repeat Yourself)
import { data } from "./api";
import { Product } from "@/types";
export async function getProductById(id: number): Promise<Product | undefined> {
  return data.find((t) => t.id === id);
}
