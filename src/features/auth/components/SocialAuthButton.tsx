"use client";

import type { ReactNode } from "react";

type SocialAuthButtonProps = {
  label: string;
  children: ReactNode;
  onClick?: () => void;
};

export default function SocialAuthButton({
  label,
  children,
  onClick,
}: SocialAuthButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex cursor-pointer items-center justify-center gap-2.5 rounded-2xl border border-border/90 bg-surface-subtle py-3 text-xs font-black uppercase tracking-widest text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:bg-surface hover:shadow-sm active:scale-95"
    >
      <span className="transition-transform duration-200 group-hover:scale-110">
        {children}
      </span>
      <span>{label}</span>
    </button>
  );
}
