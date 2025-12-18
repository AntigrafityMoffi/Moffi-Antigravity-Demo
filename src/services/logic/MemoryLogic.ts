import { DayContext, MemoryMoment, WeatherState } from "@/types/domain";

// STOCK PHOTOS MAPPING
const STOCK_PHOTOS = {
    walk: [
        "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=400", // Running dog
        "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=400"  // Park
    ],
    food: [
        "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=400", // Eating
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400"  // Treats
    ],
    vet: [
        "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=400", // Vet
        "https://images.unsplash.com/photo-1598133894008-61f7fdb8cc2a?q=80&w=400"  // Rest
    ],
    social: [
        "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=400", // Cuddling
        "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400"  // Playing
    ],
    cozy_rain: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=400", // Rainy window
    cozy_default: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=400" // Sleeping
};

export class MemoryLogic {

    // Main Rule: Generate moments ONLY based on actual facts
    static determineMoments(context: DayContext): MemoryMoment[] {
        const moments: MemoryMoment[] = [];

        // 1. HEALTH / VET (Highest Priority)
        if (context.vetVisit) {
            moments.push({
                id: 'mom_vet',
                type: 'vet',
                priority: 1,
                title: 'Korkusuz Kahraman',
                story: "Bugün veterinerdeydik. Çok cesurdum! (Tamam, biraz titredim). Eve gelince ödülümü kaptım. 🩺",
                mediaUrl: STOCK_PHOTOS.vet[0]
            });
        }

        // 2. SOCIAL (High Priority)
        if (context.socialInteractions > 0) {
            moments.push({
                id: 'mom_social',
                type: 'social',
                priority: 2,
                title: 'Sevgi Dolu Bir Gün',
                story: `Bugün evde şenlik vardı! ${context.socialInteractions} kez oyun oynadık. Kucaktan kucağa gezdim. 🥰`,
                mediaUrl: STOCK_PHOTOS.social[0]
            });
        }

        // 3. ACTIVITY / WALK
        if (context.walkDistance > 0.5) {
            const isLongWalk = context.walkDistance > 3;
            moments.push({
                id: 'mom_walk',
                type: 'walk',
                priority: 3,
                title: isLongWalk ? 'Büyük Macera' : 'Günlük Devriye',
                story: isLongWalk
                    ? `Bugün rekor kırdık! Tam ${context.walkDistance.toFixed(1)} km yürüdük. Her ağaca imzamı attım. 🌳🐕`
                    : `Mahallede kısa bir tur attık. ${context.walkDistance.toFixed(1)} km yetti, hava mis gibiydi.`,
                mediaUrl: STOCK_PHOTOS.walk[isLongWalk ? 0 : 1]
            });
        }

        // 4. FOOD
        if (context.foodCount > 2) {
            moments.push({
                id: 'mom_food',
                type: 'food',
                priority: 4,
                title: 'Lezzet Şöleni',
                story: "Bugün karnım bayram etti! Sahibim ekstra cömertti, ödül mamalarını sayamadım bile. 🍖",
                mediaUrl: STOCK_PHOTOS.food[0]
            });
        }

        // 5. FALLBACK RULE: COZY MODE
        // If NO significant moments were generated, create a "Cozy" moment based on weather
        if (moments.length === 0) {
            const isRainy = context.weather.condition === 'rainy';
            moments.push({
                id: 'mom_cozy',
                type: 'cozy',
                priority: 5,
                title: isRainy ? 'Yağmurlu ve Huzurlu' : 'Tembellik Günü',
                story: isRainy
                    ? "Yağmur cama vururken battaniyeme sarıldım. Dışarı çıkmadık ama evde huzur bulduk. 🌧️💤"
                    : "Bugün tam bir ev kuşuydum. Bol bol uyudum, enerji topladım. Bazen hiçbir şey yapmamak en iyisi! 🛋️",
                mediaUrl: isRainy ? STOCK_PHOTOS.cozy_rain : STOCK_PHOTOS.cozy_default
            });
        }

        return moments.sort((a, b) => a.priority - b.priority);
    }

    static determineMood(moments: MemoryMoment[]): 'happy' | 'tired' | 'excited' | 'cozy' {
        // Simple heuristic based on the 'highest priority' moment type found
        const types = moments.map(m => m.type);
        if (types.includes('vet')) return 'tired';
        if (types.includes('walk')) return 'excited';
        if (types.includes('social') || types.includes('food')) return 'happy';
        return 'cozy';
    }
}
