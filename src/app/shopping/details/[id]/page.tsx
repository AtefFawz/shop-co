import { notFound } from "next/navigation";
import Image from "next/image";
// import { data } from "../../../../lib/api";
import { Product } from "../../../../types";
import StarRating from "@/components/common/StarsRating";
import Pricing from "@/components/common/Pricing";
import Colors from "@/components/common/Colors";
import Sizes from "@/components/common/Sizes";
import Counter from "@/components/sections/details/Counter";
import { Reviews } from "@/components/sections/details/Reviews";
import { AlsoLike } from "@/components/sections/details/AlsoLike";
import { products } from "@/data/data";
import Heading from "@/components/ui/Heading";
// 1.(SEO)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ProductType = products.find((e: Product) => e.id === Number(id));
  if (!ProductType) {
    return {
      title: "This Product Not Found",
    };
  }
  return {
    title: `${ProductType.section} `,

    description: `Learn more about ${ProductType.section} in Shop-co platform`,
  };
}

export default async function DetailsProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productItem = products.find(
    (Product: Product) => Product.id === Number(id),
  );
  if (!productItem) {
    notFound();
  }
  return (
    <section className="container mx-auto h-full mt-32 px-4 md:px-2 lg:px-8 xl:px-10">
      {/* <div> */} <Heading title="The Details" styling="text-start pb-16" />
      {/* </div> */}
      <article className="grid md:grid-cols-3 grid-cols-1 gap-10 justify-between w-full">
        <figure className="md:col-span-1 w-full ">
          <Image
            src={productItem?.image}
            alt={productItem?.title}
            className="aspect-auto rounded-2xl w-full h-full object-cover "
          />
        </figure>{" "}
        <div className="md:col-span-2 w-full xl:space-y-6 space-y-4">
          <div className="xl:space-y-6 space-y-4 ">
            <h1 className="h1-main">{productItem?.title}</h1>
            <StarRating rating={productItem?.rating} />
            <Pricing product={productItem!} />
          </div>
          <div className="border-t border-gray-200 py-3 xl:py-6">
            <h3 className=" text-gray-500 py-3 xl:py-5">Select Colors</h3>
            <div className="flex items-center gap-2 ">
              {productItem?.colors.map((color, id) => (
                <Colors key={id} colors={color} />
              ))}
            </div>
          </div>
          <div className=" border-t border-gray-200 py-3 xl:py-6">
            <h2 className="text-gray-500">Choose Size</h2>
            <div className="flex items-center gap-2 py-3 xl:py-5">
              {productItem?.sizes.map((size, id) => (
                <Sizes key={id} sizes={size} />
              ))}
            </div>
          </div>
          <div className=" border-t border-gray-200 py-3 xl:py-6">
            <h2 className="text-gray-500 pb-3 xl:pb-5 ">Quantity</h2>
            <Counter product={productItem!} />
          </div>
        </div>
      </article>
      <div>
        <Reviews item={productItem!} />
        <AlsoLike productItem={productItem!} />
      </div>
    </section>
  );
}
