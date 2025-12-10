"use client";

import { useState } from "react";
import { Camera, ChevronRight, User, Dog, Cat, Bird, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocial } from "@/context/SocialContext";

interface SetupProps {
    onComplete: () => void;
}

export function SetupWizard({ onComplete }: SetupProps) {
    const { updateUserInfo } = useSocial();
    const [step, setStep] = useState<1 | 2>(1);

    // Step 1: Profile
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    // Step 2: Pet
    const [petName, setPetName] = useState("");
    const [petType, setPetType] = useState<'dog' | 'cat' | 'bird' | 'other'>('dog');

    const handleNext = () => {
        if (step === 1 && name && username) {
            setStep(2);
        } else if (step === 2 && petName) {
            // Update Context with real user data
            updateUserInfo({
                name: petName + " The " + (petType === 'dog' ? 'Dog' : petType), // Creative naming hack
                username: username,
                bio: `Merhaba! Ben ${name}'in dostuyum.`, // Default bio
            });
            onComplete();
        }
    };

    return (
        <div className="flex flex-col h-full bg-white font-sans">
            {/* Progress Bar */}
            <div className="h-1 flex gap-1 px-1 pt-1">
                <div className={cn("h-full flex-1 rounded-full transition-colors duration-500", step >= 1 ? "bg-moffi-purple-dark" : "bg-gray-200")} />
                <div className={cn("h-full flex-1 rounded-full transition-colors duration-500", step >= 2 ? "bg-moffi-purple-dark" : "bg-gray-200")} />
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-10">
                {step === 1 ? (
                    <div className="animate-in slide-in-from-right duration-500">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Profilini Oluştur</h2>
                        <p className="text-gray-500 mb-8">Moffi topluluğunda seni nasıl tanıyalım?</p>

                        <div className="flex justify-center mb-8">
                            <div className="w-28 h-28 bg-gray-100 rounded-full flex items-center justify-center relative border-4 border-white shadow-lg">
                                <User className="w-10 h-10 text-gray-400" />
                                <button className="absolute bottom-0 right-0 p-2 bg-moffi-purple-dark text-white rounded-full border-2 border-white shadow-sm">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">Adın Soyadın</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    type="text"
                                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                                    placeholder="Örn: Ayşe Yılmaz"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">Kullanıcı Adı</label>
                                <input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    type="text"
                                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                                    placeholder="@ayseyilmaz"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">Bio (Opsiyonel)</label>
                                <textarea
                                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none resize-none"
                                    placeholder="Kendinden bahset..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in slide-in-from-right duration-500">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">İlk Petini Tanıt</h2>
                        <p className="text-gray-500 mb-8">Onun için en iyi deneyimi hazırlayalım.</p>

                        <div className="flex justify-center mb-8">
                            <div className="w-28 h-28 bg-orange-50 rounded-full flex items-center justify-center relative border-4 border-white shadow-lg">
                                <Dog className="w-10 h-10 text-orange-400" />
                                <button className="absolute bottom-0 right-0 p-2 bg-orange-500 text-white rounded-full border-2 border-white shadow-sm">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Türü</label>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'dog', icon: Dog, label: 'Köpek' },
                                        { id: 'cat', icon: Cat, label: 'Kedi' },
                                        { id: 'bird', icon: Bird, label: 'Kuş' },
                                        { id: 'other', icon: Heart, label: 'Diğer' },
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            onClick={() => setPetType(type.id as any)}
                                            className={cn(
                                                "flex-1 py-3 bg-gray-50 rounded-xl flex flex-col items-center gap-1 border-2 transition-all",
                                                petType === type.id ? "border-moffi-purple-dark bg-purple-50 text-moffi-purple-dark" : "border-transparent text-gray-500"
                                            )}
                                        >
                                            <type.icon className="w-6 h-6" />
                                            <span className="text-xs font-bold">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 ml-1">Adı</label>
                                <input
                                    value={petName}
                                    onChange={(e) => setPetName(e.target.value)}
                                    type="text"
                                    className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                                    placeholder="Örn: Pamuk"
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="space-y-1 flex-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Irkı</label>
                                    <input type="text" className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none" placeholder="Golden" />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Yaşı</label>
                                    <input type="number" className="w-full px-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none" placeholder="2" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-6 pb-8 bg-white border-t border-gray-50">
                <button
                    onClick={handleNext}
                    disabled={(step === 1 && !username) || (step === 2 && !petName)}
                    className="w-full py-4 bg-moffi-purple-dark text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {step === 1 ? "Devam Et" : "Moffi'ye Katıl!"}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
