import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Brain } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { StreakCounter } from "./StreakCounter";
import { TaskCard } from "./TaskCard";
import { ExamCountdown } from "./ExamCountdown";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  title: string;
  skillType: "grammar" | "reading" | "listening" | "vocabulary";
  points: number;
  estimatedTime: number;
  completed: boolean;
}

export function Home() {
  const [todayProgress, setTodayProgress] = useState(65);
  const [streakDays, setStreakDays] = useState(12);
  const [showCelebration, setShowCelebration] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete Grammar Practice Set",
      skillType: "grammar",
      points: 50,
      estimatedTime: 15,
      completed: false
    },
    {
      id: "2", 
      title: "Reading Comprehension - Science Articles",
      skillType: "reading",
      points: 75,
      estimatedTime: 20,
      completed: false
    },
    {
      id: "3",
      title: "Vocabulary Builder - Advanced Words",
      skillType: "vocabulary", 
      points: 40,
      estimatedTime: 10,
      completed: true
    }
  ]);

  const examDate = new Date('2024-12-15');
  const completedTasks = tasks.filter(task => task.completed);
  const todayScore = completedTasks.reduce((sum, task) => sum + task.points, 0);
  
  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    ));
    
    // Simulate progress increase
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      const newProgress = Math.min(100, todayProgress + 15);
      setTodayProgress(newProgress);
      
      if (newProgress === 100) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }
  };

  return (
    <div className="pb-20 px-4 pt-4 max-w-md mx-auto space-y-3">
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-xl font-bold text-on-surface mb-1">
          Good morning! 👋
        </h1>
        <p className="text-sm text-on-surface-variant">
          Ready to ace your YDS exam?
        </p>
      </div>

      {/* Progress Ring and Countdown Side by Side */}
      <div className="flex items-center gap-4 justify-center">
        {/* Progress Ring */}
        <div className="flex-shrink-0">
          <ProgressRing 
            progress={todayProgress}
            size={120}
            showCelebration={showCelebration}
            className="breathing"
          />
        </div>
        
        {/* Countdown Card */}
        <Card className="flex-1 p-3 bg-primary-container">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-container-foreground mb-1">
              {Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-primary-container-foreground/80 mb-2">
              Days to YDS
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-primary-container-foreground/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000 rounded-full relative"
                style={{ 
                  width: `${Math.min(100, Math.max(10, 100 - ((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) / 365 * 100)))}%` 
                }}
              >
                <div className="absolute right-0 top-0 w-0.5 h-full bg-white/80 animate-pulse" />
              </div>
            </div>
            
            <div className="text-xs text-primary-container-foreground/60 mt-1">
              Exam Preparation
            </div>
          </div>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3 bg-secondary-container text-center">
          <div className="text-xl font-bold text-secondary-container-foreground">
            {todayScore}
          </div>
          <div className="text-xs text-secondary-container-foreground/80">
            Points Today
          </div>
        </Card>
        
        <Card className="p-3 bg-tertiary-container text-center">
          <div className="text-xl font-bold text-tertiary-container-foreground">
            {completedTasks.length}/{tasks.length}
          </div>
          <div className="text-xs text-tertiary-container-foreground/80">
            Tasks Done
          </div>
        </Card>
      </div>

      {/* Streak Counter */}
      <StreakCounter streakDays={streakDays} />

      {/* Exam Countdown */}
      <ExamCountdown examDate={examDate} />

      {/* AI Smart Suggestion */}
      <Card className="p-3 bg-card-elevated ai-glow">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 bg-primary rounded-full">
            <Brain size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-sm text-card-foreground">
              Smart Suggestion
            </h3>
            <p className="text-xs text-card-foreground/80">
              AI-powered recommendation
            </p>
          </div>
        </div>
        
        <p className="text-xs text-card-foreground/90 mb-2">
          Based on your progress, focus on <strong>reading comprehension</strong> today. 
          You're 85% ready for grammar but could improve reading speed by 15%.
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-xs border-primary text-primary hover:bg-primary-container"
        >
          <Sparkles size={14} className="mr-1" />
          Try Recommended Task
        </Button>
      </Card>

      {/* Today's Tasks */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-on-surface">
            Today's Tasks
          </h2>
          <TrendingUp size={18} className="text-primary" />
        </div>
        
        <div className="space-y-2">
          {tasks.slice(0, 3).map(task => (
            <TaskCard
              key={task.id}
              {...task}
              onComplete={handleTaskComplete}
            />
          ))}
        </div>
        
        {tasks.length > 3 && (
          <Button 
            variant="ghost" 
            className="w-full text-primary hover:bg-primary-container"
          >
            View All Tasks ({tasks.length - 3} more)
          </Button>
        )}
      </div>

      {/* Motivational Message */}
      {showCelebration && (
        <Card className="p-3 bg-success-container border-2 border-success celebration-bounce">
          <div className="text-center">
            <div className="text-xl mb-1">🎉</div>
            <h3 className="font-medium text-sm text-success-container-foreground mb-1">
              Great job!
            </h3>
            <p className="text-xs text-success-container-foreground/80">
              You've completed 100% of today's goals!
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}