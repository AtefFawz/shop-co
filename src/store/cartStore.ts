import { create } from "zustand";
import { Product } from "@/types";
import { persist, createJSONStorage } from "zustand/middleware";
interface Products {
  stack: Product[];
  clearCart: () => void;
  toggle: (newState: any) => void;
  update: (newValue: any) => void;
  delete: (newValue: any) => void;
  up: (product: any) => void;
  down: (product: any) => void;
  setColor: (color: any, obg: any) => void;
  setSize: (color: any, size: any) => void;
}

export const useProduct = create<Products>()(
  persist(
    (set, get) => ({
      stack: [],
      toggle: (newState) => {
        const { stack } = get();
        const exist = stack.some((e) => e._id === newState._id);
        if (!exist) {
          set({ stack: [...stack, newState] });
        }
      },
      clearCart: () => set({ stack: [] }),
      // Up Counter
      up: (product: any) => {
        const { stack } = get();
        // بنشوف هو موجود ولا لأ
        const exist = stack.find((item) => item._id === product._id);
        if (exist) {
          // لو موجود زود العدد
          set({
            stack: stack.map((item) =>
              item._id === product._id
                ? { ...item, count: (item.count || 0) + 1 }
                : item,
            ),
          });
        } else {
          // 👇 لو مش موجود، ضيفه وابدأ العد بـ 1
          set({ stack: [...stack, { ...product, count: 2 }] });
        }
      },
      // Down Counter
      down: (product) => {
        set((state) => ({
          stack: state.stack.map((item) =>
            item._id === product._id
              ? { ...item, count: Math.max(1, (item.count || 1) - 1) }
              : item,
          ),
        }));
      },
      // Add Item To Card
      update: (newState) => {
        const { stack } = get();
        const exist = stack.some((e) => e._id === newState._id);
        if (!exist) {
          set({ stack: [...stack, newState] });
        }
      },

      // Delete Item From Card
      delete: (product) => {
        set((state) => ({
          stack: state.stack.filter((item) => item._id !== product._id),
        }));
      },
      setColor: (product, obg) => {
        // const { stack } = get();
        set((newState: any) => ({
          stack: newState.stack.map((item: any) =>
            item._id === product._id ? { ...item, colors: obg } : item,
          ),
        }));
      },
      setSize: (product, size) => {
        set((newState: any) => ({
          stack: newState.stack.map((item: any) =>
            item._id === product._id ? { ...item, size: size } : item,
          ),
        }));
      },
    }),
    { name: "product", storage: createJSONStorage(() => localStorage) },
  ),
);
