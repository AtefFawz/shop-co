"use client";

import { Suspense, useMemo, useState, type FormEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MailCheck, RefreshCw, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { useLocale } from "@/shared/i18n/LocaleProvider";
import { useUserStore } from "@/store/userStore";
import { useSocketStore } from "@/store/socketStore";

const normalizeOtpDigits = (value: string) =>
  value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/\D/g, "")
    .slice(0, 6);

function EmailVerificationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { locale, direction } = useLocale();
  const initialEmail = useMemo(() => (searchParams.get("email") || "").trim().toLowerCase(), [searchParams]);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const isArabic = locale === "ar";

  const verify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim() || !/^\d{6}$/.test(otp)) {
      toast.error(isArabic ? "أدخل البريد الإلكتروني ورمز التحقق المكوّن من 6 أرقام." : "Enter your email and the 6-digit verification code.");
      return;
    }
    setLoading(true);
    try {
      const response = await api.post("auth/verify-email", {
        email: email.trim().toLowerCase(),
        otp,
      });
      const user = response.data?.data?.user;
      if (!user?.role) throw new Error(isArabic ? "استجابة التحقق غير مكتملة." : "The verification response was incomplete.");
      useUserStore.getState().setUser(user);
      useSocketStore.getState().setSocketReady(true);
      toast.success(isArabic ? "تم تأكيد بريدك الإلكتروني." : "Your email has been verified.");
      router.replace(["ADMIN", "MANAGER"].includes(String(user.role).toUpperCase()) ? "/dashboard" : "/");
      router.refresh();
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message || (isArabic ? "رمز التحقق غير صحيح أو انتهت صلاحيته." : "The verification code is invalid or has expired.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (!email.trim()) {
      toast.error(isArabic ? "أدخل بريدك الإلكتروني أولاً." : "Enter your email first.");
      return;
    }
    setResending(true);
    try {
      await api.post("auth/resend-verification", { email: email.trim().toLowerCase() });
      toast.success(isArabic ? "إذا كان الحساب ينتظر التأكيد، فسيصلك رمز جديد." : "If the account is awaiting verification, a new code has been sent.");
    } catch (error: unknown) {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(message || (isArabic ? "تعذر إعادة إرسال الرمز." : "Could not resend the code."));
    } finally {
      setResending(false);
    }
  };

  return (
    <main dir={direction} className="page-section flex min-h-[75svh] items-center justify-center bg-surface-subtle px-4 py-12 text-primary">
      <section className="w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-panel sm:p-8">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-action text-on-action"><MailCheck size={25} /></div>
        <div className="mb-7 space-y-2">
          <p className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted"><ShieldCheck size={13} /> {isArabic ? "حماية الحساب" : "Account security"}</p>
          <h1 className="text-2xl font-black tracking-tight">{isArabic ? "تأكيد البريد الإلكتروني" : "Verify your email"}</h1>
          <p className="text-sm leading-6 text-secondary">{isArabic ? "أرسلنا رمزًا مكوّنًا من 6 أرقام إلى بريدك. أدخله لتفعيل حسابك." : "We sent a 6-digit code to your email. Enter it to activate your account."}</p>
        </div>
        <form onSubmit={verify} className="space-y-4">
          <label className="block space-y-2 text-xs font-bold text-secondary">
            <span>{isArabic ? "البريد الإلكتروني" : "Email address"}</span>
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-3 text-sm text-primary outline-none focus:border-primary" />
          </label>
          <label className="block space-y-2 text-xs font-bold text-secondary">
            <span>{isArabic ? "رمز التحقق" : "Verification code"}</span>
            <input type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} pattern="[0-9]{6}" required value={otp} onChange={(event) => setOtp(normalizeOtpDigits(event.target.value))} placeholder="000000" className="w-full rounded-xl border border-border bg-surface-subtle px-4 py-4 text-center font-mono text-xl font-black tracking-[0.45em] text-primary outline-none focus:border-primary" />
          </label>
          <button disabled={loading} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-action px-5 py-3.5 text-sm font-black text-on-action transition hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? <RefreshCw size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
            {loading ? (isArabic ? "جارٍ التحقق..." : "Verifying...") : (isArabic ? "تأكيد الحساب" : "Verify account")}
          </button>
        </form>
        <button type="button" onClick={resend} disabled={resending} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-xs font-bold text-secondary transition hover:bg-surface-subtle disabled:opacity-60">
          <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
          {resending ? (isArabic ? "جارٍ الإرسال..." : "Sending...") : (isArabic ? "إعادة إرسال الرمز" : "Resend code")}
        </button>
        <Link href="/auth/signin" className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-muted transition hover:text-primary"><ArrowLeft size={13} /> {isArabic ? "العودة لتسجيل الدخول" : "Back to sign in"}</Link>
      </section>
    </main>
  );
}

export default function EmailVerificationPage() {
  return <Suspense fallback={<div className="flex min-h-[70svh] items-center justify-center text-sm text-muted">Loading…</div>}><EmailVerificationContent /></Suspense>;
}
