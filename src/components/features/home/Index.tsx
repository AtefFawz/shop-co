import Hero from "./hero/Hero";
import ProductsGrid from "./newArrIvals/ProductsGrid";
import TopSelling from "./topSelling/TopSelling";
import Browse from "./browse/Browse";
import Rating from "./rating/RatingUi";
// import { Shop } from "./shop/shop";
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
      {/* <Shop /> */}
    </div>
  );
}
