import * as React from 'react';
import { useState, useEffect } from 'react';
import { usePrayer } from '../context/PrayerContext';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { athkarData } from '../data/athkarData';

const Home: React.FC = () => {
    const { timings, nextPrayer, timeRemaining, hijriDate } = usePrayer();
    const { location, healthStats } = useUser();
    const { t, language } = useLanguage();
    const navigate = useNavigate();
    const today = new Date().toISOString().split('T')[0];

    // Dhikr category based on time
    const [activeCategory, setActiveCategory] = useState<string>('Istighfar');

    // Track stats for the ritual tasks
    const [stats, setStats] = useState<Record<string, number>>(() => {
        const saved = localStorage.getItem('dhikr_stats');
        return saved ? JSON.parse(saved) : {};
    });

    const [dailyTotal, setDailyTotal] = useState(() => {
        const saved = localStorage.getItem(`dhikr_daily_${today}`);
        return saved ? parseInt(saved, 10) : 0;
    });

    useEffect(() => {
        const checkDhikr = () => {
            const saved = localStorage.getItem(`dhikr_daily_${today}`);
            if (saved) setDailyTotal(parseInt(saved, 10));
        };
        window.addEventListener('focus', checkDhikr);
        return () => window.removeEventListener('focus', checkDhikr);
    }, [today]);

    useEffect(() => {
        if (timings && timings.Fajr && timings.Maghrib) {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();

            const [fajrH, fajrM] = timings.Fajr.split(':').map(Number);
            const fajrTime = fajrH * 60 + fajrM;

            const [asrH, asrM] = timings.Asr.split(':').map(Number);
            const asrTime = asrH * 60 + asrM;

            const [maghribH, maghribM] = timings.Maghrib.split(':').map(Number);
            const maghribTime = maghribH * 60 + maghribM;

            if (currentTime >= fajrTime && currentTime < asrTime) setActiveCategory('Morning');
            else if (currentTime >= asrTime && currentTime < maghribTime + 60) setActiveCategory('Evening');
            else setActiveCategory('Istighfar');
        } else {
            const hour = new Date().getHours();
            if (hour >= 4 && hour < 12) setActiveCategory('Morning');
            else if (hour >= 15 && hour < 20) setActiveCategory('Evening');
            else setActiveCategory('Istighfar');
        }
    }, [timings]);

    // Helper to format 24h to 12h or 24h based on locale
    const formatTime = (time: string) => {
        if (!time || typeof time !== 'string' || !time.includes(':')) return '--:--';
        try {
            const [h, m] = time.split(':');
            const date = new Date();
            date.setHours(parseInt(h), parseInt(m));

            if (isNaN(date.getTime())) return '--:--';

            return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : (language === 'ru' ? 'ru' : 'en-US'), {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
            }).format(date);
        } catch (error) {
            console.error("Error formatting time:", time, error);
            return '--:--';
        }
    };

    // Helper for Smart Greetings
    const getSmartContext = () => {
        if (!nextPrayer) return { greeting: t('greeting_morning'), tip: t('smart_tip_fajr') };

        switch (nextPrayer) {
            case 'Fajr': return { greeting: t('greeting_isha'), tip: t('smart_tip_isha') };
            case 'Sunrise': return { greeting: t('greeting_fajr'), tip: t('smart_tip_fajr') };
            case 'Dhuhr': return { greeting: t('greeting_sunrise'), tip: t('smart_tip_sunrise') };
            case 'Asr': return { greeting: t('greeting_dhuhr'), tip: t('smart_tip_dhuhr') };
            case 'Maghrib': return { greeting: t('greeting_asr'), tip: t('smart_tip_asr') };
            case 'Isha': return { greeting: t('greeting_maghrib'), tip: t('smart_tip_maghrib') };
            default: return { greeting: t('greeting_morning'), tip: t('smart_tip_sunrise') };
        }
    };

    const smartContext = getSmartContext();

    const prayerIcons: Record<string, string> = {
        'Fajr': 'wb_twilight',
        'Sunrise': 'wb_sunny',
        'Dhuhr': 'wb_sunny',
        'Asr': 'partly_cloudy_day',
        'Maghrib': 'wb_twilight',
        'Isha': 'dark_mode',
    };

    return (
        <div className="pb-32 pt-6 px-4 animate-in fade-in duration-500 min-h-screen relative overflow-x-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background Atmosphere */}
            <div className="fixed inset-0 max-w-md mx-auto pointer-events-none -z-10 bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/20 via-black to-black opacity-80"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-6 animate-in fade-in duration-500 relative z-10">
                <div>
                    <div className="flex items-center gap-1 text-gold-bright/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
                        <span className="material-symbols-outlined text-sm">location_on</span>
                        {location ? `${location.city || t('unknown_location')}, ${location.country || ''}` : t('location_not_set')}
                    </div>
                    {/* Smart Greeting */}
                    <h2 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-bright via-white to-gold-bright leading-tight">
                        {smartContext.greeting}
                    </h2>
                    <p className="text-[10px] text-emerald-400/80 font-bold mt-1 tracking-wider uppercase">
                        {smartContext.tip}
                    </p>
                </div>
                <div className="size-12 rounded-2xl bg-black/40 border border-gold/20 flex items-center justify-center text-gold-bright">
                    <span className="material-symbols-outlined text-xl">mosque</span>
                </div>
            </div>

            {/* Next Prayer Hero */}
            <div className="relative w-full rounded-3xl bg-gradient-to-br from-gold/15 via-black/60 to-black p-[1px] shadow-2xl mb-8 overflow-hidden animate-in zoom-in-95 duration-500 z-10">
                <div className="bg-emerald-black/80 backdrop-blur-md rounded-3xl p-6 relative overflow-hidden border border-white/5 min-h-[200px] flex flex-col justify-between">
                    <div className="flex justify-between items-start z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold-bright text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                                <div className="size-2 rounded-full bg-emerald-500"></div>
                                {t('upcoming')}
                            </div>
                            <h1 className="text-4xl font-serif font-bold text-white tracking-tight">
                                {nextPrayer ? t(nextPrayer.toLowerCase()) : t('loading')}
                            </h1>
                            <p className="text-gold-bright/80 text-sm font-bold tracking-[0.1em] mt-2 flex items-center gap-2">
                                {t('starts_in')}
                                <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded-md border border-white/10">{timeRemaining}</span>
                            </p>
                        </div>
                        {nextPrayer && (
                            <div className="size-14 rounded-2xl border border-gold/25 flex items-center justify-center bg-black/40">
                                <span className="material-symbols-outlined text-3xl text-gold-bright">{prayerIcons[nextPrayer]}</span>
                            </div>
                        )}
                    </div>

                    <div className="z-10 mt-auto pt-4 border-t border-white/10 flex justify-between items-end">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1 opacity-80">{t('adhan_time')}</p>
                            <p className="text-xl font-bold text-white tracking-wider font-mono">
                                {timings && nextPrayer ? formatTime(timings[nextPrayer as keyof typeof timings]) : '--:--'}
                            </p>
                        </div>
                        {hijriDate && (
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1 opacity-80">{t('islamic_date')}</p>
                                <p className="text-sm font-bold text-gold-bright bg-gold/5 px-3 py-1 rounded-full border border-gold/10">
                                    {hijriDate.day} {language === 'ar' ? hijriDate.month.ar : hijriDate.month.en} {hijriDate.year}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions Scrollable */}
            <div className="flex overflow-x-auto gap-4 mb-8 pb-4 scrollbar-hide px-2 snap-x">
                {[
                    { icon: 'qr_code_scanner', label: t('scan_food') || 'Scan', path: '/scan', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
                    { icon: 'cycle', label: t('tasbih') || 'Tasbih', path: '/athkar', color: 'bg-gold/10 text-gold-bright border-gold/30' },
                    { icon: 'explore', label: t('qibla_short') || 'Qibla', path: '/prayer', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
                    { icon: 'calendar_month', label: t('calendar') || 'Calendar', path: '/prayer', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
                    { icon: 'nights_stay', label: t('ramadan') || 'Ramadan', path: '/ramadan', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
                    { icon: 'monitoring', label: t('statistics') || 'Stats', path: '/stats', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
                    { icon: 'smart_toy', label: t('sheikh_ai') || 'AI Chat', path: '/aichat', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
                ].map((action, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(action.path)}
                        className={`flex flex-col items-center gap-2 group animate-in fade-in duration-500 min-w-[72px] snap-center`}
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <div className={`size-16 rounded-2xl border flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95 shadow-md ${action.color}`}>
                            <span className="material-symbols-outlined text-3xl">{action.icon}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center group-hover:text-white transition-colors">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Daily Inspiration Section */}
            <div className="space-y-4 mb-10 animate-in fade-in duration-500 delay-200">
                <div className="flex items-center gap-4 px-2">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold-bright/60">{t('daily_ayah')}</h3>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
                </div>

                <div className="relative rounded-2xl bg-emerald-black border border-white/10 p-6 overflow-hidden">
                    <p className="font-arabic text-xl sm:text-2xl text-white text-right mb-4 leading-[1.8]">
                        فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ
                    </p>
                    {language !== 'ar' && (
                        <p className="text-sm text-gray-300 italic font-serif mb-4 leading-relaxed text-center">
                            "So remember Me; I will remember you. And be grateful to Me and do not deny Me."
                        </p>
                    )}
                    <div className="flex justify-between items-center border-t border-white/10 pt-4">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gold-bright/60 uppercase tracking-[0.4em]">
                            <span className="material-symbols-outlined text-sm">bookmark</span>
                            Al-Baqarah 2:152
                        </div>
                        <div className="flex gap-3">
                            <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-gold-bright hover:bg-white/10 transition-all">
                                <span className="material-symbols-outlined text-lg">share</span>
                            </button>
                            <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-gold-bright hover:bg-white/10 transition-all">
                                <span className="material-symbols-outlined text-lg">content_copy</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Dhikr Rituals - Time Sensitive */}
            <div className="space-y-5 mb-10 animate-in fade-in duration-500 delay-300">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-9 bg-gradient-to-b from-gold-bright to-gold rounded-full"></div>
                        <div>
                            <h3 className="text-2xl font-arabic text-gold-bright tracking-wide">{t('daily_ritual') || 'الورد اليومي'}</h3>
                            <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-[0.4em]">{t(activeCategory.toLowerCase())} {t('session')}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/athkar')} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gold-bright hover:border-gold/30 transition-all flex items-center gap-2">
                        {t('view_all')} <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {athkarData[activeCategory as keyof typeof athkarData]?.slice(0, 3).map((dhikr, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate('/athkar')}
                            className="relative rounded-2xl bg-emerald-black/40 border border-white/5 p-4 flex items-center gap-4 hover:bg-emerald-black/60 transition-all cursor-pointer"
                        >
                            <div className="size-12 rounded-xl bg-gold-bright/10 border border-gold/30 flex flex-col items-center justify-center">
                                <span className="text-gold-bright font-serif font-bold text-xl">{dhikr.count}</span>
                                <span className="text-[8px] text-gold/60 font-bold uppercase tracking-widest">{t('times')}</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-arabic text-lg text-white mb-1 line-clamp-1">{dhikr.arabic}</p>
                                <p className="text-[11px] text-gray-500 italic font-serif line-clamp-1">"{dhikr.translation}"</p>
                            </div>
                            <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center text-gold-bright/40">
                                <span className="material-symbols-outlined text-xl">arrow_forward_ios</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trackers Section */}
            <div className="grid grid-cols-2 gap-3 mb-10 animate-in fade-in duration-500 delay-400">
                {/* Athkar Tracker */}
                <div onClick={() => navigate('/athkar')} className="bg-emerald-black/40 border border-white/10 rounded-2xl p-5 relative overflow-hidden cursor-pointer hover:bg-emerald-black/60 transition-all">
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <span className="text-[10px] font-bold text-gold-bright uppercase tracking-[0.3em]">{t('faith_progress')}</span>
                        <div className="size-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-gold-bright text-lg">hotel_class</span>
                        </div>
                    </div>
                    <div className="relative z-10">
                        <div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-[0.2em]">
                                <span>{t('soul_level')}</span>
                                <span className="text-gold-bright">{Math.min(Math.round((dailyTotal / 1000) * 100), 100)}%</span>
                            </div>
                            <div className="h-2 w-full bg-black/80 rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-gradient-to-r from-gold to-gold-bright rounded-full transition-all duration-700" style={{ width: `${Math.min((dailyTotal / 1000) * 100, 100)}%` }}></div>
                            </div>
                            {Object.values(stats).reduce((a, b) => a + b, 0) > 0 && (
                                <p className="text-[9px] text-gray-500 mt-3 text-center uppercase tracking-widest">
                                    {t('lifetime') || 'Lifetime'}: <span className="text-gold-bright font-bold">{Object.values(stats).reduce((a, b) => a + b, 0)}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Health Glance */}
                <div
                    onClick={() => navigate('/health')}
                    className="bg-emerald-black/40 border border-white/10 rounded-2xl p-5 relative overflow-hidden cursor-pointer"
                >
                    <div className="flex justify-between items-center mb-4 relative z-10">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em]">{t('health_glance')}</span>
                        <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-emerald-500 text-lg">monitor_heart</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 relative z-10">
                        {healthStats.calories > 0 ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-xl bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20">
                                        <span className="material-symbols-outlined text-base">hotel_class</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase tracking-wider tabular-nums">
                                            {healthStats.grade} <span className="text-gray-500/60 font-normal">{t('grade')}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="size-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                                        <span className="material-symbols-outlined text-base">local_fire_department</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-white uppercase tracking-wider tabular-nums">
                                            {healthStats.calories} <span className="text-gray-500/60 font-normal">{t('kcal')}</span>
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-2 text-center opacity-60">
                                <span className="material-symbols-outlined text-3xl text-emerald-500/50 mb-2">no_meals</span>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t('no_recent_scan')}</p>
                                <p className="text-[9px] text-gold-500/80 mt-1">{t('tap_to_analyze')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Daily Hadith */}
            <div className="relative rounded-2xl bg-gradient-to-br from-emerald-950/60 to-black border border-gold/20 p-6 overflow-hidden mb-12 animate-in fade-in duration-500 delay-500">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-bright/20 to-transparent"></div>
                <h4 className="text-[11px] font-bold text-gold-bright uppercase tracking-[0.4em] mb-5 text-center opacity-80">{t('daily_hadith')}</h4>
                <p className="text-base sm:text-lg font-serif italic text-white/95 text-center mb-5 leading-[1.8]">
                    {t('hadith_text')}
                </p>
                <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-[0.4em]">
                    <div className="h-px w-8 bg-gold/20"></div>
                    {t('sahih_bukhari')}
                    <div className="h-px w-8 bg-gold/20"></div>
                </div>
            </div>

            {/* AI Assistant FAB */}
            <button
                onClick={() => navigate('/aichat')}
                className="fixed bottom-24 right-6 size-14 bg-gradient-to-br from-gold-light via-gold to-gold-dark rounded-full shadow-[0_0_20px_rgba(212,175,55,0.4)] flex items-center justify-center text-emerald-black hover:scale-110 active:scale-95 transition-all z-50 animate-bounce"
            >
                <span className="material-symbols-outlined text-2xl">smart_toy</span>
            </button>

        </div>
    );
};

export default Home;