"use client";

interface Props {
  percent: number;
  color?: string;
}

export default function ProgressBar({ percent, color = "var(--primary)" }: Props) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ height: 4, backgroundColor: "rgba(0,0,0,0.08)" }}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
    >
      <div
        className="h-full rounded-full transition-all duration-300 ease-out"
        style={{ width: `${clamped}%`, backgroundColor: color }}
      />
    </div>
  );
}
