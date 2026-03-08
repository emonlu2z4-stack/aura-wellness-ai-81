
-- Daily check-ins for challenge participants
CREATE TABLE public.challenge_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id uuid NOT NULL REFERENCES public.group_challenges(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(challenge_id, user_id, date)
);

ALTER TABLE public.challenge_checkins ENABLE ROW LEVEL SECURITY;

-- View: group members can see all checkins for challenges in their groups
CREATE POLICY "Group members can view checkins" ON public.challenge_checkins
  FOR SELECT TO authenticated
  USING (challenge_id IN (
    SELECT gc.id FROM public.group_challenges gc
    WHERE gc.group_id IN (SELECT public.user_group_ids(auth.uid()))
  ));

-- Insert: participants can check in
CREATE POLICY "Participants can check in" ON public.challenge_checkins
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND challenge_id IN (
      SELECT cp.challenge_id FROM public.challenge_participants cp WHERE cp.user_id = auth.uid()
    )
  );

-- Delete: users can undo their own checkins
CREATE POLICY "Users can delete own checkins" ON public.challenge_checkins
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
