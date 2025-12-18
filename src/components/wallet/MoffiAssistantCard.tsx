"use client";

import { AlertTriangle, ChevronRight, Gift, Sparkles, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function MoffiAssistantCard() {
    return (
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl border border-white/10">

            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="relative z-10">
                {/* Header with Avatar */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-indigo-500 border-4 border-white/20 shadow-lg relative overflow-hidden flex-shrink-0">
                        {/* MOFFI AVATAR */}
                        <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200" className="w-full h-full object-cover transform scale-110" alt="Moffi" />
                        <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-400 rounded-full border-2 border-indigo-900 flex items-center justify-center text-[10px]">🤖</div>
                    </div>
                    <div>
                        <h3 className="font-black text-lg">Moffi Asistan</h3>
                        <p className="text-xs text-indigo-200 font-medium">Finansal Danışmanınız</p>
                    </div>
                </div>

                {/* Insight Message */}
                <div className="mb-6">
                    <p className="text-lg font-medium leading-relaxed mb-2">
                        <span className="font-black text-white">Dikkat!</span> Bu ay mama bütçenizi <span className="text-red-400 font-bold">%5 aştınız</span> ve stoklarınız azalıyor.
                    </p>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-start gap-3 border border-white/10">
                        <Gift className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-xs text-indigo-100 mb-1">
                                Sizin için <strong>Pro Plan</strong> indirimi buldum. Hemen sipariş verirseniz:
                            </p>
                            <p className="text-xl font-black text-white">₺150 Tasarruf <span className="text-xs font-normal opacity-70">edeceksiniz.</span></p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button className="flex-1 bg-white text-indigo-900 py-3 rounded-xl font-black text-xs flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                        Fırsatı İncele
                    </button>
                    <button className="px-4 py-3 bg-white/5 text-white rounded-xl font-bold text-xs hover:bg-white/10 transition-colors">
                        Kapat
                    </button>
                </div>
            </div>
        </div>
    );
}
