import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Types
export interface UserLocation {
    lat: number;
    lng: number;
    city?: string;
    country?: string;
}

export interface UserSettings {
    mazhab: number; // 0: Shafi (Standard), 1: Hanafi
    method: number; // Calculation method ID (e.g., 2 for ISNA, 3 for MWL)
    language: 'en' | 'ar' | 'ru';
    ramadanMode: boolean;
}

export interface UserProfile {
    name?: string;
    height?: number; // cm
    weight?: number; // kg
    dob?: string;
    gender?: 'male' | 'female';
    allergies?: string[];
    diseases?: string[];
    medications?: string[];
    apiKey?: string;
    userId?: string;
    email?: string;
    avatar?: string; // Base64 string or URL
}

export interface HealthStats {
    calories: number;
    grade: string;
    lastScanDate: string;
    waterIntake: number;
    steps: number;
    dailyGoalCalories: number;
}

import { translations } from '../translations';

interface UserContextType {
    location: UserLocation | null;
    settings: UserSettings;
    theme: 'dark' | 'light';
    profile: UserProfile;
    healthStats: HealthStats;
    setLocation: (loc: UserLocation) => void;
    updateSettings: (newSettings: Partial<UserSettings>) => void;
    updateProfile: (newProfile: Partial<UserProfile>) => void;
    updateHealthStats: (newStats: Partial<HealthStats>) => void;
    toggleTheme: () => void;
    isLoading: boolean;
    t: (key: keyof typeof translations['en']) => string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Lazily initialize state from LocalStorage to avoid overwriting on first render
    const [location, setLocationState] = useState<UserLocation | null>(() => {
        const saved = localStorage.getItem('userLocation');
        return saved ? JSON.parse(saved) : null;
    });
    const [settings, setSettings] = useState<UserSettings>(() => {
        const saved = localStorage.getItem('userSettings');
        return saved ? JSON.parse(saved) : {
            mazhab: 0,
            method: 3, // Muslim World League as default
            language: 'en',
            ramadanMode: false,
        };
    });
    const [profile, setProfile] = useState<UserProfile>(() => {
        const saved = localStorage.getItem('userProfile');
        return saved ? JSON.parse(saved) : {};
    });
    const [healthStats, setHealthStats] = useState<HealthStats>(() => {
        const saved = localStorage.getItem('userHealthStats');
        return saved ? JSON.parse(saved) : {
            calories: 0,
            grade: '--',
            lastScanDate: '',
            waterIntake: 0,
            steps: 0,
            dailyGoalCalories: 2000
        };
    });
    const [theme, setTheme] = useState<'dark' | 'light'>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as 'dark' | 'light') || 'dark';
    });
    const [isLoading, setIsLoading] = useState(true);

    // Request Location on mount
    useEffect(() => {

        // Request Location Permission & Data
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    // Only update if we don't have a location or if it's different (optional, but good for now just to force update)
                    // For now, let's just update it.
                    // We need to reverse geocode to get city/country, but for now let's store lat/lng.
                    // If we have a saved location with city/country, we might want to keep that until we can reverse geocode.
                    // But the user specifically wants the *request* to happen.

                    setLocationState(prev => ({
                        ...prev, // Keep existing city/country if any
                        lat: latitude,
                        lng: longitude
                    }));
                },
                (error) => {
                    console.error("Location permission denied or error:", error);
                }
            );
        }

        setIsLoading(false);
    }, []);

    // Firebase Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userDoc = await getDoc(doc(db, 'users', user.uid));
                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        if (data.profile) setProfile(prev => ({ ...prev, ...data.profile }));
                        if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
                        if (data.healthStats) setHealthStats(prev => ({ ...prev, ...data.healthStats }));
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore", error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    // Save to LocalStorage and Firestore effects
    useEffect(() => {
        if (location) localStorage.setItem('userLocation', JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
        if (auth.currentUser) {
            setDoc(doc(db, 'users', auth.currentUser.uid), { settings }, { merge: true }).catch(console.error);
        }
    }, [settings]);

    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
        if (auth.currentUser) {
            setDoc(doc(db, 'users', auth.currentUser.uid), { profile }, { merge: true }).catch(console.error);
        }
    }, [profile]);

    useEffect(() => {
        localStorage.setItem('userHealthStats', JSON.stringify(healthStats));
        if (auth.currentUser) {
            setDoc(doc(db, 'users', auth.currentUser.uid), { healthStats }, { merge: true }).catch(console.error);
        }
    }, [healthStats]);

    useEffect(() => {
        localStorage.setItem('theme', theme);
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    // Actions
    const setLocation = (loc: UserLocation) => {
        setLocationState(loc);
    };

    const updateSettings = (newSettings: Partial<UserSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const updateProfile = (newProfile: Partial<UserProfile>) => {
        setProfile(prev => ({ ...prev, ...newProfile }));
    };

    const updateHealthStats = (newStats: Partial<HealthStats>) => {
        setHealthStats(prev => ({ ...prev, ...newStats }));
    };

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    const t = (key: keyof typeof translations['en']) => {
        const lang = settings.language || 'en';
        return translations[lang][key] || translations['en'][key] || key;
    };

    return (
        <UserContext.Provider value={{
            location,
            settings,
            theme,
            profile,
            healthStats,
            setLocation,
            updateSettings,
            updateProfile,
            updateHealthStats,
            toggleTheme,
            isLoading,
            t
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
