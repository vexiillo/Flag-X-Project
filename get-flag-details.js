// functions/get-flag-details.js

export async function onRequestPost(context) {
    try {
        const { countryName, language } = await context.request.json();
        const apiKey = context.env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API Key tidak ditemukan" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        const targetLangName = (language === 'id') ? "Indonesian" : "English";

        // Prompt Sistem - Memaksa Gemini merespons HANYA dengan JSON mentah
        const systemPrompt = `You are a strict vexillology and geography data API. Provide factual, contextual, and precise data for "${countryName}".

INTERNAL PROCESSING (DO NOT OUTPUT):
1. DISAMBIGUATION: Analyze "${countryName}". 
   - If multiple locations share this name (e.g., Adrar), prioritize the most prominent modern administrative division unless a specific country/context is hinted.
   - For names like "Badakhshan", default to the current administrative province (Afghanistan) unless "historical region" is explicitly mentioned.
2. CATEGORIZATION: Classify as Official Country, Sub-region, Historical Entity, World Organization, or Unofficial.
3. DATA RETRIEVAL:
   - For "World Organization": Map "Headquarters" to the "capital" field.
   - For Sub-regions/Historical/Unofficial/World Organizations: Use "N/A" for unknown statistical data.
4. VEXILLOLOGY LOGIC: 
   - Primary: Describe official flag + Meaning/Symbolism.
   - Fallback (Sub-region/Historical): If no flag exists, describe the Official Emblem/Coat of Arms + Meaning.
   - Final Fallback: If neither exists, write "There is no official flag of ${countryName}. The flag shown is an unofficial flag.".

STRICT RULES:
- NEVER start the "vexillology" description with the entity type (e.g., NO "This is a province...").
- NEVER describe the parent country's flag for a sub-region.
- Ensure "vexillology" includes both physical appearance and the symbolic meaning of colors/icons.
- Translate ALL values to ${targetLangName}.

STRICT OUTPUT: Respond ONLY with a raw JSON object. No markdown, no intro.

JSON STRUCTURE:
{
  "capital": "string",
  "established": "string",
  "population": "string",
  "region": "string",
  "language": "string",
  "vexillology": "string"
}`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt }] }],
                generationConfig: {
                    temperature: 0.2, // Temperature rendah agar tidak halusinasi/mengubah format JSON
                }
            })
        });

        const data = await geminiResponse.json();
        
        if (data.error) {
            return new Response(JSON.stringify({ error: data.error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // Gemini kadang tetap mengembalikan ```json di awal teks, kita bersihkan dulu:
        let rawText = data.candidates[0].content.parts[0].text;
        rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        const jsonResult = JSON.parse(rawText);

        return new Response(JSON.stringify(jsonResult), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
