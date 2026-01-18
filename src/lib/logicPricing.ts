export const calculateFinalPrice = (
  price: number,
  discount?: number,
  count?: number,
) => {
  const qty = count ?? 1;

  if (discount) {
    const final = price - price * (discount / 100);

    return Math.round(final * qty);
  }

  return price * qty;
};
