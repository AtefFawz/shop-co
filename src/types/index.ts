import { StaticImageData } from "next/image";

export interface Product {
  id: number;
  title: string;
  image: StaticImageData;
  price: number;
  discount?: number;
  category: string;
  inSale: boolean;
  rating: number;
  colors: string[];
  sizes: string[];
  isChose: boolean;
  type: "male" | "female";
  section: string;
  count: number;
}
