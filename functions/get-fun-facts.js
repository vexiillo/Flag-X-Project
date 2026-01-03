export async function onRequestPost(context) {
    try {
        // 1. Ambil data dari request body (Format Cloudflare)
        const { countryName, language } = await context.request.json();
        
        // 2. Ambil API Key dari Environment Variable (cara Cloudflare)
        const apiKey = context.env.GEMINI_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: "API Key tidak ditemukan di server" }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 3. Logika Bahasa
        const targetLangName = (language === 'id') ? "Indonesian" : "English";

        // 4. Panggil Gemini API
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const geminiResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ 
                        text: `Write 1 short unique fun fact about the flag or the country itself of ${countryName}. Your response MUST be in ${targetLangName}. Maximum 2 sentences.` 
                    }]
                }]
            })
        });

        const data = await geminiResponse.json();
        
        if (data.error) {
            return new Response(JSON.stringify({ error: data.error.message }), {
                status: 500,
                headers: { "Content-Type": "application/json" }
            });
        }

        // 5. Ambil teks hasil
        const factText = data.candidates[0].content.parts[0].text;

        // 6. Kembalikan Response Sukses
        return new Response(JSON.stringify({ fact: factText }), {
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
