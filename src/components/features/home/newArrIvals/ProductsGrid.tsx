"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/common/Card";
import SecondButton from "@/components/ui/SecondButton";
import Heading from "@/components/ui/Heading";
import { Product } from "@/types/index";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import useData from "@/hooks/getData";
export default function NewArrivals() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword") || "";

  const { data, loading } = useData("/product", {
    params: {
      keyword: keyword || undefined,
    },
    limit: 8,
  });

  const product = data?.data?.Products ?? [];

  const router = useRouter();
  function handelClick() {
    router.push("/shopping");
  }
  if (loading) {
    return (
      <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <section className={`Responsive`}>
      <Heading title="NEW ARRIVALS" />
      <div className="flex flex-wrap justify-items-stretch justify-center w-full gap-2 md:gap-4  ">
        {product.map((item: Product) => (
          <div key={item._id} className=" w-[47.5%] md:w-[31%] lg:w-[22%]">
            <Card product={item} />
          </div>
        ))}
      </div>
      <div className=" w-full flex justify-center items-center py-8">
        <SecondButton textBtn="View All" func={handelClick} />
      </div>
      <hr className="w-full text-gray-300 " />
    </section>
  );
}
