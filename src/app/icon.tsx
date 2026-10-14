// app/icon.tsx
import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111111",
        borderRadius: "16px",
        border: "2px solid rgba(255,255,255,0.18)",
        color: "#FFFFFF",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Top right luxury sparkle dot */}
      <div
        style={{
          position: "absolute",
          top: "9px",
          right: "9px",
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: "#FFFFFF",
        }}
      />
      <span
        style={{
          fontSize: "36px",
          fontWeight: 900,
          letterSpacing: "-0.06em",
          lineHeight: 1,
        }}
      >
        S.
      </span>
    </div>,
    {
      ...size,
    },
  );
}
