import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    // Default states
    const [location, setLocationState] = useState<UserLocation | null>(null);
    const [settings, setSettings] = useState<UserSettings>({
        mazhab: 0,
        method: 3, // Muslim World League as default
        language: 'en',
        ramadanMode: false,
    });
    const [profile, setProfile] = useState<UserProfile>({});
    const [healthStats, setHealthStats] = useState<HealthStats>({
        calories: 0,
        grade: '--',
        lastScanDate: '',
        waterIntake: 0,
        steps: 0,
        dailyGoalCalories: 2000
    });
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [isLoading, setIsLoading] = useState(true);

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedLocation = localStorage.getItem('userLocation');
        const savedSettings = localStorage.getItem('userSettings');
        const savedProfile = localStorage.getItem('userProfile');
        const savedHealthStats = localStorage.getItem('userHealthStats');
        const savedTheme = localStorage.getItem('theme');

        if (savedLocation) setLocationState(JSON.parse(savedLocation));
        if (savedSettings) setSettings(JSON.parse(savedSettings));
        if (savedProfile) setProfile(JSON.parse(savedProfile));
        if (savedHealthStats) setHealthStats(JSON.parse(savedHealthStats));
        if (savedTheme) setTheme(savedTheme as 'dark' | 'light');

        setIsLoading(false);
    }, []);

    // Save to LocalStorage effects
    useEffect(() => {
        if (location) localStorage.setItem('userLocation', JSON.stringify(location));
    }, [location]);

    useEffect(() => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
    }, [settings]);

    useEffect(() => {
        localStorage.setItem('userProfile', JSON.stringify(profile));
    }, [profile]);

    useEffect(() => {
        localStorage.setItem('userHealthStats', JSON.stringify(healthStats));
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
