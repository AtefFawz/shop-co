"use client";

import { motion, type Variants } from "framer-motion";
import Newsletter from "@/shared/components/layout/footer/FooterNewsletterForm";
import { FooterBenefits } from "@/shared/components/layout/footer/FooterBenefits";
import { FooterSocialLinks } from "@/shared/components/layout/footer/FooterSocialLinks";
import { CopyrightNotice } from "@/shared/components/layout/footer/CopyrightNotice";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import Link from "next/link";

const footerGroups = [
  {
    titleKey: "footerCompany",
    itemKeys: ["footerAbout", "footerFeatures", "footerWorks", "footerCareers"],
  },
  {
    titleKey: "footerHelp",
    itemKeys: [
      "footerSupport",
      "footerDelivery",
      "footerTerms",
      "footerPrivacy",
    ],
  },
  {
    titleKey: "footerFaq",
    itemKeys: [
      "account",
      "footerManageDeliveries",
      "footerOrders",
      "footerPayments",
    ],
  },
  {
    titleKey: "footerResources",
    itemKeys: [
      "footerFreeEbooks",
      "footerDevelopmentTutorial",
      "footerBlog",
      "footerYoutube",
    ],
  },
] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const columnVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
};

export default function StorefrontFooter() {
  const { t } = useLocale();
  return (
    <footer className="relative bg-surface-subtle  w-full select-none overflow-hidden ">
      <div className="relative w-full">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute  top-1/2 bottom-0 z-0 bg-surface-subtle"
        />

        <div className="Responsive relative z-10">
          <Newsletter />
        </div>
      </div>

      <div className="relative z-10 w-full bg-surface-subtle pt-12 pb-8 sm:pt-16 sm:pb-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center overflow-hidden select-none"
        >
          <span className="text-[18vw] font-black leading-none tracking-[-0.08em] text-primary/2.5">
            SHOP.CO
          </span>
        </div>

        <div className="Responsive relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-12 lg:gap-8"
          >
            <motion.div
              variants={columnVariants}
              className="col-span-2 sm:col-span-4 lg:col-span-4 lg:pr-8"
            >
              <FooterSocialLinks />
            </motion.div>

            {footerGroups.map((item, index) => (
              <motion.div
                key={index}
                variants={columnVariants}
                className="col-span-1 sm:col-span-1 lg:col-span-2"
              >
                <FooterBenefits
                  title={t(item.titleKey)}
                  feature={item.itemKeys.map((key) => t(key))}
                />
              </motion.div>
            ))}
          </motion.div>

          <div className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-border/70 pt-5 text-xs font-bold text-muted">
            <span className="w-full text-[10px] font-black uppercase tracking-[.18em]">
              {t("account")}
            </span>
            <Link href="/my-space" className="transition hover:text-primary">
              {t("navProfile")}
            </Link>
            <Link href="/stylist" className="transition hover:text-primary">
              {t("navFindStyle")}
            </Link>
            <Link
              href="/saved-for-later"
              className="transition hover:text-primary"
            >
              {t("language") === "العربية"
                ? "محفوظ لوقت لاحق"
                : "Saved for later"}
            </Link>
            <Link
              href="/recently-viewed"
              className="transition hover:text-primary"
            >
              {t("language") === "العربية" ? "شوهدت مؤخرًا" : "Recently viewed"}
            </Link>
            <Link href="/compare" className="transition hover:text-primary">
              {t("language") === "العربية"
                ? "مقارنة المنتجات"
                : "Compare products"}
            </Link>
            <Link
              href="/price-alerts"
              className="transition hover:text-primary"
            >
              {t("language") === "العربية" ? "تنبيهات الأسعار" : "Price alerts"}
            </Link>
          </div>
          <CopyrightNotice />
        </div>
      </div>
    </footer>
  );
}
