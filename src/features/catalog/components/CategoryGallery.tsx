"use client";

import React from "react";
import Kids from "@/assets/category/kids.png";
import Men from "@/assets/category/man.png";
import Women from "@/assets/category/women.png";
import Image from "next/image";
import { GoArrowUpRight } from "react-icons/go";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/store/filterStore";
import { useLocale } from "@/shared/i18n/LocaleProvider";

export const CategoryGallery = () => {
  const router = useRouter();
  const { t, direction } = useLocale();
  const setType = useFilterStore((state) => state.filterByGender);

  const categories = [
    {
      id: 1,
      code: "DEPT // 01",
      title: t("catalogKidsTitle"),
      subtitle: t("catalogKidsSubtitle"),
      badge: t("catalogKidsBadge"),
      img: Kids,
      slug: "KIDS",
    },
    {
      id: 2,
      code: "DEPT // 02",
      title: t("catalogMenTitle"),
      subtitle: t("catalogMenSubtitle"),
      badge: t("catalogMenBadge"),
      img: Men,
      slug: "MEN",
    },
    {
      id: 3,
      code: "DEPT // 03",
      title: t("catalogWomenTitle"),
      subtitle: t("catalogWomenSubtitle"),
      badge: t("catalogWomenBadge"),
      img: Women,
      slug: "WOMEN",
    },
  ];

  const handleClick = (slug: string) => {
    setType(slug);
    router.push("/shop");
  };

  return (
    <div dir={direction} className="Responsive ">
      <style>{`
        .dept-3d-card {
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .dept-3d-card:hover {
            transform: translateY(-8px) rotateX(3.5deg) rotateY(-3.5deg);
            box-shadow: 0 30px 60px -15px rgba(var(--shadow-rgb),0.28);
          }
        }
      `}</style>

      {/* ── Editorial Section Header ── */}
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border-subtle bg-surface-subtle px-3 py-1">
            <Sparkles size={11} className="text-primary" />
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-secondary">
              {t("catalogCuratedDepartments")}
            </span>
          </div>
          <h2 className="h1-main font-integral text-2xl font-black uppercase tracking-[-0.04em] text-primary sm:text-3xl lg:text-4xl">
            {t("catalogBrowseByDepartment")}
          </h2>
        </div>

        <p className="max-w-xs text-xs font-medium leading-relaxed text-muted sm:text-start">
          {t("catalogDepartmentDescription")}
        </p>
      </div>

      {/* ── 3D Interactive Cards Grid ── */}
      <div
        style={{ perspective: "1300px" }}
        className="grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleClick(cat.slug)}
            className="dept-3d-card group/card relative h-[360px] cursor-pointer overflow-hidden rounded-[2.2rem] border-2 border-surface bg-action shadow-[0_16px_40px_-12px_rgba(var(--shadow-rgb),0.16)] sm:h-[400px]"
          >
            {/* Background Portrait Image */}
            <Image
              src={cat.img}
              alt={cat.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
            />

            {/* Multi-stage Cinematic Gradient Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/10 transition-opacity duration-500 group-hover/card:from-black/90" />

            {/* Top HUD Bar Inside Card */}
            <div className="absolute inset-x-5 top-5 z-20 flex items-center justify-between">
              <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-on-action backdrop-blur-md">
                {cat.badge}
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest text-on-action/70">
                {cat.code}
              </span>
            </div>

            {/* Bottom Content & Magnetic Action Button */}
            <div className="absolute inset-x-6 bottom-6 z-20 flex items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-2xl font-black uppercase tracking-tight text-on-action sm:text-3xl">
                  {cat.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-relaxed text-on-action/75 transition-all duration-300 group-hover/card:text-on-action">
                  {cat.subtitle}
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-success">
                  <span>{t("categoryExploreCollection")}</span>
                  <span>→</span>
                </span>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface text-primary shadow-lg transition-all duration-300 group-hover/card:rotate-45 group-hover/card:scale-110 group-hover/card:bg-success group-hover/card:text-on-success">
                <GoArrowUpRight size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
