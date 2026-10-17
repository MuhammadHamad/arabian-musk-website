/** Rows with a chevron that open to a short answer (details/summary, no script). */
export function Accordion({ items, tone = "light" }: { items: { title: string; body: string }[]; tone?: "light" | "dark" }) {
  return (
    <div className={`divide-y ${tone === "dark" ? "divide-white/25" : "divide-line"}`}>
      {items.map((it, k) => (
        <details key={it.title} className="group" open={k === 0 && items.length < 5}>
          <summary className="flex cursor-pointer list-none items-center gap-5 py-5 [&::-webkit-details-marker]:hidden">
            <svg width="14" height="22" viewBox="0 0 14 22" aria-hidden className="shrink-0 transition duration-300 group-open:rotate-90">
              <path d="M2 2l9 9-9 9" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <span className={`font-display text-[1.45rem] font-bold leading-snug ${tone === "dark" ? "text-white" : "text-ink"}`}>{it.title}</span>
          </summary>
          <p className={`pb-6 pl-[2.1rem] text-[16px] leading-relaxed ${tone === "dark" ? "text-white/85" : "text-body"}`}>{it.body}</p>
        </details>
      ))}
    </div>
  );
}
