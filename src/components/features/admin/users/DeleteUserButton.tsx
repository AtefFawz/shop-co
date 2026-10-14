"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";
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
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/admin/users/${userId}`);
      toast.success(`User "${userName}" has been permanently removed`);
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
      {/* Main Delete Action Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-rose-200/80 bg-rose-50/50 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-rose-600 transition-all hover:bg-rose-600 hover:text-white hover:border-rose-600 active:scale-95"
        title="Delete User Account"
      >
        <Trash2
          size={14}
          className="transition-transform duration-300 group-hover:rotate-12"
        />
        <span className="hidden sm:inline">Delete Profile</span>
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-[2.5rem] border border-white/20 bg-white p-7 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Close X Button */}
            <button
              type="button"
              onClick={() => !loading && setIsOpen(false)}
              className="absolute top-6 right-6 cursor-pointer text-neutral-400 transition-colors hover:text-black"
            >
              <X size={18} />
            </button>

            {/* Warning Icon */}
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 ring-8 ring-rose-500/5">
              <AlertTriangle size={26} />
            </div>

            {/* Modal Text */}
            <div className="mb-7 text-center space-y-1.5">
              <h3 className="text-lg font-black uppercase tracking-tight text-[#111111]">
                Purge User Account?
              </h3>
              <p className="text-xs leading-relaxed text-neutral-500 px-2">
                You are about to permanently delete{" "}
                <strong className="text-black">&ldquo;{userName}&rdquo;</strong>
                . All associated credentials and telemetry records will be
                erased.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3">
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
                className="flex-1 cursor-pointer rounded-2xl bg-rose-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-[0_10px_24px_-6px_rgba(225,29,72,0.5)] transition-all hover:bg-rose-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Purging...</span>
                  </>
                ) : (
                  "Confirm Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
