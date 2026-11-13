"use client";

import { getStockCount } from "@/lib/stock";
import { memo, useMemo, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  Eye,
  Flame,
  GitCompareArrows,
  Heart,
  Sparkles,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

import Pricing from "@/features/catalog/components/ProductPrice";
import { Product } from "@/types";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useWishlistStore } from "@/store/wishlistStore";
import { resolveImageUrl } from "@/lib/imageUrl";
import { useCompareStore } from "@/store/compareStore";
import { saveForLater } from "@/features/engagement/api";

/**
 * Design notes
 * ------------
 * - Editorial "lookbook" card: borderless, image first, quiet typography underneath.
 * - Responsive by the card's OWN width (container queries: `@min-[240px]:` …), not the viewport,
 *   so the same card is correct in a 2-column phone grid, a 5-column desktop grid or a slider.
 * - Cheap to render: no framer-motion, no timers, no backdrop-blur. Only the visible photo
 *   (plus the next one once the user shows intent) is mounted.
 * - Gallery: mouse-scrub on desktop, swipe on touch, ← / → on keyboard.
 */

/** Horizontal distance (px) a touch must travel before it counts as a swipe. */
const SWIPE_THRESHOLD = 28;
const MAX_COMPARE = 4;

/* -------------------------------------------------------------------------- */
/*                               SMALL PIECES                                 */
/* -------------------------------------------------------------------------- */

function RailButton({
  label,
  onClick,
  children,
  active = false,
  activeClass = "bg-action text-on-action",
  disabled = false,
  pressed,
}: {
  label: string;
  onClick(): void;
  children: ReactNode;
  active?: boolean;
  activeClass?: string;
  disabled?: boolean;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      className={`grid size-8 cursor-pointer place-items-center rounded-full shadow-sm ring-1 ring-border/70 transition-[color,background-color,transform] duration-200 hover:scale-105 active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:opacity-50 motion-reduce:transition-none @min-[240px]:size-9 ${
        active ? activeClass : "bg-surface text-secondary hover:text-primary"
      }`}
    >
      {children}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    CARD                                    */
/* -------------------------------------------------------------------------- */

function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  /** Only set for above-the-fold cards. */
  priority?: boolean;
}) {
  const { t, direction } = useLocale();
  const isRtl = direction === "rtl";

  const isSaved = useWishlistStore((state) =>
    state.items.some((item) => item._id === product._id),
  );
  const toggleSaved = useWishlistStore((state) => state.toggleItem);
  const isCompared = useCompareStore((state) =>
    state.items.some((item) => item._id === product._id),
  );
  const toggleCompare = useCompareStore((state) => state.toggle);
  const [savingLater, setSavingLater] = useState(false);
  const detailUrl = `/shop/details/${product._id}`;

  // Stock
  const stockCount = getStockCount(product);
  const isOutOfStock = stockCount <= 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;

  // Normalised image list
  const images = useMemo<string[]>(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0,
      );
    }
    return product.photo ? [product.photo] : [];
  }, [product.images, product.photo]);

  /* ------------------------------ gallery state ------------------------------ */
  const total = images.length;
  const [activeIdx, setActiveIdx] = useState(0);
  const [mounted, setMounted] = useState(1); // how many images are in the DOM

  const rectRef = useRef<DOMRect | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const goTo = (index: number) => {
    if (total < 2) return;
    const next = ((index % total) + total) % total;
    setActiveIdx(next);
    setMounted((count) => Math.max(count, Math.min(total, next + 2)));
  };

  const warmUp = () => {
    if (total > 1) setMounted((count) => Math.max(count, 2));
  };

  const onPointerEnter = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    rectRef.current = event.currentTarget.getBoundingClientRect();
    warmUp();
  };

  const onPointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse" || total < 2 || !rectRef.current) return;
    const { left, width } = rectRef.current;
    let ratio = Math.min(0.999, Math.max(0, (event.clientX - left) / width));
    if (isRtl) ratio = 1 - ratio;
    goTo(Math.floor(ratio * total)); // setState bails out when the index is unchanged
  };

  const onPointerLeave = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    rectRef.current = null;
    setActiveIdx(0);
  };

  const onPointerDown = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === "mouse") return;
    touchStart.current = { x: event.clientX, y: event.clientY };
    swiped.current = false;
    warmUp();
  };

  const onPointerUp = (event: PointerEvent<HTMLAnchorElement>) => {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start || event.pointerType === "mouse") return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy) * 1.2) {
      return;
    }
    // Content follows the finger: LTR → swipe left = next, RTL → swipe right = next.
    const forward = isRtl ? dx > 0 : dx < 0;
    swiped.current = true;
    goTo(activeIdx + (forward ? 1 : -1));
  };

  const onImageClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // A swipe must not also open the product page.
    if (swiped.current) {
      event.preventDefault();
      swiped.current = false;
    }
  };

  const onImageKeyDown = (event: KeyboardEvent<HTMLAnchorElement>) => {
    if (total < 2) return;
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const forward = (event.key === "ArrowRight") !== isRtl;
    goTo(activeIdx + (forward ? 1 : -1));
  };

  /* --------------------------------- actions --------------------------------- */
  const handleWishlist = () => {
    toggleSaved(product);
    toast.success(t(isSaved ? "removeFromWishlist" : "addToWishlist"));
  };

  const handleCompare = () => {
    // Read at click time instead of subscribing: no re-render of every card when the count changes.
    const count = useCompareStore.getState().items.length;
    if (!isCompared && count >= MAX_COMPARE) {
      toast.error(
        isRtl
          ? "يمكنك مقارنة 4 منتجات كحد أقصى"
          : "You can compare up to 4 products",
      );
      return;
    }
    toggleCompare(product);
    toast.success(
      isCompared
        ? isRtl
          ? "تمت الإزالة من المقارنة"
          : "Removed from comparison"
        : isRtl
          ? "أُضيف المنتج للمقارنة"
          : "Added to comparison",
    );
  };

  const handleSaveLater = async () => {
    setSavingLater(true);
    try {
      await saveForLater(product._id);
      toast.success(
        isRtl
          ? "تم الحفظ لوقت لاحق — ستجده في مساحتك"
          : "Saved for later — find it in My Space",
      );
    } catch {
      toast.error(
        isRtl ? "سجّل الدخول لحفظ المنتج" : "Sign in to save this item",
      );
    } finally {
      setSavingLater(false);
    }
  };

  const categoryLabel =
    product.category || product.section || t("productAtelierEdit");
  const ratingValue = Number(product?.ratingsAverage || 0);
  const name = product.name || product.description;

  // Secondary rail buttons: revealed on hover / keyboard focus, always visible on touch devices.
  const revealOnIntent =
    "-translate-y-1 opacity-0 transition-[opacity,translate] duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 [@media(pointer:coarse)]:translate-y-0 [@media(pointer:coarse)]:opacity-100 motion-reduce:transition-none";

  return (
    <article
      dir={direction}
      // Entrance is pure CSS (@starting-style): no observers or JS animation per card.
      className="@container group relative flex h-full w-full min-w-0 flex-col transition-[translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
    >
      {/* ================================ IMAGE ================================ */}
      <div className="relative">
        <Link
          href={detailUrl}
          aria-label={`${t("productViewProduct")}: ${product.name || t("products")}`}
          onPointerEnter={onPointerEnter}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            touchStart.current = null;
          }}
          onClick={onImageClick}
          onKeyDown={onImageKeyDown}
          onFocus={warmUp}
          className="relative block aspect-[4/5] w-full touch-pan-y overflow-hidden rounded-xl bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 @min-[240px]:rounded-2xl @min-[340px]:rounded-3xl"
        >
          {total > 0 ? (
            images.slice(0, mounted).map((imgUrl, idx) => (
              <div
                key={`${imgUrl}-${idx}`}
                aria-hidden={idx !== activeIdx}
                className={`absolute inset-0 transition-opacity duration-300 ease-out motion-reduce:transition-none ${
                  idx === activeIdx ? "z-10 opacity-100" : "z-0 opacity-0"
                }`}
              >
                <Image
                  src={resolveImageUrl(imgUrl)}
                  alt={idx === 0 ? name || t("productImageAlt") : ""}
                  fill
                  quality={75}
                  priority={priority && idx === 0}
                  fetchPriority={idx === 0 && priority ? "high" : "auto"}
                  sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw"
                  draggable={false}
                  className={`select-none object-cover object-top transition-transform duration-700 ease-out md:group-hover:scale-[1.04] motion-reduce:transition-none ${
                    isOutOfStock ? "grayscale opacity-70" : ""
                  }`}
                />
              </div>
            ))
          ) : (
            <div className="grid h-full w-full place-items-center text-muted">
              <span className="flex flex-col items-center gap-1">
                <Sparkles size={18} />
                <span className="text-xs font-bold tracking-[0.2em]">
                  SHOP.CO
                </span>
              </span>
            </div>
          )}

          {/* Hairline edge so light photos keep their shape on light backgrounds */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] ring-1 ring-inset ring-black/5"
          />

          {/* Bottom shade: keeps the indicator readable on any photo (plain gradient, no blur) */}
          {total > 1 && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-14 bg-linear-to-t from-black/35 to-transparent"
            />
          )}

          {/* Sale / sold-out chip */}
          <div className="absolute start-2 top-2 z-30 @min-[240px]:start-3 @min-[240px]:top-3">
            {product.isSale && !isOutOfStock && (
              <span className="inline-flex items-center gap-1 rounded-full bg-action px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-on-action shadow-sm @min-[240px]:px-2.5 @min-[240px]:py-1 @min-[240px]:text-[11px]">
                <Sparkles size={10} className="text-rating" />
                {t("sale")}
              </span>
            )}
          </div>

          {isOutOfStock && (
            <span className="absolute inset-0 z-30 grid place-items-center">
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold tracking-wide text-primary shadow-md">
                {t("soldOut")}
              </span>
            </span>
          )}

          {/* Photo position: one segment per photo. Driven by hover / swipe / arrow keys. */}
          {total > 1 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-3 bottom-2.5 z-30 flex items-center gap-1 @min-[240px]:inset-x-4 @min-[240px]:bottom-3"
            >
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`h-[3px] flex-1 rounded-full transition-colors duration-200 ${
                    i === activeIdx ? "bg-white" : "bg-white/45"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Quick view (wide screens only; sits above the indicator) */}
          {!isOutOfStock && (
            <span className="pointer-events-none absolute inset-x-3 bottom-8 z-30 hidden translate-y-2 opacity-0 transition-[translate,opacity] duration-300 ease-out md:flex md:group-hover:translate-y-0 md:group-hover:opacity-100 motion-reduce:transition-none @min-[240px]:inset-x-4">
              <span className="flex w-full items-center justify-between rounded-full bg-surface px-4 py-2 text-xs font-bold text-primary shadow-lg">
                <span className="inline-flex items-center gap-1.5">
                  <Eye size={13} />
                  {t("quickView")}
                </span>
                <ArrowUpRight size={14} className={isRtl ? "-scale-x-100" : ""} />
              </span>
            </span>
          )}
        </Link>

        {/* Action rail: wishlist is always there; compare / save-later appear on intent */}
        <div className="absolute end-2 top-2 z-40 flex flex-col items-center gap-1.5 @min-[240px]:end-3 @min-[240px]:top-3 @min-[240px]:gap-2">
          <RailButton
            label={isSaved ? t("removeFromWishlist") : t("addToWishlist")}
            pressed={isSaved}
            onClick={handleWishlist}
          >
            <Heart
              size={16}
              className={isSaved ? "text-danger" : ""}
              fill={isSaved ? "currentColor" : "none"}
            />
          </RailButton>

          <div className={revealOnIntent}>
            <RailButton
              label={isRtl ? "قارن" : "Compare"}
              pressed={isCompared}
              active={isCompared}
              onClick={handleCompare}
            >
              <GitCompareArrows size={15} />
            </RailButton>
          </div>

          <div className={revealOnIntent}>
            <RailButton
              label={isRtl ? "احفظ لاحقًا" : "Save for later"}
              disabled={savingLater}
              onClick={handleSaveLater}
            >
              <Bookmark size={15} />
            </RailButton>
          </div>
        </div>
      </div>

      {/* ================================ DETAILS ================================ */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-0.5 pt-3 @min-[240px]:gap-2 @min-[240px]:pt-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted @min-[240px]:text-[11px]">
            {categoryLabel}
          </span>

          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-muted @min-[240px]:text-xs">
            {ratingValue > 0 ? (
              <>
                <Star size={12} className="fill-rating text-rating" />
                {ratingValue.toFixed(1)}
              </>
            ) : (
              t("productNewLabel")
            )}
          </span>
        </div>

        <Link href={detailUrl} className="block min-w-0">
          <h4
            title={product.name}
            className={`line-clamp-2 min-h-[2.6em] text-[13px] font-semibold leading-snug tracking-tight transition-colors @min-[240px]:text-sm @min-[340px]:text-base ${
              isOutOfStock ? "text-muted" : "text-primary hover:text-secondary"
            }`}
          >
            {name}
          </h4>
        </Link>

        {isLowStock && (
          <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-warning @min-[240px]:text-xs">
            <Flame size={12} className="fill-rating" />
            <span>
              {stockCount} {t("leftInStock")}
            </span>
          </p>
        )}

        <div
          className={`mt-auto w-full min-w-0 overflow-hidden pt-1 [&>*]:flex-wrap [&>*]:items-baseline [&>*]:gap-x-1.5 [&>*]:gap-y-1 ${
            isOutOfStock ? "opacity-55" : ""
          }`}
        >
          <Pricing product={product} />
        </div>
      </div>
    </article>
  );
}

// Cards sit in long lists: skip re-rendering them unless their own props change.
export default memo(ProductCard);