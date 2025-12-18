"use client";

import { useState } from "react";
import {
    X, Utensils, Coffee, Moon, Cookie,
    ChevronRight, Scale, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MealLoggerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAddMeal: (calories: number, type: string) => void;
}

const MEAL_TYPES = [
    { id: 'breakfast', label: 'Sabah', icon: Coffee, kcalPer100g: 360, color: 'bg-orange-500' },
    { id: 'dinner', label: 'Akşam', icon: Moon, kcalPer100g: 380, color: 'bg-indigo-500' },
    { id: 'snack', label: 'Ödül', icon: Cookie, kcalPer100g: 450, color: 'bg-pink-500' },
];

export function MealLoggerModal({ isOpen, onClose, onAddMeal }: MealLoggerModalProps) {
    const [selectedType, setSelectedType] = useState(MEAL_TYPES[0]);
    const [amount, setAmount] = useState(150); // grams

    const calculatedCalories = Math.round((amount / 100) * selectedType.kcalPer100g);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="w-full max-w-md bg-white dark:bg-[#121212] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden"
            >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">Öğün Ekle</h2>
                        <p className="text-xs text-gray-500 font-bold">Mochi ne yedi?</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200"><X className="w-5 h-5" /></button>
                </div>

                {/* MEAL TYPE SELECTOR */}
                <div className="flex gap-3 mb-8">
                    {MEAL_TYPES.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type)}
                            className={cn(
                                "flex-1 p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all",
                                selectedType.id === type.id
                                    ? `border-${type.color.split('-')[1]}-500 bg-gray-50 dark:bg-white/5`
                                    : "border-transparent bg-gray-50 dark:bg-white/5 opacity-60 hover:opacity-100"
                            )}
                        >
                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg", type.color)}>
                                <type.icon className="w-5 h-5" />
                            </div>
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{type.label}</span>
                        </button>
                    ))}
                </div>

                {/* SLIDER & AMOUNT */}
                <div className="bg-[#F8F9FC] dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 mb-6">
                    <div className="flex justify-between items-end mb-4">
                        <div className="flex items-center gap-2 text-gray-500">
                            <Scale className="w-5 h-5" /> <span className="text-sm font-bold">Miktar</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900 dark:text-white">
                            {amount}<span className="text-lg text-gray-400 font-medium">gr</span>
                        </div>
                    </div>

                    <input
                        type="range"
                        min="50" max="500" step="10"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />

                    <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase">
                        <span>Min (50g)</span>
                        <span>Max (500g)</span>
                    </div>
                </div>

                {/* SMART SUGGESTION */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20 mb-6">
                    <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="text-xs text-blue-800 dark:text-blue-300">
                        <span className="font-bold block mb-1">Moffi Önerisi</span>
                        Mochi (25kg) için öğün başına ideal miktar 180-200gr arasındadır. Şu anki seçim uygun görünüyor. 👍
                    </div>
                </div>

                {/* SUBMIT */}
                <button
                    onClick={() => {
                        onAddMeal(calculatedCalories, selectedType.label);
                        onClose();
                    }}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                    Ekle (+{calculatedCalories} Kcal) <ChevronRight className="w-5 h-5" />
                </button>

            </motion.div>
        </motion.div>
    );
}
