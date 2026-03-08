
-- Create a security definer function to check group membership without triggering RLS
CREATE OR REPLACE FUNCTION public.user_group_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT group_id FROM public.group_members WHERE user_id = _user_id;
$$;

-- Fix the recursive SELECT policy on group_members
DROP POLICY "Members can view group members" ON public.group_members;
CREATE POLICY "Members can view group members" ON public.group_members
  FOR SELECT TO authenticated
  USING (group_id IN (SELECT public.user_group_ids(auth.uid())));

-- Also fix group_challenges SELECT policy which has the same recursion issue
DROP POLICY "Group members can view challenges" ON public.group_challenges;
CREATE POLICY "Group members can view challenges" ON public.group_challenges
  FOR SELECT TO authenticated
  USING (group_id IN (SELECT public.user_group_ids(auth.uid())));

-- Fix challenge_participants SELECT policy too
DROP POLICY "Group members can view participants" ON public.challenge_participants;
CREATE POLICY "Group members can view participants" ON public.challenge_participants
  FOR SELECT TO authenticated
  USING (challenge_id IN (
    SELECT gc.id FROM public.group_challenges gc
    WHERE gc.group_id IN (SELECT public.user_group_ids(auth.uid()))
  ));

-- Fix group_challenges INSERT policy
DROP POLICY "Group members can create challenges" ON public.group_challenges;
CREATE POLICY "Group members can create challenges" ON public.group_challenges
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    AND group_id IN (SELECT public.user_group_ids(auth.uid()))
  );
