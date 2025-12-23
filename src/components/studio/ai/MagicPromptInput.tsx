"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, AlertTriangle, CheckCircle2, Sparkles, X } from "lucide-react";
import { PromptLogic, PromptAnalysisResult } from "@/services/ai/PromptLogic";
import { cn } from "@/lib/utils";

interface MagicPromptInputProps {
    onPromptGenerated: (finalPrompt: string) => void;
    isGenerating?: boolean;
}

const STYLES = [
    { id: 'realistic', label: 'Gerçekçi (Realistic)', color: 'bg-blue-500' },
    { id: 'anime', label: 'Anime / Manga', color: 'bg-pink-500' },
    { id: 'cyberpunk', label: 'Cyberpunk', color: 'bg-purple-500' },
    { id: 'watercolor', label: 'Sulu Boya', color: 'bg-orange-400' },
    { id: 'pixel', label: 'Pixel Art', color: 'bg-green-500' },
    { id: '3d', label: '3D Render', color: 'bg-indigo-500' },
];

export function MagicPromptInput({ onPromptGenerated, isGenerating = false }: MagicPromptInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<PromptAnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Handle real-time analysis with debounce
    useEffect(() => {
        if (inputValue.length < 3) {
            setAnalysis(null);
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        setIsAnalyzing(true);

        debounceTimer.current = setTimeout(async () => {
            const result = await PromptLogic.analyzePrompt(inputValue, selectedStyle || undefined);
            setAnalysis(result);
            setIsAnalyzing(false);
        }, 800); // 800ms delay for "thinking" feel

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [inputValue, selectedStyle]);

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            {/* --- STYLE SELECTOR --- */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {STYLES.map(style => (
                    <button
                        key={style.id}
                        onClick={() => setSelectedStyle(selectedStyle === style.id ? null : style.id)}
                        className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
                            selectedStyle === style.id
                                ? `${style.color} text-white border-transparent shadow-[0_0_10px_rgba(255,255,255,0.3)]`
                                : "bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10"
                        )}
                    >
                        {style.label}
                        {selectedStyle === style.id && <CheckCircle2 className="w-3 h-3" />}
                    </button>
                ))}
            </div>

            {/* --- MAIN INPUT AREA --- */}
            <div className={cn(
                "relative group rounded-3xl p-1 transition-all duration-300",
                analysis?.safetyStatus === 'unsafe'
                    ? "bg-red-500/10 ring-2 ring-red-500/50"
                    : isAnalyzing
                        ? "bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 ring-1 ring-white/10"
                        : "bg-white/5 ring-1 ring-white/10 hover:ring-purple-500/30"
            )}>
                <div className="relative bg-[#0c0c0e] rounded-[22px] overflow-hidden">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Hayalindeki tasarımı anlat... (örn: Uzayda kaykay yapan kedi)"
                        className="w-full h-32 bg-transparent text-white p-4 resize-none focus:outline-none placeholder:text-neutral-600 text-lg leading-relaxed"
                    />

                    {/* Footer Actions */}
                    <div className="px-4 py-3 bg-[#08080a] border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {/* Language Indicator */}
                            {analysis?.detectedLanguage && (
                                <span className="text-[10px] uppercase font-bold text-neutral-500 bg-white/5 px-2 py-1 rounded">
                                    {analysis.detectedLanguage}
                                </span>
                            )}

                            {/* Analysis Status */}
                            {isAnalyzing ? (
                                <div className="flex items-center gap-2 text-xs text-purple-400 animate-pulse">
                                    <Sparkles className="w-3 h-3" />
                                    <span>Moffi Düşünüyor...</span>
                                </div>
                            ) : analysis?.safetyStatus === 'unsafe' ? (
                                <div className="flex items-center gap-2 text-xs text-red-400">
                                    <AlertTriangle className="w-3 h-3" />
                                    <span>Uygunsuz İçerik</span>
                                </div>
                            ) : analysis ? (
                                <div className="flex items-center gap-2 text-xs text-green-400">
                                    <CheckCircle2 className="w-3 h-3" />
                                    <span>Zenginleştirildi</span>
                                </div>
                            ) : null}
                        </div>

                        <button
                            disabled={!inputValue || isAnalyzing || analysis?.safetyStatus === 'unsafe' || isGenerating}
                            onClick={() => analysis && onPromptGenerated(analysis.enrichedText)}
                            className={cn(
                                "flex items-center gap-2 px-6 py-2 rounded-xl font-bold transition-all",
                                !inputValue || isAnalyzing || analysis?.safetyStatus === 'unsafe' || isGenerating
                                    ? "bg-white/5 text-neutral-500 cursor-not-allowed"
                                    : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                            )}
                        >
                            {isGenerating ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Üretiliyor...</span>
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4" />
                                    Sihirli Üretim
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- FEEDBACK & TAGS --- */}
            <AnimatePresence>
                {/* 1. KEYWORDS (Tags) */}
                {analysis?.keywords && analysis.keywords.length > 0 && analysis.safetyStatus !== 'unsafe' && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-wrap gap-2"
                    >
                        {analysis.keywords.map((word, i) => (
                            <span key={i} className="text-xs px-3 py-1 bg-white/5 rounded-full text-purple-200 border border-purple-500/20">
                                #{word}
                            </span>
                        ))}
                    </motion.div>
                )}

                {/* 2. ERROR / WARNINGS */}
                {analysis?.warnings && analysis.warnings.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                    >
                        <ul className="list-disc list-inside text-sm text-red-200 space-y-1">
                            {analysis.warnings.map((warn, i) => (
                                <li key={i}>{warn}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
