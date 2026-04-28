"use client";
import { Product } from "@/types";
import Card from "@/components//common/Card";
import Heading from "@/components/ui/Heading";
import { useProduct } from "@/hooks/fetchData";
import { ProductSkeleton } from "@/components/ui/ProductSkeleton";
export const AlsoLike = ({ productItem }: { productItem: Product }) => {
  const { product, loading } = useProduct();

  const filteredProducts = product.filter(
    (item: Product) => item.section === productItem?.section,
  );
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
    <div>
      <Heading
        title={`You may also like`.toLocaleUpperCase()}
        styling=" text-start"
      />
      <div className="flex flex-wrap justify-items-stretch justify-center w-full gap-x-2 md:gap-x-4">
        {filteredProducts.slice(0, 4).map((item: Product) => (
          <div key={item._id} className=" w-[47.8%] md:w-[30%] lg:w-[22%]">
            <Card product={item} />
          </div>
        ))}
      </div>
    </div>
  );
};
