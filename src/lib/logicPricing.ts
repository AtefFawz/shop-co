const calculateFinalPrice = (
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

const calculateTotalPrice = (items: any[]) => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.count,
    0,
  );
  const deliveryFee = 15;
  return subtotal + deliveryFee;
};

export { calculateTotalPrice, calculateFinalPrice };
