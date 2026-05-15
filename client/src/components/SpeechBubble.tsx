import type { CharacterResponse } from "@streamsidekick/shared";

export const SpeechBubble = ({ response }: { response: CharacterResponse | null }) => (
  <div className="relative max-w-2xl rounded-[2rem] border border-white/15 bg-slate-950/78 px-6 py-5 text-white shadow-2xl backdrop-blur-md">
    <div className="mb-2 text-[11px] uppercase tracking-[0.32em] text-cyan-300/80">
      Latest Response
    </div>
    <p className="m-0 text-lg leading-8 text-slate-50">
      {response?.text ?? "Waiting for the next cue from dashboard..."}
    </p>
    <div className="absolute -bottom-4 left-10 h-8 w-8 rotate-45 rounded-sm border-b border-r border-white/15 bg-slate-950/78" />
  </div>
);
