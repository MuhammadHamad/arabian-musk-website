import Link from "next/link";
import { QuickAdd } from "@/components/quick-add";
import { ScentImage } from "@/components/scent-image";
import { fromPrice, isBestSeller, type Scent } from "@/lib/scent";

const CARD_SIZES = "(min-width: 1280px) 22vw, (min-width: 768px) 31vw, 48vw";

export function ProductCard({ scent, priority, headingLevel: H = "h3" }: { scent: Scent; priority?: boolean; headingLevel?: "h2" | "h3" }) {
  const href = `/scents/${scent.slug}`;
  return (
    <article className="group">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden className="block">
          <ScentImage scent={scent} sizes={CARD_SIZES} priority={priority} zoom={1.32} />
          <ScentImage
            scent={scent}
            variant="attar"
            sizes={CARD_SIZES}
            zoom={1.25}
            className="!absolute inset-0 opacity-0 transition-opacity duration-700 ease-[var(--ease-lux)] group-hover:opacity-100"
          />
        </Link>
        {isBestSeller(scent) && (
          <span className="caps pointer-events-none absolute left-3 top-3 bg-paper/90 px-2 py-1 !text-[10px] text-ink">Best seller</span>
        )}
        <QuickAdd scent={scent} />
      </div>
      <Link href={href} className="mt-4 block text-center">
        <span className="caps block !text-[10.5px] text-muted">N° {scent.no}</span>
        <H className="mt-1.5 font-display text-[1.3rem] leading-tight sm:text-[1.4rem]">{scent.name}</H>
        <span className="mt-1 block px-2 text-[13px] leading-snug text-muted">
          {scent.inspiredBy ? `Inspired by ${scent.inspiredBy}` : "Attar & perfume"}
        </span>
        <span className="mt-2 block text-[14px] tabular-nums">{fromPrice(scent)}</span>
      </Link>
    </article>
  );
}
