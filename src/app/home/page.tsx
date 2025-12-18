"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Heart,
    Zap,
    Activity,
    MapPin,
    ShoppingBag,
    Palette,
    Users,
    Stethoscope,
    Bell,
    Search,
    ChevronRight,
    Play,
    Utensils,
    Footprints,
    Home,
    Compass,
    PlusCircle,
    MessageCircle,
    Wind,
    Shirt,
    Timer, Tag, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/home/BottomNav";
import HeroCard from "@/components/home/HeroCard";
import { PetSwitcher } from "@/components/common/PetSwitcher";
import { usePet } from "@/context/PetContext";
import { GuardianModal } from "@/components/guardian/GuardianModal";
import { DailySummaryCard } from "@/components/memory/DailySummaryCard";

// --- COMPONENTS ---





const Header = () => {
    const { activePet } = usePet();
    const router = useRouter();

    return (
        <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-[#F8F9FC]/80 dark:bg-black/80 backdrop-blur-xl z-40">
            <div className="flex items-center gap-3">
                {/* Active Pet Display (Premium Dynamic Pill) */}
                <PetSwitcher mode="compact" />
            </div>
            <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black" />
                </button>
            </div>
        </header>
    );
};



// --- CONTEXT GRID ENGINE ---
const ContextGrid = () => {
    const router = useRouter();
    // Context State: 'normal' | 'calm' (Travel moved to Profile)
    const [context, setContext] = useState<'normal' | 'calm'>('normal');
    const [isGuardianOpen, setIsGuardianOpen] = useState(false);

    // --- WIDGET COMPONENTS ---

    // 1. GUARDIAN (Safety First)
    const GuardianWidget = () => (
        <div
            onClick={() => setIsGuardianOpen(true)}
            className="bg-red-500 text-white p-4 rounded-[2rem] flex items-center justify-between shadow-lg shadow-red-500/20 active:scale-95 transition-transform cursor-pointer overflow-hidden relative group h-full"
        >
            <div className="relative z-10 flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center animate-pulse">
                    <Bell className="w-5 h-5 fill-current" />
                </div>
                <div>
                    <h3 className="font-bold text-sm leading-tight">Guardian<br />Protocol</h3>
                    <p className="text-[10px] text-red-100 opacity-80">Acil Durum Ağı</p>
                </div>
            </div>
            <div className="absolute right-[-10px] top-[-10px] w-20 h-20 bg-white/10 rounded-full blur-xl" />
        </div>
    );

    // 2. CALM MODE (Innovative)
    const CalmWidget = () => (
        <div
            onClick={() => setContext(prev => prev === 'calm' ? 'normal' : 'calm')}
            className={cn(
                "p-4 rounded-[2rem] flex flex-col justify-between cursor-pointer transition-all duration-500 overflow-hidden relative border",
                context === 'calm'
                    ? "bg-[#1a1a2e] text-purple-200 border-purple-500/30 col-span-2 row-span-1 h-32"
                    : "bg-[#E3F2FD] dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 border-transparent active:scale-95 h-full"
            )}
        >
            <div className="flex justify-between items-start relative z-10">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center transition-colors", context === 'calm' ? "bg-purple-500/20 text-purple-300" : "bg-white dark:bg-white/10 text-blue-500")}>
                    {context === 'calm' ? <Zap className="w-5 h-5 fill-current" /> : <Wind className="w-5 h-5" />}
                </div>
                {context === 'calm' && <span className="text-[10px] font-bold bg-purple-500/20 px-2 py-1 rounded-full animate-pulse">AKTİF</span>}
            </div>

            <div className="relative z-10 mt-2">
                <h3 className="font-bold text-sm">{context === 'calm' ? "Calm Mode Aktif" : "Sakinleştir"}</h3>
                <p className="text-[10px] opacity-70 leading-tight">
                    {context === 'calm' ? "Anti-stres frekansı çalıyor..." : "Fırtına/Gürültü için"}
                </p>
            </div>

            {/* Visual Effects for Calm Mode */}
            {context === 'calm' && (
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute inset-0 bg-[#1a1a2e]/80 backdrop-blur-[1px]" />
                </div>
            )}
        </div>
    );



    // 4. STANDARD MODULES
    const StudioWidget = () => (
        <div
            onClick={() => router.push('/studio')}
            className="bg-[#F3E5F5] dark:bg-purple-900/20 p-4 rounded-[2rem] relative overflow-hidden group cursor-pointer active:scale-95 transition-transform h-full"
        >
            <div className="relative z-10">
                <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mb-2 shadow-sm">
                    <Palette className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Studio</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Tasarla</p>
            </div>
        </div>
    );

    const ShopWidget = () => (
        <div
            onClick={() => router.push('/shop')}
            className="bg-[#E0F7FA] dark:bg-cyan-900/20 p-4 rounded-[2rem] relative overflow-hidden group cursor-pointer active:scale-95 transition-transform h-full"
        >
            <div className="relative z-10">
                <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-300 mb-2 shadow-sm">
                    <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Market</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Keşfet</p>
            </div>
        </div>
    );

    return (
        <section className="px-6 mb-10">
            {/* Context Switcher (Demo Controls) */}
            <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar opacity-50 hover:opacity-100 transition-opacity">
                {['normal', 'calm'].map((ctx) => (
                    <button
                        key={ctx}
                        onClick={() => setContext(ctx as any)}
                        className={cn(
                            "text-[10px] px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 transition-colors uppercase font-bold",
                            context === ctx ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-400"
                        )}
                    >
                        {ctx}
                    </button>
                ))}
            </div>

            {/* Simple Grid Layout */}
            <div className="grid grid-cols-2 gap-4">

                {/* 1. Context / Widget Row */}
                {context === 'normal' && (
                    <>
                        <div className="col-span-1">
                            <GuardianWidget />
                        </div>
                        <div className="col-span-1">
                            <CalmWidget />
                        </div>
                    </>
                )}

                {context === 'calm' && (
                    <div className="col-span-2">
                        <CalmWidget />
                    </div>
                )}


                {/* 2. Core Modules Row */}
                <StudioWidget />
                <ShopWidget />

                {/* 3. Memories / Paw Diary (Full Width) */}
                <div className="col-span-2">
                    <DailySummaryCard />
                </div>
            </div>

            <GuardianModal
                isOpen={isGuardianOpen}
                onClose={() => setIsGuardianOpen(false)}
                onActivate={() => router.push('/walk/tracking?mode=guardian')}
            />
        </section>
    );
};

// --- RESTORED SECTIONS ---

const QuickActions = () => {
    const router = useRouter();
    return (
        <section className="px-6 mb-8 overflow-x-auto no-scrollbar">
            <div className="flex items-start gap-6 min-w-max">
                {[
                    { label: 'AI Giydir', icon: Shirt, color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20', path: '/ai-dressing' },
                    { label: 'Yürüyüş', icon: Footprints, color: 'text-orange-500 bg-orange-50 dark:bg-orange-900/20', path: '/walk' },
                    { label: 'Oyun', icon: Play, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20', path: '/game' },
                    { label: 'Yemek', icon: Utensils, color: 'text-green-500 bg-green-50 dark:bg-green-900/20', path: '/food' },
                    { label: 'Veteriner', icon: Stethoscope, color: 'text-red-500 bg-red-50 dark:bg-red-900/20', path: '/vet' },
                ].map((action, i) => (
                    <button
                        key={i}
                        onClick={() => router.push(action.path)}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm", action.color)}>
                            <action.icon className="w-7 h-7" />
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{action.label}</span>
                    </button>
                ))}
            </div>
        </section>
    );
};

// --- PREMIUM SECTIONS ---

const FeaturedDeals = () => {
    const router = useRouter();
    return (
        <section className="mb-10 pl-6">
            <div className="flex justify-between items-end pr-6 mb-5">
                <div>
                    <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <Tag className="w-5 h-5 text-orange-500" />
                        Günün Fırsatları
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-1">Sona ermeden yakala! ⚡</p>
                </div>
                {/* Countdown Timer Badge */}
                <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono font-bold">
                    <Timer className="w-3 h-3 text-orange-400" />
                    <span>04:21:12</span>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 pr-6 snap-x snap-mandatory">
                {/* HERO DEAL CARD */}
                <div
                    onClick={() => router.push('/shop/deal/1')}
                    className="min-w-[300px] h-[180px] bg-gradient-to-r from-orange-500 to-pink-500 rounded-[2rem] relative overflow-hidden shrink-0 snap-center shadow-lg shadow-orange-500/30 group cursor-pointer"
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
                        <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold mb-2 w-max border border-white/20">
                            %40 İNDİRİM
                        </div>
                        <h4 className="font-black text-2xl leading-none mb-1">Premium<br />Somon Mama</h4>
                        <p className="text-xs opacity-90 mb-4">Omega-3 deposu, tüy dostu.</p>
                        <div className="flex args-center gap-2">
                            <span className="font-bold text-lg">₺459</span>
                            <span className="text-sm opacity-60 line-through">₺765</span>
                        </div>
                    </div>
                    <img
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/dog-food-4965276-4128522.png"
                        className="absolute -right-8 -bottom-8 w-48 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12"
                    />
                </div>

                {/* SECONDARY DEALS */}
                {[
                    { title: "Akıllı Tasma", price: "₺899", old: "₺1200", img: "https://cdn3d.iconscout.com/3d/premium/thumb/dog-collar-5163654-4318728.png", bg: "bg-blue-50 dark:bg-blue-900/10", tag: "bg-blue-100 text-blue-600" },
                    { title: "Kedi Tırmalaması", price: "₺250", old: "₺350", img: "https://cdn3d.iconscout.com/3d/premium/thumb/cat-tree-5379878-4497746.png", bg: "bg-purple-50 dark:bg-purple-900/10", tag: "bg-purple-100 text-purple-600" }
                ].map((deal, i) => (
                    <div
                        key={i}
                        onClick={() => router.push('/shop')}
                        className={cn("min-w-[160px] h-[180px] rounded-[2rem] p-4 relative flex flex-col justify-between shrink-0 snap-center group cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-colors", deal.bg)}
                    >
                        <div className="absolute top-3 right-3">
                            <div className={cn("text-[10px] font-bold px-2 py-1 rounded-full", deal.tag)}>FIRSAT</div>
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <img src={deal.img} className="w-24 drop-shadow-lg transition-transform group-hover:scale-110" />
                        </div>
                        <div>
                            <h5 className="font-bold text-gray-900 dark:text-white text-sm leading-tight mb-1">{deal.title}</h5>
                            <div className="flex items-baseline gap-2">
                                <span className="font-black text-gray-900 dark:text-white">{deal.price}</span>
                                <span className="text-[10px] text-gray-400 line-through">{deal.old}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

const FeaturedCommunity = () => {
    const router = useRouter();
    return (
        <section className="px-6 mb-24">
            <div className="flex justify-between items-center mb-5">
                <div>
                    <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-yellow-500" />
                        Öne Çıkanlar
                    </h3>
                    <p className="text-xs text-gray-400 font-medium mt-1">Topluluğun en iyileri 🐾</p>
                </div>
                <button
                    onClick={() => router.push('/community')}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-200 transition-colors"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* LARGE FEATURED POST */}
                <div className="col-span-2 h-[280px] rounded-[2.5rem] overflow-hidden relative group cursor-pointer shadow-lg">
                    <img
                        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* Floating User Pill */}
                    <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md pl-1 pr-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
                        <img src="https://i.pravatar.cc/100?img=12" className="w-6 h-6 rounded-full border border-white" />
                        <span className="text-xs font-bold text-white">@doglover_99</span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Haftanın En İyisi</span>
                            <div className="flex items-center gap-1 text-xs font-bold opacity-80"><Heart className="w-3 h-3 fill-current" /> 1.2k</div>
                        </div>
                        <p className="font-bold leading-tight">Mochi ile ormanda harika bir sabah koşusu! 🌲✨ #nature #golden</p>
                    </div>
                </div>

                {/* SMALLER GRID POSTS */}
                {[
                    { img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=400", user: "catmom", likes: "854" },
                    { img: "https://images.unsplash.com/photo-1517423568366-eb51fb598484?q=80&w=400", user: "puglife", likes: "602" }
                ].map((post, i) => (
                    <div key={i} className="h-[200px] rounded-[2rem] overflow-hidden relative group cursor-pointer shadow-md">
                        <img
                            src={post.img}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute bottom-4 left-4 text-white">
                            <span className="text-[10px] font-bold opacity-90 block">@{post.user}</span>
                            <div className="flex items-center gap-1 text-[10px] font-bold"><Heart className="w-3 h-3 fill-white" /> {post.likes}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default function HomePage() {
    return (
        <main className="min-h-screen bg-[#F8F9FC] dark:bg-black font-sans pb-10">
            <Header />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <HeroCard />
                <QuickActions />
                <ContextGrid />
                <FeaturedDeals />
                <FeaturedCommunity />
            </motion.div>
            <BottomNav active="home" />

            {/* Global Gradient Blob for Atmosphere */}
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-purple-100/30 to-transparent dark:from-purple-900/10 pointer-events-none -z-10" />
        </main>
    );
}
