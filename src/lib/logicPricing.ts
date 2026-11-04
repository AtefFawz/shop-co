const calculateFinalPrice = (
  price: number,
  discount?: number,
  count?: number,
  isSale = false,
) => {
  const qty = Math.max(1, Math.floor(Number(count ?? 1) || 1));
  const baseCents = Math.max(0, Math.round((Number(price) || 0) * 100));
  const normalizedDiscount = isSale
    ? Math.min(100, Math.max(0, Number(discount) || 0))
    : 0;
  const unitCents = Math.round(baseCents * (1 - normalizedDiscount / 100));
  return (unitCents * qty) / 100;
};

/** Single source of truth for shipping rules (previously duplicated). */
const FREE_SHIPPING_THRESHOLD = 200;
const STANDARD_DELIVERY_FEE = 15;

const calculateDeliveryFee = (discountedSubtotal: number) =>
  discountedSubtotal <= 0 || discountedSubtotal >= FREE_SHIPPING_THRESHOLD
    ? 0
    : STANDARD_DELIVERY_FEE;

interface PricedItem {
  price: number;
  count: number;
  discount?: number;
  isSale?: boolean;
}

/** Discount-aware total including delivery. */
const calculateTotalPrice = (items: PricedItem[]) => {
  const subtotal = items.reduce(
    (acc, item) => acc + calculateFinalPrice(item.price, item.discount, item.count, item.isSale ?? false),
    0,
  );
  return subtotal + calculateDeliveryFee(subtotal);
};

export {
  calculateTotalPrice,
  calculateFinalPrice,
  calculateDeliveryFee,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_DELIVERY_FEE,
};
