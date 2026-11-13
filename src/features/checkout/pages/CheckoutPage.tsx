"use client";

import { useRef, useState } from "react";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Lock, ShoppingBag } from "lucide-react";
import toast from "react-hot-toast";

import { isOutOfStock, useCartStore } from "@/store/cartStore";
import type { CartProduct } from "@/store/cartStore";
import type { CheckoutShippingData } from "@/features/checkout/types";
import api from "@/lib/api";
import { ShippingAddressForm } from "@/features/checkout/components/ShippingAddressForm";
import { OrderSummary } from "@/features/checkout/components/OrderSummary";
import { EmptyCartState } from "@/features/cart/components/EmptyCartState";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useUserStore } from "@/store/userStore";
import { hasSessionHint } from "@/lib/sessionHint";

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const idempotencyKey = useRef<string | null>(null);
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

  const redirectGuestToSignIn = () => {
    const checkoutPath = "/shop/details/cart/checkout";
    // Keep the intended destination across both password and Google sign-in.
    try {
      window.sessionStorage.setItem("shopco:authReturnTo", checkoutPath);
    } catch {
      // Navigation still works when browser storage is unavailable.
    }
    toast.error(t("checkoutSignInRequired"));
    router.push(`/auth/signin?reason=checkout&next=${encodeURIComponent(checkoutPath)}`);
  };

  const handlePlaceOrder = async (shippingData: CheckoutShippingData) => {
    if (loading) return;
    setLoading(true);

    try {
      // Do not rely only on client state: the session may still be hydrating,
      // or its access token may have expired while the checkout page was open.
      const profileResponse = await api.get("profile/me", {
        // Match AuthWatcher: do not burn refresh requests for a known guest.
        skipAuthRefresh: !hasSessionHint(),
      });
      const authenticatedUser = profileResponse.data?.data?.user;

      if (!authenticatedUser) {
        redirectGuestToSignIn();
        return;
      }

      useUserStore.getState().setUser(authenticatedUser);

      const payload = {
        orderItems: cartItems.map((item: CartProduct) => {
          const size = Array.isArray(item.size) ? item.size[0] : item.size;
          const color = Array.isArray(item.colors) ? item.colors[0] : item.colors;
          return {
            productId: item._id,
            quantity: Number(item.count ?? 1),
            ...(size ? { size } : {}),
            ...(color ? { color } : {}),
          };
        }),
        shippingAddress: {
          address: shippingData.address,
          city: shippingData.city,
          phone: shippingData.phone,
        },
        paymentMethod: shippingData.paymentMethod || "cod",
      };

      if (!idempotencyKey.current) {
        idempotencyKey.current = crypto.randomUUID();
      }
      await api.post("order", payload, {
        headers: { "Idempotency-Key": idempotencyKey.current },
      });

      idempotencyKey.current = null;
      toast.success(t("orderSuccessText"));
      clearCart();
      router.push("/order-success");
    } catch (error: unknown) {
      // A guest or an expired session must authenticate before an order can be placed.
      if (isAxiosError(error) && error.response?.status === 401) {
        redirectGuestToSignIn();
        return;
      }

      // The shared axios interceptor already toasts API errors; only toast here
      // for failures it does not cover (non-Axios errors), to avoid doubles.
      if (!isAxiosError(error)) toast.error(t("placeOrderError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-section relative isolate min-h-screen overflow-hidden bg-surface-subtle text-primary">
      {/* Subtle Architectural Studio Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      <div className="Responsive relative z-10 space-y-7">
        {/* ================================================================ */}
        {/* 1. TOP CHECKOUT HEADER & 3-STEP PIPELINE                         */}
        {/* ================================================================ */}
        <header className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-surface/90 p-5 shadow-card backdrop-blur-xl sm:p-6 lg:flex-row lg:items-center">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <Link
                href="/shop/details/cart"
                className="group inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-surface-subtle px-3 py-1 text-xs font-black uppercase tracking-widest text-secondary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
              >
                <ArrowLeft
                  size={12}
                  className="transition-transform group-hover:-translate-x-0.5"
                />
                <span>{t("backToBag")}</span>
              </Link>

              <span className="inline-flex items-center gap-1 rounded-full bg-action px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-on-action">
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
            <div className="flex items-center gap-2 rounded-2xl bg-surface-muted px-3 py-2 text-xs font-black uppercase tracking-wider text-muted">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-on-success">
                <Check size={11} strokeWidth={3} />
              </span>
              <span>01. {t("bagStep")}</span>
            </div>

            <span className="h-px w-4 bg-surface-hover" />

            <div className="flex items-center gap-2 rounded-2xl bg-action px-3.5 py-2 text-xs font-black uppercase tracking-wider text-on-action shadow-sm">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface font-mono text-xs font-black text-primary">
                02
              </span>
              <span>{t("dispatchDetails")}</span>
            </div>

            <span className="hidden h-px w-4 bg-surface-hover sm:block" />

            <div className="hidden items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 text-xs font-black uppercase tracking-wider text-muted sm:flex">
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
