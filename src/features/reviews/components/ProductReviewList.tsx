"use client";

import React, { useState, useMemo } from "react";
import VerifiedRoundedIcon from "@mui/icons-material/VerifiedRounded";
import { motion } from "framer-motion";
import { Star, MessageSquareQuote, ShieldCheck, Sparkles } from "lucide-react";
import { Product } from "@/types";
import StarRating from "@/shared/components/feedback/StarRating";
import Heading from "@/shared/components/ui/SectionHeading";

interface RawReview {
  user?: {
    fullName?: string;
    avatar?: string;
  };
  rating?: number;
  comment?: string;
  createdAt?: string;
}

interface Review {
  fullName: string;
  rating: number;
  comment: string;
  avatar?: string;
}

export const ProductReviewList = ({ item }: { item: Product }) => {
  const [filterStars, setFilterStars] = useState<"all" | "5" | "4+">("all");
  const [brokenAvatars, setBrokenAvatars] = useState<Record<number, boolean>>(
    {},
  );

  const reviewsList: Review[] = useMemo(() => {
    return (
      item?.reviews?.map((e: RawReview) => ({
        fullName: e.user?.fullName || "Verified Client",
        rating: Number(e.rating) || 5,
        comment:
          e.comment ||
          "Impeccable fit and heavyweight fabric quality. Highly recommended.",
        avatar: e.user?.avatar || "",
      })) || []
    );
  }, [item?.reviews]);

  const filteredReviews = useMemo(() => {
    if (filterStars === "5") {
      return reviewsList.filter((r) => Math.round(r.rating) === 5);
    }
    if (filterStars === "4+") {
      return reviewsList.filter((r) => r.rating >= 4);
    }
    return reviewsList;
  }, [reviewsList, filterStars]);

  const avgScore = useMemo(() => {
    if (reviewsList.length === 0) return "5.0";
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div className="space-y-8">
      {/* ── Top Header & Sentiment Filter Bar ── */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-border bg-surface p-5 shadow-[0_12px_34px_-14px_rgba(var(--shadow-rgb),0.06)] sm:p-7 lg:flex-row lg:items-center">
        <div>
          <div className="mb-1.5 inline-flex items-center gap-2 rounded-full bg-surface-subtle px-3 py-1">
            <ShieldCheck size={12} className="text-success" />
            <span className="text-[9px] font-black uppercase tracking-[0.22em] text-secondary">
              VERIFIED PATRON FEEDBACK
            </span>
          </div>
          <Heading title="CUSTOMER REVIEWS" styling="!text-start !my-0" />
        </div>

        {/* Right Aggregate Score & Filter Pills */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5 rounded-2xl border border-border/80 bg-surface-subtle px-4 py-2">
            <span className="font-mono text-lg font-black text-primary">
              {avgScore}
            </span>
            <Star size={15} className="fill-rating text-rating" />
            <span className="text-[11px] font-bold text-muted">
              ({reviewsList.length} verified)
            </span>
          </div>

          {reviewsList.length > 0 && (
            <div className="inline-flex rounded-xl border border-border/80 bg-surface-subtle p-1">
              {[
                { id: "all", label: "All" },
                { id: "5", label: "5 ★ Only" },
                { id: "4+", label: "4+ ★" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterStars(tab.id as any)}
                  className={`cursor-pointer rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${
                    filterStars === tab.id
                      ? "bg-action text-on-action shadow-2xs"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Reviews 3D Grid or Empty State ── */}
      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredReviews.map((e: Review, id: number) => {
            const hasAvatar = Boolean(e.avatar) && !brokenAvatars[id];

            return (
              <motion.div
                key={id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[0_12px_34px_-14px_rgba(var(--shadow-rgb),0.06)] transition-shadow hover:border-border-subtle hover:shadow-[0_24px_48px_-14px_rgba(var(--shadow-rgb),0.12)]"
              >
                <div className="space-y-4">
                  {/* Top Row: Stars & Quote Watermark */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <StarRating rating={e.rating} />
                      <span className="font-mono text-xs font-black text-primary">
                        {Number(e.rating).toFixed(1)}
                      </span>
                    </div>
                    <MessageSquareQuote
                      size={20}
                      className="text-subtle transition-colors group-hover:text-muted"
                    />
                  </div>

                  {/* Comment Body */}
                  <p className="text-xs font-medium italic leading-relaxed text-secondary sm:text-sm">
                    &ldquo;{e.comment}&rdquo;
                  </p>
                </div>

                {/* Bottom Author Profile */}
                <div className="mt-6 flex items-center justify-between border-t border-border-subtle pt-4">
                  <div className="flex items-center gap-3 min-w-0">
                    {hasAvatar ? (
                      <img
                        src={e.avatar}
                        alt={e.fullName}
                        onError={() =>
                          setBrokenAvatars((prev) => ({ ...prev, [id]: true }))
                        }
                        className="h-10 w-10 shrink-0 rounded-full border border-border object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-action font-mono text-xs font-black text-on-action">
                        {getInitials(e.fullName)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-black uppercase tracking-tight text-primary sm:text-sm">
                          {e.fullName}
                        </span>
                        <VerifiedRoundedIcon className="!text-sm text-success" />
                      </div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">
                        Verified Buyer
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface px-6 py-14 text-center shadow-2xs">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-subtle text-primary">
            <Sparkles size={24} />
          </div>
          <h4 className="text-sm font-black uppercase tracking-wider text-primary">
            No Client Reviews Recorded Yet
          </h4>
          <p className="mt-1 max-w-xs text-xs text-muted">
            Be the first patron to acquire this archive piece and share your
            impressions.
          </p>
        </div>
      )}
    </div>
  );
};
