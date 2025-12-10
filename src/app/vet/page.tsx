export default function VetPage() {
    return (
        <main className="min-h-screen bg-[#F8F9FC] dark:bg-black font-sans flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">🩺</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Veteriner Asistanı</h1>
            <p className="text-gray-500 mb-8 max-w-xs">Aşı takvimi, randevular ve sağlık kayıtları çok yakında elinin altında.</p>
            <button className="bg-red-500 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-red-500/30">
                Randevu Al
            </button>
        </main>
    );
}
