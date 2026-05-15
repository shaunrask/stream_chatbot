import type {
  BotMode,
  CharacterResponse,
  CharacterState,
  DashboardAction,
  EventType,
  PersonalityKey
} from "@streamsidekick/shared";
import { createId } from "../utils/ids.js";

export const personalityVoice: Record<PersonalityKey, string> = {
  sage: "Calm, insightful, and lightly witty.",
  gremlin: "Mischievous, roasty, and quick with a punchline.",
  coach: "Supportive, energetic, and momentum-driven.",
  scientist: "Observant, technical, and eager to explain.",
  chaosDj: "Big energy, dramatic, and clip-ready."
};

export const modeVoice: Record<BotMode, string> = {
  Focus: "Keep it concise and sharp.",
  Normal: "Keep it balanced and conversational.",
  Chaos: "Turn the energy up and make it loud."
};

const stateByAction: Partial<Record<DashboardAction, CharacterState>> = {
  ROAST_ME: "laughing",
  HYPE_ME_UP: "hype",
  EXPLAIN_THIS: "thinking",
  TEST_TALKING: "talking"
};

const stateByEvent: Record<EventType, CharacterState> = {
  HOTKEY: "talking",
  PLAYER_SPEECH: "shocked",
  SCREEN_SNAPSHOT: "thinking",
  OBS_SCENE_CHANGE: "hype"
};

export const getCharacterState = (eventType: EventType, action?: DashboardAction): CharacterState =>
  (action ? stateByAction[action] : undefined) ?? stateByEvent[eventType];

export const buildEventSummary = ({
  eventType,
  action,
  playerSpeech,
  sceneName,
  snapshotHint
}: {
  eventType: EventType;
  action?: DashboardAction;
  playerSpeech?: string;
  sceneName?: string;
  snapshotHint?: string;
}) =>
  [
    `Event type: ${eventType}.`,
    action ? `Dashboard action: ${action}.` : null,
    playerSpeech ? `Player speech: ${playerSpeech}.` : null,
    sceneName ? `OBS scene: ${sceneName}.` : null,
    snapshotHint ? `Snapshot hint: ${snapshotHint}.` : null
  ]
    .filter(Boolean)
    .join(" ");

export const createCharacterResponse = ({
  text,
  personality,
  mode,
  sourceEvent,
  action,
  provider,
  model
}: {
  text: string;
  personality: PersonalityKey;
  mode: BotMode;
  sourceEvent: EventType;
  action?: DashboardAction;
  provider: "mock" | "openai";
  model: string | null;
}): CharacterResponse => {
  const normalizedText = text.replace(/\s+/g, " ").trim();

  return {
    id: createId(),
    text: normalizedText,
    subtitle: normalizedText,
    state: getCharacterState(sourceEvent, action),
    personality,
    mode,
    sourceEvent,
    provider,
    model,
    timestamp: new Date().toISOString()
  };
};
