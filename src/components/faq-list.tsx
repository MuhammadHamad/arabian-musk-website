import type { Faq } from "@/content/faqs";
import { PlusIcon } from "@/components/icons";

export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-display text-[1.3rem] leading-snug [&::-webkit-details-marker]:hidden">
            {f.q}
            <PlusIcon size={16} className="shrink-0 text-brass transition duration-500 group-open:rotate-45" />
          </summary>
          <p className="max-w-2xl pb-6 text-[16px] leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
