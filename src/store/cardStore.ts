import { create } from "zustand";
import { Product } from "@/types";

interface Products {
  stack: Product[];
  toggle: (newState: Product) => void;
  update: (newValue: Product) => void;
  up: (product: Product) => void;
  down: (product: Product) => void;
}

export const useProduct = create<Products>()((set, get) => ({
  stack: [],
  toggle: (newState) => {
    const { stack } = get();
    const exist = stack.some((e) => e.id === newState.id);
    if (!exist) {
      set({ stack: [...stack, newState] });
    }
  },
  up: (product: Product) => {
    const { stack } = get();
    // بنشوف هو موجود ولا لأ
    const exist = stack.find((item) => item.id === product.id);
    if (exist) {
      // لو موجود زود العدد
      set({
        stack: stack.map((item) =>
          item.id === product.id
            ? { ...item, count: (item.count || 0) + 1 }
            : item,
        ),
      });
    } else {
      // 👇 لو مش موجود، ضيفه وابدأ العد بـ 1
      set({ stack: [...stack, { ...product, count: 1 }] });
    }
  },
  down: (product: Product) => {
    const { stack } = get();
    set({
      stack: stack.map((item) =>
        item.id === product.id && item.count > 0
          ? { ...item, count: item.count - 1 }
          : item,
      ),
    });
  },
  update: (newValue) => {
    const { stack } = get();
    set({
      stack: stack.map((item) =>
        item.id === newValue.id ? { ...item, isChose: true } : item,
      ),
    });
  },
}));
