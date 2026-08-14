"use client";

import { Package } from "lucide-react";

type OrderItem = {
  _id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
};

export default function OrderItems({
  items,
  totalPrice,
}: {
  items: OrderItem[];
  totalPrice: number;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Order Items</h2>

          <p className="mt-1 text-xs text-gray-400">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>

        <Package className="text-gray-300" size={20} />
      </div>

      <div className="divide-y divide-gray-100">
        {items.map((item) => (
          <div key={item._id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-24 sm:w-24">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <h3 className="truncate text-sm font-bold text-gray-900">
                  {item.name}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="mt-2 text-sm font-bold text-gray-900">
                {item.price.toLocaleString()} EGP
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-xl bg-gray-50 px-4 py-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-500">
            Total Amount
          </span>

          <span className="text-xl font-black text-gray-900">
            {totalPrice.toLocaleString()}{" "}
            <span className="text-xs font-semibold">EGP</span>
          </span>
        </div>
      </div>
    </div>
  );
}
