"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Coffee, Dog, MapPin, Navigation } from "lucide-react";

// Fix Leaflet Icon Issue
const iconPerson = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const iconCafe = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41]
});

const iconShop = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowSize: [41, 41]
});

// Component to handle map center updates
function MapController({ center, isFocused, isNavigating }: { center: [number, number], isFocused: boolean, isNavigating?: boolean }) {
    const map = useMap();
    useEffect(() => {
        if (isFocused || isNavigating) {
            map.flyTo(center, isNavigating ? 18 : 16, { animate: true, duration: 1 });
        }
    }, [center, isFocused, isNavigating, map]);
    return null;
}

import { POI } from "@/services/WalkService";

interface LiveMapProps {
    userLocation: [number, number] | null;
    pois: POI[];
    onPOIClick: (poi: any) => void;
    isFocused: boolean;
    onMapInteract: () => void;
    destination?: [number, number] | null;
    isNavigating?: boolean; // NEW: Nav Mode
}

const DEFAULT_CENTER: [number, number] = [40.9826, 29.0277];

export default function LiveMap({ userLocation, pois, onPOIClick, isFocused, onMapInteract, destination, isNavigating }: LiveMapProps) {
    // Determine map center: User Location > Default
    const center = userLocation || DEFAULT_CENTER;

    // Navigation Route Style
    const routeOptions = isNavigating
        ? { color: '#3B82F6', weight: 6, opacity: 0.9 }
        : { color: '#3B82F6', dashArray: '10, 10', weight: 4, opacity: 0.7 };

    // Simple Arrow Icon for Nav
    const iconNav = new L.DivIcon({
        className: 'bg-transparent',
        html: '<div class="w-6 h-6 bg-blue-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white text-[10px]">▲</div>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });

    // Simple Pin Icon for Dropped Locations
    const iconPin = new L.DivIcon({
        className: 'bg-transparent',
        html: '<div class="text-3xl filter drop-shadow-md">📍</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 32]
    });

    // Premium Gold Star Icon
    const iconStar = new L.DivIcon({
        className: 'bg-transparent',
        html: '<div class="relative w-10 h-10 flex items-center justify-center"><div class="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div><div class="relative w-8 h-8 bg-gradient-to-br from-yellow-300 to-orange-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center text-white text-lg">⭐</div></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    return (
        <MapContainer
            center={center}
            zoom={15}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            zoomControl={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <MapEventsHandler onInteract={onMapInteract} onMapClick={onPOIClick} />
            <MapController center={center} isFocused={isFocused} isNavigating={isNavigating} />

            {/* Navigation Route Line */}
            {userLocation && destination && (
                <Polyline positions={[userLocation, destination]} pathOptions={routeOptions} />
            )}

            {/* User Marker (Only if location found) */}
            {userLocation ? (
                <Marker position={userLocation} icon={isNavigating ? iconNav : iconPerson}>
                    {!isNavigating && <Popup>Siz buradasınız! 🐶</Popup>}
                </Marker>
            ) : (
                <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[1000] bg-black/70 text-white px-4 py-2 rounded-full text-xs font-bold backdrop-blur">
                    Konum aranıyor...
                </div>
            )}

            {/* POI Markers */}
            {pois.map(poi => (
                <Marker
                    key={poi.id}
                    position={[poi.lat, poi.lng]}
                    icon={poi.type === 'custom' ? iconPin : (poi.isPremium ? iconStar : (poi.type === 'cafe' ? iconCafe : iconShop))}
                    eventHandlers={{ click: () => onPOIClick(poi) }}
                >
                </Marker>
            ))}
        </MapContainer>
    );
}

// Helper to detect user interaction (drag/zoom) and Clicks
function MapEventsHandler({ onInteract, onMapClick }: { onInteract: () => void, onMapClick: (e: any) => void }) {
    useMapEvents({
        dragstart: () => onInteract(),
        zoomstart: () => onInteract(),
        click: (e) => {
            // Create a "Custom POI" object from the click
            const customPoi = {
                id: `custom-${Date.now()}`,
                name: "Seçilen Konum",
                type: "custom",
                category: "Konum",
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                rating: 0,
                distance: "0m",
                image: "", // No image for random points
                description: "Harita üzerinde seçtiğiniz nokta."
            };
            onMapClick(customPoi);
        }
    });
    return null;
}
