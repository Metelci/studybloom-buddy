import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  streakDays: number;
  className?: string;
}

export function StreakCounter({ streakDays, className }: StreakCounterProps) {
  const isOnFire = streakDays >= 7;
  const multiplier = Math.min(Math.floor(streakDays / 7) + 1, 5);
  
  return (
    <div className={cn(
      "flex items-center gap-3 p-4 rounded-xl bg-tertiary-container",
      isOnFire && "breathing",
      className
    )}>
      <div className={cn(
        "p-3 rounded-full bg-tertiary",
        isOnFire && "animate-pulse"
      )}>
        <Flame 
          size={24} 
          className={cn(
            "text-white",
            isOnFire && "streak-fire"
          )}
        />
      </div>
      
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-tertiary-container-foreground">
            {streakDays}
          </span>
          <span className="text-sm text-tertiary-container-foreground/80">
            day{streakDays !== 1 ? 's' : ''} streak
          </span>
          {multiplier > 1 && (
            <span className="px-2 py-1 bg-tertiary text-white text-xs font-bold rounded-full">
              {multiplier}x
            </span>
          )}
        </div>
        
        <p className="text-sm text-tertiary-container-foreground/70 mt-1">
          {isOnFire 
            ? "You're on fire! 🔥" 
            : streakDays > 0 
              ? "Keep it up!" 
              : "Start your streak today!"
          }
        </p>
      </div>
    </div>
  );
}