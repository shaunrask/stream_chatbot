import type {
  BotMode,
  CharacterResponse,
  DashboardAction,
  EventType,
  PersonalityKey
} from "@streamsidekick/shared";
import { createCharacterResponse, modeVoice, personalityVoice } from "./responseMetadata.js";

const linesByAction: Record<DashboardAction, string[]> = {
  ROAST_ME: [
    "You pushed that button like it owed you channel points.",
    "That play had the confidence of a speedrun and the accuracy of a coin flip.",
    "I respect the ambition, but the execution filed a formal complaint."
  ],
  HYPE_ME_UP: [
    "Lock in. The clip people are about to eat.",
    "This is the run where chat goes from watching to witnessing.",
    "Momentum is here. Grab it before the gremlins do."
  ],
  EXPLAIN_THIS: [
    "Quick breakdown: the game rewarded timing, punished hesitation, and you threaded the needle anyway.",
    "Here is the clean version: inputs, reaction, payoff. That is the whole combo.",
    "What happened there was risk conversion. You took chaos and turned it into value."
  ],
  TEST_TALKING: [
    "Overlay check complete. I am live, loud, and emotionally available for the bit.",
    "Mic test energy detected. StreamSidekick is standing by.",
    "Signal path looks good. I can yap on command."
  ]
};

const eventFallbacks: Record<EventType, string[]> = {
  HOTKEY: [
    "Hotkey event received. The bit launcher is functioning.",
    "Manual trigger registered. Co-host instincts are online."
  ],
  PLAYER_SPEECH: [
    "I heard that. Chat is absolutely clipping your tone right now.",
    "Player speech landed. Emotional subtext: high stakes and mild chaos."
  ],
  SCREEN_SNAPSHOT: [
    "Snapshot logged. I do not have vision yet, but I am pretending confidently.",
    "Screenshot event received. Future me will call that frame by frame."
  ],
  OBS_SCENE_CHANGE: [
    "Scene switch detected. Production value just entered the room.",
    "New scene, new energy. Keep the momentum moving."
  ]
};

const pick = <T>(items: T[]) => items[Math.floor(Math.random() * items.length)];

export const generateMockResponse = ({
  eventType,
  action,
  personality,
  mode,
  playerSpeech,
  sceneName,
  snapshotHint
}: {
  eventType: EventType;
  action?: DashboardAction;
  personality: PersonalityKey;
  mode: BotMode;
  playerSpeech?: string;
  sceneName?: string;
  snapshotHint?: string;
}): CharacterResponse => {
  const lead =
    action && linesByAction[action]?.length
      ? pick(linesByAction[action])
      : pick(eventFallbacks[eventType]);

  const contextBits = [personalityVoice[personality], modeVoice[mode]];

  if (playerSpeech) {
    contextBits.push(`You said: "${playerSpeech}".`);
  }

  if (sceneName) {
    contextBits.push(`Scene cue: ${sceneName}.`);
  }

  if (snapshotHint) {
    contextBits.push(`Snapshot hint: ${snapshotHint}.`);
  }

  return createCharacterResponse({
    text: `${lead} ${contextBits.join(" ")}`,
    personality,
    mode,
    sourceEvent: eventType,
    action,
    provider: "mock",
    model: null
  });
};
