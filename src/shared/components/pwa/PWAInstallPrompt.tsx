"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type InstallChoice = { outcome: "accepted" | "dismissed"; platform: string };
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<InstallChoice>;
}

export default function PWAInstallPrompt() {
  const { locale } = useLocale();
  const isArabic = locale === "ar";
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOSInstall, setIsIOSInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && Boolean((navigator as Navigator & { standalone?: boolean }).standalone));
    setIsStandalone(standalone);
    const isAppleMobile =
      /iphone|ipad|ipod/i.test(window.navigator.userAgent) ||
      (window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
    setIsIOSInstall(isAppleMobile && !standalone);

    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" }).catch((error: unknown) => {
        console.error("SHOP.CO service worker registration failed:", error);
      });
    }

    const handleBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setInstallEvent(null);
      setIsStandalone(true);
      setDismissed(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) {
      setShowIOSHelp((current) => !current);
      return;
    }

    try {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      if (choice.outcome === "accepted") setDismissed(true);
      setInstallEvent(null);
    } catch (error) {
      console.error("SHOP.CO installation prompt failed:", error);
    }
  };

  if (isStandalone || dismissed || (!installEvent && !isIOSInstall)) return null;

  return (
    <aside
      dir={isArabic ? "rtl" : "ltr"}
      aria-label={isArabic ? "تثبيت تطبيق SHOP.CO" : "Install SHOP.CO"}
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto w-auto max-w-md rounded-2xl border border-border bg-surface/95 p-3 text-primary shadow-[var(--shadow-floating)] backdrop-blur-2xl sm:inset-x-auto sm:bottom-5 sm:w-full"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-action text-lg font-black tracking-tight text-on-action">
          S.
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-black">{isArabic ? "ثبّت SHOP.CO على موبايلك" : "Install SHOP.CO on your phone"}</p>
          <p className="mt-0.5 text-[11px] leading-5 text-secondary">
            {isArabic ? "وصول أسرع وتجربة مستقلة زي التطبيقات." : "Quick access and an app-like experience."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-xl bg-action px-3 text-xs font-extrabold text-on-action transition hover:bg-action-hover"
        >
          <Download size={14} aria-hidden="true" />
          {isArabic ? "تثبيت" : "Install"}
        </button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label={isArabic ? "إغلاق" : "Dismiss"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-surface-muted hover:text-primary"
        >
          <X size={15} />
        </button>
      </div>

      {isIOSInstall && showIOSHelp && (
        <p className="mt-3 flex items-start gap-2 border-t border-border pt-3 text-xs leading-6 text-secondary">
          <Share size={15} className="mt-1 shrink-0 text-primary" />
          {isArabic
            ? "افتح الصفحة في Safari، واضغط زر المشاركة، ثم اختر «إضافة إلى الشاشة الرئيسية»."
            : "Open this page in Safari, tap Share, then choose “Add to Home Screen”."}
        </p>
      )}
    </aside>
  );
}
