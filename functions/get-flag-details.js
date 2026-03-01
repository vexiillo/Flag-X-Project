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
        const systemPrompt = `You are a strict vexillology and geography data API. 
        Provide factual data for "${countryName}". 
        You MUST respond ONLY with a raw JSON object. Do not include markdown formatting like \`\`\`json.
        The JSON MUST contain these exact keys: "capital", "established", "population", "region", "language", "vexillology".
        For "vexillology", provide a short 2-sentence explanation of the flag's colors/symbols.
        Translate all values into ${targetLangName}. If a specific data point is completely unknown/not applicable, use "Unknown" or "-".`;

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
