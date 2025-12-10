"use client";

import { X, Wallet, TrendingUp, History, Sparkles, Hexagon, Crown } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { cn } from "@/lib/utils";

interface MoffiWalletProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MoffiWallet({ isOpen, onClose }: MoffiWalletProps) {
    const { economy } = useSocial(); // Use global state

    if (!isOpen) return null;

    const progressPercent = (economy.currentXP / economy.nextLevelXP) * 100;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
                onClick={onClose}
            />

            {/* Wallet Card */}
            <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-t-[2.5rem] sm:rounded-[2.5rem] p-6 pointer-events-auto relative shadow-2xl animate-in slide-in-from-bottom duration-500 transition-colors">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 transition"
                >
                    <X className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-gray-900 dark:text-white font-poppins">Moffi Cüzdan</h2>
                        <p className="text-xs text-gray-400 dark:text-gray-500 font-bold">Resmi Bakiye</p>
                    </div>
                </div>

                {/* Main Curve Card */}
                <div className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] dark:from-indigo-600 dark:to-purple-800 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none mb-6 relative overflow-hidden transition-all">
                    {/* Decor */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl opacity-50" />

                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Toplam Moffi Puan</div>
                        <div className="text-5xl font-black mb-2 flex items-center gap-2">
                            <span className="text-yellow-400 text-3xl">✨</span>
                            {economy.points.toLocaleString()}
                        </div>

                        <div className="w-full bg-black/20 h-10 rounded-xl mt-4 flex items-center px-4 justify-between border border-white/10">
                            <div className="flex items-center gap-2">
                                <Crown className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs font-bold">Seviye {economy.level}</span>
                            </div>
                            <span className="text-[10px] font-bold text-indigo-200">{economy.currentXP} / {economy.nextLevelXP} XP</span>
                        </div>
                        {/* Progress Bar Inside Card */}
                        <div className="w-full h-1 bg-black/20 mt-[-1px] relative overflow-hidden">
                            <div className="absolute left-0 top-0 h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
                        </div>
                    </div>
                </div>

                {/* History List */}
                <div>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        <History className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        Son İşlemler
                    </h3>

                    <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                        {economy.history.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="text-xl">{tx.icon}</div>
                                    <div>
                                        <div className="text-xs font-bold text-gray-800 dark:text-white">{tx.description}</div>
                                        <div className="text-[10px] text-gray-400 dark:text-gray-500">
                                            {new Date(tx.date).toLocaleDateString()} • {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                                <div className={cn("text-sm font-black", tx.type === 'earn' ? "text-green-500" : "text-red-500")}>
                                    {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 border border-transparent dark:border-gray-200">
                    <TrendingUp className="w-4 h-4 text-green-400 dark:text-green-600" />
                    Market ve Ödüller
                </button>

            </div>
        </div>
    );
}
