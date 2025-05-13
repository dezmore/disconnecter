import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { StatusBadge } from "@/components/status-badge";
import { CountdownTimer } from "@/components/countdown-timer";
import { VoiceChannels } from "@/components/voice-channels";
import { ActivityLogs } from "@/components/activity-logs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";
import { formatTime } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [botEnabled, setBotEnabled] = useState(true);
  const { toast } = useToast();

  // Fetch bot status
  const { data: botStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["/api/bot/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch voice channels
  const { data: voiceChannels, refetch: refetchChannels } = useQuery({
    queryKey: ["/api/voice-channels"],
    refetchInterval: 15000, // Refresh every 15 seconds
  });

  // Fetch activity logs
  const { data: activityLogs, refetch: refetchLogs } = useQuery({
    queryKey: ["/api/logs"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatTime(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Toggle bot status
  const toggleBotStatus = async () => {
    try {
      const newStatus = !botEnabled;
      await apiRequest("POST", "/api/bot/toggle", { enabled: newStatus });
      setBotEnabled(newStatus);
      toast({
        title: `Bot ${newStatus ? "Enabled" : "Disabled"}`,
        description: `Auto-disconnect is now ${newStatus ? "active" : "inactive"}.`,
      });
      refetchStatus();
    } catch (error) {
      toast({
        title: "Status Change Failed",
        description: "Could not update bot status.",
        variant: "destructive",
      });
    }
  };

  // Manual disconnect trigger
  const triggerManualDisconnect = async () => {
    try {
      await apiRequest("POST", "/api/bot/disconnect-now", {});
      toast({
        title: "Manual Disconnect Triggered",
        description: "Disconnecting all users from voice channels.",
      });
      
      // Refresh data after a short delay
      setTimeout(() => {
        refetchChannels();
        refetchLogs();
      }, 1000);
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: "Could not disconnect users.",
        variant: "destructive",
      });
    }
  };

  // Refresh all data
  const refreshAllData = () => {
    refetchStatus();
    refetchChannels();
    refetchLogs();
    toast({
      title: "Data Refreshed",
      description: "All dashboard data has been updated.",
    });
  };

  const isConnected = botStatus?.connected ?? false;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-discord-secondary border-b border-gray-700 h-14 flex items-center px-4">
          <div className="flex items-center space-x-4 flex-1">
            <h2 className="text-lg font-medium">Auto-Disconnect Dashboard</h2>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center text-discord-light">
              <span className="text-sm">
                {currentTime}
                <span className="text-xs ml-1">(GMT+7 WIB)</span>
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <StatusBadge connected={isConnected} />
            <Button 
              onClick={refreshAllData} 
              variant="ghost" 
              size="icon" 
              className="text-discord-light hover:text-white"
            >
              <RefreshCw className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Auto-Disconnect Card */}
            <div className="col-span-1 lg:col-span-2 bg-discord-secondary rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-700 flex items-center justify-between">
                <h3 className="font-medium text-lg">Auto-Disconnect Schedule</h3>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${botEnabled ? 'bg-discord-primary' : 'bg-gray-600'}`}>
                  {botEnabled ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-sm text-discord-light mb-1">Disconnect Time</p>
                    <div className="flex items-center">
                      <span className="text-2xl font-semibold">01:00 AM</span>
                      <span className="ml-2 text-discord-light text-sm">WIB (GMT+7)</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex items-center cursor-pointer">
                      <Switch checked={botEnabled} onCheckedChange={toggleBotStatus} />
                      <div className="ml-3 text-sm font-medium">
                        {botEnabled ? 'Enabled' : 'Disabled'}
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="border-t border-gray-700 pt-6">
                  <h4 className="text-sm font-medium mb-4">Countdown to Next Disconnect</h4>
                  <CountdownTimer onManualTrigger={triggerManualDisconnect} />
                </div>
              </div>
            </div>
            
            {/* Voice Channels Card */}
            <VoiceChannels voiceChannels={voiceChannels || []} />
          </div>
          
          {/* Activity Logs */}
          <ActivityLogs logs={activityLogs || []} />
        </div>
      </div>
    </div>
  );
}
