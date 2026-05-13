"use client";
import Link from "next/link";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useLogin } from "../../../hooks/signIn";

const FormSignIn = () => {
  const { error, user, isLoading, handleChange, submitAction } = useLogin();

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
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      {/* ── Error ── */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-600 px-4 py-3.5 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      {/* ── Email ── */}
      <Field label="Email Address">
        <div className="relative">
          <Mail
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={user.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="auth-input pl-11"
            required
          />
        </div>
      </Field>

      {/* ── Password ── */}
      <Field label="Password">
        <div className="relative">
          <Lock
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={user.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="auth-input pr-11"
            required
          />
        </div>
      </Field>

      {/* ── Forgot password ── */}
      <div className="flex justify-end pt-1">
        <Link
          href="/forgot-password"
          className="text-xs font-bold text-gray-500 hover:text-black underline underline-offset-4 decoration-gray-300 hover:decoration-black transition-all"
        >
          Forgot password?
        </Link>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-black text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-black/10 mt-2"
      >
        {isLoading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Logging in…
          </>
        ) : (
          <>
            Log In
            <ArrowRight size={15} />
          </>
        )}
      </button>

      <style>{`
        .auth-input {
          width: 100%;
          padding: 13px 42px;
          background: #f9f9f9;
          border: 1.5px solid #ebebeb;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 600;
          color: #111;
          outline: none;
          transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
        }
        .auth-input::placeholder { color: #aaa; font-weight: 500; }
        .auth-input:focus {
          border-color: #000;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(0,0,0,0.06);
        }
      `}</style>
    </form>
  );
};

// ── Shared field wrapper
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-black uppercase tracking-widest text-gray-500 pl-1">
        {label}
      </label>
      {children}
    </div>
  );
}

export { FormSignIn };
