"use client";

import { motion } from "framer-motion";

interface MacroChartProps {
    macros: { protein: number; fat: number; carbs: number };
}

export function MacroChart({ macros }: MacroChartProps) {
    // Determine bar widths based on percentages
    // Total width 100%

    return (
        <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-white/5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-green-500 rounded-full" /> Makro Analizi
            </h3>

            {/* BAR CHART */}
            <div className="h-4 w-full bg-gray-100 dark:bg-white/10 rounded-full flex overflow-hidden mb-4">
                <motion.div
                    initial={{ width: 0 }} animate={{ width: `${macros.protein}%` }}
                    className="h-full bg-blue-500"
                />
                <motion.div
                    initial={{ width: 0 }} animate={{ width: `${macros.fat}%` }}
                    className="h-full bg-yellow-500"
                    transition={{ delay: 0.2 }}
                />
                <motion.div
                    initial={{ width: 0 }} animate={{ width: `${macros.carbs}%` }}
                    className="h-full bg-green-500"
                    transition={{ delay: 0.4 }}
                />
            </div>

            {/* LEGEND */}
            <div className="flex justify-between">
                <div className="text-center">
                    <div className="text-xs text-gray-400 font-bold mb-1">Protein</div>
                    <div className="text-xl font-black text-blue-500">{macros.protein}%</div>
                </div>
                <div className="w-px h-8 bg-gray-100 dark:bg-white/10" />
                <div className="text-center">
                    <div className="text-xs text-gray-400 font-bold mb-1">Yağ</div>
                    <div className="text-xl font-black text-yellow-500">{macros.fat}%</div>
                </div>
                <div className="w-px h-8 bg-gray-100 dark:bg-white/10" />
                <div className="text-center">
                    <div className="text-xs text-gray-400 font-bold mb-1">Karbonhidrat</div>
                    <div className="text-xl font-black text-green-500">{macros.carbs}%</div>
                </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 dark:bg-black/20 rounded-xl text-[10px] text-gray-500 leading-relaxed font-medium">
                Mochi'nin aktivite seviyesine (Aktif) göre **Yüksek Protein** diyeti kas gelişimi için önemlidir.
            </div>
        </div>
    );
}
