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

// ── Check-in hooks ──

export function useCheckin(challengeId: string | undefined) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: checkedInToday = false } = useQuery({
    queryKey: ["challenge-checkin-today", challengeId, today],
    queryFn: async () => {
      if (!challengeId || !user) return false;
      const { data } = await supabase
        .from("challenge_checkins")
        .select("id")
        .eq("challenge_id", challengeId)
        .eq("user_id", user.id)
        .eq("date", today)
        .maybeSingle();
      return !!data;
    },
    enabled: !!challengeId && !!user,
  });

  const checkin = useMutation({
    mutationFn: async () => {
      if (!user || !challengeId) throw new Error("Not ready");
      const { error } = await supabase
        .from("challenge_checkins")
        .insert({ challenge_id: challengeId, user_id: user.id });
      if (error) {
        if (error.code === "23505") throw new Error("Already checked in today!");
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenge-checkin-today", challengeId] });
      queryClient.invalidateQueries({ queryKey: ["challenge-leaderboard", challengeId] });
    },
  });

  return { checkedInToday, checkin };
}

// ── Leaderboard hook ──

export interface LeaderboardEntry {
  user_id: string;
  name: string;
  currentStreak: number;
  totalCheckins: number;
}

export function useLeaderboard(challengeId: string | undefined) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["challenge-leaderboard", challengeId],
    queryFn: async () => {
      if (!challengeId) return [];

      // Get all checkins for this challenge
      const { data: checkins, error } = await supabase
        .from("challenge_checkins")
        .select("user_id, date")
        .eq("challenge_id", challengeId)
        .order("date", { ascending: true });
      if (error) throw error;

      // Get participant user IDs
      const { data: participants } = await supabase
        .from("challenge_participants")
        .select("user_id")
        .eq("challenge_id", challengeId);

      const userIds = [...new Set([
        ...(checkins ?? []).map((c) => c.user_id),
        ...(participants ?? []).map((p) => p.user_id),
      ])];

      if (!userIds.length) return [];

      // Get profile names
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", userIds);

      const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p.name || "Anonymous"]));

      // Calculate streaks per user
      const userCheckins = new Map<string, string[]>();
      for (const c of checkins ?? []) {
        if (!userCheckins.has(c.user_id)) userCheckins.set(c.user_id, []);
        userCheckins.get(c.user_id)!.push(c.date);
      }

      const entries: LeaderboardEntry[] = userIds.map((uid) => {
        const dates = (userCheckins.get(uid) ?? []).sort();
        const totalCheckins = dates.length;
        let currentStreak = 0;

        if (dates.length > 0) {
          // Calculate current streak (consecutive days ending today or yesterday)
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);

          const lastDate = new Date(dates[dates.length - 1] + "T00:00:00");
          if (lastDate >= yesterday) {
            currentStreak = 1;
            for (let i = dates.length - 2; i >= 0; i--) {
              const curr = new Date(dates[i + 1] + "T00:00:00");
              const prev = new Date(dates[i] + "T00:00:00");
              const diff = (curr.getTime() - prev.getTime()) / 86400000;
              if (diff === 1) {
                currentStreak++;
              } else {
                break;
              }
            }
          }
        }

        return {
          user_id: uid,
          name: profileMap.get(uid) ?? "Anonymous",
          currentStreak,
          totalCheckins,
        };
      });

      // Sort by current streak desc, then total checkins desc
      entries.sort((a, b) => b.currentStreak - a.currentStreak || b.totalCheckins - a.totalCheckins);
      return entries;
    },
    enabled: !!challengeId && !!user,
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
