import { activityLogs, type ActivityLog, type InsertActivityLog } from "@shared/schema";

// Storage interface for the application
export interface IStorage {
  createLog(log: InsertActivityLog): Promise<ActivityLog>;
  getLog(id: number): Promise<ActivityLog | undefined>;
  getAllLogs(limit?: number): Promise<ActivityLog[]>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private logs: Map<number, ActivityLog>;
  private currentLogId: number;

  constructor() {
    this.logs = new Map();
    this.currentLogId = 1;
  }

  async createLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentLogId++;
    const timestamp = insertLog.timestamp || new Date();
    
    const log: ActivityLog = {
      id,
      timestamp,
      event: insertLog.event,
      details: insertLog.details,
      status: insertLog.status,
      metadata: insertLog.metadata || {},
    };
    
    this.logs.set(id, log);
    return log;
  }

  async getLog(id: number): Promise<ActivityLog | undefined> {
    return this.logs.get(id);
  }

  async getAllLogs(limit?: number): Promise<ActivityLog[]> {
    const allLogs = Array.from(this.logs.values())
      .sort((a, b) => {
        const dateA = new Date(a.timestamp);
        const dateB = new Date(b.timestamp);
        return dateB.getTime() - dateA.getTime();
      });
    
    if (limit) {
      return allLogs.slice(0, limit);
    }
    
    return allLogs;
  }
}

// Export storage instance
export const storage = new MemStorage();
