"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Share2, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductMockService, Product, ProductColor, ProductSize } from "@/services/mock/ProductMockService";
import { ConfiguratorPanel } from "@/components/studio/configurator/ConfiguratorPanel";
import { cn } from "@/lib/utils";

// Mock params hook wrapper since we are in client component
export default function ProductConfigPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    // Selection State
    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(null);
    const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true);
            try {
                const data = await ProductMockService.getProductById(params.id);
                if (data) {
                    setProduct(data);
                    // Set defaults
                    setSelectedColor(data.colors[0]);
                    setSelectedSize(data.sizes[0]);
                }
            } catch (error) {
                console.error("Failed to load product", error);
            } finally {
                setLoading(false);
            }
        };
        loadProduct();
    }, [params.id]);

    const handleStartDesigning = () => {
        if (!product || !selectedColor || !selectedSize) return;

        // Navigate to studio with pre-configuration
        const query = new URLSearchParams({
            productId: product.id,
            colorId: selectedColor.id,
            sizeId: selectedSize.id
        }).toString();

        router.push(`/studio/design?${query}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    if (!product || !selectedColor || !selectedSize) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center flex-col text-white">
                <h2 className="text-xl font-bold mb-2">Ürün Bulunamadı</h2>
                <button onClick={() => router.back()} className="text-neutral-400 hover:text-white">Geri Dön</button>
            </div>
        );
    }

    const images = Object.values(product.images).filter(Boolean) as string[];

    return (
        <div className="min-h-screen w-full bg-[#09090b] text-white flex flex-col font-sans">

            {/* Header / Nav */}
            <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 sticky top-0 bg-[#09090b]/80 backdrop-blur-md z-50">
                <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="text-sm font-medium opacity-50">Ürün Yapılandırma</div>
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Heart className="w-5 h-5" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden h-[calc(100vh-64px)]">

                {/* LEFT: Product Preview Gallery */}
                <div className="w-full md:w-2/3 bg-[#0c0c0e] relative flex items-center justify-center p-8 md:p-12 overflow-hidden">
                    {/* Background Ambience */}
                    <div
                        className="absolute inset-0 opacity-20 blur-3xl transition-colors duration-700"
                        style={{ background: `radial-gradient(circle at center, ${selectedColor.hex}40, transparent 70%)` }}
                    />

                    {/* Image Carousel */}
                    <div className="relative w-full max-w-[600px] aspect-square z-10">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentImageIndex + selectedColor.id} // Change key on color change to trigger animation
                                src={images[currentImageIndex]}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.4 }}
                                className="w-full h-full object-contain drop-shadow-2xl"
                                alt={product.name}
                            />
                        </AnimatePresence>

                        {/* Carousel Controls */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={cn(
                                            "w-2 h-2 rounded-full transition-all",
                                            currentImageIndex === idx ? "bg-white w-6" : "bg-white/30 hover:bg-white/50"
                                        )}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quality Badge Floating */}
                    {product.brand.isMoffi && (
                        <div className="absolute top-8 left-8 bg-black/50 backdrop-blur border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-white flex items-center gap-2">
                            ✨ Premium Cotton
                        </div>
                    )}
                </div>

                {/* RIGHT: Configurator Panel */}
                <div className="w-full md:w-1/3 border-l border-white/10 bg-[#09090b] p-6 md:p-10 overflow-y-auto">
                    <ConfiguratorPanel
                        product={product}
                        selectedColor={selectedColor}
                        onColorSelect={setSelectedColor}
                        selectedSize={selectedSize}
                        onSizeSelect={setSelectedSize}
                        onStartDesigning={handleStartDesigning}
                    />
                </div>
            </div>
        </div>
    );
}
