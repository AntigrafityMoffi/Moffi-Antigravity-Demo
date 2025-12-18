"use client";

import { useState, useRef, useEffect } from "react";
import {
    MessageSquare, X, Send, Sparkles,
    BrainCircuit, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useChat } from "ai/react";

// --- QUICK SUGGESTIONS ---
const QUICK_SUGGESTIONS = [
    "Halsiz görünüyor 🤒",
    "Aşı zamanı geldi mi? 💉",
    "Ne kadar mama yemeli? 🍖",
    "Kaka rengi tuhaf 💩"
];

export function MoffiAssistant({ isEmbedded = false }: { isEmbedded?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    // --- REAL AI HOOK ---
    const { messages, input, handleInputChange, handleSubmit, append, isLoading, error } = useChat({
        api: '/api/chat',
        initialMessages: [
            { id: 'initial-ai', role: 'assistant', content: "Merhaba! Ben Moffi AI. Evcil dostunla ilgili her şeyi bana sorabilirsin! 🐶🐱" }
        ],
        onError: (err) => {
            console.error("AI SDK Error (Silent):", err);
            // We now rely on the server fallback, so client errors should be rare.
            // If they happen, we just log them. No annoying alerts.
        }
    });

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleQuickReply = (text: string) => {
        append({ role: 'user', content: text });
    };

    return (
        <>
            {/* FLOATING ORB BUTTON */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsOpen(true)}
                        className={cn(
                            "z-50 w-11 h-11 rounded-full bg-gradient-to-tr from-[#5B4D9D] to-[#8B5CF6] text-white shadow-2xl shadow-purple-500/40 flex items-center justify-center border-2 border-white/20 dark:border-white/10",
                            isEmbedded ? "relative" : "fixed bottom-32 right-6"
                        )}
                    >
                        {/* Animated Rings */}
                        <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-50" />
                        <Sparkles className="w-5 h-5 fill-current" />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#5B4D9D] rounded-full" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* CHAT INTERFACE OVERLAY */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.9 }}
                        className="fixed bottom-6 right-6 z-[60] w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-white/95 dark:bg-[#121212]/95 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/10 flex flex-col overflow-hidden ring-1 ring-black/5"
                    >
                        {/* HEADER */}
                        <div className="p-4 bg-gradient-to-r from-[#5B4D9D] to-[#8B5CF6] text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay" />

                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                                    <BrainCircuit className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg leading-tight">Moffi AI</h3>
                                    <p className="text-[10px] opacity-80 font-medium flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Çevrimiçi • Asistan
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors relative z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* MESSAGES AREA */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F8F9FC] dark:bg-black/40 scroll-smooth"
                        >
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex flex-col max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                                    )}
                                >
                                    <div className={cn(
                                        "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-[#5B4D9D] text-white rounded-tr-none"
                                            : "bg-white dark:bg-[#1A1A1A] text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-white/10 rounded-tl-none"
                                    )}>
                                        {msg.content.split('\n').map((line, i) => (
                                            <p key={i} className={cn(i > 0 && "mt-2")}>{line}</p>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 p-2 bg-white dark:bg-[#1A1A1A] rounded-2xl w-16 h-10 border border-gray-100 dark:border-white/10">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </motion.div>
                            )}

                            {/* ERROR DISPLAY (Simplified) */}
                            {error && (
                                <div className="p-2 mx-auto w-fit text-[10px] text-red-500 opacity-70">
                                    Bağlantı kesildi, tekrar deneniyor...
                                </div>
                            )}
                        </div>


                        {/* INPUT AREA */}
                        <div className="p-4 bg-white dark:bg-[#121212] border-t border-gray-100 dark:border-white/5 relative">
                            {/* REMOVED TEST BUTTON TO REDUCE NOISE */}

                            {/* Suggestions */}
                            {messages.length < 3 && !isLoading && (
                                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-1">
                                    {QUICK_SUGGESTIONS.map(s => (
                                        <button
                                            key={s}
                                            onClick={() => handleQuickReply(s)}
                                            className="whitespace-nowrap bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-[#5B4D9D]/10 hover:border-[#5B4D9D]/30 hover:text-[#5B4D9D] transition-all"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="flex gap-2 relative">
                                <input
                                    type="text"
                                    value={input ?? ''}
                                    onChange={handleInputChange}
                                    placeholder="Bir şeyler sor... (örn: Mochi kustu)"
                                    className="flex-1 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl pl-4 pr-12 outline-none border border-transparent focus:border-[#5B4D9D]/50 focus:bg-white dark:focus:bg-black/50 transition-all font-medium text-sm text-gray-900 dark:text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!(input ?? '').trim() || isLoading}
                                    className="absolute right-2 top-2 w-8 h-8 bg-[#5B4D9D] rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
