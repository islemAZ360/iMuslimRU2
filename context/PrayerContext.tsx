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

export const PrayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { location, settings } = useUser();
    const [timings, setTimings] = useState<PrayerTimings | null>(null);
    const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
    const [calendarData, setCalendarData] = useState<CalendarDay[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [nextPrayer, setNextPrayer] = useState<string | null>(null);
    const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
    const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);

    const fetchPrayerTimes = async () => {
        if (!location) return;

        setLoading(true);
        setError(null);
        try {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            // Fetch Calendar for the whole month
            const response = await fetch(
                `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${location.lat}&longitude=${location.lng}&method=${settings.method}`
            );

            if (!response.ok) throw new Error('Failed to fetch prayer calendar');

            const data = await response.json();
            if (data.code === 200) {
                const days: CalendarDay[] = data.data;
                setCalendarData(days);

                // Find today's data
                // The API returns days sorted 0..last
                // Index = date.getDate() - 1 usually, but safer to match date string if needed.
                // Or just use today's index
                const todayIndex = date.getDate() - 1;
                const todayData = days[todayIndex];

                if (todayData) {
                    setTimings(todayData.timings);
                    setHijriDate(todayData.date.hijri);
                }
            } else {
                setError('Error parsing API response');
            }

            // Fetch Qibla
            const qiblaRes = await fetch(`https://api.aladhan.com/v1/qibla/${location.lat}/${location.lng}`);
            const qiblaData = await qiblaRes.json();
            if (qiblaData.code === 200) {
                setQiblaDirection(qiblaData.data.direction);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrayerTimes();
    }, [location, settings.method]);

    // Countdown Logic
    useEffect(() => {
        if (!timings) return;

        const interval = setInterval(() => {
            const now = new Date();
            const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

            let next = null;
            let minDiff = Infinity;

            for (const prayer of prayers) {
                // Parse time logic - same as before
                const timeStr = timings[prayer as keyof PrayerTimings].split(' ')[0]; // Handle "04:12 (EEST)" format if present
                const [hours, minutes] = timeStr.split(':').map(Number);
                const prayerDate = new Date(now);
                prayerDate.setHours(hours, minutes, 0, 0);

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
                // Handle tomorrow logic... simplistic for now, assumes same time tomorrow
                const timeStr = timings['Fajr'].split(' ')[0];
                const [hours, minutes] = timeStr.split(':').map(Number);
                const prayerDate = new Date(now);
                prayerDate.setDate(prayerDate.getDate() + 1);
                prayerDate.setHours(hours, minutes, 0, 0);
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
