"use client";
import { useState } from "react";
import { Product } from "@/types";
import api from "@/lib/api";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const useProduct = () => {
  const [product, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("keyword") || "";

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get(`product?keyword=${searchTerm}`);
      
      const products = response.data.data.Products;
      const readyData = products.map((item: Product) => {
        const productReviews = item.reviews || [];
        const totalScore = productReviews.reduce(
          (sum: number, rev: any) => sum + rev.rating,
          0,
        );
        const avgRating =
          productReviews.length > 0
            ? (totalScore / productReviews.length).toFixed(1)
            : 0;

        return { ...item, rating: Number(avgRating), isChose: false, count: 1 };
      });

      setProducts(readyData);
    } catch (error: any) {
      console.log(`Error From API => ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm]);

  return { product, loading, fetchProducts };
};
export { useProduct };
