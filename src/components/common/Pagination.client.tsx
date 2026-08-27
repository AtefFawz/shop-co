const getVisiblePages = (current: number, total: number) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }

  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
};
import { ChevronLeft, ChevronRight } from "lucide-react";
type Pagination = {
  page: number;
  totalPages: number;
  goToPage: (page: number) => void;
};

export const Pagination = ({ page, totalPages, goToPage }: Pagination) => {
  const visiblePages = getVisiblePages(page, totalPages);
  return (
    <div className="flex items-center justify-between border-t border-gray-200 p-6 mt-8 w-full">
      {/* Previous Button */}
      <button
        disabled={page <= 1}
        onClick={() => goToPage(page - 1)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
      >
        <ChevronLeft size={14} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center justify-center gap-1 sm:gap-1.5">
        {visiblePages.map((pageNum, idx) => {
          if (pageNum === "...") {
            return (
              <span
                key={`dots-${idx}`}
                className="w-8 text-center text-xs font-bold text-gray-400"
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
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                isCurrent
                  ? "bg-black text-white shadow-sm"
                  : "bg-transparent text-gray-600 hover:bg-gray-200/60"
              }`}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        disabled={page >= totalPages}
        onClick={() => goToPage(page + 1)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
};
