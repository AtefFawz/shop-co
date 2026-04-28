"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <div className="min-h-[70vh] mt-20 flex flex-col items-center justify-center text-center px-4">
      <div className="text-green-500 w-20 h-20 mb-6 animate-bounce flex items-center justify-center text-7xl ">
        ✓
      </div>
      <h1 className="lg:text-4xl text-2xl font-black mb-4">
        YOUR ORDER IS CONFIRMED!
      </h1>
      <p className="text-gray-600 mb-2">
        Thanks for shopping! Your order hasn't shipped yet, but we'll send you
        an email when it does.
      </p>

      {orderId && (
        <div className="bg-gray-100 p-3 rounded-lg border border-dashed border-gray-400 my-6">
          <span className="text-sm text-gray-500">Order Number: </span>
          <span className="font-bold">#{orderId}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href="/"
          className="bg-black text-white xl:px-8 xl:py-4 px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-all"
        >
          Continue Shopping
        </Link>
        <Link
          href="/my-orders"
          className="border border-gray-200 xl:px-8 xl:py-4 px-4 py-2 rounded-full font-medium hover:bg-gray-50 transition-all"
        >
          Track Order
        </Link>
      </div>
    </div>
  );
}
