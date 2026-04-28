"use client";
import { useProduct } from "@/store/cardStore";
import { calculateFinalPrice } from "@/lib/logicPricing";
import api from "@/lib/api";
import { ShippingForm } from "@/components/features/checkout/ShippingForm"; //
import { OrderSummary } from "@/components/features/checkout/OrderSummary"; //
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { stack, clearCart } = useProduct();
  const cartItems = stack.filter((item: any) => item.isChose);

  const handlePlaceOrder = async (shippingData: any) => {
    setLoading(true);
    interface Typing {
      name: string;
      count: number;
      photo: string;
      price: number;
      _id: string;
    }
    const subtotal = cartItems.reduce(
      (acc, item) =>
        acc + calculateFinalPrice(item.price, item.discount, item.count),
      0,
    );

    try {
      const payload = {
        orderItems: cartItems.map((item: Typing) => ({
          name: item.name,
          quantity: item.count,
          image: item.photo,
          price: item.price,
          product: item._id,
        })),

        shippingAddress: shippingData,
        totalPrice: subtotal,
      };

      await api.post("order", payload);

      clearCart(); // فضي السلة
      router.push("/order-success");
    } catch (err) {
      alert("Order failed, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-10">Checkout</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ShippingForm onSubmit={handlePlaceOrder} />
        <OrderSummary items={cartItems} />
      </div>
    </div>
  );
}
