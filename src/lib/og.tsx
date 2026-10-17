import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { starPath } from "@/lib/star";

// Share images and icons, rendered at build time (Satori: flexbox-only CSS, no Arabic shaping).

const fontFile = (pkg: string, file: string) => join(process.cwd(), "node_modules/@fontsource", pkg, "files", file);

async function loadFonts() {
  const [display, displayItalic, sans, sansBold] = await Promise.all([
    readFile(fontFile("bodoni-moda", "bodoni-moda-latin-600-normal.woff")),
    readFile(fontFile("bodoni-moda", "bodoni-moda-latin-500-italic.woff")),
    readFile(fontFile("jost", "jost-latin-400-normal.woff")),
    readFile(fontFile("jost", "jost-latin-600-normal.woff")),
  ]);
  return [
    { name: "Bodoni", data: display, weight: 600 as const, style: "normal" as const },
    { name: "Bodoni", data: displayItalic, weight: 500 as const, style: "italic" as const },
    { name: "Jost", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Jost", data: sansBold, weight: 600 as const, style: "normal" as const },
  ];
}

const INK = "#0b0907";
const GOLD = "#e2c07f";
const GOLD_DEEP = "#bd9147";
const IVORY = "#f6f1e7";
const STONE = "#a99c87";

export const OG_SIZE = { width: 1200, height: 630 };

function Star({ size, color = GOLD, stroke = false }: { size: number; color?: string; stroke?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d={starPath(50, 50, stroke ? 46 : 48)}
        fill={stroke ? "none" : color}
        stroke={stroke ? color : "none"}
        strokeWidth={stroke ? 2 : 0}
      />
    </svg>
  );
}

export async function renderShareImage({
  eyebrow,
  title,
  subtitle,
  footer,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
}) {
  const fonts = await loadFonts();
  const titleSize = title.length > 34 ? 58 : title.length > 20 ? 70 : 84;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: `radial-gradient(circle at 78% 40%, #3a2a17 0%, #1a130c 38%, ${INK} 72%)`,
          color: IVORY,
          fontFamily: "Jost",
          padding: "60px 72px",
        }}
      >
        <div style={{ position: "absolute", right: -40, top: 95, display: "flex", opacity: 0.85 }}>
          <Star size={440} color={GOLD_DEEP} stroke />
        </div>
        <div style={{ position: "absolute", right: 90, top: 225, display: "flex", opacity: 0.35 }}>
          <Star size={180} color={GOLD_DEEP} stroke />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 660 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Star size={40} />
            <div style={{ fontFamily: "Bodoni", fontWeight: 600, fontSize: 30, letterSpacing: 9 }}>ARABIAN MUSK</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 6, color: GOLD, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div style={{ fontFamily: "Bodoni", fontWeight: 600, fontSize: titleSize, lineHeight: 1.04, marginTop: 18 }}>
              {title}
            </div>
            {/* Keep "Rs" with its number. */}
            <div style={{ fontSize: 28, lineHeight: 1.4, color: STONE, marginTop: 22 }}>{subtitle.replace(/Rs /g, "Rs\u00a0")}</div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: GOLD, letterSpacing: 1 }}>{footer}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

export function renderIcon(size: number, { rounded = false }: { rounded?: boolean } = {}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: `radial-gradient(circle at 35% 25%, #3a2a17 0%, ${INK} 75%)`,
          borderRadius: rounded ? size * 0.22 : 0,
        }}
      >
        <Star size={Math.round(size * 0.62)} />
      </div>
    ),
    { width: size, height: size },
  );
}
