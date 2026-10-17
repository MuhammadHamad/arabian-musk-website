import { StarMark } from "@/components/icons";

export function Wordmark({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <StarMark size={compact ? 18 : 22} className="shrink-0 text-gold-400" />
      <span className="font-display text-[14px] font-semibold uppercase tracking-[0.2em] min-[360px]:text-[15px] min-[360px]:tracking-[0.3em] sm:text-base">Arabian Musk</span>
    </span>
  );
}
