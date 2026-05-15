import clsx from "clsx";
import type { ReactNode } from "react";

export const SelectorCard = ({
  isActive,
  title,
  description,
  accent,
  onClick,
  suffix
}: {
  isActive: boolean;
  title: string;
  description: string;
  accent: string;
  onClick: () => void;
  suffix?: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      "w-full rounded-2xl border px-4 py-4 text-left transition",
      isActive
        ? "border-white/30 bg-white/10 shadow-lg shadow-cyan-950/30"
        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
    )}
  >
    <div className="mb-3 flex items-start justify-between gap-3">
      <div
        className="h-3 w-10 rounded-full"
        style={{
          backgroundColor: accent
        }}
      />
      {suffix}
    </div>
    <div className="text-base font-semibold text-white">{title}</div>
    <div className="mt-1 text-sm leading-6 text-slate-300">{description}</div>
  </button>
);
