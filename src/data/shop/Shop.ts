import screenShop from "@/assets/shop/screenShop.png";
import { StaticImageData } from "next/image";
interface shopDataType extends types {
  btnText: string;
  image: StaticImageData;
}

export const itemShop: shopDataType = {
  title: "FIND CLOTHES THAT MATCHES YOUR STYLE",
  description:
    "Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.",
  btnText: "Shop Now",
  image: screenShop,
};
interface types {
  title: string;
  description: string;
}
export const items: types[] = [
  { title: "200+", description: "International Brands" },
  { title: "2,000+", description: "High-Quality Products" },
  { title: "30,000+", description: "Happy Customers" },
];

export const brands: string[] = [
  "VERSACE",
  "ZARA",
  "GUCCI",
  "PRADA",
  "CALVINKLEIN",
];
