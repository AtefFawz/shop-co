// components/common/Pagination.tsx
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
};

// دالة حساب نطاق الصفحات الظاهرة مع النقاط
const getVisiblePages = (current: number, total: number) => {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
};

export default function Pagination({ currentPage, totalPages }: Props) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between sm:justify-center gap-2 pt-4 border-t border-gray-100">
      {/* زرار السابق */}
      {currentPage > 1 ? (
        <Link
          href={`?page=${currentPage - 1}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold text-gray-300 cursor-not-allowed">
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      {/* أرقام الصفحات */}
      <div className="flex items-center gap-1.5">
        {visiblePages.map((pageNum, idx) => {
          if (pageNum === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 text-center text-xs font-bold text-gray-400"
              >
                ...
              </span>
            );
          }

          const isCurrent = currentPage === pageNum;

          return isCurrent ? (
            <span
              key={pageNum}
              className="w-8 h-8 rounded-xl bg-black text-white text-xs font-bold inline-flex items-center justify-center shadow-sm"
            >
              {pageNum}
            </span>
          ) : (
            <Link
              key={pageNum}
              href={`?page=${pageNum}`}
              className="w-8 h-8 rounded-xl bg-transparent hover:bg-gray-100 text-gray-600 text-xs font-bold inline-flex items-center justify-center transition-all active:scale-95"
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* زرار التالي */}
      {currentPage < totalPages ? (
        <Link
          href={`?page=${currentPage + 1}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold text-gray-300 cursor-not-allowed">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}
