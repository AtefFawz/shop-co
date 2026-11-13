"use client";

import { useEffect, useState } from "react";
import { BellRing, CheckCircle2, ShieldCheck } from "lucide-react";
import { useLocale } from "@/shared/i18n/LocaleProvider";

type DeviceNotificationPermission = NotificationPermission | "unsupported" | "insecure";

function readPermission(): DeviceNotificationPermission {
  if (!window.isSecureContext) return "insecure";
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

/** Requests notification permission only after an explicit user action. */
export default function PWANotificationAccess() {
  const { locale } = useLocale();
  const isArabic = locale === "ar";
  const [permission, setPermission] = useState<DeviceNotificationPermission>("default");
  const [requesting, setRequesting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const refreshPermission = () => setPermission(readPermission());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshPermission();
    window.addEventListener("focus", refreshPermission);
    return () => window.removeEventListener("focus", refreshPermission);
  }, []);

  const requestAccess = async () => {
    if (!("Notification" in window) || !window.isSecureContext) {
      setPermission(readPermission());
      return;
    }

    setRequesting(true);
    setMessage("");
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setMessage(
        result === "granted"
          ? isArabic
            ? "تم تفعيل إشعارات الجهاز."
            : "Device notifications are enabled."
          : isArabic
            ? "لم يتم منح الإذن. يمكنك تغييره من إعدادات المتصفح أو الجهاز."
            : "Permission was not granted. You can change it in your browser or device settings.",
      );
    } catch {
      setMessage(
        isArabic
          ? "تعذر طلب الإذن من هذا المتصفح."
          : "This browser could not request notification permission.",
      );
    } finally {
      setRequesting(false);
    }
  };

  const granted = permission === "granted";
  const blocked = permission === "denied";
  const unsupported = permission === "unsupported" || permission === "insecure";

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-subtle p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface text-accent">
          {granted ? <CheckCircle2 size={18} /> : <BellRing size={18} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-extrabold text-primary">
              {isArabic ? "إشعارات الجهاز" : "Device notifications"}
            </h4>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                granted
                  ? "bg-success-soft text-success"
                  : blocked || unsupported
                    ? "bg-warning-soft text-warning"
                    : "bg-surface-muted text-muted"
              }`}
            >
              {granted
                ? isArabic ? "مفعّلة" : "Enabled"
                : blocked
                  ? isArabic ? "محظورة" : "Blocked"
                  : unsupported
                    ? isArabic ? "غير مدعومة" : "Unavailable"
                    : isArabic ? "لم يتم الاختيار" : "Not enabled"}
            </span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            {isArabic
              ? "اسمح لـ SHOP.CO بإظهار تنبيهات النظام عند وصول تحديثات مباشرة أثناء اتصال التطبيق. لن نطلب الإذن إلا بعد ضغطك."
              : "Allow SHOP.CO to show system alerts when live updates arrive while the app is connected. Permission is requested only after you tap the button."}
          </p>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            {isArabic
              ? "تنبيه: الإشعارات عند إغلاق التطبيق بالكامل تحتاج ربط Web Push من الخادم. الكاميرا والموقع والميكروفون يطلب كلٌ منها إذنًا منفصلًا وقت استخدام الميزة التي تحتاجه."
              : "Note: notifications while the app is fully closed require server-side Web Push. Camera, location and microphone each request separate access only when a feature needs them."}
          </p>
          {message && (
            <p aria-live="polite" className="mt-2 text-xs font-semibold text-secondary">
              {message}
            </p>
          )}
          {!granted && !unsupported && (
            <button
              type="button"
              onClick={requestAccess}
              disabled={requesting || blocked}
              className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-xl bg-action px-3.5 text-xs font-extrabold text-on-action transition hover:bg-action-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShieldCheck size={14} aria-hidden="true" />
              {requesting
                ? isArabic ? "جارٍ طلب الإذن..." : "Requesting permission..."
                : blocked
                  ? isArabic ? "غيّر الإذن من إعدادات الجهاز" : "Change permission in device settings"
                  : isArabic ? "تفعيل إشعارات الجهاز" : "Enable device notifications"}
            </button>
          )}
          {unsupported && (
            <p className="mt-2 text-[11px] leading-relaxed text-warning">
              {isArabic
                ? "تأكد من فتح الموقع عبر HTTPS واستخدام متصفح يدعم إشعارات الويب."
                : "Use HTTPS and a browser that supports web notifications."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
