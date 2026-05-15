export const BOT_MODES = ["Focus", "Normal", "Chaos"] as const;
export const CHARACTER_STATES = [
  "idle",
  "talking",
  "laughing",
  "shocked",
  "thinking",
  "hype"
] as const;
export const PERSONALITY_KEYS = [
  "sage",
  "gremlin",
  "coach",
  "scientist",
  "chaosDj"
] as const;
export const EVENT_TYPES = [
  "HOTKEY",
  "PLAYER_SPEECH",
  "SCREEN_SNAPSHOT",
  "OBS_SCENE_CHANGE"
] as const;
export const DASHBOARD_ACTIONS = [
  "ROAST_ME",
  "HYPE_ME_UP",
  "EXPLAIN_THIS",
  "TEST_TALKING"
] as const;
export const AI_PROVIDERS = ["mock", "openai"] as const;

export type BotMode = (typeof BOT_MODES)[number];
export type CharacterState = (typeof CHARACTER_STATES)[number];
export type PersonalityKey = (typeof PERSONALITY_KEYS)[number];
export type EventType = (typeof EVENT_TYPES)[number];
export type DashboardAction = (typeof DASHBOARD_ACTIONS)[number];
export type AiProvider = (typeof AI_PROVIDERS)[number];

export interface PersonalityDefinition {
  key: PersonalityKey;
  label: string;
  description: string;
  accentColor: string;
}

export interface AppSettings {
  personality: PersonalityKey;
  mode: BotMode;
  ttsEnabled: boolean;
}

export interface AiStatus {
  configuredProvider: AiProvider;
  activeProvider: AiProvider;
  ready: boolean;
  usingFallback: boolean;
  model: string | null;
  lastError: string | null;
}

export interface CharacterResponse {
  id: string;
  text: string;
  subtitle: string;
  state: CharacterState;
  personality: PersonalityKey;
  mode: BotMode;
  sourceEvent: EventType;
  provider: AiProvider;
  model: string | null;
  timestamp: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  eventType: EventType;
  action?: DashboardAction;
  accepted: boolean;
  message: string;
  response?: CharacterResponse;
}

export interface OverlayState {
  latestResponse: CharacterResponse | null;
  subtitles: string;
  state: CharacterState;
  isTalking: boolean;
}

export interface AppState {
  settings: AppSettings;
  ai: AiStatus;
  personalities: PersonalityDefinition[];
  log: LogEntry[];
  overlay: OverlayState;
  cooldownUntil: string | null;
}

export interface StreamSidekickEvent {
  type: EventType;
  payload?: {
    action?: DashboardAction;
    text?: string;
    sceneName?: string;
    snapshotHint?: string;
    source?: string;
  };
}

export interface EventResult {
  accepted: boolean;
  reason?: string;
  response?: CharacterResponse;
  state: AppState;
}
