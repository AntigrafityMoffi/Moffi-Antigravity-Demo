"use client";

import { useEffect, useState } from "react";
import { PawPrint } from "lucide-react";

interface SplashProps {
    onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 200); // Short delay after full load
                    return 100;
                }
                return prev + 10;
            });
        }, 100); // 100ms * 10 steps = 1s approx + delay = 1.2s

        return () => clearInterval(timer);
    }, [onComplete]);

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-[#E0F7FA] to-[#E8F5E9] flex flex-col items-center justify-center z-50">
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
                {/* Logo Area */}
                <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6 rotate-[-6deg]">
                    <PawPrint className="w-12 h-12 text-moffi-purple-dark" />
                </div>

                <h1 className="text-3xl font-black text-moffi-purple-dark mb-2 tracking-tight font-poppins">
                    MoffiPet<span className="text-moffi-primary">+</span>
                </h1>

                <p className="text-gray-500 text-sm font-medium mb-12">
                    Evcil dostlar için akıllı bir dünya.
                </p>

                {/* Loading Bar */}
                <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-moffi-purple-dark rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
