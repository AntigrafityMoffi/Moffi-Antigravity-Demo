"use client";

import { motion } from "framer-motion";
import { ScanBarcode, Award, AlertCircle, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function FoodGradeCard() {
    const food = {
        name: "ProPlan Somonlu",
        brand: "Purina",
        grade: "A", // A, B, C, D
        score: 92,
        features: ["Tahılsız", "Yüksek Protein", "Omega 3"]
    };

    return (
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-[2rem] p-6 shadow-xl text-white relative overflow-hidden group cursor-pointer hover:shadow-2xl hover:shadow-green-500/30 transition-all">

            {/* DECORATIVE */}
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
            <div className="absolute -left-4 -bottom-4 w-24 h-24 bg-black/10 rounded-full blur-xl" />

            <div className="relative z-10 flex justify-between items-start mb-8">
                <div>
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold mb-2 w-fit">
                        <ScanBarcode className="w-3 h-3" /> ANALİZ EDİLDİ
                    </div>
                    <h3 className="font-black text-2xl leading-none mb-1">{food.name}</h3>
                    <p className="text-green-100 text-sm">{food.brand}</p>
                </div>

                {/* GRADE BADGE */}
                <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg text-green-600">
                    <span className="text-3xl font-black leading-none">{food.grade}</span>
                    <div className="flex gap-0.5 mt-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className="w-2 h-2 fill-current" />
                        ))}
                    </div>
                </div>
            </div>

            {/* FEATURES */}
            <div className="relative z-10 grid grid-cols-2 gap-2 mb-4">
                {food.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5 text-xs font-bold text-green-50">
                        <Award className="w-3 h-3 text-yellow-300" /> {f}
                    </div>
                ))}
            </div>

            <div className="relative z-10 flex items-center justify-between border-t border-white/20 pt-4 mt-2 group-hover:pl-2 transition-all">
                <span className="text-xs font-medium text-green-100">Detaylı Raporu Gör</span>
                <ChevronRight className="w-4 h-4" />
            </div>

        </div>
    );
}
