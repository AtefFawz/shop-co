import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "radial-gradient(circle at 50% 42%, #343b82 0%, #151c3b 48%, #080d1e 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 370,
            height: 370,
            borderRadius: 999,
            border: "2px solid rgba(160,170,255,.19)",
          }}
        />
        <div
          style={{
            width: 260,
            height: 270,
            borderRadius: "58px 58px 72px 72px",
            background: "linear-gradient(145deg, #a18cff 0%, #6c65ef 48%, #347ce5 100%)",
            border: "5px solid rgba(226,232,255,.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            boxShadow: "0 24px 80px rgba(85,93,230,.4)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -83,
              width: 112,
              height: 102,
              border: "20px solid #aabaff",
              borderBottom: "none",
              borderRadius: "65px 65px 0 0",
            }}
          />
          <span
            style={{
              color: "white",
              fontSize: 194,
              fontWeight: 900,
              fontStyle: "italic",
              lineHeight: 1,
              letterSpacing: "-18px",
              marginRight: 18,
              textShadow: "0 8px 18px rgba(10,16,44,.22)",
            }}
          >
            S
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
