"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, Navigation, Pill, Clock } from "lucide-react";
import { useState, useEffect } from "react";

// --- MOCK DATA STRUCTURE (Ready for API) ---
interface Pharmacy {
    id: string;
    name: string;
    address: string;
    phone: string;
    distance: string;
    distanceVal: number; // for sorting
    lat: number;
    lng: number;
    isOpen: boolean;
}

const MOCK_PHARMACIES: Pharmacy[] = [
    {
        id: '1',
        name: "Moffi Merkez Eczanesi",
        address: "Bağdat Cad. No: 123, Kadıköy/İstanbul",
        phone: "+90 216 123 45 67",
        distance: "0.4 km",
        distanceVal: 0.4,
        lat: 40.96,
        lng: 29.07,
        isOpen: true
    },
    {
        id: '2',
        name: "Şifa Nöbetçi Eczane",
        address: "Bahariye Cad. No: 45, Kadıköy/İstanbul",
        phone: "+90 216 987 65 43",
        distance: "1.2 km",
        distanceVal: 1.2,
        lat: 40.98,
        lng: 29.02,
        isOpen: true
    },
    {
        id: '3',
        name: "Pati Dostu Eczane",
        address: "Fenerbahçe Mah. Lale Zar Sk., Kadıköy",
        phone: "+90 216 555 11 22",
        distance: "2.5 km",
        distanceVal: 2.5,
        lat: 40.97,
        lng: 29.04,
        isOpen: true
    }
];

interface PharmacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PharmacyModal({ isOpen, onClose }: PharmacyModalProps) {
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);

    // Simulate API Fetch
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setTimeout(() => {
                setPharmacies(MOCK_PHARMACIES.sort((a, b) => a.distanceVal - b.distanceVal));
                setLoading(false);
            }, 800); // Fake delay for realism
        }
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        className="w-full max-w-md bg-[#F8F9FC] dark:bg-[#121212] rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden h-[90vh] sm:h-[800px] shadow-2xl flex flex-col relative"
                    >
                        {/* HEADER */}
                        <div className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shrink-0 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/10 opacity-30 pattern-dots" /> {/* Placeholder for texture */}

                            <div className="flex justify-between items-start relative z-10 mb-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                                            <Pill className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="px-3 py-1 rounded-full bg-red-500/80 backdrop-blur-md text-xs font-bold border border-white/20 animate-pulse">
                                            ŞU AN NÖBETÇİ
                                        </div>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tight">Nöbetçi<br />Eczaneler</h2>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors -mt-2 -mr-2"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="text-white/80 text-sm font-medium relative z-10">
                                Konumuna en yakın açık eczaneler listeleniyor.
                            </p>
                        </div>

                        {/* LIST CONTENT */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {loading ? (
                                // SKELETON LOADING
                                [1, 2, 3].map(i => (
                                    <div key={i} className="bg-white dark:bg-white/5 p-4 rounded-3xl animate-pulse">
                                        <div className="h-6 w-2/3 bg-gray-200 dark:bg-white/10 rounded-full mb-3" />
                                        <div className="h-4 w-1/2 bg-gray-100 dark:bg-white/5 rounded-full mb-4" />
                                        <div className="flex gap-2">
                                            <div className="h-10 flex-1 bg-gray-100 dark:bg-white/5 rounded-xl" />
                                            <div className="h-10 w-10 bg-gray-100 dark:bg-white/5 rounded-xl" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                pharmacies.map((pharmacy, index) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        key={pharmacy.id}
                                        className="bg-white dark:bg-[#1A1A1A] p-4 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-white/5 group"
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                                    {pharmacy.name}
                                                </h3>
                                                <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-gray-500">
                                                    <MapPin className="w-3.5 h-3.5 text-purple-500" />
                                                    {pharmacy.distance} • {pharmacy.address}
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 flex items-center justify-center shrink-0">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                        </div>

                                        <div className="flex gap-2.5">
                                            <button className="flex-1 h-11 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                                <Navigation className="w-4 h-4" /> Yol Tarifi
                                            </button>
                                            <button className="w-11 h-11 border-2 border-green-500/20 bg-green-500/10 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors">
                                                <Phone className="w-5 h-5 fill-current" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}

                            {!loading && (
                                <div className="text-center mt-6 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-bold mb-1">
                                        Entegrasyon Bilgisi
                                    </p>
                                    <p className="text-[10px] text-blue-500/80">
                                        Bu veriler demo amaçlıdır. Canlıya geçildiğinde "EczanemNerede" API servisinden anlık veri çekilecektir.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
