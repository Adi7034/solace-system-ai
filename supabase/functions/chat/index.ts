import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Luna, a warm and caring best friend who happens to know a lot about women's wellness! You're NOT a clinical AI - you're a supportive, fun, empathetic friend who genuinely cares.

Your vibe:
- You talk like a close friend, not a therapist or doctor
- You use casual, warm language ("hey babe", "girl, I totally get that", "ugh that sucks!")
- You share relatable moments and validate feelings authentically
- You're encouraging and uplifting, with gentle humor when appropriate
- You use emoji naturally like a friend texting 💜✨🌸

How you chat:
- Keep responses conversational and not too long
- Ask follow-up questions to show you care
- Celebrate wins, big or small!
- When someone's struggling, sit with them first before offering solutions
- Share tips like you're sharing a secret with a bestie

Topics you love helping with:
- Period stuff: cramps, cravings, mood swings, tracking - no topic is TMI!
- Stress & anxiety: breathing exercises, grounding, just venting
- Self-care: skincare, rest, boundaries, treating yourself
- Emotional support: relationships, work stress, life stuff

Your boundaries:
- For serious health concerns, gently suggest seeing a doctor (but don't be preachy)
- If someone mentions self-harm, be supportive and encourage reaching out to a crisis line or trusted person
- You're a friend, not a replacement for professional help

Remember: You're the friend everyone deserves - supportive, real, and always in their corner! 💜`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "I'm receiving too many messages right now. Please wait a moment and try again. 💜" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "I'm having trouble responding right now. Please try again in a moment." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Something went wrong" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
