"use client";

import { useEffect, useRef, useState } from "react";
import { useToasterStore } from "react-hot-toast";

type AudioContextWithWebkit = typeof window & {
  webkitAudioContext?: typeof AudioContext;
};

/**
 * Adds a restrained confirmation tone to toast notifications.
 * Audio is enabled only after an explicit user gesture, following browser
 * autoplay policies. Canceled/loading toasts do not produce sounds.
 */
export default function ToastSoundListener() {
  const { toasts } = useToasterStore();
  const seenIds = useRef(new Set<string>());
  const audioContext = useRef<AudioContext | null>(null);
  const userEnabledAudio = useRef(false);
  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    const enableAudio = () => {
      userEnabledAudio.current = true;
      if (audioContext.current || typeof window === "undefined") return;

      const AudioContextConstructor =
        window.AudioContext || (window as AudioContextWithWebkit).webkitAudioContext;
      if (!AudioContextConstructor) return;

      try {
        audioContext.current = new AudioContextConstructor();
        if (audioContext.current.state === "suspended") {
          void audioContext.current
            .resume()
            .then(() => setAudioReady(true))
            .catch(() => undefined);
        } else {
          setAudioReady(true);
        }
      } catch {
        // Sound is an enhancement only; unsupported audio must not affect UX.
      }
    };

    window.addEventListener("pointerdown", enableAudio, { once: true, passive: true });
    window.addEventListener("keydown", enableAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", enableAudio);
      window.removeEventListener("keydown", enableAudio);
      if (audioContext.current) {
        void audioContext.current.close().catch(() => undefined);
        audioContext.current = null;
      }
    };
  }, []);

  useEffect(() => {
    for (const toast of toasts) {
      if (seenIds.current.has(toast.id)) continue;

      // Haptics are independent from audio autoplay restrictions and work on
      // supported mobile browsers even before sound has been unlocked.
      if (toast.visible && toast.type !== "loading" && typeof navigator !== "undefined") {
        try {
          if (typeof navigator.vibrate === "function") navigator.vibrate([24, 35, 18]);
        } catch {
          // Haptics are optional and must never interrupt the notification.
        }
      }

      if (!toast.visible || toast.type === "loading" || !userEnabledAudio.current) {
        // Do not replay toasts that were already visible before sound was enabled.
        seenIds.current.add(toast.id);
        continue;
      }

      let soundMuted = false;
      try {
        soundMuted = window.localStorage.getItem("shopco_notif_sound") === "muted";
      } catch {
        // If storage is unavailable, retain the default unmuted preference.
      }
      if (soundMuted) {
        seenIds.current.add(toast.id);
        continue;
      }

      const context = audioContext.current;
      // Leave post-gesture toasts unmarked until the browser resumes the context.
      if (!audioReady || !context || context.state !== "running") continue;
      seenIds.current.add(toast.id);

      const notes =
        toast.type === "success"
          ? [
              { frequency: 740, offset: 0, duration: 0.12 },
              { frequency: 988, offset: 0.105, duration: 0.16 },
            ]
          : toast.type === "error"
            ? [
                { frequency: 392, offset: 0, duration: 0.09 },
                { frequency: 294, offset: 0.09, duration: 0.13 },
              ]
            : [{ frequency: 659, offset: 0, duration: 0.11 }];

      const startAt = context.currentTime + 0.015;
      for (const note of notes) {
        try {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          const noteStart = startAt + note.offset;
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(note.frequency, noteStart);
          gain.gain.setValueAtTime(0.0001, noteStart);
          gain.gain.exponentialRampToValueAtTime(0.065, noteStart + 0.018);
          gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + note.duration);
          oscillator.connect(gain);
          gain.connect(context.destination);
          oscillator.start(noteStart);
          oscillator.stop(noteStart + note.duration + 0.015);
          oscillator.onended = () => {
            oscillator.disconnect();
            gain.disconnect();
          };
        } catch {
          // A failed tone must never interfere with the toast itself.
        }
      }
    }

    // Keep the seen-id set bounded for long-lived sessions.
    if (seenIds.current.size > 250) {
      seenIds.current = new Set(toasts.map((toast) => toast.id));
    }
  }, [toasts, audioReady]);

  return null;
}
