import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { DiscordBot } from "./discord-bot";
import { BotScheduler } from "./bot-scheduler";
import { z } from "zod";
import { insertActivityLogSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import dotenv from "dotenv";

dotenv.config();

// Bot configuration
const DISCORD_TOKEN = process.env.DISCORD_TOKEN || "";
const AUTO_DISCONNECT_HOUR = 1; // 1 AM
const AUTO_DISCONNECT_MINUTE = 0; // 0 minutes

if (!DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN is missing in environment variables");
  process.exit(1);
}

// Initialize bot
const bot = new DiscordBot(DISCORD_TOKEN);
const scheduler = new BotScheduler(bot, AUTO_DISCONNECT_HOUR, AUTO_DISCONNECT_MINUTE);

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the bot and scheduler
  try {
    await bot.login();
    scheduler.startSchedule();
    console.log("Discord bot started and scheduler initialized");
  } catch (error) {
    console.error("Failed to start Discord bot:", error);
  }

  // API routes
  app.get("/api/bot/status", async (req, res) => {
    try {
      const status = bot.getStatus();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Failed to get bot status" });
    }
  });

  app.get("/api/voice-channels", async (req, res) => {
    try {
      const voiceChannels = bot.getVoiceChannels();
      res.json(voiceChannels);
    } catch (error) {
      res.status(500).json({ message: "Failed to get voice channels" });
    }
  });

  app.get("/api/logs", async (req, res) => {
    try {
      const logs = await storage.getAllLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to get logs" });
    }
  });

  app.post("/api/bot/toggle", async (req, res) => {
    try {
      const schema = z.object({
        enabled: z.boolean(),
      });
      
      const { enabled } = schema.parse(req.body);
      
      if (enabled) {
        await scheduler.startSchedule();
        await storage.createLog({
          event: "Bot Enabled",
          details: "Auto-disconnect schedule activated",
          status: "Success",
          metadata: { enabled },
        });
        res.json({ message: "Bot enabled", enabled: true });
      } else {
        await scheduler.stopSchedule();
        await storage.createLog({
          event: "Bot Disabled",
          details: "Auto-disconnect schedule deactivated",
          status: "Success", 
          metadata: { enabled },
        });
        res.json({ message: "Bot disabled", enabled: false });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: fromZodError(error).message });
      } else {
        res.status(500).json({ message: "Failed to toggle bot status" });
      }
    }
  });

  app.post("/api/bot/disconnect-now", async (req, res) => {
    try {
      const result = await bot.disconnectAllUsers();
      
      await storage.createLog({
        event: "Manual Disconnect",
        details: `Disconnected ${result.userCount} users from ${result.channelCount} voice channels`,
        status: "Manual",
        metadata: result,
      });
      
      res.json({ 
        message: "Manual disconnect successful", 
        details: result 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to disconnect users" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Clean up resources on server close
  httpServer.on("close", () => {
    scheduler.stopSchedule();
    bot.destroy();
    console.log("Discord bot and scheduler stopped");
  });

  return httpServer;
}
