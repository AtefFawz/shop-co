"use client";
import { useState } from "react";
import Image from "next/image";
import { Camera, Loader2, X, AlertCircle, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: {
    fullName: string;
    avatar: string;
  };
  onSuccess: () => void;
}

export default function UpdateProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: UpdateProfileModalProps) {
  const [fullName, setFullName] = useState(currentUser.fullName || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser.avatar || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setStatus({ type: "error", message: "Please upload an image file" });
        return;
      }
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus({ type: "", message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const formData = new FormData();
    if (fullName.trim() && fullName !== currentUser.fullName) {
      formData.append("fullName", fullName.trim());
    }
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const res = await api.patch("/profile/me/update", formData);

      if (res.status === 200) {
        setStatus({
          type: "success",
          message: "Profile updated successfully!",
        });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Something went wrong";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
          <h2 className="text-lg font-black tracking-tight text-black uppercase">
            Edit Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Feedback Message */}
        {status.message && (
          <div
            className={`flex items-center gap-2 p-3 mb-6 rounded-2xl text-xs font-bold ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-rose-50 text-rose-700 border border-rose-200"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Preview & File Input */}
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-gray-200 shadow-md group">
              <Image
                src={previewUrl}
                alt="Avatar Preview"
                fill
                className="object-cover"
              />
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="text-white" size={24} />
              </label>
            </div>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-2">
              Click photo to change
            </span>
          </div>

          {/* Full Name Input */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase tracking-widest text-gray-500">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter full name"
              className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold focus:bg-white focus:outline-none focus:border-black transition-all"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
