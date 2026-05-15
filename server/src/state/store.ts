import type {
  AiStatus,
  AppState,
  AppSettings,
  BotMode,
  CharacterResponse,
  CharacterState,
  LogEntry,
  PersonalityKey
} from "@streamsidekick/shared";
import { personalities } from "../config/personalities.js";
import { getAiStatusSnapshot } from "../services/aiProvider.js";

const initialSettings: AppSettings = {
  personality: "sage",
  mode: "Normal",
  ttsEnabled: false
};

const initialState: AppState = {
  settings: initialSettings,
  ai: getAiStatusSnapshot(),
  personalities,
  log: [],
  overlay: {
    latestResponse: null,
    subtitles: "",
    state: "idle",
    isTalking: false
  },
  cooldownUntil: null
};

let state: AppState = initialState;

export const getState = () => state;

export const setPersonality = (personality: PersonalityKey) => {
  state = {
    ...state,
    settings: {
      ...state.settings,
      personality
    }
  };
  return state;
};

export const setMode = (mode: BotMode) => {
  state = {
    ...state,
    settings: {
      ...state.settings,
      mode
    }
  };
  return state;
};

export const setTtsEnabled = (ttsEnabled: boolean) => {
  state = {
    ...state,
    settings: {
      ...state.settings,
      ttsEnabled
    }
  };
  return state;
};

export const setAiStatus = (ai: AiStatus) => {
  state = {
    ...state,
    ai
  };
  return state;
};

export const setOverlayResponse = (response: CharacterResponse, stateName: CharacterState) => {
  state = {
    ...state,
    overlay: {
      latestResponse: response,
      subtitles: response.subtitle,
      state: stateName,
      isTalking: stateName === "talking" || stateName === "laughing" || stateName === "hype"
    }
  };
  return state;
};

export const resetOverlayToIdle = () => {
  state = {
    ...state,
    overlay: {
      ...state.overlay,
      state: "idle",
      isTalking: false
    }
  };
  return state;
};

export const setCooldownUntil = (cooldownUntil: string | null) => {
  state = {
    ...state,
    cooldownUntil
  };
  return state;
};

export const addLogEntry = (entry: LogEntry) => {
  state = {
    ...state,
    log: [entry, ...state.log].slice(0, 40)
  };
  return state;
};
