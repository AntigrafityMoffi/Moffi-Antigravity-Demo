"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// --- TYPES ---
export interface Comment {
    id: string;
    userId: string;
    userName: string;
    text: string;
    timestamp: number;
}

export interface Post {
    id: string;
    userId: string;
    userName: string; // Denormalized for MVP
    userImg: string;
    image: string;
    desc: string;
    likes: number;
    isLiked: boolean; // Local state for current user
    comments: Comment[];
    location?: string;
    timestamp: number;
    category: 'dogs' | 'cats' | 'birds' | 'other';
}

export interface Story {
    id: string;
    userId: string;
    userName: string;
    userImg: string;
    img: string;
    isLive: boolean; // Has unseen story
    timestamp: number;
}

interface SocialContextType {
    posts: Post[];
    stories: Story[];
    addPost: (desc: string, image: string, location?: string, category?: string) => void;
    toggleLike: (postId: string) => void;
    addComment: (postId: string, text: string) => void;
    addStory: (image: string) => void;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

// --- MOCK INITIAL DATA ---
const INITIAL_POSTS: Post[] = [
    {
        id: '1',
        userId: 'moffi_official',
        userName: 'Moffi Official',
        userImg: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=100',
        image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=600',
        desc: 'Bugün parka gidiyoruz! Kimler geliyor? 🦴🌳 #MoffiRun',
        likes: 1240,
        isLiked: false,
        comments: [],
        location: 'Caddebostan Sahil',
        timestamp: Date.now() - 100000,
        category: 'dogs'
    },
    {
        id: '2',
        userId: 'luna_cat',
        userName: 'Luna The Cat',
        userImg: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=100',
        image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=600',
        desc: 'Pazar keyfi... 😴',
        likes: 856,
        isLiked: true,
        comments: [],
        location: 'Ev Modu',
        timestamp: Date.now() - 500000,
        category: 'cats'
    }
];

const INITIAL_STORIES: Story[] = [
    { id: 's1', userId: 'moffi', userName: 'Moffi', userImg: 'https://images.unsplash.com/photo-1517849845537-4d257902454a', img: 'https://images.unsplash.com/photo-1517849845537-4d257902454a', isLive: true, timestamp: Date.now() },
    { id: 's2', userId: 'max', userName: 'Max', userImg: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8', img: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8', isLive: true, timestamp: Date.now() },
];

export function SocialProvider({ children }: { children: React.ReactNode }) {
    const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
    const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);

    // Load from local storage on mount
    useEffect(() => {
        const savedPosts = localStorage.getItem('moffi_social_posts');
        if (savedPosts) {
            setPosts(JSON.parse(savedPosts));
        }
    }, []);

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('moffi_social_posts', JSON.stringify(posts));
    }, [posts]);

    const addPost = (desc: string, image: string, location?: string, category: string = 'dogs') => {
        const newPost: Post = {
            id: Date.now().toString(),
            userId: 'current_user', // In real app, get from AuthContext
            userName: 'Sen', // Get from AuthContext
            userImg: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=100', // Mock Current User Img
            image,
            desc,
            likes: 0,
            isLiked: false,
            comments: [],
            location,
            timestamp: Date.now(),
            category: category as any
        };
        setPosts(prev => [newPost, ...prev]);
    };

    const toggleLike = (postId: string) => {
        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return {
                    ...p,
                    likes: p.isLiked ? p.likes - 1 : p.likes + 1,
                    isLiked: !p.isLiked
                };
            }
            return p;
        }));
    };

    const addComment = (postId: string, text: string) => {
        const newComment: Comment = {
            id: Date.now().toString(),
            userId: 'current_user',
            userName: 'Sen',
            text,
            timestamp: Date.now()
        };

        setPosts(prev => prev.map(p => {
            if (p.id === postId) {
                return { ...p, comments: [...p.comments, newComment] };
            }
            return p;
        }));
    };

    const addStory = (image: string) => {
        const newStory: Story = {
            id: Date.now().toString(),
            userId: 'current_user',
            userName: 'Sen',
            userImg: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=100',
            img: image,
            isLive: true,
            timestamp: Date.now()
        };
        setStories(prev => [newStory, ...prev]);
    };

    return (
        <SocialContext.Provider value={{ posts, stories, addPost, toggleLike, addComment, addStory }}>
            {children}
        </SocialContext.Provider>
    );
}

export const useSocial = () => {
    const context = useContext(SocialContext);
    if (!context) throw new Error("useSocial must be used within a SocialProvider");
    return context;
};
