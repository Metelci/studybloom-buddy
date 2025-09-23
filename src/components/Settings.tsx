import { useState } from "react";
import { 
  Bell, 
  Navigation, 
  Trophy, 
  Users, 
  Shield, 
  CheckSquare,
  ChevronRight,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Clock,
  Zap,
  Eye,
  Target,
  Calendar,
  Brain
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useNativeFeatures } from "@/hooks/useNativeFeatures";
import { Badge } from "@/components/ui/badge";

interface SettingsSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  color: string;
}

interface SettingItem {
  id: string;
  label: string;
  description?: string;
  type: 'toggle' | 'select' | 'action';
  value?: boolean;
  options?: string[];
  icon?: React.ComponentType<any>;
}

const settingsSections: SettingsSection[] = [
  { id: "navigation", title: "Navigation", icon: Navigation, color: "text-primary" },
  { id: "notifications", title: "Notifications", icon: Bell, color: "text-secondary" },
  { id: "gamification", title: "Gamification", icon: Trophy, color: "text-tertiary" },
  { id: "social", title: "Social", icon: Users, color: "text-success" },
  { id: "privacy", title: "Privacy", icon: Shield, color: "text-warning" },
  { id: "tasks", title: "Tasks", icon: CheckSquare, color: "text-primary" },
];

const settingsData: Record<string, SettingItem[]> = {
  navigation: [
    {
      id: "bottom_nav",
      label: "Bottom Navigation",
      description: "Show navigation at bottom of screen",
      type: "toggle",
      value: true,
      icon: Smartphone
    },
    {
      id: "haptic_feedback",
      label: "Haptic Feedback",
      description: "Vibrate on button taps and interactions",
      type: "toggle",
      value: true,
      icon: Volume2
    }
  ],
  notifications: [
    {
      id: "push_notifications",
      label: "Push Notifications",
      description: "Receive notifications on your device",
      type: "toggle",
      value: true,
      icon: Bell
    },
    {
      id: "study_reminders",
      label: "Study Reminders",
      description: "Daily reminders to maintain your streak",
      type: "toggle",
      value: true,
      icon: Clock
    },
    {
      id: "achievement_alerts",
      label: "Achievement Alerts",
      description: "Get notified when you unlock achievements",
      type: "toggle",
      value: true,
      icon: Trophy
    },
    {
      id: "email_summaries",
      label: "Email Summaries",
      description: "Weekly progress summaries via email",
      type: "toggle",
      value: false,
      icon: Mail
    }
  ],
  gamification: [
    {
      id: "streak_tracking",
      label: "Streak Tracking",
      description: "Track daily study streaks",
      type: "toggle",
      value: true,
      icon: Zap
    },
    {
      id: "points_system",
      label: "Points & Rewards",
      description: "Earn points for completed tasks",
      type: "toggle",
      value: true,
      icon: Target
    },
    {
      id: "celebrations",
      label: "Celebration Effects",
      description: "Confetti and animations on achievements",
      type: "toggle",
      value: true,
      icon: Trophy
    },
    {
      id: "streak_warnings",
      label: "Streak Risk Warnings",
      description: "Alert when your streak is at risk",
      type: "toggle",
      value: true,
      icon: Bell
    }
  ],
  social: [
    {
      id: "buddy_matching",
      label: "Study Buddy Matching",
      description: "Find compatible study partners",
      type: "toggle",
      value: true,
      icon: Users
    },
    {
      id: "activity_sharing",
      label: "Share Activity",
      description: "Share your progress with friends",
      type: "toggle",
      value: true,
      icon: Eye
    },
    {
      id: "group_notifications",
      label: "Group Notifications",
      description: "Notifications from study groups",
      type: "toggle",
      value: true,
      icon: Bell
    },
    {
      id: "leaderboard",
      label: "Leaderboard Participation",
      description: "Appear on friend leaderboards",
      type: "toggle",
      value: false,
      icon: Trophy
    }
  ],
  privacy: [
    {
      id: "profile_visibility",
      label: "Profile Visibility",
      description: "Who can see your profile",
      type: "select",
      options: ["Everyone", "Friends Only", "Private"],
      icon: Eye
    },
    {
      id: "data_analytics",
      label: "Anonymous Analytics",
      description: "Help improve the app with usage data",
      type: "toggle",
      value: true,
      icon: Brain
    },
    {
      id: "progress_sharing",
      label: "Progress Sharing",
      description: "Allow sharing of progress statistics",
      type: "toggle",
      value: true,
      icon: Target
    }
  ],
  tasks: [
    {
      id: "smart_scheduling",
      label: "Smart Scheduling",
      description: "AI-powered study session recommendations",
      type: "toggle",
      value: true,
      icon: Brain
    },
    {
      id: "auto_difficulty",
      label: "Auto Difficulty Adjustment",
      description: "Automatically adjust task difficulty",
      type: "toggle",
      value: true,
      icon: Target
    },
    {
      id: "daily_goals",
      label: "Daily Goal Reminders",
      description: "Remind me of my daily study goals",
      type: "toggle",
      value: true,
      icon: Calendar
    },
    {
      id: "weekend_mode",
      label: "Weekend Mode",
      description: "Lighter study load on weekends",
      type: "toggle",
      value: false,
      icon: Calendar
    }
  ]
};

export function Settings() {
  const [activeSection, setActiveSection] = useState<string>("navigation");
  const { isNative, notificationToken, scheduleStreakReminder } = useNativeFeatures();
  const [settings, setSettings] = useState<Record<string, any>>({
    bottom_nav: true,
    haptic_feedback: true,
    push_notifications: true,
    study_reminders: true,
    achievement_alerts: true,
    email_summaries: false,
    streak_tracking: true,
    points_system: true,
    celebrations: true,
    streak_warnings: true,
    buddy_matching: true,
    activity_sharing: true,
    group_notifications: true,
    leaderboard: false,
    profile_visibility: "Friends Only",
    data_analytics: true,
    progress_sharing: true,
    smart_scheduling: true,
    auto_difficulty: true,
    daily_goals: true,
    weekend_mode: false
  });

  const handleToggle = (settingId: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const renderSettingItem = (item: SettingItem) => {
    const Icon = item.icon;
    
    return (
      <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors duration-standard">
        <div className="flex items-center gap-3 flex-1">
          {Icon && <Icon size={20} className="text-on-surface-variant" />}
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-on-surface">{item.label}</div>
            {item.description && (
              <div className="text-xs text-on-surface-variant mt-1">{item.description}</div>
            )}
          </div>
        </div>
        
        {item.type === 'toggle' && (
          <Switch
            checked={settings[item.id] || false}
            onCheckedChange={(checked) => handleToggle(item.id, checked)}
            className="ml-3"
          />
        )}
        
        {item.type === 'select' && (
          <Button variant="ghost" size="sm" className="ml-3 text-on-surface-variant">
            {settings[item.id] || item.options?.[0]}
            <ChevronRight size={16} className="ml-1" />
          </Button>
        )}
        
        {item.type === 'action' && (
          <ChevronRight size={16} className="text-on-surface-variant ml-3" />
        )}
      </div>
    );
  };

  return (
    <div className="p-6 pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-warning/25 via-primary/30 to-tertiary/20 rounded-2xl p-6 mb-6 overflow-hidden">
        <div className="absolute top-2 right-2 w-24 h-24 bg-warning/15 rounded-full blur-2xl" />
        <div className="absolute bottom-2 left-2 w-20 h-20 bg-tertiary/20 rounded-full blur-xl" />
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Brain size={20} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-primary drop-shadow-sm">
                  Settings
                </h1>
                <p className="text-xs text-on-surface-variant/80">
                  Customize your study experience
                </p>
              </div>
            </div>
            {isNative && (
              <Badge className="bg-gradient-to-r from-success/20 to-primary/20 text-success border-success/30">
                <Smartphone size={12} className="mr-1" />
                Native
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "p-3 rounded-xl transition-all duration-standard flex flex-col items-center gap-2",
                isActive 
                  ? "bg-primary-container text-primary-container-foreground shadow-md" 
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              <Icon size={20} className={isActive ? section.color : ""} />
              <span className="text-xs font-medium">{section.title}</span>
            </button>
          );
        })}
      </div>

      {/* Settings Content */}
      <Card className="bg-surface border-outline-variant">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg capitalize text-on-surface flex items-center gap-2">
            {(() => {
              const section = settingsSections.find(s => s.id === activeSection);
              const Icon = section?.icon;
              return (
                <>
                  {Icon && <Icon size={20} className={section?.color} />}
                  {section?.title}
                </>
              );
            })()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {settingsData[activeSection]?.map(renderSettingItem)}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-6 space-y-3">
        {isNative && (
          <Button 
            variant="outline" 
            className="w-full justify-start text-on-surface border-outline-variant"
            onClick={scheduleStreakReminder}
          >
            <Bell size={16} className="mr-2" />
            Schedule Streak Reminder
          </Button>
        )}
        
        <Button variant="outline" className="w-full justify-start text-on-surface border-outline-variant">
          <Bell size={16} className="mr-2" />
          Reset All Notifications
        </Button>
        
        <Button variant="outline" className="w-full justify-start text-destructive border-destructive">
          <Trophy size={16} className="mr-2" />
          Reset Progress (Danger)
        </Button>
      </div>

      {/* App Info */}
      <div className="mt-8 text-center">
        <p className="text-xs text-on-surface-variant mb-2">StudyPlan YDS Tracker</p>
        <p className="text-xs text-on-surface-variant">Version 1.0.0 • Made with ❤️</p>
      </div>
    </div>
  );
}