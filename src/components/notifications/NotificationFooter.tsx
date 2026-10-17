"use client";

import { Loader2, ChevronDown } from "lucide-react";

type NotificationFooterProps = {
  hasMore: boolean;
  loading: boolean;
  currentPage?: number;
  totalPages?: number;
  onLoadMore: () => void;
};

export default function NotificationFooter({
  hasMore,
  loading,
  currentPage,
  totalPages,
  onLoadMore,
}: NotificationFooterProps) {
  if (!hasMore) {
    return null;
  }

  return (
    <div className="border-t border-neutral-200/80 bg-neutral-50/70 p-2.5 sm:p-3">
      <button
        type="button"
        disabled={loading}
        onClick={onLoadMore}
        className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200/90 bg-white py-2 text-[11px] font-black uppercase tracking-[0.14em] text-black shadow-2xs transition-all hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-50 sm:py-2.5"
      >
        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            <span>Syncing...</span>
          </>
        ) : (
          <>
            <span>Load Older Alerts</span>
            {currentPage && totalPages ? (
              <span className="font-mono text-[9.5px] opacity-60">
                ({currentPage}/{totalPages})
              </span>
            ) : null}
            <ChevronDown
              size={14}
              className="transition-transform duration-200 group-hover:translate-y-0.5"
            />
          </>
        )}
      </button>
    </div>
  );
}
