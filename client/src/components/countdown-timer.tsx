import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

type CountdownTimerProps = {
  onManualTrigger: () => void;
};

export function CountdownTimer({ onManualTrigger }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Get current time
      const now = new Date();
      
      // Create target time (1:00 AM WIB / GMT+7)
      let target = new Date();
      target.setHours(1, 0, 0, 0); // Set to 1:00:00 AM
      
      // If it's already past 1 AM, set target to next day
      if (now >= target) {
        target.setDate(target.getDate() + 1);
      }
      
      // Calculate time difference in seconds
      const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
      
      // Calculate hours, minutes, seconds
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = Math.floor(diff % 60);
      
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeLeft();
    
    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const padWithZero = (num: number): string => {
    return String(num).padStart(2, '0');
  };

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="bg-discord-darker rounded-md p-3 text-center">
        <span className="text-2xl font-semibold">{padWithZero(timeLeft.hours)}</span>
        <p className="text-xs text-discord-light mt-1">Hours</p>
      </div>
      
      <div className="bg-discord-darker rounded-md p-3 text-center">
        <span className="text-2xl font-semibold">{padWithZero(timeLeft.minutes)}</span>
        <p className="text-xs text-discord-light mt-1">Minutes</p>
      </div>
      
      <div className="bg-discord-darker rounded-md p-3 text-center">
        <span className="text-2xl font-semibold">{padWithZero(timeLeft.seconds)}</span>
        <p className="text-xs text-discord-light mt-1">Seconds</p>
      </div>
      
      <div className="bg-discord-danger bg-opacity-20 rounded-md p-3 flex flex-col items-center justify-center">
        <Button 
          onClick={onManualTrigger}
          variant="ghost" 
          className="text-discord-danger text-sm font-medium hover:bg-discord-danger hover:bg-opacity-10"
        >
          Run Now
        </Button>
        <p className="text-xs text-discord-light mt-1">Manual Trigger</p>
      </div>
    </div>
  );
}
