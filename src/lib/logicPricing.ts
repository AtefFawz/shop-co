export const calculateFinalPrice = (
  price: number,
  discount?: number,
  count?: number,
) => {
  if (discount) {
    const final = price - price * (discount / 100);
    return Math.round(final);
  }
  return price * (count ?? 1);
};
