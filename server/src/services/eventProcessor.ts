import type { EventResult, LogEntry, StreamSidekickEvent } from "@streamsidekick/shared";
import {
  addLogEntry,
  getState,
  resetOverlayToIdle,
  setAiStatus,
  setCooldownUntil,
  setOverlayResponse
} from "../state/store.js";
import { createId } from "../utils/ids.js";
import { generateCharacterResponse } from "./aiProvider.js";
import { getCooldownMs, isOnCooldown } from "./cooldown.js";

export const processEvent = async (event: StreamSidekickEvent): Promise<EventResult> => {
  const currentState = getState();
  const cooldownActive = isOnCooldown(currentState.cooldownUntil);

  if (cooldownActive) {
    const entry: LogEntry = {
      id: createId(),
      timestamp: new Date().toISOString(),
      eventType: event.type,
      action: event.payload?.action,
      accepted: false,
      message: "Ignored because the co-host is on cooldown."
    };

    addLogEntry(entry);

    return {
      accepted: false,
      reason: "COOLDOWN_ACTIVE",
      state: getState()
    };
  }

  const generation = await generateCharacterResponse({
    eventType: event.type,
    action: event.payload?.action,
    personality: currentState.settings.personality,
    mode: currentState.settings.mode,
    playerSpeech: event.payload?.text,
    sceneName: event.payload?.sceneName,
    snapshotHint: event.payload?.snapshotHint
  });

  const response = generation.response;
  const cooldownUntil = new Date(Date.now() + getCooldownMs(currentState.settings.mode)).toISOString();

  setAiStatus(generation.aiStatus);
  setOverlayResponse(response, response.state);
  setCooldownUntil(cooldownUntil);

  const entry: LogEntry = {
    id: createId(),
    timestamp: response.timestamp,
    eventType: event.type,
    action: event.payload?.action,
    accepted: true,
    message: response.text,
    response
  };

  addLogEntry(entry);

  return {
    accepted: true,
    response,
    state: getState()
  };
};

export const scheduleOverlayIdleReset = () => {
  setTimeout(() => {
    resetOverlayToIdle();
  }, 2600);
};
