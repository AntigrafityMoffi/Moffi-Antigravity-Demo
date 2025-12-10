export default function GamePage() {
    return (
        <main className="min-h-screen bg-[#F8F9FC] dark:bg-black font-sans flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🎮</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Moffi Game Zone</h1>
            <p className="text-gray-500 mb-8 max-w-xs">Eğlenceli oyunlar çok yakında burada! Mochi ile oynamaya hazır mısın?</p>
            <button className="bg-blue-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/30">
                Yakında Geliyor
            </button>
        </main>
    );
}
