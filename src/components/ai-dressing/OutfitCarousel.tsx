"use client";

import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Outfit {
    id: number;
    name: string;
    image: string;
    type: string;
    color: string;
    price: string;
}

interface OutfitCarouselProps {
    outfits: Outfit[];
    selectedId: number | null;
    onSelect: (outfit: Outfit) => void;
}

export function OutfitCarousel({ outfits, selectedId, onSelect }: OutfitCarouselProps) {
    return (
        <div className="flex gap-4 overflow-x-auto pb-8 pt-4 px-6 scrollbar-hide snap-x">
            {outfits.map((outfit) => (
                <div
                    key={outfit.id}
                    onClick={() => onSelect(outfit)}
                    className={cn(
                        "relative min-w-[110px] h-[160px] rounded-2xl cursor-pointer transition-all duration-500 group snap-center overflow-hidden",
                        selectedId === outfit.id
                            ? "ring-4 ring-indigo-500 ring-offset-4 dark:ring-offset-[#121212] scale-105 shadow-2xl shadow-indigo-500/30"
                            : "hover:scale-105 opacity-80 hover:opacity-100"
                    )}
                >
                    {/* Background Image */}
                    <img src={outfit.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Content */}
                    <div className="absolute bottom-0 w-full p-4 flex flex-col gap-1 items-start">
                        <span className="text-[10px] font-bold text-white/60 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-md uppercase tracking-wide">
                            {outfit.type}
                        </span>
                        <h3 className="text-white font-bold text-lg leading-tight">{outfit.name}</h3>
                        <p className="text-indigo-300 font-bold text-sm">{outfit.price}</p>
                    </div>

                    {/* "Try" Button Overlay (Visible on Hover/Select) */}
                    <div className={cn(
                        "absolute top-3 right-3 transition-all duration-300",
                        selectedId === outfit.id ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                    )}>
                        <div className="w-8 h-8 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg">
                            <Sparkles className="w-4 h-4 fill-current" />
                        </div>
                    </div>
                </div>
            ))}

            {/* Spacer for right padding */}
            <div className="w-2 shrink-0" />
        </div>
    );
}
