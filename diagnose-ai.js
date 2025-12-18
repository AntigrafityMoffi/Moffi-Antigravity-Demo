
const https = require('https');

const API_KEY = "AIzaSyBnUBpO38MhK4lImGdzk0xVcus73JXGoTQ";
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Querying Google API for available models...");

https.get(url, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            if (json.error) {
                console.error("API Error:", JSON.stringify(json.error, null, 2));
            } else {
                console.log("Available Models:");
                if (json.models) {
                    json.models.forEach(m => {
                        if (m.supportedGenerationMethods.includes("generateContent")) {
                            console.log(`- ${m.name}`);
                        }
                    });
                } else {
                    console.log("No models found.");
                }
            }
        } catch (e) {
            console.error("Parse Error:", e.message);
            console.log("Raw Data:", data);
        }
    });

}).on("error", (err) => {
    console.error("Network Error:", err.message);
});
