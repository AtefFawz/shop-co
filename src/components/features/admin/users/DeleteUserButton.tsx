"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2, X, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteUserProps {
  userId: string;
  userName?: string;
}

export default function DeleteUserButton({
  userId,
  userName = "this user",
}: DeleteUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) setIsOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, loading]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/admin/users/${userId}`);
      toast.success(`Profile "${userName}" permanently purged`);
      setIsOpen(false);

      router.push("/dashboard/admin/users");
      router.refresh();
    } catch (error: any) {
      console.error("Delete user failed:", error);
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-600 hover:bg-rose-600 hover:text-white hover:shadow-[0_10px_24px_-6px_rgba(225,29,72,0.45)] active:scale-95"
        title="Delete User Profile"
      >
        <Trash2
          size={14}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
        <span className="hidden sm:inline">Delete Profile</span>
      </button>

      {/* Fullscreen Portal Modal (Never trapped by parent backdrop-blur/transform) */}
      {mounted &&
        isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
              onClick={() => !loading && setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
            />

            {/* 3D Modal Card */}
            <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.2rem] border border-white/20 bg-white p-7 text-[#111111] shadow-[0_35px_90px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-200">
              <button
                type="button"
                disabled={loading}
                onClick={() => setIsOpen(false)}
                className="absolute right-6 top-6 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-black hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/5">
                <ShieldAlert size={28} />
              </div>

              <div className="text-center space-y-2">
                <span className="inline-block rounded-full bg-rose-50 px-3 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.2em] text-rose-600">
                  IRREVERSIBLE SECURITY ACTION
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-[#111111]">
                  Purge Member Dossier?
                </h3>
                <p className="text-xs leading-relaxed text-neutral-500 px-2">
                  You are about to permanently erase{" "}
                  <strong className="font-black text-[#111111]">
                    &ldquo;{userName}&rdquo;
                  </strong>{" "}
                  (
                  <span className="font-mono">
                    #{userId.slice(-6).toUpperCase()}
                  </span>
                  ). All credentials and access privileges will be revoked
                  immediately.
                </p>
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setIsOpen(false)}
                  className="flex-1 cursor-pointer rounded-2xl border border-neutral-200 bg-white py-3.5 text-xs font-black uppercase tracking-wider text-neutral-700 transition-colors hover:border-black hover:bg-neutral-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleDelete}
                  className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_12px_28px_-6px_rgba(225,29,72,0.55)] transition-all hover:bg-rose-700 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Purging...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={14} />
                      <span>Confirm Purge</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
