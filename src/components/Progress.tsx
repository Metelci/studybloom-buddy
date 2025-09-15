import { useState } from "react";
import { TrendingUp, Target, Clock, Award, BookOpen, Headphones, FileText, Sparkles } from "lucide-react";
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
      <div className="text-center mb-3">
        <h1 className="text-xl font-bold text-on-surface mb-1">
          Your Progress 📊
        </h1>
        <p className="text-sm text-on-surface-variant">
          Track your YDS exam preparation
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-3">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs">Awards</TabsTrigger>
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
      </Tabs>
    </div>
  );
}