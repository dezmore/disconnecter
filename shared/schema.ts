import { pgTable, text, serial, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User in a voice channel
export type VoiceChannelUser = {
  id: string;
  tag: string; // username#discriminator
};

// Voice channel with connected users
export type VoiceChannel = {
  id: string;
  name: string;
  users: VoiceChannelUser[];
};

// Bot status
export type BotStatus = {
  connected: boolean;
  guildCount: number;
  uptime: number;
};

// Logs table for activity tracking
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  event: text("event").notNull(),
  details: text("details").notNull(),
  status: text("status").notNull(),
  metadata: jsonb("metadata"),
});

// Activity log type
export type ActivityLog = {
  id: number;
  timestamp: string | Date;
  event: string;
  details: string;
  status: string;
  metadata?: Record<string, any>;
};

// Insert schema for activity logs
export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
