import { useEffect, useState } from "react";
import type { AppState, CharacterResponse } from "@streamsidekick/shared";
import { api } from "../lib/api";
import { socket } from "../lib/socket";

export const useAppState = () => {
  const [state, setState] = useState<AppState | null>(null);
  const [latestResponse, setLatestResponse] = useState<CharacterResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    api.getState()
      .then((nextState) => {
        if (!mounted) {
          return;
        }
        setState(nextState);
        setLatestResponse(nextState.overlay.latestResponse);
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    const handleStateUpdate = (nextState: AppState) => {
      setState(nextState);
      setLatestResponse(nextState.overlay.latestResponse);
    };

    const handleCharacterResponse = (response: CharacterResponse) => {
      setLatestResponse(response);
    };

    socket.on("state:update", handleStateUpdate);
    socket.on("character:response", handleCharacterResponse);

    return () => {
      mounted = false;
      socket.off("state:update", handleStateUpdate);
      socket.off("character:response", handleCharacterResponse);
    };
  }, []);

  return {
    state,
    latestResponse,
    isLoading,
    refresh: async () => {
      const nextState = await api.getState();
      setState(nextState);
      setLatestResponse(nextState.overlay.latestResponse);
    }
  };
};
