"use client";

import { ArrowLeft, Menu, Grid, MonitorPlay, UserSquare2, Home, ShoppingCart, PlusSquare, Heart, MessageCircle, MoreHorizontal, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { BottomNav } from "@/components/home/BottomNav";
import { useSocial } from "@/context/SocialContext";
import { useRef, useState } from "react";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { useAuth } from "@/context/AuthContext";

const highlights = [
    { id: 1, title: "Gezmeler", image: "/highlight1.png", color: "bg-orange-100" },
    { id: 2, title: "Oyunlar", image: "/highlight2.png", color: "bg-blue-100" },
    { id: 3, title: "Vitamin", image: "/highlight3.png", color: "bg-green-100" },
    { id: 4, title: "Arkadaş", image: "/highlight4.png", color: "bg-purple-100" },
    { id: 5, title: "Veteriner", image: "/highlight5.png", color: "bg-pink-100" },
];

export default function ProfilePage() {
    const { user, logout } = useAuth(); // Use AuthContext
    // Fallback for demo if context is empty (should not happen in prod)
    const currentUser = user || {
        username: "Ziyaretçi",
        name: "Ziyaretçi",
        role: "user",
        avatar: "",
        bio: "",
        stats: { posts: 0, followers: 0, following: 0 }
    };

    // Mock posts logic (kept for visual consistency until real backend)
    const { posts } = useSocial();
    const { updateProfile } = useAuth(); // Destructure updateProfile
    const fileInputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // New loading state

    const handleLogout = () => {
        logout(); // Clear context/storage
        router.push('/'); // Go to root (Onboarding flow)
    };

    // Filter posts for this user
    const myPosts = posts.filter(p => p.user.name === currentUser.username);

    const handleAvatarClick = () => {
        if (!isUploading) fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                setIsUploading(true);
                // Dynamically import to avoid server-side issues (though this is client component)
                const { compressImage } = await import('@/lib/imageUtils');
                const compressedBase64 = await compressImage(file, 600, 0.8); // 80% quality, max 600px

                updateProfile({ avatar: compressedBase64 });
                console.log("Avatar updated successfully");
            } catch (error) {
                console.error("Upload failed", error);
                alert("Resim yüklenirken bir hata oluştu.");
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <main className="min-h-screen bg-white pb-24 max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100 font-sans">

            {/* Modal */}
            <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />

            {/* Top Header */}
            <header className="sticky top-0 bg-white/95 backdrop-blur-sm z-30 px-4 h-14 flex items-center justify-between border-b border-gray-50">
                <div className="flex items-center gap-4">
                    {/* If back button needed: <ArrowLeft className="w-6 h-6" /> */}
                    <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1">
                        {currentUser.username}
                        <span className="w-2 h-2 rounded-full bg-red-500 mt-1" /> {/* Notification dot example */}
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <PlusSquare className="w-6 h-6 text-gray-800" />
                    <Menu className="w-6 h-6 text-gray-800" />
                </div>
            </header>

            {/* Identity Section */}
            <section className="px-4 pt-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                    {/* Avatar with Story Ring */}
                    <div className="relative cursor-pointer group" onClick={handleAvatarClick}>
                        <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                            <div className="w-full h-full rounded-full bg-white p-[2px]">
                                <div className="w-full h-full rounded-full bg-gray-100 relative overflow-hidden">
                                    {currentUser.avatar ? (
                                        <Image src={currentUser.avatar} alt="Profile" fill className="object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 bg-moffi-light flex items-center justify-center text-moffi-primary font-bold text-2xl">
                                            {currentUser.username.charAt(0)}
                                        </div>
                                    )}
                                    {/* Overlay hint */}
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isUploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        {isUploading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <span className="text-[10px] text-white font-bold">Düzenle</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full border-2 border-white">
                            <PlusSquare className="w-3 h-3" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Stats */}
                    <div className="flex-1 flex justify-around ml-4">
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-lg text-gray-900">{currentUser.stats.posts}</span>
                            <span className="text-xs text-gray-500">Gönderi</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-lg text-gray-900">{currentUser.stats.followers}</span>
                            <span className="text-xs text-gray-500">Takipçi</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="font-bold text-lg text-gray-900">{currentUser.stats.following}</span>
                            <span className="text-xs text-gray-500">Takip</span>
                        </div>
                    </div>
                </div>

                {/* Bio */}
                <div className="mb-4">
                    <h2 className="font-bold text-gray-900">{currentUser.username}</h2>
                    <p className="text-sm text-gray-900 whitespace-pre-line">
                        {currentUser.bio}
                    </p>
                    <a href="#" className="text-sm text-[#00376b] font-medium">moffi.net/shop</a>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mb-6">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditModalOpen(true)}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 text-sm font-semibold py-2 rounded-lg transition-colors"
                        >
                            Profili Düzenle
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                            <LogOut className="w-4 h-4" />
                            Çıkış Yap
                        </button>
                    </div>

                    {/* Admin Access Button */}
                    {currentUser.role === 'admin' && (
                        <button
                            onClick={() => router.push('/business/dashboard')}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold py-3 rounded-lg shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all flex items-center justify-center gap-2"
                        >
                            <MonitorPlay className="w-4 h-4" />
                            Admin Paneline Git
                        </button>
                    )}
                </div>
            </section>

            {/* Highlights */}
            <section className="border-b border-gray-100 pb-4 mb-2">
                <div className="flex gap-4 overflow-x-auto px-4 scrollbar-hide">
                    {highlights.map((highlight) => (
                        <div key={highlight.id} className="flex flex-col items-center gap-1 min-w-[64px]">
                            <div className={`w-16 h-16 rounded-full p-[2px] border border-gray-200`}>
                                <div className={`w-full h-full rounded-full ${highlight.color} flex items-center justify-center`}>
                                    {/* Icon or Image Placeholder */}
                                    <span className="text-[10px] opacity-50">High</span>
                                </div>
                            </div>
                            <span className="text-xs text-gray-900 truncate w-16 text-center">{highlight.title}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tabs */}
            <section>
                <div className="flex border-b border-gray-200">
                    <button className="flex-1 py-3 flex items-center justify-center border-b-2 border-gray-900 text-gray-900">
                        <Grid className="w-6 h-6" />
                    </button>
                    <button className="flex-1 py-3 flex items-center justify-center text-gray-400">
                        <MonitorPlay className="w-6 h-6" />
                    </button>
                    <button className="flex-1 py-3 flex items-center justify-center text-gray-400">
                        <UserSquare2 className="w-6 h-6" />
                    </button>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-3 gap-0.5 min-h-[200px]">
                    {myPosts.length > 0 ? (
                        myPosts.map((post) => (
                            <div key={post.id} className="relative aspect-square bg-gray-100 group cursor-pointer hover:opacity-90 overflow-hidden">
                                {post.content.image.startsWith('data:') ? (
                                    <Image src={post.content.image} alt="Post" fill className="object-cover" />
                                ) : (
                                    <div className={`absolute inset-0 bg-gray-100 flex items-center justify-center text-2xl`}>
                                        {post.content.image}
                                    </div>
                                )}

                                {post.content.type === 'video' && (
                                    <div className="absolute top-2 right-2 text-white drop-shadow-md z-10">
                                        <MonitorPlay className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-3 py-10 flex flex-col items-center justify-center text-gray-400">
                            <Grid className="w-10 h-10 mb-2 opacity-20" />
                            <span className="text-sm">Henüz gönderi yok</span>
                        </div>
                    )}
                </div>
            </section>

            <BottomNav active="profile" />

        </main>
    );
}
