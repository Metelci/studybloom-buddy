import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users, UserPlus, Trophy, Star, Flame, Award, Target,
  Settings, Crown, Medal, CheckCircle, XCircle, Camera, LogOut,
  TrendingUp, Search
} from "lucide-react";
import { useSocialData } from "@/hooks/useSocialData";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const avatarOptions = [
  { id: '1', emoji: '😊', bg: 'bg-blue-100' },
  { id: '2', emoji: '🎓', bg: 'bg-green-100' },
  { id: '3', emoji: '📚', bg: 'bg-purple-100' },
  { id: '4', emoji: '⭐', bg: 'bg-yellow-100' },
  { id: '5', emoji: '🚀', bg: 'bg-red-100' },
  { id: '6', emoji: '🏆', bg: 'bg-orange-100' },
];

export function Social() {
  const { user, signOut } = useAuth();
  const { 
    profile, 
    friends, 
    friendRequests, 
    achievements, 
    progress, 
    loading,
    updateProfile,
    acceptFriendRequest 
  } = useSocialData();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [showProgress, setShowProgress] = useState(true);
  const [showStreaks, setShowStreaks] = useState(true);
  const [privacyLevel, setPrivacyLevel] = useState<'public' | 'friends' | 'private'>('friends');
  const [searchUsername, setSearchUsername] = useState("");

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setShowProgress(profile.show_progress);
      setShowStreaks(profile.show_streaks);
      setPrivacyLevel(profile.privacy_level);
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    await updateProfile({
      username,
      display_name: displayName,
      bio,
      show_progress: showProgress,
      show_streaks: showStreaks,
      privacy_level: privacyLevel,
    });
  };

  const currentStreak = progress[0]?.streak_days || 0;
  const totalPoints = progress.reduce((sum, p) => sum + (p.points_earned || 0), 0);
  const totalTasks = progress.reduce((sum, p) => sum + (p.tasks_completed || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading social features...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 pb-20 max-w-md mx-auto min-h-screen bg-background">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Social Hub</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
          <Button variant="outline" size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="friends">Friends</TabsTrigger>
          <TabsTrigger value="leaderboard">Ranks</TabsTrigger>
          <TabsTrigger value="achievements">Awards</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>

              <div className="space-y-4">
                <Label>Privacy Settings</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show Progress</Label>
                      <p className="text-sm text-muted-foreground">Allow friends to see your study progress</p>
                    </div>
                    <Switch checked={showProgress} onCheckedChange={setShowProgress} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Show Streaks</Label>
                      <p className="text-sm text-muted-foreground">Display your study streaks publicly</p>
                    </div>
                    <Switch checked={showStreaks} onCheckedChange={setShowStreaks} />
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{currentStreak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalPoints}</div>
                  <div className="text-sm text-muted-foreground">Total Points</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalTasks}</div>
                  <div className="text-sm text-muted-foreground">Tasks Done</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="friends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Friends ({friends.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {friendRequests.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold">Friend Requests</h3>
                  {friendRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 rounded-lg border bg-accent/20">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Friend Request</p>
                          <p className="text-sm text-muted-foreground">Wants to be friends</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => acceptFriendRequest(request.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3">
                {friends.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">No friends yet</p>
                    <p className="text-sm text-muted-foreground">Start learning to connect with others!</p>
                  </div>
                ) : (
                  friends.map((friendship) => (
                    <div key={friendship.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>F</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">Study Friend</p>
                          <Badge variant="outline" className="text-xs">Friend</Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Weekly Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold">#{friends.length + 1}</span>
                    <div>
                      <p className="font-semibold">Your Rank</p>
                      <p className="text-sm text-muted-foreground">{totalPoints} points • {currentStreak}-day streak</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Keep studying!</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Achievements ({achievements.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <div className="text-center py-8">
                  <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No achievements yet</p>
                  <p className="text-sm text-muted-foreground">Complete tasks to earn your first achievement!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {achievements.map((userAchievement) => (
                    <div key={userAchievement.id} className="p-4 rounded-lg border">
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{userAchievement.achievement.icon}</div>
                        <div>
                          <h3 className="font-semibold">{userAchievement.achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">{userAchievement.achievement.description}</p>
                          <Badge variant="default" className="mt-2">Unlocked</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}