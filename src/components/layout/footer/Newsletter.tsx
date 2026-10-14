"use client";

import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { Mail, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const spotlight = useMotionTemplate`
    radial-gradient(
      520px circle at ${mouseX}px ${mouseY}px,
      rgba(255, 255, 255, 0.09),
      transparent 80%
    )
  `;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 3500);
  };

  return (
    <motion.div
      initial={{ y: 24, opacity: 0, scale: 0.98 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      onMouseMove={handleMouseMove}
      className="group relative overflow-hidden rounded-[24px] bg-[#070707] p-6 text-white shadow-[0_28px_60px_-12px_rgba(0,0,0,0.28)] ring-1 ring-white/10 sm:rounded-[28px] sm:px-10 sm:py-9 lg:px-14 lg:py-11"
    >
      {/* إضاءة الماوس التفاعلية */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: spotlight }}
      />

      {/* الشبكة الهندسية الخفيفة */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 90% 90% at 50% 50%, black 25%, transparent 100%)",
        }}
      />

      {/* خط إضاءة علوي ناعم */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
      />

      <div className="relative z-10 flex flex-col items-center justify-between gap-7 lg:flex-row lg:gap-12">
        {/* العنوان والبادج */}
        <div className="max-w-[540px] text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[9.5px] font-black uppercase tracking-[0.2em] text-neutral-300 backdrop-blur-md"
          >
            <Sparkles size={11} className="text-amber-400 animate-pulse" />
            <span>Exclusive Member Drops</span>
          </motion.div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-white sm:text-3xl lg:text-[38px] lg:leading-[1.12]">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>
        </div>

        {/* فورم الاشتراك التفاعلي */}
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-[360px] shrink-0 flex-col gap-3"
        >
          <motion.div
            animate={{ scale: isFocused ? 1.02 : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="relative flex items-center"
          >
            <Mail
              size={17}
              className={`pointer-events-none absolute left-4 transition-colors duration-200 ${
                isFocused ? "text-black" : "text-neutral-400"
              }`}
            />
            <input
              type="email"
              required
              value={email}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="h-12 w-full rounded-full bg-white pl-11 pr-4 text-xs font-semibold text-black outline-none ring-2 ring-transparent transition-all placeholder:font-medium placeholder:text-neutral-400 focus:ring-white/40 sm:h-12.5 sm:text-sm"
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            className={`group/btn relative flex h-12 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full text-xs font-black uppercase tracking-[0.12em] transition-all duration-300 sm:h-12.5 ${
              subscribed
                ? "bg-emerald-500 text-white shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                : "bg-white text-black shadow-md hover:bg-neutral-100"
            }`}
          >
            <AnimatePresence mode="wait">
              {subscribed ? (
                <motion.span
                  key="subscribed"
                  initial={{ opacity: 0, y: 12, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.9 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={16} />
                  <span>Welcome to the Club!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="flex items-center gap-2"
                >
                  <span>Subscribe to Newsletter</span>
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover/btn:translate-x-1"
                  />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
