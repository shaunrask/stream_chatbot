import { AI_PROVIDERS, type AiProvider } from "@streamsidekick/shared";

const providerFromEnv = process.env.STREAMSIDEKICK_AI_PROVIDER;

const configuredProvider: AiProvider =
  providerFromEnv && AI_PROVIDERS.includes(providerFromEnv as AiProvider)
    ? (providerFromEnv as AiProvider)
    : "mock";

export const aiConfig = {
  configuredProvider,
  openAiApiKey: process.env.OPENAI_API_KEY ?? "",
  openAiModel: process.env.OPENAI_MODEL ?? "gpt-5-mini"
};
