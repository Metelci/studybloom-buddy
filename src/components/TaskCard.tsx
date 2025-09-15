import { useState } from "react";
import { Check, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface TaskCardProps {
  id: string;
  title: string;
  skillType: "grammar" | "reading" | "listening" | "vocabulary";
  points: number;
  estimatedTime: number;
  completed: boolean;
  onComplete: (id: string) => void;
  className?: string;
}

const skillColors = {
  grammar: "border-l-primary",
  reading: "border-l-secondary", 
  listening: "border-l-tertiary",
  vocabulary: "border-l-[hsl(263_67%_80%)]"
};

const skillLabels = {
  grammar: "Grammar",
  reading: "Reading", 
  listening: "Listening",
  vocabulary: "Vocabulary"
};

export function TaskCard({ 
  id, 
  title, 
  skillType, 
  points, 
  estimatedTime, 
  completed, 
  onComplete,
  className 
}: TaskCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  
  const handleComplete = () => {
    if (completed) return;
    
    setIsCompleting(true);
    setTimeout(() => {
      onComplete(id);
      setIsCompleting(false);
    }, 300);
  };

  return (
    <Card className={cn(
      "p-4 border-l-4 transition-all duration-standard hover:shadow-md cursor-pointer",
      skillColors[skillType],
      completed && "opacity-60 bg-success-container",
      isCompleting && "swipe-complete",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-1 rounded-full">
              {skillLabels[skillType]}
            </span>
            <div className="flex items-center gap-1 text-xs text-on-surface-variant">
              <Clock size={12} />
              {estimatedTime}min
            </div>
          </div>
          
          <h3 className={cn(
            "font-medium text-on-surface mb-2",
            completed && "line-through text-on-surface-variant"
          )}>
            {title}
          </h3>
          
          <div className="flex items-center gap-2">
            <Star size={14} className="text-tertiary" />
            <span className="text-sm font-medium text-tertiary">
              {points} points
            </span>
          </div>
        </div>
        
        <button
          onClick={handleComplete}
          disabled={completed}
          className={cn(
            "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-standard",
            completed 
              ? "bg-success border-success text-white" 
              : "border-outline hover:border-primary hover:bg-primary-container",
            isCompleting && "scale-110 bg-success border-success"
          )}
        >
          {(completed || isCompleting) && (
            <Check size={16} className="text-white" />
          )}
        </button>
      </div>
    </Card>
  );
}