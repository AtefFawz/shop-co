"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";
import { Globe } from "lucide-react";

const SOCIALS = [
  { Icon: FaTwitter, label: "Twitter", href: "#" },
  { Icon: FaFacebookF, label: "Facebook", href: "#" },
  { Icon: FaInstagram, label: "Instagram", href: "#" },
  { Icon: FaGithub, label: "GitHub", href: "#" },
];

export const FooterSocialLinks = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-start justify-between">
      {/* اللوجو مع أنيميشن النقطة التفاعلية */}
      <Link
        href="/"
        className="group inline-flex items-center gap-1.5 text-2xl font-black tracking-[-0.06em] text-primary sm:text-3xl"
      >
        <span>SHOP.CO</span>
        <span className="h-2 w-2 rounded-full bg-action transition-all duration-300 group-hover:scale-125 group-hover:bg-success" />
      </Link>

      {/* الوصف */}
      <p className="mt-3.5 max-w-xs text-xs leading-relaxed text-secondary sm:text-sm">
        We have clothes that suit your style and which you’re proud to wear.
        From women to men.
      </p>

      {/* بادج حالة الشحن العالمي */}
      <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border-strong/80 bg-surface/70 px-3 py-1 backdrop-blur-sm">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
        <Globe size={11} className="text-muted" />
        <span className="font-mono text-[9.5px] font-bold uppercase tracking-wider text-secondary">
          Worldwide Express Shipping
        </span>
      </div>

      {/* أيقونات السوشيال ميديا مع Tooltip عائم */}
      <div className="mt-6 flex items-center gap-3">
        {SOCIALS.map(({ Icon, label, href }, index) => {
          const isHovered = hoveredIndex === index;

          return (
            <div
              key={index}
              className="relative flex items-center justify-center"
            >
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.85 }}
                    animate={{ opacity: 1, y: -34, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 420, damping: 24 }}
                    className="pointer-events-none absolute z-20 rounded-md bg-action px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-on-action shadow-md whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>

              <motion.a
                href={href}
                aria-label={label}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                whileHover={{ y: -3, scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border-strong/90 bg-surface text-primary shadow-xs transition-colors duration-200 hover:border-border-strong hover:bg-action hover:text-on-action"
              >
                <Icon className="text-sm" />
              </motion.a>
            </div>
          );
        })}
      </div>
    </div>
  );
};
