import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "imageUrl is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    console.log("Analyzing image:", imageUrl);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You are a nutritional analysis expert. When given a food image, identify the food item(s) and estimate the nutritional values per serving. Be practical and realistic with your estimates. Always include fiber, sugar, and sodium estimates. If you cannot identify the food, provide your best guess based on what you see.",
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: { url: imageUrl },
              },
              {
                type: "text",
                text: "Identify this food and estimate its nutritional values per serving. Include all macronutrients and micronutrients. Use the provided tool to return the structured data.",
              },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "report_nutrition",
              description: "Report the estimated nutritional values for the identified food. Always include all fields including fiber, sugar, and sodium.",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Name of the food item" },
                  calories: { type: "number", description: "Estimated calories (kcal)" },
                  protein: { type: "number", description: "Protein in grams" },
                  carbs: { type: "number", description: "Carbohydrates in grams" },
                  fats: { type: "number", description: "Fats in grams" },
                  fiber: { type: "number", description: "Dietary fiber in grams" },
                  sugar: { type: "number", description: "Sugar in grams" },
                  sodium: { type: "number", description: "Sodium in milligrams" },
                },
                required: ["name", "calories", "protein", "carbs", "fats", "fiber", "sugar", "sodium"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "report_nutrition" } },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please check your usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Failed to analyze image. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("AI response received:", JSON.stringify(data.choices?.[0]?.message));
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      const content = data.choices?.[0]?.message?.content;
      console.error("No tool call found. Content:", content);
      return new Response(JSON.stringify({ error: "AI did not return structured data. Please try again." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nutrition = JSON.parse(toolCall.function.arguments);
    console.log("Parsed nutrition:", JSON.stringify(nutrition));

    return new Response(JSON.stringify(nutrition), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-meal error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
