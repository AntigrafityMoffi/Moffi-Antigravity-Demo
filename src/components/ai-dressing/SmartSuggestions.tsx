"use client";

import { Sparkles, Wand2 } from "lucide-react";

interface SmartSuggestionsProps {
    petName?: string;
}

export function SmartSuggestions({ petName = "Dostun" }: SmartSuggestionsProps) {
    return (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 w-[90%] pointer-events-none">
            <div className="bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-start gap-3 shadow-xl animate-in slide-in-from-top-4 duration-1000">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg animate-pulse">
                    <Wand2 className="w-4 h-4 text-white" />
                </div>
                <div>
                    <div className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-0.5">Moffi AI Önerisi</div>
                    <p className="text-white text-xs leading-relaxed shadow-sm">
                        <span className="font-bold text-yellow-300">{petName}</span>'un tüy rengine göre <span className="font-bold underline decoration-indigo-400 decoration-2 underline-offset-2">Neon Yağmurluk</span> harika bir kontrast yaratabilir! 🎨
                    </p>
                </div>
            </div>
        </div>
    );
}
