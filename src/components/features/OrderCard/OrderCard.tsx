"use client";
import { useState } from "react";
import { Package, Star, Send, CheckCircle2, Trash2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
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

  // const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL + "/uploads/";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
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
        const n = { ...prev };
        delete n[productId];
        return n;
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
      toast.success("Deleted is successfully!");
    } catch (err: any) {
      if (err.response?.status === 404) {
        return toast.error("Order not found or already deleted", err.message);
      }
    }
  };

  return (
    <div className="border border-gray-100 rounded-4xl px-3 py-4 lg:p-6 mb-6 hover:shadow-2xl hover:shadow-black/5 transition-all bg-white group relative overflow-hidden">
      {/* ─── Header ─── */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex gap-4 md:gap-5">
          <div className="bg-gray-50 p-4 rounded-2xl group-hover:bg-black group-hover:text-white transition-all duration-500 shadow-inner">
            <Package className="w-6  h-6" />
          </div>
          <div>
            <h3 className="font-black text-sm lg:text-xl tracking-tighter text-gray-900">
              ORDER #{order._id.slice(-6).toUpperCase()}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-[10px] text-gray-400 text-nowrap font-black uppercase tracking-widest">
                {new Date(order.createdAt).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <p className="text-[10px] text-gray-400 text-nowrap font-black uppercase tracking-widest">
                {order.orderItems.length} Items
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 w-fit  ">
          <span
            className={`px-5 w-full py-2 text-center rounded-full font-black uppercase tracking-[0.15em] text-[10px] shadow-sm ${getStatusColor(order.status)}`}
          >
            {order.status}
          </span>
          <button
            onClick={() => {
              deleteOrders(order._id);
              onReviewSuccess && onReviewSuccess();
            }}
            className="w-full font-black  flex items-center justify-center rounded-full border-2 border-red-200 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all active:scale-95  cursor-pointer px-5 tracking-[0.15em] text-[10px] py-1 md:py-2 uppercase"
            title="Delete"
          >
            Delete
          </button>
          {order.status === "Delivered" && (
            <button
              onClick={() => setIsReviewOpen(!isReviewOpen)}
              className="flex items-center gap-2 text-[8px] md:text-[12px] font-black uppercase tracking-widest text-yellow-600 hover:bg-yellow-50 px-1 md:px-3 py-1.5 rounded-lg transition-all text-nowrap"
            >
              {isReviewOpen ? "Hide Reviews" : "Rate Experience"}
              <Star
                // size={14}
                className={`${isReviewOpen ? "" : "fill-yellow-500 "} size-3 md:size-5`}
              />
            </button>
          )}
        </div>
      </div>

      {/* ─── Item Images Stack ─── */}
      <div className="flex items-center justify-between">
        <div className="flex -space-x-4">
          {order.orderItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className="relative h-14 w-14 rounded-2xl ring-4 ring-white overflow-hidden bg-gray-50 shadow-md transform hover:-translate-y-1 transition-transform"
            >
              <img
                src={item.image}
                alt={item.name}
                className="object-cover h-full w-full"
              />
            </div>
          ))}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">
            Final Amount
          </p>
          <p className="font-black text-xl md:text-3xl text-gray-900 tracking-tighter">
            ${order.totalPrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ─── Expandable Review Section ─── */}
      {isReviewOpen && (
        <div className="mt-8 pt-8 border-t border-gray-100 space-y-6 animate-in slide-in-from-top-4 duration-500">
          {order.orderItems.map((item: any) => (
            <div
              key={item._id}
              className="bg-[#FAFAFA] rounded-3xl p-6 border border-gray-50 hover:border-gray-200 transition-all"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white shadow-sm">
                  <img
                    src={item.image}
                    className="object-cover w-full h-full"
                    alt={item.name}
                  />
                </div>
                <p className="font-black text-sm text-gray-800 uppercase tracking-tight truncate flex-1">
                  {item.name}
                </p>

                <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-green-500 bg-green-50 px-2 py-1 rounded-md">
                  <CheckCircle2 size={10} /> Verified
                </span>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1.5 mb-5 bg-white w-fit p-2 rounded-2xl shadow-sm border border-gray-50">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() =>
                      setRatings({ ...ratings, [item.product]: num })
                    }
                    className="p-1 hover:scale-125 transition-transform"
                  >
                    <Star
                      size={22}
                      className={`${(ratings[item.product] || 0) >= num ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                    />
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="relative group/input">
                <textarea
                  placeholder="Tell us what you liked or disliked..."
                  className="w-full bg-white border border-gray-100 rounded-2xl p-5 text-sm focus:ring-2 focus:ring-black outline-none transition-all resize-none font-medium text-gray-600 shadow-sm"
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
                  className="absolute bottom-4 right-4 bg-black text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 disabled:opacity-20 transition-all shadow-xl shadow-black/10 flex items-center gap-2"
                >
                  {loading === item.product ? (
                    "Sending..."
                  ) : (
                    <>
                      Post Review <Send size={12} />
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
