'use server';

import OpenAI from 'openai';

export async function generateImageAction(prompt: string) {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return { success: false, error: "API Key (OPENAI_API_KEY) eksik." };
    }

    // Server-side initialization
    const openai = new OpenAI({
        apiKey: apiKey,
    });

    try {
        console.log("Sunucu tarafında resim üretiliyor:", prompt);

        const response = await openai.images.generate({
            model: "dall-e-3",
            prompt: prompt,
            n: 1,
            size: "1024x1024",
            quality: "standard",
            style: "vivid"
        });

        const url = response.data[0].url;
        if (!url) throw new Error("URL dönmedi");

        return { success: true, url };
    } catch (error: any) {
        console.error("DALL-E Server Error:", error);

        // Return a user-friendly error message based on the exception
        let message = "Resim üretilemedi.";
        if (error?.status === 401) message = "API Anahtarı geçersiz (401).";
        if (error?.status === 429) message = "Bakiye yetersiz veya limit aşıldı (429).";
        if (error?.code === 'billing_hard_limit_reached') message = "Faturalandırma limiti aşıldı.";

        return { success: false, error: message + " " + (error.message || "") };
    }
}
