"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePet } from "@/context/PetContext";
import { Plus, ChevronDown, Check, Camera, Settings2, Sparkles, Dog, Cat, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PetSwitcherProps {
    mode?: 'full' | 'compact' | 'badge';
}

export function PetSwitcher({ mode = 'full' }: PetSwitcherProps) {
    const { pets, activePet, switchPet, addPet } = usePet();
    const [isOpen, setIsOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Form State
    const [step, setStep] = useState(1);
    const [species, setSpecies] = useState<'dog' | 'cat' | null>(null);
    const [newName, setNewName] = useState("");
    const [newBreed, setNewBreed] = useState("");
    const [gender, setGender] = useState<'male' | 'female'>('male');
    const [themeColor, setThemeColor] = useState('#3B82F6');

    const resetForm = () => {
        setStep(1);
        setSpecies(null);
        setNewName("");
        setNewBreed("");
        setShowAddModal(false);
        setIsOpen(false);
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        addPet({
            name: newName,
            breed: newBreed,
            age: 2, // Default
            weight: 5,
            gender: gender,
            image: species === 'cat'
                ? `https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800`
                : `https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800`,
            themeColor: themeColor
        });
        resetForm();
    };

    if (!activePet) return null;

    return (
        <>
            {/* --- TRIGGER BUTTONS --- */}

            {/* 1. BADGE MODE (Premium floating orb for Profile) */}
            {mode === 'badge' && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-12 h-12 rounded-full relative group transition-transform active:scale-95"
                >
                    {/* Glowing Ring */}
                    <div className="absolute -inset-1 bg-gradient-to-tr from-purple-500 to-orange-500 rounded-full blur opacity-40 group-hover:opacity-75 transition-opacity" />

                    {/* Main Avatar */}
                    <div className="w-full h-full rounded-full border-[3px] border-white dark:border-[#1A1A1A] overflow-hidden relative z-10 shadow-xl bg-white dark:bg-[#1A1A1A]">
                        <img
                            src={activePet.image}
                            alt={activePet.name}
                            className="w-full h-full object-cover"
                        />
                        {/* Edit Overlay */}
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Settings2 className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                    </div>

                    {/* Notification Dot */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-[#1A1A1A] z-20 flex items-center justify-center">
                        <span className="block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                </button>
            )}

            {/* 2. COMPACT MODE (Dynamic Pill for Headers) */}
            {mode === 'compact' && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 pr-4 p-1 rounded-full border transition-all active:scale-95 group bg-white/50 dark:bg-black/20 backdrop-blur-md border-gray-200/50 dark:border-white/5 hover:border-[#5B4D9D]/30"
                >
                    <div className="relative">
                        {/* Avatar */}
                        <img
                            src={activePet.image}
                            alt={activePet.name}
                            className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-[#1A1A1A] shadow-sm"
                        />
                        {/* Status Dot */}
                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#1A1A1A]" />
                    </div>

                    <div className="text-left">
                        <div className="text-[10px] text-gray-400 font-bold leading-none mb-0.5">Aktif</div>
                        <div className="text-xs font-black leading-none flex items-center gap-1 text-gray-900 dark:text-white group-hover:text-[#5B4D9D] transition-colors">
                            {activePet.name} <ChevronDown className="w-3 h-3 opacity-50" />
                        </div>
                    </div>
                </button>
            )}

            {/* 3. FULL MODE (Generic) */}
            {mode === 'full' && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-3 bg-white dark:bg-[#1A1A1A] p-2 pr-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 active:scale-95 transition-transform group"
                >
                    <div className="relative">
                        <img
                            src={activePet.image}
                            alt={activePet.name}
                            className="w-10 h-10 rounded-xl object-cover border-2 border-white dark:border-white/20 shadow-md"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white dark:border-black" />
                    </div>
                    <div className="text-left">
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Aktif Dost</div>
                        <div className="text-sm font-black leading-none flex items-center gap-1 text-gray-900 dark:text-white group-hover:text-[#5B4D9D] transition-colors">
                            {activePet.name} <ChevronDown className="w-3 h-3 opacity-50" />
                        </div>
                    </div>
                </button>
            )}

            {/* --- ULTRA PREMIUM ACTION SHEET --- */}
            <AnimatePresence>
                {isOpen && !showAddModal && (
                    <>
                        {/* Backdrop with Heavy Blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[150]"
                        />

                        {/* Main Sheet */}
                        <motion.div
                            initial={{ y: "110%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "110%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
                            className="fixed bottom-0 inset-x-0 z-[160] rounded-t-[2.5rem] overflow-hidden"
                            style={{
                                background: 'rgba(255, 255, 255, 0.85)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)'
                            }}
                        >
                            {/* Dark Mode Support Override Style */}
                            <div className="absolute inset-0 bg-white/50 dark:bg-[#1C1C1E]/90 -z-10" />

                            <div className="p-8 pb-12">
                                {/* Drag Handle */}
                                <div className="w-12 h-1.5 bg-gray-300/50 dark:bg-white/10 rounded-full mx-auto mb-10" />

                                <div className="flex justify-between items-center mb-8">
                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                                        <Sparkles className="w-5 h-5 text-[#5B4D9D]" />
                                        Moffi Ailesi
                                    </h3>
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center hover:bg-[#5B4D9D] hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* PREMIUM CARD GALLERY */}
                                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2 snap-x snap-mandatory">
                                    {pets.map(pet => (
                                        <button
                                            key={pet.id}
                                            onClick={() => { switchPet(pet.id); setIsOpen(false); }}
                                            className={cn(
                                                "relative w-36 aspect-[3/4] rounded-[1.5rem] overflow-hidden snap-center shrink-0 transition-all duration-300 group shadow-lg",
                                                activePet.id === pet.id
                                                    ? "ring-4 ring-[#5B4D9D] ring-offset-4 dark:ring-offset-black scale-100"
                                                    : "scale-95 opacity-70 hover:opacity-100 hover:scale-[0.98]"
                                            )}
                                        >
                                            <img
                                                src={pet.image}
                                                className="w-full h-full object-cover"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

                                            <div className="absolute bottom-4 left-4 text-left">
                                                <div className="text-white font-black text-lg leading-none mb-1">{pet.name}</div>
                                                <div className="text-white/80 text-xs font-medium">{pet.breed}</div>
                                            </div>

                                            {activePet.id === pet.id && (
                                                <div className="absolute top-3 right-3 bg-[#5B4D9D] text-white w-6 h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20">
                                                    <Check className="w-3.5 h-3.5" />
                                                </div>
                                            )}
                                        </button>
                                    ))}

                                    {/* Add Card (Gallery Style) */}
                                    <button
                                        onClick={() => setShowAddModal(true)}
                                        className="relative w-36 aspect-[3/4] rounded-[1.5rem] snap-center shrink-0 bg-gray-100 dark:bg-white/5 border-2 border-dashed border-gray-300 dark:border-white/10 flex flex-col items-center justify-center gap-4 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm">
                                            <Plus className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-400">Yeni Ekle</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* --- ADD PET MODAL (Full Screen) --- */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="fixed inset-0 z-[200] bg-[#F8F9FC] dark:bg-black flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-6 py-6 flex justify-between items-center sticky top-0 bg-[#F8F9FC]/80 dark:bg-black/80 backdrop-blur-md z-10">
                            <button onClick={resetForm} className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center hover:bg-black/10 transition-colors">
                                <X className="w-5 h-5 text-gray-900 dark:text-white" />
                            </button>
                            <span className="text-sm font-bold tracking-widest uppercase text-gray-400">Yeni Üye</span>
                            <div className="w-10" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 w-full max-w-md mx-auto px-6 py-4 flex flex-col justify-center min-h-[80vh]">

                            {/* STEP 1: SPECIES */}
                            {step === 1 && (
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="w-full"
                                >
                                    <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2 text-center">Türü Seç</h2>
                                    <p className="text-gray-500 text-center mb-10">Moffi, onun ihtiyaçlarına göre şekillenecek.</p>

                                    <div className="grid grid-cols-2 gap-6">
                                        <button
                                            onClick={() => { setSpecies('dog'); setStep(2); }}
                                            className="group relative aspect-[3/4] rounded-[2rem] bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/40 dark:to-orange-900/10 border-4 border-transparent hover:border-orange-500 transition-all shadow-xl overflow-hidden"
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Dog className="w-20 h-20 text-orange-500 group-hover:scale-125 transition-transform duration-500" />
                                            </div>
                                            <div className="absolute bottom-6 inset-x-0 text-center font-black text-xl text-orange-900 dark:text-orange-100">KÖPEK</div>
                                        </button>

                                        <button
                                            onClick={() => { setSpecies('cat'); setStep(2); }}
                                            className="group relative aspect-[3/4] rounded-[2rem] bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/40 dark:to-blue-900/10 border-4 border-transparent hover:border-blue-500 transition-all shadow-xl overflow-hidden"
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Cat className="w-20 h-20 text-blue-500 group-hover:scale-125 transition-transform duration-500" />
                                            </div>
                                            <div className="absolute bottom-6 inset-x-0 text-center font-black text-xl text-blue-900 dark:text-blue-100">KEDİ</div>
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: DETAILS */}
                            {step === 2 && (
                                <motion.div
                                    initial={{ x: 50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="w-full"
                                >
                                    <div className="flex flex-col items-center mb-10">
                                        <div className="w-28 h-28 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 relative group cursor-pointer border-4 border-white dark:border-white/10 shadow-2xl">
                                            {species === 'dog' ? <Dog className="w-12 h-12 text-gray-300" /> : <Cat className="w-12 h-12 text-gray-300" />}
                                            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-8 h-8 bg-[#5B4D9D] rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                                                <Plus className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                        <h2 className="text-3xl font-black text-gray-900 dark:text-white text-center">Detaylar</h2>
                                    </div>

                                    <form onSubmit={handleAdd} className="space-y-5">
                                        <div className="bg-white dark:bg-white/5 p-1 rounded-[1.5rem] border border-gray-200 dark:border-white/10 focus-within:ring-4 focus-within:ring-purple-500/20 transition-all shadow-sm">
                                            <input
                                                value={newName}
                                                onChange={e => setNewName(e.target.value)}
                                                placeholder="İsim (Örn: Pamuk)"
                                                className="w-full px-6 py-4 bg-transparent font-bold text-lg text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
                                                autoFocus
                                                required
                                            />
                                        </div>

                                        <div className="bg-white dark:bg-white/5 p-1 rounded-[1.5rem] border border-gray-200 dark:border-white/10 focus-within:ring-4 focus-within:ring-purple-500/20 transition-all shadow-sm">
                                            <input
                                                value={newBreed}
                                                onChange={e => setNewBreed(e.target.value)}
                                                placeholder="Irk (Örn: British Shorthair)"
                                                className="w-full px-6 py-4 bg-transparent font-bold text-lg text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setGender('female')}
                                                className={cn("py-4 rounded-[1.5rem] font-bold text-lg border-2 transition-all", gender === 'female' ? "bg-pink-50 border-pink-500 text-pink-600" : "bg-white dark:bg-white/5 border-transparent text-gray-400")}
                                            >
                                                Prenses ♀
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setGender('male')}
                                                className={cn("py-4 rounded-[1.5rem] font-bold text-lg border-2 transition-all", gender === 'male' ? "bg-blue-50 border-blue-500 text-blue-600" : "bg-white dark:bg-white/5 border-transparent text-gray-400")}
                                            >
                                                Prens ♂
                                            </button>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-5 bg-[#5B4D9D] text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-purple-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6"
                                        >
                                            Kaydet
                                        </button>
                                    </form>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
