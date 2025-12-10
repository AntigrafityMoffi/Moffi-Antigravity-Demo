"use client";

import { useState } from "react";
import { ChevronRight, Sparkles, Shirt, MessageCircle, Dog } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingProps {
    onComplete: () => void;
}

const slides = [
    {
        id: 1,
        title: "Pet Odaklı Yaşam",
        desc: "Evcil dostun için akıllı asistan hazır.",
        icon: Dog,
        color: "bg-blue-100",
        iconColor: "text-blue-600"
    },
    {
        id: 2,
        title: "Eğlen – Paylaş – Kazan",
        desc: "Fotoğraf paylaş, eğlen, MoffiPuan kazan!",
        icon: MessageCircle,
        color: "bg-green-100",
        iconColor: "text-green-600"
    },
    {
        id: 3,
        title: "Kişiselleştirilebilir Deneyim",
        desc: "Hayvanını tasarla, giydir, deneyimle.",
        icon: Shirt,
        color: "bg-purple-100",
        iconColor: "text-purple-600"
    }
];

export function Onboarding({ onComplete }: OnboardingProps) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="fixed inset-0 bg-white flex flex-col z-40 max-w-md mx-auto shadow-2xl overflow-hidden font-sans">
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center mt-10">

                {/* Visual Area */}
                <div className={cn(
                    "w-64 h-64 rounded-full mb-10 flex items-center justify-center transition-all duration-500 shadow-lg",
                    slides[currentSlide].color
                )}>
                    {/* Dynamic Icon Rendering */}
                    {(() => {
                        const Icon = slides[currentSlide].icon;
                        return <Icon className={cn("w-32 h-32 opacity-80", slides[currentSlide].iconColor)} />;
                    })()}
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins min-h-[4rem]">
                    {slides[currentSlide].title}
                </h2>

                <p className="text-gray-500 leading-relaxed max-w-[280px]">
                    {slides[currentSlide].desc}
                </p>
            </div>

            {/* Bottom Controls */}
            <div className="p-8 pb-10">
                <div className="flex items-center justify-center gap-2 mb-8">
                    {slides.map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all duration-300",
                                i === currentSlide ? "w-8 bg-moffi-purple-dark" : "bg-gray-200"
                            )}
                        />
                    ))}
                </div>

                <button
                    onClick={nextSlide}
                    className="w-full bg-moffi-purple-dark text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-indigo-200 active:scale-95 transition-all"
                >
                    {currentSlide === slides.length - 1 ? "Başlayalım" : "Devam Et"}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
