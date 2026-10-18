"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  ImagePlus,
  Eye,
  EyeOff,
  CheckCircle2,
  Camera,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useSignup } from "@/hooks/signup";

const SignUpForm = () => {
  const { error, user, handleChange, signAction, loading } = useSignup();

  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  // Generate instant live preview URL when user selects a photo
  useEffect(() => {
    if (!user?.avatar) {
      setAvatarPreviewUrl(null);
      return;
    }
    if (typeof user.avatar === "string") {
      setAvatarPreviewUrl(user.avatar);
      return;
    }
    if (typeof user.avatar === "object" && user.avatar !== null) {
      const objectUrl = URL.createObjectURL(user.avatar as Blob);
      setAvatarPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [user?.avatar]);

  // Live validation checks
  const isNameValid = (user?.fullName || "").trim().length >= 3;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user?.email || "");

  // Live 4-Stage Password Strength Telemetry
  const pwdStrength = useMemo(() => {
    const pwd = user?.password || "";
    const hasLength = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);
    const hasSpecial = /[^A-Za-z0-9]/.test(pwd) || pwd.length >= 12;

    const score = [hasLength, hasUpper, hasNumber, hasSpecial].filter(
      Boolean,
    ).length;

    const labels = ["Too Short", "Weak", "Fair", "Good", "Atelier Strong"];
    const colors = [
      "bg-surface-hover",
      "bg-danger",
      "bg-warning",
      "bg-info",
      "bg-success",
    ];

    return {
      score,
      label: pwd.length === 0 ? "Required" : labels[score],
      color: colors[score],
      hasLength,
      hasUpper,
      hasNumber,
    };
  }, [user?.password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signAction();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* ── Error Banner ── */}
      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-danger-border bg-danger-soft px-4 py-3.5 text-xs font-bold text-danger shadow-2xs animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-danger" />
          <div className="flex-1 leading-relaxed">{error}</div>
        </div>
      )}

      {/* ── 1. Interactive 3D Avatar Studio Uploader ── */}
      <Field
        label="Profile Portrait"
        rightBadge={
          user?.avatar ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-success">
              <CheckCircle2 size={11} /> Portrait Ready
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
              Optional · PNG / JPG
            </span>
          )
        }
      >
        <label className="group relative flex cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-surface-subtle p-3.5 transition-all duration-300 hover:border-border hover:bg-surface hover:shadow-md">
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="absolute inset-0 z-20 h-full w-full cursor-pointer opacity-0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              e.target.files?.[0] &&
              handleChange("avatar", e.target.files[0] as unknown as string)
            }
          />

          {/* Avatar Preview Box */}
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-surface bg-surface shadow-sm transition-transform duration-300 group-hover:scale-105">
            {avatarPreviewUrl ? (
              <>
                <img
                  src={avatarPreviewUrl}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-action/45 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera size={16} className="text-on-action" />
                </div>
              </>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-surface-muted text-muted transition-colors group-hover:bg-action group-hover:text-on-action">
                <ImagePlus size={20} />
              </div>
            )}
          </div>

          {/* Upload Copy */}
          <div className="min-w-0 flex-1 text-left">
            {user?.avatar ? (
              <>
                <p className="truncate text-xs font-black uppercase tracking-wider text-primary">
                  {user.avatar.name || "Custom Portrait Selected"}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-success">
                  {user.avatar.size
                    ? `${(user.avatar.size / (1024 * 1024)).toFixed(2)} MB · Click to replace`
                    : "Click anywhere to change photo"}
                </p>
              </>
            ) : (
              <>
                <p className="text-xs font-black uppercase tracking-wider text-primary">
                  Upload Member Portrait
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-muted">
                  Drag &amp; drop or click to browse (Max 5MB)
                </p>
              </>
            )}
          </div>

          <span className="rounded-xl border border-border bg-surface px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-secondary transition-colors group-hover:border-border-strong group-hover:bg-action group-hover:text-on-action">
            {user?.avatar ? "Change" : "Browse"}
          </span>
        </label>
      </Field>

      {/* ── 2. Full Name Field ── */}
      <Field
        label="Full Name"
        active={focusedField === "fullName"}
        rightBadge={
          isNameValid ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-success">
              <CheckCircle2 size={11} /> Looks Good
            </span>
          ) : null
        }
      >
        <div
          className={`group relative flex items-center rounded-2xl border bg-surface-subtle transition-all duration-300 ${
            focusedField === "fullName"
              ? "-translate-y-0.5 border-border bg-surface shadow-[0_12px_28px_-8px_rgba(var(--shadow-rgb),0.12)] ring-4 ring-focus/20"
              : "border-border/90 hover:border-border-strong hover:bg-surface"
          }`}
        >
          <span
            className={`pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300 ${
              focusedField === "fullName"
                ? "bg-action text-on-action"
                : "bg-surface text-muted shadow-2xs"
            }`}
          >
            <User size={14} />
          </span>

          <input
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            value={user.fullName}
            onFocus={() => setFocusedField("fullName")}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="w-full bg-transparent py-3.5 pl-14 pr-10 text-xs font-bold text-primary placeholder:font-medium placeholder:text-muted focus:outline-none sm:text-[13px]"
            required
          />

          {isNameValid && (
            <CheckCircle2
              size={16}
              className="pointer-events-none absolute right-4 text-success animate-in zoom-in duration-200"
            />
          )}
        </div>
      </Field>

      {/* ── 3. Email Address Field ── */}
      <Field
        label="Email Address"
        active={focusedField === "email"}
        rightBadge={
          isEmailValid ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-success">
              <CheckCircle2 size={11} /> Valid Email
            </span>
          ) : null
        }
      >
        <div
          className={`group relative flex items-center rounded-2xl border bg-surface-subtle transition-all duration-300 ${
            focusedField === "email"
              ? "-translate-y-0.5 border-border bg-surface shadow-[0_12px_28px_-8px_rgba(var(--shadow-rgb),0.12)] ring-4 ring-focus/20"
              : "border-border/90 hover:border-border-strong hover:bg-surface"
          }`}
        >
          <span
            className={`pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300 ${
              focusedField === "email"
                ? "bg-action text-on-action"
                : "bg-surface text-muted shadow-2xs"
            }`}
          >
            <Mail size={14} />
          </span>

          <input
            type="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={user.email}
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => handleChange("email", e.target.value)}
            className="w-full bg-transparent py-3.5 pl-14 pr-10 text-xs font-bold text-primary placeholder:font-medium placeholder:text-muted focus:outline-none sm:text-[13px]"
            required
          />

          {isEmailValid && (
            <CheckCircle2
              size={16}
              className="pointer-events-none absolute right-4 text-success animate-in zoom-in duration-200"
            />
          )}
        </div>
      </Field>

      {/* ── 4. Password Field + Live 4-Bar Strength Meter ── */}
      <Field
        label="Password"
        active={focusedField === "password"}
        rightBadge={
          <span
            className={`font-mono text-[10px] font-black uppercase tracking-wider ${
              pwdStrength.score >= 3
                ? "text-success"
                : pwdStrength.score >= 2
                  ? "text-warning"
                  : "text-muted"
            }`}
          >
            {pwdStrength.label}
          </span>
        }
      >
        <div
          className={`group relative flex items-center rounded-2xl border bg-surface-subtle transition-all duration-300 ${
            focusedField === "password"
              ? "-translate-y-0.5 border-border bg-surface shadow-[0_12px_28px_-8px_rgba(var(--shadow-rgb),0.12)] ring-4 ring-focus/20"
              : "border-border/90 hover:border-border-strong hover:bg-surface"
          }`}
        >
          <span
            className={`pointer-events-none absolute left-3.5 flex h-8 w-8 items-center justify-center rounded-xl transition-colors duration-300 ${
              focusedField === "password"
                ? "bg-action text-on-action"
                : "bg-surface text-muted shadow-2xs"
            }`}
          >
            <Lock size={14} />
          </span>

          <input
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={user.password}
            onFocus={() => setFocusedField("password")}
            onBlur={() => setFocusedField(null)}
            onChange={(e) => handleChange("password", e.target.value)}
            className="w-full bg-transparent py-3.5 pl-14 pr-12 text-xs font-bold text-primary placeholder:font-medium placeholder:text-muted focus:outline-none sm:text-[13px]"
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-muted transition-colors hover:bg-surface-muted hover:text-primary"
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* 4-Segment Strength Bar */}
        <div className="mt-1.5 space-y-1.5 px-1">
          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((segment) => (
              <div
                key={segment}
                className={`h-1 rounded-full transition-all duration-300 ${
                  pwdStrength.score >= segment
                    ? pwdStrength.color
                    : "bg-surface-hover"
                }`}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-muted">
            <span className={pwdStrength.hasLength ? "text-success" : ""}>
              ✓ 8+ Chars
            </span>
            <span className={pwdStrength.hasUpper ? "text-success" : ""}>
              ✓ Uppercase
            </span>
            <span className={pwdStrength.hasNumber ? "text-success" : ""}>
              ✓ Number
            </span>
          </div>
        </div>
      </Field>

      {/* ── 5. Submit CTA ── */}
      <div className="pt-1">
        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-2xl bg-action py-4 text-xs font-black uppercase tracking-[0.2em] text-on-action shadow-[0_16px_36px_-10px_rgba(var(--shadow-rgb),0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-10px_rgba(var(--shadow-rgb),0.6)] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-surface-hover disabled:shadow-none"
        >
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />

          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              <span>Minting Membership…</span>
            </>
          ) : (
            <>
              <span>Create VIP Account</span>
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-surface group-hover:text-primary">
                <ArrowRight size={13} />
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

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
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between px-1">
        <label
          className={`text-[10px] font-black uppercase tracking-[0.18em] transition-colors ${
            active ? "text-primary" : "text-muted"
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

export { SignUpForm };
