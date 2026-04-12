import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { messages, model = 'gpt-4o-mini', stream = false } = await req.json()

    const aiApiKey = Deno.env.get('AI_API_KEY')
    if (!aiApiKey) {
      throw new Error('AI_API_KEY not set')
    }

    // Forward to OpenAI-compatible API (OpenAI/Groq/etc)
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
      }),
    })

    let result
    if (stream) {
      // Stream response
      result = new ReadableStream({
        async start(controller) {
          const reader = aiResponse.body?.getReader()
          while (true) {
            const { done, value } = await reader?.read() ?? { done: true }
            if (done) break
            controller.enqueue(value)
          }
          controller.close()
        }
      })
    } else {
      result = await aiResponse.json()
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json;charset=UTF-8' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
