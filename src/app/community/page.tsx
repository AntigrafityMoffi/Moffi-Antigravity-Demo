"use client";

import { BottomNav } from "@/components/home/BottomNav";
import { SocialPostCard } from "@/components/community/SocialPostCard";
import { Bell, Search, Coins, X, Image as ImageIcon } from "lucide-react";
import { useSocial } from "@/context/SocialContext";
import { useState, useRef } from "react";
import Image from "next/image";

export default function CommunityPage() {
    const { posts, createPost } = useSocial();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newPostCaption, setNewPostCaption] = useState("");
    const [newPostImage, setNewPostImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewPostImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePostSubmit = () => {
        if (newPostImage && newPostCaption) {
            createPost({ image: newPostImage, caption: newPostCaption, type: 'image' });
            // Reset
            setNewPostCaption("");
            setNewPostImage(null);
            setPreviewUrl(null);
            setIsCreateModalOpen(false);
        }
    };
    return (
        <main className="min-h-screen bg-[#F8F9FA] pb-24 max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-gray-100 font-sans">

            {/* Top Header */}
            <header className="sticky top-0 bg-white/80 backdrop-blur-md z-30 px-4 py-3 flex items-center justify-between border-b border-gray-100">
                <div className="flex items-center gap-4">
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">Moffi<span className="text-moffi-primary">Social</span></h1>
                </div>

                <div className="flex items-center gap-3">
                    {/* Points Badge */}
                    <div className="bg-yellow-50 px-3 py-1.5 rounded-full flex items-center gap-2 border border-yellow-100">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="text-xs font-bold text-yellow-700">1,250</span>
                    </div>

                    <button className="relative">
                        <Bell className="w-6 h-6 text-gray-600" />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex items-center border-b border-gray-100 bg-white sticky top-[53px] z-20">
                <button className="flex-1 py-3 text-sm font-bold text-gray-900 border-b-2 border-moffi-primary">
                    Keşfet
                </button>
                <button className="flex-1 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">
                    Takipçiler
                </button>
            </div>

            {/* Feed Content */}
            <div className="px-4 pt-4">
                {/* Story/Status Bar - Quick Access */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide mb-2">
                    <button onClick={() => setIsCreateModalOpen(true)} className="flex flex-col items-center gap-1 min-w-[70px]">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-moffi-primary to-teal-400 p-[3px] shadow-sm">
                            <div className="w-full h-full rounded-full bg-white flex items-center justify-center border-2 border-white relative">
                                <span className="text-2xl font-light text-moffi-primary">+</span>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">Ekle</span>
                    </button>
                    {/* Mock Stories */}
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="flex flex-col items-center gap-1 min-w-[70px]">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-pink-500 to-orange-500 p-[2px]">
                                <div className="w-full h-full rounded-full bg-gray-100 border-2 border-white" />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Pet {i}</span>
                        </div>
                    ))}
                </div>

                {/* Posts Feed */}
                {posts.map(post => (
                    <SocialPostCard
                        key={post.id}
                        user={post.user}
                        content={post.content}
                        isSponsored={post.isSponsored}
                    />
                ))}
            </div>

            <BottomNav active="community" />

            {/* Create Post Modal Overlay */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center">
                    <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Yeni Gönderi</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="p-2 bg-gray-100 rounded-full">
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Image Preview / Upload */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden"
                            >
                                {previewUrl ? (
                                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <>
                                        <ImageIcon className="w-10 h-10 text-gray-300 mb-2" />
                                        <span className="text-sm font-medium text-gray-400">Fotoğraf Seç</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageSelect}
                                />
                            </div>

                            {/* Caption Input */}
                            <textarea
                                className="w-full p-3 bg-gray-50 rounded-xl text-sm border-none focus:ring-2 focus:ring-moffi-primary outline-none resize-none"
                                placeholder="Moffi ile bugün neler yaptın?"
                                rows={3}
                                value={newPostCaption}
                                onChange={(e) => setNewPostCaption(e.target.value)}
                            />

                            {/* Submit Button */}
                            <button
                                onClick={handlePostSubmit}
                                disabled={!newPostImage || !newPostCaption}
                                className="w-full bg-moffi-primary text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
                            >
                                Paylaş (+10 Puan)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
