import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/types";

/** A cart line is still a Product; selected variants are stored as one-item arrays. */
export type CartProduct = Product;
type CartInput = Partial<Product> & Pick<Product, "_id">;
type CartIdentity = Pick<Product, "_id"> &
  Partial<Pick<Product, "colors" | "size">>;

interface CartStore {
  stack: CartProduct[];
  clearCart: () => void;
  /** Adds a line only when the same product and selected variants are absent. */
  toggle: (product: CartInput) => void;
  /** Sets a line's quantity, creating the line when it does not exist. */
  update: (product: CartInput) => void;
  /** Adds quantity to a matching variant or creates a separate variant line. */
  addItem: (product: CartInput) => void;
  delete: (product: CartIdentity) => void;
  up: (product: CartIdentity) => void;
  down: (product: CartIdentity) => void;
  setColor: (product: CartIdentity, color: string) => void;
  setSize: (product: CartIdentity, size: string) => void;
}

function asOptions(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }
  return typeof value === "string" && value.trim() ? [value] : [];
}

function optionKey(value: unknown): string {
  return asOptions(value)[0]?.trim().toLocaleLowerCase() ?? "";
}

function hasVariant(value: CartIdentity): boolean {
  return Boolean(asOptions(value.colors).length || asOptions(value.size).length);
}

function matchesLine(item: CartProduct, product: CartIdentity): boolean {
  if (item._id !== product._id) return false;
  if (asOptions(product.colors).length && optionKey(item.colors) !== optionKey(product.colors)) {
    return false;
  }
  if (asOptions(product.size).length && optionKey(item.size) !== optionKey(product.size)) {
    return false;
  }
  return true;
}

function normalizeItem(product: CartInput, fallbackCount = 1): CartProduct {
  const count = Number(product.count ?? fallbackCount);
  const normalized = {
    ...product,
    colors: asOptions((product as { colors?: unknown }).colors).slice(0, 1),
    size: asOptions((product as { size?: unknown }).size).slice(0, 1),
    count: Number.isFinite(count) ? Math.max(1, Math.floor(count)) : 1,
    isChose: product.isChose ?? true,
  };
  return normalized as CartProduct;
}

export const useProduct = create<CartStore>()(
  persist(
    (set, get) => ({
      stack: [],

      toggle: (product) => {
        if (get().stack.some((item) => matchesLine(item, product))) return;
        set((state) => ({ stack: [...state.stack, normalizeItem(product)] }));
      },

      clearCart: () => set({ stack: [] }),

      update: (product) => {
        set((state) => {
          const index = state.stack.findIndex((item) => matchesLine(item, product));
          if (index === -1) {
            return { stack: [...state.stack, normalizeItem(product)] };
          }

          const existing = state.stack[index];
          const incoming = normalizeItem(product, existing.count);
          const stack = [...state.stack];
          stack[index] = {
            ...existing,
            ...incoming,
            count: Math.max(
              1,
              Math.floor(Number(product.count ?? existing.count) || 1),
            ),
          };
          return { stack };
        });
      },

      addItem: (product) => {
        set((state) => {
          const index = state.stack.findIndex((item) => matchesLine(item, product));
          if (index === -1) {
            return { stack: [...state.stack, normalizeItem(product)] };
          }

          const existing = state.stack[index];
          const incoming = normalizeItem(product);
          const requestedQuantity = Math.max(1, Number(incoming.count) || 1);
          const stack = [...state.stack];
          stack[index] = {
            ...existing,
            ...incoming,
            count: Math.max(1, Number(existing.count) || 1) + requestedQuantity,
            isChose: true,
          };
          return { stack };
        });
      },

      up: (product) => {
        set((state) => ({
          stack: state.stack.map((item) =>
            matchesLine(item, product)
              ? { ...item, count: Math.max(1, Number(item.count) || 1) + 1 }
              : item,
          ),
        }));
      },

      down: (product) => {
        set((state) => ({
          stack: state.stack.map((item) =>
            matchesLine(item, product)
              ? { ...item, count: Math.max(1, (Number(item.count) || 1) - 1) }
              : item,
          ),
        }));
      },

      delete: (product) =>
        set((state) => ({
          stack: state.stack.filter((item) => {
            if (item._id !== product._id) return true;
            if (!hasVariant(product)) return false;
            return !matchesLine(item, product);
          }),
        })),

      setColor: (product, color) =>
        set((state) => ({
          stack: state.stack.map((item) =>
            matchesLine(item, product)
              ? { ...item, colors: [color] }
              : item,
          ),
        })),

      setSize: (product, size) =>
        set((state) => ({
          stack: state.stack.map((item) =>
            matchesLine(item, product) ? { ...item, size: [size] } : item,
          ),
        })),
    }),
    {
      name: "product",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ stack: state.stack }) as CartStore,
      version: 2,
      migrate: (persistedState) => {
        const persisted = persistedState as { stack?: unknown } | undefined;
        return {
          stack: Array.isArray(persisted?.stack)
            ? persisted.stack.map((item) => normalizeItem(item as CartInput, 1))
            : [],
        } as CartStore;
      },
    },
  ),
);
