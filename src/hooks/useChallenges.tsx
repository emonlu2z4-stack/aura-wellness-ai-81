import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useGroupChallenges(groupId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["group-challenges", groupId],
    queryFn: async () => {
      if (!groupId) return [];
      const { data: challenges, error } = await supabase
        .from("group_challenges")
        .select("*")
        .eq("group_id", groupId)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch participant counts & user participation
      const challengeIds = (challenges ?? []).map((c) => c.id);
      if (!challengeIds.length) return [];

      const { data: participants, error: pErr } = await supabase
        .from("challenge_participants")
        .select("challenge_id, user_id")
        .in("challenge_id", challengeIds);
      if (pErr) throw pErr;

      return (challenges ?? []).map((c) => {
        const cParticipants = (participants ?? []).filter((p) => p.challenge_id === c.id);
        const endDate = new Date(c.start_date);
        endDate.setDate(endDate.getDate() + c.duration_days);
        const isActive = new Date() <= endDate;
        return {
          ...c,
          participantCount: cParticipants.length,
          hasJoined: cParticipants.some((p) => p.user_id === user?.id),
          endDate: endDate.toISOString().split("T")[0],
          isActive,
        };
      });
    },
    enabled: !!groupId && !!user,
  });
}

export function useCreateChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      group_id: string;
      title: string;
      description: string;
      emoji: string;
      duration_days: number;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { data, error } = await supabase
        .from("group_challenges")
        .insert({ ...params, created_by: user.id })
        .select()
        .single();
      if (error) throw error;

      // Auto-join the creator
      await supabase
        .from("challenge_participants")
        .insert({ challenge_id: data.id, user_id: user.id });

      return data;
    },
    onSuccess: (data) =>
      queryClient.invalidateQueries({ queryKey: ["group-challenges", data.group_id] }),
  });
}

export function useJoinChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ challengeId, groupId }: { challengeId: string; groupId: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("challenge_participants")
        .insert({ challenge_id: challengeId, user_id: user.id });
      if (error) {
        if (error.code === "23505") throw new Error("Already joined!");
        throw error;
      }
      return groupId;
    },
    onSuccess: (groupId) =>
      queryClient.invalidateQueries({ queryKey: ["group-challenges", groupId] }),
  });
}

export function useLeaveChallenge() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ challengeId, groupId }: { challengeId: string; groupId: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("challenge_participants")
        .delete()
        .eq("challenge_id", challengeId)
        .eq("user_id", user.id);
      if (error) throw error;
      return groupId;
    },
    onSuccess: (groupId) =>
      queryClient.invalidateQueries({ queryKey: ["group-challenges", groupId] }),
  });
}

export const CHALLENGE_PRESETS = [
  { title: "7-Day No Sugar Challenge", emoji: "🍬", description: "Cut out added sugar for 7 days!", duration_days: 7 },
  { title: "10K Steps Daily", emoji: "🚶", description: "Walk 10,000 steps every day for a week", duration_days: 7 },
  { title: "Drink 8 Glasses of Water", emoji: "💧", description: "Stay hydrated — 8 glasses daily for 7 days", duration_days: 7 },
  { title: "30-Day Protein Challenge", emoji: "💪", description: "Hit your protein target every day for 30 days", duration_days: 30 },
  { title: "No Fast Food Week", emoji: "🥗", description: "Avoid fast food for an entire week", duration_days: 7 },
  { title: "14-Day Calorie Tracking", emoji: "📊", description: "Log every meal for 14 days straight", duration_days: 14 },
];
