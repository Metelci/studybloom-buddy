import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useNativeFeatures } from "@/hooks/useNativeFeatures";
import { nativeStorage } from "@/utils/nativeStorage";
import { toast } from "sonner";
import { StudyPlanCreator } from "./StudyPlanCreator";
import { 
  BookOpen,
  Brain,
  Headphones,
  PenTool,
  Clock,
  Star,
  CheckCircle2,
  Circle,
  Lock,
  Zap,
  Target,
  Trophy,
  Calendar,
  TrendingUp,
  Bell
} from "lucide-react";

// Initial task categories - progress will be tracked as users complete tasks
const taskCategories = [
  {
    id: "vocabulary",
    name: "Vocabulary",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    progress: 0,
    dailyTarget: 50,
    completed: 0
  },
  {
    id: "grammar",
    name: "Grammar", 
    icon: PenTool,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    progress: 0,
    dailyTarget: 30,
    completed: 0
  },
  {
    id: "reading",
    name: "Reading",
    icon: Brain,
    color: "text-purple-500", 
    bgColor: "bg-purple-500/10",
    progress: 0,
    dailyTarget: 20,
    completed: 0
  },
  {
    id: "listening",
    name: "Listening",
    icon: Headphones,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10", 
    progress: 0,
    dailyTarget: 25,
    completed: 0
  }
];

const dailyTasks = [
  // Daily tasks will be generated based on user's study plan and progress
];

const weeklyGoals = [
  // Weekly goals will be set by users based on their study preferences
];

// Helper function to get today's day name
const getTodayDayName = () => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[new Date().getDay()];
};

// Helper function to generate daily tasks from study plan
const generateDailyTasks = (studyPlan: any) => {
  if (!studyPlan?.schedule) return [];
  
  const today = getTodayDayName();
  const todaySchedule = studyPlan.schedule.find((day: any) => day.day === today);
  
  if (!todaySchedule?.sessions) return [];
  
  return todaySchedule.sessions.map((session: any, index: number) => ({
    id: `session-${index}`,
    title: session.title,
    category: session.skill || session.type,
    difficulty: "medium",
    timeEstimate: `${session.duration} min`,
    points: Math.round(session.duration / 5) * 10, // 10 points per 5 minutes
    completed: session.completed || false,
    locked: false,
    streak: 0,
    source: session.source,
    type: session.type,
    duration: session.duration,
    description: getTaskDescription(session.type, session.title)
  }));
};

// Helper function to get task descriptions
const getTaskDescription = (type: string, title: string) => {
  switch (type) {
    case 'grammar':
      return `Study and practice ${title.replace('Grammar: ', '')} with exercises and examples. Focus on understanding the rules and applying them in context.`;
    case 'vocabulary':
      return `Learn new academic vocabulary words, their meanings, usage, and practice using them in sentences. Build your word bank systematically.`;
    case 'reading':
      return `Practice reading comprehension with academic texts. Focus on understanding main ideas, supporting details, and inference skills.`;
    case 'listening':
      return `Improve your listening skills with academic lectures and conversations. Practice note-taking and identifying key information.`;
    default:
      return `Complete this study session focusing on ${title}. Take your time and practice actively.`;
  }
};

// Helper function to generate weekly goals from study plan  
const generateWeeklyGoals = (studyPlan: any) => {
  if (!studyPlan?.schedule) return [];
  
  const focusAreas = studyPlan.focusAreas || [];
  const totalSessions = studyPlan.schedule.reduce((total: number, day: any) => 
    total + (day.sessions?.length || 0), 0);
  
  return focusAreas.map((area: string, index: number) => ({
    id: `goal-${index}`,
    title: `${area.charAt(0).toUpperCase() + area.slice(1)} Mastery`,
    target: Math.ceil(totalSessions / focusAreas.length),
    current: 0,
    progress: 0,
    reward: `+${50 + index * 25} XP`
  }));
};

interface TasksProps {
  initialTab?: string;
}

export function Tasks({ initialTab = "daily" }: TasksProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [weeklyGoal, setWeeklyGoal] = useState([15]);
  const [savedWeeklyGoal, setSavedWeeklyGoal] = useState([15]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showStudyPlanCreator, setShowStudyPlanCreator] = useState(false);
  const [studyPlan, setStudyPlan] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const { scheduleStudyReminder, scheduleStreakReminder, isNative } = useNativeFeatures();

  // Load saved study plan and weekly goal on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load study plan
        const savedPlan = await nativeStorage.getItem<string>('study_plan');
        if (savedPlan) {
          const parsedPlan = JSON.parse(savedPlan);
          setStudyPlan(parsedPlan);
          // Set weekly goal based on study plan
          if (parsedPlan.hoursPerWeek) {
            setWeeklyGoal([parsedPlan.hoursPerWeek]);
            setSavedWeeklyGoal([parsedPlan.hoursPerWeek]);
          }
        }
        
        // Load saved weekly goal
        const saved = await nativeStorage.getItem<number>('weeklyStudyGoal');
        if (saved && !savedPlan) {
          setWeeklyGoal([saved]);
          setSavedWeeklyGoal([saved]);
        }
      } catch (error) {
        console.log('No saved data found');
      }
    };
    loadData();
  }, []);

  // Check for unsaved changes
  useEffect(() => {
    setHasUnsavedChanges(weeklyGoal[0] !== savedWeeklyGoal[0]);
  }, [weeklyGoal, savedWeeklyGoal]);

  const handleSaveWeeklyGoal = async () => {
    try {
      await nativeStorage.setItem('weeklyStudyGoal', weeklyGoal[0]);
      setSavedWeeklyGoal([...weeklyGoal]);
      setHasUnsavedChanges(false);
      toast.success("Weekly goal saved successfully!");
    } catch (error) {
      toast.error("Failed to save weekly goal");
    }
  };

  const handleCancelWeeklyGoal = () => {
    setWeeklyGoal([...savedWeeklyGoal]);
    setHasUnsavedChanges(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500/20 text-green-700 border-green-500/30";
      case "medium": return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "hard": return "bg-red-500/20 text-red-700 border-red-500/30";
      default: return "bg-surface-variant text-on-surface-variant";
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = taskCategories.find(c => c.id === categoryId);
    return category ? category.icon : Circle;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = taskCategories.find(c => c.id === categoryId);
    return category ? category.color : "text-on-surface-variant";
  };

  const filteredTasks = selectedCategory === "all" 
    ? (studyPlan ? generateDailyTasks(studyPlan) : dailyTasks)
    : (studyPlan ? generateDailyTasks(studyPlan) : dailyTasks).filter(task => task.category === selectedCategory);

  const currentWeeklyGoals = studyPlan ? generateWeeklyGoals(studyPlan) : weeklyGoals;

  const handleScheduleReminder = async (task: any) => {
    if (isNative) {
      // Schedule for 1 hour from now as example
      const reminderTime = new Date();
      reminderTime.setHours(reminderTime.getHours() + 1);
      
      await scheduleStudyReminder(task.title, reminderTime);
      toast.success("Study reminder scheduled!");
    } else {
      toast.info("Install the mobile app to receive notifications");
    }
  };

  const handleCreateStudyPlan = () => {
    setShowStudyPlanCreator(true);
  };

  const handlePlanCreated = (newPlan: any) => {
    setStudyPlan(newPlan);
    // Store in native storage
    nativeStorage.setItem('study_plan', JSON.stringify(newPlan));
    // Update weekly goal to match study plan
    if (newPlan.hoursPerWeek) {
      setWeeklyGoal([newPlan.hoursPerWeek]);
      setSavedWeeklyGoal([newPlan.hoursPerWeek]);
    }
    setShowStudyPlanCreator(false);
  };

  const handleStartTask = (task: any) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const handleCompleteTask = (taskId: string) => {
    // Mark task as completed in the study plan sessions
    if (studyPlan) {
      const today = getTodayDayName();
      const updatedPlan = { ...studyPlan };
      const todaySchedule = updatedPlan.schedule.find((day: any) => day.day === today);
      
      if (todaySchedule && todaySchedule.sessions) {
        const sessionIndex = todaySchedule.sessions.findIndex((session: any, index: number) => 
          `session-${index}` === taskId
        );
        
        if (sessionIndex !== -1) {
          todaySchedule.sessions[sessionIndex].completed = true;
          setStudyPlan(updatedPlan);
          nativeStorage.setItem('study_plan', JSON.stringify(updatedPlan));
          toast.success("Task completed! Great job! 🎉");
        }
      }
    }
    setShowTaskDetail(false);
    setSelectedTask(null);
  };

  return (
    <div className="p-4 pb-20 max-w-md mx-auto min-h-screen bg-background">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-primary/55 via-secondary/45 to-tertiary/50 rounded-2xl p-5 mb-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/40 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-tertiary/35 rounded-full blur-xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-primary" />
              <h1 className="text-xl font-bold text-slate-900 drop-shadow-md" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
                Daily Tasks
              </h1>
            </div>
            <p className="text-xs text-slate-800 drop-shadow-sm" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.6)'}}>
              Complete tasks to build your streak
            </p>
          </div>
          <div className="text-right">
            <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground gap-1.5 px-3 py-1">
              <Zap className="w-4 h-4" />
              0 XP
            </Badge>
          </div>
        </div>
      </div>

      {/* Weekly Study Goal - Compact */}
      <Card className={`mb-4 transition-all ${hasUnsavedChanges ? 'bg-warning/5 border-warning/20' : 'bg-tertiary-container/20'}`}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-tertiary" />
              <span className="text-sm font-medium text-on-surface">Weekly Goal</span>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/30">
                  Unsaved
                </Badge>
              )}
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-tertiary">{weeklyGoal[0]}h</span>
              <p className="text-xs text-on-surface-variant">
                ~{Math.round(weeklyGoal[0] / 7 * 10) / 10}h daily
              </p>
            </div>
          </div>
          <Slider
            value={weeklyGoal}
            onValueChange={setWeeklyGoal}
            max={35}
            min={3}
            step={1}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-xs text-on-surface-variant mb-3">
            <span>3h (Casual)</span>
            <span>15h (Balanced)</span>
            <span>35h (Intensive)</span>
          </div>
          
          {hasUnsavedChanges && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancelWeeklyGoal}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveWeeklyGoal}
                className="flex-1"
              >
                Save Goal
              </Button>
            </div>
          )}
          
          {!hasUnsavedChanges && (
            <div className="text-center">
              <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20">
                Goal Saved: {savedWeeklyGoal[0]}h/week
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="daily" className="text-xs">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs">Weekly</TabsTrigger>
          <TabsTrigger value="plan" className="text-xs">Plan</TabsTrigger>
          <TabsTrigger value="custom" className="text-xs">Custom</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4 mt-0">
          {/* Category Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {taskCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${category.bgColor}`}>
                          <Icon className={`w-4 h-4 ${category.color}`} />
                        </div>
                        <span className="text-sm font-medium text-on-surface">{category.name}</span>
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        {category.completed}/{category.dailyTarget}
                      </span>
                    </div>
                    <Progress value={category.progress} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
              className="shrink-0"
            >
              All Tasks
            </Button>
            {taskCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="shrink-0 gap-1.5"
                >
                  <Icon className="w-3 h-3" />
                  {category.name}
                </Button>
              );
            })}
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={32} className="text-primary" />
                </div>
                <h4 className="text-base font-semibold text-on-surface mb-2">No Tasks Yet</h4>
                <p className="text-sm text-on-surface-variant mb-4">
                  {studyPlan 
                    ? `No sessions scheduled for ${getTodayDayName()}. Check your weekly plan or create a new one.`
                    : "Your personalized daily tasks will appear here once you set up your study plan."
                  }
                </p>
                <Button variant="outline" size="sm" onClick={handleCreateStudyPlan}>
                  Create Study Plan
                </Button>
              </div>
            ) : (
              filteredTasks.map((task) => {
                const CategoryIcon = getCategoryIcon(task.category);
                return (
                  <Card 
                    key={task.id} 
                    className={`transition-all ${
                      task.locked 
                        ? "opacity-50 bg-surface-variant/30" 
                        : task.completed 
                          ? "bg-success/10 border-success/20" 
                          : "hover:bg-surface-variant/50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="flex items-center justify-center w-6 h-6 mt-0.5">
                            {task.locked ? (
                              <Lock className="w-4 h-4 text-on-surface-variant" />
                            ) : task.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            ) : (
                              <Circle className="w-5 h-5 text-on-surface-variant" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium mb-1 ${
                              task.completed ? "line-through text-on-surface-variant" : "text-on-surface"
                            }`}>
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2 mb-2">
                              <CategoryIcon className={`w-3 h-3 ${getCategoryColor(task.category)}`} />
                              <Badge variant="outline" className={`text-xs border ${getDifficultyColor(task.difficulty)}`}>
                                {task.difficulty}
                              </Badge>
                              {task.streak > 0 && (
                                <Badge variant="secondary" className="text-xs gap-1">
                                  <Star className="w-3 h-3" />
                                  {task.streak}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {task.timeEstimate}
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="w-3 h-3" />
                                {task.points} XP
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {!task.locked && (
                        <div className="flex gap-2">
                          <Button 
                            variant={task.completed ? "outline" : "default"} 
                            size="sm" 
                            className="flex-1"
                            disabled={task.completed}
                            onClick={() => task.completed ? null : handleStartTask(task)}
                          >
                            {task.completed ? "Completed" : "Start Task"}
                          </Button>
                          {!task.completed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleScheduleReminder(task)}
                              className="shrink-0"
                            >
                              <Bell className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            )}
            
            {filteredTasks.length > 3 && (
              <Button 
                variant="ghost" 
                className="w-full text-primary hover:bg-primary-container"
              >
                View All Tasks ({filteredTasks.length - 3} more)
              </Button>
            )}
          </div>
        </TabsContent>

        <TabsContent value="weekly" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Weekly Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentWeeklyGoals.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-primary/50" />
                  <h4 className="text-sm font-medium text-on-surface mb-1">No Weekly Goals</h4>
                  <p className="text-xs text-on-surface-variant">Create a study plan to set up your weekly goals automatically.</p>
                </div>
              ) : (
                currentWeeklyGoals.map((goal, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-on-surface mb-1">{goal.title}</p>
                        <p className="text-xs text-on-surface-variant">Reward: {goal.reward}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {goal.current}/{goal.target}
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <p className="text-xs text-on-surface-variant text-right">{goal.progress}% Complete</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-success" />
                <p className="text-lg font-bold text-on-surface">0%</p>
                <p className="text-xs text-on-surface-variant">Avg. Weekly Score</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-warning" />
                <p className="text-lg font-bold text-on-surface">0</p>
                <p className="text-xs text-on-surface-variant">Goals Completed</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4 mt-0">
          {studyPlan ? (
            <>
              {/* Display the created study plan */}
              <Card className="bg-plan-container">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-plan-container-foreground">
                    <Calendar className="w-4 h-4 text-primary" />
                    This Week's Study Plan
                  </CardTitle>
                  <p className="text-xs text-plan-container-foreground/70 mt-1">{studyPlan.focus}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Week Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-plan-container-foreground">Week Progress</span>
                      <span className="text-plan-container-foreground/70">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>

                  {/* Weekly Schedule */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-plan-container-foreground">Weekly Schedule</h4>
                    <div className="space-y-2 text-xs text-plan-container-foreground/70">
                      {studyPlan.schedule?.map((day: any, index: number) => (
                        <div key={index} className="p-2 bg-surface-variant/20 rounded">
                          <strong>{day.day}:</strong> {day.sessions?.map((session: any) => session.title).join(', ') || 'No sessions'}
                        </div>
                      ))}
                      <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                        <p className="text-xs text-plan-container-foreground/80">
                          <strong>Recommended Book:</strong> {studyPlan.recommendedBook?.title || studyPlan.recommendedBook}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Management */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Plan Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="h-16 flex-col gap-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-xs">Modify<br/>This Week</span>
                    </Button>
                    <Button variant="outline" className="h-16 flex-col gap-1" onClick={handleCreateStudyPlan}>
                      <Target className="w-4 h-4 text-secondary" />
                      <span className="text-xs">Create New<br/>Plan</span>
                    </Button>
                  </div>
                  
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">View Planning Analytics</span>
                  </Button>
                </CardContent>
              </Card>
            </>
          ) : (
            /* Empty state - no plan created yet */
            <Card className="bg-plan-container">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2 text-plan-container-foreground">
                  <Calendar className="w-4 h-4 text-primary" />
                  Study Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar size={32} className="text-primary" />
                  </div>
                  <h4 className="text-base font-semibold text-plan-container-foreground mb-2">No Study Plan Yet</h4>
                  <p className="text-sm text-plan-container-foreground/70 mb-6">
                    Create a personalized weekly study plan based on your time commitment and learning goals. Get recommendations from Raymond Murphy's grammar books.
                  </p>
                  <Button onClick={handleCreateStudyPlan} className="w-full">
                    Create Study Plan
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 mt-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Custom Practice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-3">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span>Create Vocabulary Set</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <PenTool className="w-4 h-4 text-green-500" />
                <span>Grammar Focus Session</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Brain className="w-4 h-4 text-purple-500" />
                <span>Timed Reading Practice</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <Headphones className="w-4 h-4 text-orange-500" />
                <span>Listening Comprehension</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Practice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="ghost" className="w-full justify-between">
                <span>5-Minute Vocabulary Boost</span>
                <Badge variant="secondary">25 XP</Badge>
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                <span>Grammar Speed Test</span>
                <Badge variant="secondary">30 XP</Badge>
              </Button>
              <Button variant="ghost" className="w-full justify-between">
                <span>Word Association Game</span>
                <Badge variant="secondary">20 XP</Badge>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Study Plan Creator Modal */}
      {showStudyPlanCreator && (
        <StudyPlanCreator 
          onClose={() => setShowStudyPlanCreator(false)}
          onPlanCreated={handlePlanCreated}
        />
      )}

      {/* Task Detail Modal */}
      {showTaskDetail && selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-background border-outline max-h-[90vh] overflow-y-auto">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    selectedTask.category === 'grammar' ? 'bg-green-500/10 text-green-500' :
                    selectedTask.category === 'vocabulary' ? 'bg-blue-500/10 text-blue-500' :
                    selectedTask.category === 'reading' ? 'bg-purple-500/10 text-purple-500' :
                    selectedTask.category === 'listening' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-primary/10 text-primary'
                  }`}>
                    {selectedTask.category === 'grammar' && <PenTool size={16} />}
                    {selectedTask.category === 'vocabulary' && <BookOpen size={16} />}
                    {selectedTask.category === 'reading' && <Brain size={16} />}
                    {selectedTask.category === 'listening' && <Headphones size={16} />}
                    {!['grammar', 'vocabulary', 'reading', 'listening'].includes(selectedTask.category) && <Target size={16} />}
                  </div>
                  <div>
                    <CardTitle className="text-base text-on-surface">{selectedTask.title}</CardTitle>
                    <p className="text-xs text-on-surface-variant">{selectedTask.source}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowTaskDetail(false)}
                  className="h-8 w-8 p-0"
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Task Info */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-on-surface-variant" />
                  <span className="text-on-surface-variant">{selectedTask.timeEstimate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-warning" />
                  <span className="text-on-surface-variant">{selectedTask.points} XP</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {selectedTask.difficulty}
                </Badge>
              </div>

              {/* Task Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-on-surface">What you'll do:</h4>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  {selectedTask.description}
                </p>
              </div>

              {/* Study Tips */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-on-surface">Study Tips:</h4>
                <div className="space-y-1 text-xs text-on-surface-variant">
                  {selectedTask.category === 'grammar' && (
                    <>
                      <div>• Read the theory and examples carefully</div>
                      <div>• Practice with the exercises provided</div>
                      <div>• Take notes on key rules and exceptions</div>
                    </>
                  )}
                  {selectedTask.category === 'vocabulary' && (
                    <>
                      <div>• Use new words in example sentences</div>
                      <div>• Focus on word families and collocations</div>
                      <div>• Practice pronunciation of new words</div>
                    </>
                  )}
                  {selectedTask.category === 'reading' && (
                    <>
                      <div>• Skim first, then read carefully</div>
                      <div>• Identify main ideas and supporting details</div>
                      <div>• Take notes on key vocabulary</div>
                    </>
                  )}
                  {selectedTask.category === 'listening' && (
                    <>
                      <div>• Listen once for general understanding</div>
                      <div>• Listen again taking detailed notes</div>
                      <div>• Focus on key information and transitions</div>
                    </>
                  )}
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="space-y-3 pt-2 border-t border-outline-variant">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface">Ready to complete this task?</span>
                  <span className="text-xs text-on-surface-variant">+{selectedTask.points} XP</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowTaskDetail(false)}
                  >
                    Study Later
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleCompleteTask(selectedTask.id)}
                  >
                    Mark Complete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}