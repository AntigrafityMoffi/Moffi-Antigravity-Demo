import { google } from '@ai-sdk/google';
import { streamText, generateText } from 'ai';

export const maxDuration = 30;

// Helper to simulate a stream for fallback
function createMockStream(text: string) {
    const encoder = new TextEncoder();
    return new ReadableStream({
        async start(controller) {
            // Simulate token delay
            const tokens = text.split(' ');
            for (const token of tokens) {
                controller.enqueue(encoder.encode(token + ' '));
                await new Promise(r => setTimeout(r, 50));
            }
            controller.close();
        }
    });
}

export async function POST(req: Request) {
    let messages = [];
    try {
        console.log("AI Route: Received request");

        // --- DEBUG PROBE (Via Query Param) ---
        const url = new URL(req.url);
        const testMode = url.searchParams.get('test');

        if (testMode === 'generation') {
            const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
            console.log("AI Route: Processing Test Generation Probe");

            try {
                // FALLBACK ATTEMPT 1: Gemini Pro
                const genResult = await generateText({
                    model: google('gemini-pro'),
                    prompt: 'Say "Hello"',
                });

                return new Response(JSON.stringify({
                    status: 'success',
                    message: 'AI Generation Successful!',
                    output: genResult.text,
                    envCheck: { hasApiKey: !!apiKey }
                }), { status: 200, headers: { 'Content-Type': 'application/json' } });

            } catch (e: any) {
                console.error("AI Route Probe Error:", e);
                // Return descriptive error but don't crash
                return new Response(JSON.stringify({
                    status: 'error',
                    message: 'Manual Test Failed',
                    errorDetails: e.message
                }), { status: 200, headers: { 'Content-Type': 'application/json' } });
            }
        }

        // --- NORMAL CHAT FLOW ---
        const body = await req.json();
        messages = body.messages || [];
        const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

        if (!apiKey) {
            throw new Error("Missing API Key");
        }

        console.log("AI Route: Attempting real AI stream with gemini-pro");

        const result = streamText({
            model: google('gemini-pro'),
            messages,
            system: `Sen MoffiPet uygulamasının akıllı asistanısın. Adın Moffi AI.`,
        });

        return result.toDataStreamResponse();

    } catch (error: any) {
        console.error("AI Route Critical Failure:", error);

        // --- EMERGENCY FALLBACK MODE ---
        // If ANYTHING goes wrong (Key invalid, Model 404, Quota), we fallback to Mock
        // This keeps the user expirience intact.

        console.log("Activating Offline Fallback Mode");

        // Determine a simple mock answer based on last user message
        const lastMsg = messages.length > 0 ? messages[messages.length - 1].content.toLowerCase() : "";
        let fallbackText = "Şu anda Google bağlantımda geçici bir sorun var (Offline Mod). Ama seni duyabiliyorum! 🛠️ ";

        if (lastMsg.includes("mama")) fallbackText += "Mama konusunda: Yetişkin köpekler günde 2 kez, yavrular 3-4 kez beslenmeli.";
        else if (lastMsg.includes("aşı")) fallbackText += "Aşı takvimi için Aşı Takibi sayfasına bakabilirsin. Kuduz aşısı yıllık tekrarlanmalı.";
        else if (lastMsg.includes("merhaba")) fallbackText += "Merhaba! Ben Moffi. Bugün sana nasıl yardım edebilirim?";
        else fallbackText += "Sorunu not aldım. İnternet bağlantım düzelince daha detaylı yanıt vereceğim. Şimdilik menüden diğer özelliklere göz atabilirsin! 🐾";

        // Return a mock stream compatible with AI SDK
        // We use the 'result.toDataStreamResponse' equivalent manually for fallback?
        // Actually, streamText can accept a custom model, but let's just return a standard text stream.
        // AI SDK 4.x expects a specific format.
        // EASIEST: Just return a plain text stream, useChat handles it.

        return new Response(createMockStream(fallbackText), {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' } // Plain text stream is supported by useChat as fallback
        });
    }
}
