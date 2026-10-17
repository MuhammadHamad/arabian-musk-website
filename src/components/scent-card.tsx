import Link from "next/link";
import { PriceList } from "@/components/price-list";
import { isBestSeller, type Scent } from "@/lib/scent";

export function ScentCard({ scent, headingLevel: H = "h3" }: { scent: Scent; headingLevel?: "h2" | "h3" }) {
  return (
    <article className="flex flex-col rounded-2xl border border-sand-200 bg-white/85 px-4 py-5 lg:px-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] transition hover:border-gold-400/50 hover:shadow-lg hover:shadow-gold-700/5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <H className="font-display text-[1.45rem] leading-tight">
            <Link href={`/scents/${scent.slug}`} className="transition hover:text-gold-700">
              {scent.name}
            </Link>
          </H>
          {scent.inspiredBy && <p className="mt-1 text-sm text-stone-600">Inspired by {scent.inspiredBy}</p>}
        </div>
        {isBestSeller(scent) && (
          <span className="shrink-0 rounded-full border border-gold-500/40 bg-gold-100 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-gold-700">
            Best seller
          </span>
        )}
      </div>
      <PriceList scent={scent} />
    </article>
  );
}
