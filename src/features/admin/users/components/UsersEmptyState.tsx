"use client";

import { Users, RotateCcw } from "lucide-react";

interface EmptyStateProps {
  hasFilters?: boolean;
  onReset?: () => void;
}

export default function UsersEmptyState({
  hasFilters = false,
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface px-6 py-16 text-center shadow-[0_12px_34px_-12px_rgba(var(--shadow-rgb),0.05)]">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/80 bg-surface-subtle text-primary shadow-2xs">
        <Users size={26} strokeWidth={1.6} />
      </div>

      <h3 className="text-sm font-black uppercase tracking-wider text-primary">
        {hasFilters ? "No Matching Accounts Found" : "Directory Is Empty"}
      </h3>

      <p className="mt-1 max-w-xs text-xs leading-relaxed text-muted">
        {hasFilters
          ? "No registered users match your current search query or role clearance filter."
          : "Registered storefront members and administrative staff will appear here."}
      </p>

      {hasFilters && onReset && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-action px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-on-action shadow-sm transition-all hover:-translate-y-0.5 hover:bg-action-hover"
        >
          <RotateCcw size={12} />
          <span>Reset Directory Filters</span>
        </button>
      )}
    </div>
  );
}
