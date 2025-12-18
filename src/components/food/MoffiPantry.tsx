"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronRight, Package, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function MoffiPantry() {
    // STATE
    const [totalSize, setTotalSize] = useState(15); // kg
    const [currentLevel, setCurrentLevel] = useState(3.2); // kg left (Low stock demo)

    // Derived
    const percentage = (currentLevel / totalSize) * 100;
    const daysLeft = Math.round(currentLevel / 0.250); // assuming 250g/day
    const isLow = percentage < 25;

    return (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-white/5 relative overflow-hidden group">

            {/* BACKGROUND TEXTURE */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
                <Package className="w-32 h-32" />
            </div>

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                        <span className="w-2 h-6 bg-amber-500 rounded-full" /> Kiler
                    </h3>
                    <p className="text-xs text-gray-500 font-medium ml-4">Stok Durumu</p>
                </div>
                {isLow && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-500 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" /> AZ KALDI
                    </div>
                )}
            </div>

            {/* VISUAL BAG */}
            <div className="flex items-end gap-6 relative z-10">
                {/* BAG ILLUSTRATION */}
                <div className="relative w-24 h-32 bg-gray-100 dark:bg-white/5 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shrink-0">
                    <div className="absolute inset-x-0 bottom-0 bg-amber-500/20 h-full">
                        <motion.div
                            initial={{ height: "100%" }}
                            animate={{ height: `${100 - percentage}%` }}
                            className="bg-white/80 dark:bg-[#1A1A1A]/80 w-full absolute top-0 backdrop-blur-sm transition-all duration-1000"
                        />
                    </div>
                    {/* Measurement Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between p-2 pointer-events-none opacity-30">
                        <div className="w-full h-px bg-gray-400" />
                        <div className="w-full h-px bg-gray-400" />
                        <div className="w-full h-px bg-gray-400" />
                    </div>
                    <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-black text-amber-600 dark:text-amber-400">
                        {Math.round(percentage)}%
                    </div>
                </div>

                {/* STATS */}
                <div className="flex-1">
                    <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">
                        {daysLeft} <span className="text-lg font-medium text-gray-400">Gün</span>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                        Mochi'nin maması tahminen <strong>{daysLeft} gün</strong> içinde bitecek.
                    </p>

                    <button className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                        <ShoppingBag className="w-4 h-4" /> Sipariş Ver
                    </button>
                </div>
            </div>
        </div>
    );
}
