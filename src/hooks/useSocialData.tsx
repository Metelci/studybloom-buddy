import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { useToast } from "./use-toast";

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  privacy_level: 'public' | 'friends' | 'private';
  show_progress: boolean;
  show_streaks: boolean;
}

export interface UserProgress {
  id: string;
  user_id: string;
  date: string;
  tasks_completed: number;
  study_minutes: number;
  points_earned: number;
  streak_days: number;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
  requester_profile?: Profile;
  addressee_profile?: Profile;
}

export interface Achievement {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  criteria: any;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement: Achievement;
}

export function useSocialData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [friends, setFriends] = useState<Friendship[]>([]);
  const [friendRequests, setFriendRequests] = useState<Friendship[]>([]);
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
    } else if (data) {
      setProfile(data as Profile);
    }
  };

  // Fetch friendships
  const fetchFriendships = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (error) {
      console.error('Error fetching friendships:', error);
    } else {
      const accepted = (data?.filter(f => f.status === 'accepted') || []) as unknown as Friendship[];
      const requests = (data?.filter(f => f.status === 'pending' && f.addressee_id === user.id) || []) as unknown as Friendship[];
      setFriends(accepted);
      setFriendRequests(requests);
    }
  };

  // Fetch user achievements
  const fetchAchievements = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', user.id)
      .order('unlocked_at', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
    } else {
      setAchievements((data || []) as UserAchievement[]);
    }
  };

  // Fetch user progress
  const fetchProgress = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Error fetching progress:', error);
    } else {
      setProgress(data || []);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({ user_id: user.id, ...updates });

    if (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      fetchProfile();
    }
  };

  // Send friend request
  const sendFriendRequest = async (addresseeId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('friendships')
      .insert([
        { requester_id: user.id, addressee_id: addresseeId, status: 'pending' }
      ]);

    if (error) {
      console.error('Error sending friend request:', error);
      toast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Friend request sent!",
      });
      fetchFriendships();
    }
  };

  // Accept friend request
  const acceptFriendRequest = async (friendshipId: string) => {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId);

    if (error) {
      console.error('Error accepting friend request:', error);
      toast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Friend request accepted!",
      });
      fetchFriendships();
    }
  };

  // Record progress
  const recordProgress = async (progressData: Partial<UserProgress>) => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { error } = await supabase
      .from('user_progress')
      .upsert([
        { 
          user_id: user.id, 
          date: today,
          ...progressData 
        }
      ]);

    if (error) {
      console.error('Error recording progress:', error);
    } else {
      fetchProgress();
    }
  };

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchProfile(),
        fetchFriendships(),
        fetchAchievements(),
        fetchProgress(),
      ]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  return {
    profile,
    friends,
    friendRequests,
    achievements,
    progress,
    loading,
    updateProfile,
    sendFriendRequest,
    acceptFriendRequest,
    recordProgress,
  };
}