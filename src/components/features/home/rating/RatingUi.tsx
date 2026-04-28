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
    avatar: e.user?.avatar
      ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${e.user.avatar}`
      : "/default-avatar.png",
  }));

  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-10 overflow-hidden  ">
      <Heading title="OUR HAPPY CUSTOMERS" />
      <div className="flex flex-nowrap overflow-x-auto gap-4 w-full snap-x  snap-mandatory scroll-smooth pb-4 no-scrollbar py-5 lg:py-10">
        {result.map((e: Review, id: number) => (
          <div
            key={id}
            className=" snap-center shrink-0 max-w-full first:pl-4 last:pr-4"
          >
            <HorizontalScrolling items={e} />
          </div>
        ))}
      </div>
    </section>
  );
}
