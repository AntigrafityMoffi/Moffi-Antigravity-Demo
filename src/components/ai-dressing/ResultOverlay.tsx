"use client";

import { X, Check, Share2, Instagram, Twitter, Download, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultOverlayProps {
    resultImage: string;
    originalImage: string;
    onClose: () => void;
    onShare: (platform: string) => void;
}

import { useState } from "react";

export function ResultOverlay({ resultImage, originalImage, onClose, onShare }: ResultOverlayProps) {
    const [showOriginal, setShowOriginal] = useState(false);

    return (
        <div className="fixed inset-0 z-[100] bg-black animate-in fade-in duration-500 flex flex-col">

            {/* Gamification Banner */}
            <div className="absolute top-10 w-full flex justify-center z-50 animate-in slide-in-from-top-10 delay-700 duration-1000 fill-mode-forwards opacity-0">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-2xl shadow-orange-500/40 flex items-center gap-2 border-2 border-white/20">
                    <span>🎉</span>
                    <span>+20 MoffiPuan Kazandın!</span>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute top-6 left-6 z-50">
                <button onClick={onClose} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="absolute top-6 right-6 z-50 flex gap-2">
                <button
                    onMouseDown={() => setShowOriginal(true)}
                    onMouseUp={() => setShowOriginal(false)}
                    onTouchStart={() => setShowOriginal(true)}
                    onTouchEnd={() => setShowOriginal(false)}
                    className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20 select-none active:bg-white/40 transition"
                >
                    Basılı Tut: Önce
                </button>
            </div>

            {/* Main Image Stage */}
            <div className="flex-1 relative w-full h-full">
                <img
                    src={showOriginal ? originalImage : resultImage}
                    className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Watermark/Branding */}
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 opacity-50">
                    <span className="text-white/40 font-black tracking-[0.5em] text-xs">MOFFI AI STUDIO</span>
                </div>
            </div>

            {/* Bottom Sharing Sheet */}
            <div className="bg-[#121212] pb-10 pt-6 px-6 rounded-t-[2rem] -mt-6 relative z-40 border-t border-white/10">
                <div className="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-6" />

                <h3 className="text-white font-bold text-center mb-6">Harika Görünüyor! Paylaş?</h3>

                <div className="flex justify-center gap-6">
                    {[
                        { icon: Share2, label: "Moffi", color: "bg-indigo-600" },
                        { icon: Instagram, label: "Story", color: "bg-gradient-to-tr from-yellow-500 to-purple-600" },
                        { icon: Twitter, label: "Tweet", color: "bg-sky-500" },
                        { icon: Smartphone, label: "WA", color: "bg-green-500" },
                        { icon: Download, label: "Kaydet", color: "bg-gray-700" },
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                            <button
                                onClick={() => onShare(item.label)}
                                className={cn("w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform", item.color)}
                            >
                                <item.icon className="w-6 h-6" />
                            </button>
                            <span className="text-gray-400 text-[10px]">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
