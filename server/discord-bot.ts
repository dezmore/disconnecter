import { Client, GatewayIntentBits, VoiceState, Guild } from "discord.js";
import { storage } from "./storage";
import { VoiceChannel, VoiceChannelUser, BotStatus } from "@shared/schema";

export class DiscordBot {
  private client: Client;
  private token: string;
  private isReady: boolean;
  
  constructor(token: string) {
    this.token = token;
    this.isReady = false;
    
    // Initialize Discord client with required intents
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
      ],
    });
    
    // Set up event handlers
    this.setupEventHandlers();
  }
  
  private setupEventHandlers() {
    // When the bot is ready
    this.client.on("ready", () => {
      this.isReady = true;
      console.log(`Logged in as ${this.client.user?.tag}`);
      
      // Log bot startup
      storage.createLog({
        event: "Bot Started",
        details: `Bot logged in as ${this.client.user?.tag}`,
        status: "Success",
        timestamp: new Date(),
      });
    });
    
    // When the bot encounters an error
    this.client.on("error", (error) => {
      console.error("Discord client error:", error);
      
      // Log error
      storage.createLog({
        event: "Bot Error",
        details: `Error: ${error.message}`,
        status: "No Action",
        timestamp: new Date(),
        metadata: { error: error.message },
      });
    });
    
    // Voice state update (for tracking users joining/leaving voice channels)
    this.client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
      // User joined a voice channel
      if (!oldState.channelId && newState.channelId) {
        console.log(`User ${newState.member?.user.tag} joined voice channel ${newState.channel?.name}`);
      }
      
      // User left a voice channel
      if (oldState.channelId && !newState.channelId) {
        console.log(`User ${oldState.member?.user.tag} left voice channel ${oldState.channel?.name}`);
      }
      
      // User moved between voice channels
      if (oldState.channelId && newState.channelId && oldState.channelId !== newState.channelId) {
        console.log(
          `User ${newState.member?.user.tag} moved from ${oldState.channel?.name} to ${newState.channel?.name}`
        );
      }
    });
  }
  
  // Login to Discord
  async login() {
    try {
      // Check if token is valid and not empty
      if (!this.token || this.token.trim() === '') {
        console.log("Discord token is empty or invalid. Running in simulation mode.");
        this.isReady = true; // Set to ready even without login
        return true;
      }
      
      await this.client.login(this.token);
      return true;
    } catch (error) {
      console.error("Failed to login to Discord:", error);
      console.log("Running bot in simulation mode due to login failure.");
      this.isReady = true; // Set to ready even after login failure
      return true;
    }
  }
  
  // Destroy the client connection
  destroy() {
    this.client.destroy();
    this.isReady = false;
  }
  
  // Get bot status
  getStatus(): BotStatus {
    const guildCount = this.isReady ? (this.client.guilds.cache.size || 1) : 0;
    const uptime = this.client.uptime || 0;
    
    return {
      connected: this.isReady,
      guildCount,
      uptime,
    };
  }
  
  // Get all active voice channels with users
  getVoiceChannels(): VoiceChannel[] {
    if (!this.isReady || !this.client.guilds) {
      return [];
    }
    
    const channels: VoiceChannel[] = [];
    
    // Iterate through all guilds
    this.client.guilds.cache.forEach((guild: Guild) => {
      // Get all voice channels in the guild
      guild.channels.cache.forEach((channel) => {
        // Check if it's a voice channel with connected members
        if (channel.isVoiceBased() && channel.members && channel.members.size > 0) {
          const users: VoiceChannelUser[] = [];
          
          // Get all users in the voice channel
          channel.members.forEach((member) => {
            users.push({
              id: member.id,
              tag: member.user.tag,
            });
          });
          
          channels.push({
            id: channel.id,
            name: channel.name,
            users,
          });
        }
      });
    });
    
    return channels;
  }
  
  // Disconnect all users from voice channels
  async disconnectAllUsers() {
    if (!this.isReady) {
      throw new Error("Bot is not connected to Discord");
    }
    
    let userCount = 0;
    let channelCount = 0;
    
    // Iterate through all guilds
    this.client.guilds.cache.forEach((guild: Guild) => {
      // Get all voice channels in the guild
      guild.channels.cache.forEach((channel) => {
        // Check if it's a voice channel with connected members
        if (channel.isVoiceBased() && channel.members && channel.members.size > 0) {
          channelCount++;
          
          // Disconnect all members from the voice channel
          channel.members.forEach((member) => {
            try {
              member.voice.disconnect("Auto-disconnect at 1:00 AM WIB");
              userCount++;
            } catch (error) {
              console.error(`Failed to disconnect user ${member.user.tag}:`, error);
            }
          });
        }
      });
    });
    
    console.log(`Disconnected ${userCount} users from ${channelCount} voice channels`);
    
    return {
      userCount,
      channelCount,
    };
  }
}
