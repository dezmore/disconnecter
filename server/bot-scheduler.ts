import schedule from "node-schedule";
import { DiscordBot } from "./discord-bot";
import { storage } from "./storage";

export class BotScheduler {
  private bot: DiscordBot;
  private job: schedule.Job | null;
  private hour: number;
  private minute: number;
  
  constructor(bot: DiscordBot, hour: number, minute: number) {
    this.bot = bot;
    this.job = null;
    this.hour = hour;
    this.minute = minute;
  }
  
  // Start the auto-disconnect schedule
  startSchedule() {
    if (this.job) {
      return;
    }
    
    console.log(`Setting up auto-disconnect schedule for ${this.hour}:${this.minute} WIB (GMT+7)`);
    
    // Schedule the job to run at the specified time (in WIB timezone - GMT+7)
    this.job = schedule.scheduleJob({
      hour: this.hour,
      minute: this.minute,
      tz: "Asia/Jakarta" // WIB timezone (GMT+7)
    }, async () => {
      try {
        console.log("Running scheduled auto-disconnect...");
        
        // Disconnect all users
        const result = await this.bot.disconnectAllUsers();
        
        // Log the event
        if (result.userCount > 0) {
          await storage.createLog({
            event: "Auto Disconnect Triggered",
            details: `Disconnected ${result.userCount} users from ${result.channelCount} voice channels`,
            status: "Success",
            timestamp: new Date(),
            metadata: result,
          });
        } else {
          await storage.createLog({
            event: "Auto Disconnect Triggered",
            details: "No users in voice channels",
            status: "No Action",
            timestamp: new Date(),
            metadata: result,
          });
        }
      } catch (error) {
        console.error("Error during scheduled disconnect:", error);
        
        // Log the error
        await storage.createLog({
          event: "Auto Disconnect Failed",
          details: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          status: "No Action",
          timestamp: new Date(),
          metadata: { error: error instanceof Error ? error.message : "Unknown error" },
        });
      }
    });
    
    return true;
  }
  
  // Stop the auto-disconnect schedule
  stopSchedule() {
    if (this.job) {
      this.job.cancel();
      this.job = null;
      console.log("Auto-disconnect schedule stopped");
      return true;
    }
    return false;
  }
  
  // Get next scheduled execution time
  getNextExecutionTime() {
    if (!this.job) {
      return null;
    }
    
    const nextInvocation = this.job.nextInvocation();
    return nextInvocation ? nextInvocation.toDate() : null;
  }
}
