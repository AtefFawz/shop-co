// import { StaticImageData } from "next/image";

export interface Product {
  _id: string;
  name: string;
  description: string;
  photo: string;
  price: number;
  discount?: number & string;
  category: string;
  isSale: boolean;
  colors: string[];
  size: string[];
  // type: string;
  type: "MEN" | "WOMEN" | "KIDS";
  section: string;
  rating: number;
  isChose: boolean;
  count: number;

  reviews: Array<{
    user: {
      fullName: string;
      avatar: string;
    };
    rating: number;
    comment: string;
  }>;
}
