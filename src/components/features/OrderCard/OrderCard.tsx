"use client";

import React, { useState } from "react";
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
import HoldButton from "@/components/reactbits/HoldButton";

interface Order {
  _id: string;
  createdAt: string;
  orderItems: Array<{
    _id: string;
    product: string;
    name: string;
    image: string;
  }>;
  status: string;
  totalPrice: number;
}

const getItemImageUrl = (raw?: string) => {
  if (!raw) return "https://placehold.co/80x80/111111/FFFFFF?text=SKU";
  if (raw.startsWith("http")) return raw;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
};

export default function OrderCard({
  order,
  onReviewSuccess,
}: {
  order: Order;
  onReviewSuccess: () => void;
}) {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<string | null>(null);

  const shortId = (order._id || "").slice(-6).toUpperCase();
  const isDelivered = (order.status || "").toLowerCase() === "delivered";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return "border-emerald-500/25 bg-emerald-500/10 text-emerald-700";
      case "Shipped":
        return "border-sky-500/25 bg-sky-500/10 text-sky-700";
      case "Pending":
        return "border-amber-500/25 bg-amber-500/10 text-amber-800";
      case "Cancelled":
        return "border-rose-500/25 bg-rose-500/10 text-rose-700";
      default:
        return "border-neutral-200 bg-neutral-100 text-neutral-700";
    }
  };

  const handleSubmitReview = async (productId: string) => {
    if (!ratings[productId]) {
      toast.error("Please select a star rating first");
      return;
    }
    if (!comments[productId]?.trim()) {
      toast.error("Please enter a brief written comment");
      return;
    }

    setLoading(productId);
    try {
      await api.post("review/add", {
        product: productId,
        rating: ratings[productId],
        comment: comments[productId],
      });

      toast.success("Catalog review posted successfully!");
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
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(null);
    }
  };

  const deleteOrders = async (id: string) => {
    try {
      await api.delete(`order/${id}`);
      toast.success("Order record cancelled / removed");
      if (onReviewSuccess) onReviewSuccess();
    } catch (err: any) {
      if (err.response?.status === 404) {
        toast.error("Order not found or already archived");
        return;
      }
      toast.error("Failed to delete order record");
    }
  };

  const visibleItems = order.orderItems.slice(0, 4);
  const remainingCount = order.orderItems.length - 4;

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/90 bg-white p-5 shadow-[0_12px_36px_-12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:border-black/20 hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.1)] sm:p-7">
      {/* ================================================================== */}
      {/* 1. TOP HEADER: ID, TIMESTAMP & STATUS BADGE                        */}
      {/* ================================================================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#111111] text-white shadow-xs">
            <Package size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-sm font-black uppercase tracking-tight text-[#111111] sm:text-base">
                ORDER #{shortId}
              </h3>
            </div>

            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] font-bold text-neutral-400">
              <span>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "Recent"}
              </span>
              <span>•</span>
              <span>
                {order.orderItems.length}{" "}
                {order.orderItems.length === 1 ? "Garment" : "Garments"}
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
          {order.status}
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
              className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl border-2 border-white bg-neutral-100 shadow-2xs transition-transform duration-300 hover:z-10 hover:scale-110 sm:h-15 sm:w-15"
            >
              <img
                src={getItemImageUrl(item.image)}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border-2 border-white bg-[#111111] font-mono text-xs font-black text-white shadow-2xs sm:h-15 sm:w-15">
              +{remainingCount}
            </div>
          )}
        </div>

        <div className="text-right font-mono">
          <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-400">
            Total Settlement
          </span>
          <span className="text-xl font-black tracking-tight text-[#111111] sm:text-2xl">
            ${Number(order.totalPrice || 0).toLocaleString()}
          </span>
        </div>
      </div>

      {/* ================================================================== */}
      {/* 3. ACTION FOOTER & VIEW DETAILS LINK                              */}
      {/* ================================================================== */}
      <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Hold to Delete */}
        <div className="w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">
          <HoldButton
            doneLabel="Archived"
            backgroundColor="#F8F8F8"
            fillColor="#E11D48"
            textColor="#E11D48"
            fillTextColor="#FFFFFF"
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
            className="w-full border border-neutral-200 text-[10px] font-black uppercase tracking-wider shadow-none transition-all hover:border-rose-300 hover:bg-rose-50/40 sm:w-auto [&_*]:!font-black"
            onHold={() => {
              deleteOrders(order._id);
              onReviewSuccess && onReviewSuccess();
            }}
          >
            Hold to delete order
          </HoldButton>
        </div>

        {/* Right Actions: Rate Products + Track Dossier Link */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/my-orders/${order._id}`}
            className="inline-flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-xl border border-neutral-200/90 bg-[#F8F8F8] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-neutral-800 transition-all hover:border-black hover:bg-[#111111] hover:text-white"
          >
            <span>Track Dossier</span>
            <ChevronRight size={13} />
          </Link>

          {isDelivered && (
            <button
              type="button"
              onClick={() => setIsReviewOpen(!isReviewOpen)}
              className="inline-flex flex-1 sm:flex-initial cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-[#111111] px-4 py-2.5 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs transition-all hover:bg-neutral-800"
            >
              <Star
                size={13}
                className={
                  isReviewOpen
                    ? "text-neutral-400"
                    : "fill-amber-400 text-amber-400"
                }
              />
              <span>{isReviewOpen ? "Close Reviews" : "Rate Garments"}</span>
            </button>
          )}
        </div>
      </div>

      {/* ================================================================== */}
      {/* 4. EXPANDABLE REVIEW DRAWER                                        */}
      {/* ================================================================== */}
      {isReviewOpen && (
        <div className="mt-5 space-y-4 border-t border-neutral-100 pt-5 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#111111]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Submit Verified Feedback
            </span>
          </div>

          {order.orderItems.map((item) => (
            <div
              key={item._id || item.product}
              className="rounded-2xl border border-neutral-200/80 bg-[#F8F8F8] p-4 sm:p-5"
            >
              <div className="mb-3.5 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                    <img
                      src={getItemImageUrl(item.image)}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="truncate text-xs font-black uppercase tracking-tight text-[#111111] sm:text-sm">
                    {item.name}
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700">
                  <CheckCircle2 size={11} /> Verified
                </span>
              </div>

              {/* Star Rating Select */}
              <div className="mb-3 flex w-fit items-center gap-1 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-2xs">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() =>
                      setRatings({ ...ratings, [item.product]: num })
                    }
                    className="cursor-pointer p-1 transition-transform hover:scale-110 active:scale-95"
                    aria-label={`Rate ${num} stars`}
                  >
                    <Star
                      size={17}
                      className={`${
                        (ratings[item.product] || 0) >= num
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Review Textarea */}
              <div className="relative">
                <textarea
                  placeholder="Share your feedback on fit, fabric weight, and craftsmanship..."
                  className="w-full resize-none rounded-xl border border-neutral-200/90 bg-white p-3.5 pb-14 text-xs font-medium text-neutral-800 shadow-2xs outline-none transition-all placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
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
                  className="absolute bottom-2.5 right-2.5 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-[#111111] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition-all hover:bg-neutral-800 disabled:opacity-25"
                >
                  {loading === item.product ? (
                    "Publishing..."
                  ) : (
                    <>
                      <span>Post Review</span>
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
