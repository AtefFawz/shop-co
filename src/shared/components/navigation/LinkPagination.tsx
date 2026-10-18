// Pagination navigation for URL-driven route state.
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type LinkPaginationProps = {
  currentPage: number;
  totalPages: number;
};

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

export default function LinkPagination({ currentPage, totalPages }: LinkPaginationProps) {
  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between sm:justify-center gap-2 pt-4 border-t border-border-subtle">
      {currentPage > 1 ? (
        <Link
          href={`?page=${currentPage - 1}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-bold text-secondary hover:bg-surface-subtle active:scale-95 transition-all shadow-sm"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-subtle text-xs font-bold text-subtle cursor-not-allowed">
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">Previous</span>
        </span>
      )}

      <div className="flex items-center gap-1.5">
        {visiblePages.map((pageNum, idx) => {
          if (pageNum === "...") {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="w-8 text-center text-xs font-bold text-muted"
              >
                ...
              </span>
            );
          }

          const isCurrent = currentPage === pageNum;

          return isCurrent ? (
            <span
              key={pageNum}
              className="w-8 h-8 rounded-xl bg-action text-on-action text-xs font-bold inline-flex items-center justify-center shadow-sm"
            >
              {pageNum}
            </span>
          ) : (
            <Link
              key={pageNum}
              href={`?page=${pageNum}`}
              className="w-8 h-8 rounded-xl bg-transparent hover:bg-surface-muted text-secondary text-xs font-bold inline-flex items-center justify-center transition-all active:scale-95"
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {currentPage < totalPages ? (
        <Link
          href={`?page=${currentPage + 1}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-bold text-secondary hover:bg-surface-subtle active:scale-95 transition-all shadow-sm"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border-subtle bg-surface-subtle text-xs font-bold text-subtle cursor-not-allowed">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  );
}
