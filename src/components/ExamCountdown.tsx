import { Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ExamCountdownProps {
  examDate: Date;
  className?: string;
}

export function ExamCountdown({ examDate, className }: ExamCountdownProps) {
  const now = new Date();
  const timeDiff = examDate.getTime() - now.getTime();
  const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  const progressPercent = Math.max(0, Math.min(100, ((365 - daysLeft) / 365) * 100));
  
  return (
    <Card className={`p-4 bg-primary-container ${className}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-primary rounded-full">
          <Calendar size={20} className="text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-primary-container-foreground">
            YDS Exam 2024
          </h3>
          <p className="text-sm text-primary-container-foreground/80">
            {daysLeft > 0 ? `${daysLeft} days left` : "Exam day!"}
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-primary-container-foreground/80">Progress</span>
          <span className="font-medium text-primary-container-foreground">
            {Math.round(progressPercent)}%
          </span>
        </div>
        
        <div className="w-full bg-primary/20 rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-emphasized"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        
        <div className="flex items-center gap-1 text-xs text-primary-container-foreground/70">
          <Clock size={12} />
          <span>
            {examDate.toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </span>
        </div>
      </div>
    </Card>
  );
}