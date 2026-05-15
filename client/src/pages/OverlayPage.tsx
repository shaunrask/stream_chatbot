import { useAppState } from "../hooks/useAppState";
import { Avatar } from "../components/Avatar";
import { SpeechBubble } from "../components/SpeechBubble";
import { Subtitles } from "../components/Subtitles";

export const OverlayPage = () => {
  const { state, latestResponse, isLoading } = useAppState();

  if (isLoading || !state) {
    return <div className="min-h-screen bg-transparent" />;
  }

  return (
    <main className="min-h-screen bg-transparent">
      <div className="flex min-h-screen flex-col justify-between px-6 py-8">
        <div className="flex justify-end">
          <div className="rounded-full border border-white/10 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200/80 backdrop-blur-sm">
            OBS Overlay • Transparent Background
          </div>
        </div>

        <div className="grid items-end gap-8 lg:grid-cols-[380px_1fr]">
          <div className="justify-self-center">
            <Avatar state={state.overlay.state} />
          </div>
          <div className="pb-12">
            <SpeechBubble response={latestResponse} />
          </div>
        </div>

        <Subtitles text={state.overlay.subtitles} />
      </div>
    </main>
  );
};
