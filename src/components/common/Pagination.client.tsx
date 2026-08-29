"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
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

export const Pagination = ({ page, totalPages, goToPage }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const desktopPages = getPageNumbers(page, totalPages, false);
  const mobilePages = getPageNumbers(page, totalPages, true);

  const renderButtons = (pages: (number | string)[]) =>
    pages.map((pageNum, idx) => {
      if (pageNum === "...") {
        return (
          <span
            key={`dots-${idx}`}
            className="w-5 sm:w-8 text-center text-xs font-bold text-gray-400 select-none"
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
              ? "bg-black text-white shadow-xs"
              : "bg-white border border-gray-200/70 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {pageNum}
        </button>
      );
    });

  return (
    <div className="flex items-center justify-between border-t border-gray-200 p-4 sm:pt-6 mt-6 sm:mt-8 w-full gap-2">
      {/* Previous Button */}
      <button
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="w-9 h-9 sm:w-auto sm:px-3.5 sm:py-2 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0 shadow-2xs"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
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
        className="w-9 h-9 sm:w-auto sm:px-3.5 sm:py-2 flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shrink-0 shadow-2xs"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
