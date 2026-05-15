import OpenAI from "openai";
import type { BotMode, DashboardAction, EventType, PersonalityKey } from "@streamsidekick/shared";
import { aiConfig } from "../config/ai.js";
import { buildEventSummary, createCharacterResponse, modeVoice, personalityVoice } from "./responseMetadata.js";

const client = aiConfig.openAiApiKey
  ? new OpenAI({
      apiKey: aiConfig.openAiApiKey
    })
  : null;

const actionIntent: Partial<Record<DashboardAction, string>> = {
  ROAST_ME: "Give a playful roast that stays streamer-friendly.",
  HYPE_ME_UP: "Deliver a hype line that boosts confidence and momentum.",
  EXPLAIN_THIS: "Give a quick, clear explanation of what likely just happened.",
  TEST_TALKING: "Say something short that proves the co-host is live and ready."
};

export const isOpenAiConfigured = () => Boolean(client);

export const generateOpenAiResponse = async ({
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
}) => {
  if (!client) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await client.responses.create({
    model: aiConfig.openAiModel,
    instructions: [
      "You are StreamSidekick, a Twitch AI co-host speaking live on stream.",
      personalityVoice[personality],
      modeVoice[mode],
      action ? actionIntent[action] ?? "React naturally." : "React naturally to the event.",
      "Reply with only the final streamer-facing line.",
      "Use 1 to 3 short sentences.",
      "Avoid markdown, stage directions, and unnecessary quotes.",
      "Keep it safe for a live audience."
    ].join(" "),
    input: buildEventSummary({
      eventType,
      action,
      playerSpeech,
      sceneName,
      snapshotHint
    }),
    max_output_tokens: mode === "Focus" ? 80 : mode === "Chaos" ? 140 : 110
  });

  const text = response.output_text?.trim();

  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }

  return createCharacterResponse({
    text,
    personality,
    mode,
    sourceEvent: eventType,
    action,
    provider: "openai",
    model: aiConfig.openAiModel
  });
};
