import { useState } from "react";
import { TrendingUp, Target, Clock, Award, BookOpen, Headphones, FileText, Sparkles, Brain, BarChart3, Calendar, Zap, Eye, AlertCircle, Trophy, Crown, Medal, Star, Gem } from "lucide-react";
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
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

export function Progress() {
  const [activeTab, setActiveTab] = useState("overview");
  const [analyticsTab, setAnalyticsTab] = useState("7days");

  const skillsProgress: SkillProgress[] = [
    {
      skill: "Grammar",
      icon: <FileText size={16} />,
      progress: 0,
      level: "Beginner",
      pointsEarned: 0,
      totalPoints: 1500,
      color: "text-primary"
    },
    {
      skill: "Reading",
      icon: <BookOpen size={16} />,
      progress: 0,
      level: "Beginner",
      pointsEarned: 0,
      totalPoints: 1350,
      color: "text-secondary"
    },
    {
      skill: "Listening",
      icon: <Headphones size={16} />,
      progress: 0,
      level: "Beginner",
      pointsEarned: 0,
      totalPoints: 1300,
      color: "text-tertiary"
    },
    {
      skill: "Vocabulary",
      icon: <Sparkles size={16} />,
      progress: 0,
      level: "Beginner",
      pointsEarned: 0,
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
      earned: false,
      tier: 'bronze',
      rarity: 'common',
      points: 50
    },
    {
      id: "2",
      title: "Week Warrior",
      description: "Maintain 7-day streak",
      icon: <Trophy size={16} />,
      earned: false,
      tier: 'silver',
      rarity: 'rare',
      points: 150
    },
    {
      id: "3",
      title: "Grammar Master",
      description: "Score 90% in grammar",
      icon: <Crown size={16} />,
      earned: false,
      tier: 'gold',
      rarity: 'epic',
      points: 300
    },
    {
      id: "4",
      title: "Speed Reader",
      description: "Read 50 articles",
      icon: <BookOpen size={16} />,
      earned: false,
      tier: 'silver',
      rarity: 'rare',
      points: 200
    },
    {
      id: "5",
      title: "Perfect Score Legend",
      description: "Get 100% on 5 consecutive tests",
      icon: <Gem size={16} />,
      earned: false,
      tier: 'platinum',
      rarity: 'legendary',
      points: 500
    },
    {
      id: "6",
      title: "Study Streak Champion",
      description: "Maintain 30-day study streak",
      icon: <Medal size={16} />,
      earned: false,
      tier: 'gold',
      rarity: 'epic',
      points: 400
    }
  ];

  const overallProgress = Math.round(skillsProgress.reduce((sum, skill) => sum + skill.progress, 0) / skillsProgress.length);
  const totalPointsEarned = skillsProgress.reduce((sum, skill) => sum + skill.pointsEarned, 0);
  const earnedAchievements = achievements.filter(a => a.earned).length;

  return (
    <div className="pb-20 px-4 pt-4 max-w-md mx-auto space-y-3">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-tertiary/55 via-primary/50 to-secondary/45 rounded-2xl p-6 mb-4 overflow-hidden">
        <div className="absolute top-2 right-4 w-16 h-16 bg-tertiary/40 rounded-full blur-xl" />
        <div className="absolute bottom-2 left-4 w-20 h-20 bg-primary/35 rounded-full blur-2xl" />
        <div className="relative text-center">
          <div className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full text-xs font-medium mb-3">
            <BarChart3 size={12} />
            Analytics Dashboard
          </div>
          <h1 className="text-2xl font-bold text-slate-900 drop-shadow-md mb-2" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.8)'}}>
            Your Progress 📊
          </h1>
          <p className="text-sm text-slate-800 drop-shadow-sm" style={{textShadow: '1px 1px 2px rgba(255,255,255,0.6)'}}>
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
                  const progress = 0; // Reset all progress to 0
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
                <div className="text-lg font-bold text-card-foreground">0h 0m</div>
                <div className="text-xs text-card-foreground/80">Total</div>
              </div>
              <div>
                <div className="text-lg font-bold text-card-foreground">0h 0m</div>
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

        <TabsContent value="achievements" className="space-y-3 mt-0">
          {/* Achievement Stats Header */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <Card className="p-3 text-center bg-gradient-to-br from-achievement-bronze/20 to-achievement-bronze/5 border-achievement-bronze/30">
              <div className="text-lg font-bold text-achievement-bronze mb-1">{achievements.filter(a => a.earned && a.tier === 'bronze').length}</div>
              <div className="text-xs text-muted-foreground">Bronze</div>
            </Card>
            <Card className="p-3 text-center bg-gradient-to-br from-achievement-silver/20 to-achievement-silver/5 border-achievement-silver/30">
              <div className="text-lg font-bold text-achievement-silver mb-1">{achievements.filter(a => a.earned && a.tier === 'silver').length}</div>
              <div className="text-xs text-muted-foreground">Silver</div>
            </Card>
            <Card className="p-3 text-center bg-gradient-to-br from-achievement-gold/20 to-achievement-gold/5 border-achievement-gold/30">
              <div className="text-lg font-bold text-achievement-gold mb-1">{achievements.filter(a => a.earned && a.tier === 'gold').length}</div>
              <div className="text-xs text-muted-foreground">Gold</div>
            </Card>
          </div>

          {/* Achievements Grid */}
          <div className="grid gap-3">
            {achievements.map((achievement) => {
              const getTierGradient = (tier: string, earned: boolean) => {
                if (!earned) return 'bg-surface-container border-outline-variant';
                
                switch (tier) {
                  case 'bronze':
                    return 'bg-gradient-to-br from-[#CD7F32]/20 via-[#CD7F32]/10 to-[#CD7F32]/5 border-[#CD7F32]/40 shadow-lg shadow-[#CD7F32]/10';
                  case 'silver':
                    return 'bg-gradient-to-br from-slate-400/20 via-slate-300/10 to-slate-200/5 border-slate-400/40 shadow-lg shadow-slate-400/10';
                  case 'gold':
                    return 'bg-gradient-to-br from-yellow-400/20 via-yellow-300/10 to-yellow-200/5 border-yellow-400/40 shadow-lg shadow-yellow-400/10';
                  case 'platinum':
                    return 'bg-gradient-to-br from-purple-400/20 via-purple-300/10 to-purple-200/5 border-purple-400/40 shadow-lg shadow-purple-400/10';
                  default:
                    return 'bg-surface-container border-outline-variant';
                }
              };

              const getRarityBadge = (rarity: string) => {
                switch (rarity) {
                  case 'common':
                    return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
                  case 'rare':
                    return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
                  case 'epic':
                    return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
                  case 'legendary':
                    return 'bg-gradient-to-r from-yellow-400/10 to-orange-400/10 text-orange-600 border-orange-400/20';
                  default:
                    return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
                }
              };

              const getIconContainer = (tier: string, earned: boolean) => {
                if (!earned) return 'bg-surface text-on-surface-variant';
                
                switch (tier) {
                  case 'bronze':
                    return 'bg-gradient-to-br from-[#CD7F32] to-[#B8860B] text-white shadow-md';
                  case 'silver':
                    return 'bg-gradient-to-br from-slate-400 to-slate-500 text-white shadow-md';
                  case 'gold':
                    return 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white shadow-md';
                  case 'platinum':
                    return 'bg-gradient-to-br from-purple-400 to-purple-500 text-white shadow-md';
                  default:
                    return 'bg-surface text-on-surface-variant';
                }
              };

              return (
                <Card 
                  key={achievement.id} 
                  className={`relative overflow-hidden transition-all duration-300 hover:scale-[1.02] ${getTierGradient(achievement.tier, achievement.earned)} ${
                    achievement.earned ? '' : 'opacity-60 hover:opacity-80'
                  }`}
                >
                  
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      <div className={`p-2 rounded-full ${getIconContainer(achievement.tier, achievement.earned)} relative`}>
                        {achievement.earned && achievement.tier === 'platinum' && (
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-300/50 to-purple-600/50 animate-pulse" />
                        )}
                        <div className="relative z-10">
                          {achievement.icon}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold text-sm leading-tight ${
                            achievement.earned 
                              ? 'text-foreground' 
                              : 'text-on-surface-variant'
                          }`}>
                            {achievement.title}
                          </h3>
                          <div className="flex flex-col items-end gap-1">
                            <Badge 
                              variant="outline" 
                              className={`text-[10px] px-1.5 py-0.5 ${getRarityBadge(achievement.rarity)}`}
                            >
                              {achievement.rarity}
                            </Badge>
                            {achievement.earned && (
                              <div className="flex items-center gap-1">
                                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-xs font-medium text-yellow-600">+{achievement.points}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <p className={`text-xs mb-1 leading-relaxed ${
                          achievement.earned 
                            ? 'text-foreground/80' 
                            : 'text-on-surface-variant/80'
                        }`}>
                          {achievement.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          {achievement.earned && achievement.date && (
                            <p className="text-xs text-muted-foreground">
                              Earned {new Date(achievement.date).toLocaleDateString()}
                            </p>
                          )}
                          {!achievement.earned && (
                            <p className="text-xs text-muted-foreground">
                              {achievement.points} points reward
                            </p>
                          )}
                          
                          {achievement.earned && (
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                              <span className="text-xs font-medium text-green-600">Completed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Bottom Glow Effect for Special Achievements */}
                  {achievement.earned && achievement.tier === 'platinum' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
                  )}
                  {achievement.earned && achievement.tier === 'gold' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent" />
                  )}
                </Card>
              );
            })}
          </div>

          {/* Achievement Progress Summary */}
          <Card className="p-4 bg-gradient-to-br from-primary/10 via-secondary/5 to-tertiary/10 border-primary/20 mt-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary rounded-full">
                <Award className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Achievement Progress</h3>
                <p className="text-xs text-muted-foreground">
                  {achievements.filter(a => a.earned).length} of {achievements.length} unlocked
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">
                  {Math.round((achievements.filter(a => a.earned).length / achievements.length) * 100)}%
                </span>
              </div>
              <ProgressBar 
                value={(achievements.filter(a => a.earned).length / achievements.length) * 100} 
                className="h-2"
              />
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Points Earned</span>
                <span className="font-medium text-primary">
                  {achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0)} pts
                </span>
              </div>
            </div>
          </Card>
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
                    <div className="text-lg font-bold text-primary">0%</div>
                    <div className="text-xs text-card-foreground/80">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">0</div>
                    <div className="text-xs text-card-foreground/80">Tasks Done</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-card-foreground/80">Grammar</span>
                    <span className="font-medium text-card-foreground">0%</span>
                  </div>
                  <ProgressBar value={0} className="h-1.5" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-card-foreground/80">Reading</span>
                    <span className="font-medium text-card-foreground">0%</span>
                  </div>
                  <ProgressBar value={0} className="h-1.5" />
                  
                  <div className="flex justify-between text-xs">
                    <span className="text-card-foreground/80">Listening</span>
                    <span className="font-medium text-card-foreground">0%</span>
                  </div>
                  <ProgressBar value={0} className="h-1.5" />
                </div>
              </Card>

              <Card className="p-3 bg-surface-variant">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-on-surface-variant" />
                  <div>
                    <h4 className="font-medium text-sm text-on-surface">Start Your Journey</h4>
                    <p className="text-xs text-on-surface-variant">Complete tasks to see your weekly analytics</p>
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
                    <div className="text-lg font-bold text-primary">0%</div>
                    <div className="text-xs text-card-foreground/80">Avg Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">0</div>
                    <div className="text-xs text-card-foreground/80">Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-tertiary">0h</div>
                    <div className="text-xs text-card-foreground/80">Study Time</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-xs text-card-foreground">Monthly Progress</h4>
                  {['Week 1', 'Week 2', 'Week 3', 'Week 4'].map((week, index) => {
                    const progress = 0;
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

              <Card className="p-3 bg-surface-variant">
                <div className="flex items-center gap-2">
                  <BarChart3 size={14} className="text-on-surface-variant" />
                  <div>
                    <h4 className="font-medium text-sm text-on-surface">Build Your Stats</h4>
                    <p className="text-xs text-on-surface-variant">Complete tasks consistently to see monthly trends</p>
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
                    <div className="text-lg font-bold text-primary">0%</div>
                    <div className="text-xs text-card-foreground/80">Overall Avg</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-secondary">0</div>
                    <div className="text-xs text-card-foreground/80">Total Tasks</div>
                  </div>
                </div>

                <div className="space-y-2 mb-3">
                  <h4 className="font-medium text-xs text-card-foreground">Learning Journey</h4>
                  <div className="grid grid-cols-4 gap-1 text-center">
                    <div>
                      <div className="text-sm font-bold text-card-foreground">0h</div>
                      <div className="text-xs text-card-foreground/80">Study</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-card-foreground">0</div>
                      <div className="text-xs text-card-foreground/80">Streaks</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-card-foreground">0</div>
                      <div className="text-xs text-card-foreground/80">Days</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-card-foreground">0</div>
                      <div className="text-xs text-card-foreground/80">Levels</div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-2 rounded-lg">
                  <div className="text-xs text-card-foreground/80 mb-1">Progress Milestones</div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-card-foreground">Ready to start your journey</span>
                    <span className="text-xs font-medium text-primary">Day 0</span>
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
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BarChart3 size={24} className="text-primary" />
                    </div>
                    <h4 className="text-sm font-medium text-card-foreground mb-1">No Performance Data Yet</h4>
                    <p className="text-xs text-card-foreground/70 mb-4">
                      Complete tasks and assessments to unlock detailed performance analysis and personalized insights.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-xs text-card-foreground">What you'll see:</h4>
                    <div className="space-y-1 text-xs text-card-foreground/80">
                      <div>• Strength and weakness analysis</div>
                      <div>• Optimal study time recommendations</div>
                      <div>• Skill progression tracking</div>
                      <div>• Performance trends over time</div>
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
                
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain size={32} className="text-primary" />
                  </div>
                  <h4 className="text-base font-semibold text-card-foreground mb-2">AI Analysis Coming Soon</h4>
                  <p className="text-sm text-card-foreground/70 mb-6">
                    Once you start completing tasks, our AI will analyze your learning patterns and provide personalized insights to optimize your study strategy.
                  </p>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium text-xs text-card-foreground">What AI will discover:</h4>
                    <div className="space-y-2 text-xs text-card-foreground/80">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Your optimal learning times and patterns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        <span>Skill connections and learning accelerators</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-tertiary rounded-full"></div>
                        <span>Personalized study recommendations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <span>Exam readiness predictions</span>
                      </div>
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