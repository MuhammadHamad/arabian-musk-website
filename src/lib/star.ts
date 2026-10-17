/**
 * The eight-pointed star (two overlapping squares) used as the brand mark and pattern.
 * Returns an SVG path centred on (cx, cy) with outer radius r.
 */
export function starPath(cx: number, cy: number, r: number): string {
  const inner = r * (Math.SQRT1_2 / Math.cos(Math.PI / 8));
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const radius = i % 2 === 0 ? r : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / 8;
    pts.push(`${(cx + radius * Math.cos(angle)).toFixed(2)} ${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return `M${pts.join("L")}Z`;
}
