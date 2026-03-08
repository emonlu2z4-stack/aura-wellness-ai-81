
-- water_intake
DROP POLICY "Users can view own water intake" ON public.water_intake;
DROP POLICY "Users can insert own water intake" ON public.water_intake;
DROP POLICY "Users can update own water intake" ON public.water_intake;
CREATE POLICY "Users can view own water intake" ON public.water_intake FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own water intake" ON public.water_intake FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own water intake" ON public.water_intake FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- meals
DROP POLICY "Users can view their own meals" ON public.meals;
DROP POLICY "Users can insert their own meals" ON public.meals;
DROP POLICY "Users can update their own meals" ON public.meals;
DROP POLICY "Users can delete their own meals" ON public.meals;
CREATE POLICY "Users can view their own meals" ON public.meals FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own meals" ON public.meals FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own meals" ON public.meals FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own meals" ON public.meals FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- profiles
DROP POLICY "Users can view their own profile" ON public.profiles;
DROP POLICY "Users can insert their own profile" ON public.profiles;
DROP POLICY "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- weight_logs
DROP POLICY "Users can view their own weight logs" ON public.weight_logs;
DROP POLICY "Users can insert their own weight logs" ON public.weight_logs;
DROP POLICY "Users can update their own weight logs" ON public.weight_logs;
DROP POLICY "Users can delete their own weight logs" ON public.weight_logs;
CREATE POLICY "Users can view their own weight logs" ON public.weight_logs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own weight logs" ON public.weight_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own weight logs" ON public.weight_logs FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own weight logs" ON public.weight_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- progress_photos
DROP POLICY "Users can view own progress photos" ON public.progress_photos;
DROP POLICY "Users can insert own progress photos" ON public.progress_photos;
DROP POLICY "Users can delete own progress photos" ON public.progress_photos;
CREATE POLICY "Users can view own progress photos" ON public.progress_photos FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress photos" ON public.progress_photos FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own progress photos" ON public.progress_photos FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- groups
DROP POLICY "Authenticated users can view groups" ON public.groups;
DROP POLICY "Users can create groups" ON public.groups;
DROP POLICY "Creators can update their groups" ON public.groups;
DROP POLICY "Creators can delete their groups" ON public.groups;
CREATE POLICY "Authenticated users can view groups" ON public.groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create groups" ON public.groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update their groups" ON public.groups FOR UPDATE TO authenticated USING (created_by = auth.uid());
CREATE POLICY "Creators can delete their groups" ON public.groups FOR DELETE TO authenticated USING (created_by = auth.uid());

-- group_members
DROP POLICY "Members can view group members" ON public.group_members;
DROP POLICY "Users can join groups" ON public.group_members;
DROP POLICY "Users can leave groups" ON public.group_members;
CREATE POLICY "Members can view group members" ON public.group_members FOR SELECT TO authenticated USING (group_id IN (SELECT gm.group_id FROM group_members gm WHERE gm.user_id = auth.uid()));
CREATE POLICY "Users can join groups" ON public.group_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave groups" ON public.group_members FOR DELETE TO authenticated USING (auth.uid() = user_id);
