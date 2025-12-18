"use client";

import { useState } from "react";
import {
    Heart, MessageCircle, Share2,
    MoreHorizontal, Search, Bell,
    Zap, Camera, Play, Plus, MapPin,
    Sparkles, Music, Bookmark, SlidersHorizontal
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useSocial, Post } from "@/context/SocialContext";
import { BottomNav } from "@/components/home/BottomNav";
import CreatePostModal from "@/components/community/CreatePostModal";
import { cn } from "@/lib/utils";

// --- CATEGORIES ---
const CATEGORIES = [
    { id: 'all', label: 'Tümü', icon: Zap },
    { id: 'dogs', label: 'Köpekler', icon: Sparkles },
    { id: 'cats', label: 'Kediler', icon: Heart },
    { id: 'birds', label: 'Kuşlar', icon: Music },
];

export default function CommunityPage() {
    const { posts, stories, addPost } = useSocial();
    const [activeCategory, setActiveCategory] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Header Animation
    const { scrollY } = useScroll();
    const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
    const headerY = useTransform(scrollY, [0, 50], [-20, 0]);

    // Filter Posts
    const filteredPosts = activeCategory === 'all'
        ? posts
        : posts.filter(p => p.category === activeCategory);

    // Create Handler
    const handleCreatePost = (desc: string, img: string, location: string) => {
        addPost(desc, img, location, 'dogs'); // Default to dogs for MVP or let user choose
    };

    return (
        <div className="min-h-screen bg-black text-white pb-32 overflow-x-hidden">

            {/* --- DYNAMIC HEADER --- */}
            <motion.header
                style={{ opacity: headerOpacity, y: headerY }}
                className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex justify-between items-center"
            >
                <span className="font-black text-xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Moffi Social</span>
                <div className="flex gap-4">
                    <Search className="w-6 h-6 text-white" />
                    <Bell className="w-6 h-6 text-white" />
                </div>
            </motion.header>

            {/* --- TOP BAR (Static) --- */}
            <header className="pt-6 px-6 flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-black bg-gradient-to-tr from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                        Topluluk
                    </h1>
                    <p className="text-gray-400 text-xs font-medium">Moffi dünyasında bugün neler oluyor?</p>
                </div>
                <div className="flex gap-3">
                    <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors">
                        <Search className="w-5 h-5 text-gray-300" />
                    </button>
                    <button onClick={() => setIsCreateModalOpen(true)} className="w-10 h-10 rounded-full bg-[#5B4D9D] flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Plus className="w-5 h-5 text-white" />
                    </button>
                </div>
            </header>

            {/* --- STORIES COMPONENT (Real Data) --- */}
            <section className="pl-6 mb-8 overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex gap-4 w-max pr-6">
                    {/* Create Story Button */}
                    <div className="flex flex-col items-center gap-2 group cursor-pointer" onClick={() => alert("Story ekleme yakında!")}>
                        <div className="w-[4.5rem] h-[4.5rem] rounded-full p-[3px] border-2 border-dashed border-gray-600 relative">
                            <div className="w-full h-full rounded-full bg-gray-900 border-2 border-black flex items-center justify-center overflow-hidden">
                                <img src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=200" className="object-cover w-full h-full opacity-50" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Plus className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                        <span className="text-[10px] font-medium text-gray-300">Hikayen</span>
                    </div>

                    {stories.map((story) => (
                        <div key={story.id} className="flex flex-col items-center gap-2 group cursor-pointer">
                            <div className={cn(
                                "w-[4.5rem] h-[4.5rem] rounded-full p-[3px] relative transition-transform group-hover:scale-105",
                                story.isLive
                                    ? "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-500 animate-spin-slow"
                                    : "bg-gray-700"
                            )}>
                                <div className="w-full h-full rounded-full border-2 border-black overflow-hidden relative">
                                    <img src={story.userImg} className="w-full h-full object-cover" />
                                </div>
                            </div>
                            <span className="text-[10px] font-medium text-gray-300 group-hover:text-white transition-colors">{story.userName}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- CATEGORY PILLS --- */}
            <section className="px-6 mb-6 flex gap-3 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={cn(
                            "px-5 py-2.5 rounded-[2rem] text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap",
                            activeCategory === cat.id
                                ? "bg-white text-black shadow-lg shadow-white/10 scale-105"
                                : "bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10"
                        )}
                    >
                        {activeCategory === cat.id && <cat.icon className="w-3.5 h-3.5" />}
                        {cat.label}
                    </button>
                ))}
            </section>

            {/* --- MASONRY FEED (Real Data) --- */}
            <section className="px-4">
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        Bu kategoride henüz gönderi yok. <br /> İlk sen paylaş! 🚀
                    </div>
                ) : (
                    <div className="columns-2 gap-4 space-y-4">
                        {filteredPosts.map((post) => (
                            <PostCard key={post.id} data={post} />
                        ))}
                    </div>
                )}
            </section>

            {/* CREATE POST FAB */}
            <motion.button
                onClick={() => setIsCreateModalOpen(true)}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-tr from-[#5B4D9D] to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-purple-500/40 z-40 border border-white/20"
            >
                <Plus className="w-7 h-7 text-white" />
            </motion.button>

            {/* Create Modal */}
            <CreatePostModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreatePost}
            />

            <BottomNav active="community" />
        </div>
    );
}

// --- SUB COMPONENTS ---

function PostCard({ data }: { data: Post }) {
    const { toggleLike } = useSocial();

    // Double tap Animation vars
    const [heartVisible, setHeartVisible] = useState(false);

    const handleDoubleTap = () => {
        if (!data.isLiked) toggleLike(data.id);
        setHeartVisible(true);
        setTimeout(() => setHeartVisible(false), 800);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="break-inside-avoid relative rounded-[1.5rem] overflow-hidden bg-gray-900 border border-white/5 mb-4 group"
        >
            {/* Image & Overlay */}
            <div className="relative" onDoubleClick={handleDoubleTap}>
                <img src={data.image} className="w-full object-cover min-h-[150px]" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                {/* Double Tap Heart */}
                <AnimatePresence>
                    {heartVisible && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1, rotate: [0, -10, 10, 0] }}
                            exit={{ scale: 3, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
                        >
                            <Heart className="w-20 h-20 text-white fill-white shadow-xl" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Top Location Tag */}
                {data.location && (
                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-white/80" />
                        <span className="text-[9px] font-bold text-white/90">{data.location}</span>
                    </div>
                )}
            </div>

            {/* Content Bottom */}
            <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <img src={data.userImg} className="w-6 h-6 rounded-full border border-white/20 object-cover" />
                        <span className="text-xs font-bold text-white max-w-[80px] truncate">{data.userName}</span>
                    </div>
                    <button onClick={() => toggleLike(data.id)} className="transition-transform active:scale-75">
                        <Heart className={cn("w-5 h-5 transition-colors", data.isLiked ? "text-red-500 fill-red-500" : "text-white")} />
                    </button>
                </div>

                <p className="text-[11px] text-gray-300 leading-tight mb-3 line-clamp-2">
                    {data.desc}
                </p>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{data.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{data.comments.length}</span>
                    </div>
                    <div className="ml-auto">
                        <Share2 className="w-3 h-3" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
