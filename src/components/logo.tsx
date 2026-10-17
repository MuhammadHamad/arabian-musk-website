import { site } from "@/content/site";

/** Wordmark: the name in bold Cormorant, the Arabic name and a small amber line beneath. */
export function Logo({ light = false, className = "" }: { light?: boolean; className?: string }) {
  return (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span className="flex items-baseline gap-2">
        <span className={`font-display text-[1.5rem] font-bold tracking-wide min-[360px]:text-[1.75rem] sm:text-[2rem] ${light ? "text-white" : "text-ink"}`}>
          Arabian Musk
        </span>
        <span lang="ar" dir="rtl" className={`hidden font-arabic text-xl sm:inline ${light ? "text-white/80" : "text-amber"}`}>
          {site.arabic}
        </span>
      </span>
      <span className={`mt-1.5 font-nav text-[8.5px] font-semibold uppercase tracking-[0.2em] min-[360px]:text-[9.5px] min-[360px]:tracking-[0.32em] ${light ? "text-white/80" : "text-amber"}`}>
        Attar &amp; Perfume · Peshawar
      </span>
    </span>
  );
}
