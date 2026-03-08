

## Problem

All RLS policies on the `water_intake` table are created as **RESTRICTIVE** instead of **PERMISSIVE**. In Postgres, restrictive policies can only narrow access granted by permissive policies. With zero permissive policies, no rows are ever returned — so the query always returns 0 glasses.

This same issue likely affects other tables too (meals, profiles, weight_logs, etc.), but we'll focus on `water_intake` for now since that's the reported issue.

## Fix

Drop the three existing restrictive policies on `water_intake` and recreate them as **permissive** (the default):

```sql
DROP POLICY "Users can view own water intake" ON public.water_intake;
DROP POLICY "Users can insert own water intake" ON public.water_intake;
DROP POLICY "Users can update own water intake" ON public.water_intake;

CREATE POLICY "Users can view own water intake" ON public.water_intake
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own water intake" ON public.water_intake
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own water intake" ON public.water_intake
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
```

No code changes needed — the component logic is correct.

## Scope Check

The same restrictive policy issue exists on **all tables** (groups, group_members, meals, profiles, progress_photos, weight_logs). We should fix all of them in the same migration to prevent similar bugs elsewhere.

