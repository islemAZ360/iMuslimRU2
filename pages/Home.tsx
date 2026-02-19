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

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 10) setActiveCategory('Morning');
        else if (hour >= 16 && hour < 20) setActiveCategory('Evening');
        else setActiveCategory('Istighfar');
    }, []);

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
        <div className="pb-32 pt-6 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 min-h-screen relative overflow-x-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Ambient Background Glows & Divine Light */}
            <div className="fixed inset-0 pointer-events-none -z-10 bg-black">
                {/* Deep Emerald Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/30 via-black to-black opacity-80"></div>

                {/* Divine Light Rays (Top Center) */}
                <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[conic-gradient(from_180deg_at_50%_50%,_rgba(0,0,0,0)_0deg,_rgba(212,175,55,0.05)_20deg,_rgba(0,0,0,0)_40deg,_rgba(16,185,129,0.05)_60deg,_rgba(0,0,0,0)_80deg)] blur-[60px] animate-pulse"></div>

                {/* Ambient Orbs */}
                <div className="absolute top-[20%] right-[-10%] size-96 bg-gold-900/10 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-[10%] left-[-10%] size-96 bg-emerald-900/10 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_reverse]"></div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-700 relative z-10">
                <div>
                    <div className="flex items-center gap-1 text-gold-bright/60 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">
                        <span className="material-symbols-outlined text-sm animate-pulse">location_on</span>
                        {location ? `${location.city || 'Unknown'}, ${location.country || ''}` : t('location_not_set')}
                    </div>
                    {/* Smart Greeting with Shimmer */}
                    <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-bright via-white to-gold-bright bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite] leading-tight drop-shadow-lg">
                        {smartContext.greeting}
                    </h2>
                    <p className="text-[10px] text-emerald-400/80 font-bold mt-1 tracking-wider uppercase">
                        {smartContext.tip}
                    </p>
                </div>
                <div className="size-14 rounded-2xl glass-panel flex items-center justify-center text-gold-bright border border-gold/30 shadow-[0_0_30px_rgba(212,175,55,0.1)] divine-border shine-effect group cursor-pointer hover:scale-110 transition-transform bg-black/40 backdrop-blur-md">
                    <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">mosque</span>
                </div>
            </div>

            {/* Next Prayer Hero with Divine Halo */}
            <div className="relative w-full rounded-[3rem] bg-gradient-to-br from-gold/20 via-black/60 to-black p-[1px] shadow-[0_20px_50px_rgba(0,0,0,0.8)] mb-10 group overflow-hidden animate-in zoom-in-95 duration-1000 z-10">
                <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-[3rem] group-hover:bg-gold/10 transition-colors duration-1000"></div>

                {/* Rotating Divine Halo Background - Enhanced */}
                <div className="absolute -right-24 -top-24 size-96 pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-1000 animate-[spin-slow_30s_linear_infinite]">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-gold-bright drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                        <path fill="currentColor" d="M40,100c0,33.1,26.9,60,60,60s60-26.9,60-60s-26.9-60-60-60S40,66.9,40,100z M100,50c27.6,0,50,22.4,50,50s-22.4,50-50,50s-50-22.4-50-50S72.4,50,100,50z" opacity="0.4" />
                        <path fill="currentColor" d="M100,20c-44.1,0-80,35.9-80,80c0,5.5,4.5,10,10,10s10-4.5,10-10c0-33.1,26.9-60,60-60s60,26.9,60,60c0,33.1-26.9,60-60,60c-11,0-21.5-3-30.5-8.5c-4.7-2.9-10.9-1.3-13.8,3.4c-2.9,4.7-1.3,10.9,3.4,13.8c12,7.3,26,11.3,40.9,11.3c44.1,0,80-35.9,80-80C180,55.9,144.1,20,100,20z" />
                    </svg>
                </div>

                <div className="bg-emerald-black/90 backdrop-blur-3xl rounded-[3rem] p-8 relative overflow-hidden border border-white/5 min-h-[240px] flex flex-col justify-between divine-border shine-effect">
                    {/* Decorative Patterns */}
                    <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-1000">
                        <span className="material-symbols-outlined text-9xl text-gold-bright animate-[divine-float_6s_ease-in-out_infinite]">star_half</span>
                    </div>

                    <div className="flex justify-between items-start z-10">
                        <div className="animate-in slide-in-from-left-4 duration-700 delay-300">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold-bright text-[10px] font-bold uppercase tracking-[0.2em] mb-4 shadow-gold-glow-sm">
                                <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                                {t('upcoming')}
                            </div>
                            <h1 className="text-6xl font-serif font-bold text-white tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                                {nextPrayer ? t(nextPrayer.toLowerCase()) : t('loading')}
                            </h1>
                            <p className="text-gold-bright/80 text-sm font-bold tracking-[0.1em] mt-3 flex items-center gap-2">
                                {t('starts_in')}
                                <span className="text-white font-mono bg-white/10 px-2 py-0.5 rounded-md border border-white/10 shadow-inner">{timeRemaining}</span>
                            </p>
                        </div>
                        {nextPrayer && (
                            <div className="size-20 rounded-3xl border border-gold/30 flex items-center justify-center bg-black/40 backdrop-blur-md shadow-2xl divine-border group-hover:scale-110 transition-transform duration-500 hover:bg-gold/10">
                                <span className="material-symbols-outlined text-5xl text-gold-bright animate-[divine-float_4s_ease-in-out_infinite] drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]">{prayerIcons[nextPrayer]}</span>
                            </div>
                        )}
                    </div>

                    <div className="z-10 mt-auto pt-6 border-t border-white/10 flex justify-between items-end animate-in fade-in duration-700 delay-500">
                        <div className="flex flex-col">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1 opacity-80">{t('adhan_time')}</p>
                            <p className="text-2xl font-bold text-white tracking-wider font-mono">
                                {timings && nextPrayer ? formatTime(timings[nextPrayer as keyof typeof timings]) : '--:--'}
                            </p>
                        </div>
                        {hijriDate && (
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-1 opacity-80">{t('islamic_date')}</p>
                                <p className="text-sm font-bold text-gold-bright bg-gold/5 px-3 py-1 rounded-full border border-gold/10 hover:bg-gold/10 transition-colors cursor-default">
                                    {hijriDate.day} {language === 'ar' ? hijriDate.month.ar : hijriDate.month.en} {hijriDate.year}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid with Staggered Animations */}
            <div className="grid grid-cols-4 gap-4 mb-10">
                {[
                    { icon: 'qr_code_scanner', label: t('scan_food'), path: '/scan', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
                    { icon: 'cycle', label: t('tasbih'), path: '/athkar', color: 'bg-gold/10 text-gold-bright border-gold/30' },
                    { icon: 'explore', label: t('qibla_short'), path: '/prayer', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
                    { icon: 'calendar_month', label: t('calendar'), path: '/prayer', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
                ].map((action, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(action.path)}
                        className={`flex flex-col items-center gap-2 group animate-in fade-in slide-in-from-bottom-4 duration-700`}
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <div className={`size-16 rounded-[1.5rem] border flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95 shadow-lg group-hover:shadow-xl divine-border shine-effect ${action.color}`}>
                            <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">{action.icon}</span>
                        </div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center group-hover:text-white transition-colors">{action.label}</span>
                    </button>
                ))}
            </div>

            {/* Daily Inspiration Section */}
            <div className="space-y-4 mb-12 animate-in fade-in duration-1000 delay-500">
                <div className="flex items-center gap-4 px-2">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.4em] text-gold-bright/60">{t('daily_ayah')}</h3>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                </div>

                <div className="relative rounded-[3rem] bg-emerald-black border border-white/10 p-10 shadow-3xl overflow-hidden group divine-border shine-effect hover:shadow-gold-glow-sm transition-shadow duration-700">
                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000">
                        <span className="material-symbols-outlined text-[12rem] text-gold-bright">menu_book</span>
                    </div>
                    <p className="font-arabic text-4xl text-white text-right mb-8 leading-[1.8] drop-shadow-2xl group-hover:text-gold-bright transition-colors duration-1000">
                        فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ
                    </p>
                    <div className="flex justify-between items-center border-t border-white/10 pt-8">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gold-bright/60 uppercase tracking-[0.4em]">
                            <span className="material-symbols-outlined text-sm">bookmark</span>
                            Al-Baqarah 2:152
                        </div>
                        <div className="flex gap-4">
                            <button className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-gold-bright hover:bg-white/10 transition-all divine-border">
                                <span className="material-symbols-outlined text-xl">share</span>
                            </button>
                            <button className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-gold-bright hover:bg-white/10 transition-all divine-border">
                                <span className="material-symbols-outlined text-xl">content_copy</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Dhikr Rituals - Time Sensitive */}
            <div className="space-y-6 mb-12 animate-in fade-in duration-1000 delay-700">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-10 bg-gradient-to-b from-gold-bright to-gold rounded-full shadow-gold-glow animate-[glow-pulse-gold_3s_infinite]"></div>
                        <div>
                            <h3 className="text-3xl font-arabic text-gold-bright tracking-wide drop-shadow-md">{t('daily_ritual') || 'الورد اليومي'}</h3>
                            <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-[0.4em]">{activeCategory} Session</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/athkar')} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gold-bright hover:border-gold/30 transition-all flex items-center gap-2">
                        View All <span className="material-symbols-outlined text-xs">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-5">
                    {athkarData[activeCategory as keyof typeof athkarData]?.slice(0, 3).map((dhikr, idx) => (
                        <div
                            key={idx}
                            onClick={() => navigate('/athkar')}
                            className="relative rounded-[2.5rem] bg-emerald-black/40 border border-white/5 p-6 flex items-center gap-6 hover:bg-emerald-black/60 transition-all group divine-border shine-effect cursor-pointer animate-in slide-in-from-right-4 duration-700"
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            <div className="size-16 rounded-[1.5rem] bg-gold-bright/10 border border-gold/30 flex flex-col items-center justify-center group-hover:bg-gold/20 transition-all shadow-lg">
                                <span className="text-gold-bright font-serif font-bold text-2xl drop-shadow-sm">{dhikr.count}</span>
                                <span className="text-[8px] text-gold/60 font-bold uppercase tracking-widest">times</span>
                            </div>
                            <div className="flex-1">
                                <p className="font-arabic text-2xl text-white mb-2 group-hover:text-gold-bright transition-colors duration-500 line-clamp-1">{dhikr.arabic}</p>
                                <p className="text-[11px] text-gray-500 italic font-serif line-clamp-1 opacity-80 group-hover:opacity-100 transition-opacity">"{dhikr.translation}"</p>
                            </div>
                            <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center text-gold-bright/30 group-hover:text-gold-bright group-hover:scale-125 transition-all shadow-inner">
                                <span className="material-symbols-outlined text-2xl">arrow_forward_ios</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trackers Section with Enhanced Depth */}
            <div className="grid grid-cols-2 gap-6 mb-12 animate-in fade-in duration-1000 delay-1000">
                {/* Athkar Tracker */}
                <div className="bg-emerald-black/40 border border-white/10 rounded-[3rem] p-8 shadow-3xl relative overflow-hidden group divine-border shine-effect">
                    <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <span className="text-[11px] font-bold text-gold-bright uppercase tracking-[0.4em]">{t('faith_progress')}</span>
                        <div className="size-10 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-gold-bright text-xl">hotel_class</span>
                        </div>
                    </div>
                    <div className="space-y-5 relative z-10">
                        <div>
                            <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-3 uppercase tracking-[0.2em]">
                                <span>Soul Level</span>
                                <span className="text-gold-bright">65%</span>
                            </div>
                            <div className="h-2 w-full bg-black/80 rounded-full overflow-hidden border border-white/10 shadow-inner">
                                <div className="h-full bg-gradient-to-r from-gold via-gold-bright to-gold rounded-full w-[65%] shadow-gold-glow animate-[shimmer_4s_linear_infinite] bg-[length:200%_auto]"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Health Glance */}
                <div
                    onClick={() => navigate('/health')}
                    className="bg-emerald-black/40 border border-white/10 rounded-[3rem] p-8 shadow-3xl relative overflow-hidden group divine-border shine-effect cursor-pointer"
                >
                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-[0.3em]">{t('health_glance')}</span>
                        <div className="size-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-emerald-500 text-xl">monitor_heart</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 relative z-10">
                        {healthStats.calories > 0 ? (
                            <>
                                <div className="flex items-center gap-5">
                                    <div className="size-11 rounded-2xl bg-gold-500/10 flex items-center justify-center text-gold-500 border border-gold-500/20 shadow-inner">
                                        <span className="material-symbols-outlined text-lg">hotel_class</span>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-white uppercase tracking-wider tabular-nums">
                                            {healthStats.grade} <span className="text-gray-500/60 font-normal">Grade</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="size-11 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20 shadow-inner">
                                        <span className="material-symbols-outlined text-lg">local_fire_department</span>
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-bold text-white uppercase tracking-wider tabular-nums">
                                            {healthStats.calories} <span className="text-gray-500/60 font-normal">kcal</span>
                                        </p>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-2 text-center opacity-60">
                                <span className="material-symbols-outlined text-3xl text-emerald-500/50 mb-2">no_meals</span>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest">No Recent Scan</p>
                                <p className="text-[9px] text-gold-500/80 mt-1">Tap to Analyze</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Daily Hadith Full Width - Divine Scroll Style */}
            <div className="relative rounded-[3rem] bg-gradient-to-br from-emerald-950/60 to-black border border-gold/30 p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden group mb-12 divine-border shine-effect animate-in fade-in zoom-in-95 duration-1000 delay-1000">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-bright/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-bright/30 to-transparent"></div>

                <div className="absolute bottom-0 left-0 p-8 opacity-5 pointer-events-none transform -rotate-12 transition-transform duration-1000 group-hover:rotate-0">
                    <span className="material-symbols-outlined text-[15rem] text-gold-bright">format_quote</span>
                </div>
                <h4 className="text-[12px] font-bold text-gold-bright uppercase tracking-[0.6em] mb-8 text-center opacity-70 group-hover:opacity-100 transition-opacity">{t('daily_hadith')}</h4>
                <div className="relative">
                    <p className="text-2xl font-serif italic text-white/95 text-center mb-8 leading-[1.8] drop-shadow-xl group-hover:text-white transition-colors">
                        "The best among you are those who have the best manners and character."
                    </p>
                </div>
                <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-gray-500 uppercase tracking-[0.5em]">
                    <div className="h-px w-8 bg-gold/20"></div>
                    Sahih Bukhari
                    <div className="h-px w-8 bg-gold/20"></div>
                </div>
            </div>

        </div>
    );
};

export default Home;