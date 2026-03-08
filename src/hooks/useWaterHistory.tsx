import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useWaterHistory(days: number = 7) {
  const { user } = useAuth();
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - (days - 1));

  const startStr = startDate.toISOString().split("T")[0];

  return useQuery({
    queryKey: ["water-history", user?.id, days, startStr],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("water_intake")
        .select("date, glasses")
        .eq("user_id", user.id)
        .gte("date", startStr)
        .order("date", { ascending: true });
      if (error) throw error;

      // Fill in missing days with 0
      const map = new Map((data ?? []).map(d => [d.date, d.glasses]));
      const result: { date: string; glasses: number; label: string }[] = [];
      for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(startDate.getDate() + i);
        const dateStr = d.toISOString().split("T")[0];
        result.push({
          date: dateStr,
          glasses: map.get(dateStr) ?? 0,
          label: d.toLocaleDateString("en-US", { weekday: "short" }),
        });
      }
      return result;
    },
    enabled: !!user,
  });
}
