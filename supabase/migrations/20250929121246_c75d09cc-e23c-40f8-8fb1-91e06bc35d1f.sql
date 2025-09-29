-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  privacy_level TEXT DEFAULT 'friends' CHECK (privacy_level IN ('public', 'friends', 'private')),
  show_progress BOOLEAN DEFAULT true,
  show_streaks BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user progress tracking table
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  tasks_completed INTEGER DEFAULT 0,
  study_minutes INTEGER DEFAULT 0,
  points_earned INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Create friendships table
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(requester_id, addressee_id),
  CHECK (requester_id != addressee_id)
);

-- Create leaderboards table
CREATE TABLE public.leaderboards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_points INTEGER DEFAULT 0,
  total_minutes INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, period_type, period_start)
);

-- Create study groups table
CREATE TABLE public.study_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_public BOOLEAN DEFAULT true,
  max_members INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study group memberships table
CREATE TABLE public.study_group_memberships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('creator', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  criteria JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_group_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view public profiles" 
ON public.profiles 
FOR SELECT 
USING (privacy_level = 'public' OR auth.uid() = user_id);

CREATE POLICY "Users can view friends profiles" 
ON public.profiles 
FOR SELECT 
USING (
  privacy_level = 'friends' AND (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.friendships 
      WHERE status = 'accepted' AND (
        (requester_id = auth.uid() AND addressee_id = user_id) OR
        (requester_id = user_id AND addressee_id = auth.uid())
      )
    )
  )
);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- User progress policies
CREATE POLICY "Users can view their own progress" 
ON public.user_progress 
FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view friends progress if allowed" 
ON public.user_progress 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = user_progress.user_id 
    AND p.show_progress = true
    AND (
      p.privacy_level = 'public' OR
      (p.privacy_level = 'friends' AND EXISTS (
        SELECT 1 FROM public.friendships f
        WHERE f.status = 'accepted' AND (
          (f.requester_id = auth.uid() AND f.addressee_id = user_progress.user_id) OR
          (f.requester_id = user_progress.user_id AND f.addressee_id = auth.uid())
        )
      ))
    )
  )
);

-- Friendships policies
CREATE POLICY "Users can view their friendships" 
ON public.friendships 
FOR SELECT 
USING (auth.uid() = requester_id OR auth.uid() = addressee_id);

CREATE POLICY "Users can create friend requests" 
ON public.friendships 
FOR INSERT 
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Users can update friendship status" 
ON public.friendships 
FOR UPDATE 
USING (auth.uid() = addressee_id OR auth.uid() = requester_id);

-- Leaderboards policies (public read)
CREATE POLICY "Anyone can view leaderboards" 
ON public.leaderboards 
FOR SELECT 
USING (true);

CREATE POLICY "System can manage leaderboards" 
ON public.leaderboards 
FOR ALL 
USING (false);

-- Study groups policies
CREATE POLICY "Anyone can view public groups" 
ON public.study_groups 
FOR SELECT 
USING (is_public = true OR creator_id = auth.uid());

CREATE POLICY "Users can create groups" 
ON public.study_groups 
FOR INSERT 
WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their groups" 
ON public.study_groups 
FOR UPDATE 
USING (auth.uid() = creator_id);

-- Study group memberships policies
CREATE POLICY "Members can view group memberships" 
ON public.study_group_memberships 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.study_group_memberships sgm
    WHERE sgm.group_id = study_group_memberships.group_id 
    AND sgm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join groups" 
ON public.study_group_memberships 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Achievements policies (public read)
CREATE POLICY "Anyone can view achievements" 
ON public.achievements 
FOR SELECT 
USING (true);

-- User achievements policies
CREATE POLICY "Users can view their achievements" 
ON public.user_achievements 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = user_achievements.user_id 
    AND (
      p.privacy_level = 'public' OR
      (p.privacy_level = 'friends' AND EXISTS (
        SELECT 1 FROM public.friendships f
        WHERE f.status = 'accepted' AND (
          (f.requester_id = auth.uid() AND f.addressee_id = user_achievements.user_id) OR
          (f.requester_id = user_achievements.user_id AND f.addressee_id = auth.uid())
        )
      ))
    )
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
  BEFORE UPDATE ON public.user_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_friendships_updated_at
  BEFORE UPDATE ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_groups_updated_at
  BEFORE UPDATE ON public.study_groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'display_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some default achievements
INSERT INTO public.achievements (name, description, icon, rarity, criteria) VALUES
('First Steps', 'Complete your first task', '🎯', 'common', '{"tasks_completed": 1}'),
('Study Streak', 'Study for 7 days in a row', '🔥', 'uncommon', '{"streak_days": 7}'),
('Task Master', 'Complete 100 tasks', '🏆', 'rare', '{"total_tasks": 100}'),
('Study Marathon', 'Study for 1000 minutes total', '📚', 'rare', '{"total_minutes": 1000}'),
('Social Butterfly', 'Make 10 friends', '🦋', 'uncommon', '{"friends_count": 10}'),
('Group Leader', 'Create a study group', '👑', 'uncommon', '{"groups_created": 1}'),
('Points Champion', 'Earn 10000 points', '💎', 'epic', '{"total_points": 10000}'),
('Legend', 'Maintain a 30-day streak', '⭐', 'legendary', '{"streak_days": 30}');