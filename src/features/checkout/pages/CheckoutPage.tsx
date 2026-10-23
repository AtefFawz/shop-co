"use client";

import { useState } from "react";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Lock, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import { isOutOfStock, useCartStore } from "@/store/cartStore";
import type { CartProduct } from "@/store/cartStore";
import type { CheckoutShippingData } from "@/features/checkout/types";
import { calculateFinalPrice } from "@/lib/logicPricing";
import api from "@/lib/api";
import { ShippingAddressForm } from "@/features/checkout/components/ShippingAddressForm";
import { OrderSummary } from "@/features/checkout/components/OrderSummary";
import { EmptyCartState } from "@/features/cart/components/EmptyCartState";
import { useLocale } from "@/shared/i18n/LocaleProvider";

const FREE_SHIPPING_THRESHOLD = 200;

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const { stack, clearCart } = useCartStore();
  const cartItems = stack.filter(
    (item) => item.isChose !== false && !isOutOfStock(item),
  );

  if (stack.length === 0) return <EmptyCartState />;

  if (cartItems.length === 0) {
    return (
      <section className="flex min-h-[65svh] items-center justify-center bg-app px-4 py-16 text-primary">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-[var(--shadow-soft)] sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-secondary">
            <ShoppingBag size={24} />
          </div>
          <h1 className="mt-5 text-xl font-black sm:text-2xl">{t("noCheckoutSelection")}</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-secondary">{t("noCheckoutSelectionHint")}</p>
          <Link href="/shop/details/cart" className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-action px-6 py-3 text-sm font-bold text-on-action transition hover:bg-action-hover">
            <ArrowLeft size={15} />
            {t("backToBag")}
          </Link>
        </div>
      </section>
    );
  }

  const handlePlaceOrder = async (shippingData: CheckoutShippingData) => {
    setLoading(true);

    const subtotal = cartItems.reduce(
      (acc, item) =>
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
        orderItems: cartItems.map((item: CartProduct) => ({
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
        paymentMethod: shippingData.paymentMethod || "cod",
      };

      await api.post("order", payload);

      toast.success(t("orderSuccessText"));
      clearCart();
      router.push("/order-success");
    } catch (error: unknown) {
      const serverMessage = isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message
        : undefined;
      toast.error(serverMessage || t("placeOrderError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-surface-subtle py-8 text-primary sm:py-12">
      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-7 px-3 sm:px-6">
        {/* ================================================================ */}
        {/* 1. TOP CHECKOUT HEADER & 3-STEP PIPELINE                         */}
        {/* ================================================================ */}
        <header className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-surface/90 p-5 shadow-[0_12px_36px_-14px_rgba(var(--shadow-rgb),0.06)] backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <Link
                href="/shop/details/cart"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface-subtle px-3 py-1 text-[10px] font-black uppercase tracking-widest text-secondary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
              >
                <ArrowLeft
                  size={12}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                <span>{t("backToBag")}</span>
              </Link>

              <span className="inline-flex items-center gap-1 rounded-full bg-action px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-on-action">
                <Lock size={10} className="text-success" />
                {t("encryptedCheckout")}
              </span>
            </div>

            <h1 className="pt-1 text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl">
              {t("checkoutTitle")}
            </h1>
          </div>

          {/* 3-Step Visual Stepper */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2 rounded-2xl bg-surface-muted px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-on-success">
                <Check size={11} strokeWidth={3} />
              </span>
              <span>01. {t("bagStep")}</span>
            </div>

            <span className="h-px w-4 bg-surface-hover" />

            <div className="flex items-center gap-2 rounded-2xl bg-action px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-on-action shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface font-mono text-[10px] font-black text-primary">
                02
              </span>
              <span>{t("dispatchDetails")}</span>
            </div>

            <span className="hidden h-px w-4 bg-surface-hover sm:block" />

            <div className="hidden items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 text-[10px] font-black uppercase tracking-wider text-muted sm:flex">
              <span className="font-mono">03.</span>
              <span>{t("confirmation")}</span>
            </div>
          </div>
        </header>

        {/* ================================================================ */}
        {/* 2. MAIN 2-COLUMN CHECKOUT GRID                                   */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ShippingAddressForm onSubmit={handlePlaceOrder} state={loading} />
          </div>

          <div className="lg:col-span-5">
            <OrderSummary items={cartItems} />
          </div>
        </div>
      </div>
    </section>
  );
}
