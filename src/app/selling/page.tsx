import { products } from "@/data/data";
import Card from "@/components/common/Card";
import Heading from "@/components/ui/Heading";
export default function selling() {
  const FILTER = products.filter((e) => e.inSale === true);
  return (
    <section className="mt-16 container mx-auto px-2 md:px-4 lg:px-6 xl:px-8 2xl:px-10">
      <Heading title="top sailing" />{" "}
      <div className="grid grid-flow-row-dense md:grid-cols-3 grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-5 py-5 content-center justify-items-center w-full ">
        {FILTER.map((e) => (
          <Card product={e} key={e.id} />
        ))}
      </div>
    </section>
  );
}
