import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  BookOpen, 
  PenTool, 
  Brain, 
  Headphones,
  CheckCircle2,
  Circle
} from "lucide-react";
import { WeeklyStudyPlan as WeeklyStudyPlanType, DailyPlan } from "@/types/StudyPlan";

// Mock data for current week's study plan
const mockWeeklyPlan: WeeklyStudyPlanType = {
  id: "week-2024-12-16",
  weekStart: "2024-12-16",
  weekEnd: "2024-12-22", 
  theme: "Reading Comprehension Focus",
  weeklyGoal: "Master advanced reading strategies and improve speed by 20%",
  overallProgress: 65,
  created: "2024-12-15T10:00:00Z",
  lastModified: "2024-12-20T08:30:00Z",
  dailyPlans: [
    {
      date: "2024-12-16",
      completed: true,
      progress: 100,
      dailyGoal: "Foundation building with vocabulary",
      sessions: [
        {
          id: "s1",
          title: "Advanced Vocabulary Set A",
          skillType: "vocabulary",
          timeSlot: "09:00-09:30",
          estimatedMinutes: 30,
          priority: "high",
          completed: true
        },
        {
          id: "s2", 
          title: "Grammar Review: Conditionals",
          skillType: "grammar",
          timeSlot: "14:00-14:45",
          estimatedMinutes: 45,
          priority: "medium",
          completed: true
        }
      ]
    },
    {
      date: "2024-12-17",
      completed: true,
      progress: 100,
      dailyGoal: "Reading speed improvement",
      sessions: [
        {
          id: "s3",
          title: "Speed Reading Practice",
          skillType: "reading", 
          timeSlot: "10:00-11:00",
          estimatedMinutes: 60,
          priority: "high",
          completed: true
        }
      ]
    },
    {
      date: "2024-12-18",
      completed: false,
      progress: 70,
      dailyGoal: "Comprehensive practice day",
      sessions: [
        {
          id: "s4",
          title: "Reading Comprehension",
          skillType: "reading",
          timeSlot: "09:30-10:30", 
          estimatedMinutes: 60,
          priority: "high",
          completed: true
        },
        {
          id: "s5",
          title: "Listening Practice",
          skillType: "listening",
          timeSlot: "15:00-15:40",
          estimatedMinutes: 40,
          priority: "medium",
          completed: false
        }
      ]
    }
  ]
};

const getSkillIcon = (skillType: string) => {
  switch (skillType) {
    case "vocabulary": return BookOpen;
    case "grammar": return PenTool;
    case "reading": return Brain;
    case "listening": return Headphones;
    default: return Circle;
  }
};

const getSkillColor = (skillType: string) => {
  switch (skillType) {
    case "vocabulary": return "text-blue-500";
    case "grammar": return "text-green-500";
    case "reading": return "text-purple-500";
    case "listening": return "text-orange-500";
    default: return "text-on-surface-variant";
  }
};

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const isToday = (dateStr: string) => {
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

interface WeeklyStudyPlanProps {
  onNavigateToTasks?: (subTab?: string) => void;
}

export function WeeklyStudyPlan({ onNavigateToTasks }: WeeklyStudyPlanProps) {
  const [plan] = useState<WeeklyStudyPlanType>(mockWeeklyPlan);
  
  // Get today's plan
  const today = new Date().toISOString().split('T')[0];
  const todaysPlan = plan.dailyPlans.find(dp => dp.date === today);
  
  // Get next 3 days including today
  const upcomingDays = plan.dailyPlans.slice(0, 3);
  
  return (
    <Card className="bg-plan-container border-outline">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary rounded-full">
              <Calendar size={14} className="text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-base text-plan-container-foreground">
                Weekly Study Plan
              </CardTitle>
              <p className="text-xs text-plan-container-foreground/70">
                {plan.theme}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {Math.round(plan.overallProgress)}%
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Overall Progress */}
        <div className="space-y-1">
          <Progress value={plan.overallProgress} className="h-2" />
          <p className="text-xs text-plan-container-foreground/70">
            Week Progress • {plan.dailyPlans.filter(dp => dp.completed).length}/{plan.dailyPlans.length} days
          </p>
        </div>

        {/* Today's Focus */}
        {todaysPlan && (
          <div className="p-2 bg-primary-container/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-primary-container-foreground">
                Today's Focus
              </h4>
              <Badge 
                variant={todaysPlan.completed ? "default" : "outline"} 
                className="text-xs"
              >
                {todaysPlan.progress}%
              </Badge>
            </div>
            <p className="text-xs text-primary-container-foreground/80 mb-2">
              {todaysPlan.dailyGoal}
            </p>
            
            {/* Today's Sessions */}
            <div className="space-y-1">
              {todaysPlan.sessions.slice(0, 2).map((session) => {
                const Icon = getSkillIcon(session.skillType);
                return (
                  <div key={session.id} className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-4 h-4">
                      {session.completed ? (
                        <CheckCircle2 className="w-3 h-3 text-success" />
                      ) : (
                        <Circle className="w-3 h-3 text-primary-container-foreground/50" />
                      )}
                    </div>
                    <Icon className={`w-3 h-3 ${getSkillColor(session.skillType)}`} />
                    <span className={`text-xs flex-1 ${
                      session.completed 
                        ? "line-through text-primary-container-foreground/60" 
                        : "text-primary-container-foreground"
                    }`}>
                      {session.title}
                    </span>
                    <span className="text-xs text-primary-container-foreground/60 flex items-center gap-1">
                      <Clock className="w-2 h-2" />
                      {session.timeSlot}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Week Overview */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-plan-container-foreground">This Week</h4>
          <div className="grid grid-cols-7 gap-1">
            {plan.dailyPlans.map((dayPlan) => {
              const dayName = getDayName(dayPlan.date);
              const todayClass = isToday(dayPlan.date);
              
              return (
                <div 
                  key={dayPlan.date}
                  className={`text-center p-1.5 rounded text-xs ${
                    todayClass 
                      ? "bg-primary text-primary-foreground" 
                      : dayPlan.completed
                        ? "bg-success/20 text-success"
                        : "bg-surface-variant text-on-surface-variant"
                  }`}
                >
                  <div className="font-medium">{dayName}</div>
                  <div className="text-xs mt-0.5">{dayPlan.progress}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => onNavigateToTasks?.("plan")}
          >
            View Full Week
          </Button>
          <Button 
            size="sm" 
            className="flex-1 text-xs"
            onClick={() => onNavigateToTasks?.("plan")}
          >
            <ChevronRight size={12} className="ml-1" />
            Modify Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}