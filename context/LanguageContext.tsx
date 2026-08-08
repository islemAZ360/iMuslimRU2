import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations } from '../translations';

type Language = 'en' | 'ar' | 'ru';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: Direction;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

interface LanguageProviderProps {
    children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        let saved = localStorage.getItem('app-language');
        if (!saved) {
            const userSettingsStr = localStorage.getItem('userSettings');
            if (userSettingsStr) {
                try {
                    const userSettings = JSON.parse(userSettingsStr);
                    if (userSettings.language) saved = userSettings.language;
                } catch (e) {
                    console.error("Error parsing userSettings for language", e);
                }
            }
        }
        return (saved === 'en' || saved === 'ar' || saved === 'ru') ? saved as Language : 'en';
    });

    const [dir, setDir] = useState<Direction>(language === 'ar' ? 'rtl' : 'ltr');

    useEffect(() => {
        localStorage.setItem('app-language', language);
        const newDir = language === 'ar' ? 'rtl' : 'ltr';
        setDir(newDir);
        document.documentElement.dir = newDir;
        document.documentElement.lang = language;
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
    };

    const t = (key: string): string => {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k as keyof typeof value];
            } else {
                // Fallback to English if key missing
                let fallback: any = translations['en'];
                for (const fk of keys) {
                    if (fallback && typeof fallback === 'object' && fk in fallback) {
                        fallback = fallback[fk as keyof typeof fallback];
                    } else {
                        return key; // Return key if not found
                    }
                }
                return fallback as string || key;
            }
        }
        return value as string;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
};
