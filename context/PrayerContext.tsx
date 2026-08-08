import * as React from 'react';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from './UserContext';

// Types
export interface PrayerTimings {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
    [key: string]: string;
}

export interface HijriDate {
    date: string;
    month: {
        number: number;
        en: string;
        ar: string;
    };
    year: string;
    day: string;
    holidays: string[];
}

export interface CalendarDay {
    date: {
        readable: string;
        timestamp: string;
        hijri: HijriDate;
        gregorian: {
            date: string;
            day: string;
            weekday: { en: string };
            month: { number: number; en: string };
            year: string;
        };
    };
    timings: PrayerTimings;
}

interface PrayerContextType {
    timings: PrayerTimings | null;
    hijriDate: HijriDate | null;
    calendarData: CalendarDay[] | null;
    nextPrayer: string | null;
    timeRemaining: string; // HH:MM:SS
    loading: boolean;
    error: string | null;
    qiblaDirection: number | null;
    refresh: () => void;
}

const PrayerContext = createContext<PrayerContextType | undefined>(undefined);

const CACHE_KEY = 'prayer_cache_v1';
const FETCH_TIMEOUT_MS = 12000;

interface PrayerCache {
    timings: PrayerTimings | null;
    hijriDate: HijriDate | null;
    calendarData: CalendarDay[] | null;
    qiblaDirection: number | null;
}

const loadCache = (): PrayerCache => {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return { timings: null, hijriDate: null, calendarData: null, qiblaDirection: null };
        return JSON.parse(raw);
    } catch {
        return { timings: null, hijriDate: null, calendarData: null, qiblaDirection: null };
    }
};

/**
 * Qibla direction computed locally (great-circle bearing to the Kaaba).
 * No network request needed — the page never waits on an API for this.
 */
const computeQibla = (lat: number, lng: number): number => {
    const toRad = (d: number) => (d * Math.PI) / 180;
    const toDeg = (r: number) => (r * 180) / Math.PI;
    const phi1 = toRad(lat);
    const phi2 = toRad(21.4225);
    const dLambda = toRad(39.8262 - lng);
    const y = Math.sin(dLambda);
    const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLambda);
    return (toDeg(Math.atan2(y, x)) + 360) % 360;
};

export const PrayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { location, settings } = useUser();

    // Seed state from the local cache so the page renders instantly,
    // even before (or without) a network response.
    const cached = loadCache();
    const [timings, setTimings] = useState<PrayerTimings | null>(cached.timings);
    const [hijriDate, setHijriDate] = useState<HijriDate | null>(cached.hijriDate);
    const [calendarData, setCalendarData] = useState<CalendarDay[] | null>(cached.calendarData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(cached.qiblaDirection);

    const fetchPrayerTimes = async () => {
        if (!location) return;

        // Qibla is computed locally — instant, offline-safe
        const qibla = computeQibla(location.lat, location.lng);
        setQiblaDirection(qibla);

        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

        try {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            const response = await fetch(
                `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${location.lat}&longitude=${location.lng}&method=${settings.method}`,
                { signal: controller.signal }
            );

            if (!response.ok) throw new Error('Failed to fetch prayer calendar');

            const data = await response.json();
            if (data.code === 200 && Array.isArray(data.data) && data.data.length > 0) {
                const todayIndex = Math.min(Math.max(date.getDate() - 1, 0), data.data.length - 1);
                const todayData = data.data[todayIndex];

                if (todayData) {
                    setTimings(todayData.timings);
                    setHijriDate(todayData.date.hijri);
                    setCalendarData(data.data);
                    try {
                        localStorage.setItem(CACHE_KEY, JSON.stringify({
                            timings: todayData.timings,
                            hijriDate: todayData.date.hijri,
                            calendarData: data.data,
                            qiblaDirection: qibla,
                        } as PrayerCache));
                    } catch {
                        // Cache full — ignore
                    }
                }
            } else {
                setError('Error parsing API response');
            }
        } catch (err: any) {
            if (err?.name === 'AbortError') {
                setError('Timed out — showing saved times');
            } else {
                setError(err instanceof Error ? err.message : 'Unknown error');
            }
        } finally {
            clearTimeout(timer);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrayerTimes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location?.lat, location?.lng, settings.method]);

    // Countdown Logic
    useEffect(() => {
        if (!timings) return;

        const interval = setInterval(() => {
            const now = new Date();
            const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

            let next = null;
            let minDiff = Infinity;

            for (const prayer of prayers) {
                const timeStr = (timings[prayer as keyof PrayerTimings] || '00:00').split(' ')[0];
                const [hours, minutes] = timeStr.split(':').map(Number);
                const prayerDate = new Date(now);
                prayerDate.setHours(hours || 0, minutes || 0, 0, 0);

                if (prayerDate > now) {
                    const diffMs = prayerDate.getTime() - now.getTime();
                    if (diffMs < minDiff) {
                        minDiff = diffMs;
                        next = prayer;
                    }
                }
            }

            if (!next) {
                next = 'Fajr';
                const timeStr = (timings['Fajr'] || '05:00').split(' ')[0];
                const [hours, minutes] = timeStr.split(':').map(Number);
                const prayerDate = new Date(now);
                prayerDate.setDate(prayerDate.getDate() + 1);
                prayerDate.setHours(hours || 0, minutes || 0, 0, 0);
                minDiff = prayerDate.getTime() - now.getTime();
            }

            const h = Math.floor(minDiff / (1000 * 60 * 60));
            const m = Math.floor((minDiff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((minDiff % (1000 * 60)) / 1000);

            setNextPrayer(next);
            setTimeRemaining(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        }, 1000);

        return () => clearInterval(interval);
    }, [timings]);

    return (
        <PrayerContext.Provider value={{ timings, hijriDate, calendarData, nextPrayer, timeRemaining, loading, error, qiblaDirection, refresh: fetchPrayerTimes }}>
            {children}
        </PrayerContext.Provider>
    );
};

export const usePrayer = () => {
    const context = useContext(PrayerContext);
    if (context === undefined) {
        throw new Error('usePrayer must be used within a PrayerProvider');
    }
    return context;
};
