export interface StudySession {
  id: string;
  title: string;
  skillType: "vocabulary" | "grammar" | "reading" | "listening";
  timeSlot: string; // "09:00-10:00"
  estimatedMinutes: number;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export interface DailyPlan {
  date: string; // "2024-12-20"
  sessions: StudySession[];
  dailyGoal: string;
  completed: boolean;
  progress: number; // 0-100
}

export interface WeeklyStudyPlan {
  id: string;
  weekStart: string; // "2024-12-16" (Monday)
  weekEnd: string; // "2024-12-22" (Sunday)
  theme: string; // "Reading Comprehension Focus"
  dailyPlans: DailyPlan[];
  weeklyGoal: string;
  overallProgress: number; // 0-100
  created: string;
  lastModified: string;
}