import type { PropsWithChildren, ReactNode } from "react";

export const Panel = ({
  title,
  eyebrow,
  children
}: PropsWithChildren<{ title: string; eyebrow?: ReactNode }>) => (
  <section className="rounded-3xl border border-white/10 bg-slate-950/55 p-5 shadow-2xl shadow-cyan-950/20 backdrop-blur">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <div className="mb-1 text-xs uppercase tracking-[0.28em] text-cyan-300/80">{eyebrow}</div> : null}
        <h2 className="m-0 text-xl font-semibold text-white">{title}</h2>
      </div>
    </div>
    {children}
  </section>
);
