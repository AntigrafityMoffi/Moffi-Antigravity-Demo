"use client";

import { Quest } from "@/types/game";
import { Calendar, Users, Award, MoreVertical, Trophy, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface QuestCardProps {
    quest: Quest;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function QuestCard({ quest, onEdit, onDelete }: QuestCardProps) {
    const isExpired = new Date(quest.endDate) < new Date();
    const isActive = quest.status === 'active' && !isExpired;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            {/* Status Badge */}
            <div className={cn(
                "absolute top-5 right-5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                isActive ? "bg-green-50 text-green-600" :
                    quest.status === 'draft' ? "bg-gray-100 text-gray-500" : "bg-red-50 text-red-500"
            )}>
                {isActive ? 'Aktif' : quest.status === 'draft' ? 'Taslak' : 'Sona Erdi'}
            </div>

            {/* Icon/Image Area */}
            <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg",
                quest.type === 'visit' ? "bg-indigo-500" :
                    quest.type === 'purchase' ? "bg-pink-500" : "bg-orange-500"
            )}>
                <Trophy className="w-6 h-6" />
            </div>

            {/* Content */}
            <h3 className="text-lg font-black text-gray-900 mb-1 leading-tight">{quest.title}</h3>
            <p className="text-sm text-gray-500 font-medium mb-4 line-clamp-2">{quest.description}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase">Katılımcı</span>
                    </div>
                    <div className="text-lg font-black text-gray-900">{quest.participants}</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                    <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                        <Award className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase">Tamamlayan</span>
                    </div>
                    <div className="text-lg font-black text-gray-900">{quest.completions}</div>
                </div>
            </div>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-gray-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">{new Date(quest.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onEdit?.(quest.id)}
                        className="p-2 hover:bg-gray-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 text-gray-400 hover:text-gray-900 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
