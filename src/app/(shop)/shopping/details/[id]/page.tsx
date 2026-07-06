"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { Product } from "../../../../../types";
import StarRating from "@/components/common/StarsRating";
import Pricing from "@/components/common/Pricing";
import { Reviews } from "@/components/features/home/details/Reviews";
import { AlsoLike } from "@/components/features/home/details/AlsoLike";
import Heading from "@/components/ui/Heading";
import ProductClientWrapper from "@/components/features/home/details/ProductClientWrapper";
import api from "@/lib/api";

export default function DetailsProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [productItem, setProductItem] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const pro = await api.get(`product/${id}`);

        const data = pro.data?.product || pro.data?.data.product || pro.data;

        setProductItem(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-950"></div>
      </div>
    );
  }

  if (!productItem) {
    notFound();
  }

  const reviews = productItem.reviews ?? [];
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) /
        reviews.length
      : 0;

  return (
    <section className="h-full">
      <div className="container mx-auto px-4 lg:px-8 xl:px-10 w-full">
        {/* ── Breadcrumb ── */}
        <div className="flex flex-col w-full">
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-8 px-8">
            <a href="/">Home</a>
            <span className="text-gray-200">/</span>
            <a href="/shopping">Shop</a>
            <span className="text-gray-200">/</span>
            <span className="text-gray-900 truncate max-w-[120px] sm:max-w-none">
              {productItem.name}
            </span>
          </nav>
          <Heading title="The Details" styling="text-start" />
        </div>

        <article className="grid md:grid-cols-3 grid-cols-1 gap-10 justify-between w-full">
          <figure className="md:col-span-1 w-full">
            <img
              src={productItem.photo}
              alt={productItem.name}
              className="aspect-auto rounded-2xl w-full h-full object-cover"
            />
          </figure>
          <div className="md:col-span-2 w-full xl:space-y-6 space-y-4">
            {/* Name + rating + price */}
            <div className="space-y-3">
              {productItem.category && (
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center gap-2">
                  <span className="w-4 h-px bg-gray-300 inline-block" />
                  {productItem.category}
                </span>
              )}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tighter text-gray-900 leading-tight">
                {productItem.name}
              </h1>
              <div className="flex items-center gap-2 flex-wrap">
                <StarRating rating={averageRating} />
                <span className="text-xs font-bold text-gray-400">
                  {averageRating.toFixed(1)}/5
                  <span className="text-gray-300 ml-1.5">
                    ({reviews.length} reviews)
                  </span>
                </span>
              </div>
              <Pricing product={productItem} />
            </div>

            {/* Description */}
            {productItem.description && (
              <p className="text-sm text-gray-500 leading-relaxed font-medium border-t border-gray-100 pt-4">
                {productItem.description}
              </p>
            )}

            <div className="border-t w-full border-gray-100 pt-4 space-y-2.5">
              <ProductClientWrapper product={productItem} />
            </div>
          </div>
        </article>

        <div>
          <Reviews item={productItem} />
          <AlsoLike productItem={productItem} />
        </div>
      </div>
    </section>
  );
}
