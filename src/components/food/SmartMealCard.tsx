"use client";

import { motion } from "framer-motion";
import { Check, ThumbsUp, ThumbsDown, X, MessageCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export interface SmartMealProps {
    id: string;
    type: "Sabah" | "Öğle" | "Akşam" | "Ödül";
    status: "pending" | "done" | "skipped";
    suggestion: {
        foodName: string;
        amount: number; // grams
        calories: number;
        reason?: string; // "High activity bonus"
    };
    onComplete: (id: string, feedback?: 'like' | 'dislike') => void;
    onSkip: (id: string) => void;
}

export function SmartMealCard({ id, type, status, suggestion, onComplete, onSkip }: SmartMealProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [feedback, setFeedback] = useState<'like' | 'dislike' | null>(null);

    const isDone = status === 'done';
    const isSkipped = status === 'skipped';

    const handleAction = (action: 'complete' | 'skip') => {
        if (action === 'complete') {
            setIsExpanded(true); // Show feedback options
            onComplete(id);
        } else {
            onSkip(id);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isSkipped ? 0.5 : 1, y: 0 }}
            className={cn(
                "relative overflow-hidden rounded-[2rem] p-1 border-2 transition-all",
                isDone ? "bg-green-50 border-green-500 shadow-none" : "bg-white dark:bg-[#1A1A1A] border-transparent shadow-lg"
            )}
        >
            {/* CARD CONTENT */}
            <div className="p-5 flex items-start gap-4">

                {/* ICON / TIME */}
                <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm shrink-0",
                    type === 'Sabah' ? 'bg-orange-100 text-orange-500' :
                        type === 'Akşam' ? 'bg-indigo-100 text-indigo-500' : 'bg-pink-100 text-pink-500'
                )}>
                    {type === 'Sabah' ? '☀️' : type === 'Akşam' ? '🌙' : '🦴'}
                </div>

                {/* INFO */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className={cn("font-black text-lg", isDone ? "text-green-800" : "text-gray-900 dark:text-white")}>
                                {type} Menüsü
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">
                                {isDone ? "Tamamlandı" : suggestion.foodName}
                            </p>
                        </div>

                        {/* CALORIE TAG */}
                        <div className="text-right">
                            <div className="font-bold text-gray-900 dark:text-white">{suggestion.amount}g</div>
                            <div className="text-xs text-gray-400 font-bold">{suggestion.calories} kcal</div>
                        </div>
                    </div>

                    {/* CONTEXT REASON (Visible if pending) */}
                    {!isDone && suggestion.reason && (
                        <div className="mt-3 bg-blue-50 dark:bg-blue-900/10 p-2 rounded-xl flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400">
                            <Info className="w-3 h-3" /> {suggestion.reason}
                        </div>
                    )}

                    {/* FEEDBACK (Visible if done) */}
                    {isDone && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex gap-2">
                            <button
                                onClick={() => setFeedback('like')}
                                className={cn("px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors", feedback === 'like' ? "bg-green-600 text-white" : "bg-green-200 text-green-700")}
                            >
                                <ThumbsUp className="w-3 h-3" /> Sevdi
                            </button>
                            <button
                                onClick={() => setFeedback('dislike')}
                                className={cn("px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors", feedback === 'dislike' ? "bg-red-500 text-white" : "bg-red-100 text-red-700")}
                            >
                                <ThumbsDown className="w-3 h-3" /> Sevmedi
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* ACTIONS FOOTER (Only if Pending) */}
            {!isDone && !isSkipped && (
                <div className="grid grid-cols-4 gap-1 p-1 mt-2">
                    <button
                        onClick={() => handleAction('skip')}
                        className="col-span-1 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 font-bold text-xs"
                    >
                        Pas Geç
                    </button>
                    <button
                        onClick={() => handleAction('complete')}
                        className="col-span-3 py-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black font-bold text-sm flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
                    >
                        <Check className="w-4 h-4" /> Mochi Yedi
                    </button>
                </div>
            )}

            {/* DONE OVERLAY ANIMATION */}
            {isDone && (
                <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white shadow-sm">
                        <Check className="w-3 h-3" />
                    </div>
                </div>
            )}
        </motion.div>
    );
}
