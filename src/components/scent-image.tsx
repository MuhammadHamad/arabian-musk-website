import Image from "next/image";
import attarRender from "@/assets/renders/attar.jpg";
import perfumeRender from "@/assets/renders/perfume.jpg";
import { PERFUME_LABEL } from "@/lib/renders";
import type { Scent } from "@/lib/scent";

type Props = {
  scent: Scent;
  variant?: "perfume" | "attar";
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Crop in on the bottle (1 = the full render). */
  zoom?: number;
};

/** The shop's perfume bottle or attar flacon, with the scent's name on the perfume label. */
export function ScentImage({ scent, variant = "perfume", sizes, priority, className = "", zoom = 1 }: Props) {
  const perfume = variant === "perfume";
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-plaster ${className}`}>
      <div className="absolute inset-0" style={zoom === 1 ? undefined : { transform: `scale(${zoom})`, transformOrigin: "50% 50%" }}>
      <Image
        src={perfume ? perfumeRender : attarRender}
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
      <div
        className="flex h-full w-full flex-col items-center justify-center text-center"
        style={{ padding: "0 12cqw" }}
      >
        <span className="font-sans uppercase text-gold/90" style={{ fontSize: "5.6cqw", letterSpacing: "0.26em", lineHeight: 1.2 }}>
          Arabian Musk
        </span>
        <span className="bg-gold/55" style={{ height: "0.7cqw", width: "26%", margin: "6cqw 0" }} />
        {name && (
          <span className="font-display text-balance text-gold-light" style={{ fontSize: nameSize, lineHeight: 1.08 }}>
            {name}
          </span>
        )}
        {no !== undefined && (
          <span className="font-sans text-gold/80" style={{ fontSize: "5.4cqw", letterSpacing: "0.18em", marginTop: "7cqw" }}>
            N° {no}
          </span>
        )}
      </div>
    </div>
  );
}
