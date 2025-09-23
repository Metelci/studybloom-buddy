import { useState, useEffect } from "react";
import { Sparkles, TrendingUp, Brain } from "lucide-react";
import { ProgressRing } from "./ProgressRing";
import { StreakCounter } from "./StreakCounter";
import { TaskCard } from "./TaskCard";
import { ExamCountdown } from "./ExamCountdown";
import { WeeklyStudyPlan } from "./WeeklyStudyPlan";
import { ExamInfo } from "./ExamInfo";
import { ExamService, type ExamData } from "@/services/examService";
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

interface HomeProps {
  onNavigateToTasks?: (subTab?: string) => void;
}

export function Home({ onNavigateToTasks }: HomeProps) {
  const [todayProgress, setTodayProgress] = useState(65);
  const [streakDays, setStreakDays] = useState(12);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showExamInfo, setShowExamInfo] = useState(false);
  const [examData, setExamData] = useState<ExamData | null>(null);
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

  useEffect(() => {
    // Load exam data when component mounts
    const loadExamData = async () => {
      try {
        const data = await ExamService.getExamData();
        setExamData(data);
      } catch (error) {
        console.error('Error loading exam data:', error);
      }
    };
    loadExamData();
  }, []);

  const nextExam = examData?.nextExam;
  const examDate = nextExam ? new Date(nextExam.date) : new Date('2025-03-15');
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

  if (showExamInfo) {
    return <ExamInfo onBack={() => setShowExamInfo(false)} />;
  }

  return (
    <div className="pb-20 px-4 pt-4 max-w-md mx-auto space-y-3">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-primary/60 via-secondary/50 to-tertiary/55 rounded-2xl p-4 mb-3 overflow-hidden">
        <div className="absolute top-2 right-2 w-16 h-16 bg-primary/30 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-2 w-12 h-12 bg-secondary/35 rounded-full blur-xl" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-success/10 text-success px-2.5 py-0.5 rounded-full text-xs font-medium mb-2">
            <Sparkles size={10} />
            Ready to Study
          </div>
          <h1 className="text-xl font-bold text-slate-900 drop-shadow-md mb-1" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
            Good morning! 👋
          </h1>
          <p className="text-xs text-slate-800 drop-shadow-sm" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.6)'}}>
            Let's make today count toward your YDS success
          </p>
        </div>
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
        <Card 
          className="flex-1 p-3 bg-primary-container cursor-pointer hover:bg-primary-container/80 transition-colors"
          onClick={() => setShowExamInfo(true)}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-container-foreground mb-1">
              {Math.ceil((examDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-primary-container-foreground/80 mb-2">
              Days to {nextExam?.name || 'YDS'}
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
              {nextExam?.status || 'Exam Preparation'}
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

      {/* Weekly Study Plan */}
      <WeeklyStudyPlan onNavigateToTasks={onNavigateToTasks} />

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