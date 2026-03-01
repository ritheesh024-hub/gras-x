interface GradientProgressProps {
  value: number;
  className?: string;
  height?: number;
}

export function GradientProgress({
  value,
  className = "",
  height = 6,
}: GradientProgressProps) {
  return (
    <div
      className={`rounded-full overflow-hidden bg-border ${className}`}
      style={{ height }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background:
            "linear-gradient(90deg, oklch(var(--brand-blue)), oklch(var(--brand-purple)))",
        }}
      />
    </div>
  );
}
