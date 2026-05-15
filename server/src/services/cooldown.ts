import type { BotMode } from "@streamsidekick/shared";

const cooldownByMode: Record<BotMode, number> = {
  Focus: 9000,
  Normal: 5000,
  Chaos: 2500
};

export const getCooldownMs = (mode: BotMode) => cooldownByMode[mode];

export const isOnCooldown = (cooldownUntil: string | null) => {
  if (!cooldownUntil) {
    return false;
  }
  return new Date(cooldownUntil).getTime() > Date.now();
};
