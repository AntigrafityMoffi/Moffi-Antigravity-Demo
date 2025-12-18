"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Dog, Mail, Apple, PawPrint, Eye, EyeOff, ChevronRight, Lock, User, AtSign, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
type AuthView = 'landing' | 'login' | 'signup' | 'reset';

interface AuthProps {
    onComplete: () => void;
    currentView: AuthView;
    setView: (view: AuthView) => void;
}

// --- Auth Landing Component ---
export function AuthLanding({ setView }: { setView: (v: AuthView) => void }) {
    return (
        <div className="flex flex-col h-full p-8 pt-12 items-center bg-white">
            {/* Logo */}
            <div className="flex items-center gap-1 mb-8">
                <PawPrint className="w-8 h-8 text-moffi-purple-dark" />
                <h1 className="text-2xl font-black text-moffi-purple-dark tracking-tight font-poppins">MoffiPet+</h1>
            </div>

            {/* Illustration */}
            <div className="flex-1 w-full flex items-center justify-center relative my-4">
                <div className="w-64 h-64 bg-orange-50 rounded-full flex items-center justify-center relative">
                    <span className="text-6xl animate-bounce delay-100">🐶</span>
                    <span className="text-6xl absolute top-0 right-4 animate-bounce delay-300">🐱</span>
                    <span className="text-4xl absolute bottom-8 left-4 animate-bounce delay-500">🐦</span>
                </div>
            </div>

            {/* Text */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">Moffi ailesine hoş geldin!</h2>
                <p className="text-gray-500">Evcil dostunla daha eğlenceli bir dünya başlıyor.</p>
            </div>

            {/* Buttons */}
            <div className="w-full space-y-3 mb-6">
                <button className="w-full py-4 bg-white border border-gray-200 rounded-2xl flex items-center justify-center gap-2 font-bold text-gray-800 hover:bg-gray-50 transition-colors">
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                    Google ile Devam Et
                </button>
                <button className="w-full py-4 bg-black text-white rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-gray-800 transition-colors">
                    <Apple className="w-5 h-5" />
                    Apple ile Devam Et
                </button>
                <button
                    onClick={() => setView('signup')}
                    className="w-full py-4 bg-moffi-purple-dark text-white rounded-2xl font-bold hover:bg-opacity-90 transition-colors"
                >
                    E-posta ile Kaydol
                </button>
            </div>

            <div className="text-sm text-gray-500">
                Zaten hesabın var mı? <button onClick={() => setView('login')} className="text-moffi-purple-dark font-bold">Giriş Yap</button>
            </div>
        </div>
    );
}

// --- Login Form ---
export function LoginForm({ setView, onComplete }: { setView: (v: AuthView) => void, onComplete: () => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            onComplete();
        } else {
            setError(result.error || 'Giriş yapılamadı');
        }
    };

    return (
        <div className="flex flex-col h-full p-6 pt-8 bg-white">
            <button onClick={() => setView('landing')} className="mb-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Giriş Yap</h2>
            <p className="text-gray-500 mb-8">Tekrar hoş geldin!</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">E-posta</label>
                    <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="email"
                            placeholder="ornek@moffi.pet"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">Şifre</label>
                    <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="button" onClick={() => setView('reset')} className="text-sm font-medium text-moffi-purple-dark">Şifremi unuttum</button>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 flex items-center justify-center font-medium">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-moffi-purple-dark text-white rounded-2xl font-bold hover:bg-opacity-90 transition-colors mt-4 shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </button>
            </form>

            <div className="mt-auto text-center text-sm text-gray-500 pb-4">
                Henüz üye değil misin? <button onClick={() => setView('signup')} className="text-moffi-purple-dark font-bold">Kaydol</button>
            </div>
        </div>
    );
}

// --- Signup Form ---
export function SignupForm({ setView, onComplete }: { setView: (v: AuthView) => void, onComplete: () => void }) {
    const [showPassword, setShowPassword] = useState(false);
    const { signup } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor.');
            return;
        }

        if (formData.password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır.');
            return;
        }

        setLoading(true);
        const result = await signup(formData.name, formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            onComplete();
        } else {
            setError(result.error || 'Kayıt olunamadı.');
        }
    };

    return (
        <div className="flex flex-col h-full p-6 pt-8 bg-white overflow-y-auto">
            <button onClick={() => setView('landing')} className="mb-4 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-2 font-poppins">Hesap Oluştur</h2>
            <p className="text-gray-500 mb-6">Formu doldurarak aramıza katıl.</p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">Ad Soyad</label>
                    <div className="relative">
                        <User className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Adın Soyadın"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">E-posta</label>
                    <div className="relative">
                        <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="email"
                            placeholder="ornek@moffi.pet"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">Şifre</label>
                    <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="w-full pl-12 pr-12 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {/* Password Strength Bar */}
                    <div className="flex gap-1 mt-2 px-1">
                        <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                        <div className="h-1 flex-1 bg-green-500 rounded-full"></div>
                        <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                        <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                    </div>
                    <span className="text-xs text-green-500 ml-1">Güçlü Şifre</span>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-bold text-gray-700 ml-1">Şifre Tekrar</label>
                    <div className="relative">
                        <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 flex items-center justify-center font-medium">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-moffi-purple-dark text-white rounded-2xl font-bold hover:bg-opacity-90 transition-colors mt-6 shadow-xl shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Hesap Oluşturuluyor...' : 'Kaydol'}
                </button>

                <p className="text-xs text-center text-gray-400 mt-4 px-4 leading-relaxed">
                    Kaydolarak <a href="#" className="underline">Kullanım Şartları</a> ve <a href="#" className="underline">KVKK</a> metinlerini kabul etmiş olursun.
                </p>
            </form>
        </div>
    );
}

// --- Reset Password Form ---
export function ResetForm({ setView }: { setView: (v: AuthView) => void }) {
    const { forgotPassword } = useAuth();
    const [sent, setSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await forgotPassword(email);
        setLoading(false);

        if (result.success) {
            setSent(true);
            setTimeout(() => setView('login'), 5000);
        } else {
            setError(result.error || 'Bir hata oluştu.');
        }
    };

    return (
        <div className="flex flex-col h-full p-6 pt-8 bg-white">
            <button onClick={() => setView('login')} className="mb-6 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2 font-poppins">Şifre Sıfırla</h2>
            <p className="text-gray-500 mb-8">E-posta adresine sıfırlama bağlantısı göndereceğiz.</p>

            {!sent ? (
                <form onSubmit={handleReset} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">E-posta</label>
                        <div className="relative">
                            <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                placeholder="ornek@moffi.pet"
                                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl border border-red-100 font-medium">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-moffi-purple-dark text-white rounded-2xl font-bold hover:bg-opacity-90 transition-colors shadow-xl shadow-indigo-100 disabled:opacity-50"
                    >
                        {loading ? 'Gönderiliyor...' : 'Bağlantıyı Gönder'}
                    </button>
                </form>
            ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-green-50 rounded-3xl animate-in fade-in zoom-in">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-green-800">Gönderildi!</h3>
                    <p className="text-green-600 text-sm">Lütfen e-posta kutunu kontrol et.</p>
                </div>
            )}
        </div>
    );
}
