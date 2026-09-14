"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, XCircle } from "lucide-react";
import api from "@/lib/api";
import OrderHeader from "@/components/orders/OrderHeader";
import OrderStatusTracker from "@/components/orders/OrderStatusTracker";
import OrderItems from "@/components/orders/OrderItems";
import ShippingInformation from "@/components/orders/ShippingInformation";
import OrderDetailsSkeleton from "@/components/orders/OrderDetailsSkeleton";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

type Order = {
  _id: string;
  status: OrderStatus;
  totalPrice: number;
  createdAt: string;

  orderItems: {
    _id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];

  shippingAddress: {
    address: string;
    city: string;
    phone: string;
  };
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getOrder = async () => {
      try {
        setLoading(true);

        const res = await api.get(`/order/${orderId}`);

        setOrder(res.data.data.order);
      } catch (error) {
        console.log(error);
        setError("Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      getOrder();
    }
  }, [orderId]);

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (error || !order) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-5">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle className="text-red-500" size={30} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900">
            Order not found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            {error || "We couldn't find this order."}
          </p>

          <button
            onClick={() => router.back()}
            className="mt-6 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </main>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="Responsive">
        <button
          onClick={() => router.back()}
          className="mb-5 flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-black"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <OrderHeader order={order} />

        <div className="mb-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900">Order Status</h2>

            <p className="mt-1 text-xs text-gray-400">
              Track the progress of your order
            </p>
          </div>

          <OrderStatusTracker status={order.status} />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <OrderItems items={order.orderItems} totalPrice={order.totalPrice} />

          <ShippingInformation shippingAddress={order.shippingAddress} />
        </div>
      </div>
    </section>
  );
}
