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

interface TasksProps {
  initialTab?: string;
}

export function Tasks({ initialTab = "daily" }: TasksProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [weeklyGoal, setWeeklyGoal] = useState([15]);
  const [savedWeeklyGoal, setSavedWeeklyGoal] = useState([15]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { scheduleStudyReminder, scheduleStreakReminder, isNative } = useNativeFeatures();

  // Load saved weekly goal on component mount
  useEffect(() => {
    const loadWeeklyGoal = async () => {
      try {
        const saved = await nativeStorage.getItem<number>('weeklyStudyGoal');
        if (saved) {
          setWeeklyGoal([saved]);
          setSavedWeeklyGoal([saved]);
        }
      } catch (error) {
        console.log('No saved weekly goal found');
      }
    };
    loadWeeklyGoal();
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
    ? dailyTasks 
    : dailyTasks.filter(task => task.category === selectedCategory);

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
            {dailyTasks.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target size={32} className="text-primary" />
                </div>
                <h4 className="text-base font-semibold text-on-surface mb-2">No Tasks Yet</h4>
                <p className="text-sm text-on-surface-variant mb-4">
                  Your personalized daily tasks will appear here once you set up your study plan.
                </p>
                <Button variant="outline" size="sm">
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
              {weeklyGoals.map((goal, index) => (
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
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Card className="text-center">
              <CardContent className="p-4">
                <TrendingUp className="w-6 h-6 mx-auto mb-2 text-success" />
                <p className="text-lg font-bold text-on-surface">85%</p>
                <p className="text-xs text-on-surface-variant">Avg. Weekly Score</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <Trophy className="w-6 h-6 mx-auto mb-2 text-warning" />
                <p className="text-lg font-bold text-on-surface">12</p>
                <p className="text-xs text-on-surface-variant">Goals Completed</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plan" className="space-y-4 mt-0">
          {/* Current Week's Detailed Plan */}
          <Card className="bg-plan-container">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2 text-plan-container-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                This Week's Study Plan
              </CardTitle>
              <p className="text-xs text-plan-container-foreground/70 mt-1">Reading Comprehension Focus</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Week Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-plan-container-foreground">Week Progress</span>
                  <span className="text-plan-container-foreground/70">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              {/* Daily Schedule */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-plan-container-foreground">Daily Schedule</h4>
                
                {/* Monday */}
                <div className="border rounded-lg p-3 bg-success/5 border-success/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium text-plan-container-foreground">Monday, Dec 16</h5>
                      <Badge variant="secondary" className="text-xs bg-success/20 text-success">Completed</Badge>
                    </div>
                    <span className="text-xs text-plan-container-foreground/70">100%</span>
                  </div>
                  <p className="text-xs text-plan-container-foreground/70 mb-2">Foundation building with vocabulary</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <BookOpen className="w-3 h-3 text-blue-500" />
                      <span className="flex-1 line-through text-plan-container-foreground/60">Advanced Vocabulary Set A</span>
                      <span className="text-plan-container-foreground/70">09:00-09:30</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <PenTool className="w-3 h-3 text-green-500" />
                      <span className="flex-1 line-through text-plan-container-foreground/60">Grammar Review: Conditionals</span>
                      <span className="text-plan-container-foreground/70">14:00-14:45</span>
                    </div>
                  </div>
                </div>

                {/* Tuesday */}
                <div className="border rounded-lg p-3 bg-success/5 border-success/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium text-plan-container-foreground">Tuesday, Dec 17</h5>
                      <Badge variant="secondary" className="text-xs bg-success/20 text-success">Completed</Badge>
                    </div>
                    <span className="text-xs text-plan-container-foreground/70">100%</span>
                  </div>
                  <p className="text-xs text-plan-container-foreground/70 mb-2">Reading speed improvement</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <Brain className="w-3 h-3 text-purple-500" />
                      <span className="flex-1 line-through text-plan-container-foreground/60">Speed Reading Practice</span>
                      <span className="text-plan-container-foreground/70">10:00-11:00</span>
                    </div>
                  </div>
                </div>

                {/* Wednesday - Today */}
                <div className="border rounded-lg p-3 bg-primary-container/20 border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium text-plan-container-foreground">Wednesday, Dec 18 (Today)</h5>
                      <Badge variant="outline" className="text-xs">In Progress</Badge>
                    </div>
                    <span className="text-xs text-plan-container-foreground/70">70%</span>
                  </div>
                  <p className="text-xs text-plan-container-foreground/70 mb-2">Comprehensive practice day</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <Brain className="w-3 h-3 text-purple-500" />
                      <span className="flex-1 line-through text-plan-container-foreground/60">Reading Comprehension</span>
                      <span className="text-plan-container-foreground/70">09:30-10:30</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Circle className="w-3 h-3 text-on-surface-variant" />
                      <Headphones className="w-3 h-3 text-orange-500" />
                      <span className="flex-1 text-plan-container-foreground">Listening Practice</span>
                      <span className="text-plan-container-foreground/70">15:00-15:40</span>
                    </div>
                  </div>
                </div>

                {/* Thursday - Friday - Weekend Preview */}
                <div className="border rounded-lg p-3 bg-surface-variant/20">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-plan-container-foreground">Upcoming Days</h5>
                    <Badge variant="outline" className="text-xs">Planned</Badge>
                  </div>
                  <div className="space-y-1 text-xs text-plan-container-foreground/70">
                    <div>Thu: Grammar deep dive + Vocabulary expansion</div>
                    <div>Fri: Mixed practice + Mock test preparation</div>
                    <div>Weekend: Review week + Prep next week's plan</div>
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
                <Button variant="outline" className="h-16 flex-col gap-1">
                  <Target className="w-4 h-4 text-secondary" />
                  <span className="text-xs">Generate<br/>Next Week</span>
                </Button>
              </div>
              
              <Button variant="ghost" className="w-full justify-start gap-3">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm">View Planning Analytics</span>
              </Button>
            </CardContent>
          </Card>
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
    </div>
  );
}