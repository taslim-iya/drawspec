import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { message, currentSpec, history, apiKey: clientKey } = req.body;
  const OPENAI_KEY = clientKey || process.env.OPENAI_API_KEY || '';
  if (!OPENAI_KEY) return res.status(200).json({ error: 'No API key configured. Add your OpenAI key in Settings.' });
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const specStr = JSON.stringify(currentSpec, null, 2);

    const systemPrompt = `You are an engineering drawing editor AI. The user has a technical drawing represented as a JSON spec. They will describe modifications in plain English and you must return the UPDATED spec.

CURRENT DRAWING SPEC:
\`\`\`json
${specStr}
\`\`\`

RULES:
1. Return ONLY a JSON object with two keys: "updatedSpec" (the full modified drawing spec) and "explanation" (1-2 sentences describing what you changed)
2. Preserve ALL existing elements unless the user explicitly asks to remove them
3. When adding shapes, use the same coordinate system as existing shapes
4. For dimensions, generate proper extension lines with offsets
5. Keep units consistent (the spec uses ${currentSpec.unit || 'mm'})
6. Update the titleBlock revision by incrementing (P01 → P02, etc.)
7. Be precise with engineering terminology
8. If the request is unclear, set "updatedSpec" to null and explain in "explanation"

IMPORTANT: Output ONLY valid JSON. No markdown, no code fences, no explanation outside the JSON.`;

    const messages: any[] = [{ role: 'system', content: systemPrompt }];

    // Add conversation history for context
    if (history?.length) {
      for (const h of history.slice(-4)) {
        messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
      }
    }

    messages.push({ role: 'user', content: message });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        max_tokens: 8000,
        temperature: 0.1,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(200).json({ error: 'No response from AI' });
    }

    const parsed = JSON.parse(content);
    return res.status(200).json({
      updatedSpec: parsed.updatedSpec || null,
      explanation: parsed.explanation || 'Drawing updated.',
    });
  } catch (err: any) {
    return res.status(200).json({ error: `Failed: ${err.message}` });
  }
}
