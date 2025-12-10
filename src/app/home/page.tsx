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
    User,
    Shirt
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- COMPONENTS ---

const NavigationBar = ({ active }: { active: string }) => {
    const router = useRouter();
    const navItems = [
        { id: 'home', icon: Home, label: 'Ana Sayfa', path: '/home' },
        { id: 'explore', icon: Compass, label: 'Keşfet', path: '/shop' },
        { id: 'create', icon: PlusCircle, label: 'Oluştur', isPrimary: true, path: '/studio' },
        { id: 'community', icon: Users, label: 'Topluluk', path: '/community' },
        { id: 'profile', icon: User, label: 'Profil', path: '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none">
            <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-[2.5rem] shadow-2xl p-2 flex justify-between items-center pointer-events-auto mx-auto max-w-md">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => router.push(item.path)}
                        className={cn(
                            "w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 relative",
                            item.isPrimary
                                ? "bg-[#5B4D9D] text-white shadow-lg shadow-purple-500/30 -mt-8 w-14 h-14"
                                : (active === item.id ? "text-[#5B4D9D] bg-purple-50 dark:bg-white/5" : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-200")
                        )}
                    >
                        <item.icon className={cn("w-6 h-6", item.isPrimary && "w-7 h-7")} />
                        {active === item.id && !item.isPrimary && (
                            <span className="absolute -bottom-1 w-1 h-1 bg-[#5B4D9D] rounded-full" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Header = () => (
    <header className="flex items-center justify-between px-6 py-4 sticky top-0 bg-[#F8F9FC]/80 dark:bg-black/80 backdrop-blur-xl z-40">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-pink-500 p-[2px]">
                <img
                    src="https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=200"
                    className="w-full h-full rounded-full object-cover border-2 border-white dark:border-black"
                />
            </div>
            <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">Günaydın, Mochi!</h1>
                <p className="text-[10px] font-medium text-gray-500">Golden Retriever • 2 Yaş</p>
            </div>
        </div>
        <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-600 dark:text-gray-300 shadow-sm relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-black" />
            </button>
        </div>
    </header>
);

const HeroCard = () => (
    <section className="px-6 mb-8">
        <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl group">
            <img
                src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                        Mutlu & Enerjik
                    </span>
                </div>
                <h2 className="text-3xl font-black mb-6 leading-none">Bugün harika<br />hissediyor! 🐾</h2>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Enerji', val: '92%', icon: Zap, color: 'bg-yellow-500' },
                        { label: 'Sağlık', val: '100%', icon: Activity, color: 'bg-green-500' },
                        { label: 'Sevgi', val: '85%', icon: Heart, color: 'bg-pink-500' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                            <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-white mb-2 shadow-sm", stat.color)}>
                                <stat.icon className="w-3 h-3" fill="currentColor" />
                            </div>
                            <div className="text-lg font-bold leading-none mb-0.5">{stat.val}</div>
                            <div className="text-[10px] opacity-70 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
);

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

const ModuleGrid = () => {
    const router = useRouter();
    return (
        <section className="px-6 mb-10">
            <div className="grid grid-cols-2 gap-4">
                <div
                    onClick={() => router.push('/studio')}
                    className="col-span-1 bg-[#F3E5F5] dark:bg-purple-900/20 p-5 rounded-[2rem] relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]"
                >
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-purple-600 dark:text-purple-300 mb-3 shadow-sm">
                            <Palette className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">Moffi<br />Studio</h3>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium">Kendi tarzını yarat</p>
                    </div>
                    <img
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/art-supplies-4034825-3337482.png"
                        className="absolute right-[-10px] bottom-[-10px] w-24 opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div
                    onClick={() => router.push('/shop')}
                    className="col-span-1 bg-[#E0F7FA] dark:bg-cyan-900/20 p-5 rounded-[2rem] relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]"
                >
                    <div className="relative z-10">
                        <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center text-cyan-600 dark:text-cyan-300 mb-3 shadow-sm">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">Moffi<br />Shop</h3>
                        <p className="text-[10px] text-gray-500 mt-1 font-medium">Trend ürünler</p>
                    </div>
                    <img
                        src="https://cdn3d.iconscout.com/3d/premium/thumb/shopping-bag-4050965-3363926.png"
                        className="absolute right-[-10px] bottom-[-10px] w-24 opacity-80 group-hover:scale-110 transition-transform duration-500"
                    />
                </div>

                <div
                    onClick={() => router.push('/community')}
                    className="col-span-2 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-5 rounded-[2rem] flex items-center justify-between relative overflow-hidden group cursor-pointer"
                >
                    <div className="relative z-10">
                        <h3 className="font-bold text-lg mb-1">Topluluğa Katıl 🌟</h3>
                        <p className="text-xs text-gray-300 font-medium">15k+ Pet sahibi burada!</p>
                    </div>
                    <div className="flex -space-x-3 mr-4">
                        {[1, 2, 3, 4].map(i => (
                            <img key={i} src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-8 h-8 rounded-full border-2 border-gray-800" />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const Community = () => {
    const router = useRouter();
    return (
        <section className="mb-10 pl-6">
            <div className="flex justify-between items-center pr-6 mb-4">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">Popüler Paylaşımlar</h3>
                <button
                    onClick={() => router.push('/community')}
                    className="text-xs font-bold text-[#5B4D9D]"
                >
                    Tümü
                </button>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 pr-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="min-w-[280px] h-[320px] rounded-[2rem] overflow-hidden relative shadow-lg group">
                        <img
                            src={`https://images.unsplash.com/photo-${i === 1 ? '1548199973-03cce0bbc87b' : (i === 2 ? '1583337130417-3346a1be7dee' : '1537151608828-ea2b11777ee8')}?q=80&w=400`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 p-5 text-white">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={`https://i.pravatar.cc/100?img=${i + 20}`} className="w-6 h-6 rounded-full border border-white" />
                                <span className="text-xs font-bold">@user{i}92</span>
                            </div>
                            <p className="text-sm font-medium leading-snug line-clamp-2">Harika bir pazar yürüyüşü! 🌳🐶 #moffipet</p>
                        </div>
                        <button className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white">
                            <Heart className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};

const ForYou = () => {
    const router = useRouter();
    return (
        <section className="px-6 mb-24">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Senin İçin Önerilenler</h3>
            <div className="space-y-4">
                <div
                    onClick={() => router.push('/shop')}
                    className="bg-white dark:bg-[#1A1A1A] p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 flex gap-4 cursor-pointer active:scale-95 transition-transform"
                >
                    <div className="w-20 h-20 rounded-2xl bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center flex-shrink-0">
                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/dog-food-4965276-4128522.png" className="w-16" />
                    </div>
                    <div>
                        <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded text-xs mb-2 inline-block">Beslenme</span>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Premium Mama İndirimi</h4>
                        <p className="text-xs text-gray-500 mt-1">Mochi'nin favori mamalarında %20 indirim fırsatı.</p>
                    </div>
                </div>
                <div
                    onClick={() => router.push('/vet')}
                    className="bg-white dark:bg-[#1A1A1A] p-4 rounded-[2rem] shadow-sm border border-gray-100 dark:border-white/5 flex gap-4 cursor-pointer active:scale-95 transition-transform"
                >
                    <div className="w-20 h-20 rounded-2xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center flex-shrink-0">
                        <img src="https://cdn3d.iconscout.com/3d/premium/thumb/calendar-3578848-2993888.png" className="w-14" />
                    </div>
                    <div>
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded text-xs mb-2 inline-block">Hatırlatıcı</span>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">Aşı Takvimi</h4>
                        <p className="text-xs text-gray-500 mt-1">Karma aşı zamanı yaklaşıyor. Randevu almayı unutma.</p>
                    </div>
                </div>
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
                <ModuleGrid />
                <Community />
                <ForYou />
            </motion.div>
            <NavigationBar active="home" />

            {/* Global Gradient Blob for Atmosphere */}
            <div className="fixed top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-purple-100/30 to-transparent dark:from-purple-900/10 pointer-events-none -z-10" />
        </main>
    );
}
