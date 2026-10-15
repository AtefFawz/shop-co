import React from "react";

export default function OrderDetailsSkeleton() {
  return (
    <section className="min-h-screen bg-[#F4F3F4] py-6 sm:py-10">
      <div className="Responsive animate-pulse space-y-6">
        {/* Top Action Bar Skeleton */}
        <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-2xs sm:px-6">
          <div className="h-9 w-24 rounded-2xl bg-neutral-200/80" />
          <div className="flex gap-2.5">
            <div className="h-9 w-32 rounded-2xl bg-neutral-200/70" />
            <div className="h-9 w-28 rounded-2xl bg-neutral-200" />
          </div>
        </div>

        {/* Order Header Skeleton */}
        <div className="rounded-[2.2rem] bg-white p-6 shadow-2xs sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-3">
              <div className="h-5 w-32 rounded-full bg-neutral-200" />
              <div className="h-8 w-64 rounded-xl bg-neutral-200" />
              <div className="h-4 w-44 rounded-lg bg-neutral-200/70" />
            </div>
            <div className="h-12 w-40 rounded-2xl bg-neutral-200" />
          </div>
        </div>

        {/* Status Tracker Pipeline Skeleton */}
        <div className="rounded-[2.2rem] bg-white p-6 shadow-2xs sm:p-7">
          <div className="mb-6 h-6 w-56 rounded-lg bg-neutral-200" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-36 rounded-3xl border border-neutral-100 bg-[#F8F8F8] p-5"
              />
            ))}
          </div>
        </div>

        {/* Bottom 2-Column Manifest & Shipping Skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4 rounded-[2.2rem] bg-white p-6 shadow-2xs">
            <div className="h-7 w-40 rounded-lg bg-neutral-200" />
            {[1, 2].map((i) => (
              <div key={i} className="h-28 rounded-3xl bg-[#F8F8F8]" />
            ))}
            <div className="h-32 rounded-3xl bg-neutral-900/10" />
          </div>

          <div className="h-96 rounded-[2.2rem] bg-white p-6 shadow-2xs" />
        </div>
      </div>
    </section>
  );
}
