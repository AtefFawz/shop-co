import { ScrollingItem, scrollingType } from "@/data/rating";
import HorizontalScrolling from "@/components/common/Scrolling";
import Heading from "@/components/ui/Heading";
export default function RatingUi() {
  return (
    <section className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-10 overflow-hidden">
      <Heading title="OUR HAPPY CUSTOMERS" />
      <div className="flex flex-nowrap overflow-x-auto gap-4 w-full snap-x  snap-mandatory scroll-smooth pb-4 no-scrollbar py-16">
        {ScrollingItem.map((e: scrollingType, id) => (
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
