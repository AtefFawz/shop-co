"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Camera,
  Loader2,
  X,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  User,
} from "lucide-react";
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

export default function UpdateAccountForm({
  isOpen,
  onClose,
  currentUser,
  onSuccess,
}: UpdateProfileModalProps) {
  const [fullName, setFullName] = useState(currentUser.fullName || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(currentUser.avatar || "");
  const [imgError, setImgError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "";
    message: string;
  }>({ type: "", message: "" });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setFullName(currentUser.fullName || "");
    setPreviewUrl(currentUser.avatar || "");
    setImgError(false);
  }, [currentUser.fullName, currentUser.avatar]);

  if (!isOpen || !mounted) return null;

  const initials = (fullName || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setStatus({
          type: "error",
          message: "Please select a valid image file",
        });
        return;
      }
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setImgError(false);
      setStatus({ type: "", message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    const formData = new FormData();
    if (fullName.trim() && fullName.trim() !== currentUser.fullName) {
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
          message: "Atelier profile updated successfully!",
        });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 900);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to update profile";
      setStatus({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const hasValidPreview = Boolean(previewUrl) && !imgError;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => !loading && onClose()}
        className="fixed inset-0 bg-action/65 backdrop-blur-md animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2.4rem] border border-border/80 bg-surface p-6 text-primary shadow-[0_35px_90px_rgba(var(--shadow-rgb),0.4)] animate-in zoom-in-95 duration-200 sm:p-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between border-b border-border-subtle pb-4">
          <div>
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-[0.2em] text-muted">
              <Sparkles size={10} className="text-primary" /> ATELIER IDENTITY
            </span>
            <h2 className="mt-0.5 text-lg font-black uppercase tracking-tight text-primary">
              Edit Profile Details
            </h2>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-surface-muted text-muted transition-colors hover:bg-action hover:text-on-action"
          >
            <X size={16} />
          </button>
        </div>

        {/* Feedback Banner */}
        {status.message && (
          <div
            className={`mb-6 flex items-center gap-2.5 rounded-2xl border p-3.5 text-xs font-bold ${
              status.type === "success"
                ? "border-success-border bg-success-soft text-success"
                : "border-danger-border bg-danger-soft text-danger"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle2 size={16} className="shrink-0 text-success" />
            ) : (
              <AlertCircle size={16} className="shrink-0 text-danger" />
            )}
            <span>{status.message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Safe Avatar Preview & Uploader (Never crashes on empty or blob URL) */}
          <div className="flex flex-col items-center">
            <label
              htmlFor="avatar-upload"
              className="group relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-[2rem] border-4 border-border bg-action font-mono text-2xl font-black text-on-action shadow-lg transition-transform duration-300 hover:scale-105"
            >
              {hasValidPreview ? (
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>{initials || "U"}</span>
              )}

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-action/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
                <Camera className="text-on-action" size={22} />
                <span className="font-sans text-[8px] font-black uppercase tracking-widest text-on-action">
                  Change
                </span>
              </div>
            </label>

            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <span className="mt-2.5 text-[10px] font-bold uppercase tracking-widest text-muted">
              {avatarFile
                ? avatarFile.name
                : "Click portrait to upload new photo"}
            </span>
          </div>

          {/* Full Name Input */}
          <div className="space-y-2">
            <label className="block px-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User
                size={15}
                className="pointer-events-none absolute left-4 text-muted"
              />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-2xl border border-border bg-surface-subtle py-3.5 pl-11 pr-4 text-xs font-bold text-primary transition-all focus:border-border focus:bg-surface focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-2xl border border-border bg-surface py-3.5 text-xs font-black uppercase tracking-wider text-secondary transition hover:border-border-strong hover:bg-surface-subtle disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-action py-3.5 text-xs font-black uppercase tracking-widest text-on-action shadow-[0_14px_30px_-8px_rgba(var(--shadow-rgb),0.4)] transition-all hover:bg-action-hover active:scale-98 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}
