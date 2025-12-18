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
    forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
    logout: () => void;
    updateProfile: (data: Partial<User>) => void;
    getAllUsers: () => User[];
    deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial load from storage & Admin Seeding
    useEffect(() => {
        const adminEmail = 'moffidestek@gmail.com';
        const adminPass = 'admin';

        // 1. Get current data
        let usersStore = JSON.parse(localStorage.getItem('moffipet_users') || '[]');

        // 2. Check if admin exists
        const adminIndex = usersStore.findIndex((u: any) => u.email.toLowerCase() === adminEmail);

        if (adminIndex >= 0) {
            // User exists - FORCE UPDATE ROLE to admin if not already
            if (usersStore[adminIndex].role !== 'admin' || usersStore[adminIndex].password !== adminPass) {
                console.log("Admin account found but needed updates. Fixing...");
                usersStore[adminIndex].role = 'admin';
                usersStore[adminIndex].password = adminPass; // Ensure password is correct
                localStorage.setItem('moffipet_users', JSON.stringify(usersStore));
            } else {
                console.log("Admin account verified.");
            }
        } else {
            // User does not exist - SEED IT
            console.warn("Admin account missing! Seeding now...");
            const adminUser = {
                id: 'admin_master_v2',
                username: 'Moffi Destek',
                email: adminEmail,
                password: adminPass,
                role: 'admin',
                avatar: undefined,
                bio: "Official Support & Admin",
                joinedAt: new Date().toISOString(),
                stats: { posts: 999, followers: 999999, following: 0 }
            };
            usersStore = [...usersStore, adminUser];
            localStorage.setItem('moffipet_users', JSON.stringify(usersStore));
            console.log("Admin account seeded successfully.");
        }

        // 3. Load Session & FIX STALE DATA
        const storedUserStr = localStorage.getItem('moffipet_current_user');
        if (storedUserStr) {
            try {
                let sessionUser = JSON.parse(storedUserStr);

                // CRITICAL FIX: If this is the admin email, FORCE the role in the session too
                if (sessionUser.email.toLowerCase() === adminEmail && sessionUser.role !== 'admin') {
                    console.log("Fixing stale admin session role...");
                    sessionUser.role = 'admin';
                    localStorage.setItem('moffipet_current_user', JSON.stringify(sessionUser));
                }

                setUser(sessionUser);
            } catch (e) {
                console.error("Failed to parse user session", e);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));

        // --- GOD MODE FIX: FORCE ADMIN LOGIN ---
        // This bypasses any corrupted localStorage state.
        if (email.toLowerCase() === 'moffidestek@gmail.com' && password === 'admin') {
            console.log("God Mode: Forcefully logging in Admin.");

            // 1. Create the perfect admin object
            const adminUserStore = {
                id: 'admin_master_v2',
                username: 'Moffi Destek',
                email: 'moffidestek@gmail.com',
                password: 'admin',
                role: 'admin',
                avatar: undefined,
                bio: "Official Support & Admin",
                joinedAt: new Date().toISOString(),
                stats: { posts: 999, followers: 999999, following: 0 }
            };

            // 2. Ensure it exists in storage (Heal the storage if needed)
            const usersStore = JSON.parse(localStorage.getItem('moffipet_users') || '[]');
            const existingIndex = usersStore.findIndex((u: any) => u.email.toLowerCase() === email.toLowerCase());

            if (existingIndex >= 0) {
                usersStore[existingIndex] = adminUserStore; // Overwrite with correct data
            } else {
                usersStore.push(adminUserStore);
            }
            localStorage.setItem('moffipet_users', JSON.stringify(usersStore));

            // 3. Create Session
            const sessionUser: User = {
                id: adminUserStore.id,
                username: adminUserStore.username,
                email: adminUserStore.email,
                role: 'admin', // Explicitly typed as Admin
                avatar: adminUserStore.avatar,
                bio: adminUserStore.bio,
                joinedAt: adminUserStore.joinedAt,
                stats: adminUserStore.stats
            };

            setUser(sessionUser);
            localStorage.setItem('moffipet_current_user', JSON.stringify(sessionUser));
            return { success: true };
        }
        // ----------------------------------------

        const usersStore = JSON.parse(localStorage.getItem('moffipet_users') || '[]');
        // Case-insensitive email check
        let foundUser = usersStore.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (foundUser) {
            const role: UserRole = (email.toLowerCase() === 'moffidestek@gmail.com') ? 'admin' : (foundUser.role || 'user');

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
        await new Promise(resolve => setTimeout(resolve, 800));

        const usersStore = JSON.parse(localStorage.getItem('moffipet_users') || '[]');

        if (usersStore.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, error: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı dene." };
        }

        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            username: name,
            email,
            password,
            role: (email.toLowerCase() === 'moffidestek@gmail.com') ? 'admin' : 'user',
            avatar: undefined,
            bio: "Merhaba! Ben MoffiPet dünyasına yeni katıldım.",
            joinedAt: new Date().toISOString(),
            stats: { posts: 0, followers: 0, following: 0 }
        };

        const updatedUsers = [...usersStore, newUser];
        localStorage.setItem('moffipet_users', JSON.stringify(updatedUsers));

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

    const forgotPassword = async (email: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const usersStore = JSON.parse(localStorage.getItem('moffipet_users') || '[]');

        const exists = usersStore.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (exists) {
            // In a real app, send API request here.
            // For demo, we just simulate success.
            console.log(`[Email Service] Password reset code sent to ${email}: 123456`);
            return { success: true, message: "Doğrulama kodu gönderildi." };
        } else {
            // Security best practice: Don't reveal if user exists, but for UX in this specific demo we might want to guide them.
            // Sticking to generic message or guiding based on user preference.
            return { success: false, error: "Bu e-posta ile kayıtlı kullanıcı bulunamadı." };
        }
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

    const deleteUser = (id: string) => {
        const usersStore = JSON.parse(localStorage.getItem('moffipet_users') || '[]');
        const updatedStore = usersStore.filter((u: any) => u.id !== id);
        localStorage.setItem('moffipet_users', JSON.stringify(updatedStore));
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateProfile, getAllUsers, forgotPassword, deleteUser }}>
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
