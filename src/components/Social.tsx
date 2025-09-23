import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Trophy, 
  Users, 
  UserPlus, 
  Crown, 
  Medal, 
  Star,
  Target,
  Clock,
  BookOpen,
  TrendingUp,
  MessageCircle,
  Share2,
  Shield,
  User,
  Settings,
  Camera,
  Edit
} from "lucide-react";

// Mock data for demonstration
const leaderboardData = [
  { rank: 1, name: "Alex Chen", score: 2850, streak: 25, avatar: "AC" },
  { rank: 2, name: "Sarah Kim", score: 2720, streak: 18, avatar: "SK" },
  { rank: 3, name: "You", score: 2650, streak: 15, avatar: "YU", isCurrentUser: true },
  { rank: 4, name: "Mike Jones", score: 2580, streak: 12, avatar: "MJ" },
  { rank: 5, name: "Emma Davis", score: 2450, streak: 20, avatar: "ED" },
];

const studyGroups = [
  {
    id: 1,
    name: "YDS Warriors",
    members: 24,
    activity: "High",
    description: "Daily practice sessions",
    category: "General YDS"
  },
  {
    id: 2,
    name: "Vocabulary Masters",
    members: 18,
    activity: "Medium",
    description: "Focus on word building",
    category: "Vocabulary"
  },
  {
    id: 3,
    name: "Grammar Experts",
    members: 31,
    activity: "High", 
    description: "Advanced grammar practice",
    category: "Grammar"
  },
];

const friends = [
  { name: "Jessica Liu", status: "online", todayScore: 85, streak: 12, avatar: "JL" },
  { name: "David Park", status: "offline", todayScore: 92, streak: 8, avatar: "DP" },
  { name: "Lisa Wang", status: "studying", todayScore: 78, streak: 22, avatar: "LW" },
  { name: "Tom Wilson", status: "online", todayScore: 88, streak: 5, avatar: "TW" },
];

const achievements = [
  {
    title: "Study Streak Master",
    description: "Maintained 30-day streak",
    icon: Crown,
    rarity: "legendary",
    unlockedBy: ["Alex Chen", "Sarah Kim"]
  },
  {
    title: "Vocabulary Virtuoso", 
    description: "Learned 1000+ words",
    icon: BookOpen,
    rarity: "epic",
    unlockedBy: ["You", "Mike Jones", "Emma Davis"]
  },
  {
    title: "Speed Demon",
    description: "Completed 100 questions in 30min",
    icon: Clock,
    rarity: "rare", 
    unlockedBy: ["Sarah Kim", "Lisa Wang"]
  },
];

const avatarOptions = [
  { id: 1, emoji: "🎯", color: "bg-red-100" },
  { id: 2, emoji: "🚀", color: "bg-blue-100" },
  { id: 3, emoji: "⭐", color: "bg-yellow-100" },
  { id: 4, emoji: "🔥", color: "bg-orange-100" },
  { id: 5, emoji: "💎", color: "bg-cyan-100" },
  { id: 6, emoji: "🏆", color: "bg-amber-100" },
  { id: 7, emoji: "🎨", color: "bg-purple-100" },
  { id: 8, emoji: "🌟", color: "bg-pink-100" },
];

export function Social() {
  const [activeTab, setActiveTab] = useState("profile");
  const [username, setUsername] = useState("StudyNinja42");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [weeklyGoal, setWeeklyGoal] = useState([15]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-4 h-4 text-yellow-500" />;
      case 2: return <Medal className="w-4 h-4 text-gray-400" />;
      case 3: return <Medal className="w-4 h-4 text-amber-600" />;
      default: return <span className="text-xs font-medium text-on-surface-variant">#{rank}</span>;
    }
  };

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case "High": return "bg-success text-on-success";
      case "Medium": return "bg-warning text-on-warning";
      case "Low": return "bg-error text-on-error";
      default: return "bg-surface-variant text-on-surface-variant";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-success";
      case "studying": return "bg-primary";
      case "offline": return "bg-surface-variant";
      default: return "bg-surface-variant";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "border-yellow-500 bg-yellow-500/10";
      case "epic": return "border-purple-500 bg-purple-500/10";
      case "rare": return "border-blue-500 bg-blue-500/10";
      default: return "border-outline-variant bg-surface-variant";
    }
  };

  return (
    <div className="p-4 pb-20 max-w-md mx-auto min-h-screen bg-background">
      {/* Privacy Warning */}
      <Alert className="mb-4 border-primary/20 bg-primary/5">
        <Shield className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm text-primary">
          <strong>Privacy First:</strong> Your real identity is never shared. Only your chosen username and avatar are visible to others.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="relative bg-gradient-to-r from-secondary/10 via-success/5 to-primary/10 rounded-2xl p-5 mb-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-success/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-secondary/5 rounded-full blur-xl" />
        <div className="relative flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-5 h-5 text-success" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-success to-secondary bg-clip-text text-transparent">
                Social Hub
              </h1>
            </div>
            <p className="text-xs text-on-surface-variant/80">
              Connect with fellow YDS students
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5 bg-gradient-to-r from-success/10 to-secondary/10 border-success/20 hover:border-success/30 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Invite
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4 text-xs">
          <TabsTrigger value="profile" className="text-[10px]">Profile</TabsTrigger>
          <TabsTrigger value="leaderboard" className="text-[10px]">Ranks</TabsTrigger>
          <TabsTrigger value="groups" className="text-[10px]">Groups</TabsTrigger>
          <TabsTrigger value="friends" className="text-[10px]">Friends</TabsTrigger>
          <TabsTrigger value="achievements" className="text-[10px]">Awards</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-0">
          {/* Profile Setup Card */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Username Section */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-on-surface">
                  Username
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    className="flex-1"
                    maxLength={20}
                  />
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-on-surface-variant">
                  This is how others will see you (3-20 characters)
                </p>
              </div>

              {/* Avatar Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-on-surface">
                  Choose Your Avatar
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {avatarOptions.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={`relative p-3 rounded-lg border-2 transition-all ${
                        selectedAvatar.id === avatar.id
                          ? "border-primary bg-primary/10"
                          : "border-outline-variant hover:border-outline bg-surface-variant/50"
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${avatar.color}`}>
                        <span className="text-lg">{avatar.emoji}</span>
                      </div>
                      {selectedAvatar.id === avatar.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-xs text-primary-foreground">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Custom Avatar
                </Button>
              </div>

              {/* Profile Preview */}
              <div className="bg-surface-container p-3 rounded-lg">
                <p className="text-xs text-on-surface-variant mb-2">Preview:</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedAvatar.color}`}>
                    <span className="text-lg">{selectedAvatar.emoji}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-on-surface">{username}</p>
                    <p className="text-xs text-on-surface-variant">Study Level: Intermediate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Privacy & Settings */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings className="w-5 h-5 text-on-surface" />
                Privacy & Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm font-medium text-on-surface">Profile Visibility</p>
                  <p className="text-xs text-on-surface-variant">Who can see your profile</p>
                </div>
                <Badge variant="secondary" className="text-xs">Friends Only</Badge>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm font-medium text-on-surface">Study Stats</p>
                  <p className="text-xs text-on-surface-variant">Share progress with friends</p>
                </div>
                <Badge className="bg-success text-success-foreground text-xs">Enabled</Badge>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm font-medium text-on-surface">Leaderboard</p>
                  <p className="text-xs text-on-surface-variant">Appear in rankings</p>
                </div>
                <Badge className="bg-success text-success-foreground text-xs">Enabled</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-3 mt-0">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Weekly Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {leaderboardData.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    user.isCurrentUser 
                      ? "bg-primary/20 border border-primary/30" 
                      : "bg-surface hover:bg-surface-variant/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 flex justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className={`text-sm font-medium ${user.isCurrentUser ? "text-primary" : "text-on-surface"}`}>
                        {user.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {user.streak} day streak
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-on-surface">{user.score}</p>
                    <p className="text-xs text-on-surface-variant">points</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-2">
            <Card className="text-center">
              <CardContent className="p-3">
                <TrendingUp className="w-6 h-6 mx-auto mb-1 text-primary" />
                <p className="text-lg font-bold text-on-surface">3rd</p>
                <p className="text-xs text-on-surface-variant">Your Rank</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3">
                <Target className="w-6 h-6 mx-auto mb-1 text-success" />
                <p className="text-lg font-bold text-on-surface">2650</p>
                <p className="text-xs text-on-surface-variant">Your Score</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-3">
                <Star className="w-6 h-6 mx-auto mb-1 text-warning" />
                <p className="text-lg font-bold text-on-surface">15</p>
                <p className="text-xs text-on-surface-variant">Day Streak</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="groups" className="space-y-3 mt-0">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-on-surface">Study Groups</h3>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Users className="w-4 h-4" />
              Create Group
            </Button>
          </div>
          
          {studyGroups.map((group) => (
            <Card key={group.id} className="hover:bg-surface-variant/50 transition-colors">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-on-surface mb-1">{group.name}</h4>
                    <p className="text-xs text-on-surface-variant mb-2">{group.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {group.category}
                      </Badge>
                      <Badge className={`text-xs ${getActivityColor(group.activity)}`}>
                        {group.activity} Activity
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-on-surface">{group.members}</p>
                    <p className="text-xs text-on-surface-variant">members</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Join
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="friends" className="space-y-3 mt-0">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-on-surface">Study Buddies</h3>
            <Button variant="outline" size="sm" className="gap-1.5">
              <UserPlus className="w-4 h-4" />
              Add Friend
            </Button>
          </div>
          
          {friends.map((friend, index) => (
            <Card key={index} className="hover:bg-surface-variant/50 transition-colors">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="text-xs">{friend.avatar}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(friend.status)}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{friend.name}</p>
                      <p className="text-xs text-on-surface-variant capitalize">{friend.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-on-surface">{friend.todayScore}%</p>
                    <p className="text-xs text-on-surface-variant">{friend.streak} streak</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-3 mt-0">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-on-surface">Community Achievements</h3>
          </div>
          
          {achievements.map((achievement, index) => {
            const Icon = achievement.icon;
            return (
              <Card key={index} className={`border-2 ${getRarityColor(achievement.rarity)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-surface rounded-lg">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-on-surface">{achievement.title}</h4>
                        <Badge variant="outline" className="text-xs capitalize">
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-xs text-on-surface-variant mb-2">{achievement.description}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-xs text-on-surface-variant">Unlocked by:</p>
                        <div className="flex gap-1">
                          {achievement.unlockedBy.slice(0, 3).map((name, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {name}
                            </Badge>
                          ))}
                          {achievement.unlockedBy.length > 3 && (
                            <span className="text-xs text-on-surface-variant">+{achievement.unlockedBy.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}