"use client";

import Link from "next/link";
import {
    Palette,
    Search,
    ShoppingBag,
    Sparkles,
    ChevronRight,
    Star,
    Crown,
    CheckCircle2,
    ArrowRight
} from "lucide-react";
import { BottomNav } from "@/components/home/BottomNav";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function StudioPage() {
    return (
        <main className="min-h-screen bg-[#F8F9FC] dark:bg-[#000000] pb-28 font-sans selection:bg-[#5B4D9D] selection:text-white">

            {/* 1. IMMERSIVE HERO SECTION */}
            <header className="relative w-full h-[55vh] overflow-hidden rounded-b-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.15)] z-10 group">
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img
                    src="https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=1200"
                    className="w-full h-full object-cover animate-in fade-in zoom-in duration-[2s] scale-105 group-hover:scale-110 transition-transform ease-out"
                    alt="Hero"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-20" />

                {/* Navbar (Absolute) */}
                <div className="absolute top-0 left-0 right-0 p-6 z-50 flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                        <Palette className="w-5 h-5 text-white" />
                        <span className="text-xs font-bold text-white tracking-widest uppercase">Studio</span>
                    </div>
                    <div className="flex gap-3">
                        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <Search className="w-5 h-5 text-white" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
                            <ShoppingBag className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-12 left-6 right-6 z-30">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <span className="inline-block px-3 py-1 bg-[#5B4D9D] text-white text-[10px] font-black tracking-widest uppercase rounded-lg mb-3 shadow-[0_0_20px_rgba(91,77,157,0.5)]">
                            Yeni Koleksiyon
                        </span>
                        <h1 className="text-5xl font-black text-white leading-[0.9] tracking-tight mb-4 drop-shadow-2xl">
                            Hayalindeki <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-white">
                                Tasarımı
                            </span> <br />
                            Yarat.
                        </h1>
                        <p className="text-gray-300 text-sm font-medium leading-relaxed max-w-[80%] mb-6">
                            Moffi Studio ile evcil dostuna özel, tamamen benzersiz ürünler tasarla. %100 Pamuk, %100 Sevgi.
                        </p>

                        <Link href="/studio/product/1">
                            <button className="group pl-6 pr-2 py-2 bg-white text-black rounded-full font-bold text-sm flex items-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                                Şimdi Keşfet
                                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center group-hover:rotate-45 transition-transform">
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            </button>
                        </Link>
                    </motion.div>
                </div>
            </header>

            {/* 2. FEATURED PARTNERS (Editoral Style) */}
            <section className="py-10 overflow-hidden">
                <div className="px-6 mb-5 flex items-end justify-between">
                    <div>
                        <span className="text-[10px] font-bold text-[#5B4D9D] uppercase tracking-widest block mb-1">Partnerler</span>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Seçkin Markalar</h2>
                    </div>
                </div>

                <div className="pl-6 overflow-x-auto scrollbar-hide flex gap-4 pr-6 pb-4">
                    {[
                        { name: "PawTex", image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=400", desc: "Premier Kumaş" },
                        { name: "PetHaus", image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=400", desc: "Modern Tasarım" },
                        { name: "Stitch", image: "https://images.unsplash.com/photo-1599443015574-be5fe8a05783?q=80&w=400", desc: "El Yapımı" },
                    ].map((brand, i) => (
                        <div key={i} className="min-w-[280px] h-[320px] relative rounded-[2rem] overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all">
                            <img src={brand.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                            <div className="absolute bottom-6 left-6 text-white">
                                <div className="flex items-center gap-1.5 mb-2">
                                    <h3 className="text-xl font-bold">{brand.name}</h3>
                                    <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400/20" />
                                </div>
                                <p className="text-xs text-gray-300 font-medium mb-4">{brand.desc}</p>
                                <span className="text-[10px] font-bold uppercase tracking-wider border-b border-white/30 pb-0.5">Koleksiyonu Gör</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. MOFFI OFFICIAL STORE (Spotlight) */}
            <section className="px-6 mb-12">
                <div className="relative w-full bg-gradient-to-br from-[#1A1A1A] to-black rounded-[2.5rem] p-8 overflow-hidden shadow-2xl border border-white/5">

                    {/* Background Glows */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#5B4D9D] rounded-full blur-[100px] opacity-30 animate-pulse" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-[80px] opacity-20" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Official Store</span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                            {[
                                { name: "Moffi Signature Hoodie", price: "499 ₺", img: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=400" },
                                { name: "Raincoat Pro Series", price: "650 ₺", img: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=400" },
                                { name: "Comfort Bed V2", price: "899 ₺", img: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=400" },
                                { name: "Travel Kit", price: "249 ₺", img: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=400" },
                            ].map((prod, i) => (
                                <Link key={i} href="/studio/product/1">
                                    <div className="group cursor-pointer">
                                        <div className="aspect-[4/5] bg-white/5 rounded-[1.5rem] overflow-hidden mb-3 relative border border-white/10">
                                            <img src={prod.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />

                                            {/* Add Button Overlay */}
                                            <div className="absolute bottom-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white text-white hover:text-black">
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                            </div>
                                        </div>
                                        <h4 className="text-sm font-bold text-white leading-tight mb-1">{prod.name}</h4>
                                        <p className="text-xs font-bold text-[#A78BFA]">{prod.price}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 transition">
                                Tüm Koleksiyonu Gör
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. AI INSPIRATION (Horizontal Pills) */}
            <section className="px-6 mb-24">
                <div className="flex items-center gap-2 mb-4 text-[#5B4D9D]">
                    <Sparkles className="w-5 h-5" />
                    <h2 className="text-lg font-black text-gray-900 dark:text-white">AI ile İlham Al</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    {["🐶 Minimalist Çizim", "🎨 Pop Art", "🌌 Galaktik", "🌿 Doğa Temalı", "👓 Hipster Pet", "🎂 Doğum Günü"].map((tag, i) => (
                        <button key={i} className="px-4 py-2.5 bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm hover:scale-105 active:scale-95 transition-all">
                            {tag}
                        </button>
                    ))}
                </div>
            </section>

            <BottomNav />
        </main>
    );
}
