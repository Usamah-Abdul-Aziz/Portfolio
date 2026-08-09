import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 64, height: 64 };
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
          backgroundColor: "#2F6E68",
          borderRadius: 14,
        }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40">
          <path
            d="M 2 24 C 8 14, 12 14, 16 22 C 20 30, 24 30, 30 18 C 33 12, 36 12, 38 16"
            fill="none"
            stroke="#C98A3E"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    { ...size }
  );
}
