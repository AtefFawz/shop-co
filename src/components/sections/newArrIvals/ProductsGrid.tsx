"use client";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";
import BUtton from "@/components/ui/BUtton";
import Heading from "@/components/ui/Heading";
// import { data } from "@/lib/api";
import { products } from "@/data/data";

import { Product } from "@/types/index";
export default function NewArrivals() {
  const router = useRouter();
  function handelClick() {
    router.push("/shopping");
  }
  return (
    <section className="px-2 md:px-4 lg:px-6 container mx-auto ">
      <Heading title="NEW ARRIVALS" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center content-stretch gap-2 md:gap-4 py-5 ">
        {products.map((item: Product) => (
          <Card product={item} key={item.id} />
        ))}
      </div>
      <div className=" w-full flex justify-center items-center py-8">
        <BUtton textBtn="View All" func={handelClick} />
      </div>
      <hr className="w-full my-10 text-gray-300 " />
    </section>
  );
}
