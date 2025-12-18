import { IVaccineService } from "../interfaces";
import { VaccineRuleset, UserVaccineRecord, VaccineDefinition } from "@/types/domain";

// --- SEED DATA: TR RULESET ---
const TR_VACCINES: VaccineDefinition[] = [
    { id: 'mixed', name: 'Karma Aşı (DHPPi)', description: 'Gençlik hastalığı, hepatit ve parvovirüse karşı temel koruma.', isCore: true, frequencyMonths: 12, minAgeWeeks: 8, tags: ['viral'] },
    { id: 'rabies', name: 'Kuduz (Rabies)', description: 'Yasal zorunluluk. %100 ölümcül kuduz virüsüne karşı.', isCore: true, frequencyMonths: 12, minAgeWeeks: 12, tags: ['zoonotic', 'legal'] },
    { id: 'kc', name: 'Bronşin (Kennel Cough)', description: 'Özellikle sosyalleşen köpekler için barınak hastalığı aşısı.', isCore: false, frequencyMonths: 12, minAgeWeeks: 8, tags: ['bacterial'] },
    { id: 'internal', name: 'İç Parazit', description: 'Şerit ve kancalı kurtlara karşı düzenli koruma.', isCore: true, frequencyMonths: 3, minAgeWeeks: 4, tags: ['parasite'] },
];

const RULES_TR: VaccineRuleset = {
    countryCode: 'TR',
    version: '2025.1',
    source: 'Veterinary Association of Turkey',
    lastUpdated: '2025-01-01',
    definitions: TR_VACCINES
};

// --- MOCK USER HISTORY (In-Memory DB) ---
let USER_RECORDS: UserVaccineRecord[] = [
    // Completed in the past
    { id: 'rec_1', petId: 'pet-1', vaccineId: 'mixed', dateAdministered: '2024-10-12', dueDate: '2025-10-12', status: 'completed', vetName: 'VetLife' },
    { id: 'rec_2', petId: 'pet-1', vaccineId: 'rabies', dateAdministered: '2024-11-15', dueDate: '2025-11-15', status: 'completed', vetName: 'Paws Center' },

    // Upcoming / Pending (Calculated based on rules usually, but pre-filled for mock)
    { id: 'rec_3', petId: 'pet-1', vaccineId: 'kc', dueDate: '2025-01-20', status: 'pending' },
    { id: 'rec_4', petId: 'pet-1', vaccineId: 'internal', dueDate: '2025-12-25', status: 'pending' } // Very soon
];

export class VaccineMockService implements IVaccineService {

    async getRuleset(countryCode: string): Promise<VaccineRuleset> {
        await this.delay();
        if (countryCode === 'TR') return RULES_TR;
        // Fallback or empty for others in MVP
        return { ...RULES_TR, countryCode };
    }

    async getUserSchedule(petId: string, countryCode: string): Promise<UserVaccineRecord[]> {
        await this.delay();
        // In a real app, logic would be:
        // 1. Get Rules
        // 2. Get Past History
        // 3. Calculate Next Dates based on Frequency
        // Here we just return the Mock DB which simulates this state
        return [...USER_RECORDS];
    }

    async markAsDone(recordId: string, date: string, vetName: string): Promise<void> {
        await this.delay();
        const record = USER_RECORDS.find(r => r.id === recordId);
        if (record) {
            record.status = 'completed';
            record.dateAdministered = date;
            record.vetName = vetName;

            // LOGIC: Create Next Due Record?
            // For mock, let's keep it simple.
        }
    }

    private delay() {
        return new Promise(resolve => setTimeout(resolve, 600));
    }
}
