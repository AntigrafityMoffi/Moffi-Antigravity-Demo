"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Edit3, Share2, Save, CloudRain, Sun, ChevronRight, ChevronLeft } from "lucide-react";
import { useMemory } from "@/hooks/useMemory";
import { DailyMemory } from "@/types/domain";
import { cn } from "@/lib/utils";

interface DailySummaryCardProps {
    className?: string;
}

export function DailySummaryCard({ className }: DailySummaryCardProps) {
    const { generateTodayMemory, saveMemory, shareMemory, isGenerating } = useMemory();
    const [memory, setMemory] = useState<DailyMemory | null>(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [isConfirmingShare, setIsConfirmingShare] = useState(false);
    const [isShared, setIsShared] = useState(false);
    const [editedStories, setEditedStories] = useState<Record<string, string>>({});

    // Simulate "Mount" -> Check time -> Generate if needed
    useEffect(() => {
        // Auto-generate for demo purposes on mount
        if (!memory) {
            handleGenerate();
        }
    }, []);

    const handleGenerate = async () => {
        // useMemory now generates a rich random context for demo
        const result = await generateTodayMemory();
        setMemory(result);
        // Initialize edits
        const edits: Record<string, string> = {};
        result.moments.forEach(m => edits[m.id] = m.story);
        setEditedStories(edits);
    };

    const handleSave = async () => {
        if (!memory) return;
        // Update moments with edited text
        const updatedMoments = memory.moments.map(m => ({
            ...m,
            story: editedStories[m.id] || m.story
        }));
        await saveMemory({ ...memory, moments: updatedMoments });
        setIsEditing(false);
    };

    const handleShareClick = () => {
        setIsConfirmingShare(true);
    };

    const confirmShare = async () => {
        if (!memory) return;
        await shareMemory(memory);
        setIsConfirmingShare(false);
        setIsShared(true);
        setTimeout(() => setIsShared(false), 3000); // Reset success state
    };

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (memory && currentSlide < memory.moments.length - 1) {
            setCurrentSlide(curr => curr + 1);
        }
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (currentSlide > 0) {
            setCurrentSlide(curr => curr - 1);
        }
    };

    if (!memory && isGenerating) {
        return (
            <div className={cn("w-full h-64 rounded-[2rem] bg-white dark:bg-[#1A1A1A] flex flex-col items-center justify-center p-6 shadow-xl border border-gray-100 dark:border-white/5", className)}>
                <Sparkles className="w-8 h-8 text-[#5B4D9D] animate-spin-slow mb-4" />
                <p className="text-gray-500 text-sm font-medium animate-pulse">Moffi bugünü düşünüyor...</p>
            </div>
        );
    }

    if (!memory) return null; // Should not happen after auto-generate

    const activeMoment = memory.moments[currentSlide];

    return (
        <div className={cn("w-full bg-white dark:bg-[#1A1A1A] rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 overflow-hidden relative group", className)}>

            {/* HERO / CAROUSEL AREA */}
            <div className="h-56 bg-gray-100 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={activeMoment.id}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        src={activeMoment.mediaUrl}
                        className="w-full h-full object-cover absolute inset-0"
                    />
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                {/* Weather Badge (Always Visible) */}
                <div className="absolute top-4 left-4">
                    <span className="text-xs font-bold bg-black/40 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-white border border-white/10">
                        {memory.weather.condition === 'rainy' ? <CloudRain className="w-3 h-3" /> : <Sun className="w-3 h-3 text-yellow-300" />}
                        {memory.date}
                    </span>
                </div>

                {/* SHARE CONFIRMATION OVERLAY */}
                <AnimatePresence>
                    {isConfirmingShare && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <h4 className="text-white font-bold text-lg mb-2">Toplulukta Paylaş?</h4>
                            <p className="text-gray-300 text-xs mb-6">Bu anıyı MoffiPet topluluğundaki diğer evcil hayvan sahipleriyle paylaşmak istiyor musun?</p>
                            <div className="flex gap-3 w-full">
                                <button onClick={() => setIsConfirmingShare(false)} className="flex-1 bg-white/10 text-white py-3 rounded-xl text-xs font-bold hover:bg-white/20 transition-colors">Vazgeç</button>
                                <button onClick={confirmShare} className="flex-1 bg-[#5B4D9D] text-white py-3 rounded-xl text-xs font-bold hover:bg-[#483d7d] transition-colors">Evet, Paylaş</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* SUCCESS TOAST OVERLAY */}
                <AnimatePresence>
                    {isShared && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg z-50"
                        >
                            <Share2 className="w-3 h-3" />
                            <span className="text-xs font-bold">Paylaşıldı!</span>
                        </motion.div>
                    )}
                </AnimatePresence>


                {/* Navigation Controls */}
                {memory.moments.length > 1 && !isConfirmingShare && (
                    <>
                        <button onClick={prevSlide} disabled={currentSlide === 0} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur flex items-center justify-center text-white disabled:opacity-0 transition-all z-20">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextSlide} disabled={currentSlide === memory.moments.length - 1} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur flex items-center justify-center text-white disabled:opacity-0 transition-all z-20">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                {/* Progress Indicators */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {memory.moments.map((_, idx) => (
                        <div key={idx} className={cn("h-1 rounded-full transition-all duration-300",
                            idx === currentSlide ? "w-6 bg-white" : "w-1.5 bg-white/40"
                        )} />
                    ))}
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-6 right-6 text-white transform transition-transform duration-500">
                    <motion.h3
                        key={activeMoment.id + "title"}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="text-xl font-black mb-1 leading-tight"
                    >
                        {activeMoment.title}
                    </motion.h3>
                </div>

                {/* Actions (Edit & Share) */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={handleShareClick} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-colors border border-white/10">
                        <Share2 className="w-3 h-3" />
                    </button>
                    <button onClick={() => setIsEditing(!isEditing)} className="w-8 h-8 rounded-full bg-black/40 backdrop-blur flex items-center justify-center text-white hover:bg-black/60 transition-colors border border-white/10">
                        <Edit3 className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* CONTENT BODY */}
            <div className="p-6 pt-4">
                <div className="relative min-h-[80px]">
                    <div className="absolute -left-2 -top-2 text-4xl text-gray-200 dark:text-gray-700 font-serif">"</div>
                    {isEditing ? (
                        <textarea
                            value={editedStories[activeMoment.id]}
                            onChange={(e) => setEditedStories({ ...editedStories, [activeMoment.id]: e.target.value })}
                            className="w-full bg-gray-50 dark:bg-white/5 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-200 outline-none focus:ring-2 ring-[#5B4D9D] min-h-[100px]"
                        />
                    ) : (
                        <motion.p
                            key={activeMoment.id + "story"}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-sm font-medium text-gray-600 dark:text-gray-300 leading-relaxed italic pl-4"
                        >
                            {editedStories[activeMoment.id] || activeMoment.story}
                        </motion.p>
                    )}
                </div>

                {isEditing && (
                    <div className="mt-4 flex justify-end">
                        <button onClick={handleSave} className="bg-[#5B4D9D] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-[#483d7d] transition-colors">
                            <Save className="w-3 h-3" /> Değişiklikleri Kaydet
                        </button>
                    </div>
                )}
            </div>

            {/* Stats Footer (Optional context) */}
            <div className="px-6 pb-6 pt-0 border-t border-gray-50 dark:border-white/5 mt-4 flex gap-4 text-[10px] text-gray-400 font-bold uppercase tracking-wider justify-center pt-4">
                {memory.walkDistance > 0 && <span>📍 {memory.walkDistance.toFixed(1)}km Yürüyüş</span>}
                <span>•</span>
                <span>✨ {memory.mood.toUpperCase()} MOOD</span>
            </div>
        </div>
    );
}
