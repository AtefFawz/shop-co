"use client";
import { useState } from "react";
import { Package, Star, Send, CheckCircle2 } from "lucide-react";
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200/60";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200/60";
      case "Cancelled":
        return "bg-rose-50 text-rose-700 border-rose-200/60";
      default:
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  const handleSubmitReview = async (productId: string) => {
    if (!ratings[productId]) return toast.error("Please select a rating");
    setLoading(productId);
    try {
      await api.post("review/add", {
        product: productId,
        rating: ratings[productId],
        comment: comments[productId],
      });

      toast.success("Review submitted successfully!");
      if (onReviewSuccess) onReviewSuccess();
      setRatings((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit review");
    } finally {
      setLoading(null);
    }
  };

  const deleteOrders = async (id: string) => {
    try {
      await api.delete(`order/${id}`);
      toast.success("Order deleted successfully!");
    } catch (err: any) {
      if (err.response?.status === 404) {
        return toast.error("Order not found or already deleted");
      }
      toast.error("Failed to delete order");
    }
  };

  const visibleItems = order.orderItems.slice(0, 4);
  const remainingCount = order.orderItems.length - 4;

  return (
    <div className="relative mb-6 overflow-hidden rounded-[28px] border border-neutral-200/80 bg-white p-5 transition-all duration-300 hover:border-neutral-300 hover:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.07)] sm:p-7">
      {/* ─── 1. Header (Clean & Uncluttered) ─── */}
      <div className="flex items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-900 transition-colors duration-300">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight text-neutral-950 sm:text-lg">
              ORDER #{order._id.slice(-6).toUpperCase()}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="h-1 w-1 rounded-full bg-neutral-300" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                {order.orderItems.length}{" "}
                {order.orderItems.length === 1 ? "Item" : "Items"}
              </span>
            </div>
          </div>
        </div>

        {/* Status Badge Only */}
        <span
          className={`shrink-0 rounded-full border px-3.5 py-1.5 text-center text-[10px] font-black uppercase tracking-widest sm:px-4 sm:text-[11px] ${getStatusBadge(
            order.status,
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* ─── 2. Middle Row: Product Images & Total Price ─── */}
      <div className="flex items-center justify-between py-6">
        <div className="flex items-center -space-x-3 sm:-space-x-4">
          {visibleItems.map((item, idx) => (
            <div
              key={idx}
              className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-neutral-100 shadow-sm transition-transform duration-300 hover:z-10 hover:-translate-y-1 sm:h-16 sm:w-16"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
          {remainingCount > 0 && (
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-white bg-neutral-900 text-xs font-black text-white shadow-sm sm:h-16 sm:w-16">
              +{remainingCount}
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            Total Amount
          </p>
          <p className="mt-0.5 text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
            ${order.totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ─── 3. Action Footer (Responsive Action Center) ─── */}
      <div className="flex flex-col-reverse gap-3 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Delete Action (Adapts to 100% width on mobile without breaking) */}
        <div className="w-full sm:w-auto [&>*]:w-full sm:[&>*]:w-auto">
          <HoldButton
            doneLabel="Deleted"
            backgroundColor="#FFFFFF"
            fillColor="#DC2626"
            textColor="#DC2626"
            fillTextColor="#FFFFFF"
            size="sm"
            radius={20}
            fillDirection="right"
            holdTime={1200}
            releaseTime={200}
            pressScale={0.96}
            wave
            waveAmplitude={5}
            glow={false}
            resetAfter={1200}
            className="w-full border border-neutral-200 text-xs font-black uppercase tracking-wider shadow-none transition-all hover:border-red-300 hover:bg-red-50/30 sm:w-auto [&_*]:!font-black"
            onHold={() => {
              deleteOrders(order._id);
              onReviewSuccess && onReviewSuccess();
            }}
          >
            Hold to delete
          </HoldButton>
        </div>

        {/* Review Action Button */}
        {order.status === "Delivered" && (
          <button
            onClick={() => setIsReviewOpen(!isReviewOpen)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-50 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-neutral-800 transition-all hover:bg-neutral-100 sm:w-auto"
          >
            <Star
              className={`h-4 w-4 ${
                isReviewOpen
                  ? "text-neutral-400"
                  : "fill-amber-400 text-amber-400"
              }`}
            />
            {isReviewOpen ? "Close Reviews" : "Rate Products"}
          </button>
        )}
      </div>

      {/* ─── 4. Expandable Review Drawer ─── */}
      {isReviewOpen && (
        <div className="mt-5 space-y-4 border-t border-neutral-100 pt-6 animate-in fade-in slide-in-from-top-2 duration-300">
          {order.orderItems.map((item) => (
            <div
              key={item._id}
              className="rounded-2xl border border-neutral-100 bg-[#FAFAFA] p-4 sm:p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-neutral-200/60 bg-white">
                    <img
                      src={item.image}
                      className="h-full w-full object-cover"
                      alt={item.name}
                    />
                  </div>
                  <p className="truncate text-xs font-black uppercase tracking-tight text-neutral-900 sm:text-sm">
                    {item.name}
                  </p>
                </div>

                <span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-600 border border-emerald-100">
                  <CheckCircle2 size={11} /> Verified Purchase
                </span>
              </div>

              {/* Star Rating Select */}
              <div className="mb-3 flex w-fit items-center gap-1 rounded-xl border border-neutral-200/60 bg-white p-1.5 shadow-sm">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() =>
                      setRatings({ ...ratings, [item.product]: num })
                    }
                    className="p-1 transition-transform hover:scale-110 active:scale-95"
                  >
                    <Star
                      size={18}
                      className={`${
                        (ratings[item.product] || 0) >= num
                          ? "fill-amber-400 text-amber-400"
                          : "text-neutral-200"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Review Textarea & Submit */}
              <div className="relative">
                <textarea
                  placeholder="Share your thoughts about this product..."
                  className="w-full resize-none rounded-xl border border-neutral-200/80 bg-white p-3.5 pb-14 text-xs font-medium text-neutral-800 shadow-sm outline-none transition-all placeholder:text-neutral-400 focus:border-black focus:ring-1 focus:ring-black"
                  rows={2}
                  onChange={(e) =>
                    setComments({ ...comments, [item.product]: e.target.value })
                  }
                />
                <button
                  onClick={() => handleSubmitReview(item.product)}
                  disabled={
                    !ratings[item.product] ||
                    loading === item.product ||
                    !comments[item.product]
                  }
                  className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white shadow-sm transition-all hover:bg-neutral-800 disabled:opacity-20"
                >
                  {loading === item.product ? (
                    "Submitting..."
                  ) : (
                    <>
                      Post Review <Send size={11} />
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
