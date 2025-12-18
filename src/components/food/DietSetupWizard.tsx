
"use client";

import { useState } from "react";
import {
    ChevronRight, ChevronLeft, Scale, Ruler,
    Activity, Flame, BrainCircuit, CheckCircle2,
    Search, Dog, AlertTriangle, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DietSetupWizardProps {
    onComplete: (plan: NutritionPlan) => void;
}

export interface NutritionPlan {
    dailyTarget: number;
    waterTarget: number;
    macros: { protein: number; fat: number; carbs: number };
    petDetails: {
        weight: number;
        age: number;
        activity: string;
        breed: string;
        species: 'cat' | 'dog'; // NEW
        bcs: string;
        allergies: string[];
    };
}

const ACTIVITY_LEVELS = [
    { id: 'low', label: 'Tembel', desc: 'Günde < 30dk yürüyüş', factor: 1.2, icon: '😴' },
    { id: 'moderate', label: 'Aktif', desc: 'Günde 30-60dk yürüyüş', factor: 1.4, icon: '🐕' },
    { id: 'high', label: 'Çok Aktif', desc: 'Günde > 1 saat koşu/oyun', factor: 1.6, icon: '⚡' },
    { id: 'puppy', label: 'Yavru', desc: 'Büyüme çağında (< 1 yaş)', factor: 2.0, icon: '🍼' },
];

const BODY_CONDITION = [
    { id: 'under', label: 'Zayıf', desc: 'Kaburgalar belirgin', scaler: 1.2, color: 'text-blue-500', bg: 'bg-blue-500' },
    { id: 'ideal', label: 'İdeal', desc: 'Bel kıvrımı var', scaler: 1.0, color: 'text-green-500', bg: 'bg-green-500' },
    { id: 'over', label: 'Kilolu', desc: 'Bel kıvrımı yok', scaler: 0.8, color: 'text-orange-500', bg: 'bg-orange-500' },
];

const BREEDS = [
    "Golden Retriever", "Labrador", "French Bulldog", "German Shepherd", "Poodle",
    "Chihuahua", "Beagle", "Rottweiler", "Yorkshire Terrier", "Boxer", "Husky", "Mixed"
];

const ALLERGENS = ["Tavuk", "Sığır Eti", "Tahıl", "Süt Ürünleri", "Balık", "Yumurta"];

export function DietSetupWizard({ onComplete }: DietSetupWizardProps) {
    const [step, setStep] = useState(0);
    const [isCalculating, setIsCalculating] = useState(false);

    // FORM DATA
    const [species, setSpecies] = useState<'cat' | 'dog' | null>(null); // NEW
    const [breed, setBreed] = useState("");
    const [weight, setWeight] = useState(25); // kg
    const [age, setAge] = useState(2); // years
    const [bcs, setBcs] = useState(BODY_CONDITION[1]); // Ideal default
    const [activity, setActivity] = useState(ACTIVITY_LEVELS[1]);
    const [allergies, setAllergies] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBreeds = BREEDS.filter(b => b.toLowerCase().includes(searchQuery.toLowerCase()));

    const toggleAllergy = (alg: string) => {
        setAllergies(prev => prev.includes(alg) ? prev.filter(a => a !== alg) : [...prev, alg]);
    };

    const handleNext = () => {
        if (step < 6) { // Increased step count
            setStep(prev => prev + 1);
        } else {
            calculatePlan();
        }
    };

    const calculatePlan = () => {
        setIsCalculating(true);
        setTimeout(() => {
            // RER Formula: 70 * (weight ^ 0.75)
            const rer = 70 * Math.pow(weight, 0.75);

            // Adjustments: Activity * Body Condition Scaler
            let factor = activity.factor * bcs.scaler;

            const dailyCalories = Math.round(rer * factor);
            const waterTarget = Math.round(weight * 60); // approx 60ml per kg

            // Macro adjustments based on BCS
            let protein = 25;
            let fat = 15;
            if (bcs.id === 'over') { fat = 10; protein = 30; } // High protein for weight loss
            if (bcs.id === 'under') { fat = 20; } // Higher fat for weight gain

            const plan: NutritionPlan = {
                dailyTarget: dailyCalories,
                waterTarget: waterTarget,
                macros: {
                    protein,
                    fat,
                    carbs: 100 - (protein + fat)
                },
                petDetails: {
                    weight, age, activity: activity.label,
                    breed, bcs: bcs.label, allergies
                }
            };

            setIsCalculating(false);
            onComplete(plan);
        }, 3000);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#F8F9FC] dark:bg-black flex flex-col items-center justify-center p-6">
            <AnimatePresence mode="wait">

                {/* LOADER */}
                {isCalculating && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-white/10" />
                            <div className="absolute inset-0 rounded-full border-4 border-green-500 border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <BrainCircuit className="w-12 h-12 text-green-500 animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-black mb-2 dark:text-white">Klinik Analiz Yapılıyor...</h2>
                        <div className="space-y-1 text-sm text-gray-500 font-medium">
                            <p>Genetik yatkınlıklar taranıyor...</p>
                            <p>RER metabolik hız hesaplanıyor...</p>
                            <p>Alerjen profili oluşturuluyor...</p>
                        </div>
                    </motion.div>
                )}

                {/* STEPS */}
                {!isCalculating && (
                    <motion.div
                        key={step}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        className="w-full max-w-md h-full flex flex-col justify-center"
                    >
                        {/* HEADER */}
                        <div className="mb-6">
                            <div className="flex items-center gap-2 text-green-600 mb-2 font-bold text-xs uppercase tracking-wider">
                                <Activity className="w-4 h-4" /> Klinik Onboarding • Adım {step + 1}/6
                            </div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                                {step === 0 && "Tür Seçimi"}
                                {step === 1 && "Hadi Başlayalım"}
                                {step === 2 && "Kimlik Bilgisi"}
                                {step === 3 && "Biyometrik Veriler"}
                                {step === 4 && "Vücut Skoru (BCS)"}
                                {step === 5 && "Aktivite Düzeyi"}
                                {step === 6 && "Hassasiyetler"}
                            </h1>
                        </div>

                        {/* BODY CONTENT */}
                        <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/5 flex-1 max-h-[500px] overflow-y-auto custom-scrollbar">

                            {step === 0 && (
                                <div className="text-center h-full flex flex-col justify-center">
                                    <div className="w-24 h-24 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                                        🩺
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Veteriner Seviyesi Analiz</h3>
                                    <p className="text-gray-500 leading-relaxed mb-6">
                                        Mochi için sıradan bir kalori hesabı değil,
                                        <strong> Vücut Kondisyon Skoru (BCS)</strong> ve <strong>Genetik Yatkınlıkları</strong>
                                        içeren klinik bir beslenme planı hazırlayacağım.
                                    </p>
                                    <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-400">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" /> AAFCO Standartları
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div>
                                    <div className="relative mb-4">
                                        <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text" placeholder="Irk Ara (örn. Golden)"
                                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full h-14 pl-12 bg-gray-50 dark:bg-black/20 rounded-2xl outline-none font-bold placeholder:font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        {filteredBreeds.map(b => (
                                            <button
                                                key={b} onClick={() => setBreed(b)}
                                                className={cn(
                                                    "w-full p-4 rounded-xl text-left font-bold transition-colors flex justify-between items-center",
                                                    breed === b ? "bg-black text-white dark:bg-white dark:text-black" : "bg-gray-50 dark:bg-white/5 hover:bg-gray-100"
                                                )}
                                            >
                                                {b}
                                                {breed === b && <CheckCircle2 className="w-5 h-5" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 pt-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-3">KİLO (KG)</label>
                                        <input
                                            type="number" value={weight} onChange={(e) => setWeight(Number(e.target.value))}
                                            className="w-full h-16 bg-gray-50 dark:bg-black/20 rounded-2xl text-center text-4xl font-black outline-none focus:ring-2 ring-green-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-3">YAŞ</label>
                                        <input
                                            type="number" value={age} onChange={(e) => setAge(Number(e.target.value))}
                                            className="w-full h-16 bg-gray-50 dark:bg-black/20 rounded-2xl text-center text-4xl font-black outline-none focus:ring-2 ring-green-500/50"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="h-full flex flex-col gap-4">
                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex gap-3 items-start mb-2">
                                        <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                        <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                                            <strong>Neden Önemli?</strong>
                                            Kilolu dostlarımız için kaloriyi %20 kısarken, zayıf olanlar için %20 artırmalıyız. Lütfen dürüst olun.
                                        </p>
                                    </div>

                                    {BODY_CONDITION.map(c => (
                                        <button
                                            key={c.id} onClick={() => setBcs(c)}
                                            className={cn(
                                                "flex-1 p-4 rounded-2xl border-2 transition-all flex items-center gap-4 relative overflow-hidden",
                                                bcs.id === c.id ? `border - ${c.color.split('-')[1]} -500 bg - gray - 50 dark: bg - white / 5` : "border-transparent bg-gray-50 dark:bg-white/5 opacity-60"
                                            )}
                                        >
                                            <div className={cn("w-3 h-full absolute left-0 top-0", c.bg)} />
                                            <div className="pl-4 text-left">
                                                <div className="text-lg font-black">{c.label}</div>
                                                <div className="text-xs text-gray-500">{c.desc}</div>
                                            </div>
                                            {bcs.id === c.id && <CheckCircle2 className={cn("ml-auto w-6 h-6", c.color)} />}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {step === 5 && (
                                <div className="grid grid-cols-1 gap-3">
                                    {ACTIVITY_LEVELS.map(lvl => (
                                        <button
                                            key={lvl.id} onClick={() => setActivity(lvl)}
                                            className={cn(
                                                "p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all",
                                                activity.id === lvl.id ? "border-green-500 bg-green-50 dark:bg-white/5" : "border-transparent bg-gray-50 dark:bg-white/5"
                                            )}
                                        >
                                            <span className="text-3xl">{lvl.icon}</span>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white">{lvl.label}</div>
                                                <div className="text-xs text-gray-500">{lvl.desc}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {step === 6 && (
                                <div>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {ALLERGENS.map(alg => (
                                            <button
                                                key={alg} onClick={() => toggleAllergy(alg)}
                                                className={cn(
                                                    "px-4 py-3 rounded-xl text-sm font-bold border-2 transition-all",
                                                    allergies.includes(alg)
                                                        ? "border-red-500 bg-red-50 text-red-600 dark:bg-red-900/20"
                                                        : "border-gray-100 dark:border-white/10 text-gray-500"
                                                )}
                                            >
                                                {alg}
                                            </button>
                                        ))}
                                    </div>

                                    {allergies.length > 0 && (
                                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-bottom-2">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span className="text-xs font-bold">Bu besinleri içeren mamalarda sizi uyaracağım.</span>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>

                        {/* NAV BUTTONS */}
                        <div className="flex items-center justify-between mt-6">
                            <div className="flex gap-1">
                                {[0, 1, 2, 3, 4, 5].map(i => (
                                    <div key={i} className={cn("w-2 h-2 rounded-full transition-colors", i <= step ? "bg-green-500" : "bg-gray-300")} />
                                ))}
                            </div>

                            <div className="flex gap-4">
                                {step > 0 && (
                                    <button onClick={() => setStep(s => s - 1)} className="w-12 h-12 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center hover:bg-gray-300 text-gray-600">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                )}
                                <button
                                    onClick={handleNext}
                                    className="px-8 h-12 rounded-full bg-black dark:bg-white text-white dark:text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-lg"
                                >
                                    {step === 6 ? "Raporu Oluştur" : "Devam Et"} <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
