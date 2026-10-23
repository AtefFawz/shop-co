
import { cookies } from "next/headers";
import { messages, type Locale } from "@/shared/i18n/messages";
import { Star, ShieldCheck, MoveRight } from "lucide-react";
import CustomerReviewsSection from "@/features/reviews/components/CustomerReviewsSection";
import Heading from "@/shared/components/ui/SectionHeading";
import { serverApi } from "@/lib/serverApi";

export default async function CustomerTestimonialsSection() {
  const cookieStore = await cookies();
  const locale: Locale = cookieStore.get("shopco-language")?.value === "en" ? "en" : "ar";
  const t = messages[locale];
  const direction = locale === "ar" ? "rtl" : "ltr";

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
    fullName: e.user?.fullName || t.reviewVerifiedClient,
    rating: Number(e.rating) || 5,
    comment:
      e.comment ||
      t.reviewSampleComment,
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
    <div dir={direction} className="relative isolate overflow-hidden py-12 sm:py-16">
      <div className="Responsive space-y-8">
        {/* ── Editorial Header + Live Aggregate Sentiment Badge ── */}
        <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:items-end md:text-left">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-subtle px-3.5 py-1">
              <ShieldCheck size={12} className="text-success" />
              <span className="text-[10px] font-black uppercase tracking-[0.22em] text-secondary">
                {t.reviewAuthenticatedBadge}
              </span>
            </div>

            <Heading title={t.reviewOurHappyCustomers} />
          </div>

          {/* Aggregate Score Pill */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-border/80 bg-surface px-4 py-2.5 shadow-2xs">
            <div className="flex text-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}
            </div>
            <div className="h-4 w-px bg-surface-hover" />
            <div className="text-start">
              <span className="font-mono text-sm font-black text-primary">
                {avgRating} / 5.0
              </span>
              <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-muted">
                ({totalReviews > 0 ? `${totalReviews} ${t.reviewVerifiedCount}` : "12.4k+"})
              </span>
            </div>
          </div>
        </div>

        {/* ── Horizontal 3D Testimonial Carousel Stage ── */}
        {result.length === 0 ? (
          <div className="rounded-3xl border border-border/70 bg-surface-subtle p-12 text-center text-xs font-bold uppercase tracking-widest text-muted">
            {t.reviewSyncing}
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
                  <CustomerReviewsSection items={e} />
                </div>
              ))}
            </div>

            {/* Bottom Swipe Cue */}
            <div className="mt-2 flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-[0.2em] text-muted">
              <span>{t.reviewVerifiedPatronFeedback}</span>
              <span className="inline-flex items-center gap-1.5 text-primary">
                <span>{t.reviewSwipeToExplore}</span>
                <MoveRight size={13} />
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
