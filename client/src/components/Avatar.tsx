import clsx from "clsx";
import type { CharacterState } from "@streamsidekick/shared";

const stateClasses: Record<CharacterState, string> = {
  idle: "animate-bob",
  talking: "animate-talkBounce",
  laughing: "animate-laughTilt",
  shocked: "scale-105",
  thinking: "animate-thinkFloat",
  hype: "animate-hypeShake"
};

const auraClasses: Record<CharacterState, string> = {
  idle: "from-cyan-400/40 to-sky-500/20",
  talking: "from-emerald-400/40 to-cyan-500/25",
  laughing: "from-amber-400/40 to-orange-500/25",
  shocked: "from-violet-400/40 to-fuchsia-500/25",
  thinking: "from-blue-400/40 to-indigo-500/25",
  hype: "from-pink-500/45 to-rose-500/30"
};

export const Avatar = ({ state }: { state: CharacterState }) => (
  <div className={clsx("relative mx-auto h-80 w-80 animate-pulseGlow", stateClasses[state])}>
    <div className={clsx("absolute inset-8 rounded-full bg-gradient-to-br blur-2xl", auraClasses[state])} />
    <div className="absolute inset-10 rounded-full border border-white/20 bg-slate-900/80 shadow-neon" />
    <div className="absolute inset-[4.2rem] rounded-full bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950" />
    <div className="absolute inset-x-[5.6rem] top-[6.8rem] flex justify-between">
      <div className={clsx("h-5 w-5 rounded-full bg-cyan-200", state === "shocked" ? "scale-125" : "")} />
      <div className={clsx("h-5 w-5 rounded-full bg-cyan-200", state === "shocked" ? "scale-125" : "")} />
    </div>
    <div className="absolute inset-x-[6.3rem] top-[8.6rem] h-2 rounded-full bg-sky-300/60" />
    <div
      className={clsx(
        "absolute left-1/2 top-[11.2rem] -translate-x-1/2 rounded-full border-2 border-cyan-200/80",
        state === "laughing" && "h-10 w-24 border-t-0 bg-rose-300/20",
        state === "talking" && "h-8 w-20 bg-cyan-200/10",
        state === "thinking" && "h-4 w-14",
        state === "hype" && "h-9 w-24 bg-amber-300/15",
        state === "shocked" && "h-12 w-12",
        state === "idle" && "h-6 w-16 border-t-0"
      )}
    />
    <div className="absolute inset-x-[6rem] bottom-[4.8rem] rounded-full border border-cyan-300/30 bg-cyan-400/10 px-3 py-2 text-center text-xs uppercase tracking-[0.24em] text-cyan-200">
      StreamSidekick
    </div>
  </div>
);
