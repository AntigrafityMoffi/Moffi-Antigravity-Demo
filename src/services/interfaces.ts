import { FamilyMember, FamilyLog, DailyMemory } from "@/types/domain";

export interface IFamilyService {
    // Queries
    getMembers(): Promise<FamilyMember[]>;
    getLogs(): Promise<FamilyLog[]>;

    // Actions
    inviteMember(email: string): Promise<string>; // Returns invite status/code
    updateStatus(status: FamilyMember['status'], text: string): Promise<void>;

    // Subscriptions (for Real-time updates)
    // Callback receives the updated full state or a delta
    subscribe(callback: (event: FamilyEvent) => void): () => void; // Returns unsubscribe function
}

export type FamilyEvent =
    | { type: 'MEMBER_UPDATE', members: FamilyMember[] }
    | { type: 'NEW_LOG', log: FamilyLog }
    | { type: 'NOTIFICATION', message: string };

export interface IMemoryService {
    // Core
    getDailyMemory(date: string): Promise<DailyMemory | null>;

    // AI Action
    generateDaySummary(context: import("@/types/domain").DayContext): Promise<{ title: string, moments: import("@/types/domain").MemoryMoment[], mood: DailyMemory['mood'] }>;


    // Persistence
    saveMemory(memory: DailyMemory): Promise<void>;
    saveMemory(memory: DailyMemory): Promise<void>;
    shareToCommunity(memory: DailyMemory): Promise<void>;
}

export interface IVetService {
    // Clinics
    // Future: radiusKm will be passed to backend geospatial query
    getNearbyClinics(lat: number, lng: number, radiusKm?: number): Promise<import("@/types/domain").VetClinic[]>;

    getClinicDetails(id: string): Promise<import("@/types/domain").VetClinic | null>;

    // Appointments
    // Future: Will trigger backend booking flow & notification system
    createAppointment(appointment: Omit<import("@/types/domain").VetAppointment, 'id' | 'status'>): Promise<import("@/types/domain").VetAppointment>;

    getAppointments(userId: string): Promise<import("@/types/domain").VetAppointment[]>;

    cancelAppointment(id: string): Promise<void>;
}
