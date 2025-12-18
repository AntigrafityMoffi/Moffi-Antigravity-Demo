"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Plus, Clock, Footprints, Utensils,
    Activity, Heart, Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFamily } from "@/hooks/useFamily";
import { FamilyLog } from "@/types/domain";

// Helper to map string icon types to components
const getIcon = (type: FamilyLog['iconType']) => {
    switch (type) {
        case 'Footprints': return Footprints;
        case 'Utensils': return Utensils;
        case 'Activity': return Activity;
        case 'Heart': return Heart;
        default: return Activity;
    }
};

export function FamilyTab() {
    // Architectural Change: All logic is now in the hook
    const { members, logs, notification, isLoading } = useFamily();

    if (isLoading) return <div className="p-10 text-center text-gray-400">Yükleniyor...</div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="space-y-6 relative"
        >
            {/* IN-APP NOTIFICATION TOAST */}
            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: -20, x: "-50%" }}
                        className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/10"
                    >
                        <Bell className="w-4 h-4 text-yellow-400 fill-current animate-wiggle" />
                        <span className="text-xs font-bold">{notification}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MEMBERS GRID */}
            <div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#5B4D9D]" /> Moffi Ailesi
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {members.map((member) => (
                        <motion.div
                            layout
                            key={member.id}
                            className="bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl border border-gray-100 dark:border-white/5 relative overflow-hidden group shadow-sm transition-all"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="relative">
                                    <img src={member.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-[#1A1A1A] shadow-sm" />
                                    <div className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-[#1A1A1A] transition-colors duration-500",
                                        member.status === 'online' ? "bg-green-500" : (member.status === 'busy' ? "bg-orange-500 animate-pulse" : "bg-gray-400")
                                    )} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{member.name}</h4>
                                    <span className="text-[10px] text-gray-500 font-medium">{member.role}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {member.status === 'busy' && <Activity className="w-3 h-3 text-orange-500 animate-pulse" />}
                                <p className={cn("text-[10px] font-bold py-1 px-2 rounded-lg inline-block transition-colors duration-300",
                                    member.status === 'busy' ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500 dark:bg-white/5"
                                )}>
                                    {member.statusText}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Invite Card */}
                    <div className="bg-dashed border-2 border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 cursor-pointer hover:border-[#5B4D9D] hover:bg-[#5B4D9D]/5 transition-colors gap-2 text-gray-400 hover:text-[#5B4D9D] min-h-[100px]">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                            <Plus className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-bold">Üye Davet Et</span>
                    </div>
                </div>
            </div>

            {/* ACTIVITY LOG */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-[2rem] p-5 shadow-sm border border-gray-100 dark:border-white/5">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" /> Bugün Neler Oldu?
                </h3>
                <div className="space-y-0 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-gray-100 dark:bg-white/5" />

                    <AnimatePresence initial={false}>
                        {logs.map((log) => {
                            const Icon = getIcon(log.iconType);
                            return (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className="flex gap-4 relative z-10 pb-6 last:pb-0"
                                >
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-4 border-white dark:border-[#1A1A1A] shadow-sm z-20 bg-white", log.color)}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="pt-1">
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-black text-sm text-gray-900 dark:text-white">{log.user}</span>
                                            <span className="text-xs text-gray-500">{log.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-0.5">{log.action}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
