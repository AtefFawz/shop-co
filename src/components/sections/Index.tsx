import ScreenShop from "./home/Home";
import ProductsGrid from "./newArrIvals/ProductsGrid";
import TopSelling from "./topSelling/TopSelling";
import Browse from "./browse/Browse";
import Rating from "./rating/RatingUi";
export default function Index() {
  return (
    <div>
      <ScreenShop />
      <ProductsGrid />
      <TopSelling />
      <div className="px-2">
        <Browse />
      </div>
      <Rating />
    </div>
  );
}
