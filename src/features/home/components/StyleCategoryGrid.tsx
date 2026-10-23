"use client";


import Image from "next/image";
import { ArrowUpRight, Layers } from "lucide-react";
import { styleCategories } from "@/features/home/data/styleCategories";
import Heading from "@/shared/components/ui/SectionHeading";
import { useFilterStore } from "@/store/filterStore";
import { useRouter } from "next/navigation";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export default function StyleCategoryGrid() {
  const { t, locale } = useLocale();
  const { filterByStyle } = useFilterStore((state) => state);
  const router = useRouter();

  const handleClick = (name: string) => {
    filterByStyle(name);
    router.push("/shop");
  };

  return (
    <div className="Responsive py-8 sm:py-12">
      {/* Main Architectural Bento Vault Container */}
      <div className="relative isolate overflow-hidden rounded-[2.5rem] border border-border bg-surface-subtle px-4 py-12 shadow-[0_24px_60px_-20px_rgba(var(--shadow-rgb),0.08)] ">
        {/* Subtle Architectural Studio Grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-grid-subtle bg-size-[3.5rem_3.5rem] mask-[radial-gradient(ellipse_80%_70%_at_50%_50%,#000_50%,transparent_100%)]"
        />

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface/85 px-3.5 py-1 shadow-2xs backdrop-blur-md">
            <Layers size={12} className="text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-secondary">
              {locale === "ar" ? "مختارات الأناقة · ٢٠٢٦" : "AESTHETIC ARCHIVE · 2026"}
            </span>
          </div>

          <Heading title={t("browseStyles")} />
        </div>

        {/* 3D Bento Grid */}
        <div
          style={{ perspective: "1200px" }}
          className="relative z-10 mt-8 grid w-full auto-rows-[210px] grid-cols-1 gap-4 sm:mt-10 md:auto-rows-[285px] md:grid-cols-3 md:gap-5"
        >
          {styleCategories.map((e, index) => {
            const displayName = locale === "ar"
              ? [t("casual"), t("formal"), t("party"), t("gym")][index] || e.name
              : e.name;
            return (
            <div
              key={displayName}
              onClick={() => handleClick(e.name)}
              className={`${e.cols} group/bento relative cursor-pointer overflow-hidden rounded-3xl border-2 border-surface bg-surface shadow-[0_14px_34px_-12px_rgba(var(--shadow-rgb),0.10)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-border hover:shadow-[0_28px_55px_-14px_rgba(var(--shadow-rgb),0.2)]`}
            >
              {/* Background Style Image */}
              <Image
                src={e.image}
                alt={displayName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover/bento:scale-108"
              />

              {/* Subtle Top & Bottom Protection Gradients for Readability */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/35 opacity-60 transition-opacity duration-300 group-hover/bento:opacity-90" />

              {/* Top-Left Glassmorphic Style Title Pill */}
              <div className="absolute left-5 top-5 z-20 flex items-center gap-2.5">
                <div className="rounded-2xl border border-border bg-surface/90 px-4 py-2 shadow-sm backdrop-blur-md transition-transform duration-300 group-hover/bento:scale-105">
                  <span className="block font-mono text-[8px] font-black uppercase tracking-[0.22em] text-muted">
                    STYLE // 0{index + 1}
                  </span>
                  <span className="text-xl font-black uppercase tracking-tight text-primary sm:text-2xl">
                    {displayName}
                  </span>
                </div>
              </div>

              {/* Bottom-Right Interactive Action Trigger */}
              <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2">
                <span className="translate-x-2 rounded-full bg-surface/95 px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 shadow-md backdrop-blur-md transition-all duration-300 group-hover/bento:translate-x-0 group-hover/bento:opacity-100">
                  {t("exploreCollection")}
                </span>

                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-action text-on-action shadow-lg transition-all duration-300 group-hover/bento:rotate-45 group-hover/bento:scale-110 group-hover/bento:bg-surface group-hover/bento:text-primary">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}
