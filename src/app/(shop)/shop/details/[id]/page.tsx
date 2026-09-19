"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product } from "../../../../../types";
import StarRating from "@/components/common/StarsRating";
import Pricing from "@/components/common/Pricing";
import { Reviews } from "@/components/features/home/details/Reviews";
import { AlsoLike } from "@/components/features/home/details/AlsoLike";
import Heading from "@/components/ui/Heading";
import ProductClientWrapper from "@/components/features/home/details/ProductClientWrapper";
import api from "@/lib/api";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Bell,
} from "lucide-react";

const getImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${url}`;
};

export default function DetailsProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [productItem, setProductItem] = useState<Product | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotified, setIsNotified] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const pro = await api.get(`product/${id}`);
        const data = pro.data?.data?.product || pro.data?.product || pro.data;
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

  const imageGallery: string[] =
    productItem?.images && productItem.images.length > 0
      ? productItem.images
      : productItem?.photo
        ? [productItem.photo]
        : [];

  useEffect(() => {
    if (isPaused || imageGallery.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % imageGallery.length);
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, imageGallery.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-black border-t-transparent" />
          <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">
            Loading Product Details...
          </span>
        </div>
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
      : productItem.ratingsAverage || 0;

  const currentImage = getImageUrl(
    imageGallery[activeIdx] || productItem.photo,
  );

  // Calculate actual inventory status
  const stock = Number((productItem as any).countInStock ?? 0);
  const isOutOfStock = stock <= 0;

  return (
    <section className="min-h-screen bg-[#F8F8F8] pt-24 sm:pt-28 pb-16">
      <div className="Responsive">
        <Heading title="Product Details" styling="text-start px-0" />
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-5 sm:mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <span className="text-gray-300">/</span>
          <Link href="/shop" className="hover:text-black transition-colors">
            Shop
          </Link>
          <span className="text-gray-300">/</span>
          {productItem.category && (
            <>
              <span className="hover:text-black transition-colors">
                {productItem.category}
              </span>
              <span className="text-gray-300">/</span>
            </>
          )}
          <span className="text-gray-900 font-black truncate max-w-40 sm:max-w-none">
            {productItem.name}
          </span>
        </nav>

        {/* ── Main Purchase Card ── */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200/70 shadow-xs">
          <article className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 md:items-stretch">
            <div
              className="md:col-span-6 flex flex-col md:flex-row-reverse gap-3 sm:gap-4 w-full md:h-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className={`relative w-full aspect-square md:aspect-auto md:flex-1 md:h-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F0EEED] border border-gray-100 shadow-xs ${
                  isOutOfStock ? "grayscale-35 opacity-90" : ""
                }`}
              >
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={productItem.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold uppercase text-xs">
                    No Image Available
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-3.5 left-3.5 z-20 flex flex-col gap-1.5 items-start">
                  {isOutOfStock ? (
                    <span className="bg-zinc-900/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                      Out of Stock
                    </span>
                  ) : (
                    productItem.isSale && (
                      <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-xs">
                        Sale
                      </span>
                    )
                  )}
                </div>
              </div>

              {imageGallery.length > 1 && (
                <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto w-full md:w-auto md:h-full scrollbar-none shrink-0 py-1">
                  {imageGallery.map((imgUrl, idx) => {
                    const isActive = activeIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIdx(idx)}
                        className={`relative w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-22 rounded-xl sm:rounded-2xl overflow-hidden bg-gray-50 border-2 transition-all shrink-0 cursor-pointer ${
                          isActive
                            ? "border-black shadow-xs scale-[1.02] opacity-100 ring-1 ring-black/10"
                            : "border-gray-200/80 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={getImageUrl(imgUrl)}
                          alt={`${productItem.name} view ${idx + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="md:col-span-6 flex flex-col md:justify-between md:h-full space-y-4 pt-1 md:pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                    {productItem.category || "Clothing"}
                  </span>
                  {(productItem as any).style && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {(productItem as any).style}
                      </span>
                    </>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-gray-950 leading-tight">
                  {productItem.name}
                </h1>

                {/* Rating & Stock */}
                <div className="flex items-center justify-between flex-wrap gap-2 pt-0.5">
                  <div className="flex items-center gap-2">
                    <StarRating rating={Math.round(averageRating)} />
                    <span className="text-xs font-extrabold text-gray-900">
                      {averageRating.toFixed(1)}
                      <span className="text-gray-400 font-medium ml-1">
                        / 5
                      </span>
                    </span>
                    <span className="text-xs text-gray-400 font-bold">
                      ({reviews.length})
                    </span>
                  </div>

                  {stock > 5 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 size={12} /> In Stock ({stock})
                    </span>
                  ) : stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      <AlertTriangle size={12} /> Low Stock ({stock})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      <XCircle size={12} /> Out of Stock
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className={`pt-1 ${isOutOfStock ? "opacity-60" : ""}`}>
                  <Pricing product={productItem} />
                </div>
              </div>

              {/* Selectors + Add to Cart / Out of Stock Form */}
              <div className="border-t border-gray-100 pt-3 w-full">
                {isOutOfStock ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                      <p className="text-xs font-black uppercase tracking-wider text-rose-600 mb-1 flex items-center gap-1.5">
                        <XCircle size={14} /> Currently Unavailable
                      </p>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        This item is currently out of stock. Leave your email to
                        get notified when it becomes available.
                      </p>
                    </div>

                    {isNotified ? (
                      <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-bold">
                        <CheckCircle2 size={16} />
                        <span>
                          Thank you! We'll notify you once it's back in stock.
                        </span>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setIsNotified(true);
                        }}
                        className="flex flex-col sm:flex-row gap-2"
                      >
                        <input
                          type="email"
                          placeholder="Enter your email address"
                          required
                          className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
                        />
                        <button
                          type="submit"
                          className="bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-800 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5"
                        >
                          <Bell size={13} />
                          Notify Me
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <ProductClientWrapper product={productItem} />
                )}
              </div>

              {/* Badges */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <Truck size={13} className="text-black shrink-0" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <RotateCcw size={13} className="text-black shrink-0" />
                  <span>30 Days Return</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-gray-500">
                  <ShieldCheck size={13} className="text-black shrink-0" />
                  <span>100% Original</span>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* ── Details & Specs Section ── */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl p-5 sm:p-8 border border-gray-200/70 shadow-xs">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-widest text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-black" />
              Product Description & Details
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
              {productItem.description ||
                "This piece is crafted with premium fabrics designed for maximum comfort, durability, and a clean silhouette tailored for modern style."}
            </p>
          </div>

          <div className="md:col-span-1 bg-white rounded-3xl p-5 sm:p-8 border border-gray-200/70 shadow-xs flex flex-col justify-center space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 mb-1">
              Specifications
            </h3>
            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-400 font-medium">Category</span>
              <span className="font-bold text-gray-900">
                {productItem.category || "General"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-gray-100">
              <span className="text-gray-400 font-medium">Style</span>
              <span className="font-bold text-gray-900">
                {(productItem as any).style || "Casual"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-gray-400 font-medium">
                Gender / Section
              </span>
              <span className="font-bold text-gray-900">
                {productItem.section || (productItem as any).gender || "All"}
              </span>
            </div>
          </div>
        </div>

        {/* Reviews & Recommendations */}
        <div className="mt-14 sm:mt-20 space-y-14 sm:space-y-20">
          <Reviews item={productItem} />
          <AlsoLike productItem={productItem} />
        </div>
      </div>
    </section>
  );
}
