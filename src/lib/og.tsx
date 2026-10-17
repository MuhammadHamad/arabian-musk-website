import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { HERO_LABEL, PERFUME_LABEL } from "@/lib/renders";
import { starPath } from "@/lib/star";

// Share images and icons, rendered at build time (Satori: flexbox-only CSS, no Arabic shaping).

const fontFile = (pkg: string, file: string) => join(process.cwd(), "node_modules/@fontsource", pkg, "files", file);

async function loadFonts() {
  const [display, displaySemi, sans, sansBold] = await Promise.all([
    readFile(fontFile("cormorant-garamond", "cormorant-garamond-latin-700-normal.woff")),
    readFile(fontFile("cormorant-garamond", "cormorant-garamond-latin-600-normal.woff")),
    readFile(fontFile("lato", "lato-latin-400-normal.woff")),
    readFile(fontFile("lato", "lato-latin-700-normal.woff")),
  ]);
  return [
    { name: "Cormorant", data: display, weight: 700 as const, style: "normal" as const },
    { name: "Cormorant", data: displaySemi, weight: 600 as const, style: "normal" as const },
    { name: "Lato", data: sans, weight: 400 as const, style: "normal" as const },
    { name: "Lato", data: sansBold, weight: 700 as const, style: "normal" as const },
  ];
}

async function render(file: string) {
  const buf = await readFile(join(process.cwd(), "src/assets/renders", file));
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

const INK = "#111111";
const MUTED = "#6d655d";
const AMBER = "#8c4e03";
const GOLD = "#c9a66b";
const GOLD_LIGHT = "#e3cb9c";

export const OG_SIZE = { width: 1200, height: 630 };

type Box = { left: number; top: number; width: number; height: number };

/** The words on a bottle label, placed in pixels on an image drawn at (x, y, w, h). */
function Label({ box, img, name, no }: { box: Box; img: { x: number; y: number; w: number; h: number }; name?: string; no?: number }) {
  const w = (img.w * box.width) / 100;
  const nameSize = (w * ((name?.length ?? 0) > 18 ? 10.5 : (name?.length ?? 0) > 11 ? 12.5 : 15.5)) / 100;
  return (
    <div
      style={{
        position: "absolute",
        left: img.x + (img.w * box.left) / 100,
        top: img.y + (img.h * box.top) / 100,
        width: w,
        height: (img.h * box.height) / 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${w * 0.12}px`,
        textAlign: "center",
      }}
    >
      <div style={{ fontFamily: "Lato", fontSize: w * 0.056, letterSpacing: w * 0.014, color: GOLD, textTransform: "uppercase" }}>Arabian Musk</div>
      <div style={{ width: w * 0.26, height: Math.max(1, w * 0.007), background: GOLD, opacity: 0.6, margin: `${w * 0.06}px 0` }} />
      {name && <div style={{ fontFamily: "Cormorant", fontWeight: 600, fontSize: nameSize, lineHeight: 1.08, color: GOLD_LIGHT }}>{name}</div>}
      {no !== undefined && (
        <div style={{ fontFamily: "Lato", fontSize: w * 0.054, letterSpacing: w * 0.01, color: GOLD, marginTop: w * 0.07 }}>{`N° ${no}`}</div>
      )}
    </div>
  );
}

export async function renderHomeShare({ eyebrow, title, subtitle, footer }: { eyebrow: string; title: string; subtitle: string; footer: string }) {
  const [fonts, hero] = await Promise.all([loadFonts(), render("hero-amber.jpg")]);
  const img = { x: 0, y: -22, w: 1200, h: 675 };
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#2a1708" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> only */}
        <img src={hero} alt="" width={img.w} height={img.h} style={{ position: "absolute", left: img.x, top: img.y }} />
        <Label box={HERO_LABEL} img={img} />
        <div style={{ position: "absolute", left: 0, top: 0, width: 760, height: 630, display: "flex", backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.72), rgba(0,0,0,0))" }} />
        <div style={{ position: "absolute", left: 64, top: 0, bottom: 0, width: 520, display: "flex", flexDirection: "column", justifyContent: "center", color: "#fff" }}>
          <div style={{ fontFamily: "Lato", fontWeight: 700, fontSize: 18, letterSpacing: 4, textTransform: "uppercase" }}>{eyebrow}</div>
          <div style={{ fontFamily: "Cormorant", fontWeight: 700, fontSize: 92, lineHeight: 0.98, marginTop: 18 }}>{title}</div>
          <div style={{ fontFamily: "Lato", fontSize: 24, lineHeight: 1.45, marginTop: 22, maxWidth: 440 }}>{subtitle}</div>
          <div style={{ display: "flex", marginTop: 34 }}>
            <div style={{ fontFamily: "Lato", fontSize: 17, letterSpacing: 3, textTransform: "uppercase", background: "#fff", color: "#000", padding: "14px 30px" }}>{footer}</div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}

export async function renderScentShare({
  name,
  no,
  line,
  prices,
  footer,
  scene,
}: {
  name: string;
  no: number;
  line: string;
  prices: string;
  footer: string;
  scene: "plaster" | "marble" | "wood" | "sand";
}) {
  const [fonts, bottle] = await Promise.all([loadFonts(), render(scene === "plaster" ? "perfume.jpg" : `perfume-${scene}.jpg`)]);
  const img = { x: 0, y: 0, w: 504, h: 630 };
  const titleSize = name.length > 18 ? 64 : name.length > 11 ? 76 : 92;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff" }}>
        <div style={{ position: "relative", width: img.w, height: img.h, display: "flex" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Satori renders plain <img> only */}
          <img src={bottle} alt="" width={img.w} height={img.h} />
          <Label box={PERFUME_LABEL} img={img} name={name} no={no} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 60px" }}>
          <div style={{ fontFamily: "Cormorant", fontWeight: 700, fontSize: 36, color: INK }}>Arabian Musk</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Lato", fontWeight: 700, fontSize: 16, letterSpacing: 4, color: AMBER, textTransform: "uppercase" }}>{`N° ${no}`}</div>
            <div style={{ fontFamily: "Cormorant", fontWeight: 700, fontSize: titleSize, lineHeight: 1.0, color: INK, marginTop: 14 }}>{name}</div>
            <div style={{ fontFamily: "Lato", fontSize: 22, color: MUTED, marginTop: 14 }}>{line}</div>
            <div style={{ fontFamily: "Cormorant", fontWeight: 700, fontSize: 34, color: INK, marginTop: 22 }}>{prices.replace(/Rs /g, "Rs ")}</div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ fontFamily: "Lato", fontSize: 15, letterSpacing: 3, color: "#fff", background: AMBER, textTransform: "uppercase", padding: "12px 24px" }}>{footer}</div>
          </div>
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
          background: AMBER,
          borderRadius: rounded ? size * 0.22 : 0,
        }}
      >
        <svg width={Math.round(size * 0.6)} height={Math.round(size * 0.6)} viewBox="0 0 100 100">
          <path d={starPath(50, 50, 46)} fill="none" stroke="#ffffff" strokeWidth={4.5} strokeLinejoin="round" />
          <path d={starPath(50, 50, 20)} fill="#ffffff" />
        </svg>
      </div>
    ),
    { width: size, height: size },
  );
}
