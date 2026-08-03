"use client";
import { User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { useSignup } from "@/hooks/signup";
import { ImagePlus } from "lucide-react";
const FormSignUp = () => {
  const { error, user, handleChange, signAction, loading } = useSignup();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signAction();
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

      {/* Section 5 — Photo */}
      <Field label="Profile Image">
        <label className="relative group flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-black hover:bg-gray-50/50 transition-all cursor-pointer">
          <input
            type="file"
            accept="image/png, image/jpeg"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e: any) =>
              e.target.files && handleChange("avatar", e.target.files[0])
            }
          />
          <div className="w-12 h-12 bg-gray-100 group-hover:bg-black rounded-2xl flex items-center justify-center transition-colors duration-300">
            <ImagePlus
              size={20}
              className="text-gray-400 group-hover:text-white transition-colors"
            />
          </div>
          {user.avatar ? (
            <div>
              <p className="text-sm font-black text-green-600 uppercase tracking-widest">
                ✓ {user.avatar.name}
              </p>
              <p className="text-xs text-gray-400 mt-1">Click to change</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-gray-700">
                Click to upload image
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          )}
        </label>
      </Field>
      {/* ── Full Name ── */}
      <Field label="Full Name">
        <div className="relative">
          <User
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="John Doe"
            value={user.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="auth-input pl-11"
            required
          />
        </div>
      </Field>

      {/* ── Email ── */}
      <Field label="Email Address">
        <div className="relative">
          <Mail
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
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
            type="password"
            placeholder="Create a strong password"
            value={user.password}
            onChange={(e) => handleChange("password", e.target.value)}
            className="auth-input pl-11"
            required
          />
        </div>
      </Field>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-black text-white font-black text-sm uppercase tracking-widest py-4 rounded-2xl hover:bg-gray-800 transition-all active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed shadow-lg shadow-black/10 mt-2"
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing Up…
          </>
        ) : (
          <>
            Create Account
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

export { FormSignUp };
