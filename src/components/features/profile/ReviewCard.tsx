"use client";

import React from "react";
import { Star, CheckCircle2, MessageSquareQuote, Calendar } from "lucide-react";
import useData from "@/hooks/getData";
import { SectionHeader } from "./SectionHeader";
import { EmptyState } from "./EmptyState";
import { Pagination } from "@/components/common/Pagination.client";

function ReviewCard({
  rev,
}: {
  rev: {
    rating: number;
    comment: string;
    updatedAt?: string;
    createdAt?: string;
    product?: { name?: string };
  };
}) {
  const rating = Number(rev.rating) || 5;
  const dateStr = rev.updatedAt || rev.createdAt;

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/90 bg-white p-6 shadow-[0_12px_34px_-14px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-black/15 hover:shadow-[0_22px_45px_-14px_rgba(0,0,0,0.12)]">
      <div>
        {/* Top Row: Stars & Quote Icon */}
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={
                    i < rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-neutral-200"
                  }
                />
              ))}
            </div>
            <span className="font-mono text-xs font-black text-[#111111]">
              {rating.toFixed(1)}
            </span>
          </div>

          {rev.product?.name ? (
            <span className="max-w-[160px] truncate rounded-lg bg-[#F4F3F4] px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-neutral-700">
              {rev.product.name}
            </span>
          ) : (
            <MessageSquareQuote
              size={18}
              className="text-neutral-200 transition-colors group-hover:text-neutral-400"
            />
          )}
        </div>

        {/* Review Comment */}
        <p className="mb-6 line-clamp-3 text-xs font-medium italic leading-relaxed text-neutral-600 sm:text-sm">
          &ldquo;{rev.comment}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-100 pt-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">
        <span className="inline-flex items-center gap-1.5 text-emerald-600">
          <CheckCircle2 size={12} /> Verified Patron Review
        </span>

        {dateStr && (
          <span className="inline-flex items-center gap-1 font-mono text-neutral-400">
            <Calendar size={11} />
            {new Date(dateStr).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}

function ReviewsContent() {
  const { data, loading, goToPage, page, totalPages } = useData(
    "/profile/my-reviews",
  );
  const reviews = data?.data?.reviews ?? [];
  const total = data?.pagination?.total ?? reviews.length;

  if (loading && !data) {
    return (
      <div className="space-y-4">
        <div className="h-14 w-full animate-pulse rounded-2xl bg-white" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-44 animate-pulse rounded-3xl bg-white p-6"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader icon={Star} title="My Published Feedback" count={total} />

      {reviews.length === 0 ? (
        <EmptyState message="You haven't published any product reviews yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((rev: any) => (
            <ReviewCard key={rev._id} rev={rev} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pt-2">
          <Pagination page={page} goToPage={goToPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

export { ReviewCard, ReviewsContent };
