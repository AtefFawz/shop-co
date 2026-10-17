"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Sparkles, Check, Lock } from "lucide-react";
import toast from "react-hot-toast";

import { useProduct } from "@/store/cardStore";
import { calculateFinalPrice } from "@/lib/logicPricing";
import api from "@/lib/api";
import { ShippingForm } from "@/components/features/checkout/ShippingForm";
import { OrderSummary } from "@/components/features/checkout/OrderSummary";
import { EmptyCart } from "@/components/features/home/payCar/EmptyCart";

interface Typing {
  name: string;
  count: number;
  photo: string;
  images?: string[];
  price: number;
  discount?: string | number;
  _id: string;
}

const FREE_SHIPPING_THRESHOLD = 200;

export default function Checkout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { stack, clearCart } = useProduct();

  // Fallback to all stack items if isChose wasn't explicitly set
  const cartItems =
    stack.filter((item: any) => item.isChose).length > 0
      ? stack.filter((item: any) => item.isChose)
      : stack;

  if (!cartItems || cartItems.length === 0) {
    return <EmptyCart />;
  }

  const handlePlaceOrder = async (shippingData: any) => {
    setLoading(true);

    const subtotal = cartItems.reduce(
      (acc: number, item: any) =>
        acc +
        calculateFinalPrice(
          Number(item.price || 0),
          item.discount !== undefined ? Number(item.discount) : 0,
          Number(item.count ?? 1),
        ),
      0,
    );

    const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 15;
    const finalOrderTotal = subtotal + deliveryFee;

    try {
      const payload = {
        orderItems: cartItems.map((item: Typing) => ({
          name: item.name,
          quantity: Number(item.count ?? 1),
          image: item.photo || item.images?.[0] || "",
          price: Number(item.price || 0),
          product: item._id,
        })),
        shippingAddress: {
          address: shippingData.address,
          city: shippingData.city,
          phone: shippingData.phone,
        },
        totalPrice: finalOrderTotal,
      };

      await api.post("order", payload);

      toast.success("Order confirmed! Preparing your atelier dispatch.");
      clearCart();
      router.push("/order-success");
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        "Order submission failed, please verify your details and try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-[#F4F3F4] py-8 text-[#111111] sm:py-12">
      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#00000006_1px,transparent_1px),linear-gradient(to_bottom,#00000006_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-7 px-3 sm:px-6">
        {/* ================================================================ */}
        {/* 1. TOP CHECKOUT HEADER & 3-STEP PIPELINE                         */}
        {/* ================================================================ */}
        <header className="flex flex-col justify-between gap-5 rounded-3xl border border-white/90 bg-white/90 p-5 shadow-[0_12px_36px_-14px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <Link
                href="/shop/details/cart"
                className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-[#F8F8F8] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-neutral-700 transition-all hover:border-black hover:bg-[#111111] hover:text-white"
              >
                <ArrowLeft
                  size={12}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                <span>Back to Bag</span>
              </Link>

              <span className="inline-flex items-center gap-1 rounded-full bg-[#111111] px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white">
                <Lock size={10} className="text-emerald-400" />
                ENCRYPTED CHECKOUT
              </span>
            </div>

            <h1 className="pt-1 text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl">
              Executive Checkout
            </h1>
          </div>

          {/* 3-Step Visual Stepper */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-neutral-100 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-neutral-500">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check size={11} strokeWidth={3} />
              </span>
              <span>01. Bag</span>
            </div>

            <span className="h-px w-4 bg-neutral-300" />

            <div className="flex items-center gap-2 rounded-2xl bg-[#111111] px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white font-mono text-[10px] font-black text-[#111111]">
                02
              </span>
              <span>Dispatch Details</span>
            </div>

            <span className="hidden h-px w-4 bg-neutral-300 sm:block" />

            <div className="hidden items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-[10px] font-black uppercase tracking-wider text-neutral-400 sm:flex">
              <span className="font-mono">03.</span>
              <span>Confirmation</span>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. MAIN 2-COLUMN CHECKOUT GRID                                   */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ShippingForm onSubmit={handlePlaceOrder} state={loading} />
          </div>

          <div className="lg:col-span-5">
            <OrderSummary items={cartItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
