/**
 * A rose sprig in fine line, used large and faint behind sections, as a watermark.
 * Decorative only.
 */
export function FloralSprig({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 340" className={className} aria-hidden focusable={false} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round">
      {/* bloom */}
      <path d="M108 78c5-4 12 0 9 7-3 6-14 6-16-1-3-9 7-16 16-14 13 3 16 18 9 27-8 10-27 9-33-3" />
      <path d="M93 92c-3-12 3-24 15-27 9-2 18 2 23 9" />
      <path d="M131 74c9 7 12 20 7 30-5 11-18 16-30 15" />
      <path d="M86 98c0 14 10 26 25 28 13 2 26-4 32-16" />
      <path d="M78 84c-10 9-12 25-5 37 8 13 25 19 41 15" />
      <path d="M143 66c14 9 19 28 12 42-5 10-14 17-24 20" />
      <path d="M80 80c-4-14 2-28 14-35 9-5 21-5 30 0" />
      <path d="M124 45c13 1 25 9 30 21" />
      <path d="M72 96c-9-2-15-9-15-17 6 2 11 6 15 12" />
      <path d="M157 92c8-2 13-9 13-17-6 2-11 6-14 12" />
      {/* sepals */}
      <path d="M100 136c-6 3-14 3-20-1 6-3 13-4 20 1Z" />
      <path d="M112 136c6 4 14 4 20 0-6-4-13-4-20 0Z" />
      {/* stem */}
      <path d="M106 137c-2 30 3 58-1 88-3 28-1 56-6 104" />
      {/* leaves */}
      <path d="M104 180c16-19 44-24 62-14-13 17-42 24-62 14Z" />
      <path d="M104 180c20-5 38-9 62-14" />
      <path d="M118 176l6-9M132 173l7-9M146 170l7-8" />
      <path d="M102 236c-18-17-47-18-63-6 15 14 44 17 63 6Z" />
      <path d="M102 236c-20-4-40-6-63-6" />
      <path d="M88 233l-7-8M73 231l-7-7M58 230l-6-6" />
      {/* bud on a side branch */}
      <path d="M103 262c14 2 27 10 36 22" />
      <path d="M139 284c-6-9-3-21 6-24 6 6 4 18-6 24Z" />
      <path d="M139 284c4 1 9 0 12-3" />
      <path d="M104 290c-12 4-22 12-27 23" />
      <path d="M77 313c-8-4-11-13-6-19 7 2 9 12 6 19Z" />
    </svg>
  );
}
