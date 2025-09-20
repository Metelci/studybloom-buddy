import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
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
  TrendingUp
} from "lucide-react";

// Mock data for tasks
const taskCategories = [
  {
    id: "vocabulary",
    name: "Vocabulary",
    icon: BookOpen,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    progress: 75,
    dailyTarget: 50,
    completed: 38
  },
  {
    id: "grammar",
    name: "Grammar", 
    icon: PenTool,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    progress: 60,
    dailyTarget: 30,
    completed: 18
  },
  {
    id: "reading",
    name: "Reading",
    icon: Brain,
    color: "text-purple-500", 
    bgColor: "bg-purple-500/10",
    progress: 45,
    dailyTarget: 20,
    completed: 9
  },
  {
    id: "listening",
    name: "Listening",
    icon: Headphones,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10", 
    progress: 85,
    dailyTarget: 25,
    completed: 21
  }
];

const dailyTasks = [
  {
    id: 1,
    title: "Learn 20 New Words",
    category: "vocabulary",
    difficulty: "easy",
    points: 50,
    timeEstimate: "15 min",
    completed: true,
    streak: 5
  },
  {
    id: 2, 
    title: "Complete Grammar Quiz",
    category: "grammar",
    difficulty: "medium",
    points: 75,
    timeEstimate: "20 min",
    completed: true,
    streak: 3
  },
  {
    id: 3,
    title: "Reading Comprehension",
    category: "reading", 
    difficulty: "hard",
    points: 100,
    timeEstimate: "30 min",
    completed: false,
    streak: 0,
    locked: false
  },
  {
    id: 4,
    title: "Listening Practice",
    category: "listening",
    difficulty: "medium", 
    points: 80,
    timeEstimate: "25 min",
    completed: false,
    streak: 0,
    locked: false
  },
  {
    id: 5,
    title: "Advanced Vocabulary",
    category: "vocabulary",
    difficulty: "hard",
    points: 120,
    timeEstimate: "35 min", 
    completed: false,
    streak: 0,
    locked: true
  }
];

const weeklyGoals = [
  {
    title: "Complete 50 Vocabulary Tasks",
    progress: 68,
    current: 34,
    target: 50,
    reward: "200 XP + Badge"
  },
  {
    title: "Maintain 7-Day Streak",
    progress: 71,
    current: 5,
    target: 7,
    reward: "Streak Master Badge"
  },
  {
    title: "Score 80%+ on All Quizzes",
    progress: 45,
    current: 9,
    target: 20,
    reward: "Perfectionist Title"
  }
];

interface TasksProps {
  initialTab?: string;
}

export function Tasks({ initialTab = "daily" }: TasksProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCategory, setSelectedCategory] = useState("all");

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

  return (
    <div className="p-4 pb-20 max-w-md mx-auto min-h-screen bg-background">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-on-surface">Tasks</h1>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Zap className="w-3 h-3" />
            1,250 XP
          </Badge>
        </div>
      </div>

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
            {filteredTasks.map((task) => {
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
                      <Button 
                        variant={task.completed ? "outline" : "default"} 
                        size="sm" 
                        className="w-full"
                        disabled={task.completed}
                      >
                        {task.completed ? "Completed" : "Start Task"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
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
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                This Week's Study Plan
              </CardTitle>
              <p className="text-xs text-on-surface-variant mt-1">Reading Comprehension Focus</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Week Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface">Week Progress</span>
                  <span className="text-on-surface-variant">65%</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>

              {/* Daily Schedule */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-on-surface">Daily Schedule</h4>
                
                {/* Monday */}
                <div className="border rounded-lg p-3 bg-success/5 border-success/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium text-on-surface">Monday, Dec 16</h5>
                      <Badge variant="secondary" className="text-xs bg-success/20 text-success">Completed</Badge>
                    </div>
                    <span className="text-xs text-on-surface-variant">100%</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-2">Foundation building with vocabulary</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <BookOpen className="w-3 h-3 text-blue-500" />
                      <span className="flex-1 line-through text-on-surface-variant">Advanced Vocabulary Set A</span>
                      <span className="text-on-surface-variant">09:00-09:30</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <PenTool className="w-3 h-3 text-green-500" />
                      <span className="flex-1 line-through text-on-surface-variant">Grammar Review: Conditionals</span>
                      <span className="text-on-surface-variant">14:00-14:45</span>
                    </div>
                  </div>
                </div>

                {/* Tuesday */}
                <div className="border rounded-lg p-3 bg-success/5 border-success/20">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium text-on-surface">Tuesday, Dec 17</h5>
                      <Badge variant="secondary" className="text-xs bg-success/20 text-success">Completed</Badge>
                    </div>
                    <span className="text-xs text-on-surface-variant">100%</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-2">Reading speed improvement</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <Brain className="w-3 h-3 text-purple-500" />
                      <span className="flex-1 line-through text-on-surface-variant">Speed Reading Practice</span>
                      <span className="text-on-surface-variant">10:00-11:00</span>
                    </div>
                  </div>
                </div>

                {/* Wednesday - Today */}
                <div className="border rounded-lg p-3 bg-primary-container/20 border-primary/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-medium text-on-surface">Wednesday, Dec 18 (Today)</h5>
                      <Badge variant="outline" className="text-xs">In Progress</Badge>
                    </div>
                    <span className="text-xs text-on-surface-variant">70%</span>
                  </div>
                  <p className="text-xs text-on-surface-variant mb-2">Comprehensive practice day</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <CheckCircle2 className="w-3 h-3 text-success" />
                      <Brain className="w-3 h-3 text-purple-500" />
                      <span className="flex-1 line-through text-on-surface-variant">Reading Comprehension</span>
                      <span className="text-on-surface-variant">09:30-10:30</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Circle className="w-3 h-3 text-on-surface-variant" />
                      <Headphones className="w-3 h-3 text-orange-500" />
                      <span className="flex-1 text-on-surface">Listening Practice</span>
                      <span className="text-on-surface-variant">15:00-15:40</span>
                    </div>
                  </div>
                </div>

                {/* Thursday - Friday - Weekend Preview */}
                <div className="border rounded-lg p-3 bg-surface-variant/20">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-on-surface">Upcoming Days</h5>
                    <Badge variant="outline" className="text-xs">Planned</Badge>
                  </div>
                  <div className="space-y-1 text-xs text-on-surface-variant">
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