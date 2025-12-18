import { useState, useEffect } from "react";
import { IVetService } from "@/services/interfaces";
import { VetMockService } from "@/services/mock/VetMockService";
import { VetClinic, VetAppointment } from "@/types/domain";

// Singleton for now
const vetService: IVetService = new VetMockService();

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

export function useVet() {
    const [clinics, setClinics] = useState<VetClinic[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    // Initial Fetch
    useEffect(() => {
        fetchClinics();
    }, []);

    const fetchClinics = async () => {
        setIsLoading(true);
        try {
            // Get Location
            let lat = 40.9850; // Default: Istanbul/Moda
            let lng = 29.0300;

            if ("geolocation" in navigator) {
                try {
                    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    });
                    lat = position.coords.latitude;
                    lng = position.coords.longitude;
                    setUserLocation([lat, lng]);
                } catch (e) {
                    console.warn("Location access denied, using default.");
                }
            }

            // Fetch Data
            const rawClinics = await vetService.getNearbyClinics(lat, lng);

            // Enrich with Distance UI Logic (Client-side)
            const enriched = rawClinics.map(c => {
                const distVal = calculateDistance(lat, lng, c.location.lat, c.location.lng);
                return {
                    ...c,
                    distance: distVal.toFixed(1) + " km",
                    _distVal: distVal // internal sort key
                };
            }).sort((a, b) => a._distVal - b._distVal);

            setClinics(enriched);

        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const bookAppointment = async (clinic: VetClinic, date: string, time: string, type: VetAppointment['type']) => {
        setIsLoading(true);
        try {
            await vetService.createAppointment({
                clinicId: clinic.id,
                clinicName: clinic.name,
                petId: 'pet-1', // Mock
                petName: 'Moffi', // Mock
                ownerName: 'Atlas',
                date,
                time,
                type,
                price: 650
            });
            // Refetch or update local state if needed
        } finally {
            setIsLoading(false);
        }
    };

    return {
        clinics,
        userLocation,
        isLoading,
        bookAppointment,
        refresh: fetchClinics
    };
}
