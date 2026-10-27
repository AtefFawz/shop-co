import Link from "next/link";
import { Package, Sparkles, ArrowUpRight } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

function EmptyAccountState({ message }: { message: string }) {
  const { t } = useLocale();
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-surface px-6 py-16 text-center shadow-[0_12px_34px_-14px_rgba(var(--shadow-rgb),0.05)]">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/80 bg-surface-subtle text-primary">
        <Package size={28} strokeWidth={1.6} />
      </div>

      <span className="inline-flex items-center gap-1 rounded-full bg-surface-subtle px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-muted">
        <Sparkles size={10} /> {t("uiAccountArchiveStatus")}
      </span>

      <p className="mt-3 text-sm font-black uppercase tracking-wider text-primary">
        {message}
      </p>

      <Link
        href="/shop"
        className="group mt-6 inline-flex items-center gap-2 rounded-2xl bg-action px-6 py-3 text-[10px] font-black uppercase tracking-widest text-on-action shadow-md transition hover:-translate-y-0.5 hover:bg-action-hover"
      >
        <span>{t("uiExploreShowroom")}</span>
        <ArrowUpRight
          size={13}
          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </Link>
    </div>
  );
}

export { EmptyAccountState };
