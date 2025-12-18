
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

type Message = {
    role: 'user' | 'ai';
    content: string;
};

export function GlobalAIWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', content: 'Merhaba! Ben Moffi Asistan. Size nasıl yardımcı olabilirim? 🐾' }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, { role: 'user', content: userMsg }],
                    context: pathname // Send current page as context
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessages(prev => [...prev, { role: 'ai', content: data.message }]);
            } else {
                console.error("AI API Error:", data);
                const errorMessage = data.details || data.error || 'Bağlantı sorunu var. Lütfen terminali kapatıp "npm run dev" komutunu tekrar çalıştırın (Env değişikliği için).';
                setMessages(prev => [...prev, { role: 'ai', content: `⚠️ Hata: ${errorMessage}` }]);
            }
        } catch (error: any) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'ai', content: `Bir hata oluştu: ${error.message}` }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-48 right-6 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                        className="mb-3 w-[300px] h-[450px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-between text-white shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Bot className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xs">Moffi Asistan</h3>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/10 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-black/20 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-white/10">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex gap-2 max-w-[90%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}
                                >
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border",
                                        msg.role === 'user'
                                            ? "bg-gray-100 dark:bg-white/10 border-gray-200 dark:border-white/5"
                                            : "bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-500/20 text-purple-600"
                                    )}>
                                        {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                                    </div>
                                    <div className={cn(
                                        "p-2.5 rounded-2xl text-[11px] leading-relaxed shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-black text-white dark:bg-white dark:text-black rounded-tr-none"
                                            : "bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-white/5"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-2 mr-auto max-w-[90%]">
                                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center shrink-0">
                                        <Bot className="w-3 h-3 text-purple-600" />
                                    </div>
                                    <div className="bg-white dark:bg-zinc-800 p-2.5 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/5 flex gap-1 items-center h-8">
                                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-2 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 shrink-0">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Bir şeyler sorun..."
                                    className="flex-1 bg-gray-100 dark:bg-zinc-800 border-transparent focus:border-purple-500 rounded-lg px-3 py-2 text-[11px] outline-none transition"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isLoading}
                                    className="w-8 h-8 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button - SCALED DOWN ~60% SIZE (from 56px to 40px) */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 relative group",
                    isOpen ? "bg-black dark:bg-white text-white dark:text-black rotate-90" : "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                )}
            >
                {isOpen ? <X className="w-4 h-4" /> : <Sparkles className="w-4 h-4 animate-pulse" />}

                {!isOpen && (
                    <span className="absolute -top-1 -right-0.5 w-2.5 h-2.5 bg-red-500 border border-white dark:border-black rounded-full" />
                )}
            </motion.button>
        </div>
    );
}
