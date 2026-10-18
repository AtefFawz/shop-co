import dynamic from "next/dynamic";
import Hero from "@/features/home/components/StorefrontHero";
const ProductsGrid = dynamic(() => import("@/features/catalog/components/NewArrivalsGrid"));
const Rating = dynamic(() => import("@/features/reviews/components/CustomerTestimonialsSection"));
const Browse = dynamic(() => import("@/features/home/components/StyleCategoryGrid"));
const TopSelling = dynamic(() => import("@/features/catalog/components/BestSellingProductsSection"));

export default function StorefrontContent() {
  return (
    <div className="w-full h-full ">
      <Hero />
      <ProductsGrid />
      <TopSelling />
      {/* <div className="px-2"> */}
      <Browse />
      {/* </div> */}
      <Rating />
    </div>
  );
}
