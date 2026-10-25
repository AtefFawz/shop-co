"use client";

import React, { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  Loader2,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  CornerDownLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { createCurrencyFormatter } from "@/lib/formatCurrency";
import { useDebounce } from "@/hooks/useDebounce";
import { Product } from "@/types";

type ProductSearchBarProps = {
  isMobile?: boolean;
  onClose?: () => void;
};

const getProductImage = (product: Product) => {
  const raw =
    product.photo ||
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : "");
  if (!raw) return "";
  return raw.startsWith("http")
    ? raw
    : `https://res.cloudinary.com/dudit0nty/image/upload/${raw}`;
};

/* -------------------------------------------------------------------------- */
/*                     MAIN EXPORT (WRAPPED IN SUSPENSE)                      */
/* -------------------------------------------------------------------------- */

export default function ProductSearchBar(props: ProductSearchBarProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface-subtle/70 px-4 py-2.5 opacity-60 ${
            props.isMobile ? "h-12 w-full" : "h-11 w-full max-w-[520px]"
          }`}
        >
          <Loader2 size={16} className="animate-spin text-muted" />
        </div>
      }
    >
      <ProductSearchBarContent {...props} />
    </Suspense>
  );
}

/* -------------------------------------------------------------------------- */
/*                         INTERNAL CONTENT COMPONENT                         */
/* -------------------------------------------------------------------------- */

function ProductSearchBarContent({
  isMobile = false,
  onClose,
}: ProductSearchBarProps) {
  const { t, direction, locale } = useLocale();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const containerRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 280);

  const quickTags = [
    t("newArrivals"),
    t("tagStreetwear"),
    t("tagMinimalist"),
    t("sale"),
  ];

  // 1. Global Keyboard Shortcut (⌘K or Ctrl+K) on Desktop + Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsActive(false);
        setSelectedIndex(-1);
      }
    };

    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (
        !isMobile &&
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        inputRef.current?.focus();
        setIsActive(true);
      }
      if (event.key === "Escape" && isActive) {
        setIsActive(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [isMobile, isActive]);

  // 2. Fetch Live Results on Debounced Query
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setSelectedIndex(-1);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/product?keyword=${encodeURIComponent(
            debouncedQuery.trim(),
          )}`,
        );
        const data = await response.json();
        const found =
          data?.data?.Products || data?.Products || data?.data || [];
        setResults(Array.isArray(found) ? found.slice(0, 5) : []);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  // 3. Submit & Navigation Handlers
  const executeSearch = (searchTerm: string) => {
    const clean = searchTerm.trim();
    if (!clean) return;
    router.push(`/shop?keyword=${encodeURIComponent(clean)}`);
    setIsActive(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
    if (onClose) onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleProductClick(results[selectedIndex]._id);
      return;
    }
    executeSearch(query);
  };

  const handleProductClick = (id: string) => {
    router.push(`/shop/details/${id}`);
    setIsActive(false);
    setQuery("");
    setSelectedIndex(-1);
    if (onClose) onClose();
  };

  // 4. Arrow Key Navigation inside Input
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    }
  };

  const currencyFormatter = useMemo(
    () => createCurrencyFormatter(locale, 0),
    [locale],
  );
  const formatPrice = (price: number) =>
    currencyFormatter.format(Number(price || 0));

  return (
    <form
      ref={containerRef}
      dir={direction}
      onSubmit={handleSubmit}
      className={`relative z-50 transition-all duration-300 ${
        isMobile ? "w-full" : "w-full max-w-[520px]"
      }`}
    >
      {/* ================================================================== */}
      {/* INPUT SHELL (ADAPTIVE MOBILE & DESKTOP STYLING)                    */}
      {/* ================================================================== */}
      <div
        className={`group relative flex items-center transition-all duration-300 ${
          isMobile
            ? `h-12 w-full rounded-2xl border px-3.5 ${
                isActive
                  ? "border-border-strong bg-surface shadow-[0_12px_32px_rgba(var(--shadow-rgb),0.12)] ring-4 ring-focus/10"
                  : "border-border bg-surface-subtle/90 shadow-2xs"
              }`
            : `h-11 w-full rounded-2xl border px-3.5 ${
                isActive
                  ? "border-border-strong bg-surface shadow-[0_14px_38px_-6px_rgba(var(--shadow-rgb),0.14)] ring-4 ring-focus/10"
                  : "border-border-subtle bg-surface-subtle/75 hover:border-border hover:bg-surface"
              }`
        }`}
      >
        {/* Left/Start Search Icon Badge */}
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
            isActive
              ? "bg-action text-on-action shadow-2xs"
              : "text-muted group-hover:text-primary"
          }`}
        >
          {isSearching ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Search size={15} strokeWidth={2.5} />
          )}
        </span>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onKeyDown={handleInputKeyDown}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsActive(true);
          }}
          onFocus={() => setIsActive(true)}
          placeholder={t("navSearchDescription")}
          aria-label={t("navSearch")}
          className="h-full min-w-0 flex-1 bg-transparent px-3 text-xs font-bold text-primary outline-none placeholder:font-medium placeholder:text-muted/75 sm:text-[13px]"
        />

        {/* Right/End Controls: Clear Button OR Desktop Shortcut Badge */}
        <div className="flex shrink-0 items-center gap-1.5">
          {query ? (
            <>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setResults([]);
                  setSelectedIndex(-1);
                  inputRef.current?.focus();
                }}
                aria-label={t("navCloseSearch")}
                className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-surface-muted text-muted transition-all hover:bg-action hover:text-on-action active:scale-90"
              >
                <X size={13} strokeWidth={2.5} />
              </button>

              <button
                type="submit"
                aria-label={t("searchGo")}
                className="hidden h-7 cursor-pointer items-center gap-1 rounded-xl bg-action px-2.5 text-[10px] font-black uppercase tracking-wider text-on-action shadow-2xs transition-transform hover:scale-105 active:scale-95 sm:inline-flex"
              >
                <span>{t("searchGo")}</span>
                <CornerDownLeft size={11} />
              </button>
            </>
          ) : !isMobile ? (
            <kbd className="pointer-events-none hidden select-none items-center gap-0.5 rounded-lg border border-border-subtle bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-muted shadow-2xs sm:inline-flex">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          ) : onClose ? (
            <button
              type="button"
              onClick={onClose}
              aria-label={t("navCloseSearch")}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-xl bg-surface-muted text-muted transition-colors hover:text-primary"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
      </div>

      {/* ================================================================== */}
      {/* FLOATING 3D COMMAND PALETTE DROPDOWN                               */}
      {/* ================================================================== */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full mt-2.5 overflow-hidden rounded-3xl border border-border bg-surface/95 shadow-[0_24px_60px_-12px_rgba(var(--shadow-rgb),0.22)] backdrop-blur-2xl"
          >
            {/* Top Progress Shimmer when Searching */}
            {isSearching && (
              <div className="h-0.5 w-full overflow-hidden bg-surface-muted">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-action" />
              </div>
            )}

            {/* CASE 1: Empty Query -> Show Curated Quick Tags */}
            {!query.trim() ? (
              <div className="p-4">
                <div className="mb-2.5 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                  <TrendingUp size={12} className="text-primary" />
                  <span>{t("curated")}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {quickTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setQuery(tag);
                        executeSearch(tag);
                      }}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border-subtle bg-surface-subtle px-3 py-1.5 text-[11px] font-bold text-secondary transition-all hover:-translate-y-0.5 hover:border-border-strong hover:bg-action hover:text-on-action"
                    >
                      <Sparkles size={11} />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* CASE 2: Active Query -> Show Live Catalog Matches */
              <div>
                {/* Status Header */}
                <div className="flex items-center justify-between border-b border-border-subtle/70 bg-surface-subtle/50 px-4 py-2.5">
                  <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
                    <Sparkles size={11} className="text-primary" />
                    {isSearching
                      ? t("searchSearchingCatalog")
                      : t("searchTopMatches")}
                  </span>

                  {!isSearching && results.length > 0 && (
                    <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[10px] font-black text-primary shadow-2xs">
                      {results.length}
                    </span>
                  )}
                </div>

                {/* Results List */}
                <div className="max-h-[340px] divide-y divide-border-subtle/40 overflow-y-auto overscroll-contain p-1.5">
                  {results.length > 0
                    ? results.map((product, idx) => {
                        const imgUrl = getProductImage(product);
                        const isHighlighted = idx === selectedIndex;

                        return (
                          <button
                            key={product._id}
                            type="button"
                            onMouseEnter={() => setSelectedIndex(idx)}
                            onClick={() => handleProductClick(product._id)}
                            className={`group flex w-full cursor-pointer items-center justify-between gap-3 rounded-2xl p-2.5 text-start transition-all ${
                              isHighlighted
                                ? "bg-action text-on-action shadow-sm"
                                : "hover:bg-surface-subtle"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              {/* Product Thumbnail */}
                              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-border-subtle bg-surface-muted">
                                {imgUrl ? (
                                  <img
                                    src={imgUrl}
                                    alt={product.name}
                                    className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-muted">
                                    <Search size={14} className="opacity-30" />
                                  </div>
                                )}
                              </div>

                              {/* Title & Category */}
                              <div className="min-w-0">
                                <p
                                  className={`truncate text-xs font-black uppercase tracking-tight sm:text-[13px] ${
                                    isHighlighted
                                      ? "text-on-action"
                                      : "text-primary"
                                  }`}
                                >
                                  {product.name}
                                </p>

                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                  <span
                                    className={`font-mono text-[11px] font-black ${
                                      isHighlighted
                                        ? "text-on-action/90"
                                        : "text-primary"
                                    }`}
                                  >
                                    {formatPrice(product.price)}
                                  </span>

                                  {product.category && (
                                    <span
                                      className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                        isHighlighted
                                          ? "bg-white/15 text-on-action"
                                          : "bg-surface-muted text-secondary"
                                      }`}
                                    >
                                      {product.category}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Inspect Arrow */}
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                                isHighlighted
                                  ? "bg-white/15 text-on-action"
                                  : "bg-surface-subtle text-muted group-hover:bg-action group-hover:text-on-action"
                              }`}
                            >
                              <ArrowUpRight size={14} />
                            </span>
                          </button>
                        );
                      })
                    : !isSearching && (
                        <div className="px-4 py-8 text-center">
                          <div className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-subtle text-muted">
                            <Search size={18} />
                          </div>
                          <p className="text-xs font-black uppercase tracking-wider text-primary">
                            {t("noMatchingProducts")}
                          </p>
                          <p className="mt-1 text-[11px] text-muted">
                            {t("noMatchingProductsHint")}
                          </p>
                        </div>
                      )}
                </div>

                {/* View All Results Footer Button */}
                {results.length > 0 && (
                  <div className="border-t border-border-subtle/70 bg-surface-subtle/40 p-2">
                    <button
                      type="submit"
                      className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-action py-3 text-[10.5px] font-black uppercase tracking-[0.16em] text-on-action shadow-sm transition-all hover:opacity-95 active:scale-[0.99]"
                    >
                      <span>
                        {t("searchViewAllResults").replace(
                          "{query}",
                          query.trim(),
                        )}
                      </span>
                      <ArrowUpRight
                        size={13}
                        className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
