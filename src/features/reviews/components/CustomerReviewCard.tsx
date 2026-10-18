"use client";

import React from "react";
import { Star, CheckCircle2, MessageSquareQuote, Calendar } from "lucide-react";
import useData from "@/hooks/getData";
import { AccountSectionHeader } from "@/features/account/components/AccountSectionHeader";
import { EmptyAccountState } from "@/features/account/components/EmptyAccountState";
import { ClientPagination } from "@/shared/components/navigation/ClientPagination";

function CustomerReviewCard({
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
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-[0_12px_34px_-14px_rgba(var(--shadow-rgb),0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-border-subtle hover:shadow-[0_22px_45px_-14px_rgba(var(--shadow-rgb),0.12)]">
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
                      ? "fill-rating text-rating"
                      : "text-subtle"
                  }
                />
              ))}
            </div>
            <span className="font-mono text-xs font-black text-primary">
              {rating.toFixed(1)}
            </span>
          </div>

          {rev.product?.name ? (
            <span className="max-w-[160px] truncate rounded-lg bg-surface-subtle px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-secondary">
              {rev.product.name}
            </span>
          ) : (
            <MessageSquareQuote
              size={18}
              className="text-subtle transition-colors group-hover:text-muted"
            />
          )}
        </div>

        {/* Review Comment */}
        <p className="mb-6 line-clamp-3 text-xs font-medium italic leading-relaxed text-secondary sm:text-sm">
          &ldquo;{rev.comment}&rdquo;
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border-subtle pt-4 text-[10px] font-black uppercase tracking-widest text-muted">
        <span className="inline-flex items-center gap-1.5 text-success">
          <CheckCircle2 size={12} /> Verified Patron Review
        </span>

        {dateStr && (
          <span className="inline-flex items-center gap-1 font-mono text-muted">
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
        <div className="h-14 w-full animate-pulse rounded-2xl bg-surface" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-44 animate-pulse rounded-3xl bg-surface p-6"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AccountSectionHeader icon={Star} title="My Published Feedback" count={total} />

      {reviews.length === 0 ? (
        <EmptyAccountState message="You haven't published any product reviews yet." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {reviews.map((rev: any) => (
            <CustomerReviewCard key={rev._id} rev={rev} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pt-2">
          <ClientPagination page={page} goToPage={goToPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}

export { CustomerReviewCard, ReviewsContent };
