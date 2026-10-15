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

export const Category = () => {
  const router = useRouter();
  const setType = useFilterStore((state) => state.filterByGender);

  const categories = [
    {
      id: 1,
      code: "DEPT // 01",
      title: "Kids",
      subtitle: "Playful Everyday Comfort & Mini Streetwear",
      badge: "Junior Edit",
      img: Kids,
      slug: "KIDS",
    },
    {
      id: 2,
      code: "DEPT // 02",
      title: "Men",
      subtitle: "Tailored Outerwear, Heavy Tees & Urban Essentials",
      badge: "Menswear Studio",
      img: Men,
      slug: "MEN",
    },
    {
      id: 3,
      code: "DEPT // 03",
      title: "Women",
      subtitle: "Contemporary Silhouettes & Minimalist Luxury",
      badge: "Womenswear Edit",
      img: Women,
      slug: "WOMEN",
    },
  ];

  const handleClick = (slug: string) => {
    setType(slug);
    router.push("/shop");
  };

  return (
    <div className="Responsive ">
      <style>{`
        .dept-3d-card {
          transform-style: preserve-3d;
          transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.55s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @media (hover: hover) {
          .dept-3d-card:hover {
            transform: translateY(-8px) rotateX(3.5deg) rotateY(-3.5deg);
            box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.28);
          }
        }
      `}</style>

      {/* ── Editorial Section Header ── */}
      <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-black/10 bg-[#F4F3F4] px-3 py-1">
            <Sparkles size={11} className="text-[#111111]" />
            <span className="text-[9px] font-black uppercase tracking-[0.24em] text-neutral-700">
              CURATED DEPARTMENTS
            </span>
          </div>
          <h2 className="h1-main font-integral text-2xl font-black uppercase tracking-[-0.04em] text-[#111111] sm:text-3xl lg:text-4xl">
            Browse By Department
          </h2>
        </div>

        <p className="max-w-xs text-xs font-medium leading-relaxed text-neutral-500 sm:text-right">
          Select a dedicated fashion house division to filter our 2026 lookbook
          instantly.
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
            className="dept-3d-card group/card relative h-[360px] cursor-pointer overflow-hidden rounded-[2.2rem] border-2 border-white bg-[#111111] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.16)] sm:h-[400px]"
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
              <span className="rounded-full border border-white/20 bg-white/15 px-3 py-1 text-[9px] font-black uppercase tracking-[0.18em] text-white backdrop-blur-md">
                {cat.badge}
              </span>
              <span className="font-mono text-[10px] font-bold tracking-widest text-white/70">
                {cat.code}
              </span>
            </div>

            {/* Bottom Content & Magnetic Action Button */}
            <div className="absolute inset-x-6 bottom-6 z-20 flex items-end justify-between gap-4">
              <div className="min-w-0 flex-1">
                <h3 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                  {cat.title}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-relaxed text-white/75 transition-all duration-300 group-hover/card:text-white">
                  {cat.subtitle}
                </p>
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                  <span>Explore Collection</span>
                  <span>→</span>
                </span>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#111111] shadow-lg transition-all duration-300 group-hover/card:rotate-45 group-hover/card:scale-110 group-hover/card:bg-emerald-400 group-hover/card:text-black">
                <GoArrowUpRight size={22} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
