import type { AppState, BotMode, PersonalityKey, StreamSidekickEvent } from "@streamsidekick/shared";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";

const request = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const api = {
  getState: () => request<AppState>("/api/state"),
  sendEvent: (event: StreamSidekickEvent) =>
    request("/api/event", {
      method: "POST",
      body: JSON.stringify(event)
    }),
  setPersonality: (personality: PersonalityKey) =>
    request<AppState>("/api/settings/personality", {
      method: "POST",
      body: JSON.stringify({ personality })
    }),
  setMode: (mode: BotMode) =>
    request<AppState>("/api/settings/mode", {
      method: "POST",
      body: JSON.stringify({ mode })
    }),
  setTtsEnabled: (ttsEnabled: boolean) =>
    request<AppState>("/api/settings/tts", {
      method: "POST",
      body: JSON.stringify({ ttsEnabled })
    })
};
