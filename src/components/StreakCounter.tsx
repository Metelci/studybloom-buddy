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
      "flex items-center gap-2 p-3 rounded-xl bg-tertiary-container",
      isOnFire && "breathing",
      className
    )}>
      <div className={cn(
        "p-2 rounded-full bg-tertiary",
        isOnFire && "animate-pulse"
      )}>
        <Flame 
          size={20} 
          className={cn(
            "text-white",
            isOnFire && "streak-fire"
          )}
        />
      </div>
      
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-tertiary-container-foreground">
            {streakDays}
          </span>
          <span className="text-xs text-tertiary-container-foreground/80">
            day{streakDays !== 1 ? 's' : ''} streak
          </span>
          {multiplier > 1 && (
            <span className="px-1.5 py-0.5 bg-tertiary text-white text-xs font-bold rounded-full">
              {multiplier}x
            </span>
          )}
        </div>
        
        <p className="text-xs text-tertiary-container-foreground/70">
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