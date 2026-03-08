
-- Group challenges table
CREATE TABLE public.group_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  emoji text NOT NULL DEFAULT '🏆',
  duration_days integer NOT NULL DEFAULT 7,
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.group_challenges ENABLE ROW LEVEL SECURITY;

-- Only group members can view challenges
CREATE POLICY "Group members can view challenges" ON public.group_challenges
  FOR SELECT TO authenticated
  USING (group_id IN (SELECT gm.group_id FROM public.group_members gm WHERE gm.user_id = auth.uid()));

-- Group members can create challenges
CREATE POLICY "Group members can create challenges" ON public.group_challenges
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND group_id IN (SELECT gm.group_id FROM public.group_members gm WHERE gm.user_id = auth.uid())
  );

-- Creator can delete their challenge
CREATE POLICY "Creators can delete challenges" ON public.group_challenges
  FOR DELETE TO authenticated
  USING (auth.uid() = created_by);

-- Challenge participants table
CREATE TABLE public.challenge_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.group_challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  joined_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id)
);

ALTER TABLE public.challenge_participants ENABLE ROW LEVEL SECURITY;

-- Group members can see participants of challenges in their groups
CREATE POLICY "Group members can view participants" ON public.challenge_participants
  FOR SELECT TO authenticated
  USING (challenge_id IN (
    SELECT gc.id FROM public.group_challenges gc
    WHERE gc.group_id IN (SELECT gm.group_id FROM public.group_members gm WHERE gm.user_id = auth.uid())
  ));

-- Users can join challenges
CREATE POLICY "Users can join challenges" ON public.challenge_participants
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can leave challenges
CREATE POLICY "Users can leave challenges" ON public.challenge_participants
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
