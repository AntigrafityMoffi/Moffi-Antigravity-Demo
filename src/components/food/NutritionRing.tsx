"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Utensils, Flame } from "lucide-react";

interface NutritionRingProps {
    calories: number;
    target: number;
    burned: number;
}

export function NutritionRing({ calories, target, burned }: NutritionRingProps) {
    // Calculate percentages
    const percentage = Math.min((calories / target) * 100, 100);
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-72 h-72 flex items-center justify-center">
            {/* SVG RING */}
            <svg className="w-full h-full transform -rotate-90 drop-shadow-2xl">
                {/* Background Track */}
                <circle
                    cx="144" cy="144" r={radius}
                    stroke="currentColor" strokeWidth="20" fill="transparent"
                    className="text-gray-100 dark:text-white/5"
                />

                {/* Progress Arc */}
                <motion.circle
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    cx="144" cy="144" r={radius}
                    stroke="url(#gradient)" strokeWidth="20" fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" /> {/* Green */}
                        <stop offset="100%" stopColor="#10b981" /> {/* Emerald */}
                    </linearGradient>
                </defs>
            </svg>

            {/* CENTER CONTENT */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-2 animate-bounce-slow">
                    <Flame className="w-8 h-8 text-green-600 dark:text-green-400 fill-current" />
                </div>
                <div className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {calories}
                </div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    / {target} Kcal
                </div>

                {/* Burned Info */}
                <div className="mt-2 flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 dark:bg-orange-900/10 px-3 py-1 rounded-full">
                    <Utensils className="w-3 h-3" /> {target - calories} Kcal Kaldı
                </div>
            </div>

            {/* Decorative Glow */}
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full -z-10 scale-90 opacity-50" />
        </div>
    );
}
