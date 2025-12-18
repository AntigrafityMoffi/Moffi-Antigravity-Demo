
import { IMemoryService } from "../interfaces";
import { DailyMemory, DayContext, MemoryMoment } from "@/types/domain";
import { MemoryLogic } from "../logic/MemoryLogic";

export class MemoryMockService implements IMemoryService {
    private memories: Record<string, DailyMemory> = {};

    async getDailyMemory(date: string): Promise<DailyMemory | null> {
        return Promise.resolve(this.memories[date] || null);
    }

    async generateDaySummary(ctx: DayContext): Promise<{ title: string, moments: MemoryMoment[], mood: DailyMemory['mood'] }> {
        // Simulate AI "Thinking"
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 1. Delegate Strict Logic
        const moments = MemoryLogic.determineMoments(ctx);
        const mood = MemoryLogic.determineMood(moments);

        // 2. Generate a nice cover title based on the primary moment
        const mainMoment = moments[0]; // Logic sorts by priority
        const title = mainMoment.title;

        return { title, moments, mood };
    }

    async saveMemory(memory: DailyMemory): Promise<void> {
        this.memories[memory.date] = memory;
        return Promise.resolve();
    }

    async shareToCommunity(memory: DailyMemory): Promise<void> {
        // Simulate network call to post to community feed
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`[MockService] Shared memory ${memory.id} to community feed.`);
        return Promise.resolve();
    }
}
