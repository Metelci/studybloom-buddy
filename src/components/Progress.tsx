import { useState } from "react";
import { TrendingUp, Target, Clock, Award, BookOpen, Headphones, FileText, Sparkles, Brain, BarChart3, Calendar, Zap, Eye, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface SkillProgress {
  skill: string;
  icon: React.ReactNode;
  progress: number;
  level: string;
  pointsEarned: number;
  totalPoints: number;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  earned: boolean;
  date?: string;
}

export function Progress() {
  const [activeTab, setActiveTab] = useState("overview");
  const [analyticsTab, setAnalyticsTab] = useState("7days");

  const skillsProgress: SkillProgress[] = [
    {
      skill: "Grammar",
      icon: <FileText size={16} />,
      progress: 85,
      level: "Advanced",
      pointsEarned: 1250,
      totalPoints: 1500,
      color: "text-primary"
    },
    {
      skill: "Reading",
      icon: <BookOpen size={16} />,
      progress: 72,
      level: "Intermediate",
      pointsEarned: 980,
      totalPoints: 1350,
      color: "text-secondary"
    },
    {
      skill: "Listening",
      icon: <Headphones size={16} />,
      progress: 68,
      level: "Intermediate",
      pointsEarned: 890,
      totalPoints: 1300,
      color: "text-tertiary"
    },
    {
      skill: "Vocabulary",
      icon: <Sparkles size={16} />,
      progress: 91,
      level: "Expert",
      pointsEarned: 1420,
      totalPoints: 1550,
      color: "text-[hsl(263_67%_80%)]"
    }
  ];

  const achievements: Achievement[] = [
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first task",
      icon: <Target size={16} />,
      earned: true,
      date: "2024-01-15"
    },
    {
      id: "2",
      title: "Week Warrior",
      description: "Maintain 7-day streak",
      icon: <Award size={16} />,
      earned: true,
      date: "2024-02-03"
    },
    {
      id: "3",
      title: "Grammar Master",
      description: "Score 90% in grammar",
      icon: <FileText size={16} />,
      earned: false
    },
    {
      id: "4",
      title: "Speed Reader",
      description: "Read 50 articles",
      icon: <BookOpen size={16} />,
      earned: false
    }
  ];

  const overallProgress = Math.round(skillsProgress.reduce((sum, skill) => sum + skill.progress, 0) / skillsProgress.length);
  const totalPointsEarned = skillsProgress.reduce((sum, skill) => sum + skill.pointsEarned, 0);
  const earnedAchievements = achievements.filter(a => a.earned).length;

  return (
    <div className="pb-20 px-4 pt-4 max-w-md mx-auto space-y-3">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-tertiary/30 via-primary/25 to-secondary/20 rounded-2xl p-6 mb-4 overflow-hidden">
        <div className="absolute top-2 right-4 w-16 h-16 bg-tertiary/20 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-4 w-20 h-20 bg-primary/15 rounded-full blur-2xl" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-medium mb-3">
            <BarChart3 size={12} />
            Analytics Dashboard
          </div>
          <h1 className="text-2xl font-bold text-tertiary drop-shadow-sm mb-2">
            Your Progress 📊
          </h1>
          <p className="text-sm text-on-surface-variant/80">
            Track your journey to YDS success
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-3">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs">Awards</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs">AI Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-3 mt-0">
          {/* Overall Stats */}
          <div className="grid grid-cols-3 gap-2">
            <Card className="p-3 text-center bg-primary-container">
              <div className="text-lg font-bold text-primary-container-foreground">
                {overallProgress}%
              </div>
              <div className="text-xs text-primary-container-foreground/80">
                Overall
              </div>
            </Card>
            
            <Card className="p-3 text-center bg-secondary-container">
              <div className="text-lg font-bold text-secondary-container-foreground">
                {totalPointsEarned}
              </div>
              <div className="text-xs text-secondary-container-foreground/80">
                Points
              </div>
            </Card>
            
            <Card className="p-3 text-center bg-tertiary-container">
              <div className="text-lg font-bold text-tertiary-container-foreground">
                {earnedAchievements}
              </div>
              <div className="text-xs text-tertiary-container-foreground/80">
                Awards
              </div>
            </Card>
          </div>

          {/* Weekly Progress Chart */}
          <Card className="p-3">
            <CardHeader className="p-0 mb-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm text-card-foreground">Weekly Progress</h3>
                <TrendingUp size={14} className="text-primary" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                  const progress = [85, 92, 78, 95, 88, 0, 0][index];
                  return (
                    <div key={day} className="flex items-center gap-2">
                      <span className="text-xs text-card-foreground/80 w-8">{day}</span>
                      <div className="flex-1">
                        <ProgressBar value={progress} className="h-1.5" />
                      </div>
                      <span className="text-xs font-medium text-card-foreground w-8">
                        {progress}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Study Time */}
          <Card className="p-3 bg-card-elevated">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-primary rounded-full">
                <Clock size={14} className="text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-card-foreground">Study Time</h3>
                <p className="text-xs text-card-foreground/80">This week</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div>
                <div className="text-lg font-bold text-card-foreground">12h 30m</div>
                <div className="text-xs text-card-foreground/80">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-card-foreground">1h 47m</div>
                <div className="text-xs text-card-foreground/80">Daily Avg</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-2 mt-0">
          {skillsProgress.map((skill) => (
            <Card key={skill.skill} className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-full bg-surface-container ${skill.color}`}>
                  {skill.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm text-card-foreground">{skill.skill}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {skill.level}
                    </Badge>
                  </div>
                  <ProgressBar value={skill.progress} className="h-1.5 mb-1" />
                  <div className="flex justify-between text-xs text-card-foreground/80">
                    <span>{skill.pointsEarned}/{skill.totalPoints} points</span>
                    <span>{skill.progress}%</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-2 mt-0">
          <div className="grid gap-2">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id} 
                className={`p-3 ${achievement.earned ? 'bg-success-container' : 'bg-surface-container opacity-60'}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${
                    achievement.earned 
                      ? 'bg-success text-success-foreground' 
                      : 'bg-surface text-on-surface-variant'
                  }`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium text-sm ${
                      achievement.earned 
                        ? 'text-success-container-foreground' 
                        : 'text-on-surface-variant'
                    }`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-xs ${
                      achievement.earned 
                        ? 'text-success-container-foreground/80' 
                        : 'text-on-surface-variant/80'
                    }`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && achievement.date && (
                      <p className="text-xs text-success-container-foreground/60 mt-1">
                        Earned on {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-success text-success-foreground text-xs">
                      ✓
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-3 mt-0">
          <Tabs value={analyticsTab} onValueChange={setAnalyticsTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-3 text-xs">
              <TabsTrigger value="7days" className="text-[10px]">7D</TabsTrigger>
              <TabsTrigger value="30days" className="text-[10px]">30D</TabsTrigger>
              <TabsTrigger value="alltime" className="text-[10px]">All</TabsTrigger>
              <TabsTrigger value="performance" className="text-[10px]">Perf</TabsTrigger>
              <TabsTrigger value="insights" className="text-[10px]">AI</TabsTrigger>
            </TabsList>

            <TabsContent value="7days" className="space-y-3 mt-0">
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-primary rounded-full">
                    <Calendar size={14} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-medium text-sm text-card-foreground">Last 7 Days Analytics</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">87%</div>
                    <div className="text-xs text-card-foreground/80">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">42</div>
                    <div className="text-xs text-card-foreground/80">Tasks Done</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-card-foreground/80">Grammar</span>
                    <span className="font-medium text-card-foreground">+12%</span>
                  </div>
                  <ProgressBar value={85} className="h-1.5" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-card-foreground/80">Reading</span>
                    <span className="font-medium text-card-foreground">+8%</span>
                  </div>
                  <ProgressBar value={78} className="h-1.5" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-card-foreground/80">Listening</span>
                    <span className="font-medium text-card-foreground">+15%</span>
                  </div>
                  <ProgressBar value={92} className="h-1.5" />
                </div>
              </Card>

              <Card className="p-3 bg-success-container">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-success-container-foreground" />
                  <div>
                    <h4 className="font-medium text-sm text-success-container-foreground">Weekly Streak</h4>
                    <p className="text-xs text-success-container-foreground/80">You're on fire! 7 days in a row</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="30days" className="space-y-3 mt-0">
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-secondary rounded-full">
                    <BarChart3 size={14} className="text-secondary-foreground" />
                  </div>
                  <h3 className="font-medium text-sm text-card-foreground">30 Days Overview</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">84%</div>
                    <div className="text-xs text-card-foreground/80">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">156</div>
                    <div className="text-xs text-card-foreground/80">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-tertiary">28h</div>
                    <div className="text-xs text-card-foreground/80">Study Time</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-xs text-card-foreground">Monthly Progress</h4>
                  {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => {
                    const progress = [72, 81, 89, 94][index];
                    return (
                      <div key={week} className="flex items-center gap-2">
                        <span className="text-xs text-card-foreground/80 w-12">{week}</span>
                        <div className="flex-1">
                          <ProgressBar value={progress} className="h-1.5" />
                        </div>
                        <span className="text-xs font-medium text-card-foreground w-8">
                          {progress}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card className="p-3 bg-primary-container">
                <div className="flex items-center gap-2">
                  <Award size={14} className="text-primary-container-foreground" />
                  <div>
                    <h4 className="font-medium text-sm text-primary-container-foreground">Best Month Ever!</h4>
                    <p className="text-xs text-primary-container-foreground/80">18% improvement from last month</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="alltime" className="space-y-3 mt-0">
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-tertiary rounded-full">
                    <Clock size={14} className="text-tertiary-foreground" />
                  </div>
                  <h3 className="font-medium text-sm text-card-foreground">All Time Stats</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">82%</div>
                    <div className="text-xs text-card-foreground/80">Overall Avg</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">847</div>
                    <div className="text-xs text-card-foreground/80">Total Tasks</div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <h4 className="font-medium text-xs text-card-foreground">Learning Journey</h4>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div>
                      <div className="text-sm font-bold text-card-foreground">156h</div>
                      <div className="text-xs text-card-foreground/80">Study</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-card-foreground">23</div>
                      <div className="text-xs text-card-foreground/80">Streaks</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-card-foreground">89</div>
                      <div className="text-xs text-card-foreground/80">Days</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-card-foreground">12</div>
                      <div className="text-xs text-card-foreground/80">Levels</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-2 rounded-lg">
                  <div className="text-xs text-card-foreground/80 mb-1">Progress Milestones</div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-card-foreground">Started: Jan 15</span>
                    <span className="text-xs font-medium text-primary">89 days ago</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-3 mt-0">
              <Card className="p-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-primary rounded-full">
                    <Zap size={14} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-medium text-sm text-card-foreground">Performance Analysis</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-xs text-card-foreground mb-2">Strength Areas</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-card-foreground/80">Grammar Rules</span>
                        <Badge className="bg-success text-success-foreground text-xs">Strong</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-card-foreground/80">Vocabulary</span>
                        <Badge className="bg-success text-success-foreground text-xs">Excellent</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-xs text-card-foreground mb-2">Areas to Improve</h4>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-card-foreground/80">Reading Speed</span>
                        <Badge variant="destructive" className="text-xs">Focus</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-card-foreground/80">Complex Grammar</span>
                        <Badge className="bg-warning text-warning-foreground text-xs">Practice</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-xs text-card-foreground mb-2">Peak Performance Times</h4>
                    <div className="text-xs text-card-foreground/80">
                      <div>• Best: 2-4 PM (94% avg score)</div>
                      <div>• Good: 10-12 AM (88% avg score)</div>
                      <div>• Avoid: 6-8 PM (72% avg score)</div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-3 mt-0">
              <Card className="p-3 bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 bg-gradient-to-r from-primary to-secondary rounded-full">
                    <Brain size={14} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-medium text-sm text-card-foreground">AI Insights & Patterns</h3>
                </div>
                
                <div className="space-y-3">
                  <Card className="p-2 bg-primary-container/50">
                    <div className="flex items-start gap-2">
                      <Eye size={12} className="text-primary-container-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium text-xs text-primary-container-foreground">Learning Pattern Detected</h4>
                        <p className="text-xs text-primary-container-foreground/80">You perform 23% better on grammar tasks after vocabulary practice sessions.</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-2 bg-secondary-container/50">
                    <div className="flex items-start gap-2">
                      <TrendingUp size={12} className="text-secondary-container-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium text-xs text-secondary-container-foreground">Progress Acceleration</h4>
                        <p className="text-xs text-secondary-container-foreground/80">Your learning curve shows exponential improvement. Keep the current pace!</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-2 bg-warning-container/50">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={12} className="text-warning-container-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium text-xs text-warning-container-foreground">Optimization Tip</h4>
                        <p className="text-xs text-warning-container-foreground/80">Consider 15-minute breaks between reading sessions for 18% better retention.</p>
                      </div>
                    </div>
                  </Card>

                  <div className="mt-3">
                    <h4 className="font-medium text-xs text-card-foreground mb-2">Predicted Exam Readiness</h4>
                    <div className="bg-success-container/30 p-2 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-success-container-foreground">Current Trajectory</span>
                        <span className="font-bold text-sm text-success-container-foreground">89%</span>
                      </div>
                      <ProgressBar value={89} className="h-1.5 mb-1" />
                      <p className="text-xs text-success-container-foreground/80">Ready for exam in ~3 weeks at current pace</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );
}