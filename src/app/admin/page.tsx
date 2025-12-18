"use client";

import { useAuth } from "@/context/AuthContext";
import { Users, Eye, MousePointer2, Megaphone, Plus, Wallet, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Mock Chart Component (Visual only for now)
const MockChart = () => (
    <div className="relative w-full h-[200px] mt-8 flex items-end gap-2 justify-between px-4">
        {/* Grid lines */}
        <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-gray-100" />)}
        </div>

        {/* Bars/Points */}
        {[30, 45, 35, 60, 75, 50, 65].map((h, i) => (
            <div key={i} className="relative group w-full flex flex-col items-center gap-2 z-10">
                <div
                    className="w-full max-w-[40px] bg-gradient-to-t from-indigo-500 to-indigo-400 rounded-t-lg transition-all duration-500 hover:from-indigo-600 hover:to-indigo-500"
                    style={{ height: `${h * 2}px` }}
                />
                <span className="text-[10px] font-bold text-gray-400">
                    {['PZT', 'SAL', 'ÇAR', 'PER', 'CUM', 'CMT', 'PAZ'][i]}
                </span>

                {/* Tooltip */}
                <div className="absolute -top-10 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {h * 12} Ziyaretçi
                </div>
            </div>
        ))}
    </div>
);

export default function AdminDashboardPage() {
    const { user } = useAuth();
    const [period, setPeriod] = useState("Bu Hafta");

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-1">Kontrol Paneli</h1>
                    <p className="text-gray-500 font-medium flex items-center gap-1">
                        Hoşgeldin, <span className="text-gray-900">{user?.username || 'Moffi Partner'}</span> 👋
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-gray-400" />
                        <span className="font-bold text-gray-900">₺4,250.00</span>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 transition-all flex items-center gap-2 active:scale-95">
                        <Plus className="w-5 h-5" />
                        Yeni Kampanya
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "TOPLAM GÖSTERİM", value: "24.5K", change: "+12%", icon: Eye, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: "FİZİKSEL ZİYARET", value: "854", change: "+5%", icon: Users, color: "text-green-500", bg: "bg-green-50" },
                    { label: "SAYFA TIKLAMASI", value: "3,240", change: "+18%", icon: MousePointer2, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: "AKTİF KAMPANYA", value: "3", sub: "Aktif", icon: Megaphone, color: "text-orange-500", bg: "bg-orange-50" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg, stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            {stat.change ? (
                                <span className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold flex items-center gap-1">
                                    ↗ {stat.change}
                                </span>
                            ) : (
                                <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-500 text-[10px] font-bold">
                                    {stat.sub}
                                </span>
                            )}
                        </div>
                        <div className="text-2xl font-black text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Chart Section */}
                <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Haftalık Ziyaretçi Trafiği</h2>
                            <p className="text-sm text-gray-500">Mağazanın önünden geçen MoffiWalk kullanıcıları</p>
                        </div>
                        <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-gray-50 border border-gray-100 text-gray-700 text-xs font-bold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option>Bu Hafta</option>
                            <option>Geçen Hafta</option>
                            <option>Bu Ay</option>
                        </select>
                    </div>

                    <MockChart />
                </div>

                {/* Right Card: Pro Feature */}
                <div className="bg-gradient-to-br from-[#5B4D9D] to-[#4A3B8B] rounded-[2rem] p-8 text-white relative flex flex-col justify-between overflow-hidden shadow-xl shadow-indigo-200">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-500/20 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold mb-3 leading-tight">Canlı Yakınlık Bildirimi</h3>
                        <p className="text-indigo-100/90 leading-relaxed text-sm mb-8">
                            Şu an mağazanızın <span className="font-bold text-white">100m</span> yakınında <span className="font-bold text-white">12 potansiyel müşteri</span> yürüyor.
                        </p>
                    </div>

                    <button className="relative z-10 w-full bg-white text-[#5B4D9D] font-bold py-4 rounded-xl hover:bg-gray-50 active:scale-95 transition-all shadow-lg">
                        Anlık Bildirim Gönder (₺50)
                    </button>
                </div>
            </div>

            {/* QUICK LINKS FOR ADMIN (Hidden in screenshot but keeping for utility since this IS the admin panel) */}
            <div className="pt-8 border-t border-gray-200/50">
                <Link href="/admin/users" className="text-xs font-bold text-gray-400 hover:text-indigo-600 transition-colors uppercase tracking-widest flex items-center gap-1">
                    Kullanıcı Yönetimi Listesi &rarr;
                </Link>
            </div>
        </div>
    );
}
