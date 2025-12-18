"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";

interface AnalyticsChartProps {
    data: number[];
    labels: string[];
}

export function AnalyticsChart({ data, labels }: AnalyticsChartProps) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // If no data provided, render nothing or loader
    if (!data || data.length === 0) return null;

    const days = labels;

    const width = 800;
    const height = 200;

    const { points, areaPath, max } = useMemo(() => {
        const maxVal = Math.max(...data);
        const pts = data.map((val, i) => {
            const x = (i / (data.length - 1)) * width;
            const y = height - ((val - 0) / (maxVal - 0)) * height;
            return `${x},${y}`;
        }).join(" ");

        return {
            points: pts,
            areaPath: `${pts} ${width},${height} 0,${height}`,
            max: maxVal
        };
    }, [data]);

    return (
        <div className="w-full relative h-[250px] flex flex-col justify-end overflow-hidden">
            {/* Chart SVG */}
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                <defs>
                    <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area Fill */}
                <motion.path
                    d={`M${areaPath}Z`}
                    fill="url(#gradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* Line */}
                <motion.polyline
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="4"
                    points={points}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Interactive Points */}
                {data.map((val, i) => {
                    const x = (i / (data.length - 1)) * width;
                    const y = height - ((val - 0) / (max - 0)) * height;
                    return (
                        <g key={i}>
                            <circle
                                cx={x}
                                cy={y}
                                r="6"
                                fill="white"
                                stroke="#4F46E5"
                                strokeWidth="3"
                                className="cursor-pointer transition-all duration-300 hover:r-8 hover:stroke-width-4"
                                onMouseEnter={() => setHoveredIndex(i)}
                                onMouseLeave={() => setHoveredIndex(null)}
                            />
                        </g>
                    );
                })}
            </svg>

            {/* Custom Tooltip */}
            {hoveredIndex !== null && (
                <div
                    className="absolute bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg pointer-events-none transform -translate-x-1/2 -translate-y-full shadow-xl"
                    style={{
                        left: `${(hoveredIndex / (data.length - 1)) * 100}%`,
                        top: `${100 - ((data[hoveredIndex] / max) * 100) + 10}%` // Approximated position
                    }}
                >
                    {data[hoveredIndex]} Ziyaretçi
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-900 rotate-45" />
                </div>
            )}

            {/* X Axis Labels */}
            <div className="flex justify-between w-full mt-4 border-t border-gray-100 pt-3">
                {days.filter((_, i) => i % 2 === 0).map((day, i) => (
                    <span key={i} className="text-xs font-medium text-gray-400">{day}</span>
                ))}
            </div>
        </div>
    );
}
