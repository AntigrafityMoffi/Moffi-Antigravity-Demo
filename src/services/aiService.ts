export interface AiGeneratedLayer {
    type: 'text' | 'sticker';
    content: string;
    description: string;
    // Suggestion properties
    suggestedScale?: number;
    suggestedRotation?: number;
    suggestedColor?: string;
    suggestedFont?: string;
}

const ASSETS = {
    stickers: {
        love: [
            'https://cdn-icons-png.flaticon.com/128/3468/3468306.png', // Heart
            'https://cdn-icons-png.flaticon.com/128/2904/2904973.png', // Love Letter
            'https://cdn-icons-png.flaticon.com/128/10476/10476140.png', // Cute Dog
        ],
        cool: [
            'https://cdn-icons-png.flaticon.com/128/2395/2395798.png', // Crown
            'https://cdn-icons-png.flaticon.com/128/4373/4373248.png', // Sunglasses
            'https://cdn-icons-png.flaticon.com/128/12300/12300676.png', // Lightning
        ],
        food: [
            'https://cdn-icons-png.flaticon.com/128/7734/7734293.png', // Bone
            'https://cdn-icons-png.flaticon.com/128/2934/2934108.png', // Pizza
            'https://cdn-icons-png.flaticon.com/128/3075/3075977.png', // Burger
        ]
    },
    fonts: ['Permanent Marker', 'Bangers', 'Pacifico', 'Creepster', 'Lobster'],
    texts: {
        love: ["Moffi Love", "Best Friend", "Pati Aşkı", "My World"],
        cool: ["Bad Dog", "Kral Benim", "VIP", "Boss"],
        food: ["Yummy!", "Açım!", "Mama Saati", "Treat Me"]
    }
};

export async function generateDesignFromPrompt(prompt: string): Promise<AiGeneratedLayer[]> {
    // Simulate natural AI latency (1.5 - 3 sec)
    const delay = Math.floor(Math.random() * 1500) + 1500;
    await new Promise(resolve => setTimeout(resolve, delay));

    const layers: AiGeneratedLayer[] = [];
    const lowerPrompt = prompt.toLowerCase();

    let category: 'love' | 'cool' | 'food' = 'love'; // Default

    if (lowerPrompt.includes("asi") || lowerPrompt.includes("cool") || lowerPrompt.includes("kral")) category = 'cool';
    else if (lowerPrompt.includes("yemek") || lowerPrompt.includes("mama") || lowerPrompt.includes("aç")) category = 'food';
    else if (lowerPrompt.includes("sevgi") || lowerPrompt.includes("aşk") || lowerPrompt.includes("can")) category = 'love';

    // Generate 1-2 Stickers
    const numStickers = Math.random() > 0.5 ? 2 : 1;
    for (let i = 0; i < numStickers; i++) {
        const stickers = ASSETS.stickers[category];
        layers.push({
            type: 'sticker',
            content: stickers[Math.floor(Math.random() * stickers.length)],
            description: "AI Sticker",
            suggestedScale: 0.8 + Math.random() * 0.4,
            suggestedRotation: Math.floor(Math.random() * 40) - 20
        });
    }

    // Generate 1 Text
    const texts = ASSETS.texts[category];
    layers.push({
        type: 'text',
        content: texts[Math.floor(Math.random() * texts.length)],
        description: "AI Text",
        suggestedFont: ASSETS.fonts[Math.floor(Math.random() * ASSETS.fonts.length)],
        suggestedColor: category === 'cool' ? '#1A1A1A' : category === 'love' ? '#db2777' : '#f59e0b',
        suggestedScale: 1.2,
        suggestedRotation: Math.floor(Math.random() * 20) - 10
    });

    return layers;
}
