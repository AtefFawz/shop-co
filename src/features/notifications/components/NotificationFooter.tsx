"use client";

import Link from "next/link";
import {
  LoaderCircle,
  ChevronDown,
  ArrowUpRight,
  Package,
  CheckCircle2,
} from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

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
  const { locale, t } = useLocale();

  const formattedCount = new Intl.NumberFormat(
    locale === "ar" ? "ar-EG" : "en-US",
  ).format(totalCount);

  return (
    <footer className="shrink-0 border-t border-border bg-surface-raised p-3 sm:px-4">
      {hasMore ? (
        <button
          type="button"
          disabled={loading}
          onClick={onLoadMore}
          className="
            group flex min-h-10 w-full cursor-pointer
            items-center justify-center gap-2 rounded-xl
            border border-border bg-surface-subtle px-3 py-2.5
            text-[10px] font-bold uppercase tracking-[0.12em]
            text-secondary transition-colors duration-200
            hover:border-action hover:bg-action hover:text-on-action
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-focus focus-visible:ring-offset-2
            focus-visible:ring-offset-surface-raised
            disabled:cursor-not-allowed disabled:opacity-50
          "
        >
          {loading ? (
            <>
              <LoaderCircle
                size={14}
                className="animate-spin text-accent"
                aria-hidden="true"
              />
              <span>{t("notifLoading")}</span>
            </>
          ) : (
            <>
              <span>{t("notifLoadOlder")}</span>

              {currentPage != null && totalPages != null && (
                <span
                  className="
                    rounded-md border border-border-subtle
                    bg-surface-muted px-1.5 py-0.5
                    font-mono text-[9px] tracking-normal
                    text-secondary
                    group-hover:border-on-action/20
                    group-hover:bg-on-action/10
                    group-hover:text-on-action
                  "
                >
                  {currentPage}/{totalPages}
                </span>
              )}

              <ChevronDown
                size={14}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-y-0.5"
              />
            </>
          )}
        </button>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-1">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-muted">
            <CheckCircle2
              size={13}
              className="text-success"
              aria-hidden="true"
            />
            {t("notifLoadedCount").replace("{count}", formattedCount)}
          </span>

          <Link
            href="/my-orders"
            onClick={onClose}
            className="
              inline-flex min-h-8 items-center gap-1.5 rounded-lg
              px-2 text-[10px] font-bold text-secondary
              transition-colors hover:bg-surface-muted hover:text-primary
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-focus
            "
          >
            <Package size={13} aria-hidden="true" />
            <span>{t("notifOrderHistory")}</span>
            <ArrowUpRight size={12} aria-hidden="true" className="rtl-mirror" />
          </Link>
        </div>
      )}
    </footer>
  );
}
