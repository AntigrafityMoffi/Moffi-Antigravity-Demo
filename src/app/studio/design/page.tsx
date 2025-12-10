"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    ArrowLeft,
    Save,
    ShoppingCart,
    MoreVertical,
    Image as ImageIcon,
    Type,
    Sticker,
    Undo,
    Redo,
    Trash2,
    ZoomIn,
    ZoomOut,
    RotateCw,
    Move,
    Palette,
    Sparkles,
    LayoutTemplate,
    MousePointer2,
    Check,
    X,
    Maximize2,
    Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- TYPES ---
type LayerType = 'image' | 'text' | 'sticker';
interface Layer {
    id: number;
    type: LayerType;
    content: string;
    x: number;
    y: number;
    scale: number;
    rotation: number;
    opacity: number;
    color?: string;
    font?: string;
    locked?: boolean;
}

// --- CONSTANTS ---
const FONTS = ['Inter', 'Poppins', 'Playfair Display', 'Permanent Marker', 'Courier Prime'];
const COLORS = ['#000000', '#FFFFFF', '#1e3a8a', '#dc2626', '#16a34a', '#f59e0b', '#7c3aed', '#db2777'];

// --- LOADING COMPONENT ---
function CanvasLoader() {
    return (
        <div className="h-screen w-full flex items-center justify-center bg-[#F8F9FC] dark:bg-black">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-[#5B4D9D] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-gray-500">Stüdyo Yükleniyor...</p>
            </div>
        </div>
    );
}

// --- MAIN CONTENT WRAPPED IN SUSPENSE ---
function StudioCanvasContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // --- STATE ENGINE ---
    const [layers, setLayers] = useState<Layer[]>([]);
    const [activeLayerId, setActiveLayerId] = useState<number | null>(null);
    const [activeView, setActiveView] = useState<'front' | 'back'>('front');
    const [isProPanelOpen, setIsProPanelOpen] = useState(true);
    const [activeTool, setActiveTool] = useState<LayerType | 'layers' | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Derived
    const activeLayer = layers.find(l => l.id === activeLayerId);

    // --- ACTIONS ---
    const addLayer = (type: LayerType, content: string) => {
        const newLayer: Layer = {
            id: Date.now(),
            type,
            content,
            x: 50, y: 50,
            scale: 1,
            rotation: 0,
            opacity: 100,
            color: type === 'text' ? '#000000' : undefined,
            font: type === 'text' ? 'Inter' : undefined
        };
        setLayers([...layers, newLayer]);
        setActiveLayerId(newLayer.id);
        setActiveTool(null);
    };

    const updateLayer = (id: number, props: Partial<Layer>) => {
        setLayers(layers.map(l => l.id === id ? { ...l, ...props } : l));
    };

    const deleteLayer = (id: number) => {
        setLayers(layers.filter(l => l.id !== id));
        if (activeLayerId === id) setActiveLayerId(null);
    };

    const handleComplete = () => {
        setIsSuccessModalOpen(true);
    };

    const handleGoToCart = () => {
        router.push('/cart');
    };

    // --- UI COMPONENTS ---

    // 1. TOP BAR (Glass Header)
    const TopBar = () => (
        <header className="h-14 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 flex items-center justify-between px-4 z-50 fixed top-0 left-0 right-0">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition text-gray-600 dark:text-gray-300"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                    <h1 className="text-sm font-bold text-gray-900 dark:text-white">Studio Pro</h1>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition">
                    <Download className="w-5 h-5" />
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-white/10" />
                <button
                    onClick={handleComplete}
                    className="bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                    <Check className="w-4 h-4" />
                    Tamamla
                </button>
            </div>
        </header>
    );

    // 2. SUCCESS MODAL
    const SuccessModal = () => (
        <AnimatePresence>
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-md pointer-events-auto"
                        onClick={() => setIsSuccessModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="bg-white dark:bg-[#1A1A1A] w-full sm:w-[500px] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl relative z-50 pointer-events-auto border-t sm:border border-white/20"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-green-900/20 text-green-500 mb-6 flex items-center justify-center shadow-lg shadow-green-500/10">
                                <Check className="w-10 h-10" />
                            </div>

                            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">Harika İş! 🎉</h2>
                            <p className="text-gray-500 font-medium mb-8 max-w-xs">
                                Tasarımın başarıyla kaydedildi. Şimdi ne yapmak istersin?
                            </p>

                            <div className="w-full space-y-3">
                                <button
                                    onClick={handleGoToCart}
                                    className="w-full h-16 bg-[#5B4D9D] text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Sepete Git
                                </button>

                                <button
                                    onClick={() => router.push('/')}
                                    className="w-full h-16 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white rounded-2xl font-bold text-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                                >
                                    Alışverişe Devam Et
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    // ... (Other Components remain same but included for full file overwrite)
    const FloatingToolbar = () => (
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
            <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl p-2 rounded-[1.5rem] shadow-2xl border border-white/20 flex flex-col gap-2">
                {[
                    { id: 'select', icon: MousePointer2, label: 'Seç' },
                    { id: 'image', icon: ImageIcon, label: 'Foto' },
                    { id: 'text', icon: Type, label: 'Metin' },
                    { id: 'sticker', icon: Sticker, label: 'Sticker' },
                ].map((tool) => (
                    <button
                        key={tool.id}
                        onClick={() => setActiveTool(activeTool === tool.id ? null : tool.id as any)}
                        className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 relative group",
                            activeTool === tool.id
                                ? "bg-[#5B4D9D] text-white shadow-lg scale-105"
                                : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                        )}
                    >
                        <tool.icon className="w-5 h-5" />
                        <span className="absolute left-full ml-3 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {tool.label}
                        </span>
                    </button>
                ))}
            </div>
            <div className="bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl p-2 rounded-[1.5rem] shadow-2xl border border-white/20 flex flex-col gap-2">
                <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition">
                    <Undo className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition">
                    <Redo className="w-5 h-5" />
                </button>
            </div>
        </div>
    );

    const Canvas = () => (
        <div className="flex-1 relative bg-[#E5E5EA] dark:bg-black/50 overflow-hidden flex items-center justify-center">
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />
            <div className="absolute top-24 flex gap-1 bg-white/50 dark:bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/20 z-30 shadow-sm">
                <button
                    onClick={() => setActiveView('front')}
                    className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", activeView === 'front' ? "bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white" : "text-gray-500")}
                >
                    Ön
                </button>
                <button
                    onClick={() => setActiveView('back')}
                    className={cn("px-4 py-1.5 rounded-full text-xs font-bold transition-all", activeView === 'back' ? "bg-white dark:bg-gray-800 shadow-sm text-black dark:text-white" : "text-gray-500")}
                >
                    Arka
                </button>
            </div>
            <motion.div
                layout
                className="relative w-[400px] h-[550px] shadow-2xl rounded-sm"
            >
                <img
                    src={activeView === 'front' ? "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600" : "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600"}
                    className="w-full h-full object-contain drop-shadow-xl relative z-10 pointer-events-none"
                    alt="Mockup"
                />
                <div className="absolute top-[20%] left-[25%] right-[25%] bottom-[20%] border border-dashed border-white/50 rounded z-20 overflow-hidden mix-blend-multiply dark:mix-blend-normal">
                    {layers.map(layer => (
                        <motion.div
                            key={layer.id}
                            drag
                            dragMomentum={false}
                            className={cn(
                                "absolute cursor-pointer active:cursor-grabbing hover:ring-1 hover:ring-blue-400 border border-transparent",
                                activeLayerId === layer.id ? "ring-2 ring-[#5B4D9D]" : ""
                            )}
                            style={{
                                x: 0, y: 0,
                                left: `${layer.x}%`, top: `${layer.y}%`,
                                zIndex: activeLayerId === layer.id ? 50 : 10
                            }}
                            onClick={(e) => { e.stopPropagation(); setActiveLayerId(layer.id); }}
                        >
                            {layer.type === 'text' && (
                                <span
                                    className="whitespace-nowrap text-2xl font-bold p-2"
                                    style={{
                                        color: layer.color,
                                        fontFamily: layer.font,
                                        transform: `scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                                        opacity: layer.opacity / 100
                                    }}
                                >
                                    {layer.content}
                                </span>
                            )}
                            {layer.type === 'image' && (
                                <img
                                    src={layer.content}
                                    className="w-24 h-24 object-contain pointer-events-none"
                                    style={{
                                        transform: `scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                                        opacity: layer.opacity / 100
                                    }}
                                />
                            )}
                            {layer.type === 'sticker' && (
                                <img
                                    src={layer.content}
                                    className="w-24 h-24 object-contain pointer-events-none"
                                    style={{
                                        transform: `scale(${layer.scale}) rotate(${layer.rotation}deg)`,
                                        opacity: layer.opacity / 100
                                    }}
                                />
                            )}
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );

    const ProPanel = () => (
        <aside className={cn(
            "w-80 bg-white/90 dark:bg-[#1A1A1A]/90 backdrop-blur-xl border-l border-gray-200/50 dark:border-white/5 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] z-50 pt-16",
            isProPanelOpen ? "mr-0" : "-mr-80"
        )}>
            <div className="px-6 pb-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                <h2 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-[#5B4D9D]" />
                    Özellikler
                </h2>
                <button onClick={() => setIsProPanelOpen(false)} className="text-gray-400 hover:text-black dark:hover:text-white">
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {activeLayer ? (
                    <>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                            <div className="w-10 h-10 rounded-lg bg-white dark:bg-black flex items-center justify-center text-gray-500 shadow-sm">
                                {activeLayer.type === 'text' && <Type className="w-5 h-5" />}
                                {activeLayer.type === 'image' && <ImageIcon className="w-5 h-5" />}
                                {activeLayer.type === 'sticker' && <Sticker className="w-5 h-5" />}
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                                    {activeLayer.type === 'text' ? 'Metin Katmanı' : 'Görsel Katmanı'}
                                </h3>
                                <p className="text-[10px] text-gray-500">ID: {activeLayer.id}</p>
                            </div>
                            <button
                                onClick={() => deleteLayer(activeLayer.id)}
                                className="ml-auto w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Boyut</span>
                                    <span>{Math.round(activeLayer.scale * 100)}%</span>
                                </div>
                                <input
                                    type="range" min="0.5" max="3" step="0.1"
                                    value={activeLayer.scale}
                                    onChange={(e) => updateLayer(activeLayer.id, { scale: parseFloat(e.target.value) })}
                                    className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#5B4D9D]"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Döndür</span>
                                    <span>{activeLayer.rotation}°</span>
                                </div>
                                <input
                                    type="range" min="-180" max="180" step="1"
                                    value={activeLayer.rotation}
                                    onChange={(e) => updateLayer(activeLayer.id, { rotation: parseInt(e.target.value) })}
                                    className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#5B4D9D]"
                                />
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-gray-500">
                                    <span>Opaklık</span>
                                    <span>{activeLayer.opacity}%</span>
                                </div>
                                <input
                                    type="range" min="0" max="100" step="1"
                                    value={activeLayer.opacity}
                                    onChange={(e) => updateLayer(activeLayer.id, { opacity: parseInt(e.target.value) })}
                                    className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#5B4D9D]"
                                />
                            </div>
                        </div>
                        {activeLayer.type === 'text' && (
                            <div className="space-y-3">
                                <span className="text-xs font-bold text-gray-500">Renk</span>
                                <div className="flex flex-wrap gap-2">
                                    {COLORS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => updateLayer(activeLayer.id, { color: c })}
                                            className={cn(
                                                "w-8 h-8 rounded-full border border-gray-200 dark:border-white/10 shadow-sm transition-transform",
                                                activeLayer.color === c ? "scale-110 ring-2 ring-[#5B4D9D]" : "hover:scale-105"
                                            )}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center space-y-4 opacity-60">
                        <MousePointer2 className="w-12 h-12" />
                        <p className="text-sm font-medium">Bir katman seçin veya<br />yeni bir öğe ekleyin.</p>
                    </div>
                )}
            </div>
            <div className="p-6 border-t border-gray-100 dark:border-white/5">
                <button className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all">
                    <Sparkles className="w-4 h-4" /> AI Tasarım Asistanı
                </button>
            </div>
        </aside>
    );

    const Drawer = () => (
        <AnimatePresence>
            {activeTool === 'text' && (
                <motion.div
                    initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                    className="absolute left-24 top-24 bottom-24 w-72 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-[2rem] shadow-2xl z-30 p-6"
                >
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Metin Stili Seç</h3>
                    <div className="space-y-3">
                        {['Başlık', 'Alt Başlık', 'Gövde Metni', 'İmza'].map((t, i) => (
                            <button
                                key={t}
                                onClick={() => addLayer('text', t)}
                                className="w-full h-16 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 hover:border-[#5B4D9D] transition flex items-center px-6 font-bold text-gray-700 dark:text-gray-200"
                                style={{ fontSize: 20 - i * 2 }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
            {activeTool === 'sticker' && (
                <motion.div
                    initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
                    className="absolute left-24 top-24 bottom-24 w-72 bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-[2rem] shadow-2xl z-30 p-6 overflow-hidden flex flex-col"
                >
                    <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Sticker Ekle</h3>
                    <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                            <button
                                key={i}
                                onClick={() => addLayer('sticker', 'https://cdn-icons-png.flaticon.com/128/2171/2171991.png')}
                                className="aspect-square bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center hover:bg-gray-100 hover:scale-105 transition border border-gray-100 dark:border-white/5"
                            >
                                <span className="text-2xl">🌟</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="h-screen flex flex-col font-sans bg-[#F8F9FC] dark:bg-black overflow-hidden relative">
            <TopBar />
            <div className="flex-1 flex relative mt-14">
                <FloatingToolbar />
                <Drawer />
                <Canvas />
                <ProPanel />
                {!isProPanelOpen && (
                    <button
                        onClick={() => setIsProPanelOpen(true)}
                        className="absolute right-6 top-6 z-40 w-12 h-12 bg-white dark:bg-[#1A1A1A] rounded-full flex items-center justify-center shadow-lg border border-gray-200 dark:border-white/10 hover:scale-105 transition"
                    >
                        <LayoutTemplate className="w-5 h-5 text-gray-600 dark:text-white" />
                    </button>
                )}
            </div>
            <SuccessModal />
        </div>
    );
}

// --- MAIN EXPORT ---
export default function MasterStudioPage() {
    return (
        <Suspense fallback={<CanvasLoader />}>
            <StudioCanvasContent />
        </Suspense>
    );
}
