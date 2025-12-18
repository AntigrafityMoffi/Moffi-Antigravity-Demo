import { useState } from "react";
import { IMemoryService } from "@/services/interfaces";
import { MemoryMockService } from "@/services/mock/MemoryMockService";
import { DailyMemory } from "@/types/domain";

const memoryService: IMemoryService = new MemoryMockService();

export function useMemory() {
    const [isGenerating, setIsGenerating] = useState(false);

    const generateTodayMemory = async (manualContext?: any) => {
        setIsGenerating(true);
        try {
            // Demo: Generate a rich random context if not provided
            const context = manualContext || {
                walkDistance: Math.random() * 6, // 0-6km
                weather: { condition: Math.random() > 0.3 ? 'sunny' : 'rainy', temp: 20 },
                foodCount: Math.floor(Math.random() * 6),
                waterIntake: 500,
                socialInteractions: Math.floor(Math.random() * 4),
                vetVisit: Math.random() > 0.9 // 10% chance
            };

            const { title, moments, mood } = await memoryService.generateDaySummary(context);

            // Create a temporary memory object
            const newMemory: DailyMemory = {
                id: Date.now().toString(),
                date: new Date().toISOString().split('T')[0],
                userId: 'current-user',
                walkDistance: context.walkDistance,
                walkDuration: 45, // mock
                weather: context.weather,
                title,
                moments, // now an array
                mood
            };

            return newMemory;
        } finally {
            setIsGenerating(false);
        }
    };

    const saveMemory = async (memory: DailyMemory) => {
        await memoryService.saveMemory(memory);
    };

    const shareMemory = async (memory: DailyMemory) => {
        await memoryService.shareToCommunity(memory);
    };

    return {
        generateTodayMemory,
        saveMemory,
        shareMemory,
        isGenerating
    };
}
