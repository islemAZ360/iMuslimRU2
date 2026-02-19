import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePrayer } from '../context/PrayerContext';
import { athkarData } from '../data/athkarData';

const sunnahData = [
    {
        id: 'fajr_sunnah',
        name: 'سنة الفجر',
        desc: 'Fajr Sunnah',
        rakahs: 2,
        isRawatib: true,
        virtue: 'Better than the world and all that is in it.',
        timeHint: 'Before Fajr',
        icon: 'wb_twilight'
    },
    {
        id: 'dhuhr_before',
        name: 'سنة الظهر القبلية',
        desc: 'Before Dhuhr',
        rakahs: 4,
        isRawatib: true,
        virtue: 'Prevents the fire from touching the soul.',
        timeHint: 'Before Dhuhr',
        icon: 'wb_sunny'
    },
    {
        id: 'dhuhr_after',
        name: 'سنة الظهر البعدية',
        desc: 'After Dhuhr',
        rakahs: 2,
        isRawatib: true,
        virtue: 'Completes the Rawatib reward.',
        timeHint: 'After Dhuhr',
        icon: 'light_mode'
    },
    {
        id: 'duha_prayer',
        name: 'صلاة الضحى',
        desc: 'Duha Prayer',
        rakahs: 2,
        isRawatib: false,
        virtue: 'Charity for every joint in the body.',
        timeHint: 'After Sunrise',
        icon: 'sunny'
    },
    {
        id: 'maghrib_after',
        name: 'سنة المغرب',
        desc: 'After Maghrib',
        rakahs: 2,
        isRawatib: true,
        virtue: 'Key to the Jannah goal.',
        timeHint: 'After Maghrib',
        icon: 'wb_twilight'
    },
    {
        id: 'isha_after',
        name: 'سنة العشاء',
        desc: 'After Isha',
        rakahs: 2,
        isRawatib: true,
        virtue: 'The final Rawatib of the day.',
        timeHint: 'After Isha',
        icon: 'dark_mode'
    },
    {
        id: 'witr_prayer',
        name: 'صلاة الوتر',
        desc: 'Witr Prayer',
        rakahs: 1,
        isRawatib: false,
        virtue: 'Allah is One and loves the Witr.',
        timeHint: 'After Isha until Fajr',
        icon: 'star'
    },
    {
        id: 'tahajjud_prayer',
        name: 'قيام الليل',
        desc: 'Tahajjud',
        rakahs: 2,
        isRawatib: false,
        virtue: 'The best prayer after the obligatory ones.',
        timeHint: 'Last third of night',
        icon: 'bedtime'
    }
];

const DAILY_GOAL = 1000;
const RAWATIB_GOAL = 12;

const Athkar: React.FC = () => {
    const { language, t } = useLanguage();
    const { nextPrayer, timings } = usePrayer();
    const today = new Date().toISOString().split('T')[0];

    // Tasbih State with Persistence
    const [count, setCount] = useState(() => {
        const saved = localStorage.getItem('tasbih_count');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [target, setTarget] = useState(100);
    const [activeCategory, setActiveCategory] = useState<string>('Istighfar');
    const [showSmartTip, setShowSmartTip] = useState(true);

    // Stats persistence logic
    const [stats, setStats] = useState<Record<string, number>>(() => {
        const saved = localStorage.getItem('dhikr_stats');
        return saved ? JSON.parse(saved) : {};
    });

    // Daily total tracking
    const [dailyTotal, setDailyTotal] = useState(() => {
        const saved = localStorage.getItem(`dhikr_daily_${today}`);
        return saved ? parseInt(saved, 10) : 0;
    });

    // Sunnah State
    const [sunnahs, setSunnahs] = useState<Record<string, boolean>>(() => {
        const saved = localStorage.getItem('sunnah_tracker');
        return saved ? JSON.parse(saved) : {};
    });

    // Calculate completed Rawatib Rakahs
    const completedRawatib = useMemo(() => {
        return sunnahData
            .filter(s => s.isRawatib && sunnahs[s.id])
            .reduce((sum, s) => sum + s.rakahs, 0);
    }, [sunnahs]);

    // Time-based category suggestion
    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 4 && hour < 10) setActiveCategory('Morning');
        else if (hour >= 16 && hour < 20) setActiveCategory('Evening');
        else setActiveCategory('Istighfar');
    }, []);

    // Persist Count
    useEffect(() => {
        localStorage.setItem('tasbih_count', count.toString());
    }, [count]);

    // Persist Stats
    useEffect(() => {
        localStorage.setItem('dhikr_stats', JSON.stringify(stats));
    }, [stats]);

    // Persist Daily Total
    useEffect(() => {
        localStorage.setItem(`dhikr_daily_${today}`, dailyTotal.toString());
    }, [dailyTotal, today]);

    // Persist Sunnahs
    useEffect(() => {
        localStorage.setItem('sunnah_tracker', JSON.stringify(sunnahs));
    }, [sunnahs]);

    const handleSunnahToggle = (id: string) => {
        setSunnahs(prev => ({ ...prev, [id]: !prev[id] }));
        try { if (navigator.vibrate) navigator.vibrate(10); } catch (e) { }
    };

    const handleCount = () => {
        if (count < target) {
            setCount(c => c + 1);
            setDailyTotal(d => d + 1);
            setStats(prev => ({
                ...prev,
                [activeCategory]: (prev[activeCategory] || 0) + 1
            }));
            try { if (navigator.vibrate) navigator.vibrate(50); } catch (e) { }
        }
    };

    const handleReset = () => {
        if (window.confirm("Reset session counter?")) {
            setCount(0);
        }
    };

    const handleCategorySelect = (cat: string) => {
        setActiveCategory(cat);
        setCount(0); // Reset session count when changing category
        try { if (navigator.vibrate) navigator.vibrate(30); } catch (e) { }
    };

    const circumference = 2 * Math.PI * 70;
    const offset = circumference - (count / target) * circumference;

    const categories = [
        { id: 'Istighfar', icon: 'auto_fix_high', label: 'استغفار', color: 'text-blue-400' },
        { id: 'Praise', icon: 'favorite', label: 'تسبيح', color: 'text-red-400' },
        { id: 'Morning', icon: 'wb_twilight', label: 'صباح', color: 'text-orange-400' },
        { id: 'Evening', icon: 'dark_mode', label: 'مساء', color: 'text-indigo-400' },
        { id: 'Quranic', icon: 'menu_book', label: 'قرآن', color: 'text-emerald-400' },
        { id: 'Prayer', icon: 'mosque', label: 'صلاة', color: 'text-teal-400' },
        { id: 'Sleep', icon: 'bedtime', label: 'نوم', color: 'text-purple-400' },
        { id: 'Travel', icon: 'flight', label: 'سفر', color: 'text-sky-400' }
    ];

    const currentDhikr = athkarData[activeCategory as keyof typeof athkarData]?.[0] || { arabic: 'أَسْتَغْفِرُ ٱللَّٰهَ', translation: 'I seek forgiveness from Allah', count: 100, benefit: '' };

    return (
        <div className="pb-32 pt-8 px-4 flex flex-col items-center min-h-screen animate-in fade-in duration-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Smart Recommendation Header */}
            {showSmartTip && (
                <div className="w-full mb-8 divine-border rounded-3xl p-5 flex items-center justify-between animate-in slide-in-from-top duration-700 shine-effect relative group overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-gold/5 to-transparent pointer-events-none"></div>
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="size-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/40 shadow-gold-glow-sm group-hover:scale-110 transition-transform duration-500">
                            <span className="material-symbols-outlined text-gold-bright animate-pulse text-2xl">tips_and_updates</span>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-gold-bright uppercase tracking-[0.3em] mb-1">Divine Guidance</h4>
                            <p className="text-sm text-white/90 font-medium">It's a blessed time for <span className="text-gold-bright font-bold underline decoration-gold/30 underline-offset-4">{activeCategory} Athkar</span>.</p>
                        </div>
                    </div>
                    <button onClick={() => setShowSmartTip(false)} className="size-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all relative z-10">
                        <span className="material-symbols-outlined text-md">close</span>
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-12 relative w-full animate-in slide-in-from-bottom duration-1000">
                <h1 className="font-arabic text-7xl text-gold-bright drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] mb-4 tracking-wide">الإيمان والأذكار</h1>
                <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                    <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-[0.5em]">{t('faith_progress')}</p>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                </div>

                {/* Daily Goal Tracker - Enhanced */}
                <div className="max-w-[280px] mx-auto p-4 rounded-3xl bg-black/40 border border-white/5 shadow-inner backdrop-blur-sm">
                    <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase mb-2 tracking-widest">
                        <span>Spiritual Journey</span>
                        <span className="text-gold-bright">{dailyTotal} / {DAILY_GOAL}</span>
                    </div>
                    <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
                        <div
                            className="h-full bg-gradient-to-r from-gold/40 via-gold-bright to-gold/40 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-1000 relative"
                            style={{ width: `${Math.min((dailyTotal / DAILY_GOAL) * 100, 100)}%` }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_infinite_linear]"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Grid - Scrollable and more premium */}
            <div className="w-full overflow-x-auto no-scrollbar mb-10 pb-4">
                <div className="flex gap-5 min-w-max px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`flex flex-col items-center gap-3 px-7 py-5 rounded-[2.5rem] border transition-all duration-500 group/cat ${activeCategory === cat.id ? 'bg-emerald-900/30 border-gold-bright shadow-[0_0_30px_rgba(212,175,55,0.25)] scale-110 divine-border shine-effect' : 'bg-black/60 border-white/10 hover:border-gold/40 hover:scale-105'}`}
                        >
                            <div className={`size-14 rounded-2xl flex items-center justify-center border transition-all duration-500 ${activeCategory === cat.id ? 'bg-gold/20 border-gold-bright shadow-gold-glow-sm' : 'bg-white/5 border-white/10 group-hover/cat:bg-white/10'}`}>
                                <span className={`material-symbols-outlined text-3xl transition-transform duration-500 ${activeCategory === cat.id ? 'text-gold-bright scale-110' : 'text-white/30 group-hover/cat:text-gold/60'}`}>
                                    {cat.icon}
                                </span>
                            </div>
                            <div className="text-center">
                                <p className={`text-[10px] font-bold uppercase tracking-[0.25em] ${activeCategory === cat.id ? 'text-gold-bright' : 'text-gray-500'}`}>{cat.id}</p>
                                <p className="font-arabic text-sm text-white/70 mt-1">{cat.label}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Tasbih Card */}
            <div className="w-full rounded-[4rem] bg-gradient-to-b from-emerald-950/90 to-black border border-gold/30 p-10 relative overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] mb-12 group divine-border shine-effect animate-in zoom-in-95 duration-700">
                <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] pointer-events-none"></div>

                {/* Visual Accent */}
                <div className="absolute -top-20 -right-20 size-64 bg-gold/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-gold/20 transition-all duration-1000"></div>
                <div className="absolute -bottom-20 -left-20 size-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-1000"></div>

                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-black/60 border border-gold/20 backdrop-blur-xl shadow-xl">
                            <div className="size-2 rounded-full bg-gold animate-pulse shadow-gold-glow-sm"></div>
                            <span className="text-[10px] font-bold text-gold-bright uppercase tracking-[0.4em]">{activeCategory} Ritual</span>
                        </div>
                        <button onClick={() => setTarget(target === 33 ? 100 : 33)} className="px-6 py-2.5 rounded-full bg-white/5 border border-white/20 text-[10px] font-bold text-white uppercase tracking-[0.3em] hover:bg-white/10 hover:border-gold/40 transition-all backdrop-blur-md">
                            Goal: {target}
                        </button>
                    </div>

                    <div className="min-h-[160px] flex flex-col items-center justify-center text-center max-w-[320px]">
                        <h3 className="font-arabic text-6xl text-gold-bright mb-6 drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)] leading-relaxed animate-in slide-in-from-bottom-4 duration-1000">
                            {currentDhikr.arabic}
                        </h3>
                        <p className="text-base font-serif italic text-gray-400 mb-2 leading-relaxed opacity-80">
                            "{currentDhikr.translation}"
                        </p>
                    </div>

                    {/* Counter Circle - Divine Mode */}
                    <div onClick={handleCount} className="relative size-80 flex items-center justify-center my-10 cursor-pointer active:scale-95 transition-all select-none tap-highlight-transparent group/counter">
                        {/* Divine Layers */}
                        <div className="absolute inset-0 rounded-full border-[1.5px] border-gold/10 scale-110 animate-[spin_60s_linear_infinite] opacity-50"></div>
                        <div className="absolute inset-0 rounded-full border-[1.5px] border-gold/5 scale-[1.22] animate-[spin_80s_linear_infinite_reverse] opacity-30"></div>

                        <div className="absolute inset-0 rounded-full border-[10px] border-[#1a1508] shadow-[0_0_70px_rgba(212,175,55,0.15),inset_0_0_40px_rgba(0,0,0,0.8)] bg-gradient-to-br from-gold/15 to-transparent"></div>

                        <svg className="absolute inset-0 size-full -rotate-90 p-4">
                            <circle cx="50%" cy="50%" r="90" stroke="#0a0a0a" strokeWidth="10" fill="transparent" />
                            <circle
                                cx="50%" cy="50%" r="90"
                                stroke="url(#goldGradient)"
                                strokeWidth="10"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 90}
                                strokeDashoffset={(2 * Math.PI * 90) - (count / target) * (2 * Math.PI * 90)}
                                strokeLinecap="round"
                                className="transition-all duration-700 ease-out drop-shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                            />
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#D4AF37" />
                                    <stop offset="50%" stopColor="#F9E496" />
                                    <stop offset="100%" stopColor="#AA771C" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="size-64 rounded-full bg-[#030605] shadow-[inset_0_15px_40px_rgba(0,0,0,1)] border border-gold/30 flex flex-col items-center justify-center relative z-10 group-hover/counter:border-gold/60 transition-all duration-700 overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(212,175,55,0.08),_transparent)]"></div>
                            <div className="absolute top-1/4 w-full h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>
                            <div className="absolute bottom-1/4 w-full h-px bg-gradient-to-r from-transparent via-gold/10 to-transparent"></div>

                            <span className="text-[10rem] font-serif font-black text-white drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)] leading-none -mb-4 tracking-tighter">{count}</span>
                            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold-bright/60 to-transparent my-4"></div>
                            <span className="text-[11px] font-bold text-gold-bright uppercase tracking-[0.5em] opacity-80">Divine Count</span>
                        </div>
                    </div>

                    <button onClick={handleReset} className="flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-gold-bright hover:border-gold-bright/50 hover:bg-gold/5 transition-all active:scale-90 shadow-lg">
                        <span className="material-symbols-outlined text-sm">restart_alt</span>
                        Reset Session
                    </button>
                </div>
            </div>

            {/* Encyclopedia with "Why?" (Benefits) logic */}
            <div className="w-full mb-16">
                <div className="flex items-center justify-between mb-10 px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-12 bg-gold-bright rounded-full shadow-gold-glow animate-pulse"></div>
                        <div>
                            <h3 className="text-4xl font-arabic text-gold-bright drop-shadow-md">موسوعة الأذكار</h3>
                            <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-[0.4em]">Spiritual Encyclopedia</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {athkarData[activeCategory as keyof typeof athkarData]?.map((dhikr, idx) => (
                        <div key={idx} className="relative rounded-[3rem] bg-emerald-black/40 border border-white/10 p-8 hover:bg-emerald-black/60 transition-all duration-500 group overflow-hidden divine-border shine-effect hover:scale-[1.02] shadow-xl">
                            <div className="absolute top-0 left-0 h-full w-1.5 bg-gold/20 group-hover:bg-gold-bright transition-all duration-700"></div>

                            {/* Decorative background number */}
                            <div className="absolute -right-4 -bottom-4 text-9xl font-serif font-black text-white/5 pointer-events-none group-hover:text-gold/10 transition-all duration-1000">
                                {idx + 1}
                            </div>

                            <div className="flex justify-between items-start gap-6 mb-6">
                                <div className="size-10 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-xs text-gold-bright font-bold shadow-gold-glow-sm">{idx + 1}</div>
                                <p className="font-arabic text-4xl text-white text-right flex-1 leading-relaxed group-hover:text-gold-bright transition-colors duration-700 drop-shadow-lg">{dhikr.arabic}</p>
                            </div>

                            <div className="p-6 rounded-[2rem] bg-black/60 border border-white/5 mb-6 backdrop-blur-md group-hover:border-gold/20 transition-all duration-500">
                                <p className="text-sm text-gray-400 italic mb-3 leading-loose opacity-90 group-hover:opacity-100">"{dhikr.translation}"</p>
                                {dhikr.benefit && (
                                    <div className="mt-4 flex gap-3 items-start p-3 rounded-xl bg-gold/5 border border-gold/10">
                                        <span className="material-symbols-outlined text-gold-bright text-lg mt-0.5 animate-pulse">auto_awesome</span>
                                        <p className="text-xs text-gold/90 font-medium leading-relaxed italic">{dhikr.benefit}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center px-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 uppercase tracking-[0.2em]">Repeats: {dhikr.count}x</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setTarget(dhikr.count);
                                        setCount(0);
                                        window.scrollTo({ top: 350, behavior: 'smooth' });
                                    }}
                                    className="px-6 py-3 rounded-2xl bg-gold-bright text-black text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-3 shadow-gold-glow-sm hover:scale-110 active:scale-90 transition-all duration-500"
                                >
                                    Engage Ritual <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sunnah & Nawafil Tracker - Redesigned v2 */}
            <div className="w-full pb-12">
                <div className="flex items-center justify-between mb-10 px-4">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-12 bg-emerald-500 rounded-full shadow-emerald-glow animate-pulse"></div>
                        <div>
                            <h3 className="text-4xl font-arabic text-white drop-shadow-md">السنن والرواتب</h3>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.4em]">Prophetic Traditions</p>
                        </div>
                    </div>
                    {/* 12-Rak'ah Challenge Progress */}
                    <div className="flex flex-col items-end bg-black/40 p-3 rounded-2xl border border-gold/10 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-gold-bright text-sm">home_work</span>
                            <span className="text-[9px] font-bold text-gold-bright uppercase tracking-widest">Jannah Palace</span>
                        </div>
                        <div className="flex gap-1.5">
                            {Array.from({ length: RAWATIB_GOAL }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`size-2 rounded-full transition-all duration-700 ${i < completedRawatib ? 'bg-gold-bright shadow-[0_0_10px_rgba(212,175,55,0.8)] scale-125' : 'bg-white/5 border border-white/10'}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {sunnahData.map((sunnah) => {
                        const isHighlighted = (nextPrayer && sunnah.timeHint.includes(nextPrayer)) ||
                            (nextPrayer === 'Fajr' && sunnah.id === 'tahajjud_prayer') ||
                            (nextPrayer === 'Dhuhr' && sunnah.id === 'duha_prayer');

                        return (
                            <div
                                key={sunnah.id}
                                className={`relative rounded-[3rem] bg-emerald-black/30 border transition-all duration-700 overflow-hidden group divine-border shine-effect ${isHighlighted ? 'border-gold-bright shadow-[0_0_40px_rgba(212,175,55,0.15)] scale-[1.03] z-10' : 'border-white/5 hover:border-gold/30'}`}
                            >
                                {isHighlighted && (
                                    <div className="absolute top-0 right-0 px-6 py-2 bg-gold-bright text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-bl-3xl shadow-xl z-20 animate-in slide-in-from-right duration-700">
                                        Active Grace
                                    </div>
                                )}

                                <div className="p-8 flex items-center gap-8">
                                    <div className={`size-20 rounded-[2rem] flex items-center justify-center border transition-all duration-700 shadow-2xl relative ${sunnahs[sunnah.id] ? 'bg-gold-bright border-gold shadow-gold-glow rotate-12 scale-110' : 'bg-white/5 border-white/10 group-hover:bg-gold/10 group-hover:border-gold/40'}`}>
                                        <div className="absolute inset-0 bg-white/10 rounded-inherit opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className={`material-symbols-outlined text-4xl transition-all duration-700 ${sunnahs[sunnah.id] ? 'text-black font-black' : 'text-gold/30 group-hover:text-gold-bright group-hover:scale-110'}`}>
                                            {sunnah.icon}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-4 mb-2">
                                            <h4 className="font-arabic text-4xl text-white group-hover:text-gold-bright transition-colors duration-500 drop-shadow-md">{sunnah.name}</h4>
                                            <span className="text-[11px] font-bold text-emerald-400/70 uppercase tracking-widest">{sunnah.rakahs} Rak'ahs</span>
                                        </div>
                                        <p className="text-[11px] font-bold text-gold-bright/70 uppercase tracking-[0.25em] mb-2">{sunnah.desc} • <span className="text-white/60">{sunnah.timeHint}</span></p>
                                        <p className="text-xs text-gray-500 italic font-serif leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all duration-700 opacity-80 group-hover:opacity-100">"{sunnah.virtue}"</p>
                                    </div>

                                    <button
                                        onClick={() => handleSunnahToggle(sunnah.id)}
                                        className={`size-16 rounded-[1.5rem] flex items-center justify-center border transition-all duration-500 relative overflow-hidden ${sunnahs[sunnah.id] ? 'bg-emerald-500 border-white/30 scale-110 shadow-emerald-glow' : 'bg-white/5 border-white/10 hover:border-gold/50 hover:bg-gold/10'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className={`material-symbols-outlined text-2xl transition-all duration-500 ${sunnahs[sunnah.id] ? 'text-white font-black scale-125' : 'text-gray-600 group-hover:text-gold-bright'}`}>
                                            {sunnahs[sunnah.id] ? 'done_all' : 'add'}
                                        </span>
                                    </button>
                                </div>

                                {sunnahs[sunnah.id] && (
                                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600 animate-in fade-in slide-in-from-left duration-1000 shadow-emerald-glow"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Athkar;
