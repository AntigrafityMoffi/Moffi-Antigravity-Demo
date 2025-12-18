"use client";

// Simple CSS/SVG Pie Chart to avoid 'recharts' dependency issues
const data = [
    { name: "Beslenme", value: 1050, color: "#F59E0B", percent: 37 }, // Amber
    { name: "Sağlık", value: 1200, color: "#EF4444", percent: 42 },   // Red
    { name: "Eğlence", value: 600, color: "#8B5CF6", percent: 21 },   // Violet
];

export function ExpenseChart() {
    // Calculate cumulative percentages for conic-gradient or SVG segments
    // Simple SVG approach: Circle with stroke-dasharray
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;

    return (
        <div className="h-48 w-full relative flex items-center justify-center">
            <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
                {data.map((item, index) => {
                    const strokeDasharray = `${(item.percent / 100) * circumference} ${circumference}`;
                    const strokeDashoffset = -currentOffset;
                    currentOffset += (item.percent / 100) * circumference;

                    return (
                        <circle
                            key={index}
                            cx="80"
                            cy="80"
                            r={radius}
                            fill="transparent"
                            stroke={item.color}
                            strokeWidth="20"
                            strokeDasharray={strokeDasharray}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                        />
                    );
                })}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-gray-400 font-bold uppercase">Toplam</span>
                <span className="text-2xl font-black text-gray-900 dark:text-white">₺2.850</span>
            </div>
        </div>
    );
}
