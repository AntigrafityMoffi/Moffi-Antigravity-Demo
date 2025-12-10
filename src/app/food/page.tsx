export default function FoodPage() {
    return (
        <main className="min-h-screen bg-[#F8F9FC] dark:bg-black font-sans flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🦴</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Beslenme Takibi</h1>
            <p className="text-gray-500 mb-8 max-w-xs">Mochi'nin öğünlerini ve kalori alımını buradan takip edebileceksin.</p>
            <button className="bg-green-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-green-500/30">
                Öğün Ekle (Demo)
            </button>
        </main>
    );
}
