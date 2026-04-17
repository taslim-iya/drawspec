import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const { prompt, apiKey: clientKey } = req.body;
  const OPENAI_KEY = clientKey || process.env.OPENAI_API_KEY || '';
  if (!OPENAI_KEY) return res.status(200).json({ error: 'No API key configured. Add your OpenAI key in Settings.' });
  if (!prompt) return res.status(400).json({ error: 'Prompt required' });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an engineering drawing specification parser. Convert natural language descriptions of engineering structures into structured JSON for rendering SVG technical drawings.

Output ONLY valid JSON with this structure:
{
  "title": "DRAWING TITLE",
  "type": "tank|basin|pipe|beam|foundation",
  "dimensions": { "key": "value in mm" },
  "features": ["feature descriptions"],
  "materials": ["material specs"],
  "notes": ["engineering notes"]
}

Be precise with dimensions. Convert all units to mm. Include all structural elements mentioned.`,
          },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: 0.1,
      }),
    });
    const data = await response.json();
    return res.status(200).json(data.choices?.[0]?.message || { error: 'No response' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
