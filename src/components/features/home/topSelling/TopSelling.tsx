"use client";
import { useRouter } from "next/navigation";
import Card from "@/components/common/Card";
import Heading from "@/components/ui/Heading";
import SecondButton from "@/components/ui/SecondButton";
import { useProduct } from "@/hooks/fetchData";
import { Product } from "@/types/index";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
export default function TopSelling() {
  const { product, loading } = useProduct();
  const FILTERING = product.filter((e: Product) => e.isSale === true);
  const router = useRouter();
  function handelClick() {
    router.push("/selling");
  }
  if (loading) {
    return (
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 md:px-4 lg:px-6 xl:px-8 2xl:px-10 pb-8 ">
      <Heading title="TOP SELLING" />

      <div className="flex flex-wrap justify-items-stretch justify-center gap-x-2 md:gap-x-4 w-full ">
        {FILTERING.slice(0, 4).map((item: Product) => (
          <div key={item._id} className=" w-[47.5%] md:w-[31%] lg:w-[22%]">
            <Card product={item} />
          </div>
        ))}
      </div>
      <div className="w-full flex justify-center items-center py-6">
        {" "}
        <SecondButton textBtn="View All" func={handelClick} />
      </div>
    </div>
  );
}
