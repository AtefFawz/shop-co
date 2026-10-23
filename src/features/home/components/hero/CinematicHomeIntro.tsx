"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { ArrowUpLeft, ArrowUpRight, Sparkles } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

interface CinematicHomeIntroProps {
  reduceMotion: boolean | null;
  heroImage?: string;
  shopHref?: string;
}

export function CinematicHomeIntro({
  reduceMotion,
  heroImage = "/images/cinematic-lookbook.webp",
  shopHref = "/shop",
}: CinematicHomeIntroProps) {
  const { locale, direction } = useLocale();
  const isArabic = locale === "ar";
  const motionDisabled = reduceMotion !== false;
  const pathId = `editorial-circle-${useId().replace(/:/g, "")}`;

  const content = isArabic
    ? {
        eyebrow: "مجموعة الموسم الجديد",
        titleFirst: "أناقة",
        titleSecond: "تترك أثرًا",
        description: "قطع استثنائية تجمع بين الجودة الفاخرة والتصميم المعاصر.",
        cta: "اكتشف المجموعة",
        stamp: "SHOP.CO STUDIO • EDITION 2026 • ",
        quality: "جودة استثنائية",
        design: "تصميم معاصر",
        experience: "تجربة تسوق مميزة",
      }
    : {
        eyebrow: "THE NEW SEASON EDIT",
        titleFirst: "Style that",
        titleSecond: "moves you.",
        description:
          "Exceptional pieces. Refined details. A new perspective on everyday style.",
        cta: "Explore collection",
        stamp: "SHOP.CO STUDIO • EDITION 2026 • ",
        quality: "Exceptional quality",
        design: "Modern design",
        experience: "A better shopping experience",
      };

  const introMotion = (delay = 0) => ({
    initial: motionDisabled
      ? false
      : { opacity: 0, y: 24, filter: "blur(7px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: motionDisabled ? 0 : 0.85,
      delay: motionDisabled ? 0 : delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  });

  return (
    <section
      dir={direction}
      aria-labelledby="cinematic-home-title"
      className="relative isolate min-h-[590px] overflow-hidden bg-[#08090b] text-white sm:min-h-[660px] lg:min-h-[720px]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-30 bg-cover bg-center"
        style={{
          backgroundImage: `url("${heroImage}")`,
          backgroundPosition: "center 35%",
        }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            "linear-gradient(90deg, rgba(5,6,8,.97) 0%, rgba(5,6,8,.82) 35%, rgba(5,6,8,.3) 72%, rgba(5,6,8,.64) 100%), linear-gradient(0deg, rgba(5,6,8,.95) 0%, transparent 48%, rgba(5,6,8,.25) 100%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-12 -z-10 h-80 w-80 rounded-full opacity-20 blur-[100px] sm:h-[480px] sm:w-[480px]"
        style={{
          background:
            "radial-gradient(circle, #d6a45a 0%, #8b602c 30%, transparent 70%)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.045]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.8) .5px, transparent .5px)",
          backgroundSize: "5px 5px",
        }}
      />

      <div className="mx-auto grid min-h-[590px] max-w-[1440px] grid-cols-1 items-center gap-10 px-6 pb-28 pt-24 sm:min-h-[660px] sm:px-10 lg:min-h-[720px] lg:grid-cols-[1.05fr_.95fr] lg:gap-8 lg:px-16 lg:pb-32 lg:pt-28">
        <div className="relative z-10 max-w-2xl">
          <motion.div
            {...introMotion(0.1)}
            className="mb-7 flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#d9b477]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#dfc49b] sm:text-xs">
              {content.eyebrow}
            </span>
          </motion.div>

          <motion.h1
            id="cinematic-home-title"
            {...introMotion(0.22)}
            className="text-5xl font-black leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[clamp(4rem,7vw,7rem)]"
          >
            <span className="block">{content.titleFirst}</span>
            <span
              className="mt-2 block bg-clip-text pb-2 text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, #fff4df 0%, #dbb678 48%, #fff0d0 75%, #b78b4d 100%)",
              }}
            >
              {content.titleSecond}
            </span>
          </motion.h1>

          <motion.p
            {...introMotion(0.38)}
            className="mt-6 max-w-md text-sm leading-7 text-white/65 sm:text-base sm:leading-8"
          >
            {content.description}
          </motion.p>

          <motion.div {...introMotion(0.52)} className="mt-8">
            <a
              href={shopHref}
              className="group inline-flex min-h-12 items-center gap-5 rounded-full border border-[#ead1a5]/40 bg-[#e6c796] px-6 py-3 text-xs font-black text-[#17120b] shadow-[0_0_35px_rgba(214,164,90,.12)] transition-all duration-300 hover:-translate-y-1 hover:border-[#fff0ce] hover:bg-[#f5dfb8] hover:shadow-[0_0_45px_rgba(214,164,90,.27)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e6c796] focus-visible:ring-offset-4 focus-visible:ring-offset-[#08090b]"
            >
              <span>{content.cta}</span>
              {isArabic ? (
                <ArrowUpLeft
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1"
                />
              ) : (
                <ArrowUpRight
                  size={17}
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              )}
            </a>
          </motion.div>

          <motion.div
            {...introMotion(0.64)}
            className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 text-[10px] font-semibold text-white/55 sm:gap-x-7"
          >
            <span>{content.quality}</span>
            <span
              aria-hidden="true"
              className="h-1 w-1 rounded-full bg-[#d9b477]"
            />
            <span>{content.design}</span>
          </motion.div>
        </div>

        <motion.div
          initial={
            motionDisabled
              ? false
              : { opacity: 0, scale: 0.84, filter: "blur(10px)" }
          }
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{
            duration: motionDisabled ? 0 : 1.1,
            delay: motionDisabled ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto flex aspect-square w-full max-w-[330px] items-center justify-center sm:max-w-[390px] lg:max-w-[470px]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-[15%] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(218,169,93,.22), rgba(130,83,32,.06) 55%, transparent 72%)",
            }}
          />

          <motion.div
            aria-hidden="true"
            animate={motionDisabled ? undefined : { rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[5%] rounded-full border border-[#d9b477]/20"
          >
            <span className="absolute left-[14%] top-[19%] h-2 w-2 rounded-full bg-[#f1d39d] shadow-[0_0_18px_5px_rgba(241,211,157,.4)]" />
          </motion.div>

          <div
            className="absolute inset-[15%] flex items-center justify-center rounded-full border border-[#eed3a2]/65 p-2"
            style={{
              background:
                "radial-gradient(circle at 35% 24%, rgba(255,255,255,.12), transparent 35%), linear-gradient(145deg, rgba(239,203,146,.13), rgba(15,14,13,.75) 50%, rgba(164,112,51,.15))",
              boxShadow:
                "0 0 0 7px rgba(219,174,105,.035), 0 0 0 13px rgba(219,174,105,.025), inset 0 0 35px rgba(220,171,92,.09), 0 0 70px rgba(201,144,65,.1)",
              backdropFilter: "blur(16px)",
            }}
          >
            <motion.svg
              viewBox="0 0 100 100"
              aria-hidden="true"
              animate={motionDisabled ? undefined : { rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 h-full w-full p-2"
            >
              <defs>
                <path
                  id={pathId}
                  d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                />
              </defs>
              <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="rgba(235,201,149,.22)"
                strokeWidth=".35"
              />
              <text
                fill="#f5dfb9"
                fontSize="5.6"
                fontWeight="700"
                letterSpacing="1.3"
              >
                <textPath href={`#${pathId}`}>
                  {content.stamp.repeat(2)}
                </textPath>
              </text>
            </motion.svg>

            <div
              className="relative flex h-[43%] w-[43%] items-center justify-center rounded-full border border-[#f2d4a0]/50"
              style={{
                background:
                  "radial-gradient(circle at 35% 25%, #76532e 0%, #302215 36%, #0d0c0b 78%)",
                boxShadow:
                  "inset 0 2px 15px rgba(255,220,166,.15), 0 0 25px rgba(219,174,105,.12)",
              }}
            >
              <div
                aria-hidden="true"
                className="absolute inset-[10%] rounded-full border border-[#dfb677]/20"
              />
              <motion.div
                animate={
                  motionDisabled
                    ? undefined
                    : { scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }
                }
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex items-center justify-center text-[#ffe5b1] drop-shadow-[0_0_18px_rgba(245,194,109,.65)]"
              >
                <Sparkles size={38} strokeWidth={1.1} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 px-6 pb-6 sm:px-10 sm:pb-8 lg:px-16">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d9b477] shadow-[0_0_12px_rgba(217,180,119,.7)]" />
            <span>SHOP.CO STUDIO</span>
            <span className="text-white/20">/</span>
            <span>2026</span>
          </div>
          <span className="text-[10px] font-medium text-white/45">
            {content.experience}
          </span>
        </div>
      </div>
    </section>
  );
}
