/** Typed contract shared between checkout form state and order submission. */
export type PaymentMethod = "cod" | "card";

export interface CheckoutShippingData {
  address: string;
  city: string;
  phone: string;
  paymentMethod: PaymentMethod;
}
