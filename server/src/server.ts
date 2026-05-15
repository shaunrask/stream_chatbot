import "dotenv/config";
import cors from "cors";
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import {
  BOT_MODES,
  DASHBOARD_ACTIONS,
  EVENT_TYPES,
  PERSONALITY_KEYS,
  type BotMode,
  type PersonalityKey,
  type StreamSidekickEvent
} from "@streamsidekick/shared";
import { processEvent, scheduleOverlayIdleReset } from "./services/eventProcessor.js";
import { getState, setMode, setPersonality, setTtsEnabled } from "./state/store.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

app.get("/api/state", (_request, response) => {
  response.json(getState());
});

app.post("/api/event", async (request, response) => {
  const event = request.body as StreamSidekickEvent | undefined;

  if (!event || typeof event.type !== "string") {
    response.status(400).json({ error: "Invalid event payload." });
    return;
  }

  if (!EVENT_TYPES.includes(event.type)) {
    response.status(400).json({ error: "Invalid event type." });
    return;
  }

  if (event.payload?.action && !DASHBOARD_ACTIONS.includes(event.payload.action)) {
    response.status(400).json({ error: "Invalid dashboard action." });
    return;
  }

  try {
    const result = await processEvent(event);
    io.emit("state:update", result.state);

    if (result.response) {
      io.emit("character:response", result.response);
      scheduleOverlayIdleReset();
      setTimeout(() => {
        io.emit("state:update", getState());
      }, 2800);
    }

    response.json(result);
  } catch (error) {
    console.error("Failed to process event", error);
    response.status(500).json({ error: "Failed to process event." });
  }
});

app.post("/api/settings/personality", (request, response) => {
  const personality = request.body?.personality as PersonalityKey | undefined;

  if (!personality || !PERSONALITY_KEYS.includes(personality)) {
    response.status(400).json({ error: "Invalid personality." });
    return;
  }

  const state = setPersonality(personality);
  io.emit("state:update", state);
  response.json(state);
});

app.post("/api/settings/mode", (request, response) => {
  const mode = request.body?.mode as BotMode | undefined;

  if (!mode || !BOT_MODES.includes(mode)) {
    response.status(400).json({ error: "Invalid mode." });
    return;
  }

  const state = setMode(mode);
  io.emit("state:update", state);
  response.json(state);
});

app.post("/api/settings/tts", (request, response) => {
  const ttsEnabled = Boolean(request.body?.ttsEnabled);
  const state = setTtsEnabled(ttsEnabled);
  io.emit("state:update", state);
  response.json(state);
});

io.on("connection", (socket) => {
  socket.emit("state:update", getState());
});

httpServer.listen(port, () => {
  console.log(`StreamSidekick server listening on http://localhost:${port}`);
});
