"use client";

import { Check, CheckCircle2, Package, Truck, XCircle } from "lucide-react";

type OrderStatus = "Pending" | "Shipped" | "Delivered" | "Cancelled";

export default function OrderStatusTracker({
  status,
}: {
  status: OrderStatus;
}) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-4 rounded-2xl bg-red-50 p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
          <XCircle size={23} />
        </div>

        <div>
          <p className="font-bold text-red-700">Order Cancelled</p>

          <p className="mt-1 text-sm text-red-600">
            This order has been cancelled.
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    {
      key: "Pending" as OrderStatus,
      label: "Pending",
      icon: <Package size={18} />,
    },
    {
      key: "Shipped" as OrderStatus,
      label: "Shipped",
      icon: <Truck size={18} />,
    },
    {
      key: "Delivered" as OrderStatus,
      label: "Delivered",
      icon: <CheckCircle2 size={18} />,
    },
  ];

  const currentIndex = steps.findIndex((step) => step.key === status);

  return (
    <div>
      <div className="relative">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-5 hidden h-0.5 bg-gray-200 sm:block" />

        {/* Progress line */}
        <div
          className="absolute left-0 top-5 hidden h-0.5 bg-black transition-all sm:block"
          style={{
            width:
              currentIndex === 0
                ? "0%"
                : `${(currentIndex / (steps.length - 1)) * 100}%`,
          }}
        />

        <div className="relative grid gap-5 sm:grid-cols-3 sm:gap-0">
          {steps.map((step, index) => {
            const completed = index <= currentIndex;
            const current = index === currentIndex;

            return (
              <div
                key={step.key}
                className="flex items-center gap-4 sm:flex-col sm:gap-3"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition ${
                    completed
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-400"
                  }`}
                >
                  {completed ? <Check size={18} /> : step.icon}
                </div>

                <div className="sm:text-center">
                  <p
                    className={`text-sm font-bold ${
                      current ? "text-gray-900" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>

                  {current && (
                    <p className="mt-1 text-xs text-gray-400">Current status</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
