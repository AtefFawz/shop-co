"use client";
import { resolveImageUrl } from "@/lib/imageUrl";

import { useState } from "react";
import {
  Package,
  Star,
  Send,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import HoldToConfirmButton from "@/shared/components/motion/HoldToConfirmButton";
import { formatCurrency } from "@/lib/formatCurrency";
import { useLocale } from "@/shared/i18n/LocaleProvider";

import { getApiErrorDetails } from "@/lib/errorUtils";
import type { CustomerOrderRecord } from "@/types/domain";
type Order = CustomerOrderRecord;

export default function CustomerOrderCard({
  order,
  onReviewSuccess,
}: {
  order: Order;
  onReviewSuccess: () => void;
}) {
  const { t, locale, direction } = useLocale();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<string | null>(null);

  const shortId = (order._id || "").slice(-6).toUpperCase();
  const isDelivered = (order.status || "").toLowerCase() === "delivered";

  const statusLabel = (status: string) => ({
    Pending: t("statusPending"),
    Shipped: t("statusShipped"),
    Delivered: t("statusDelivered"),
    Cancelled: t("statusCancelled"),
  }[status] || status);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return "border-success-border bg-success-soft text-success";
      case "Shipped":
        return "border-info-border bg-info-soft text-info";
      case "Pending":
        return "border-warning-border bg-warning-soft text-warning";
      case "Cancelled":
        return "border-danger-border bg-danger-soft text-danger";
      default:
        return "border-border bg-surface-muted text-secondary";
    }
  };

  const handleSubmitReview = async (productId: string) => {
    if (!ratings[productId]) {
      toast.error(t("pleaseSelectRating"));
      return;
    }
    if (!comments[productId]?.trim()) {
      toast.error(t("pleaseComment"));
      return;
    }

    setLoading(productId);
    try {
      await api.post("review/add", {
        product: productId,
        rating: ratings[productId],
        comment: comments[productId],
      });

      toast.success(t("reviewPosted"));
      if (onReviewSuccess) onReviewSuccess();
      setRatings((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
      setComments((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } catch (error: unknown) {
      console.error(error);
      toast.error(getApiErrorDetails(error).response?.data?.message || t("reviewSubmitError"));
    } finally {
      setLoading(null);
    }
  };

  const deleteOrders = async (id: string) => {
    try {
      await api.delete(`order/${id}`);
      toast.success(t("orderCancelledRemoved"));
      if (onReviewSuccess) onReviewSuccess();
    } catch (err: unknown) {
      if (getApiErrorDetails(err).response?.status === 404) {
        toast.error(t("orderNotFound"));
        return;
      }
      toast.error(t("orderDeleteError"));
    }
  };

  const visibleItems = order.orderItems.slice(0, 4);
  const remainingCount = order.orderItems.length - 4;

  return (
    <div dir={direction} className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-5 shadow-[0_12px_36px_-12px_rgba(var(--shadow-rgb),0.06)] transition-all duration-300 hover:border-border hover:shadow-[0_20px_45px_-12px_rgba(var(--shadow-rgb),0.1)] sm:p-7">
      {/* ================================================================== */}
      {/* 1. TOP HEADER: ID, TIMESTAMP & STATUS BADGE                        */}
      {/* ================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-action text-on-action shadow-xs">
            <Package size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-black uppercase tracking-tight text-primary sm:text-base">
                {t("orderLabel").toUpperCase()} #{shortId}
              </h3>
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-muted">
              <span>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-EG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : t("recent")}
              </span>
              <span>•</span>
              <span>
                {order.orderItems.length}{" "}
                {order.orderItems.length === 1 ? t("garment") : t("garments")}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-[10px] font-black uppercase tracking-widest ${getStatusBadge(
            order.status,
          )}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {statusLabel(order.status)}
        </span>
      </div>

      {/* ================================================================== */}
      {/* 2. MIDDLE ROW: ITEM THUMBNAILS & TOTAL VALUE                       */}
      {/* ================================================================== */}
      <div className="flex items-center justify-between py-5">
        <div className="flex items-center -space-x-3 sm:-space-x-3.5">
          {visibleItems.map((item, idx) => (
            <div
              key={item._id || idx}
              className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl border-2 border-surface bg-surface-muted shadow-2xs transition-transform duration-300 hover:z-10 hover:scale-110 sm:h-15 sm:w-15"
            >
              <img
                src={resolveImageUrl(item.image, "https://placehold.co/80x80/111111/FFFFFF?text=SKU")}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border-2 border-surface bg-action font-mono text-xs font-black text-on-action shadow-2xs sm:h-15 sm:w-15">
              +{remainingCount}
            </div>
          )}
        </div>

        <div className="text-end font-mono">
          <span className="block text-[9px] font-black uppercase tracking-widest text-muted">
            {t("totalSettlement")}
          </span>
          <span className="text-xl font-black tracking-tight text-primary sm:text-2xl">
            {formatCurrency(Number(order.totalPrice || 0), locale)}
          </span>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. ACTION FOOTER & VIEW DETAILS LINK                              */}
      {/* ================================================================== */}
      <div className="flex flex-col-reverse gap-3 border-t border-border-subtle pt-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Hold to Delete */}
        <div className="w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">
          <HoldToConfirmButton
            doneLabel={t("archived")}
            backgroundColor="var(--surface-subtle)"
            fillColor="var(--danger)"
            textColor="var(--danger)"
            fillTextColor="var(--text-on-action)"
            size="sm"
            radius={16}
            fillDirection="right"
            holdTime={1200}
            releaseTime={200}
            pressScale={0.96}
            wave
            waveAmplitude={5}
            glow={false}
            resetAfter={1200}
            className="w-full border border-border text-[10px] font-black uppercase tracking-wider shadow-none transition-all hover:border-danger-border hover:bg-danger-soft sm:w-auto [&_*]:!font-black"
            onHold={() => {
              deleteOrders(order._id);
              if (onReviewSuccess) onReviewSuccess();
            }}
          >
            {t("holdDeleteOrder")}
          </HoldToConfirmButton>
        </div>

        {/* Right Actions: Rate Products + Track Dossier Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/shop/orders/${order._id}`}
            className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl border border-border/90 bg-surface-subtle px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-secondary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
          >
            <span>{t("trackOrder")}</span>
            <ChevronRight size={13} />
          </Link>

          {isDelivered && (
            <button
              type="button"
              onClick={() => setIsReviewOpen(!isReviewOpen)}
              className="inline-flex flex-1 sm:flex-initial cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-action px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-on-action shadow-2xs transition-all hover:bg-action-hover"
            >
              <Star
                size={13}
                className={
                  isReviewOpen
                    ? "text-muted"
                    : "fill-rating text-rating"
                }
              />
              <span>{isReviewOpen ? t("closeReviews") : t("rateGarments")}</span>
            </button>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. EXPANDABLE REVIEW DRAWER                                        */}
      {/* ================================================================== */}
      {isReviewOpen && (
        <div className="mt-5 space-y-4 border-t border-border-subtle pt-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted">
              {t("submitVerifiedFeedback")}
            </span>
          </div>

          {order.orderItems.map((item) => (
            <div
              key={item._id || item.product}
              className="rounded-2xl border border-border/80 bg-surface-subtle p-4 sm:p-5"
            >
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-border bg-surface">
                    <img
                      src={resolveImageUrl(item.image, "https://placehold.co/80x80/111111/FFFFFF?text=SKU")}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="truncate text-xs font-black uppercase tracking-tight text-primary sm:text-sm">
                    {item.name}
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-success-border bg-success-soft px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-success">
                  <CheckCircle2 size={11} /> Verified
                </span>
              </div>

              {/* Star Rating Select */}
              <div className="mb-3 flex w-fit items-center gap-1 rounded-xl border border-border bg-surface p-1.5 shadow-2xs">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() =>
                      setRatings({ ...ratings, [item.product]: num })
                    }
                    className="cursor-pointer p-1 transition-transform hover:scale-110 active:scale-95"
                    aria-label={`${t("rateGarments")} ${num}`}
                  >
                    <Star
                      size={17}
                      className={`${
                        (ratings[item.product] || 0) >= num
                          ? "fill-rating text-rating"
                          : "text-subtle"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Review Textarea */}
              <div className="relative">
                <textarea
                  placeholder={t("pleaseComment")}
                  className="w-full resize-none rounded-xl border border-border/90 bg-surface p-3.5 pb-14 text-xs font-medium text-secondary shadow-2xs outline-none transition-all placeholder:text-muted focus:border-primary focus:ring-1 focus:ring-focus"
                  rows={2}
                  value={comments[item.product] || ""}
                  onChange={(e) =>
                    setComments({
                      ...comments,
                      [item.product]: e.target.value,
                    })
                  }
                />

                <button
                  type="button"
                  onClick={() => handleSubmitReview(item.product)}
                  disabled={
                    !ratings[item.product] ||
                    loading === item.product ||
                    !comments[item.product]?.trim()
                  }
                  className="absolute bottom-2.5 end-2.5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-action px-4 py-2 text-[10px] font-black uppercase tracking-widest text-on-action shadow-sm transition-all hover:bg-action-hover disabled:opacity-25"
                >
                  {loading === item.product ? (
                    t("publishReview")
                  ) : (
                    <>
                      <span>{t("postReview")}</span>
                      <Send size={11} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
