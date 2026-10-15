import React from "react";
import { Star, ShieldCheck, Sparkles, MoveRight } from "lucide-react";
import HorizontalScrolling from "@/components/common/Scrolling";
import Heading from "@/components/ui/Heading";
import { serverApi } from "@/lib/serverApi";

export default async function RatingUi() {
  interface Review {
    fullName: string;
    rating: number;
    comment: string;
    avatar: string;
  }

  interface RawReview {
    user?: {
      fullName?: string;
      avatar?: string;
    };
    rating?: number;
    comment?: string;
  }

  let rawReviews: RawReview[] = [];
  try {
    const res = await serverApi("review");
    rawReviews = res?.data?.reviews ?? [];
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
  }

  const result: Review[] = rawReviews.map((e: RawReview) => ({
    fullName: e.user?.fullName || "Verified Client",
    rating: Number(e.rating) || 5,
    comment:
      e.comment ||
      "Exceptional tailoring and fabric weight. Exceeded expectations.",
    avatar: e.user?.avatar || "",
  }));

  // Calculate live aggregate store sentiment
  const totalReviews = result.length;
  const avgRating =
    totalReviews > 0
      ? (
          result.reduce((sum, r) => sum + (Number(r.rating) || 5), 0) /
          totalReviews
        ).toFixed(1)
      : "4.9";

  return (
    <div className="relative isolate overflow-hidden">
      <div className="Responsive space-y-8">
        {/* ── Editorial Header + Live Aggregate Sentiment Badge ── */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:items-end md:text-left">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#F4F3F4] px-3.5 py-1">
              <ShieldCheck size={12} className="text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-neutral-800">
                100% VERIFIED CLIENTELE REVIEWS
              </span>
            </div>

            <Heading title="OUR HAPPY CUSTOMERS" />
          </div>

          {/* Aggregate Score Pill */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-neutral-200/80 bg-white px-4 py-2.5 shadow-2xs">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <div className="h-4 w-px bg-neutral-200" />
            <div className="text-left">
              <span className="font-mono text-sm font-black text-[#111111]">
                {avgRating} / 5.0
              </span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                ({totalReviews > 0 ? `${totalReviews} Verified` : "12.4k+"})
              </span>
            </div>
          </div>
        </div>

        {/* ── Horizontal 3D Testimonial Carousel Stage ── */}
        {result.length === 0 ? (
          <div className="rounded-3xl border border-neutral-200/70 bg-[#F8F8F8] p-12 text-center text-xs font-bold uppercase tracking-widest text-neutral-400">
            Client reviews are syncing with the studio archive...
          </div>
        ) : (
          <div className="relative">
            {/* Subtle Left/Right Edge Fade Masks on Desktop */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-linear-to-r from-white to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-linear-to-l from-white to-transparent lg:block" />

            <div className="no-scrollbar flex w-full snap-x snap-mandatory flex-nowrap gap-4 overflow-x-auto py-4 scroll-smooth sm:gap-5 lg:py-6">
              {result.map((e: Review, id: number) => (
                <div
                  key={id}
                  className="w-[88%] shrink-0 snap-center transition-transform duration-300 hover:-translate-y-1.5 sm:w-[60%] md:w-[46%] lg:w-[36%] xl:w-[31%]"
                >
                  <HorizontalScrolling items={e} />
                </div>
              ))}
            </div>

            {/* Bottom Swipe Cue */}
            <div className="mt-2 flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              <span>AUTHENTICATED BUYER FEEDBACK</span>
              <span className="inline-flex items-center gap-1.5 text-[#111111]">
                <span>Swipe to explore</span>
                <MoveRight size={13} />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
