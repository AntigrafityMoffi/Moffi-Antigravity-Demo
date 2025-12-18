"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { Place } from "@/data/mockPlaces";
import { MapMark } from "@/data/mockMarks";
import { Loader2, Navigation, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// --- PRO TYPES ---
interface GoogleLiveMapProps {
    userPos: [number, number];
    path: [number, number][];
    isTracking: boolean;
    visitedPlaceIds: string[];
    onPlaceClick?: (place: Place) => void;
    guardianMode?: boolean;
    places: Place[];
    marks: MapMark[];
}

// --- PREMIUM MAP STYLE (Uber/Dark Luxury) ---
const MAP_STYLE = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

// --- DIRECTIONS RENDERER ---
function Directions({ origin, destination }: { origin: { lat: number, lng: number }, destination: { lat: number, lng: number } | null }) {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
    const [currentRoute, setCurrentRoute] = useState<google.maps.DirectionsResult>();

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer || !destination) {
            // Fix: setDirections expects a more optional like type, or we check null.
            // But actually setDirections(null) clears it.
            if (directionsRenderer) directionsRenderer.setDirections({ routes: [] } as any);
            return;
        }

        directionsService.route({
            origin,
            destination,
            travelMode: google.maps.TravelMode.WALKING,
        }).then((response) => {
            directionsRenderer.setDirections(response);
            setCurrentRoute(response);
        }).catch(e => console.error("Directions failed", e));

    }, [directionsService, directionsRenderer, origin, destination]);

    return null;
}


// --- MAIN COMPONENT ---
export default function GoogleLiveMap({
    userPos, path, isTracking, visitedPlaceIds, onPlaceClick, guardianMode, places, marks
}: GoogleLiveMapProps) {

    // We assume the API Key is in env. local
    // DEVELOPMENT MODE: Fallback to provided key if env var fails
    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

    const userLocation = useMemo(() => ({ lat: userPos[0], lng: userPos[1] }), [userPos]);
    const [routeDest, setRouteDest] = useState<{ lat: number, lng: number } | null>(null);

    // If no key, we show a clean error state instead of breaking
    if (!API_KEY) {
        return (
            <div className="w-full h-full bg-[#1A1A1A] flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">Google Maps API Anahtarı Eksik</h3>
                    <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
                        Moffi Walk Pro özellikleri için lütfen <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> değerini tanımlayın.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <APIProvider apiKey={API_KEY}>
            <div className="w-full h-full relative">
                <Map
                    defaultCenter={userLocation}
                    defaultZoom={15}
                    mapId="DEMO_MAP_ID" // Required for Advanced Markers
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    styles={guardianMode ? [] : MAP_STYLE} // Use standard style for Guardian (clearer), Custom for Pro
                    className={cn("w-full h-full outline-none", guardianMode ? "grayscale contrast-125" : "")}
                >
                    {/* USER MARKER (PULSING) */}
                    <AdvancedMarker position={userLocation}>
                        <div className="relative flex items-center justify-center">
                            <div className={cn("absolute w-12 h-12 rounded-full opacity-30 animate-ping", guardianMode ? "bg-red-500" : "bg-[#5B4D9D]")} />
                            <div className={cn("relative w-6 h-6 rounded-full border-[3px] border-white shadow-lg", guardianMode ? "bg-red-600" : "bg-[#5B4D9D]")} />
                        </div>
                    </AdvancedMarker>

                    {/* PLACES */}
                    {places.map(place => {
                        const isVisited = visitedPlaceIds.includes(place.id);
                        let bgColor = "bg-blue-500";
                        let icon = "📍";

                        switch (place.type) {
                            case 'vet': bgColor = "bg-red-500"; icon = "🏥"; break;
                            case 'cafe': bgColor = "bg-orange-500"; icon = "☕"; break;
                            case 'park': bgColor = "bg-green-500"; icon = "🌳"; break;
                        }

                        return (
                            <AdvancedMarker
                                key={place.id}
                                position={{ lat: place.lat, lng: place.lng }}
                                onClick={() => {
                                    setRouteDest({ lat: place.lat, lng: place.lng });
                                    if (onPlaceClick) onPlaceClick(place);
                                }}
                            >
                                <div className={cn(
                                    "w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-lg transition-transform hover:scale-110 cursor-pointer border-2 border-white",
                                    isVisited ? "bg-gray-400 grayscale" : bgColor
                                )}>
                                    {isVisited ? "✅" : icon}
                                </div>
                            </AdvancedMarker>
                        );
                    })}

                    {/* MARKS (COMMUNITY) */}
                    {marks.map(mark => (
                        <AdvancedMarker
                            key={mark.id}
                            position={{ lat: mark.lat, lng: mark.lng }}
                        >
                            <div className="w-8 h-8 rounded-tr-none rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-lg transform -rotate-45">
                                <div className="transform rotate-45">{mark.emoji}</div>
                            </div>
                        </AdvancedMarker>
                    ))}

                    {/* ROUTING */}
                    {routeDest && <Directions origin={userLocation} destination={routeDest} />}

                </Map>
            </div>
        </APIProvider>
    );
}
