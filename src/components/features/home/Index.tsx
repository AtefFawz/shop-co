import dynamic from "next/dynamic";
import Hero from "./hero/Hero";
const ProductsGrid = dynamic(() => import("./newArrIvals/ProductsGrid"));
const Rating = dynamic(() => import("./rating/RatingUi"));
const Browse = dynamic(() => import("./browse/Browse"));
const TopSelling = dynamic(() => import("./topSelling/TopSelling"));

export default function Index() {
  return (
    <div className="w-full h-full ">
      <Hero />
      <ProductsGrid />
      <TopSelling />
      <div className="px-2">
        <Browse />
      </div>
      <Rating />
    </div>
  );
}
