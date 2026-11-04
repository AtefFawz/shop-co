import { describe, expect, it } from "vitest";
import {
  DEFAULT_NOTIFICATION_PREFERENCES,
  isQuietHoursActive,
  normalizeNotificationPreferences,
} from "@/shared/preferences/notificationPreferenceUtils";

const atTime = (hour: number, minute: number) =>
  new Date(2026, 0, 15, hour, minute, 0, 0);

describe("notification preference normalization", () => {
  it("uses safe defaults for unknown or malformed stored data", () => {
    expect(normalizeNotificationPreferences(null)).toEqual(
      DEFAULT_NOTIFICATION_PREFERENCES,
    );
    expect(
      normalizeNotificationPreferences({
        quietHoursEnabled: true,
        quietHoursStart: "29:90",
        quietHoursEnd: "08:00",
        soundEnabled: false,
      }),
    ).toEqual({
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      quietHoursEnabled: true,
      soundEnabled: false,
      quietHoursEnd: "08:00",
    });
  });

  it("preserves explicitly disabled switches", () => {
    expect(
      normalizeNotificationPreferences({
        inAppBanners: false,
        orderUpdates: false,
        vibrationEnabled: false,
      }),
    ).toMatchObject({
      inAppBanners: false,
      orderUpdates: false,
      vibrationEnabled: false,
    });
  });
});

describe("quiet-hours window", () => {
  const overnight = {
    ...DEFAULT_NOTIFICATION_PREFERENCES,
    quietHoursEnabled: true,
    quietHoursStart: "22:00",
    quietHoursEnd: "08:00",
  };

  it("handles a window that crosses midnight", () => {
    expect(isQuietHoursActive(overnight, atTime(23, 30))).toBe(true);
    expect(isQuietHoursActive(overnight, atTime(7, 59))).toBe(true);
    expect(isQuietHoursActive(overnight, atTime(8, 0))).toBe(false);
    expect(isQuietHoursActive(overnight, atTime(14, 0))).toBe(false);
  });

  it("handles a same-day window and disabled quiet hours", () => {
    const daytime = {
      ...overnight,
      quietHoursStart: "13:00",
      quietHoursEnd: "15:00",
    };
    expect(isQuietHoursActive(daytime, atTime(14, 0))).toBe(true);
    expect(isQuietHoursActive(daytime, atTime(15, 0))).toBe(false);
    expect(
      isQuietHoursActive({ ...daytime, quietHoursEnabled: false }, atTime(14, 0)),
    ).toBe(false);
  });

  it("does not interpret identical boundaries as a full-day mute", () => {
    const identical = {
      ...overnight,
      quietHoursStart: "09:00",
      quietHoursEnd: "09:00",
    };
    expect(isQuietHoursActive(identical, atTime(12, 0))).toBe(false);
  });
});
