"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// --- TYPES ---
export interface Pet {
    id: string;
    name: string;
    breed: string;
    age: number;
    weight: number;
    gender: 'male' | 'female';
    image: string;
    themeColor: string; // Hex code for UI theming
    microchipId?: string;
    neutered?: boolean;
    birthday?: Date;
}

interface PetContextType {
    pets: Pet[];
    activePet: Pet | null;
    isLoading: boolean;
    addPet: (pet: Omit<Pet, 'id'>) => void;
    updatePet: (id: string, updates: Partial<Pet>) => void;
    deletePet: (id: string) => void;
    switchPet: (id: string) => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

// --- MOCK INITIAL DATA ---
const INITIAL_PETS: Pet[] = [
    {
        id: 'pet-1',
        name: 'Mochi',
        breed: 'Golden Retriever',
        age: 2,
        weight: 24.5,
        gender: 'male',
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
        themeColor: '#EAB308', // Yellow
    },
    {
        id: 'pet-2',
        name: 'Luna',
        breed: 'British Shorthair',
        age: 1,
        weight: 4.2,
        gender: 'female',
        image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800',
        themeColor: '#8B5CF6', // Purple
    }
];

export function PetProvider({ children }: { children: React.ReactNode }) {
    const [pets, setPets] = useState<Pet[]>([]);
    const [activePetId, setActivePetId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // LOAD FROM LOCAL STORAGE
    useEffect(() => {
        const storedPets = localStorage.getItem('moffi_pets');
        const storedActiveId = localStorage.getItem('moffi_active_pet_id');

        if (storedPets) {
            setPets(JSON.parse(storedPets));
        } else {
            // First time load: Use Mock Data
            setPets(INITIAL_PETS);
            localStorage.setItem('moffi_pets', JSON.stringify(INITIAL_PETS));
        }

        if (storedActiveId) {
            setActivePetId(storedActiveId);
        } else {
            // Default to first pet
            setActivePetId(INITIAL_PETS[0].id);
        }

        setIsLoading(false);
    }, []);

    // PERSISTENCE EFFECT
    useEffect(() => {
        if (!isLoading && pets.length > 0) {
            localStorage.setItem('moffi_pets', JSON.stringify(pets));
        }
    }, [pets, isLoading]);

    useEffect(() => {
        if (!isLoading && activePetId) {
            localStorage.setItem('moffi_active_pet_id', activePetId);
        }
    }, [activePetId, isLoading]);

    // --- ACTIONS ---

    const addPet = (newPetData: Omit<Pet, 'id'>) => {
        const newPet: Pet = {
            ...newPetData,
            id: `pet-${Date.now()}`
        };
        setPets(prev => [...prev, newPet]);
        // Automatically switch to new pet? Maybe. Let's do it for better UX.
        setActivePetId(newPet.id);
    };

    const updatePet = (id: string, updates: Partial<Pet>) => {
        setPets(prev => prev.map(pet => pet.id === id ? { ...pet, ...updates } : pet));
    };

    const deletePet = (id: string) => {
        setPets(prev => {
            const newPets = prev.filter(p => p.id !== id);
            // If we deleted the active pet, switch to another one
            if (activePetId === id && newPets.length > 0) {
                setActivePetId(newPets[0].id);
            } else if (newPets.length === 0) {
                setActivePetId(null);
            }
            return newPets;
        });
    };

    const switchPet = (id: string) => {
        if (pets.find(p => p.id === id)) {
            setActivePetId(id);
        }
    };

    const activePet = pets.find(p => p.id === activePetId) || null;

    return (
        <PetContext.Provider value={{ pets, activePet, isLoading, addPet, updatePet, deletePet, switchPet }}>
            {children}
        </PetContext.Provider>
    );
}

export function usePet() {
    const context = useContext(PetContext);
    if (context === undefined) {
        throw new Error("usePet must be used within a PetProvider");
    }
    return context;
}
