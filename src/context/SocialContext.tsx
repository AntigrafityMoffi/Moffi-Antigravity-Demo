"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// --- Types ---

export interface PointTransaction {
    id: number;
    amount: number;
    description: string;
    type: 'earn' | 'spend';
    date: Date;
    icon?: string; // e.g. "🦴", "☕"
}

export interface EconomyState {
    points: number;
    level: number;
    currentXP: number;
    nextLevelXP: number;
    history: PointTransaction[];
}

export interface Post {
    id: number;
    user: {
        name: string;
        avatar: string;
        location?: string;
    };
    content: {
        image: string; // URL or Data URI
        caption: string;
        hashtags: string[];
        likes: number;
        comments: number;
        type: 'image' | 'video';
    };
    isSponsored?: boolean;
    isLiked?: boolean;
    timestamp: Date;
}

export interface WalkSession {
    id: number;
    date: string;
    steps: number;
    distance: number; // km
    duration: number; // seconds
}

export interface Badge {
    id: string;
    name: string;
    icon: string;
    description: string;
    earnedDate: string;
}

export interface UserProfile {
    name: string;
    username: string;
    avatar: string;
    bio: string;
    stats: {
        posts: number;
        followers: string;
        following: string;
    };
    walks?: WalkSession[];
    badges?: Badge[];
    economy?: EconomyState; // NEW: Economy data
}

export interface ActiveWalkSession {
    startTime: number; // timestamp
    distance: number;
    points: number;
    isActive: boolean;
    lastLocation?: [number, number];
}

interface SocialContextType {
    currentUser: UserProfile;
    posts: Post[];
    economy: EconomyState;
    theme: 'light' | 'dark'; // NEW: Theme State
    toggleTheme: () => void; // NEW: Toggle Action
    updateProfileImage: (file: File) => void;
    createPost: (content: { image: File; caption: string; type: 'image' | 'video' }) => void;
    toggleLike: (postId: number) => void;
    updateUserInfo: (info: Partial<UserProfile>) => void;
    addWalkSession: (session: WalkSession) => void;
    addMoffiPoints: (amount: number, description: string) => void;
    logout: () => void;
    activeWalkSession: ActiveWalkSession | null; // NEW
    startWalk: () => void; // NEW
    updateWalk: (data: Partial<ActiveWalkSession>) => void; // NEW
    endWalk: () => void; // NEW
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_ECONOMY: EconomyState = {
    points: 1250,
    level: 3,
    currentXP: 450,
    nextLevelXP: 1000,
    history: [
        { id: 1, amount: 50, description: "Günlük Yürüyüş", type: "earn", date: new Date(), icon: "🦴" },
        { id: 2, amount: 200, description: "Espressolab İndirimi", type: "spend", date: new Date(Date.now() - 86400000), icon: "☕" }
    ]
};

const INITIAL_USER: UserProfile = {
    name: "Moffi The Golden 🐾",
    username: "moffi.golden",
    avatar: "",
    bio: "Herkese Merhaba! 🎾\n🦴 Obur bir Golden Retriever\n📍 İstanbul, Moda\n🏆 'En İyi Uyuyan' Ödülü Sahibi",
    stats: {
        posts: 142,
        followers: "12.5B",
        following: "340"
    },
    economy: INITIAL_ECONOMY
};

const INITIAL_POSTS: Post[] = [
    {
        id: 101,
        user: { name: "Leo The King", avatar: "", location: "Kadıköy, Moda" },
        content: { image: "🦁", caption: "Bugün parkta yeni arkadaşlar edindim! 🦴", hashtags: ["MoffiWalk", "GoldenRitriever"], likes: 1240, comments: 48, type: 'image' },
        timestamp: new Date()
    },
    {
        id: 102,
        user: { name: "Luna & Star", avatar: "", location: "Beşiktaş" },
        content: { image: "🏃‍♀️", caption: "Sabah koşusu tamamlandı. #SporcuPet", hashtags: ["MorningRun", "FitPet"], likes: 856, comments: 24, type: 'image' },
        isSponsored: true,
        timestamp: new Date()
    },
    {
        id: 103,
        user: { name: "Moffi Official", avatar: "", location: "İstanbul" },
        content: { image: "🎁", caption: "Yılbaşı çekilişi başladı! Katılmak için arkadaşını etiketle.", hashtags: ["Çekiliş", "MoffiYılbaşı"], likes: 5400, comments: 890, type: 'video' },
        timestamp: new Date()
    }
];

export function SocialProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [activeWalkSession, setActiveWalkSession] = useState<ActiveWalkSession | null>(null); // NEW

    // Initial load helper
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('moffi_user');
            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);
                if (!parsedUser.economy) parsedUser.economy = INITIAL_ECONOMY;
                setCurrentUser(prev => ({ ...prev, ...parsedUser }));
            }
            const savedPosts = localStorage.getItem('moffi_posts');
            if (savedPosts) {
                setPosts(JSON.parse(savedPosts));
            }
            // Load Theme
            const savedTheme = localStorage.getItem('moffi_theme') as 'light' | 'dark';
            if (savedTheme) {
                setTheme(savedTheme);
                document.documentElement.classList.toggle('dark', savedTheme === 'dark');
            }
            // Load Active Walk & Validate
            const savedWalk = localStorage.getItem('moffi_active_walk');
            if (savedWalk) {
                try {
                    const parsed = JSON.parse(savedWalk);
                    if (parsed && typeof parsed.distance === 'number' && typeof parsed.startTime === 'number') {
                        setActiveWalkSession(parsed);
                    } else {
                        // Corrupt data, clear it
                        localStorage.removeItem('moffi_active_walk');
                    }
                } catch (e) {
                    localStorage.removeItem('moffi_active_walk');
                }
            }
        } catch (error) {
            console.error("Storage Error:", error);
        }
    }, []);

    // Save Active Walk
    useEffect(() => {
        if (activeWalkSession) {
            localStorage.setItem('moffi_active_walk', JSON.stringify(activeWalkSession));
        } else {
            localStorage.removeItem('moffi_active_walk');
        }
    }, [activeWalkSession]);

    // ... (Existing effects) ...

    // --- Active Walk Methods ---
    const startWalk = () => {
        if (!activeWalkSession) {
            setActiveWalkSession({
                startTime: Date.now(),
                distance: 0,
                points: 0,
                isActive: true
            });
        }
    };

    const updateWalk = (data: Partial<ActiveWalkSession>) => {
        setActiveWalkSession(prev => prev ? { ...prev, ...data } : null);
    };

    const endWalk = () => {
        setActiveWalkSession(null);
    };


    // Effect to save user changes
    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('moffi_user', JSON.stringify(currentUser));
        }
    }, [currentUser]);

    // Theme toggle
    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('moffi_theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');
            return newTheme;
        });
    };

    // --- Actions ---

    const updateProfileImage = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setCurrentUser(prev => ({ ...prev, avatar: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const updateUserInfo = (info: Partial<UserProfile>) => {
        setCurrentUser(prev => ({ ...prev, ...info }));
    };

    const addMoffiPoints = (amount: number, description: string) => {
        setCurrentUser(prev => {
            const currentEco = prev.economy || INITIAL_ECONOMY;
            let newPoints = currentEco.points + amount;
            let newXP = currentEco.currentXP + amount;
            let newLevel = currentEco.level;
            let nextXP = currentEco.nextLevelXP;

            if (newXP >= nextXP) {
                newLevel += 1;
                newXP = newXP - nextXP;
                nextXP = Math.floor(nextXP * 1.5);
            }

            const newTransaction: PointTransaction = {
                id: Date.now(),
                amount,
                description,
                type: amount > 0 ? 'earn' : 'spend',
                date: new Date(),
                icon: amount > 0 ? '✨' : '💸'
            };

            return {
                ...prev,
                economy: {
                    points: newPoints,
                    level: newLevel,
                    currentXP: newXP,
                    nextLevelXP: nextXP,
                    history: [newTransaction, ...currentEco.history]
                }
            };
        });
    };

    const addWalkSession = (session: WalkSession) => {
        const earnedPoints = Math.floor(session.steps / 100) + 10;
        addMoffiPoints(earnedPoints, `Yürüyüş (${session.distance}km)`);

        setCurrentUser(prev => {
            const newWalks = [session, ...(prev.walks || [])];
            const newBadges = [...(prev.badges || [])];
            if (newWalks.length === 1 && !newBadges.find(b => b.id === 'first_walk')) {
                newBadges.push({ id: 'first_walk', name: 'ilk Adımlar', icon: '🐾', description: 'İlk yürüyüşünü tamamladın!', earnedDate: new Date().toISOString() });
            }
            return { ...prev, walks: newWalks, badges: newBadges };
        });
    };

    const createPost = ({ image, caption, type }: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const newPost: Post = {
                id: Date.now(),
                user: { name: currentUser.username, avatar: currentUser.avatar, location: "İstanbul" },
                content: { image: reader.result as string, caption, hashtags: [], likes: 0, comments: 0, type },
                timestamp: new Date()
            };
            setPosts(prev => [newPost, ...prev]);
            setCurrentUser(prev => ({ ...prev, stats: { ...prev.stats, posts: prev.stats.posts + 1 } }));
        };
        reader.readAsDataURL(image);
    };

    const toggleLike = (postId: number) => {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, content: { ...p.content, likes: p.isLiked ? p.content.likes - 1 : p.content.likes + 1 } } : p));
    };

    const logout = () => {
        localStorage.removeItem('moffi_user');
        localStorage.removeItem('moffi_posts');
        localStorage.removeItem('moffi_theme');
        setCurrentUser(INITIAL_USER);
        setPosts(INITIAL_POSTS);
    };

    return (
        <SocialContext.Provider value={{
            currentUser,
            posts,
            economy: currentUser.economy || INITIAL_ECONOMY,
            theme,
            toggleTheme,
            updateProfileImage,
            createPost,
            toggleLike,
            updateUserInfo,
            addWalkSession,
            addMoffiPoints,
            logout,
            activeWalkSession, // NEW
            startWalk, // NEW
            updateWalk, // NEW
            endWalk // NEW
        }}>
            {children}
        </SocialContext.Provider>
    );
}

export function useSocial() {
    const context = useContext(SocialContext);
    if (!context) throw new Error('useSocial must be used within Provider');
    return context;
}
