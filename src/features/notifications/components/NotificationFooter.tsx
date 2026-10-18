"use client";

import Link from "next/link";
import {
  LoaderCircle,
  ChevronDown,
  ArrowUpRight,
  Package,
  CheckCircle2,
} from "lucide-react";

type NotificationFooterProps = {
  hasMore: boolean;
  loading: boolean;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  onLoadMore: () => void;
  onClose?: () => void;
};

export default function NotificationFooter({
  hasMore,
  loading,
  currentPage,
  totalPages,
  totalCount = 0,
  onLoadMore,
  onClose,
}: NotificationFooterProps) {
  return (
    <footer className="shrink-0 border-t border-neutral-200 bg-white p-3 dark:border-neutral-700 dark:bg-neutral-900 sm:px-4">
      {hasMore ? (
        <button
          type="button"
          disabled={loading}
          onClick={onLoadMore}
          className="
            group flex min-h-10 w-full cursor-pointer
            items-center justify-center gap-2 rounded-xl
            border border-neutral-200 bg-neutral-50 px-3 py-2.5
            text-[10px] font-bold uppercase tracking-[0.14em]
            text-neutral-800 transition-colors duration-200
            hover:border-neutral-900 hover:bg-neutral-900 hover:text-white
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-neutral-900 focus-visible:ring-offset-2
            disabled:cursor-not-allowed disabled:opacity-50
            dark:border-neutral-700 dark:bg-neutral-800
            dark:text-neutral-200 dark:hover:border-neutral-500
            dark:hover:bg-neutral-100 dark:hover:text-neutral-950
            dark:focus-visible:ring-neutral-200
          "
        >
          {loading ? (
            <>
              <LoaderCircle
                size={14}
                className="animate-spin text-emerald-600 dark:text-emerald-400"
              />
              <span>Loading notifications…</span>
            </>
          ) : (
            <>
              <span>Load older notifications</span>

              {currentPage != null && totalPages != null && (
                <span className="rounded-md bg-neutral-200/70 px-1.5 py-0.5 font-mono text-[9px] tracking-normal text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                  {currentPage}/{totalPages}
                </span>
              )}

              <ChevronDown
                size={14}
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </>
          )}
        </button>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
            <CheckCircle2
              size={13}
              className="text-emerald-600 dark:text-emerald-400"
            />
            {totalCount} notifications loaded
          </span>

          <Link
            href="/my-orders"
            onClick={onClose}
            className="
              inline-flex min-h-8 items-center gap-1.5 rounded-lg
              px-2 text-[10px] font-bold text-neutral-800
              transition-colors hover:bg-neutral-100 hover:text-neutral-950
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-neutral-900
              dark:text-neutral-200 dark:hover:bg-neutral-800
              dark:hover:text-white dark:focus-visible:ring-neutral-200
            "
          >
            <Package size={13} />
            <span>Order history</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      )}
    </footer>
  );
}
