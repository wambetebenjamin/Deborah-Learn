import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  showValue = true,
}: {
  value: number;
  count?: number;
  showValue?: boolean;
}) {
  const rounded = Math.round(value);
  return (
    <span className="inline-flex items-center gap-2" aria-label={`Rated ${value} out of 5`}>
      <span className="rating-dots" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn("rating-dot", index < rounded && "is-filled")}
          />
        ))}
      </span>
      {showValue && (
        <span className="text-[0.8rem] font-semibold text-[#3f4854]">
          {value.toFixed(1)}
          {typeof count === "number" && (
            <span className="font-normal text-[#8a94a0]"> ({count})</span>
          )}
        </span>
      )}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  action,
}: {
  eyebrow?: string;
  title: string;
  lede?: string;
  align?: "left" | "center";
  action?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center md:text-center",
      )}
    >
      <div className={cn(align === "center" && "max-w-2xl")}>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="section-title">{title}</h2>
        {lede && <p className={cn("section-lede", align === "center" && "mx-auto")}>{lede}</p>}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({
  value,
  label,
  className,
}: {
  value: number;
  label?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-[#4b5563]">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Course progress"}
      >
        <div className="progress-fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  );
}
