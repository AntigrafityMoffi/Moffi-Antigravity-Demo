"use client";

import { useState, useEffect } from "react";
import {
    X, HeartPulse, CheckCircle2, AlertTriangle,
    Smile, Play, Pause, RotateCcw, ChevronRight,
    Search, Award, Sparkles, BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DentalCareModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// --- INTELLIGENT CHECKUP QUESTIONS ---
const QUESTIONS = [
    {
        id: 1,
        question: "Nefesi nasıl kokuyor?",
        options: [
            { label: "Mis gibi / Nötr", score: 0, icon: "🍃" },
            { label: "Biraz ağır", score: 1, icon: "😐" },
            { label: "Dayanılmaz kötü", score: 3, icon: "🤢" }
        ]
    },
    {
        id: 2,
        question: "Dişlerinde renk değişimi var mı?",
        options: [
            { label: "Bembeyaz", score: 0, icon: "✨" },
            { label: "Diplerde hafif sarılık", score: 1, icon: "🟡" },
            { label: "Kahverengi tortular/taşlar", score: 3, icon: "🟤" }
        ]
    },
    {
        id: 3,
        question: "Diş etleri ne durumda?",
        options: [
            { label: "Pembe ve sağlıklı", score: 0, icon: "💗" },
            { label: "Kızarık veya şiş", score: 3, icon: "🔴" },
            { label: "Kanama oluyor", score: 3, icon: "🩸" }
        ]
    }
];

export function DentalCareModal({ isOpen, onClose }: DentalCareModalProps) {
    const [activeTab, setActiveTab] = useState<'checkup' | 'timer' | 'guide'>('checkup');

    // CHECKUP STATE
    const [currentStep, setCurrentStep] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // TIMER STATE
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTimerRunning && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);

    const handleAnswer = (score: number) => {
        setTotalScore(prev => prev + score);
        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            setShowResult(true);
        }
    };

    const resetCheckup = () => {
        setCurrentStep(0);
        setTotalScore(0);
        setShowResult(false);
    };

    const getResultFeedback = () => {
        if (totalScore === 0) return { title: "Mükemmel Gülüş! 🦷✨", desc: "Mochi'nin diş sağlığı harika görünüyor. Rutin bakıma devam!", color: "text-green-500", bg: "bg-green-50", border: "border-green-200" };
        if (totalScore <= 3) return { title: "Dikkatli Olalım 🤔", desc: "Ufak belirtiler var. Fırçalama sıklığını artırmalı ve takip etmelisin.", color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" };
        return { title: "Veteriner Kontrolü Şart 🚨", desc: "Diş taşı veya diş eti hastalığı riski yüksek. Lütfen randevu al.", color: "text-red-500", bg: "bg-red-50", border: "border-red-200" };
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#C4F5E6]/90 dark:bg-[#064e3b]/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="w-full max-w-lg bg-white dark:bg-[#121212] rounded-t-[2.5rem] sm:rounded-[2.5rem] h-[85vh] flex flex-col overflow-hidden shadow-2xl ring-4 ring-emerald-100 dark:ring-emerald-900/20"
            >
                {/* HEADER */}
                <div className="p-6 pb-4 bg-emerald-500 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Smile className="w-48 h-48" />
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                        <div>
                            <h2 className="text-2xl font-black">Dental Care</h2>
                            <p className="text-emerald-100 font-bold text-xs opacity-90">Sağlıklı Dişler, Mutlu Patiler</p>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"><X className="w-5 h-5" /></button>
                    </div>

                    {/* NAVIGATION PILLS */}
                    <div className="flex bg-emerald-600/30 p-1 rounded-xl mt-6 relative z-10 backdrop-blur-sm">
                        <button onClick={() => setActiveTab('checkup')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1", activeTab === 'checkup' ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-50 hover:bg-white/10")}>
                            <Search className="w-3 h-3" /> Kontrol
                        </button>
                        <button onClick={() => setActiveTab('timer')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1", activeTab === 'timer' ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-50 hover:bg-white/10")}>
                            <HeartPulse className="w-3 h-3" /> Fırçala
                        </button>
                        <button onClick={() => setActiveTab('guide')} className={cn("flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1", activeTab === 'guide' ? "bg-white text-emerald-600 shadow-sm" : "text-emerald-50 hover:bg-white/10")}>
                            <BookOpen className="w-3 h-3" /> Rehber
                        </button>
                    </div>
                </div>

                {/* CONTENT AREA */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#F0FDF9] dark:bg-[#022c22]">

                    {/* 1. SMART CHECKUP */}
                    {activeTab === 'checkup' && (
                        <div className="h-full flex flex-col">
                            {!showResult ? (
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex-1 flex flex-col justify-center"
                                >
                                    <div className="text-center mb-8">
                                        <div className="inline-block bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-xs font-black mb-4">
                                            SORU {currentStep + 1} / {QUESTIONS.length}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                                            {QUESTIONS[currentStep].question}
                                        </h3>
                                    </div>

                                    <div className="space-y-3">
                                        {QUESTIONS[currentStep].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleAnswer(opt.score)}
                                                className="w-full bg-white dark:bg-white/5 p-4 rounded-2xl border-2 border-transparent hover:border-emerald-400 group transition-all shadow-sm flex items-center gap-4 text-left"
                                            >
                                                <span className="text-3xl group-hover:scale-125 transition-transform">{opt.icon}</span>
                                                <span className="font-bold text-gray-700 dark:text-gray-200">{opt.label}</span>
                                                <ChevronRight className="ml-auto w-5 h-5 text-gray-300 group-hover:text-emerald-500" />
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center pt-8">
                                    <div className={cn("w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 animate-bounce", getResultFeedback().bg)}>
                                        {totalScore === 0 ? <Sparkles className={cn("w-12 h-12", getResultFeedback().color)} /> : <AlertTriangle className={cn("w-12 h-12", getResultFeedback().color)} />}
                                    </div>
                                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{getResultFeedback().title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-[80%] mx-auto">{getResultFeedback().desc}</p>

                                    <div className="flex flex-col gap-3">
                                        {totalScore > 3 && (
                                            <button className="w-full py-4 rounded-xl bg-red-500 text-white font-bold shadow-lg shadow-red-500/30 hover:bg-red-600 transition-colors">
                                                Veteriner Randevusu Al
                                            </button>
                                        )}
                                        <button onClick={resetCheckup} className="w-full py-4 rounded-xl bg-white dark:bg-white/5 border border-gray-200 text-gray-500 font-bold hover:bg-gray-50">
                                            Tekrar Kontrol Et
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* 2. BRUSH TIMER */}
                    {activeTab === 'timer' && (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="relative mb-8">
                                {/* Progress Ring */}
                                <svg className="w-64 h-64 transform -rotate-90">
                                    <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-100 dark:text-emerald-900/20" />
                                    <circle
                                        cx="128" cy="128" r="120"
                                        stroke="currentColor" strokeWidth="8" fill="transparent"
                                        strokeDasharray={2 * Math.PI * 120}
                                        strokeDashoffset={2 * Math.PI * 120 * (1 - timeLeft / 120)}
                                        className="text-emerald-500 transition-all duration-1000 ease-linear"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <div className="text-6xl font-black text-gray-900 dark:text-white font-mono tracking-tighter">
                                        {formatTime(timeLeft)}
                                    </div>
                                    <div className="text-emerald-500 font-bold text-sm mt-2 animate-pulse">
                                        {isTimerRunning ? "Fırçalamaya Devam! 🦷" : "Süre Doldu!"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                                    className={cn(
                                        "w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all hover:scale-105 active:scale-95",
                                        isTimerRunning ? "bg-amber-400 text-white" : "bg-emerald-500 text-white"
                                    )}
                                >
                                    {isTimerRunning ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                                </button>
                                <button
                                    onClick={() => { setIsTimerRunning(false); setTimeLeft(120); }}
                                    className="w-14 h-14 rounded-full bg-gray-200 dark:bg-white/10 text-gray-500 flex items-center justify-center hover:bg-gray-300 transition-colors"
                                >
                                    <RotateCcw className="w-6 h-6" />
                                </button>
                            </div>

                            <p className="mt-8 text-xs text-gray-400 font-medium">Hergün 2 dakika fırçalamak plak oluşumunu %80 azaltır.</p>
                        </div>
                    )}

                    {/* 3. GUIDE */}
                    {activeTab === 'guide' && (
                        <div className="space-y-4">
                            <div className="bg-white dark:bg-white/5 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 shadow-sm relative overflow-hidden">
                                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100 rounded-full opacity-50" />
                                <h3 className="font-bold text-lg mb-2 z-10 relative">Fırçalama Tekniği 101</h3>
                                <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-300 relative z-10">
                                    <li className="flex gap-3"><span className="bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span> Dudakları nazikçe yukarı kaldırın.</li>
                                    <li className="flex gap-3"><span className="bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span> Fırçayı 45 derece açıyla tutun.</li>
                                    <li className="flex gap-3"><span className="bg-emerald-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span> Dairesel hareketlerle dış yüzeyleri fırçalayın.</li>
                                </ol>
                            </div>

                            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/20 flex gap-4 items-center">
                                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shrink-0">
                                    <AlertTriangle className="w-6 h-6" />
                                </div>
                                <div className="text-sm">
                                    <span className="font-bold text-amber-800 dark:text-amber-400 block mb-1">ASLA İnsan Macunu Kullanma!</span>
                                    <span className="text-amber-700/70 dark:text-amber-300/70 text-xs">Florür köpekler için zehirlidir. Sadece evcil hayvan macunu kullan.</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/20 flex gap-4 items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                    <Award className="w-6 h-6" />
                                </div>
                                <div className="text-sm">
                                    <span className="font-bold text-blue-800 dark:text-blue-400 block mb-1">Moffi Öneriyor</span>
                                    <span className="text-blue-700/70 dark:text-blue-300/70 text-xs">Enzimli diş macunları temizliği kolaylaştırır.</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </motion.div>
        </motion.div>
    );
}
