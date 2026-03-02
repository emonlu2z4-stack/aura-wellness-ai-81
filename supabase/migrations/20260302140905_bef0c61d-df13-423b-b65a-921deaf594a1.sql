
-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT '',
  age INTEGER,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  goal_weight_kg NUMERIC,
  activity_level TEXT DEFAULT 'moderate',
  calorie_target INTEGER DEFAULT 2000,
  protein_target INTEGER DEFAULT 150,
  carbs_target INTEGER DEFAULT 250,
  fats_target INTEGER DEFAULT 65,
  fiber_target INTEGER DEFAULT 30,
  sugar_target INTEGER DEFAULT 50,
  sodium_target INTEGER DEFAULT 2300,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Meals table
CREATE TABLE public.meals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL DEFAULT 'Meal',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  calories NUMERIC NOT NULL DEFAULT 0,
  protein NUMERIC NOT NULL DEFAULT 0,
  carbs NUMERIC NOT NULL DEFAULT 0,
  fats NUMERIC NOT NULL DEFAULT 0,
  fiber NUMERIC DEFAULT 0,
  sugar NUMERIC DEFAULT 0,
  sodium NUMERIC DEFAULT 0,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own meals" ON public.meals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meals" ON public.meals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meals" ON public.meals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meals" ON public.meals FOR DELETE USING (auth.uid() = user_id);

-- Weight logs table
CREATE TABLE public.weight_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weight logs" ON public.weight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own weight logs" ON public.weight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own weight logs" ON public.weight_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own weight logs" ON public.weight_logs FOR DELETE USING (auth.uid() = user_id);

-- Groups table
CREATE TABLE public.groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  invite_code text NOT NULL DEFAULT substr(md5(random()::text), 1, 8),
  created_by uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(invite_code)
);

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view groups" ON public.groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create groups" ON public.groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update their groups" ON public.groups FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Creators can delete their groups" ON public.groups FOR DELETE TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Members can view group members" ON public.group_members FOR SELECT TO authenticated USING (group_id IN (SELECT group_id FROM public.group_members gm WHERE gm.user_id = auth.uid()));
CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON public.group_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Storage bucket for photos
INSERT INTO storage.buckets (id, name, public) VALUES ('photos', 'photos', true);

CREATE POLICY "Anyone can view photos" ON storage.objects FOR SELECT USING (bucket_id = 'photos');
CREATE POLICY "Authenticated users can upload photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'photos');
CREATE POLICY "Users can update their own photos" ON storage.objects FOR UPDATE USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own photos" ON storage.objects FOR DELETE USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);
