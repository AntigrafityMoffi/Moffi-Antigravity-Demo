"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    MapPin, Trophy, ChevronRight, ChevronLeft,
    Flame, Cookie, Timer, Footprints, Play
} from "lucide-react";
import { PLACES } from "@/data/mockPlaces";
import dynamic from "next/dynamic";
import { WalkDeals } from "@/components/walk/WalkDeals";
import { PetSwitcher } from "@/components/common/PetSwitcher";

// Dynamic Import for Google Map
const GoogleLiveMap = dynamic(() => import('@/components/walk/GoogleLiveMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#242f3e] animate-pulse rounded-[2rem] flex items-center justify-center text-white/20 font-bold">Harita Yükleniyor...</div>
});

export default function WalkPage() {
    const router = useRouter();
    const [userPos, setUserPos] = useState<[number, number]>([41.0082, 28.9784]);

    // Initial GPS
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserPos([pos.coords.latitude, pos.coords.longitude]),
                (err) => console.error(err)
            );
        }
    }, []);

    return (
        <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#121212] pb-24 font-sans">
            {/* 1. HEADER & LOCATION */}
            <header className="px-6 py-4 flex justify-between items-center sticky top-0 z-30 bg-[#F8F9FC]/80 dark:bg-[#121212]/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.push('/home')} className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center shadow-sm active:scale-95 transition-transform border border-gray-100 dark:border-white/10">
                        <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-white" />
                    </button>
                    <div>
                        <div className="flex items-center gap-1 text-[#5B4D9D] font-bold text-xs uppercase tracking-wider mb-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>Mevcut Konum</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <h1 className="text-xl font-black text-gray-900 dark:text-white">Caddebostan, İstanbul</h1>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                    </div>
                </div>
                <div className="scale-90 origin-right">
                    <PetSwitcher mode="compact" />
                </div>
            </header>

            <main className="px-5 space-y-6">

                {/* 2. LEADERBOARD TEASER (NEW!) */}
                <div
                    onClick={() => router.push('/walk/leaderboard')}
                    className="bg-gradient-to-r from-[#240b36] to-[#c31432] p-4 rounded-3xl relative overflow-hidden shadow-xl shadow-red-900/20 cursor-pointer group"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
                                <Trophy className="w-6 h-6 text-yellow-400 fill-current" />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg leading-tight uppercase italic">Global Arena</h3>
                                <div className="text-white/80 text-xs font-bold">Sıralaman: <span className="text-yellow-300 text-sm">#6</span></div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="bg-white/10 px-2 py-1 rounded text-[10px] text-white font-bold h-min whitespace-nowrap mb-1">
                                Gümüş Lig
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center group-hover:bg-yellow-400 transition-colors">
                                <ChevronRight className="w-5 h-5 text-black" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. STATS SUMMARY COMPONENT */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white dark:bg-[#1A1A1A] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 mb-1">
                            <Flame className="w-4 h-4" />
                        </div>
                        <span className="text-lg font-black text-gray-900 dark:text-white">324</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Kcal</span>
                    </div>
                    <div className="bg-white dark:bg-[#1A1A1A] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 mb-1">
                            <Footprints className="w-4 h-4" />
                        </div>
                        <span className="text-lg font-black text-gray-900 dark:text-white">4.2</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Km</span>
                    </div>
                    <div className="bg-white dark:bg-[#1A1A1A] p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center gap-1">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-500 mb-1">
                            <Timer className="w-4 h-4" />
                        </div>
                        <span className="text-lg font-black text-gray-900 dark:text-white">45</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">Dk</span>
                    </div>
                </div>

                {/* 4. DISCOVERY MAP (Interactive Preview) */}
                <div className="relative w-full h-64 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-200/50 dark:shadow-none border border-white/50 dark:border-white/10 group">
                    <GoogleLiveMap
                        userPos={userPos}
                        path={[]}
                        isTracking={false}
                        visitedPlaceIds={[]}
                        places={PLACES}
                        marks={[]}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                    {/* Floating Elements on Map */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
                        <div className="bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 dark:text-white shadow-lg flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> 12 Moffi Arkadaşı Yakınında
                        </div>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 z-10">
                        <h2 className="text-white font-bold text-lg mb-0.5">Keşfe Çık</h2>
                        <p className="text-white/70 text-xs mb-4 max-w-[80%]">Çevredeki parkları, kafeleri ve ödülleri topla.</p>
                        <button
                            onClick={() => router.push('/walk/tracking')}
                            className="w-full bg-[#5B4D9D] hover:bg-[#4a3e80] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
                        >
                            <Play className="w-5 h-5 fill-current" /> Yürüyüşü Başlat
                        </button>
                    </div>
                </div>

                {/* 5. NEARBY DEALS (GAMIFICATION) */}
                <div>
                    <div className="flex items-center justify-between mb-3 px-1">
                        <h3 className="font-black text-gray-900 dark:text-white text-lg flex items-center gap-2">
                            <Cookie className="w-5 h-5 text-orange-500" /> Yakındaki Fırsatlar
                        </h3>
                        <button className="text-xs font-bold text-[#5B4D9D]">Tümü</button>
                    </div>
                    {/* We reuse the Deals Component here if defined, or inline mock */}
                    <WalkDeals />
                </div>
            </main>
        </div>
    );
}
