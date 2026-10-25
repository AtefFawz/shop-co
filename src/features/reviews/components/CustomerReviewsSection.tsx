"use client";

import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { BadgeCheck, Quote, ChevronDown, Sparkles } from "lucide-react";
import StarRating from "@/shared/components/feedback/StarRating";
import { getInitials } from "@/lib/initials";
import { useLocale } from "@/shared/i18n/LocaleProvider";

interface Review {
  fullName: string;
  rating: number;
  comment: string;
  avatar: string;
}

export default function CustomerReviewsSection({ items }: { items: Review }) {
  const { t, direction } = useLocale();
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const cardSpotlight = useMotionTemplate`
    radial-gradient(
      380px circle at ${mouseX}px ${mouseY}px,
      rgba(var(--shadow-rgb),0.035),
      transparent 80%
    )
  `;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[230px] w-full flex-col justify-between rounded-[24px] border border-border/70 bg-surface p-6 shadow-xs md:w-[360px]">
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 animate-pulse rounded-full bg-surface-muted" />
          <div className="h-6 w-12 animate-pulse rounded-full bg-surface-muted" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 animate-pulse rounded-full bg-surface-muted" />
          <div className="space-y-2">
            <div className="h-3.5 w-24 animate-pulse rounded-full bg-surface-muted" />
            <div className="h-2.5 w-16 animate-pulse rounded-full bg-surface-muted" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full animate-pulse rounded-full bg-surface-muted" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-surface-muted" />
        </div>
      </div>
    );
  }

  const fullName = items?.fullName || t("reviewAnonymous");
  const comment = items?.comment || "";
  const rating = Number(items?.rating || 5);
  const isLongText = comment.length > 115;

  const initials = getInitials(fullName, "U");

  const hasValidAvatar = Boolean(items?.avatar) && !imgError;

  return (
    <motion.div
      dir={direction}
      layout
      onMouseMove={handleMouseMove}
      transition={{ type: "spring", stiffness: 360, damping: 30 }}
      className={`group relative flex w-full flex-col justify-between overflow-hidden rounded-[24px] border border-border/80 bg-surface p-5 sm:p-6 shadow-[0_8px_30px_rgba(var(--shadow-rgb),0.03)]  transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_20px_45px_-12px_rgba(var(--shadow-rgb),0.09)]  ${
        isExpanded ? "h-auto" : "min-h-[230px]"
      }`}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: cardSpotlight }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-10 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <Quote
        aria-hidden="true"
        size={64}
        strokeWidth={1.5}
        className="pointer-events-none absolute -top-2 end-2 rotate-12 text-primary/3 transition-all duration-500 group-hover:rotate-6 group-hover:scale-110 group-hover:text-primary/6"
      />

      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <div className="scale-95 origin-start transition-transform duration-300 group-hover:scale-100">
            <StarRating rating={rating} />
          </div>

          <span className="inline-flex items-center gap-1 rounded-full border border-warning-border bg-warning-soft px-2.5 py-0.5 font-mono text-[10px] font-black text-warning">
            <Sparkles size={10} className="text-warning" />
            <span>{rating.toFixed(1)}</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 shrink-0">
            {hasValidAvatar ? (
              <img
                src={items.avatar}
                alt={fullName}
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-full w-full rounded-full border border-border object-cover shadow-2xs transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-action font-mono text-xs font-black text-on-action shadow-xs ring-2 ring-focus/25">
                {initials || "U"}
              </div>
            )}

            <span className="absolute -right-0.5 -bottom-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-surface shadow-2xs">
              <span className="h-2.5 w-2.5 rounded-full bg-success" />
            </span>
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-1.5">
              <h4 className="truncate text-sm font-black tracking-tight text-primary">
                {fullName}
              </h4>
              <BadgeCheck
                size={16}
                className="shrink-0 fill-success text-on-success"
              />
            </div>

            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
              {t("reviewVerifiedClient")}
            </span>
          </div>
        </div>

        <motion.div layout className="relative pt-1">
          <p
            className={`text-[13.5px] leading-relaxed text-secondary transition-colors duration-200 group-hover:text-secondary ${
              isExpanded ? "" : "line-clamp-3"
            }`}
          >
            &ldquo;{comment}&rdquo;
          </p>

          {isLongText && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-3 inline-flex cursor-pointer items-center gap-1 rounded-full border border-border/80 bg-surface-subtle px-3 py-1 text-[10.5px] font-black uppercase tracking-widest text-primary transition-all duration-200 hover:border-border-strong hover:bg-action hover:text-on-action active:scale-95"
            >
              <span>{isExpanded ? t("reviewShowLess") : t("reviewReadMore")}</span>
              <motion.span
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <ChevronDown size={12} />
              </motion.span>
            </button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
