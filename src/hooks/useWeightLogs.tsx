import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useWeightLogs(days: number = 90) {
  const { user } = useAuth();
  const since = new Date();
  since.setDate(since.getDate() - days);

  return useQuery({
    queryKey: ["weight-logs", user?.id, days],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", since.toISOString().split("T")[0])
        .order("date", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useAddWeightLog() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weight_kg: number) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("weight_logs").insert({
        user_id: user.id,
        weight_kg,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["weight-logs"] }),
  });
}
