import type { Faq } from "@/content/faqs";
import { PlusIcon } from "@/components/icons";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-sand-300 border-y border-sand-300">
      {faqs.map((f) => (
        <details key={f.q} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl leading-snug [&::-webkit-details-marker]:hidden">
            {f.q}
            <span className="grid size-8 shrink-0 place-items-center rounded-full border border-gold-600/40 text-gold-700 transition group-open:rotate-45">
              <PlusIcon size={16} />
            </span>
          </summary>
          <p className="max-w-3xl pb-5 text-[16px] leading-relaxed text-stone-700">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
