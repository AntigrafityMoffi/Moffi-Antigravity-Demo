
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Footprints,
    Zap,
    Timer,
    Crown,
    Settings,
    Medal,
    MapPin,
    Gift,
    Store
} from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { HeroSection } from "@/components/walk/HeroSection";
import { WalkDeals } from "@/components/walk/WalkDeals";
import { SettingsDrawer } from "@/components/walk/SettingsDrawer";
import { cn } from "@/lib/utils";

import { walkService, WalkCampaign } from "@/services/WalkService";

export default function WalkLandingPage() {
    const router = useRouter();
    const { currentUser, economy } = useSocial();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // --- REFACTORED: Using WalkService ---
    const [campaigns, setCampaigns] = useState<WalkCampaign[]>([]);

    useEffect(() => {
        walkService.getActiveCampaigns().then(setCampaigns);
    }, []);

    // Stats
    const todayWalks = currentUser.walks?.filter(w => new Date(w.date).toDateString() === new Date().toDateString()) || [];
    const totalSteps = todayWalks.reduce((acc, w) => acc + w.steps, 0);

    return (
        <main className="min-h-screen bg-[#F5F5FA] dark:bg-[#0B0F19] max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans pb-32 transition-colors duration-500">

            {/* HEADER */}
            <header className="absolute top-0 w-full z-20 px-6 py-6 flex items-center justify-between">
                <button onClick={() => router.back()} className="w-10 h-10 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-sm transition hover:scale-105">
                    <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-white" />
                </button>

                {/* Level Badge */}
                <div className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full border border-white/40 shadow-sm cursor-pointer hover:scale-105 transition" onClick={() => router.push('/walk/competition')}>
                    <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/50">
                        <Crown className="w-3.5 h-3.5 text-white fill-current" />
                    </div>
                    <span className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight">Level {economy.level || 5}</span>
                </div>

                <button onClick={() => setIsSettingsOpen(true)} className="w-10 h-10 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-sm transition hover:scale-105">
                    <Settings className="w-5 h-5 text-gray-800 dark:text-white" />
                </button>
            </header>

            {/* HERO SECTION */}
            <HeroSection />

            {/* MAIN ACTION AREA */}
            <div className="relative -mt-10 px-6 z-10">
                <div className="bg-white dark:bg-[#151b2b] rounded-[2.5rem] p-6 shadow-xl border border-white/50 dark:border-white/5 flex flex-col items-center gap-6">

                    {/* Stats Row */}
                    <div className="flex w-full justify-between px-4">
                        <div className="text-center">
                            <div className="flex justify-center mb-1"><Zap className="w-5 h-5 text-orange-500 fill-current" /></div>
                            <div className="text-xl font-black text-gray-900 dark:text-white">{(totalSteps * 0.04).toFixed(0)}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kcal</div>
                        </div>
                        <div className="w-px h-10 bg-gray-100 dark:bg-gray-800" />
                        <div className="text-center">
                            <div className="flex justify-center mb-1"><Timer className="w-5 h-5 text-blue-500" /></div>
                            <div className="text-xl font-black text-gray-900 dark:text-white">{(totalSteps * 0.01).toFixed(0)}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Dakika</div>
                        </div>
                        <div className="w-px h-10 bg-gray-100 dark:bg-gray-800" />
                        <div className="text-center">
                            <div className="flex justify-center mb-1"><Footprints className="w-5 h-5 text-green-500 fill-current" /></div>
                            <div className="text-xl font-black text-gray-900 dark:text-white">{totalSteps}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Adım</div>
                        </div>
                    </div>

                    {/* START BUTTON */}
                    <button
                        onClick={() => router.push('/walk/tracking')}
                        className="w-full h-20 bg-gradient-to-r from-green-400 to-emerald-600 rounded-[2rem] flex items-center justify-between px-2 pl-8 shadow-lg shadow-green-500/30 group active:scale-95 transition-all"
                    >
                        <div className="text-left">
                            <div className="text-[10px] font-bold text-green-100 uppercase tracking-widest mb-1">MoffiWalk</div>
                            <div className="text-2xl font-black text-white">Başlat ⚡</div>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-[1.5rem] flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Footprints className="w-8 h-8 text-white fill-current" />
                        </div>
                    </button>

                </div>
            </div>

            {/* ACTIVE CAMPAIGNS (New Feature) */}
            <div className="mt-8 pl-6">
                <div className="flex items-center justify-between pr-6 mb-4">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">Aktif Görevler 🔥</h3>
                    <span className="text-xs font-bold text-gray-400 cursor-pointer">Tümü</span>
                </div>

                <div className="flex gap-4 overflow-x-auto pr-6 pb-4 scrollbar-hide">
                    {campaigns.length === 0 ? <div className="text-sm text-gray-400 pl-2">Görevler yükleniyor...</div> : campaigns.map(camp => (
                        <div key={camp.id} className="min-w-[140px] p-4 bg-white dark:bg-[#151b2b] rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5 flex flex-col gap-3 group cursor-pointer hover:border-gray-200 dark:hover:border-white/10 transition">
                            <div className={`w-10 h-10 ${camp.color} rounded-xl flex items-center justify-center shadow-lg shadow-opacity-30`}>
                                <camp.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-400 mb-0.5">{camp.reward}</div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{camp.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MOFFI LEAGUE SUMMARY */}
            <div className="px-6 mt-4">
                <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-[2rem] p-5 relative overflow-hidden shadow-lg cursor-pointer active:scale-95 transition-transform" onClick={() => router.push('/walk/competition')}>
                    {/* Bkg Effects */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl -mr-10 -mt-10" />

                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5">
                            <Medal className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="flex-1">
                            <div className="text-[10px] font-bold text-yellow-500/80 uppercase tracking-widest mb-1">Lig Sıralaması</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-white">#4</span>
                                <span className="text-sm font-bold text-gray-400">/ 120 (Gümüş Ligi)</span>
                            </div>
                        </div>
                        <div className="text-xs font-bold text-white bg-white/10 px-3 py-1.5 rounded-lg border border-white/5">
                            Liderlik Tablosu
                        </div>
                    </div>
                </div>
            </div>

            {/* NEARBY BUSINESS TEASER */}
            <div className="px-6 mt-6 mb-8">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-[2rem] border border-blue-100 dark:border-blue-900/30 flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Store className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-0.5">Yakınlarda Fırsat!</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">Starbucks (200m) - x2 Puan</div>
                    </div>
                </div>
            </div>

            <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </main>
    );
}
