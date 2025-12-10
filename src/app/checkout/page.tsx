"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    CreditCard,
    MapPin,
    Truck,
    CheckCircle2,
    Lock,
    ArrowRight,
    ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// --- STEPS ---
const STEPS = [
    { id: 1, title: 'Adres', icon: MapPin },
    { id: 2, title: 'Kargo', icon: Truck },
    { id: 3, title: 'Ödeme', icon: CreditCard },
];

export default function CheckoutPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);

    // MOCK DATA for Review
    const total = 1198;

    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // FINISH
            setIsProcessing(true);
            setTimeout(() => {
                router.push('/checkout/success');
            }, 2500);
        }
    };

    return (
        <main className="min-h-screen bg-[#F8F9FC] dark:bg-black font-sans pb-32 pt-10">
            <div className="max-w-2xl mx-auto px-6">

                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-8 text-center">Ödemeyi Tamamla</h1>

                {/* STEPS INDICATOR */}
                <div className="flex justify-between items-center mb-10 relative">
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 dark:bg-gray-800 -z-10" />
                    {STEPS.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-2 bg-[#F8F9FC] dark:bg-black px-2">
                            <div className={cn(
                                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                currentStep >= step.id
                                    ? "bg-[#5B4D9D] border-[#5B4D9D] text-white shadow-lg shadow-purple-500/30"
                                    : "bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-gray-800 text-gray-400"
                            )}>
                                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : <step.icon className="w-4 h-4" />}
                            </div>
                            <span className={cn(
                                "text-xs font-bold transition-colors",
                                currentStep >= step.id ? "text-[#5B4D9D]" : "text-gray-400"
                            )}>{step.title}</span>
                        </div>
                    ))}
                </div>

                {/* ACCORDION CONTENT */}
                <div className="bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] shadow-xl border border-white/50 dark:border-white/5 overflow-hidden">

                    {/* STEP 1: ADDRESS */}
                    <StepSection
                        step={1} currentStep={currentStep} setCurrentStep={setCurrentStep}
                        title="Teslimat Adresi" icon={MapPin}
                        summary="Caddebostan Mah. Bağdat Cad..."
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Ad" placeholder="Moffi" />
                                <Input label="Soyad" placeholder="Pet" />
                            </div>
                            <Input label="Adres Başlığı" placeholder="Evim" />
                            <Input label="Açık Adres" placeholder="Caddebostan Mah. Bağdat Cad. No:1" textarea />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="İlçe" placeholder="Kadıköy" />
                                <Input label="Şehir" placeholder="İstanbul" />
                            </div>
                        </div>
                    </StepSection>

                    {/* STEP 2: SHIPPING */}
                    <StepSection
                        step={2} currentStep={currentStep} setCurrentStep={setCurrentStep}
                        title="Kargo Seçimi" icon={Truck}
                        summary="Yurtiçi Kargo (Ücretsiz)"
                    >
                        <div className="space-y-3">
                            {[
                                { name: "Yurtiçi Kargo", price: "Ücretsiz", time: "1-2 İş Günü", selected: true },
                                { name: "MNG Kargo", price: "+15₺", time: "2-3 İş Günü", selected: false },
                                { name: "Moffi Jet", price: "+49₺", time: "Aynı Gün", selected: false },
                            ].map((opt, i) => (
                                <div key={i} className={cn(
                                    "p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all",
                                    opt.selected
                                        ? "border-[#5B4D9D] bg-purple-50/50 dark:bg-purple-900/10"
                                        : "border-gray-100 dark:border-white/5 hover:bg-gray-50"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center", opt.selected ? "border-[#5B4D9D]" : "border-gray-300")}>
                                            {opt.selected && <div className="w-2.5 h-2.5 bg-[#5B4D9D] rounded-full" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">{opt.name}</h4>
                                            <p className="text-xs text-gray-500">{opt.time}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-sm text-[#5B4D9D]">{opt.price}</span>
                                </div>
                            ))}
                        </div>
                    </StepSection>

                    {/* STEP 3: PAYMENT */}
                    <StepSection
                        step={3} currentStep={currentStep} setCurrentStep={setCurrentStep}
                        title="Ödeme Yöntemi" icon={CreditCard}
                    >
                        <div className="space-y-6">
                            {/* Card Visual */}
                            <div className="w-full h-48 rounded-2xl bg-gradient-to-br from-gray-900 to-black p-6 text-white shadow-xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                                <div className="relative z-10 flex flex-col justify-between h-full">
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono text-sm opacity-70">Credit Card</span>
                                        <div className="w-8 h-5 bg-white/20 rounded flex items-center justify-center text-[10px]">CHIP</div>
                                    </div>
                                    <div className="font-mono text-xl tracking-widest mt-4">**** **** **** 4242</div>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <div className="text-[10px] opacity-70 uppercase mb-1">Card Holder</div>
                                            <div className="text-sm font-bold">MOFFI USER</div>
                                        </div>
                                        <div className="w-10 h-6 bg-white/90 rounded-sm"></div>
                                    </div>
                                </div>
                            </div>

                            <form className="space-y-4">
                                <Input label="Kart Numarası" placeholder="0000 0000 0000 0000" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Son Kullanma (AA/YY)" placeholder="12/25" />
                                    <Input label="CVC" placeholder="123" />
                                </div>
                            </form>
                        </div>
                    </StepSection>

                    {/* ACTION BAR */}
                    <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-500 font-medium">Toplam Tutar</span>
                            <span className="text-2xl font-black text-[#5B4D9D]">{total}₺</span>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={isProcessing}
                            className={cn(
                                "w-full py-4 bg-[#5B4D9D] text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95",
                                isProcessing ? "opacity-80 cursor-not-allowed" : ""
                            )}
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    İşleniyor...
                                </>
                            ) : (
                                <>
                                    {currentStep === 3 ? "Siparişi Tamamla" : "Devam Et"}
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>

                </div>

                <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" /> Tüm işlemler 256-bit SSL ile şifrelenmektedir.
                </p>

            </div>
        </main>
    );
}

// --- SUB COMPONENTS ---

function StepSection({ step, currentStep, setCurrentStep, title, icon: Icon, summary, children }: any) {
    const isActive = step === currentStep;
    const isCompleted = step < currentStep;

    return (
        <div className={cn("border-b border-gray-100 dark:border-white/5 last:border-0 transition-all", isActive ? "bg-white dark:bg-[#1A1A1A]" : "bg-gray-50/30 dark:bg-white/5")}>
            <button
                onClick={() => setCurrentStep(step)}
                className="w-full flex items-center justify-between p-6 text-left"
                disabled={!isCompleted && !isActive}
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                        isActive ? "bg-[#5B4D9D]/10 text-[#5B4D9D]" : (isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400")
                    )}>
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                        <h3 className={cn("font-bold text-sm", isActive ? "text-gray-900 dark:text-white" : "text-gray-500")}>{title}</h3>
                        {isCompleted && summary && <p className="text-xs text-gray-400 font-medium">{summary}</p>}
                    </div>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isActive ? "rotate-180" : "")} />
            </button>

            <AnimatePresence>
                {isActive && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-6 pb-8 pt-0">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function Input({ label, textarea, ...props }: any) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 ml-1">{label}</label>
            {textarea ? (
                <textarea
                    className="w-full p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5B4D9D]/50 transition-all resize-none h-24"
                    {...props}
                />
            ) : (
                <input
                    className="w-full p-4 bg-gray-50 dark:bg-black border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5B4D9D]/50 transition-all"
                    {...props}
                />
            )}
        </div>
    );
}
