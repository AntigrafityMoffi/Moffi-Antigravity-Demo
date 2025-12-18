"use client";

import { useState } from "react";
import {
    Upload, Link as LinkIcon, ShoppingBag,
    Image as ImageIcon, Layers, Video,
    Sparkles, Download, CheckCircle, Smartphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- TYPES ---
type InputMode = "upload" | "link" | "catalog";
type PackType = "hero" | "listing" | "video";

export default function StudioLabPage() {
    const [activeTab, setActiveTab] = useState<InputMode>("upload");
    const [selectedPacks, setSelectedPacks] = useState<PackType[]>(["hero"]);

    return (
        <div className="min-h-screen w-full bg-[#09090b] text-white flex flex-col md:flex-row overflow-y-auto md:overflow-hidden font-sans selection:bg-purple-500/30">

            {/* --- LEFT PANEL: INPUT LAYER --- */}
            <div className="w-full md:w-[320px] shrink-0 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-[#0c0c0e] order-2 md:order-1">
                {/* Header - Hidden on mobile to save space, or kept smaller */}
                <div className="h-14 md:h-16 border-b border-white/10 flex items-center px-4 md:px-6">
                    <h1 className="font-bold text-lg tracking-tight flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                        Moffi Studio
                    </h1>
                    <span className="ml-auto text-[10px] font-mono opacity-50 border border-white/10 px-1.5 py-0.5 rounded">V3.0 LAB</span>
                </div>

                {/* Input Tabs */}
                <div className="flex p-2 gap-1 border-b border-white/5">
                    <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')} icon={Upload} label="Yükle" />
                    <TabButton active={activeTab === 'link'} onClick={() => setActiveTab('link')} icon={LinkIcon} label="URL" badge="Beta" />
                    <TabButton active={activeTab === 'catalog'} onClick={() => setActiveTab('catalog')} icon={ShoppingBag} label="Katalog" />
                </div>

                {/* Content Area */}
                <div className="p-4 md:p-6 relative min-h-[300px] md:min-h-0 md:flex-1">
                    <AnimatePresence mode="wait">
                        {activeTab === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="h-full flex flex-col"
                            >
                                <div className="flex-1 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all cursor-pointer group py-8 md:py-0">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Upload className="w-8 h-8 text-neutral-400 group-hover:text-purple-400" />
                                    </div>
                                    <div className="text-center space-y-1">
                                        <p className="font-medium text-sm">Fotoğrafı sürükle</p>
                                        <p className="text-xs text-neutral-500">veya seçmek için tıkla</p>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    {/* Rules hidden on mobile for compactness? No keep them. */}
                                    <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">Yükleme Kuralları</h3>
                                    <ul className="space-y-2 text-xs text-neutral-400">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Net ışık</li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Tek ürün</li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="w-3.5 h-3.5 text-green-500" /> Yüksek çözünürlük</li>
                                    </ul>
                                </div>
                            </motion.div>
                        )}
                        {/* Other tabs intentionally left as placeholders for MVP */}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- CENTER PANEL: PREVIEW & QC --- */}
            <div className="w-full md:flex-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[#050505] relative flex flex-col min-h-[50vh] order-1 md:order-2">
                {/* Toolbar */}
                <div className="h-14 border-b border-white/5 px-4 md:px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-neutral-500">Dosya:</span>
                        <span className="text-sm font-medium">Bekleniyor...</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Smartphone className="w-4 h-4 opacity-70" /></button>
                    </div>
                </div>

                {/* Empty State / Canvas */}
                <div className="flex-1 flex items-center justify-center p-6 md:p-10">
                    <div className="relative w-full max-w-[280px] md:max-w-md aspect-[3/4] rounded-3xl border border-white/10 bg-[#0A0A0A] shadow-2xl flex items-center justify-center overflow-hidden">
                        <div className="text-center space-y-2 opacity-30">
                            <ImageIcon className="w-12 h-12 mx-auto" />
                            <p className="text-sm font-medium">Önizleme Yok</p>
                        </div>
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    </div>
                </div>
            </div>

            {/* --- RIGHT PANEL: PRODUCTION ENGINE --- */}
            <div className="w-full md:w-[300px] shrink-0 border-t md:border-t-0 md:border-l border-white/10 bg-[#0c0c0e] flex flex-col order-3">
                <div className="p-6 border-b border-white/10">
                    <h2 className="font-bold text-sm mb-1">Üretim Motoru</h2>
                    <p className="text-[10px] text-neutral-400">Çıktı paketlerini seç</p>
                </div>

                <div className="p-4 space-y-3 flex-1 overflow-y-auto min-h-[200px] md:min-h-0">
                    <PackOption
                        id="hero"
                        title="Hero Pack"
                        desc="4 açı + Temiz BG"
                        icon={ImageIcon}
                        isActive={selectedPacks.includes('hero')}
                        onClick={() => setSelectedPacks(prev => prev.includes('hero') ? prev.filter(p => p !== 'hero') : [...prev, 'hero'])}
                    />
                    <PackOption
                        id="listing"
                        title="Listing Pack"
                        desc="Rozetli Pazar Yeri"
                        icon={Layers}
                        isActive={selectedPacks.includes('listing')}
                        onClick={() => setSelectedPacks(prev => prev.includes('listing') ? prev.filter(p => p !== 'listing') : [...prev, 'listing'])}
                    />
                    <PackOption
                        id="video"
                        title="Spin Video"
                        desc="360° Döngü"
                        icon={Video}
                        isActive={selectedPacks.includes('video')}
                        onClick={() => setSelectedPacks(prev => prev.includes('video') ? prev.filter(p => p !== 'video') : [...prev, 'video'])}
                    />
                </div>

                <div className="p-4 border-t border-white/10 bg-[#0c0c0e] sticky bottom-0 z-10">
                    <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                        <span>Tahmini Süre:</span>
                        <span className="text-white font-medium">~12 sn</span>
                    </div>
                    <button className="w-full h-12 bg-white text-black hover:bg-neutral-200 active:scale-95 transition-all rounded-xl font-bold flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        Üretimi Başlat
                    </button>
                </div>
            </div>

        </div>
    );
}

// --- SUBCOMPONENTS ---

function TabButton({ active, icon: Icon, label, onClick, badge }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex-1 h-9 rounded-lg flex items-center justify-center gap-2 text-xs font-medium transition-all relative",
                active ? "bg-white/10 text-white shadow-sm" : "text-neutral-500 hover:text-white hover:bg-white/5"
            )}
        >
            <Icon className="w-3.5 h-3.5" />
            {label}
            {badge && (
                <span className="absolute -top-1 -right-1 text-[8px] bg-purple-500 text-white px-1 rounded-full">{badge}</span>
            )}
        </button>
    )
}

function PackOption({ title, desc, icon: Icon, isActive, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none",
                isActive
                    ? "bg-purple-500/10 border-purple-500/50"
                    : "bg-white/5 border-white/5 hover:border-white/10"
            )}
        >
            <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                isActive ? "bg-purple-500 text-white" : "bg-white/5 text-neutral-400"
            )}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                <h3 className={cn("text-xs font-bold", isActive ? "text-purple-300" : "text-white")}>{title}</h3>
                <p className="text-[10px] text-neutral-400">{desc}</p>
            </div>
            <div className={cn(
                "ml-auto w-4 h-4 rounded-full border flex items-center justify-center",
                isActive ? "bg-purple-500 border-purple-500" : "border-white/20"
            )}>
                {isActive && <CheckCircle className="w-3 h-3 text-white" />}
            </div>
        </div>
    )
}
