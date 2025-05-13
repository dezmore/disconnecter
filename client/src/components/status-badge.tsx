import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  connected: boolean;
  className?: string;
};

export function StatusBadge({ connected, className }: StatusBadgeProps) {
  return (
    <span 
      className={cn(
        "px-2 py-1 text-xs rounded-full flex items-center",
        connected 
          ? "bg-discord-success bg-opacity-20 text-discord-success" 
          : "bg-discord-danger bg-opacity-20 text-discord-danger",
        className
      )}
    >
      <span className={cn(
        "h-2 w-2 rounded-full mr-1.5",
        connected ? "bg-discord-success" : "bg-discord-danger"
      )}></span>
      {connected ? "Connected" : "Disconnected"}
    </span>
  );
}
