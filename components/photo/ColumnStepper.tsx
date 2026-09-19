"use client";

const MIN = 1;
const MAX = 5;

export function ColumnStepper({
  columns,
  onChange,
}: {
  columns: number;
  onChange: (next: number) => void;
}) {
  return (
    <div
      className="inline-flex items-center gap-3 rounded-sm bg-panel px-3 py-1.5 text-sm text-ink"
      role="group"
      aria-label="Gallery columns"
    >
      <button
        type="button"
        className="bevel-btn flex h-7 w-7 items-center justify-center rounded-sm text-base leading-none disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onChange(Math.max(MIN, columns - 1))}
        disabled={columns <= MIN}
        aria-label="Fewer columns"
      >
        &minus;
      </button>
      <span className="min-w-[6.5rem] text-center tabular-nums">{columns} Columns</span>
      <button
        type="button"
        className="bevel-btn flex h-7 w-7 items-center justify-center rounded-sm text-base leading-none disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onChange(Math.min(MAX, columns + 1))}
        disabled={columns >= MAX}
        aria-label="More columns"
      >
        +
      </button>
    </div>
  );
}
