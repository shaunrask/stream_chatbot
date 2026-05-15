import type { AiStatus, BotMode, CharacterResponse, DashboardAction, EventType, PersonalityKey } from "@streamsidekick/shared";
import { aiConfig } from "../config/ai.js";
import { generateMockResponse } from "./mockAi.js";
import { generateOpenAiResponse, isOpenAiConfigured } from "./openAiProvider.js";

const missingKeyMessage =
  "OpenAI is selected, but OPENAI_API_KEY is missing. StreamSidekick is using mock mode instead.";

let lastError: string | null =
  aiConfig.configuredProvider === "openai" && !isOpenAiConfigured() ? missingKeyMessage : null;
let lastActiveProvider: "mock" | "openai" =
  aiConfig.configuredProvider === "openai" && isOpenAiConfigured() ? "openai" : "mock";

const buildAiStatus = (): AiStatus => ({
  configuredProvider: aiConfig.configuredProvider,
  activeProvider: lastActiveProvider,
  ready: aiConfig.configuredProvider === "mock" || isOpenAiConfigured(),
  usingFallback: aiConfig.configuredProvider !== lastActiveProvider,
  model: aiConfig.configuredProvider === "openai" ? aiConfig.openAiModel : null,
  lastError
});

export const getAiStatusSnapshot = () => buildAiStatus();

export const generateCharacterResponse = async ({
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
}): Promise<{ response: CharacterResponse; aiStatus: AiStatus }> => {
  if (aiConfig.configuredProvider === "openai") {
    if (!isOpenAiConfigured()) {
      lastActiveProvider = "mock";
      lastError = missingKeyMessage;

      return {
        response: generateMockResponse({
          eventType,
          action,
          personality,
          mode,
          playerSpeech,
          sceneName,
          snapshotHint
        }),
        aiStatus: buildAiStatus()
      };
    }

    try {
      const response = await generateOpenAiResponse({
        eventType,
        action,
        personality,
        mode,
        playerSpeech,
        sceneName,
        snapshotHint
      });

      lastActiveProvider = "openai";
      lastError = null;

      return {
        response,
        aiStatus: buildAiStatus()
      };
    } catch (error) {
      lastActiveProvider = "mock";
      lastError =
        error instanceof Error
          ? `OpenAI request failed, so StreamSidekick fell back to mock mode. ${error.message}`
          : "OpenAI request failed, so StreamSidekick fell back to mock mode.";

      return {
        response: generateMockResponse({
          eventType,
          action,
          personality,
          mode,
          playerSpeech,
          sceneName,
          snapshotHint
        }),
        aiStatus: buildAiStatus()
      };
    }
  }

  lastActiveProvider = "mock";
  lastError = null;

  return {
    response: generateMockResponse({
      eventType,
      action,
      personality,
      mode,
      playerSpeech,
      sceneName,
      snapshotHint
    }),
    aiStatus: buildAiStatus()
  };
};
