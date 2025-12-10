"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Star,
    ShieldCheck,
    Truck,
    Check,
    ChevronRight,
    Info,
    ShoppingBag,
    Wand2,
    Heart,
    Share2,
    RotateCcw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK PRODUCT DB ---
const PRODUCT_DB = {
    id: 1,
    name: "Premium Cotton Hoodie",
    basePrice: 499,
    rating: 4.9,
    reviews: 1240,
    features: ["%100 Organik Pamuk", "Yıkanabilir Baskı", "Oversize Kesim", "Moffi Garantisi"],
    colors: [
        { id: 'white', name: 'Kar Beyazı', hex: '#FFFFFF', priceMod: 0, shadow: 'shadow-gray-200' },
        { id: 'black', name: 'Gece Siyahı', hex: '#1A1A1A', priceMod: 0, shadow: 'shadow-gray-900' },
        { id: 'heather', name: 'Gri Melanj', hex: '#A0A0A0', priceMod: 0, shadow: 'shadow-gray-400' },
        { id: 'cream', name: 'Bugday', hex: '#F5F5DC', priceMod: 20, shadow: 'shadow-yellow-100' },
        { id: 'navy', name: 'Okyanus', hex: '#1e3a8a', priceMod: 20, shadow: 'shadow-blue-900' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    printTypes: [
        { id: 'digital', name: 'Dijital Baskı', desc: 'Canlı renkler', price: 0 },
        { id: 'embroidery', name: 'Nakış İşleme', desc: 'Premium doku', price: 150 },
    ],
    images: {
        white: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600",
        black: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600",
        heather: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600", // Fallback
        cream: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600", // Fallback
        navy: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600", // Fallback
    }
};

export default function ProductConfiguratorPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const product = PRODUCT_DB; // Using mock for now

    // STATE
    const [selectedColor, setSelectedColor] = useState(product.colors[0]);
    const [selectedSize, setSelectedSize] = useState("M");
    const [printType, setPrintType] = useState(product.printTypes[0]);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isCartAnimating, setIsCartAnimating] = useState(false);

    // CALCS
    const totalPrice = product.basePrice + selectedColor.priceMod + printType.price;

    const handleStartDesign = () => {
        setIsAnimating(true);
        setTimeout(() => {
            router.push(`/studio/design?product=${product.id}&color=${selectedColor.id}&print=${printType.id}`);
        }, 1200);
    };

    const handleAddToCart = () => {
        setIsCartAnimating(true);
        setTimeout(() => setIsCartAnimating(false), 2000);
    };

    return (
        <main className="min-h-screen bg-[#F8F9FC] dark:bg-black font-sans pb-40">

            {/* 1. IMMERSIVE PRODUCT VIEWER (Apple Era) */}
            <div className="relative h-[65vh] bg-[#E5E5EA] dark:bg-[#111] rounded-b-[3.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)]">

                {/* Navbar Action Icons (Floating) */}
                <div className="absolute top-6 left-6 z-20">
                    <button
                        onClick={() => router.back()}
                        className="w-12 h-12 bg-white/60 dark:bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg border border-white/20"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-800 dark:text-white" />
                    </button>
                </div>
                <div className="absolute top-6 right-6 z-20 flex gap-3">
                    <button className="w-12 h-12 bg-white/60 dark:bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg border border-white/20">
                        <Share2 className="w-5 h-5 text-gray-800 dark:text-white" />
                    </button>
                    <button className="w-12 h-12 bg-white/60 dark:bg-black/30 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg border border-white/20">
                        <Heart className="w-5 h-5 text-gray-800 dark:text-white" />
                    </button>
                </div>

                {/* Main Image being configured */}
                <motion.img
                    key={selectedColor.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    src={product.images[selectedColor.id as keyof typeof product.images] || product.images.white}
                    className="w-full h-full object-cover object-center"
                    alt={product.name}
                />

                {/* Immersive Gradient Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F8F9FC] dark:from-black to-transparent" />

                {/* 360 Hint / Interaction */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                    <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full flex items-center gap-3 text-xs font-bold text-gray-800 dark:text-white border border-white/20 shadow-xl cursor-grab active:cursor-grabbing hover:scale-105 transition-transform">
                        <RotateCcw className="w-3.5 h-3.5" />
                        360° Çevir
                    </div>
                </div>
            </div>

            {/* 2. SPECIFICATION & CONFIGURATION (Soft UI) */}
            <div className="px-6 -mt-6 relative z-10">

                {/* Product Header Card */}
                <div className="bg-white dark:bg-[#151515] p-6 rounded-[2.5rem] shadow-xl border border-white/50 dark:border-white/5 mb-8">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-wider rounded-md">
                                    Best Seller
                                </span>
                                <div className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                                    <Star className="w-3 h-3 fill-current" /> {product.rating}
                                </div>
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">{product.name}</h1>
                        </div>
                        <div className="text-right">
                            <span className="text-3xl font-black text-[#5B4D9D] tracking-tight">{totalPrice}₺</span>
                        </div>
                    </div>
                    <p className="text-sm text-gray-400 font-medium leading-relaxed">
                        Moffi kalitesiyle üretilmiş, evcil dostunuzu kış aylarında sıcacık tutacak premium hoodie.
                    </p>
                </div>

                {/* COLOR SELECTION */}
                <div className="mb-10">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 ml-2">Renk Seçimi</h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 px-2 scrollbar-hide">
                        {product.colors.map(color => (
                            <motion.button
                                key={color.id}
                                onClick={() => setSelectedColor(color)}
                                whileTap={{ scale: 0.9 }}
                                className={cn(
                                    "relative w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center transition-all duration-300",
                                    selectedColor.id === color.id
                                        ? "ring-4 ring-[#5B4D9D]/20 scale-110 shadow-xl"
                                        : "hover:scale-105"
                                )}
                            >
                                <div
                                    className={cn("w-full h-full rounded-2xl shadow-sm border border-black/5 dark:border-white/10", color.shadow)}
                                    style={{ backgroundColor: color.hex }}
                                />
                                {selectedColor.id === color.id && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                            <Check className={cn("w-3.5 h-3.5", color.id === 'white' ? 'text-black' : 'text-white')} />
                                        </div>
                                    </div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* SIZES & PRINT TYPE GRID */}
                <div className="grid grid-cols-1 gap-6 mb-10">
                    {/* Size Selector */}
                    <div>
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Beden</h3>
                            <span className="text-xs font-bold text-[#5B4D9D] cursor-pointer">Rehber 📏</span>
                        </div>
                        <div className="flex gap-2 p-1.5 bg-white dark:bg-[#151515] rounded-[1.5rem] border border-gray-100 dark:border-white/5 shadow-sm overflow-x-auto">
                            {product.sizes.map(size => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={cn(
                                        "flex-1 min-w-[3rem] h-12 rounded-2xl text-sm font-bold transition-all flex items-center justify-center relative overflow-hidden",
                                        selectedSize === size
                                            ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                                            : "text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Print Type Selector */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 ml-2">Baskı Tipi</h3>
                        <div className="flex gap-3">
                            {product.printTypes.map(type => (
                                <div
                                    key={type.id}
                                    onClick={() => setPrintType(type)}
                                    className={cn(
                                        "flex-1 p-4 rounded-[1.5rem] border-2 cursor-pointer transition-all relative overflow-hidden group",
                                        printType.id === type.id
                                            ? "border-[#5B4D9D] bg-purple-50/50 dark:bg-purple-900/10"
                                            : "border-transparent bg-white dark:bg-[#151515]"
                                    )}
                                >
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">{type.name}</h4>
                                    <p className="text-[10px] text-gray-500 font-medium">{type.desc}</p>

                                    {printType.id === type.id && (
                                        <div className="absolute top-3 right-3 w-5 h-5 bg-[#5B4D9D] rounded-full flex items-center justify-center text-white">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* TRUST BADGES */}
                <div className="flex gap-4 overflow-x-auto scrollbar-hide mb-8 pb-2">
                    {[
                        { icon: ShieldCheck, text: "Orijinal Ürün", color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
                        { icon: Truck, text: "Hızlı Kargo", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                        { icon: RotateCcw, text: "İade Garantisi", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
                    ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#151515] rounded-2xl shadow-sm border border-gray-50 dark:border-white/5 flex-shrink-0">
                            <div className={`p-1.5 rounded-lg ${badge.bg}`}>
                                <badge.icon className={`w-4 h-4 ${badge.color}`} />
                            </div>
                            <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{badge.text}</span>
                        </div>
                    ))}
                </div>

            </div>

            {/* 3. DUAL ACTION BAR (Apple Style) */}
            <div className="fixed bottom-0 left-0 right-0 p-6 z-50">
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 pointer-events-none h-[140%]" />

                <div className="relative max-w-md mx-auto flex items-center gap-4">

                    {/* Secondary Action: Add blank to cart */}
                    <motion.button
                        onClick={handleAddToCart}
                        whileTap={{ scale: 0.95 }}
                        className="w-16 h-16 rounded-[1.5rem] bg-white dark:bg-[#222] border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-lg hover:bg-gray-50 dark:hover:bg-[#333] transition-colors relative"
                    >
                        <ShoppingBag className="w-6 h-6 text-gray-900 dark:text-white" />

                        {/* Cart Animation Feedback */}
                        {isCartAnimating && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                className="absolute inset-0 bg-[#5B4D9D] rounded-[1.5rem]"
                            />
                        )}
                        {isCartAnimating && (
                            <motion.div
                                initial={{ y: 0, opacity: 1 }}
                                animate={{ y: -30, opacity: 0 }}
                                className="absolute -top-2 text-[#5B4D9D] font-bold text-sm"
                            >
                                +1
                            </motion.div>
                        )}
                    </motion.button>

                    {/* Primary Action: Design Now */}
                    <motion.button
                        onClick={handleStartDesign}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 h-16 rounded-[1.5rem] bg-black dark:bg-white text-white dark:text-black font-black text-lg shadow-[0_10px_30px_rgba(0,0,0,0.2)] dark:shadow-[0_0_30px_rgba(255,255,255,0.15)] flex items-center justify-center gap-3 overflow-hidden relative group"
                    >
                        {/* Animated Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                        <Wand2 className="w-6 h-6 animate-pulse" />
                        <span>Tasarlamaya Başla</span>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 -translate-x-[100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                    </motion.button>

                </div>
            </div>

            {/* FULL SCREEN LOADER TRANSITION */}
            <AnimatePresence>
                {isAnimating && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-[#5B4D9D] flex flex-col items-center justify-center"
                    >
                        <div className="w-24 h-24 relative mb-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-white/20 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-4 border-t-white border-r-transparent border-b-transparent border-l-transparent rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Palette className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-white mb-2 tracking-tight">Stüdyo Hazırlanıyor</h2>
                        <motion.p
                            initial={{ opacity: 0.5 }}
                            animate={{ opacity: 1 }}
                            transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
                            className="text-white/80 font-medium"
                        >
                            Seçimlerin tuvale aktarılıyor...
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>

        </main>
    );
}
