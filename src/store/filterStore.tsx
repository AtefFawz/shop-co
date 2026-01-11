import { create } from "zustand";
import { Product } from "@/types";
import { products as allProducts } from "@/data/data"; // الداتا الأصلية

interface FilterStore {
  products: Product[];
  currentType: string | null; // 👈 دي الذاكرة الجديدة (male, female, etc)

  filterByType: (type: string) => void; // دي اللي بتتنادى من صفحة Category
  filterBySection: (section: string) => void; // دي اللي بتتنادى من الـ Sidebar
  resetFilter: () => void;
  filterPrice: (maxPrice: number) => void;
  // sec: string | null;
}

export const useFilterStore = create<FilterStore>()((set, get) => ({
  products: allProducts,
  currentType: null, // في البداية مفيش نوع محدد
  // sec: null,
  // 1. لما يدوس على كارت في صفحة Category (Men, Women)
  filterByType: (type) => {
    set({
      currentType: type, // ✅ احفظ النوع في الذاكرة
      products: allProducts.filter((item) => item.type === type), // فلتر المنتجات عليه
    });
  },

  // 2. لما يختار من السايد بار (T-shirt, Jeans)
  filterBySection: (section) => {
    // هات الذاكرة الحالية
    const { currentType } = get();

    // ابدأ الفلترة من الداتا الأصلية
    let filtered = allProducts;

    // خطوة 1: لو فيه نوع محفوظ (مثلاً رجالي)، طبق الفلتر بتاعه الأول
    if (currentType) {
      filtered = filtered.filter((item) => item.type === currentType);
    }

    // خطوة 2: طبق فلتر القسم (التيشرتات)
    filtered = filtered.filter((item) => item.section === section);

    // حدث النتيجة
    set({ products: filtered });
  },

  // 3. فلتر السعر (لازم يحترم الفلاتر السابقة برضه)
  filterPrice: (maxPrice) => {
    const { currentType } = get();
    let filtered = allProducts;
    if (currentType) {
      filtered = filtered.filter((item) => item.type === currentType);
    }

    // هنا ممكن تحتاج تحتفظ بـ currentSection كمان لو عايز دقة 100%
    // بس مبدئياً ده هيجيبلك الحاجات اللي في سعرك تبع النوع المختار
    filtered = filtered.filter((item) => item.price <= maxPrice);

    set({ products: filtered });
  },

  resetFilter: () => {
    set({ products: allProducts, currentType: null }); // فضي الذاكرة ورجع كل حاجة
  },
}));
