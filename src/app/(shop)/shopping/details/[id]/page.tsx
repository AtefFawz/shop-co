import { notFound } from "next/navigation";
import { Product } from "../../../../../types";
import StarRating from "@/components/common/StarsRating";
import Pricing from "@/components/common/Pricing";
import { Reviews } from "@/components/features/home/details/Reviews";
import { AlsoLike } from "@/components/features/home/details/AlsoLike";
import Heading from "@/components/ui/Heading";
import ProductClientWrapper from "@/components/features/home/details/ProductClientWrapper";
import { serverApi } from "@/lib/serverApi";

// ── SEO ──────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: any }>;
}) {
  const { id } = await params;
  const pro = await serverApi("/product");
  const product: Product[] = pro.data.Products;
  const found = product.find((e) => e._id === id);
  if (!found) return { title: "Product Not Found" };
  return {
    title: `${found.name} — Shop.co`,
    description: `Discover ${found.name} in the ${found.section} collection at Shop.co`,
  };
}

export default async function DetailsProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pro = await serverApi("/product/" + id);
  const productItem = pro.data.product;

  if (!productItem) notFound();

  const reviews: { rating: number }[] = productItem.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) /
        reviews.length
      : 0;

  return (
    <>
      <section className=" h-full">
        <div className="  container mx-auto px-4 lg:px-8 xl:px-10 w-full">
          {/* ── Breadcrumb ── */}
          <div className="flex flex-col  w-full">
            <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 px-8">
              <a href="/">Home</a>
              <span className="text-gray-200">/</span>
              <a href="/shopping">Shop</a>
              <span className="text-gray-200">/</span>
              <span className="text-gray-900 truncate max-w-[120px] sm:max-w-none">
                {productItem.name}
              </span>
            </nav>
            <Heading title="The Details" styling="text-start  " />
          </div>
          <article className=" grid md:grid-cols-3 grid-cols-1 gap-10 justify-between w-full">
            <figure className="md:col-span-1 w-full ">
              <img
                src={productItem.photo}
                alt={productItem?.name}
                className="aspect-auto rounded-2xl w-full h-full object-cover "
              />
            </figure>
            <div className="md:col-span-2 w-full xl:space-y-6 space-y-4">
              {/* Name + rating + price */}
              <div className="space-y-3">
                {productItem.category && (
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                    <span className="w-4 h-px bg-gray-300 inline-block" />
                    {productItem.category}
                  </span>
                )}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
                  {productItem.name}
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <StarRating rating={averageRating} />
                  <span className="text-xs font-bold text-gray-400">
                    {averageRating.toFixed(1)}/5
                    <span className="text-gray-300 ml-1.5">
                      ({reviews.length} reviews)
                    </span>
                  </span>
                </div>
                <Pricing product={productItem} />
              </div>

              {/* Description */}
              {productItem.description && (
                <p className="text-sm text-gray-500 leading-relaxed font-medium border-t border-gray-100 pt-4">
                  {productItem.description}
                </p>
              )}
              <div className="border-t w-full border-gray-100 pt-4 space-y-2.5">
                <ProductClientWrapper product={productItem} />
              </div>
            </div>
          </article>
          <div>
            <Reviews item={productItem!} />
            <AlsoLike productItem={productItem!} />
          </div>
        </div>
      </section>
    </>
  );
}
