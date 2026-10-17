import Link from "next/link";
import { QuickAdd } from "@/components/quick-add";
import { ScentImage } from "@/components/scent-image";
import { isBestSeller, priceRange, type Scent } from "@/lib/scent";

const CARD_SIZES = "(min-width: 1280px) 22vw, (min-width: 768px) 31vw, 48vw";

/** Image, label, name, price range and an amber "Select options" button. */
export function ProductCard({
  scent,
  priority,
  headingLevel: H = "h3",
  align = "center",
}: {
  scent: Scent;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
  align?: "center" | "left";
}) {
  const href = `/scents/${scent.slug}`;
  const label = isBestSeller(scent) ? "Best Seller" : scent.inspiredBy ? "Inspired Perfume" : "Attar & Perfume";
  return (
    <article className={`group flex flex-col ${align === "center" ? "items-center text-center" : "items-start text-left"}`}>
      <Link href={href} tabIndex={-1} aria-hidden className="block w-full overflow-hidden">
        <ScentImage scent={scent} sizes={CARD_SIZES} priority={priority} square zoom={1.5} className="transition duration-700 group-hover:scale-[1.04]" />
      </Link>
      <p className="mt-4 text-[14.5px] text-muted">{label}</p>
      <H className="mt-1 font-display text-[1.45rem] font-bold leading-tight sm:text-[1.55rem]">
        <Link href={href} className="transition hover:text-amber">
          {scent.name}
        </Link>
      </H>
      {scent.inspiredBy && <p className="mt-1 text-[13.5px] leading-snug text-muted">Impression of {scent.inspiredBy}</p>}
      <p className="mt-2 text-[15.5px] tabular-nums text-body">{priceRange(scent)}</p>
      <QuickAdd scent={scent} />
    </article>
  );
}
