export interface NotificationPreferences {
  inAppBanners: boolean;
  orderUpdates: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  inAppBanners: true,
  orderUpdates: true,
  soundEnabled: true,
  vibrationEnabled: true,
  quietHoursEnabled: false,
  quietHoursStart: "22:00",
  quietHoursEnd: "08:00",
};

function isValidTime(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function normalizeNotificationPreferences(
  value: unknown,
): NotificationPreferences {
  if (!value || typeof value !== "object") {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }

  const candidate = value as Partial<NotificationPreferences>;
  return {
    inAppBanners: candidate.inAppBanners !== false,
    orderUpdates: candidate.orderUpdates !== false,
    soundEnabled: candidate.soundEnabled !== false,
    vibrationEnabled: candidate.vibrationEnabled !== false,
    quietHoursEnabled: candidate.quietHoursEnabled === true,
    quietHoursStart: isValidTime(candidate.quietHoursStart)
      ? candidate.quietHoursStart
      : DEFAULT_NOTIFICATION_PREFERENCES.quietHoursStart,
    quietHoursEnd: isValidTime(candidate.quietHoursEnd)
      ? candidate.quietHoursEnd
      : DEFAULT_NOTIFICATION_PREFERENCES.quietHoursEnd,
  };
}

/** Uses the device's local clock and supports quiet windows crossing midnight. */
export function isQuietHoursActive(
  preferences: NotificationPreferences,
  now: Date = new Date(),
): boolean {
  if (!preferences.quietHoursEnabled) return false;

  const [startHour, startMinute] = preferences.quietHoursStart.split(":").map(Number);
  const [endHour, endMinute] = preferences.quietHoursEnd.split(":").map(Number);
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  const current = now.getHours() * 60 + now.getMinutes();

  // Equal boundaries are treated as disabled rather than unexpectedly muting
  // notifications for a full day.
  if (start === end) return false;
  if (start < end) return current >= start && current < end;
  return current >= start || current < end;
}

export function isOrderStatusNotification(notification: {
  type?: string;
  order?: string;
}): boolean {
  const type = (notification.type || "").toUpperCase();
  return Boolean(notification.order) || type.startsWith("ORDER_") || type.includes("DELIVERY");
}
