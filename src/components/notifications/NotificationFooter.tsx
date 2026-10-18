"use client";

import React from "react";
import Link from "next/link";
import { Loader2, ChevronDown, ArrowUpRight, Package } from "lucide-react";

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
    <div className="border-t border-neutral-200/80 bg-white p-3">
      {hasMore ? (
        <button
          type="button"
          disabled={loading}
          onClick={onLoadMore}
          className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-neutral-200/90 bg-[#F8F8F8] py-2.5 text-[10.5px] font-black uppercase tracking-[0.16em] text-[#111111] transition-all hover:border-black hover:bg-[#111111] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin text-emerald-500" />
              <span>Syncing Archive...</span>
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
      ) : (
        <div className="flex items-center justify-between px-1 text-[10px] font-black uppercase tracking-widest text-neutral-400">
          <span>{totalCount} Total Synced</span>
          <Link
            href="/my-orders"
            onClick={onClose}
            className="inline-flex items-center gap-1 text-[#111111] transition hover:underline"
          >
            <Package size={12} />
            <span>Order Archive</span>
            <ArrowUpRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
