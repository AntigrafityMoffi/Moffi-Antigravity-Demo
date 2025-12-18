require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testConnection() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTest = [
        'gemini-flash-latest',
        'gemini-pro-latest',
        'gemini-1.5-flash-latest'
    ];

    console.log('Testing Models (Aliases)...');

    for (const modelName of modelsToTest) {
        process.stdout.write(`Testing: ${modelName}... `);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`✅ SUCCESS! SDK is working with ${modelName}`);
            console.log(`   Response: ${response.text()}`);
            return; // Success
        } catch (err) {
            console.log(`❌ Failed (${err.status || 'Error'}: ${err.message.split('[')[0]})`);
            if (err.message.includes('429')) console.log('   (Quota/Rate Limit Exceeded)');
        }
    }
}

testConnection();
