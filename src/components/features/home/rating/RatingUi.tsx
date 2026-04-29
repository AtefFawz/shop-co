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
    user: {
      fullName: string;
      avatar: string;
    };
    rating: number;
    comment: string;
  }

  const res = await serverApi("/review");
  const products = res.data.reviews;
  const result = products.map((e: RawReview) => ({
    fullName: e.user?.fullName || "Anonymous",
    rating: e.rating,
    comment: e.comment,
    avatar: e.user?.avatar,
  }));

  return (
    <section
      className="Responsive overflow-hidden
      "
    >
      <Heading title="OUR HAPPY CUSTOMERS" />
      <div
        className="
          flex flex-nowrap overflow-x-auto
          w-full
          pb-4 py-5
          gap-2 snap-x snap-mandatory scroll-smooth no-scrollbar
          lg:py-10
        "
      >
        {result.map((e: Review, id: number) => (
          <div
            key={id}
            className="
              flex-shrink-0
              w-full
              px-4
              snap-center first:pl-4 last:pr-4
              md:w-1/2
              lg:w-2/5
              xl:w-2/6
              2xl:w-1/4
            "
          >
            <HorizontalScrolling items={e} />
          </div>
        ))}
      </div>
    </section>
  );
}
