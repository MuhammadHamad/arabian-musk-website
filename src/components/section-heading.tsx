export function Eyebrow({ children, className = "", tone = "light" }: { children: React.ReactNode; className?: string; tone?: "light" | "dark" }) {
  return <p className={`caps ${tone === "dark" ? "text-gold" : "text-brass-deep"} ${className}`}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  id,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  id?: string;
}) {
  const dark = tone === "dark";
  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : ""}`} data-reveal>
      <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
      <h2 id={id} className={`mt-4 font-display text-[2.4rem] font-normal leading-[1.08] sm:text-5xl ${dark ? "text-paper" : "text-ink"}`}>
        {title}
      </h2>
      {intro && <p className={`mt-5 text-[17px] leading-relaxed ${dark ? "text-paper/65" : "text-muted"}`}>{intro}</p>}
    </div>
  );
}
