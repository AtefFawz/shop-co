"use client";
import Card from "@/components/common/Card";
import { useProduct } from "@/hooks/fetchData";
import Heading from "@/components/ui/Heading";
import { Product } from "@/types";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
import useData from "@/hooks/getData";
import { Pagination } from "@/components/common/Pagination.client";
export default function selling() {
  //   const { product, loading } = useProduct();
  const { data, loading, page, goToPage, totalPages } = useData("/product");
  const product = data?.data?.Products ?? [];
  const FILTER = product.filter((e: Product) => e.isSale == true);

  if (loading) {
    return (
      <div className="container mx-auto px-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <section className=" container mx-auto px-4 lg:px-6 xl:px-8 2xl:px-10">
      <div className="container mx-auto px-4 lg:px-6 xl:px-8 2xl:px-10">
        <Heading title="top sailing" styling="text-start " />{" "}
      </div>
      <div className="flex flex-wrap justify-items-stretch justify-center gap-x-2 md:gap-x-4 w-full ">
        {FILTER.slice(0, 4).map((item: Product) => (
          <div key={item._id} className=" w-[47.5%] md:w-[31%] lg:w-[22%]">
            <Card product={item} />
          </div>
        ))}
      </div>
      <Pagination page={page} goToPage={goToPage} totalPages={totalPages} />
    </section>
  );
}
