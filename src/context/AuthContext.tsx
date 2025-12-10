"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = 'user' | 'admin';

export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    avatar?: string;
    bio?: string;
    joinedAt: string;
    stats: {
        posts: number;
        followers: number;
        following: number;
    }
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
    getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load from storage
    useEffect(() => {
        const storedUser = localStorage.getItem('moffipet_current_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session", e);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const usersStore = JSON.parse(localStorage.getItem('moffipet_users') || '[]');
        const foundUser = usersStore.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
            // Check for admin override credentials (hardcoded for demo security)
            const role: UserRole = (email === 'admin@moffipet.com') ? 'admin' : 'user';

            const sessionUser: User = {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email,
                role: role,
                avatar: foundUser.avatar,
                bio: foundUser.bio,
                joinedAt: foundUser.joinedAt,
                stats: foundUser.stats
            };

            setUser(sessionUser);
            localStorage.setItem('moffipet_current_user', JSON.stringify(sessionUser));
            return { success: true };
        }

        return { success: false, error: "E-posta veya şifre hatalı." };
    };

    const signup = async (name: string, email: string, password: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const usersStore = JSON.parse(localStorage.getItem('moffipet_users') || '[]');

        if (usersStore.some((u: any) => u.email === email)) {
            return { success: false, error: "Bu e-posta adresi zaten kayıtlı." };
        }

        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            username: name,
            email,
            password, // In a real app, this MUST be hashed
            role: (email === 'admin@moffipet.com') ? 'admin' : 'user',
            avatar: undefined,
            bio: "Merhaba! Ben MoffiPet dünyasına yeni katıldım.",
            joinedAt: new Date().toISOString(),
            stats: { posts: 0, followers: 0, following: 0 }
        };

        const updatedUsers = [...usersStore, newUser];
        localStorage.setItem('moffipet_users', JSON.stringify(updatedUsers));

        // Auto login after signup
        const sessionUser: User = {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            role: newUser.role as UserRole,
            avatar: newUser.avatar,
            bio: newUser.bio,
            joinedAt: newUser.joinedAt,
            stats: newUser.stats
        };

        setUser(sessionUser);
        localStorage.setItem('moffipet_current_user', JSON.stringify(sessionUser));

        return { success: true };
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('moffipet_current_user');
    };

    const updateProfile = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('moffipet_current_user', JSON.stringify(updatedUser));

        // Also update in main db
        const usersStore = JSON.parse(localStorage.getItem('moffipet_users') || '[]');
        const updatedStore = usersStore.map((u: any) => u.id === user.id ? { ...u, ...data } : u);
        localStorage.setItem('moffipet_users', JSON.stringify(updatedStore));
    };

    const getAllUsers = (): User[] => {
        if (typeof window === 'undefined') return [];
        return JSON.parse(localStorage.getItem('moffipet_users') || '[]');
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, getAllUsers }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
