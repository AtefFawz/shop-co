"use client";

import React, { useState, useEffect, use, useRef } from "react";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import StarRating from "@/shared/components/feedback/StarRating";
import Pricing from "@/features/catalog/components/ProductPrice";
import { ProductReviewList } from "@/features/reviews/components/ProductReviewList";
import { RelatedProductsSection } from "@/features/catalog/components/RelatedProductsSection";
import Heading from "@/shared/components/ui/SectionHeading";
import ProductDetailsClient from "@/features/catalog/components/ProductDetailsClient";
import api from "@/lib/api";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Truck,
  RotateCcw,
  ShieldCheck,
  Bell,
  Sparkles,
  Share2,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Scissors,
  ArrowLeft,
  Flame,
} from "lucide-react";

const getImageUrl = (url?: string) => {
  if (!url?.trim()) return "";
  if (url.startsWith("http")) return url;
  return `https://res.cloudinary.com/dudit0nty/image/upload/${url}`;
};

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t, locale, direction } = useLocale();

  const [productItem, setProductItem] = useState<Product | null>(null);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isNotified, setIsNotified] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState<
    "story" | "specs" | "care"
  >("story");

  // 3D Stage Mouse Tilt
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

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

  useEffect(() => {
    if (productItem?.name) {
      document.title = `${productItem.name} · ${locale === "ar" ? "تفاصيل المنتج" : "Product details"} | SHOP.CO™`;
    }
  }, [productItem?.name, locale]);

  const imageGallery: string[] =
    productItem?.images && productItem.images.length > 0
      ? productItem.images.filter((image): image is string => typeof image === "string" && image.trim().length > 0)
      : productItem?.photo?.trim()
        ? [productItem.photo.trim()]
        : [];

  useEffect(() => {
    if (isPaused || zoomOpen || imageGallery.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % imageGallery.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isPaused, zoomOpen, imageGallery.length]);

  const handleStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 9;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -9;
    setTilt({ x, y });
  };

  const handleStageLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsPaused(false);
  };

  const handleShare = async () => {
    if (typeof window === "undefined") return;
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is unavailable");
      }
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t("productLinkCopied"));
    } catch {
      toast.error(t("productLinkCopyError"));
    }
  };

  // Bespoke 3D Skeleton Loader
  if (isLoading) {
    return (
      <section className="min-h-screen bg-surface-subtle pt-24 pb-16 sm:pt-28">
        <div className="Responsive animate-pulse space-y-6">
          <div className="h-12 w-full rounded-3xl bg-surface" />
          <div className="grid grid-cols-1 gap-8 rounded-[2.5rem] bg-surface p-6 md:grid-cols-12 sm:p-8">
            <div className="aspect-square rounded-3xl bg-surface-muted md:col-span-6" />
            <div className="flex flex-col justify-between space-y-6 md:col-span-6">
              <div className="space-y-3">
                <div className="h-5 w-32 rounded-full bg-surface-hover" />
                <div className="h-10 w-4/5 rounded-2xl bg-surface-hover" />
                <div className="h-6 w-40 rounded-xl bg-surface-hover" />
              </div>
              <div className="h-44 rounded-3xl bg-surface-subtle" />
              <div className="h-14 rounded-2xl bg-surface-hover" />
            </div>
          </div>
        </div>
      </section>
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

  const stock = Number((productItem as any).countInStock ?? 0);
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;
  const shortSku = (productItem._id || "").slice(-6).toUpperCase();

  return (
    <section dir={direction} className="relative isolate min-h-screen overflow-hidden bg-surface-subtle pt-22 pb-16 text-primary sm:pt-26">
      {/* Subtle Studio Grid Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_85%_70%_at_50%_20%,#000_55%,transparent_100%)]"
      />

      {/* ================================================================== */}
      {/* FULLSCREEN LIGHTBOX ZOOM MODAL                                     */}
      {/* ================================================================== */}
      {zoomOpen && currentImage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-action/90 p-4 backdrop-blur-xl animate-in fade-in duration-200">
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute end-6 top-6 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-white/15 text-on-action transition-colors hover:bg-surface hover:text-primary"
          >
            <X size={20} />
          </button>

          <div className="relative h-[82vh] w-full max-w-4xl overflow-hidden rounded-3xl">
            <Image
              src={currentImage}
              alt={productItem.name}
              fill
              quality={95}
              sizes="95vw"
              className="object-contain"
            />
          </div>
        </div>
      )}

      <div className="Responsive relative z-10 space-y-8">
        {/* ================================================================ */}
        {/* 1. TOP BREADCRUMB & QUICK UTILITY BAR                            */}
        {/* ================================================================ */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-surface/90 px-4 py-3.5 shadow-[0_10px_30px_-12px_rgba(var(--shadow-rgb),0.05)] backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-surface-subtle px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary transition-colors hover:bg-action hover:text-on-action"
            >
              <ArrowLeft size={13} />
              <span>{t("back")}</span>
            </button>

            <nav
              aria-label={t("productBreadcrumb")}
              className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted sm:text-xs"
            >
              <Link href="/" className="hover:text-primary transition-colors">
                {t("catalogFlagship")}
              </Link>
              <span>/</span>
              <Link
                href="/shop"
                className="hover:text-primary transition-colors"
              >
                {t("catalogAllCollections")}
              </Link>
              {productItem.category && (
                <>
                  <span>/</span>
                  <span className="text-secondary">
                    {productItem.category}
                  </span>
                </>
              )}
              <span>/</span>
              <span className="max-w-[150px] truncate font-black text-primary sm:max-w-[260px]">
                {productItem.name}
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden rounded-xl border border-border/80 bg-surface-subtle px-3 py-1.5 font-mono text-[10px] font-black text-secondary sm:inline-block">
              SKU #{shortSku}
            </span>

            <button
              type="button"
              onClick={handleShare}
              title={t("productShare")}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border/90 bg-surface px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-primary transition-all hover:border-border-strong hover:bg-action hover:text-on-action"
            >
              <Share2 size={12} />
              <span className="hidden sm:inline">{t("productShare")}</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 2. MAIN 3D ATELIER SHOWROOM CARD                                 */}
        {/* ================================================================ */}
        <div className="overflow-hidden rounded-[2.5rem] border border-border bg-surface p-4 shadow-[0_20px_60px_-18px_rgba(var(--shadow-rgb),0.08)] sm:p-7 lg:p-9">
          <article className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-10 md:items-stretch">
            {/* ── LEFT 6 COLS: 3D INTERACTIVE GALLERY STAGE ── */}
            <div
              className="flex w-full flex-col gap-3.5 md:col-span-6 md:h-full md:flex-row-reverse sm:gap-4"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={handleStageLeave}
            >
              {/* Main 3D Portrait Frame */}
              <div
                ref={stageRef}
                onMouseMove={handleStageMove}
                style={{ perspective: "1200px" }}
                className="relative aspect-[4/4.6] w-full md:aspect-auto md:h-full md:min-h-[500px] md:flex-1"
              >
                <div
                  style={{
                    transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                    transformStyle: "preserve-3d",
                  }}
                  className={`relative h-full w-full overflow-hidden rounded-[1.85rem] border-2 border-border bg-app shadow-[0_20px_50px_-15px_rgba(var(--shadow-rgb),0.12)] transition-transform duration-200 ease-out ${
                    isOutOfStock ? "grayscale opacity-85" : ""
                  }`}
                >
                  {currentImage ? (
                    <Image
                      src={currentImage}
                      alt={productItem.name}
                      fill
                      priority
                      quality={90}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-out hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-muted">
                      <Sparkles size={28} />
                      <span className="mt-2 font-mono text-xs font-black uppercase tracking-widest">
                        {t("productNoImage")}
                      </span>
                    </div>
                  )}

                  {/* Top-Left Status & Sale Badges */}
                  <div className="absolute start-4 top-4 z-20 flex flex-col items-start gap-1.5">
                    {isOutOfStock ? (
                      <span className="rounded-full bg-danger px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-on-danger shadow-md backdrop-blur-md">
                        {t("soldOut")}
                      </span>
                    ) : (
                      <>
                        {productItem.isSale && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-action/90 px-3.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-on-action shadow-md backdrop-blur-md">
                            <Sparkles size={11} className="text-rating" />
                            <span>{t("productSeasonalSale")}</span>
                          </span>
                        )}
                        {isLowStock && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-surface/95 px-3 py-1 text-[9px] font-black uppercase tracking-wider text-warning shadow-sm backdrop-blur-md">
                            <Flame
                              size={11}
                              className="fill-rating text-warning"
                            />
                            {t("productStockLeft")} · {stock}
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {/* Top-Right Fullscreen Zoom Button */}
                  {currentImage && (
                    <button
                      type="button"
                      onClick={() => setZoomOpen(true)}
                      title={t("productInspectImage")}
                      className="absolute end-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-2xl border border-border-subtle bg-surface/85 text-primary shadow-md backdrop-blur-md transition-all hover:scale-105 hover:bg-action hover:text-on-action"
                    >
                      <Maximize2 size={15} />
                    </button>
                  )}

                  {/* Bottom Angle Counter & Prev/Next Controls */}
                  {imageGallery.length > 1 && (
                    <div className="absolute inset-x-4 bottom-4 z-20 flex items-center justify-between">
                      <span className="rounded-full border border-white/40 bg-action/55 px-3 py-1 font-mono text-[10px] font-black uppercase tracking-widest text-on-action backdrop-blur-md">
                        {t("productViewAngle")} 0{activeIdx + 1} / 0{imageGallery.length}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveIdx(
                              (prev) =>
                                (prev - 1 + imageGallery.length) %
                                imageGallery.length,
                            )
                          }
                          aria-label={t("productPreviousImage")}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-surface/90 text-primary shadow-md backdrop-blur-md transition-all hover:bg-action hover:text-on-action"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setActiveIdx(
                              (prev) => (prev + 1) % imageGallery.length,
                            )
                          }
                          aria-label={t("productNextImage")}
                          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-surface/90 text-primary shadow-md backdrop-blur-md transition-all hover:bg-action hover:text-on-action"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {imageGallery.length > 1 && (
                <div className="scrollbar-none flex w-full shrink-0 flex-row gap-2.5 overflow-x-auto py-1 md:h-full md:w-22 md:flex-col md:overflow-y-auto">
                  {imageGallery.map((imgUrl, idx) => {
                    const isActive = activeIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIdx(idx)}
                        onMouseEnter={() => setActiveIdx(idx)}
                        className={`relative h-18 w-18 shrink-0 cursor-pointer overflow-hidden rounded-2xl border-2 bg-surface-subtle transition-all duration-300 sm:h-20 sm:w-20 md:h-22 md:w-full ${
                          isActive
                            ? "scale-[1.03] border-border opacity-100 shadow-md ring-2 ring-focus/10"
                            : "border-transparent opacity-55 hover:opacity-95"
                        }`}
                      >
                        <Image
                          src={getImageUrl(imgUrl)}
                          alt={`${productItem.name} · ${t("productViewAngle")} ${idx + 1}`}
                          fill
                          sizes="88px"
                          className="object-cover object-top"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── RIGHT 6 COLS: ATELIER CONFIGURATION & CHECKOUT ── */}
            <div className="flex flex-col justify-between space-y-6 md:col-span-6">
              <div className="space-y-4">
                {/* Category & Style Pills */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-action px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-on-action">
                      {productItem.category || t("productAtelierGarment")}
                    </span>
                    {(productItem as any).style && (
                      <span className="rounded-full border border-border bg-surface-subtle px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-secondary">
                        {(productItem as any).style}
                      </span>
                    )}
                  </div>

                  {/* Stock Badge */}
                  {stock > 5 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-success-border bg-success-soft px-3 py-1 text-[10px] font-black uppercase tracking-wider text-success">
                      <CheckCircle2 size={12} /> {t("productInStock")} ({stock} {t("productReadyStock")})
                    </span>
                  ) : stock > 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-soft px-3 py-1 text-[10px] font-black uppercase tracking-wider text-warning">
                      <AlertTriangle size={12} /> {t("productLowStock")} ({stock} {t("productStockRemaining")})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-danger-border bg-danger-soft px-3 py-1 text-[10px] font-black uppercase tracking-wider text-danger">
                      <XCircle size={12} /> {t("outOfStock")}
                    </span>
                  )}
                </div>

                {/* Product Title */}
                <h1 className="text-2xl font-black uppercase leading-[1.05] tracking-[-0.04em] text-primary sm:text-3xl lg:text-4xl">
                  {productItem.name}
                </h1>

                {/* Rating & Price Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border-subtle bg-surface-subtle px-4 py-3">
                  <div className={isOutOfStock ? "opacity-60" : ""}>
                    <Pricing product={productItem} />
                  </div>

                  <div className="flex items-center gap-2 border-s border-border/80 ps-4">
                    <StarRating rating={Math.round(averageRating)} />
                    <span className="font-mono text-xs font-black text-primary">
                      {averageRating.toFixed(1)}
                      <span className="font-sans font-medium text-muted">
                        /5
                      </span>
                    </span>
                    <span className="text-[11px] font-bold text-muted">
                      ({reviews.length} {t("productReviewCount")})
                    </span>
                  </div>
                </div>

                {/* Short Editorial Excerpt */}
                <p className="text-xs font-medium leading-relaxed text-muted sm:text-[13px]">
                  {productItem.description ||
                    t("productShortDescriptionFallback")}
                </p>
              </div>

              {/* Selectors + Add to Cart / Out of Stock Notification */}
              <div className="w-full border-t border-border-subtle pt-5">
                {isOutOfStock ? (
                  <div className="space-y-3.5">
                    <div className="rounded-2xl border border-danger-border bg-danger-soft p-4">
                      <p className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-danger">
                        <XCircle size={14} /> {t("productSoldOutNotice")}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">
                        {t("productRestockDescription")}
                      </p>
                    </div>

                    {isNotified ? (
                      <div className="flex items-center gap-2.5 rounded-2xl border border-success-border bg-success-soft p-4 text-xs font-bold text-success">
                        <CheckCircle2 size={16} className="shrink-0" />
                        <span>
                          {t("productRestockConfirmed")}
                        </span>
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          setIsNotified(true);
                          toast.success(t("productRestockActivated"));
                        }}
                        className="flex flex-col gap-2.5 sm:flex-row"
                      >
                        <input
                          type="email"
                          placeholder={t("productRestockPlaceholder")}
                          required
                          className="flex-1 rounded-2xl border border-border bg-surface-subtle px-4 py-3.5 text-xs font-semibold text-primary placeholder:text-muted focus:border-primary focus:bg-surface focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-action px-6 py-3.5 text-xs font-black uppercase tracking-widest text-on-action shadow-md transition-all hover:bg-action-hover active:scale-95"
                        >
                          <Bell size={14} />
                          <span>{t("productNotifyMe")}</span>
                        </button>
                      </form>
                    )}
                  </div>
                ) : (
                  <ProductDetailsClient product={productItem} />
                )}
              </div>

              {/* 3D Trust & Logistics Guarantees */}
              <div className="grid grid-cols-3 gap-2.5 border-t border-border-subtle pt-5">
                <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-surface-subtle p-3 text-center sm:flex-row sm:gap-2">
                  <Truck size={15} className="shrink-0 text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-secondary sm:text-[10px]">
                    {t("productExpressDispatch")}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-surface-subtle p-3 text-center sm:flex-row sm:gap-2">
                  <RotateCcw size={15} className="shrink-0 text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-wider text-secondary sm:text-[10px]">
                    {t("productReturns30Days")}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-surface-subtle p-3 text-center sm:flex-row sm:gap-2">
                  <ShieldCheck
                    size={15}
                    className="shrink-0 text-success"
                  />
                  <span className="text-[9px] font-black uppercase tracking-wider text-secondary sm:text-[10px]">
                    {t("productAuthentic")}
                  </span>
                </div>
              </div>
            </div>
          </article>
        </div>

        {/* ================================================================ */}
        {/* 3. INTERACTIVE ATELIER DOSSIER & SPECIFICATIONS                  */}
        {/* ================================================================ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left 8 Cols: Interactive Tabbed Editorial Details */}
          <div className="flex flex-col justify-between rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)] lg:col-span-8 sm:p-8">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
                <div className="flex items-center gap-2">
                  <Scissors size={16} className="text-primary" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-primary sm:text-base">
                    {t("productDossier")}
                  </h3>
                </div>

                {/* Tab Switcher */}
                <div className="inline-flex rounded-xl border border-border/80 bg-surface-subtle p-1">
                  {[
                    { id: "story", label: t("productDesignNotes") },
                    { id: "care", label: t("productFabricCare") },
                    { id: "specs", label: t("productShippingPolicy") },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSpecTab(tab.id as any)}
                      className={`cursor-pointer rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-wider transition-all ${
                        activeSpecTab === tab.id
                          ? "bg-action text-on-action shadow-2xs"
                          : "text-muted hover:text-primary"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                {activeSpecTab === "story" && (
                  <div className="space-y-3 text-xs leading-relaxed text-secondary sm:text-sm">
                    <p>
                      {productItem.description ||
                        t("productStoryFallback")}
                    </p>
                    <p className="text-muted">
                      {t("productCraftsmanshipNote")}
                    </p>
                  </div>
                )}

                {activeSpecTab === "care" && (
                  <ul className="grid grid-cols-1 gap-2.5 text-xs font-semibold text-secondary sm:grid-cols-2">
                    <li className="flex items-center gap-2 rounded-xl bg-surface-subtle p-3">
                      <CheckCircle2 size={14} className="text-primary" />
                      <span>{t("productWashCold")}</span>
                    </li>
                    <li className="flex items-center gap-2 rounded-xl bg-surface-subtle p-3">
                      <CheckCircle2 size={14} className="text-primary" />
                      <span>{t("productWashInsideOut")}</span>
                    </li>
                    <li className="flex items-center gap-2 rounded-xl bg-surface-subtle p-3">
                      <CheckCircle2 size={14} className="text-primary" />
                      <span>{t("productNoBleach")}</span>
                    </li>
                    <li className="flex items-center gap-2 rounded-xl bg-surface-subtle p-3">
                      <CheckCircle2 size={14} className="text-primary" />
                      <span>{t("productIronLow")}</span>
                    </li>
                  </ul>
                )}

                {activeSpecTab === "specs" && (
                  <div className="space-y-2 text-xs leading-relaxed text-secondary sm:text-sm">
                    <p>
                      {t("productShippingDescription")}
                    </p>
                    <p className="text-muted">
                      {t("productReturnsDescription")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right 4 Cols: Technical Specifications Card */}
          <div className="flex flex-col justify-between rounded-[2.2rem] border border-border bg-surface p-6 shadow-[0_14px_40px_-14px_rgba(var(--shadow-rgb),0.06)] lg:col-span-4 sm:p-8">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                  {t("productTechnicalSpecs")}
                </h3>
                <Layers size={15} className="text-muted" />
              </div>

              <div className="divide-y divide-border-subtle text-xs">
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-semibold text-muted">
                    {t("productArchiveSku")}
                  </span>
                  <span className="font-mono font-black text-primary">
                    #{shortSku}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-semibold text-muted">{t("productCategory")}</span>
                  <span className="font-black uppercase text-primary">
                    {productItem.category || t("productGeneral")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-semibold text-muted">{t("productStyle")}</span>
                  <span className="font-black uppercase text-primary">
                    {(productItem as any).style || t("productContemporary")}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5">
                  <span className="font-semibold text-muted">{t("productDepartment")}</span>
                  <span className="font-black uppercase text-primary">
                    {productItem.section ||
                      (productItem as any).gender ||
                      t("productUnisex")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* 4. REVIEWS & RECOMMENDATIONS                                     */}
        {/* ================================================================ */}
        <div className="mt-14 space-y-16 sm:mt-20 sm:space-y-20">
          <ProductReviewList item={productItem} />
          <RelatedProductsSection productItem={productItem} />
        </div>
      </div>
    </section>
  );
}
