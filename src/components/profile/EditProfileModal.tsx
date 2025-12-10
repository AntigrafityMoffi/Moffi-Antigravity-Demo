"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useAuth, User } from "@/context/AuthContext";

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
    const { user, updateProfile } = useAuth();

    // Local state for form fields
    const [formData, setFormData] = useState({
        name: user?.username || "",
        username: user?.username || "", // Note: Schema uses 'username' for display name in some places
        bio: user?.bio || ""
    });

    // Update form when user changes (e.g. open modal)
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.username,
                username: user.username,
                bio: user.bio || ""
            });
        }
    }, [user, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            updateProfile({
                username: formData.username,
                bio: formData.bio
            });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 font-poppins">Profili Düzenle</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">Ad Soyad</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none text-gray-900"
                        />
                    </div>

                    {/* Username */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">Kullanıcı Adı</label>
                        <input
                            value={formData.username}
                            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none text-gray-900"
                        />
                    </div>

                    {/* Bio */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 ml-1">Biyografi</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                            rows={4}
                            className="w-full px-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-moffi-purple-dark outline-none resize-none text-gray-900"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-moffi-purple-dark text-white rounded-xl font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                        >
                            <Check className="w-4 h-4" />
                            Kaydet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
