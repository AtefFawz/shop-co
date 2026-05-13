"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";

interface DeleteUserProps {
  userId: string;
  userName: string;
}

export default function DeleteUserButton({
  userId,
  userName,
}: DeleteUserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/admin/users/${userId}`);
      toast.success(`User "${userName}" has been deleted`);
      setIsOpen(false);

      // توجيه الأدمن لصفحة اليوزرز بعد المسح بنجاح
      router.push("/dashboard/users");
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 1. زرار المسح الرئيسي */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex text-xs 2xl:text-sm text-nowrap items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 group"
        title="Delete User"
      >
        <Trash2
          size={16}
          className="group-hover:rotate-12 transition-transform"
        />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Delete User
        </span>
      </button>

      {/* 2. الـ Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => !loading && setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
            >
              <X size={20} />
            </button>

            {/* Warning Icon */}
            <div className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={30} className="text-red-500" />
            </div>

            {/* Text */}
            <div className="text-center space-y-2 mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">
                Are you sure?
              </h3>
              <p className="text-xs text-gray-400 font-medium leading-relaxed px-4">
                You are about to delete{" "}
                <span className="text-black font-bold">"{userName}"</span>. This
                action is permanent and cannot be undone.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="flex-1 py-4 rounded-2xl border-2 border-gray-100 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-gray-300 hover:text-gray-600 transition-all disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 py-4 rounded-2xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
