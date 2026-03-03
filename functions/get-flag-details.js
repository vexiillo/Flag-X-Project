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
        const systemPrompt = `You are an expert vexillologist and historian API. Provide factual data for "${countryName}".
ADAPTIVE DATA RULES:
1. IDENTITY: Determine the category (Official Country, Sub-region, Territory, Historical, Unofficial, or Organization).
2. VEXILLOLOGY: Describe the specific flag of "${countryName}".
   - If there is NO official flag, you MUST write: "There is no official flag" or "Proposed flag/Unofficial flag/Reconstruction/Fan-made flag".
   - If it is a Historical flag and have official flag, then describe the flag. If it is a Historical flag and DO NOT have official flag, then describe the symbols used during its era.
   - NEVER describe the parent country's flag for a sub-region or territory.
3. DYNAMIC VALUES:
   - "capital": For organizations, use "Headquarters". For historical entities, use the capital at its peak.
   - "population": Use current data, historical estimates, or "-" if not applicable.
   - "region": For organizations, use "Global/International".
STRICT OUTPUT: Respond ONLY with raw JSON. No markdown. Translate all values to ${targetLangName}.
JSON STRUCTURE:
{ "capital": "string", "established": "string", "population": "string", "region": "string", "language": "string", "vexillology": "string" }`;

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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
