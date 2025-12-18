"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Droplets, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function WaterTracker() {
    const [glasses, setGlasses] = useState(3);
    const target = 8;

    const handleDrink = (increment: boolean) => {
        if (increment && glasses < target) setGlasses(p => p + 1);
        if (!increment && glasses > 0) setGlasses(p => p - 1);
    };

    const percentage = (glasses / target) * 100;

    return (
        <div className="relative overflow-hidden bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] p-6 shadow-xl border border-blue-100 dark:border-blue-900/20 h-80 flex flex-col justify-between group">

            {/* BACKGROUND WAVE ANIMATION */}
            <div className="absolute inset-0 flex items-end opacity-20 pointer-events-none">
                <motion.div
                    animate={{ height: `${percentage}%` }}
                    transition={{ type: 'spring', stiffness: 50 }}
                    className="w-full bg-blue-500 relative"
                >
                    <div className="absolute -top-4 left-0 right-0 h-4 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Wavy_line.svg/1200px-Wavy_line.svg.png')] bg-repeat-x opacity-50 animate-wave" />
                </motion.div>
            </div>

            {/* HEADER */}
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <h3 className="font-black text-xl text-gray-900 dark:text-white flex items-center gap-2">
                        <Droplets className="w-6 h-6 text-blue-500 fill-current" /> Su Takibi
                    </h3>
                    <p className="text-xs text-gray-500 font-bold mt-1">Hidrasyon Seviyesi</p>
                </div>
                <div className="bg-blue-100 text-blue-600 font-black text-xl w-12 h-12 rounded-2xl flex items-center justify-center">
                    {glasses}
                </div>
            </div>

            {/* CENTER VISUAL */}
            <div className="relative z-10 flex-1 flex items-center justify-center my-4">
                <div className="text-center">
                    <div className="text-6xl mb-2 transition-transform group-hover:scale-110">💧</div>
                    <div className="text-sm font-bold text-gray-400">
                        Hedef: {target} Bardak
                    </div>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="relative z-10 flex gap-3">
                <button
                    onClick={() => handleDrink(false)}
                    className="flex-1 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 text-gray-600 rounded-xl h-12 flex items-center justify-center transition-colors"
                >
                    <Minus className="w-6 h-6" />
                </button>
                <button
                    onClick={() => handleDrink(true)}
                    className="flex-[2] bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl h-12 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" /> Su İçti
                </button>
            </div>
        </div>
    );
}
