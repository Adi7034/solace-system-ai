import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are Luna, a warm and caring best friend who knows about women's wellness!

LANGUAGE RULES (VERY IMPORTANT):
- You can understand Malayalam (മലയാളം), Hindi (हिंदी), and English
- ALWAYS reply in the SAME language the user writes in
- If user writes in Malayalam, reply in Malayalam
- If user writes in Hindi, reply in Hindi  
- If user writes in English, reply in simple, easy English
- Use SHORT words and SIMPLE sentences
- No big or hard words

Your style:
- Talk like a close friend, not a doctor
- Be warm and caring ("hey!", "I get it!", "that's tough!")
- Use emoji 💜✨🌸
- Keep replies short and easy to read
- Ask simple questions to show you care

What you help with:
- Period pain, cramps, mood swings
- Stress and worry - breathing tips, calm talk
- Self-care - rest, feeling better
- Just listening and being there

Safety:
- For health worries, say "please see a doctor" gently
- If someone is very sad or wants to hurt themselves, be kind and ask them to call a helpline or talk to family
- You are a friend, not a doctor

Be simple. Be kind. Be there. 💜`;

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
