"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  KeyRound,
} from "lucide-react";
import { useLogin } from "../../../hooks/signIn";

const FormSignIn = () => {
  const { error, user, isLoading, handleChange, submitAction } = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email || "");

  const handleKeyEvents = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.getModifierState) {
      setCapsLockOn(e.getModifierState("CapsLock"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitAction();
      console.log("✅ Logged in successfully!");
    } catch (err) {
      console.error("❌ Submission failed but page is stable.", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-5">
      {/* ── Live Error Banner ── */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-3.5 text-xs font-bold text-rose-600 shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-rose-600" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      {/* ── Email Address Field ── */}
      <Field
        label="Email Address"
        active={focusedField === "email"}
        rightBadge={
          isEmailValid ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-600">
              <CheckCircle2 size={11} /> Verified Format
            </span>
          ) : null
        }
      >
        <div
          className={`group relative flex items-center rounded-2xl border bg-[#F8F8F8] transition-all duration-300 ${
            focusedField === "email"
              ? "-translate-y-0.5 border-[#111111] bg-white shadow-[0_12px_28px_-8px_rgba(0,0,0,0.12)] ring-4 ring-black/[0.04]"
              : "border-neutral-200/90 hover:border-neutral-300 hover:bg-white"
          }`}
        >
          <span
            className={`pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300 ${
              focusedField === "email"
                ? "bg-[#111111] text-white"
                : "bg-white text-neutral-400 shadow-2xs"
            }`}
          >
            <Mail size={14} />
          </span>

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={user.email}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full bg-transparent py-3.5 pl-14 pr-10 text-xs font-bold text-[#111111] placeholder:font-medium placeholder:text-neutral-400 focus:outline-none sm:text-[13px]"
            required
          />

          {isEmailValid && (
            <CheckCircle2
              size={16}
              className="pointer-events-none absolute right-4 text-emerald-500 animate-in zoom-in duration-200"
            />
          )}
        </div>
      </Field>

      {/* ── Password Field ── */}
      <Field
        label="Password"
        active={focusedField === "password"}
        rightBadge={
          capsLockOn ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700">
              ⇪ Caps Lock ON
            </span>
          ) : (
            <Link
              href="/auth/forgot-password"
              className="text-[10px] font-black uppercase tracking-wider text-neutral-400 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-[#111111] hover:decoration-black"
            >
              Forgot Password?
            </Link>
          )
        }
      >
        <div
          className={`group relative flex items-center rounded-2xl border bg-[#F8F8F8] transition-all duration-300 ${
            focusedField === "password"
              ? "-translate-y-0.5 border-[#111111] bg-white shadow-[0_12px_28px_-8px_rgba(0,0,0,0.12)] ring-4 ring-black/[0.04]"
              : "border-neutral-200/90 hover:border-neutral-300 hover:bg-white"
          }`}
        >
          <span
            className={`pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300 ${
              focusedField === "password"
                ? "bg-[#111111] text-white"
                : "bg-white text-neutral-400 shadow-2xs"
            }`}
          >
            <Lock size={14} />
          </span>

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••••••"
            value={user.password}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            onKeyUp={handleKeyEvents}
            onKeyDown={handleKeyEvents}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full bg-transparent py-3.5 pl-14 pr-12 text-xs font-bold text-[#111111] placeholder:font-medium placeholder:text-neutral-400 focus:outline-none sm:text-[13px]"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-[#111111]"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </Field>

      {/* ── Primary 3D Submit CTA ── */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={isLoading}
          className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#111111] py-4 text-xs font-black uppercase tracking-[0.2em] text-white shadow-[0_16px_36px_-10px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-10px_rgba(0,0,0,0.6)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:shadow-none"
        >
          {/* Hover Shimmer Sweep */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Authenticating Session…</span>
            </>
          ) : (
            <>
              <span>Enter Atelier</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-black">
                <ArrowRight size={13} />
              </span>
            </>
          )}
        </button>

        {/* Micro Security Footer */}
        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-400">
          <ShieldCheck size={12} className="text-emerald-600" />
          <span>256-Bit Encrypted Member Access</span>
        </div>
      </div>
    </form>
  );
};

// ── Shared Editorial Field Wrapper
function Field({
  label,
  active,
  rightBadge,
  children,
}: {
  label: string;
  active?: boolean;
  rightBadge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <label
          className={`text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
            active ? "text-[#111111]" : "text-neutral-500"
          }`}
        >
          {label}
        </label>
        {rightBadge}
      </div>
      {children}
    </div>
  );
}

export { FormSignIn };
