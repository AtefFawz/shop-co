// import { StaticImageData } from "next/image";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount?: number | string;
  category: string;
  isSale: boolean;
  colors: string[];
  size: string[];
  gender: "MEN" | "WOMEN" | "KIDS";
  section: string;
  rating: number;
  isChose: boolean;
  count: number;
  ratingsAverage: number;
  style: string;
  countInStock: number;
  photo: string;
  images: string[];
  reviews: Array<{
    user: {
      fullName: string;
      avatar: string;
    };
    rating: number;
    comment: string;
  }>;
}
