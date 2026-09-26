"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Card from "@/components/common/Card";
import SecondButton from "@/components/ui/SecondButton";
import Heading from "@/components/ui/Heading";
import { Product } from "@/types/index";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import useData from "@/hooks/getData";
import SpecularButton from "@/components/reactbits/SpecularButton";

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
    router.push("/shop");
  }
  if (loading) {
    return (
      <div className="Responsive grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={`Responsive pt-20 pb-10`}>
      <Heading title="NEW ARRIVALS" />
      <div className="flex flex-wrap justify-items-stretch justify-center w-full gap-2 md:gap-4  ">
        {product.map((item: Product) => (
          <div key={item._id} className=" w-[47.5%] md:w-[31%] lg:w-[22%]">
            <Card product={item} />
          </div>
        ))}
      </div>
      <div className=" w-full flex justify-center items-center py-8 ">
        <SpecularButton
          size="md"
          radius={999}
          baseColor="#99a1af"
          lineColor="#000000"
          tint="#000000"
          tintOpacity={0}
          textColor="#000000"
          blur={1}
          intensity={1}
          shineSize={15}
          shineFade={20}
          thickness={1}
          speed={1.3}
          followMouse={false}
          proximity={250}
          autoAnimate={false}
          className="min-w-[210px] px-10 py-3.5 text-xs font-black uppercase tracking-wider shadow-sm transition-all hover:shadow-md **:font-black!  **:bg-transparent!"
          onClick={() => handelClick()}
        >
          View All
        </SpecularButton>
      </div>
      <hr className="w-full text-gray-300 " />
    </div>
  );
}
