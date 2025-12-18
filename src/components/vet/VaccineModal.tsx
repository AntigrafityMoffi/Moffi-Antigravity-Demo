"use client";

import { useState } from "react";
import {
    X, Syringe, CheckCircle2, AlertCircle,
    Calendar, ChevronRight, Info, ShieldCheck,
    Thermometer, Clock, HelpCircle, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useVaccineSchedule, RichVaccineRecord } from "@/hooks/useVaccineSchedule";
import { useRouter } from "next/navigation"; // To potentially redirect to appointment flow

interface VaccineModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VaccineModal({ isOpen, onClose }: VaccineModalProps) {
    const router = useRouter();
    const { schedule, ruleset, isLoading } = useVaccineSchedule();
    const [activeTab, setActiveTab] = useState<'calendar' | 'guide'>('calendar');
    const [selectedRichRecord, setSelectedRichRecord] = useState<RichVaccineRecord | null>(null);

    // If viewing guide directly, we select a definition essentially. 
    // But for simplicity in this UI, let's reuse the RichRecord logic or just show definitions tab logic derived from ruleset.
    const [selectedDefId, setSelectedDefId] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleBookAppointment = (record: RichVaccineRecord) => {
        // [INTEGRATION] This is where we link to the Appointment Flow
        // We pass the context as requested
        const appointmentContext = {
            reason: 'vaccine',
            vaccineKey: record.vaccineId,
            vaccineName: record.definition.name,
            dueDate: record.dueDate,
            countryCode: ruleset?.countryCode
        };
        console.log("Navigating to Appointment with Context:", appointmentContext);
        // Force close for now, in real app we'd open the Appointment Modal with pre-filled data
        onClose();
        // Trigger generic Appointment Modal somewhere? 
        // For MVP instruction: just ensuring context is ready.
        // We might trigger an event or use a global store here.
    };

    // Helper to find definition for Info Sheet
    const getDefinition = (id: string) => ruleset?.definitions.find(d => d.id === id);
    const activeDefinition = selectedDefId ? getDefinition(selectedDefId) : (selectedRichRecord ? selectedRichRecord.definition : null);

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
                className="w-full max-w-lg bg-white dark:bg-[#121212] rounded-t-[2.5rem] sm:rounded-[2.5rem] h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
                {/* HEAD */}
                <div className="p-6 pb-2 border-b border-gray-100 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-xl z-10 sticky top-0">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                <Syringe className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 dark:text-white">Aşı Takvimi</h2>
                                <p className="text-xs text-gray-500 font-bold">
                                    {ruleset ? `Kurallar: ${ruleset.countryCode} (v${ruleset.version})` : 'Yükleniyor...'}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-gray-200 transition-colors"><X className="w-5 h-5" /></button>
                    </div>

                    {/* TABS */}
                    <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl mb-2">
                        <button
                            onClick={() => setActiveTab('calendar')}
                            className={cn("flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", activeTab === 'calendar' ? "bg-white dark:bg-[#1A1A1A] shadow-sm text-blue-600" : "text-gray-500")}
                        >
                            <Calendar className="w-4 h-4" /> Takvimim
                        </button>
                        <button
                            onClick={() => setActiveTab('guide')}
                            className={cn("flex-1 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2", activeTab === 'guide' ? "bg-white dark:bg-[#1A1A1A] shadow-sm text-purple-600" : "text-gray-500")}
                        >
                            <Info className="w-4 h-4" /> Aşı Rehberi
                        </button>
                    </div>
                </div>

                {/* BODY */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FC] dark:bg-[#09090b]">

                    {isLoading && (
                        <div className="flex items-center justify-center h-48">
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
                        </div>
                    )}

                    {!isLoading && ruleset && activeTab === 'calendar' && (
                        <div className="relative pl-6 border-l-2 border-gray-200 dark:border-white/10 space-y-8">
                            {schedule.map((item) => {
                                const isCompleted = item.status === 'completed';
                                const daysLeft = Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                                const isOverdue = !isCompleted && daysLeft < 0;

                                return (
                                    <div key={item.id} className="relative">
                                        {/* Timeline Dot */}
                                        <div className={cn(
                                            "absolute -left-[31px] w-4 h-4 rounded-full border-2",
                                            isCompleted ? "bg-green-500 border-green-200" :
                                                isOverdue ? "bg-red-500 border-red-200" : "bg-orange-500 border-orange-200 animate-pulse"
                                        )} />

                                        <div
                                            onClick={() => { setSelectedRichRecord(item); setSelectedDefId(null); }}
                                            className={cn(
                                                "bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl shadow-sm border cursor-pointer hover:scale-[1.02] transition-transform",
                                                isCompleted ? "border-green-100 dark:border-green-900/20" :
                                                    isOverdue ? "border-red-100 dark:border-red-900/20 ring-2 ring-red-500/10" : "border-orange-100 dark:border-orange-900/20 ring-2 ring-orange-500/10"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{item.definition.name}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        {isCompleted ? `Yapıldı: ${item.dateAdministered}` : `Planlanan: ${item.dueDate}`}
                                                    </p>
                                                </div>
                                                {isCompleted ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : isOverdue ? (
                                                    <div className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded-md">
                                                        GECİKTİ ({Math.abs(daysLeft)} GÜN)
                                                    </div>
                                                ) : (
                                                    <div className="bg-orange-100 text-orange-600 text-[10px] font-black px-2 py-1 rounded-md">
                                                        {daysLeft} GÜN KALDI
                                                    </div>
                                                )}
                                            </div>

                                            {!isCompleted && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleBookAppointment(item); }}
                                                    className="w-full mt-2 bg-[#5B4D9D] text-white text-xs font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-[#483d7d]"
                                                >
                                                    Randevu Oluştur <ChevronRight className="w-3 h-3" />
                                                </button>
                                            )}

                                            {isCompleted && item.vetName && (
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-2 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded inline-block">
                                                    <ShieldCheck className="w-3 h-3" /> {item.vetName} Onaylı
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* TAB: GUIDE (KNOWLEDGE BASE) */}
                    {!isLoading && ruleset && activeTab === 'guide' && (
                        <div className="grid grid-cols-1 gap-4">
                            {ruleset.definitions.map(def => (
                                <div
                                    key={def.id}
                                    onClick={() => { setSelectedDefId(def.id); setSelectedRichRecord(null); }}
                                    className="bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", def.isCore ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500')}>
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{def.name}</h3>
                                        <p className="text-xs text-gray-500 line-clamp-2">{def.description}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-300" />
                                </div>
                            ))}

                            <div className="mt-4 p-4 text-center text-xs text-gray-400">
                                <FileText className="w-4 h-4 mx-auto mb-1 opacity-50" />
                                <p>Kaynak: {ruleset.source}</p>
                                <p>Son Güncelleme: {ruleset.lastUpdated}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* INFO DETAILS SHEET */}
                <AnimatePresence>
                    {activeDefinition && (
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            className="absolute inset-0 z-20 bg-white dark:bg-[#121212] overflow-y-auto"
                        >
                            {/* Details Header */}
                            <div className="sticky top-0 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md p-4 border-b border-gray-100 dark:border-white/5 flex items-center gap-2">
                                <button onClick={() => { setSelectedRichRecord(null); setSelectedDefId(null); }} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                                <h3 className="font-bold flex-1 text-center pr-8">Aşı Detayı</h3>
                            </div>

                            <div className="p-6 pb-20">
                                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                                    <Syringe className="w-8 h-8" />
                                </div>
                                <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{activeDefinition.name}</h1>

                                {activeDefinition.isCore && (
                                    <span className="inline-block bg-red-100 text-red-600 text-[10px] font-black px-2 py-1 rounded mb-6 uppercase tracking-wider">
                                        Zorunlu (Core) Aşı
                                    </span>
                                )}

                                <div className="space-y-6">
                                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-xl">
                                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> Açıklama</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{activeDefinition.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-orange-50 dark:bg-orange-900/10 p-3 rounded-xl">
                                            <div className="text-xs font-bold text-orange-600 mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Sıklık</div>
                                            <div className="text-sm font-black text-gray-900 dark:text-white">{activeDefinition.frequencyMonths} Ayda Bir</div>
                                        </div>
                                        <div className="bg-green-50 dark:bg-green-900/10 p-3 rounded-xl">
                                            <div className="text-xs font-bold text-green-600 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Min. Yaş</div>
                                            <div className="text-sm font-black text-gray-900 dark:text-white">{activeDefinition.minAgeWeeks} Hafta</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /> Kategori</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {activeDefinition.tags.map(p => (
                                                <span key={p} className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-xs font-bold uppercase">{p}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </motion.div>
        </motion.div>
    );
}
