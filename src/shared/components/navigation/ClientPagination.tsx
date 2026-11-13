"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type ClientPaginationProps = {
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
};

const getPageNumbers = (current: number, total: number, isMobile: boolean) => {
  if (total <= (isMobile ? 5 : 7)) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const delta = isMobile ? 1 : 2;
  const range: number[] = [];
  const pagesWithDots: (number | string)[] = [];
  let prev: number | undefined;

  for (let i = 1; i <= total; i++) {
    if (
      i === 1 ||
      i === total ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const num of range) {
    if (prev) {
      if (num - prev === 2) {
        pagesWithDots.push(prev + 1);
      } else if (num - prev > 2) {
        pagesWithDots.push("...");
      }
    }
    pagesWithDots.push(num);
    prev = num;
  }

  return pagesWithDots;
};

export const ClientPagination = ({ page, totalPages, goToPage }: ClientPaginationProps) => {
  const { t, direction } = useLocale();
  if (totalPages <= 1) return null;

  const desktopPages = getPageNumbers(page, totalPages, false);
  const mobilePages = getPageNumbers(page, totalPages, true);

  const renderButtons = (pages: (number | string)[]) =>
    pages.map((pageNum, idx) => {
      if (pageNum === "...") {
        return (
          <span
            key={`dots-${idx}`}
            className="w-5 sm:w-8 text-center text-xs font-bold text-muted select-none"
          >
            ...
          </span>
        );
      }
      const isCurrent = page === pageNum;
      return (
        <button
          key={pageNum}
          onClick={() => goToPage(Number(pageNum))}
          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 ${
            isCurrent
              ? "bg-action text-on-action shadow-xs"
              : "bg-surface border border-border/70 text-secondary hover:bg-surface-muted"
          }`}
        >
          {pageNum}
        </button>
      );
    });

  return (
    <div dir={direction} className="flex w-full items-center justify-between gap-2 border-t border-border p-4 mt-6 sm:mt-8 sm:pt-6">
      {/* Previous Button */}
      <button
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="w-9 h-9 sm:w-auto sm:px-3.5 sm:py-2 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-xs font-bold text-secondary hover:bg-surface-subtle active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0 shadow-2xs"
      >
        {direction === "rtl" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        <span className="hidden sm:inline">{t("paginationPrevious")}</span>
      </button>

      {/* Mobile Page Numbers */}
      <div className="flex sm:hidden items-center justify-center gap-1">
        {renderButtons(mobilePages)}
      </div>

      {/* Desktop Page Numbers */}
      <div className="hidden sm:flex items-center justify-center gap-1.5">
        {renderButtons(desktopPages)}
      </div>

      {/* Next Button */}
      <button
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className="w-9 h-9 sm:w-auto sm:px-3.5 sm:py-2 flex items-center justify-center gap-1.5 rounded-xl border border-border bg-surface text-xs font-bold text-secondary hover:bg-surface-subtle active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0 shadow-2xs"
      >
        <span className="hidden sm:inline">{t("paginationNext")}</span>
        {direction === "rtl" ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </div>
  );
};
