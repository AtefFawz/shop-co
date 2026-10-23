import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { calculateFinalPrice } from "@/lib/logicPricing";
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
  /** Toggles checkout inclusion for a single product variant. */
  toggleSelected: (product: CartIdentity) => void;
  /** Sets checkout inclusion for all cart lines. */
  selectAll: (selected: boolean) => void;
  /** Removes every line currently selected for checkout. */
  removeSelected: () => void;
  /** Sets checkout inclusion for one product variant. */
  setSelected: (product: CartIdentity, selected: boolean) => void;
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

function getStockLimit(product: Partial<Product>): number | null {
  const rawStock: unknown = product.countInStock;
  if (rawStock === null || rawStock === undefined || rawStock === "") return null;

  const stock = Number(rawStock);
  if (!Number.isFinite(stock) || stock < 0) return null;
  return Math.floor(stock);
}

export function isOutOfStock(product: Partial<Product>): boolean {
  return getStockLimit(product) === 0;
}

function normalizeQuantity(value: unknown, stockLimit: number | null): number {
  const parsed = Number(value);
  const quantity = Number.isFinite(parsed) ? Math.max(1, Math.floor(parsed)) : 1;

  // Keep existing out-of-stock lines visible, but never let their quantity grow.
  if (stockLimit === 0) return 1;
  if (stockLimit !== null) return Math.min(quantity, stockLimit);
  return quantity;
}

function normalizeItem(product: CartInput, fallbackCount = 1): CartProduct {
  const normalized = {
    ...product,
    colors: asOptions((product as { colors?: unknown }).colors).slice(0, 1),
    size: asOptions((product as { size?: unknown }).size).slice(0, 1),
    count: normalizeQuantity(product.count ?? fallbackCount, getStockLimit(product)),
    // Out-of-stock lines remain visible so the shopper can remove them, but
    // they must never be included in a checkout total.
    isChose: getStockLimit(product) === 0 ? false : product.isChose ?? true,
  };
  return normalized as CartProduct;
}

export interface CartSummary {
  lineCount: number;
  quantityCount: number;
  selectedLineCount: number;
  selectedQuantity: number;
  subtotal: number;
  discountTotal: number;
  total: number;
  selectedSubtotal: number;
  selectedDiscountTotal: number;
  selectedTotal: number;
  outOfStockCount: number;
}

/** Pure cart calculations shared by UI and tests; no component-specific state. */
export function summarizeCart(items: readonly CartProduct[]): CartSummary {
  return items.reduce<CartSummary>((summary, item) => {
    const quantity = normalizeQuantity(item.count, getStockLimit(item));
    const price = Math.max(0, Number(item.price) || 0);
    const discount = Math.min(100, Math.max(0, Number(item.discount) || 0));
    const subtotal = price * quantity;
    const total = calculateFinalPrice(price, discount, quantity);
    const stockLimit = getStockLimit(item);
    const selected = item.isChose !== false && stockLimit !== 0;

    summary.lineCount += 1;
    summary.quantityCount += quantity;
    summary.subtotal += subtotal;
    summary.discountTotal += subtotal - total;
    summary.total += total;
    if (selected) {
      summary.selectedLineCount += 1;
      summary.selectedQuantity += quantity;
      summary.selectedSubtotal += subtotal;
      summary.selectedDiscountTotal += subtotal - total;
      summary.selectedTotal += total;
    }
    if (stockLimit !== null && stockLimit < 1) summary.outOfStockCount += 1;
    return summary;
  }, {
    lineCount: 0, quantityCount: 0, selectedLineCount: 0, selectedQuantity: 0,
    subtotal: 0, discountTotal: 0, total: 0, selectedSubtotal: 0,
    selectedDiscountTotal: 0, selectedTotal: 0, outOfStockCount: 0,
  });
}

export const useProduct = create<CartStore>()(
  persist(
    (set) => ({
      stack: [],

      toggle: (product) => {
        if (getStockLimit(product) === 0) return;
        set((state) => {
          if (state.stack.some((item) => matchesLine(item, product))) return state;
          return { stack: [...state.stack, normalizeItem(product)] };
        });
      },

      clearCart: () => set({ stack: [] }),

      update: (product) => {
        set((state) => {
          const index = state.stack.findIndex((item) => matchesLine(item, product));
          if (index === -1) {
            if (getStockLimit(product) === 0) return state;
            return { stack: [...state.stack, normalizeItem(product)] };
          }

          const existing = state.stack[index];
          const incoming = normalizeItem(product, existing.count);
          const stack = [...state.stack];
          stack[index] = {
            ...existing,
            ...incoming,
            count: normalizeQuantity(
              product.count ?? existing.count,
              getStockLimit(incoming) ?? getStockLimit(existing),
            ),
          };
          return { stack };
        });
      },

      addItem: (product) => {
        if (getStockLimit(product) === 0) return;
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
            count: normalizeQuantity(
              Math.max(1, Number(existing.count) || 1) + requestedQuantity,
              getStockLimit(incoming) ?? getStockLimit(existing),
            ),
            isChose: true,
          };
          return { stack };
        });
      },

      up: (product) => {
        set((state) => ({
          stack: state.stack.map((item) =>
            matchesLine(item, product)
              ? {
                  ...item,
                  count: normalizeQuantity(
                    Math.max(1, Number(item.count) || 1) + 1,
                    getStockLimit(item),
                  ),
                }
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

      toggleSelected: (product) =>
        set((state) => ({
          stack: state.stack.map((item) => {
            if (!matchesLine(item, product)) return item;
            if (getStockLimit(item) === 0) return { ...item, isChose: false };
            return { ...item, isChose: item.isChose === false };
          }),
        })),

      setSelected: (product, selected) =>
        set((state) => ({
          stack: state.stack.map((item) =>
            matchesLine(item, product)
              ? { ...item, isChose: selected && getStockLimit(item) !== 0 }
              : item,
          ),
        })),

      selectAll: (selected) =>
        set((state) => ({
          stack: state.stack.map((item) => ({
            ...item,
            isChose: selected && getStockLimit(item) !== 0,
          })),
        })),

      removeSelected: () =>
        set((state) => ({
          stack: state.stack.filter((item) => item.isChose === false),
        })),
    }),
    {
      name: "product",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ stack: state.stack }) as CartStore,
      version: 3,
      migrate: (persistedState) => {
        const persisted = persistedState as { stack?: unknown } | undefined;
        return {
          stack: Array.isArray(persisted?.stack)
            ? persisted.stack
                .filter(
                  (item): item is CartInput =>
                    typeof item === "object" &&
                    item !== null &&
                    typeof (item as { _id?: unknown })._id === "string",
                )
                .map((item) => normalizeItem(item, 1))
            : [],
        } as CartStore;
      },
    },
  ),
);

/** Preferred semantic name for new feature code; useProduct remains for legacy imports. */
export const useCartStore = useProduct;
