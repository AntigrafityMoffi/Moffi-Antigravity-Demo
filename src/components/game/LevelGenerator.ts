export type ObstacleType = 'BARRIER_LOW' | 'BARRIER_HIGH' | 'BUSH' | 'TRAFFIC_CONE';
export type ItemType = 'COIN' | 'MAGNET' | 'ROCKET' | 'SNAIL';

export interface LevelObject {
    id: string;
    type: ObstacleType | ItemType;
    x: number; // Lane -1, 0, 1
    z: number; // Local Z within chunk
    y?: number; // Height (for coin arcs)
}

export interface Chunk {
    length: number;
    objects: LevelObject[];
}

const CHUNK_LENGTH = 30;

// PATTERNS
const EMPTY_CHUNK: Chunk = { length: 20, objects: [] };

const SIMPLE_COINS: Chunk = {
    length: 30,
    objects: [
        { id: 'c1', type: 'COIN', x: 0, z: 5 },
        { id: 'c2', type: 'COIN', x: 0, z: 8 },
        { id: 'c3', type: 'COIN', x: 0, z: 11 },
        { id: 'c4', type: 'COIN', x: 0, z: 14 },
    ]
};

const JUMP_TUTORIAL: Chunk = {
    length: 40,
    objects: [
        { id: 'b1', type: 'BARRIER_LOW', x: 0, z: 10 },
        { id: 'c1', type: 'COIN', x: 0, z: 10, y: 2.5 }, // Coin over barrier
        { id: 'b2', type: 'BARRIER_LOW', x: 0, z: 25 },
        { id: 'c2', type: 'COIN', x: 0, z: 25, y: 2.5 },
    ]
};

const SLALOM_LeftRight: Chunk = {
    length: 50,
    objects: [
        { id: 'b1', type: 'BARRIER_HIGH', x: 0, z: 10 },
        { id: 'b2', type: 'BARRIER_HIGH', x: 1, z: 10 },
        { id: 'c1', type: 'COIN', x: -1, z: 10 }, // Go Left

        { id: 'b3', type: 'BARRIER_HIGH', x: -1, z: 30 },
        { id: 'b4', type: 'BARRIER_HIGH', x: 0, z: 30 },
        { id: 'c2', type: 'COIN', x: 1, z: 30 }, // Go Right
    ]
};

const COIN_ARC: Chunk = {
    length: 30,
    objects: [
        { id: 'c1', type: 'COIN', x: 0, z: 5, y: 0.5 },
        { id: 'c2', type: 'COIN', x: 0, z: 7, y: 1.5 },
        { id: 'c3', type: 'COIN', x: 0, z: 9, y: 2.2 },
        { id: 'c4', type: 'COIN', x: 0, z: 11, y: 2.5 }, // Peak
        { id: 'c5', type: 'COIN', x: 0, z: 13, y: 2.2 },
        { id: 'c6', type: 'COIN', x: 0, z: 15, y: 1.5 },
        { id: 'c7', type: 'COIN', x: 0, z: 17, y: 0.5 },
        // Ramp suggestion? For now essentially a jump arc
    ]
};

const BUSY_STREET: Chunk = {
    length: 60,
    objects: [
        { id: 't1', type: 'TRAFFIC_CONE', x: -1, z: 10 },
        { id: 't2', type: 'TRAFFIC_CONE', x: 1, z: 15 },
        { id: 'b1', type: 'BUSH', x: 0, z: 25 },
        { id: 'b2', type: 'BARRIER_LOW', x: -1, z: 40 },
        { id: 'b3', type: 'BARRIER_LOW', x: 1, z: 40 },
        { id: 'c1', type: 'COIN', x: 0, z: 40, y: 2.5 }, // Middle open but with jump? No, middle open means run.
        // Wait, barrier low at -1 and 1 means Middle is safe run, or jump side.
    ]
};

const PATTERNS = [SIMPLE_COINS, JUMP_TUTORIAL, SLALOM_LeftRight, COIN_ARC, BUSY_STREET];

export class LevelGenerator {
    private currentZ = 0;

    constructor(startZ: number = -20) {
        this.currentZ = startZ;
    }

    generateNextChunk(): { objects: any[], length: number } {
        // Pick random pattern
        const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];

        // Map objects to world space
        const worldObjects = pattern.objects.map(obj => ({
            ...obj,
            uniqueId: `${obj.id}_${this.currentZ}_${Math.random()}`,
            z: this.currentZ - obj.z // We run into negative Z, so we subtract local Z
        }));

        this.currentZ -= pattern.length;
        return { objects: worldObjects, length: pattern.length };
    }

    reset(startZ: number = -20) {
        this.currentZ = startZ;
    }
}
