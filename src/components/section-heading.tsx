export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  id,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  tone?: "light" | "dark";
  id?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className="max-w-2xl" data-reveal>
      <p className={`text-xs font-medium uppercase tracking-[0.26em] ${dark ? "text-gold-300" : "text-gold-700"}`}>{eyebrow}</p>
      <h2 id={id} className={`mt-3 font-display text-4xl leading-[1.08] sm:text-5xl ${dark ? "text-sand-50" : "text-ink-900"}`}>
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-stone-300" : "text-stone-600"}`}>{intro}</p>}
    </div>
  );
}
