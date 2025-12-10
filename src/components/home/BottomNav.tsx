import { Home, ShoppingCart, Stethoscope, User, PlusCircle, Hexagon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BottomNavProps {
    active?: 'home' | 'explore' | 'community' | 'vet' | 'profile';
    className?: string; // Allow custom styling positioning
}

export function BottomNav({ active = 'home', className }: BottomNavProps) {
    return (
        <div className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[calc(448px-3rem)] h-16 bg-[#1a1a1a] rounded-full flex items-center justify-between px-6 text-gray-400 shadow-2xl z-50 ring-1 ring-white/10", className)}>

            {/* Home */}
            <Link href="/home" className={cn("flex flex-col items-center gap-1 transition-colors", active === 'home' ? "text-white" : "hover:text-white")}>
                <Home className="w-5 h-5" />
                <span className="text-[9px] font-medium">Home</span>
            </Link>

            {/* Shop (Formerly Explore) */}
            <Link href="/shop" className={cn("flex flex-col items-center gap-1 transition-colors group", active === 'explore' ? "text-white" : "hover:text-white")}>
                <ShoppingCart className={cn("w-5 h-5 group-hover:text-green-400", active === 'explore' ? "text-green-400" : "text-green-700")} />
                <span className={cn("text-[9px] font-medium group-hover:text-green-400", active === 'explore' ? "text-green-400" : "text-green-700")}>Shop</span>
            </Link>

            {/* Central Community Button */}
            <div className="relative -top-6">
                <Link href="/community" className="w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] border-4 border-[#121212] bg-gradient-to-tr from-moffi-primary via-green-400 to-teal-300 relative group overflow-hidden">
                    {/* Animated Glow Effect */}
                    <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-20 group-hover:animate-[shimmer_1s_infinite] transition-all" />

                    {/* Icon */}
                    <PlusCircle className="w-8 h-8 text-white relative z-10 drop-shadow-md" />
                </Link>
            </div>

            {/* Vet */}
            <button className={cn("flex flex-col items-center gap-1 transition-colors", active === 'vet' ? "text-white" : "hover:text-white")}>
                <Stethoscope className="w-5 h-5" />
                <span className="text-[9px] font-medium">Vet</span>
            </button>

            {/* Profile */}
            <Link href="/profile" className={cn("flex flex-col items-center gap-1 transition-colors", active === 'profile' ? "text-white" : "hover:text-white")}>
                <User className="w-5 h-5" />
                <span className="text-[9px] font-medium">Profile</span>
            </Link>
        </div>
    );
}
