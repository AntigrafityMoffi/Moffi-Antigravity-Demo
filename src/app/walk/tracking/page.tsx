"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Pause, Play, StopCircle, Flame, Zap, Navigation, X, Star, LocateFixed, MapPin, Bone, Coffee, ArrowRight, CornerUpRight, Clock, Footprints, Search, Sparkles } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { cn } from "@/lib/utils";
import { MoffiPoints } from "@/components/common/MoffiPoints";
import { MoffiWallet } from "@/components/common/MoffiWallet";
import { showPoiDrawer } from "@/components/walk/PoiDrawer"; // Imported Helper
import { walkService, POI } from "@/services/WalkService";


// Dynamic Import for Map (No SSR)
const LiveMap = dynamic(() => import("@/components/walk/LiveMap"), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center text-gray-400 font-bold">Harita Yükleniyor...</div>
});



export default function TrackingPage() {
    const router = useRouter();
    const {
        addWalkSession,
        addMoffiPoints,
        economy,
        activeWalkSession, // Global State
        startWalk,
        updateWalk,
        endWalk
    } = useSocial();

    // Local UI State
    const [seconds, setSeconds] = useState(0);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);


    // ... inside component
    const [pois, setPois] = useState<POI[]>([]);
    const [isFocused, setIsFocused] = useState(true);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Venue & Navigation State
    const [selectedPOI, setSelectedPOI] = useState<any>(null);
    const [destination, setDestination] = useState<[number, number] | null>(null);
    const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
    const [isNavigating, setIsNavigating] = useState(false); // NEW STATE

    const [activeFilter, setActiveFilter] = useState('Tümü');

    // Initialize Walk on Mount if not exists
    useEffect(() => {
        if (!activeWalkSession) {
            startWalk();
        }
    }, []);

    // Sync elapsed time from global start time
    useEffect(() => {
        const timer = setInterval(() => {
            if (activeWalkSession && activeWalkSession.isActive) {
                const elapsed = Math.floor((Date.now() - activeWalkSession.startTime) / 1000);
                setSeconds(elapsed);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [activeWalkSession]);

    // GeoLocation Watch & Distance Logic
    useEffect(() => {
        if (!navigator.geolocation) return;

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // Update User Location Logic
                setUserLocation([latitude, longitude]);

                // Generate POIs dynamically using Service
                if (pois.length === 0) {
                    try {
                        const fetchedPois = await walkService.getNearbyPOIs(latitude, longitude);
                        setPois(fetchedPois);
                    } catch (e) {
                        console.error("Failed to fetch POIs", e);
                    }
                }

                // Simulate Movement/Distance accumulation
                if (activeWalkSession && activeWalkSession.isActive) {
                    // In a real app, calculate Haversine distance here
                    // Simulating +0.0005 km per update for demo
                    updateWalk({
                        distance: activeWalkSession.distance + 0.0005,
                        lastLocation: [latitude, longitude]
                    });
                }
            },
            (error) => console.error("GPS Error:", error),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, [activeWalkSession?.isActive, pois.length]);

    // Random Point Events
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeWalkSession?.isActive) {
            interval = setInterval(() => {
                if (Math.random() > 0.95) {
                    const newPoints = (activeWalkSession.points || 0) + 5;
                    updateWalk({ points: newPoints });
                    addMoffiPoints(5, "Yürüyüş Bonusu");
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [activeWalkSession?.isActive]);


    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleFinish = () => {
        if (!activeWalkSession) return;

        const session = {
            id: activeWalkSession.startTime,
            date: new Date(activeWalkSession.startTime).toISOString(),
            steps: Math.floor(activeWalkSession.distance * 1300),
            distance: Number(activeWalkSession.distance.toFixed(2)),
            duration: Math.floor((Date.now() - activeWalkSession.startTime) / 1000)
        };

        endWalk(); // Clear global state
        addWalkSession(session);
        router.push(`/walk/summary?id=${session.id}`);
    };

    const togglePause = () => {
        if (activeWalkSession) {
            updateWalk({ isActive: !activeWalkSession.isActive });
        }
    };

    const handleInteractMap = () => {
        setIsFocused(false);
    };

    const handleStartNavigation = () => {
        if (selectedPOI) {
            // 1. Set Destination
            setDestination([selectedPOI.lat, selectedPOI.lng]);
            setSelectedPOI(null); // Close drawer

            // 2. Start In-App Navigation Mode
            setIsNavigating(true);
            setIsFocused(true);
        }
    };

    const cancelNavigation = () => {
        setIsNavigating(false);
        setDestination(null);
    };

    // Safe Accessors
    const currentDistance = activeWalkSession?.distance || 0;
    const currentPoints = activeWalkSession?.points || 0;
    const isSessionActive = activeWalkSession?.isActive || false;

    // Derived State for Reward Radar
    const premiumCount = pois.filter(p => p.isPremium).length;

    return (
        <main className="h-screen bg-gray-50 dark:bg-slate-900 max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans flex flex-col border-x border-gray-100 dark:border-slate-800 transition-colors duration-300">

            {/* --- MAP LAYER --- */}
            <div className="flex-1 bg-[#EEF2F6] dark:bg-slate-800 relative z-0">
                <LiveMap
                    userLocation={userLocation}
                    pois={pois}
                    onPOIClick={(poi) => { if (!isNavigating) { setSelectedPOI(poi); setDestination(null); } }}
                    isFocused={isFocused}
                    onMapInteract={handleInteractMap}
                    destination={destination}
                    isNavigating={isNavigating}
                />
            </div>

            {isNavigating && destination ? (
                /* --- NAVIGATION HUD --- */
                <>
                    {/* Top Instruction Banner */}
                    <div className="absolute top-6 left-4 right-4 z-40 animate-in slide-in-from-top duration-500 pointer-events-none">
                        <div className="bg-gray-900/90 dark:bg-black/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between pointer-events-auto">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                                    <CornerUpRight className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <div className="text-2xl font-black font-poppins">100m</div>
                                    <div className="text-sm font-medium text-gray-300">sonra sağa dön</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2 text-center pointer-events-auto">
                            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-white/20">
                                {activeWalkSession?.isActive ? 'Yürüyüş Devam Ediyor' : 'Navigasyon Modu'}
                            </span>
                        </div>
                    </div>

                    {/* Bottom Info Panel */}
                    <div className="absolute bottom-8 left-4 right-4 z-40 animate-in slide-in-from-bottom duration-500 pointer-events-none">
                        <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] shadow-2xl border border-gray-100 dark:border-slate-800 flex items-center justify-between pointer-events-auto">
                            <div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Varış Süresi</div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-gray-900 dark:text-white font-poppins">12</span>
                                    <span className="text-sm font-bold text-gray-500">dk</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1.5 text-gray-500 text-xs font-bold bg-gray-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg mb-2">
                                    <Footprints className="w-3.5 h-3.5 text-orange-500" />
                                    850m
                                </div>
                                <button
                                    onClick={cancelNavigation}
                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-red-500/30 transition-transform active:scale-95"
                                >
                                    Çıkış
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                /* --- STANDARD HUD --- */
                <>
                    {/* Top Bar Area */}
                    <div className="absolute top-0 left-0 right-0 p-6 flex flex-col gap-4 z-40 pointer-events-none">

                        {/* Search Bar - Professional & Clean */}
                        <div className="w-full pointer-events-auto relative">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="w-4 h-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Nereye gitmek istersin?"
                                className="w-full pl-10 pr-4 py-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 dark:border-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-400 dark:text-white shadow-lg"
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter') {
                                        const query = e.currentTarget.value;
                                        if (!query) return;

                                        try {
                                            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
                                            const data = await res.json();

                                            if (data && data.length > 0) {
                                                const place = data[0];
                                                // Removed invalid import
                                                const customPoi: POI = {
                                                    id: `search-${place.place_id}`,
                                                    name: place.display_name.split(',')[0],
                                                    type: "custom", // This is valid if POI type allows "custom"
                                                    category: "Arama Sonucu",
                                                    lat: parseFloat(place.lat),
                                                    lng: parseFloat(place.lon),
                                                    rating: 0,
                                                    distance: "??m",
                                                    image: "",
                                                    description: place.display_name
                                                };
                                                setPois(prev => [...prev, customPoi]);
                                                setSelectedPOI(customPoi);
                                                setIsFocused(false); // Let user explore
                                            } else {
                                                alert("Konum bulunamadı.");
                                            }
                                        } catch (err) {
                                            console.error("Search failed", err);
                                            alert("Arama hatası.");
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className="flex justify-between items-start w-full">
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-sm border border-white/50 dark:border-slate-700 flex items-center gap-2 pointer-events-auto">
                                <Navigation className="w-4 h-4 text-blue-500 fill-current" />
                                <span className="text-xs font-bold text-gray-800 dark:text-white">Canlı Konum</span>
                            </div>

                            <div className="flex flex-col items-end gap-3 pointer-events-auto">
                                {/* MOFFI PASS / WALLET BUTTON */}
                                <button onClick={() => setIsWalletOpen(true)} className="group hover:scale-105 transition-transform">
                                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-0.5 shadow-lg">
                                        <div className="bg-gray-900 rounded-[14px] px-3 py-1.5 flex items-center gap-2 border border-white/10">
                                            <div className="flex flex-col items-end leading-none">
                                                <span className="text-[10px] font-bold text-gray-400">BAKİYE</span>
                                                <span className="text-sm font-black text-white">{economy.points}</span>
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold shadow-sm">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => setIsFocused(true)}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all",
                                        isFocused ? "bg-blue-500 text-white" : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                                    )}
                                >
                                    <LocateFixed className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* REWARD RADAR (Replaces Stats Pill) */}
                    <div className="absolute top-32 left-1/2 -translate-x-1/2 w-auto min-w-[200px] z-30 pointer-events-none">
                        <div className="bg-black/80 backdrop-blur-md text-white rounded-full p-1.5 pl-4 pr-1.5 flex items-center justify-between shadow-2xl border border-white/10 animate-in slide-in-from-top-4">
                            <div className="flex items-center gap-2 mr-4">
                                <div className="relative">
                                    <span className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </span>
                                </div>
                                <div className="flex flex-col leading-none">
                                    <span className="text-[10px] font-bold text-green-400 uppercase tracking-wide">RADAR AKTİF</span>
                                    <span className="text-xs font-bold">{premiumCount > 0 ? `${premiumCount} Fırsat Yakında!` : 'Taranıyor...'}</span>
                                </div>
                            </div>
                            <div className="bg-gray-800 rounded-full px-3 py-1.5 flex items-center gap-1.5">
                                <Zap className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs font-black">+{currentPoints}</span>
                            </div>
                        </div>
                    </div>

                    {/* POI Selection Card - PREMIUM DRAWER */}
                    {selectedPOI && showPoiDrawer(selectedPOI, activeTab, setActiveTab, handleStartNavigation, () => setSelectedPOI(null))}

                    {/* --- BOTTOM DECK (Premium Design) --- */}
                    <div className={cn("absolute bottom-0 w-full bg-white dark:bg-slate-900 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-all duration-500 z-50 border-t border-gray-100 dark:border-slate-800", isDrawerOpen ? "h-[70vh]" : "h-auto")}>

                        <div onClick={() => setIsDrawerOpen(!isDrawerOpen)} className="w-full flex justify-center py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800 rounded-t-[2.5rem] transition-colors">
                            <div className="w-12 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full" />
                        </div>

                        {!isDrawerOpen ? (
                            <div className="px-8 pb-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Mesafe</div>
                                        <div className="text-3xl font-black text-gray-900 dark:text-white font-poppins">{currentDistance.toFixed(2)}<span className="text-sm text-gray-400 ml-1">km</span></div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Süre</div>
                                        <div className="text-3xl font-black text-gray-900 dark:text-white font-poppins tracking-tight">{formatTime(seconds)}</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={togglePause}
                                        className="flex-1 h-16 rounded-[1.5rem] bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-900 dark:text-white font-bold flex items-center justify-center gap-2 transition-colors border border-transparent dark:border-slate-700"
                                    >
                                        {isSessionActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                                        {isSessionActive ? "Duraklat" : "Devam Et"}
                                    </button>
                                    <button
                                        onClick={handleFinish}
                                        className="flex-1 h-16 rounded-[1.5rem] bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-black dark:hover:bg-gray-100 font-bold flex items-center justify-center gap-2 shadow-xl shadow-gray-200 dark:shadow-none transition-transform active:scale-95"
                                    >
                                        <StopCircle className="w-5 h-5" />
                                        Bitir
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="px-6 pb-6 h-full overflow-y-auto">
                                <div className="sticky top-0 bg-white dark:bg-slate-900 z-10 pb-4">
                                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Yakındakileri Keşfet</h3>
                                    <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide">
                                        {['Tümü', 'Etkinlik', 'Kafe', 'Pet Shop'].map(cat => (
                                            <button
                                                key={cat}
                                                onClick={() => setActiveFilter(cat)}
                                                className={cn("px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all", activeFilter === cat ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900" : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 dark:border-slate-700")}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pb-20">
                                    {pois.map(poi => (
                                        <div key={poi.id} onClick={() => { setSelectedPOI(poi); setIsDrawerOpen(false); }} className="flex items-center gap-4 p-3 rounded-[1.5rem] bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:scale-[1.02] active:scale-95 transition-all cursor-pointer group">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-xl overflow-hidden relative">
                                                {poi.image ? (
                                                    <>
                                                        <img src={poi.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                        <div className="absolute inset-0 bg-black/10" />
                                                    </>
                                                ) : "📍"}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <div className="font-bold text-gray-900 dark:text-white text-base">{poi.name}</div>
                                                    <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-md text-[10px] font-bold">Açık</div>
                                                </div>
                                                <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {poi.distance} • {poi.category}
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                                                    <Star className="w-3 h-3 fill-current" /> {poi.rating}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

            <MoffiWallet isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />

        </main>
    );
}
