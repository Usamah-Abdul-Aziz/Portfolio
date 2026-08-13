import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Usamah Abdul Aziz — Software Engineer & Full-Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [frauncesRegular, frauncesSemibold, interRegular, mono] = await Promise.all([
    readFile(
      join(process.cwd(), "node_modules/@fontsource/fraunces/files/fraunces-latin-400-normal.woff")
    ),
    readFile(
      join(process.cwd(), "node_modules/@fontsource/fraunces/files/fraunces-latin-600-normal.woff")
    ),
    readFile(
      join(process.cwd(), "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff")
    ),
    readFile(
      join(
        process.cwd(),
        "node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff"
      )
    ),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#F6F3EC",
          position: "relative",
        }}
      >
        {/* subtle wavy thread motif, echoing the site's hero wave */}
        <svg
          width="1200"
          height="630"
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <path
            d="M -50 470 C 120 380, 220 380, 340 460 C 460 540, 560 540, 680 450 C 800 360, 900 360, 1020 440 C 1100 495, 1180 495, 1250 450"
            fill="none"
            stroke="#2F6E68"
            strokeWidth="3"
            strokeOpacity="0.35"
          />
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontSize: 22,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#2F6E68",
              marginBottom: 28,
            }}
          >
            Usamah Abdul Aziz — Informatics Engineering, UNTIRTA
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontFamily: "Fraunces",
              fontWeight: 600,
              fontSize: 68,
              lineHeight: 1.15,
              color: "#1E2A27",
              maxWidth: 1000,
            }}
          >
            <span>Aligning business ideas</span>
            <span>
              {"with code that\u00A0"}
              <span style={{ fontFamily: "Fraunces", fontStyle: "italic", color: "#2F6E68" }}>
                actually works.
              </span>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Inter",
              fontSize: 24,
              color: "#4B5B57",
            }}
          >
            Full-stack development · Project management · Business analysis
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: frauncesRegular, weight: 400, style: "normal" },
        { name: "Fraunces", data: frauncesSemibold, weight: 600, style: "normal" },
        { name: "Inter", data: interRegular, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    }
  );
}
