import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { meals, targets, userName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!meals || meals.length === 0) {
      return new Response(JSON.stringify({ insight: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const totalCals = meals.reduce((s: number, m: any) => s + Number(m.calories), 0);
    const totalProtein = meals.reduce((s: number, m: any) => s + Number(m.protein), 0);
    const totalCarbs = meals.reduce((s: number, m: any) => s + Number(m.carbs), 0);
    const totalFats = meals.reduce((s: number, m: any) => s + Number(m.fats), 0);
    const totalFiber = meals.reduce((s: number, m: any) => s + Number(m.fiber ?? 0), 0);
    const totalSugar = meals.reduce((s: number, m: any) => s + Number(m.sugar ?? 0), 0);

    const mealList = meals.map((m: any) => `- ${m.name}: ${m.calories} cal, P${m.protein}g C${m.carbs}g F${m.fats}g`).join("\n");

    const prompt = `You are a friendly, encouraging nutrition coach. Analyze today's meals for ${userName || "the user"} and give ONE short, actionable insight (2-3 sentences max). Be specific about what they ate. Use an emoji.

Today's meals:
${mealList}

Totals: ${totalCals} cal, ${totalProtein}g protein, ${totalCarbs}g carbs, ${totalFats}g fats, ${totalFiber}g fiber, ${totalSugar}g sugar
Daily targets: ${targets.calories} cal, ${targets.protein}g protein, ${targets.carbs}g carbs, ${targets.fats}g fats

Give a brief, personalized tip. Focus on what's going well OR one thing to improve. Keep it motivating.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a concise nutrition coach. Reply with ONLY the insight text, no headers or labels." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const insight = data.choices?.[0]?.message?.content?.trim() || null;

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("nutrition-insights error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
