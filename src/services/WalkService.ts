
import { Zap, MapPin, Gift, Bone, Coffee } from "lucide-react";

export interface WalkCampaign {
    id: number;
    title: string;
    reward: string;
    desc: string;
    color: string;
    icon: any; // Lucide icon component
}

export interface WalkDeal {
    id: number;
    title: string;
    business: string;
    distance: string;
    color: string;
    icon: string;
    lat?: number;
    lng?: number;
}

export interface POI {
    id: number | string;
    name: string;
    type: 'cafe' | 'petshop' | 'park' | 'vet' | 'custom';
    category: string;
    rating: number;
    distance: string;
    image?: string;
    description?: string;
    lat: number;
    lng: number;
    isPremium?: boolean;
    deal?: string;
    reviews?: { user: string; comment: string; rating: number }[];
}

class WalkService {
    // Mock Campaigns
    async getActiveCampaigns(): Promise<WalkCampaign[]> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return [
            { id: 1, title: "Sabah Koşusu", reward: "x2 XP", desc: "08:00 - 10:00 arası", color: "bg-orange-500", icon: Zap },
            { id: 2, title: "PetsTore Ziyareti", reward: "50 MP", desc: "Caddebostan Şubesi", color: "bg-blue-500", icon: MapPin },
            { id: 3, title: "Hazine Avı", reward: "?? MP", desc: "Harita Gizemi", color: "bg-purple-500", icon: Gift },
        ];
    }

    // Mock Nearby Deals
    async getNearbyDeals(lat?: number, lng?: number): Promise<WalkDeal[]> {
        await new Promise(resolve => setTimeout(resolve, 600));
        return [
            { id: 1, title: "Ücretsiz Ödül Maması", business: "PetHaus Moda", distance: "150m", color: "from-orange-400 to-red-500", icon: "🦴" },
            { id: 2, title: "%20 Kahve İndirimi", business: "Espressolab", distance: "300m", color: "from-indigo-400 to-purple-500", icon: "☕" },
            { id: 3, title: "2 Al 1 Öde Oyuncak", business: "PatiStore", distance: "500m", color: "from-green-400 to-teal-500", icon: "🧸" },
        ];
    }

    // Advanced POI Fetching (Phase 3 Prep)
    async getNearbyPOIs(lat: number, lng: number): Promise<POI[]> {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Generate dynamic POIs relative to user location to simulate "real" nearby places
        return [
            {
                id: 1, name: "Espressolab", type: "cafe", lat: lat + 0.001, lng: lng + 0.001, category: "Kafe", rating: 4.8, distance: "120m",
                image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=200&auto=format&fit=crop",
                description: "Köpeğinizle birlikte kahve keyfi yapabileceğiniz harika bir mekan.",
                isPremium: true,
                deal: "Ücretsiz Kurabiye",
                reviews: [
                    { user: "Ayşe K.", comment: "Latte harika, köpeğim için su kabı getirdiler.", rating: 5 },
                    { user: "Caner E.", comment: "Hafta sonu kalabalık ama çok keyifli.", rating: 4 }
                ]
            },
            {
                id: 2, name: "PetHaus", type: "petshop", lat: lat - 0.001, lng: lng + 0.0005, category: "Pet Shop", rating: 4.9, distance: "250m",
                image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=200&auto=format&fit=crop",
                description: "En kaliteli mamalar ve oyuncaklar burada.",
                reviews: [
                    { user: "Selin B.", comment: "Çok ilgili personel.", rating: 5 }
                ]
            },
            {
                id: 3, name: "Moda Parkı", type: "park", lat: lat + 0.0005, lng: lng - 0.001, category: "Park", rating: 4.7, distance: "400m",
                image: "https://images.unsplash.com/photo-1596230529625-7ee12f94d3fd?q=80&w=200&auto=format&fit=crop",
                description: "Deniz manzaralı, geniş çim alanlı köpek dostu park.",
            },
             {
                id: 4, name: "VetLife", type: "vet", lat: lat - 0.0005, lng: lng - 0.0005, category: "Veteriner", rating: 4.5, distance: "600m",
                image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=200&auto=format&fit=crop",
                description: "7/24 Acil hizmet veren tam donanımlı klinik.",
            },
        ];
    }
}

export const walkService = new WalkService();
