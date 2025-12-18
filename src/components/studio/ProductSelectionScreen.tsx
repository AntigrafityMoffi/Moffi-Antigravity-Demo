"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShoppingBag, Store, ChevronRight, Search, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- MOCK DATA ---
const MOFFI_PRODUCTS = [
    {
        id: 'moffi-hoodie-black',
        name: 'Moffi Basic Hoodie',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop',
        price: '850₺',
        isBestSeller: true
    },
    {
        id: 'moffi-tshirt-white',
        name: 'Classic White Tee',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&auto=format&fit=crop',
        price: '450₺',
        isBestSeller: false
    },
    {
        id: 'moffi-bandana-red',
        name: 'Pattern Bandana',
        image: 'https://images.unsplash.com/photo-1626248679727-2e1cb160c914?q=80&w=600&auto=format&fit=crop',
        price: '150₺',
        isBestSeller: true
    },
    {
        id: 'moffi-bed-cozy',
        name: 'Cozy Dreamer Bed',
        image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=600&auto=format&fit=crop',
        price: '1250₺',
        isBestSeller: false
    }
];

const BUSINESS_PRODUCTS = [
    {
        id: 'dogo-cafe-mug',
        business: 'Dogo Cafe',
        name: 'Custom Mug',
        image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=600&auto=format&fit=crop',
        price: '250₺'
    },
    {
        id: 'happy-paws-leash',
        business: 'Happy Paws Shop',
        name: 'Leather Leash',
        image: 'https://images.unsplash.com/photo-1588820478052-a5676774a382?q=80&w=600&auto=format&fit=crop',
        price: '650₺'
    },
    {
        id: 'vet-plus-tag',
        business: 'Vet Plus',
        name: 'Medical ID Tag',
        image: 'https://images.unsplash.com/photo-1529154448550-ba57ce79f57d?q=80&w=600&auto=format&fit=crop',
        price: '200₺'
    }
];

export function ProductSelectionScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'moffi' | 'business'>('moffi');

    const handleSelectProduct = (image: string) => {
        // Redirect to Studio with the selected image
        router.push(`/studio?image=${encodeURIComponent(image)}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black p-4 pb-24 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* HERO SECTION */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasarım Stüdyosu 🎨</h1>
                    <p className="text-gray-500 dark:text-gray-400">Hayalindeki ürünü tasarlamak için önce bir tuval seç.</p>
                </div>

                {/* TABS */}
                <div className="flex p-1 bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 overflow-hidden">
                    <button
                        onClick={() => setActiveTab('moffi')}
                        className={cn(
                            "flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all",
                            activeTab === 'moffi'
                                ? "bg-blue-500 text-white shadow-md"
                                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                        )}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Moffi Orijinalleri
                    </button>
                    <button
                        onClick={() => setActiveTab('business')}
                        className={cn(
                            "flex-1 py-3 flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition-all",
                            activeTab === 'business'
                                ? "bg-purple-500 text-white shadow-md"
                                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5"
                        )}
                    >
                        <Store className="w-4 h-4" />
                        İşletme Ürünleri
                    </button>
                </div>

                {/* SEARCH (Optical) */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder={activeTab === 'moffi' ? "Moffi ürünlerinde ara..." : "İşletme ürünlerinde ara..."}
                        className="w-full h-12 pl-12 pr-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:border-blue-500 dark:text-white transition-colors"
                    />
                </div>

                {/* GRID */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {activeTab === 'moffi' ? (
                        MOFFI_PRODUCTS.map(product => (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={product.id}
                                onClick={() => handleSelectProduct(product.image)}
                                className="group relative bg-white dark:bg-[#1A1A1A] rounded-2xl p-3 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col gap-3"
                            >
                                {product.isBestSeller && (
                                    <div className="absolute top-3 left-3 z-10 bg-amber-400 text-black text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star className="w-3 h-3 fill-black" /> POPÜLER
                                    </div>
                                )}
                                <div className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 relative">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{product.name}</h3>
                                    <p className="text-blue-600 dark:text-blue-400 text-xs font-bold mt-1">{product.price}</p>
                                </div>
                            </motion.button>
                        ))
                    ) : (
                        BUSINESS_PRODUCTS.map(product => (
                            <motion.button
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={product.id}
                                onClick={() => handleSelectProduct(product.image)}
                                className="group bg-white dark:bg-[#1A1A1A] rounded-2xl p-3 border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col gap-3"
                            >
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{product.business}</div>
                                <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{product.name}</h3>
                                    <div className="flex justify-between items-center mt-1">
                                        <p className="text-purple-600 dark:text-purple-400 text-xs font-bold">{product.price}</p>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-purple-500 transition-colors" />
                                    </div>
                                </div>
                            </motion.button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
