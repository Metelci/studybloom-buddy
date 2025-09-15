import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  showCelebration?: boolean;
  className?: string;
}

export function ProgressRing({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  showCelebration = false,
  className 
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  return (
    <div className={cn("relative", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--outline-variant))"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="opacity-20"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            "progress-ring transition-all duration-emphasized",
            showCelebration && progress === 100 && "celebration-bounce"
          )}
          style={{
            background: progress === 100 
              ? "linear-gradient(45deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)"
              : undefined
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className={cn(
            "text-2xl font-bold text-on-surface transition-colors duration-standard",
            progress === 100 && "text-primary"
          )}>
            {Math.round(animatedProgress)}%
          </div>
          <div className="text-xs text-on-surface-variant font-medium">
            Today
          </div>
        </div>
      </div>
      
      {/* Celebration effect */}
      {showCelebration && progress === 100 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-4xl animate-bounce">🎉</div>
        </div>
      )}
    </div>
  );
}