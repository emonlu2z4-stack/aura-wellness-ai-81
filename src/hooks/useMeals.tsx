import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useTodayMeals() {
  const { user } = useAuth();
  const today = new Date().toISOString().split("T")[0];

  return useQuery({
    queryKey: ["meals", user?.id, today],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useAddMeal() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (meal: {
      name: string;
      calories: number;
      protein: number;
      carbs: number;
      fats: number;
      fiber?: number;
      sugar?: number;
      sodium?: number;
      photo_url?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("meals").insert({
        ...meal,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["meals"] }),
  });
}

export function useDeleteMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mealId: string) => {
      const { error } = await supabase.from("meals").delete().eq("id", mealId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["meals"] }),
  });
}

export function useWeeklyMeals(weeksAgo: number = 0) {
  const { user } = useAuth();
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay() - weeksAgo * 7);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return useQuery({
    queryKey: ["meals-weekly", user?.id, weeksAgo],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startOfWeek.toISOString().split("T")[0])
        .lt("date", endOfWeek.toISOString().split("T")[0]);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}
