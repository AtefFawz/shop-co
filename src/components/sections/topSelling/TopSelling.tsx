"use client";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";
import Heading from "@/components/ui/Heading";
// import { data } from "@/lib/api";
import { products } from "@/data/data";
import BUtton from "@/components/ui/BUtton";
export default function TopSelling() {
  const FILTERING = products.filter((e) => e.inSale === true);
  // console.log(FILTERING);
  const router = useRouter();
  function handelClick() {
    router.push("/selling");
  }
  return (
    <section className="container mx-auto px-2 md:px-4 lg:px-6 xl:px-8 2xl:px-10">
      <div>
        <Heading title="TOP SELLING" />
      </div>
      <div className="grid grid-flow-row-dense md:grid-cols-3 grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 lg:gap-5 py-5 content-center justify-items-center w-full ">
        {FILTERING.slice(0, 4).map((item) => (
          <Card product={item} key={item.id} />
        ))}
      </div>
      <div className="w-full flex justify-center items-center py-6">
        {" "}
        <BUtton textBtn="View All" func={handelClick} />
      </div>
    </section>
  );
}
