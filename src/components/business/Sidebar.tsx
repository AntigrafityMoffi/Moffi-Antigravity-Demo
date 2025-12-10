"use client";

import { LayoutDashboard, Store, Megaphone, Settings, LogOut, BarChart3, Map, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

const MENU_ITEMS = [
    { title: "Genel Bakış", icon: LayoutDashboard, path: "/business/dashboard" },
    { title: "Kampanyalar", icon: Megaphone, path: "/business/campaigns" },
    { title: "Walk Quest", icon: Map, path: "/business/quests" },
    { title: "Analizler", icon: BarChart3, path: "/business/analytics" },
    { title: "Mağaza Profili", icon: Store, path: "/business/profile" },
    { title: "Ayarlar", icon: Settings, path: "/business/settings" },
];

interface BusinessSidebarProps {
    isMobileOpen?: boolean;
    onMobileClose?: () => void;
}

export function BusinessSidebar({ isMobileOpen = false, onMobileClose }: BusinessSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    onClick={onMobileClose}
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                />
            )}

            <aside className={cn(
                "bg-white border-r border-gray-100 flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl shadow-indigo-50",
                collapsed ? "md:w-20" : "md:w-72",
                // Mobile behavior:
                "w-72", // Always full width on mobile when open
                isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0" // Hidden on mobile unless open, always visible on desktop
            )}>
                {/* Logo Area */}
                <div className={cn("flex items-center gap-3 p-6", collapsed && "md:justify-center md:p-4")}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 flex-shrink-0">
                        M
                    </div>
                    {(!collapsed || typeof window !== 'undefined' && window.innerWidth < 768) && (
                        <div className={cn("flex flex-col", collapsed && "md:hidden")}>
                            <span className="font-bold text-gray-900 text-lg leading-none">MoffiBusiness</span>
                            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider mt-1">Partner Panel</span>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
                    {MENU_ITEMS.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    router.push(item.path);
                                    if (onMobileClose) onMobileClose();
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative",
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900",
                                    collapsed && "md:justify-center md:px-0"
                                )}
                            >
                                <item.icon className={cn("w-5 h-5 transition-colors flex-shrink-0", isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600")} />
                                <span className={cn("text-sm font-medium", collapsed && "md:hidden")}>{item.title}</span>
                                {isActive && (
                                    <div className={cn("ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600", collapsed && "md:hidden")} />
                                )}

                                {/* Collapse Tooltip (Desktop Only) */}
                                {collapsed && (
                                    <div className="hidden md:block absolute left-full ml-4 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.title}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Collapse Toggle (Desktop Only) */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="hidden md:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-gray-100 rounded-full items-center justify-center text-gray-400 hover:text-indigo-600 shadow-sm z-50"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>

                {/* User Profile / Logout */}
                <div className={cn("p-4 border-t border-gray-100", collapsed && "md:p-2")}>
                    <div className={cn(
                        "flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition group",
                        collapsed && "md:justify-center md:p-0 md:w-10 md:h-10 md:mx-auto"
                    )}>
                        <img
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/Starbucks_Corporation_Logo_2011.svg/1200px-Starbucks_Corporation_Logo_2011.svg.png"
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                            alt="Business Logo"
                        />
                        <div className={cn("flex-1 overflow-hidden", collapsed && "md:hidden")}>
                            <div className="text-sm font-bold text-gray-900 truncate">Starbucks Kadıköy</div>
                            <div className="text-xs text-green-600 font-bold truncate">● Online</div>
                        </div>
                        <LogOut className={cn("w-4 h-4 text-gray-300 group-hover:text-red-500 transition-colors flex-shrink-0", collapsed && "md:hidden")} />
                    </div>
                </div>
            </aside>
        </>
    );
}
