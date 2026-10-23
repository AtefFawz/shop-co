

export default function OrderDetailsSkeleton() {
  return (
    <section className="min-h-screen bg-surface-subtle py-6 sm:py-10">
      <div className="Responsive animate-pulse space-y-6">
        {/* Top Action Bar Skeleton */}
        <div className="flex items-center justify-between rounded-3xl bg-surface p-4 shadow-2xs sm:px-6">
          <div className="h-9 w-24 rounded-2xl bg-surface-hover/80" />
          <div className="flex gap-2.5">
            <div className="h-9 w-32 rounded-2xl bg-surface-hover/70" />
            <div className="h-9 w-28 rounded-2xl bg-surface-hover" />
          </div>
        </div>

        {/* Order Header Skeleton */}
        <div className="rounded-[2.2rem] bg-surface p-6 shadow-2xs sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-3">
              <div className="h-5 w-32 rounded-full bg-surface-hover" />
              <div className="h-8 w-64 rounded-xl bg-surface-hover" />
              <div className="h-4 w-44 rounded-lg bg-surface-hover/70" />
            </div>
            <div className="h-12 w-40 rounded-2xl bg-surface-hover" />
          </div>
        </div>

        {/* Status Tracker Pipeline Skeleton */}
        <div className="rounded-[2.2rem] bg-surface p-6 shadow-2xs sm:p-7">
          <div className="mb-6 h-6 w-56 rounded-lg bg-surface-hover" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-36 rounded-3xl border border-border-subtle bg-surface-subtle p-5"
              />
            ))}
          </div>
        </div>

        {/* Bottom 2-Column Manifest & Shipping Skeleton */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-4 rounded-[2.2rem] bg-surface p-6 shadow-2xs">
            <div className="h-7 w-40 rounded-lg bg-surface-hover" />
            {[1, 2].map((i) => (
              <div key={i} className="h-28 rounded-3xl bg-surface-subtle" />
            ))}
            <div className="h-32 rounded-3xl bg-action/10" />
          </div>

          <div className="h-96 rounded-[2.2rem] bg-surface p-6 shadow-2xs" />
        </div>
      </div>
    </section>
  );
}
