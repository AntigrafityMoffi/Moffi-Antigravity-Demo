
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyBnUBpO38MhK4lImGdzk0xVcus73JXGoTQ";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // There isn't a direct "listModels" on the instance in some SDK versions comfortably accessible,
        // but usually we can infer from a simple generation attempt or use the client directly if exposed.
        // Actually, newer SDKs don't expose listModels easily on the helper, but the API supports it.

        // Let's try to just generate "Hello" with a few likely candidates to see which one succeeds.
        const candidates = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-latest",
            "gemini-1.5-pro",
            "gemini-pro",
            "gemini-1.0-pro"
        ];

        console.log("Checking models...");

        for (const modelName of candidates) {
            try {
                console.log(`Testing ${modelName}...`);
                const m = genAI.getGenerativeModel({ model: modelName });
                const result = await m.generateContent("Hello");
                const response = await result.response;
                console.log(`SUCCESS with ${modelName}:`, response.text());
                return; // Found one!
            } catch (e) {
                console.error(`FAILED ${modelName}:`, e.message.split(':')[0]);
            }
        }
    } catch (error) {
        console.error("Global Error:", error);
    }
}

listModels();
