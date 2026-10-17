import Image, { type StaticImageData } from "next/image";
import attarPlaster from "@/assets/renders/attar.jpg";
import attarWood from "@/assets/renders/attar-wood.jpg";
import perfumePlaster from "@/assets/renders/perfume.jpg";
import perfumeMarble from "@/assets/renders/perfume-marble.jpg";
import perfumeSand from "@/assets/renders/perfume-sand.jpg";
import perfumeWood from "@/assets/renders/perfume-wood.jpg";
import { PERFUME_LABEL } from "@/lib/renders";
import { sceneFor, type Scene, type Scent } from "@/lib/scent";

export const PERFUME_BY_SCENE: Record<Scene, StaticImageData> = {
  plaster: perfumePlaster,
  marble: perfumeMarble,
  wood: perfumeWood,
  sand: perfumeSand,
};

export const ATTAR_RENDERS = { plaster: attarPlaster, wood: attarWood };

type Props = {
  scent: Scent;
  variant?: "perfume" | "attar";
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Crop in on the bottle (1 = the full render). */
  zoom?: number;
  /** Square frame (the render is 4:5 and is centred inside). */
  square?: boolean;
  scene?: Scene;
};

/** The shop's perfume bottle or attar flacon, with the scent's name on the perfume label. */
export function ScentImage({ scent, variant = "perfume", sizes, priority, className = "", zoom = 1, square = false, scene }: Props) {
  const perfume = variant === "perfume";
  const s = scene ?? sceneFor(scent);
  const src = perfume ? PERFUME_BY_SCENE[s] : s === "wood" || s === "sand" ? ATTAR_RENDERS.wood : ATTAR_RENDERS.plaster;
  return (
    <div className={`relative overflow-hidden bg-cream ${square ? "aspect-square" : "aspect-[4/5]"} ${className}`}>
      {/* The render is 4:5. It is scaled about the bottle's centre (50% x, 49% y of the render) and that
          point is kept at the frame's centre, so square and zoomed crops stay on the bottle. */}
      <div
        className="absolute inset-x-0 aspect-[4/5]"
        style={{ top: "50%", transform: `translateY(-49%) scale(${zoom})`, transformOrigin: "50% 49%" }}
      >
        <Image
          src={src}
          alt={perfume ? `${scent.name} perfume bottle` : `${scent.name} attar flacon`}
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          className="object-cover"
        />
        {perfume && <BottleLabel box={PERFUME_LABEL} name={scent.name} no={scent.no} />}
      </div>
    </div>
  );
}

type Box = { left: number; top: number; width: number; height: number };

/** Words set on the blank black label of a rendered bottle. Sizes follow the label's width. */
export function BottleLabel({ box, name, no }: { box: Box; name?: string; no?: number }) {
  const len = name?.length ?? 0;
  const nameSize = len > 18 ? "10.5cqw" : len > 11 ? "12.5cqw" : "15.5cqw";
  return (
    <div
      aria-hidden
      className="scent-label pointer-events-none absolute"
      style={{ left: `${box.left}%`, top: `${box.top}%`, width: `${box.width}%`, height: `${box.height}%` }}
    >
      <div className="flex h-full w-full flex-col items-center justify-center text-center" style={{ padding: "0 12cqw" }}>
        <span className="font-sans uppercase text-[#c9a66b]" style={{ fontSize: "5.6cqw", letterSpacing: "0.26em", lineHeight: 1.2 }}>
          Arabian Musk
        </span>
        <span className="bg-[#c9a66b]/60" style={{ height: "0.7cqw", width: "26%", margin: "6cqw 0" }} />
        {name && (
          <span className="font-display font-semibold text-balance text-[#e3cb9c]" style={{ fontSize: nameSize, lineHeight: 1.08 }}>
            {name}
          </span>
        )}
        {no !== undefined && (
          <span className="font-sans text-[#c9a66b]" style={{ fontSize: "5.4cqw", letterSpacing: "0.18em", marginTop: "7cqw" }}>
            N° {no}
          </span>
        )}
      </div>
    </div>
  );
}
