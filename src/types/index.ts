// import { StaticImageData } from "next/image";

export interface Product {
  _id: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  description: string;
  descriptionAr?: string;
  descriptionEn?: string;
  price: number;
  discount?: number;
  category: string;
  categoryAr?: string;
  categoryEn?: string;
  isSale: boolean;
  colors: string[];
  size: string[];
  gender: "MEN" | "WOMEN" | "KIDS" | "UNISEX" | string;
  genderAr?: string;
  genderEn?: string;
  section: string;
  sectionAr?: string;
  sectionEn?: string;
  styleAr?: string;
  styleEn?: string;
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
