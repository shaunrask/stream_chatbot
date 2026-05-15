import {
  BOT_MODES,
  DASHBOARD_ACTIONS,
  type BotMode,
  type DashboardAction,
  type PersonalityKey
} from "@streamsidekick/shared";
import { useState } from "react";
import { Panel } from "../components/Panel";
import { SelectorCard } from "../components/SelectorCard";
import { useAppState } from "../hooks/useAppState";
import { api } from "../lib/api";

const actionLabels: Record<DashboardAction, string> = {
  ROAST_ME: "Roast Me",
  HYPE_ME_UP: "Hype Me Up",
  EXPLAIN_THIS: "Explain This",
  TEST_TALKING: "Test Talking"
};

const modeDescriptions: Record<BotMode, string> = {
  Focus: "Longer cooldowns and tighter commentary.",
  Normal: "Balanced cadence for regular co-hosting.",
  Chaos: "Short cooldowns and maximum bit density."
};

export const DashboardPage = () => {
  const { state, isLoading } = useAppState();
  const [isBusy, setIsBusy] = useState(false);

  const runTask = async (task: () => Promise<unknown>) => {
    setIsBusy(true);
    try {
      await task();
    } finally {
      setIsBusy(false);
    }
  };

  if (isLoading || !state) {
    return <div className="flex min-h-screen items-center justify-center text-slate-200">Loading StreamSidekick...</div>;
  }

  const currentPersonality = state.personalities.find(
    (personality) => personality.key === state.settings.personality
  );

  return (
    <main className="dashboard-shell min-h-screen px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <header className="rounded-[2rem] border border-cyan-400/20 bg-slate-950/60 p-6 shadow-2xl backdrop-blur">
            <div className="mb-3 text-xs uppercase tracking-[0.36em] text-cyan-300/80">StreamSidekick</div>
            <h1 className="m-0 text-4xl font-black tracking-tight text-white">Local Twitch AI Co-Host Dashboard</h1>
            <p className="mb-0 mt-3 max-w-3xl text-base leading-7 text-slate-300">
              The dashboard to overlay loop is live, and the backend can now use either mock responses or a real OpenAI provider with automatic fallback.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
              <a className="rounded-full border border-white/10 px-4 py-2 hover:bg-white/5" href="/overlay" target="_blank" rel="noreferrer">
                Open Overlay
              </a>
              <div className="rounded-full border border-white/10 px-4 py-2">
                Active personality: {currentPersonality?.label}
              </div>
            </div>
          </header>

          <Panel title="Personality Selector" eyebrow="Voice">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {state.personalities.map((personality) => (
                <SelectorCard
                  key={personality.key}
                  isActive={state.settings.personality === personality.key}
                  title={personality.label}
                  description={personality.description}
                  accent={personality.accentColor}
                  onClick={() => runTask(() => api.setPersonality(personality.key as PersonalityKey))}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Bot Mode Selector" eyebrow="Cadence">
            <div className="grid gap-3 md:grid-cols-3">
              {BOT_MODES.map((mode) => (
                <SelectorCard
                  key={mode}
                  isActive={state.settings.mode === mode}
                  title={mode}
                  description={modeDescriptions[mode]}
                  accent={mode === "Focus" ? "#38bdf8" : mode === "Normal" ? "#4ade80" : "#fb7185"}
                  onClick={() => runTask(() => api.setMode(mode))}
                />
              ))}
            </div>
          </Panel>

          <Panel title="Trigger Actions" eyebrow="MVP Control">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {DASHBOARD_ACTIONS.map((action) => (
                <button
                  key={action}
                  type="button"
                  disabled={isBusy}
                  onClick={() =>
                    runTask(() =>
                      api.sendEvent({
                        type: "HOTKEY",
                        payload: {
                          action,
                          source: "dashboard"
                        }
                      })
                    )
                  }
                  className="rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 px-5 py-5 text-left transition hover:border-cyan-200/30 hover:bg-white/10 disabled:opacity-60"
                >
                  <div className="text-xs uppercase tracking-[0.3em] text-cyan-200/75">Trigger</div>
                  <div className="mt-2 text-xl font-semibold text-white">{actionLabels[action]}</div>
                </button>
              ))}
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Voice Output" eyebrow="Audio">
            <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
              <div>
                <div className="text-lg font-semibold text-white">TTS Enabled</div>
                <div className="text-sm text-slate-300">Stored now, ready to hook into real synthesis next.</div>
              </div>
              <button
                type="button"
                aria-pressed={state.settings.ttsEnabled}
                onClick={() => runTask(() => api.setTtsEnabled(!state.settings.ttsEnabled))}
                className={`relative h-10 w-20 rounded-full transition ${
                  state.settings.ttsEnabled ? "bg-emerald-400/80" : "bg-slate-700"
                }`}
              >
                <span
                  className={`absolute top-1 h-8 w-8 rounded-full bg-white transition ${
                    state.settings.ttsEnabled ? "left-11" : "left-1"
                  }`}
                />
              </button>
            </label>
          </Panel>

          <Panel title="AI Provider" eyebrow="Backend">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Configured provider: <span className="font-semibold text-white">{state.ai.configuredProvider}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Active provider: <span className="font-semibold text-white">{state.ai.activeProvider}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Model: <span className="font-semibold text-white">{state.ai.model ?? "mock-only"}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Status:{" "}
                <span className="font-semibold text-white">
                  {state.ai.usingFallback ? "Fallback active" : state.ai.ready ? "Ready" : "Needs config"}
                </span>
              </div>
              {state.ai.lastError ? (
                <div className="rounded-2xl border border-amber-300/20 bg-amber-400/10 px-4 py-3 text-amber-100">
                  {state.ai.lastError}
                </div>
              ) : null}
            </div>
          </Panel>

          <Panel title="Live Log" eyebrow="Responses">
            <div className="space-y-3">
              {state.log.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-400">
                  No responses yet. Trigger one of the dashboard buttons to test the full path.
                </div>
              ) : (
                state.log.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                      <span>
                        {entry.eventType}
                        {entry.action ? ` | ${actionLabels[entry.action]}` : ""}
                      </span>
                      <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className={entry.accepted ? "text-slate-100" : "text-amber-200"}>{entry.message}</div>
                    {entry.response ? (
                      <div className="mt-2 text-xs uppercase tracking-[0.24em] text-cyan-300/80">
                        {entry.response.provider}
                        {entry.response.model ? ` | ${entry.response.model}` : ""}
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>
          </Panel>

          <Panel title="System Snapshot" eyebrow="State">
            <div className="space-y-3 text-sm text-slate-300">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Personality key: <span className="font-semibold text-white">{state.settings.personality}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Mode: <span className="font-semibold text-white">{state.settings.mode}</span>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                Cooldown until:{" "}
                <span className="font-semibold text-white">
                  {state.cooldownUntil ? new Date(state.cooldownUntil).toLocaleTimeString() : "Ready"}
                </span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </main>
  );
};
