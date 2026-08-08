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
    const [showResetModal, setShowResetModal] = useState(false);

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
        setShowResetModal(true);
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
                <div className="w-full mb-6 rounded-2xl border border-gold/20 bg-black/40 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/30">
                            <span className="material-symbols-outlined text-gold-bright text-xl">tips_and_updates</span>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold text-gold-bright uppercase tracking-[0.3em] mb-1">{t('divine_guidance')}</h4>
                            <p className="text-sm text-white/90 font-medium">{t('blessed_time_for')} <span className="text-gold-bright font-bold">{t(activeCategory.toLowerCase()) || activeCategory} {t('athkar')}</span>.</p>
                        </div>
                    </div>
                    <button onClick={() => setShowSmartTip(false)} className="size-9 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                        <span className="material-symbols-outlined text-md">close</span>
                    </button>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-8 relative w-full">
                <h1 className="font-arabic text-3xl text-gold-bright mb-3 tracking-wide">{t('athkar')}</h1>
                <div className="flex items-center justify-center gap-4 mb-5">
                    <div className="h-px w-10 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                    <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-[0.5em]">{t('faith_progress')}</p>
                    <div className="h-px w-10 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                </div>

                {/* Daily Goal Tracker */}
                <div className="max-w-[280px] mx-auto p-4 rounded-2xl bg-black/40 border border-white/5">
                    <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase mb-2 tracking-widest">
                        <span>{t('spiritual_journey')}</span>
                        <span className="text-gold-bright">{dailyTotal} / {DAILY_GOAL}</span>
                    </div>
                    <div className="h-2 w-full bg-black/60 rounded-full overflow-hidden border border-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-gold/40 via-gold-bright to-gold/40 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((dailyTotal / DAILY_GOAL) * 100, 100)}%` }}
                        >
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="w-full overflow-x-auto no-scrollbar mb-8 pb-2">
                <div className="flex gap-3 min-w-max px-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategorySelect(cat.id)}
                            className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border transition-all duration-300 group/cat ${activeCategory === cat.id ? 'bg-emerald-900/30 border-gold-bright scale-105' : 'bg-black/60 border-white/10 hover:border-gold/40'}`}
                        >
                            <div className={`size-12 rounded-xl flex items-center justify-center border ${activeCategory === cat.id ? 'bg-gold/20 border-gold-bright' : 'bg-white/5 border-white/10 group-hover/cat:bg-white/10'}`}>
                                <span className={`material-symbols-outlined text-2xl ${activeCategory === cat.id ? 'text-gold-bright' : 'text-white/30 group-hover/cat:text-gold/60'}`}>
                                    {cat.icon}
                                </span>
                            </div>
                            <div className="text-center">
                                <p className={`text-[9px] font-bold uppercase tracking-[0.25em] ${activeCategory === cat.id ? 'text-gold-bright' : 'text-gray-500'}`}>{t(cat.id.toLowerCase()) || cat.id}</p>
                                <p className="font-arabic text-sm text-white/70 mt-0.5">{cat.label}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Tasbih Card */}
            <div className="w-full rounded-3xl bg-gradient-to-b from-emerald-950/90 to-black border border-gold/20 p-5 relative overflow-hidden mb-10">
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-full flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 border border-gold/20">
                            <div className="size-2 rounded-full bg-gold"></div>
                            <span className="text-[10px] font-bold text-gold-bright uppercase tracking-[0.3em]">{t(activeCategory.toLowerCase()) || activeCategory} {t('ritual')}</span>
                        </div>
                        <button onClick={() => setTarget(target === 33 ? 100 : 33)} className="px-4 py-2 rounded-full bg-white/5 border border-white/20 text-[10px] font-bold text-white uppercase tracking-[0.3em] hover:bg-white/10 hover:border-gold/40 transition-all">
                            {t('goal')}: {target}
                        </button>
                    </div>

                    <div className="min-h-[120px] flex flex-col items-center justify-center text-center max-w-[320px]">
                        <h3 className="font-arabic text-3xl text-gold-bright mb-4 leading-relaxed">
                            {currentDhikr.arabic}
                        </h3>
                        <p className="text-sm font-serif italic text-gray-400 mb-2 leading-relaxed opacity-80">
                            "{currentDhikr.translation}"
                        </p>
                    </div>

                    {/* Counter Circle */}
                    <div onClick={handleCount} className="relative size-64 flex items-center justify-center my-8 cursor-pointer active:scale-95 transition-all select-none tap-highlight-transparent group/counter">
                        <div className="absolute inset-0 rounded-full border-[8px] border-[#1a1508] bg-gradient-to-br from-gold/10 to-transparent"></div>

                        <svg className="absolute inset-0 size-full -rotate-90 p-3">
                            <circle cx="50%" cy="50%" r="90" stroke="#0a0a0a" strokeWidth="8" fill="transparent" />
                            <circle
                                cx="50%" cy="50%" r="90"
                                stroke="url(#goldGradient)"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 90}
                                strokeDashoffset={(2 * Math.PI * 90) - (count / target) * (2 * Math.PI * 90)}
                                strokeLinecap="round"
                                className="transition-all duration-500 ease-out"
                            />
                            <defs>
                                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#D4AF37" />
                                    <stop offset="50%" stopColor="#F9E496" />
                                    <stop offset="100%" stopColor="#AA771C" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <div className="size-48 rounded-full bg-[#030605] border border-gold/25 flex flex-col items-center justify-center relative z-10">
                            <span className="text-6xl font-serif font-black text-white leading-none tracking-tighter">{count}</span>
                            <div className="h-0.5 w-16 bg-gradient-to-r from-transparent via-gold-bright/60 to-transparent my-3"></div>
                            <span className="text-[10px] font-bold text-gold-bright uppercase tracking-[0.4em] opacity-80">Count</span>
                        </div>
                    </div>

                    <button onClick={handleReset} className="flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-gold-bright hover:border-gold-bright/50 hover:bg-gold/5 transition-all active:scale-90">
                        <span className="material-symbols-outlined text-sm">restart_alt</span>
                        Reset Session
                    </button>
                </div>
            </div>

            {/* Encyclopedia with "Why?" (Benefits) logic */}
            <div className="w-full mb-12">
                <div className="flex items-center justify-between mb-6 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-9 bg-gold-bright rounded-full"></div>
                        <div>
                            <h3 className="text-2xl font-arabic text-gold-bright">موسوعة الأذكار</h3>
                            <p className="text-[11px] font-bold text-emerald-300 uppercase tracking-[0.4em]">Spiritual Encyclopedia</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {athkarData[activeCategory as keyof typeof athkarData]?.map((dhikr, idx) => (
                        <div key={idx} className="relative rounded-2xl bg-emerald-black/40 border border-white/10 p-5 overflow-hidden">
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div className="size-8 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-xs text-gold-bright font-bold">{idx + 1}</div>
                                <p className="font-arabic text-xl text-white text-right flex-1 leading-relaxed">{dhikr.arabic}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-black/60 border border-white/5 mb-4">
                                <p className="text-sm text-gray-400 italic mb-3 leading-loose opacity-90">"{dhikr.translation}"</p>
                                {dhikr.benefit && (
                                    <div className="mt-3 flex gap-3 items-start p-3 rounded-xl bg-gold/5 border border-gold/10">
                                        <span className="material-symbols-outlined text-gold-bright text-lg mt-0.5">auto_awesome</span>
                                        <p className="text-xs text-gold/90 font-medium leading-relaxed italic">{dhikr.benefit}</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center px-1">
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 uppercase tracking-[0.2em]">Repeats: {dhikr.count}x</span>
                                </div>
                                <button
                                    onClick={() => {
                                        setTarget(dhikr.count);
                                        setCount(0);
                                        window.scrollTo({ top: 350, behavior: 'smooth' });
                                    }}
                                    className="px-5 py-2.5 rounded-xl bg-gold-bright text-black text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-gold-light transition-all active:scale-95"
                                >
                                    Engage Ritual <span className="material-symbols-outlined text-sm">auto_fix_high</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sunnah & Nawafil Tracker */}
            <div className="w-full pb-10">
                <div className="flex items-center justify-between mb-6 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-9 bg-emerald-500 rounded-full"></div>
                        <div>
                            <h3 className="text-2xl font-arabic text-white">السنن والرواتب</h3>
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-[0.4em]">Prophetic Traditions</p>
                        </div>
                    </div>
                    {/* 12-Rak'ah Challenge Progress */}
                    <div className="flex flex-col items-end bg-black/40 p-3 rounded-2xl border border-gold/10">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="material-symbols-outlined text-gold-bright text-sm">home_work</span>
                            <span className="text-[9px] font-bold text-gold-bright uppercase tracking-widest">Jannah Palace</span>
                        </div>
                        <div className="flex gap-1.5">
                            {Array.from({ length: RAWATIB_GOAL }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`size-2 rounded-full transition-colors ${i < completedRawatib ? 'bg-gold-bright' : 'bg-white/5 border border-white/10'}`}
                                ></div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                    {sunnahData.map((sunnah) => {
                        const isHighlighted = (nextPrayer && sunnah.timeHint.includes(nextPrayer)) ||
                            (nextPrayer === 'Fajr' && sunnah.id === 'tahajjud_prayer') ||
                            (nextPrayer === 'Dhuhr' && sunnah.id === 'duha_prayer');

                        return (
                            <div
                                key={sunnah.id}
                                className={`relative rounded-2xl bg-emerald-black/30 border overflow-hidden ${isHighlighted ? 'border-gold-bright/60' : 'border-white/5 hover:border-gold/30'}`}
                            >
                                {isHighlighted && (
                                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-gold-bright text-black text-[9px] font-black uppercase tracking-[0.3em] rounded-bl-2xl z-10">
                                        Active Grace
                                    </div>
                                )}

                                <div className="p-5 flex items-center gap-4">
                                    <div className={`size-14 rounded-2xl flex items-center justify-center border transition-all ${sunnahs[sunnah.id] ? 'bg-gold-bright border-gold' : 'bg-white/5 border-white/10 group-hover:bg-gold/10 group-hover:border-gold/40'}`}>
                                        <span className={`material-symbols-outlined text-2xl ${sunnahs[sunnah.id] ? 'text-black' : 'text-gold/30'}`}>
                                            {sunnah.icon}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-3 mb-1">
                                            <h4 className="font-arabic text-xl text-white">{sunnah.name}</h4>
                                            <span className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest">{sunnah.rakahs} Rak'ahs</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-gold-bright/70 uppercase tracking-[0.25em] mb-1">{sunnah.desc} • <span className="text-white/60">{sunnah.timeHint}</span></p>
                                        <p className="text-xs text-gray-500 italic font-serif leading-relaxed line-clamp-1">"{sunnah.virtue}"</p>
                                    </div>

                                    <button
                                        onClick={() => handleSunnahToggle(sunnah.id)}
                                        className={`size-12 rounded-xl flex items-center justify-center border transition-all ${sunnahs[sunnah.id] ? 'bg-emerald-500 border-white/30' : 'bg-white/5 border-white/10 hover:border-gold/50 hover:bg-gold/10'}`}
                                    >
                                        <span className={`material-symbols-outlined text-xl ${sunnahs[sunnah.id] ? 'text-white' : 'text-gray-600 group-hover:text-gold-bright'}`}>
                                            {sunnahs[sunnah.id] ? 'done_all' : 'add'}
                                        </span>
                                    </button>
                                </div>

                                {sunnahs[sunnah.id] && (
                                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-600"></div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Custom Reset Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-[100] max-w-md mx-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-emerald-950/90 border border-gold/30 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 size-32 bg-gold/10 rounded-full blur-2xl pointer-events-none"></div>
                        
                        <div className="flex flex-col items-center text-center relative z-10">
                            <div className="size-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-red-400 text-3xl">restart_alt</span>
                            </div>
                            
                            <h3 className="font-arabic text-2xl text-gold-bright mb-2">إعادة تعيين الجلسة</h3>
                            <p className="text-sm font-medium text-gray-300 mb-6">
                                Are you sure you want to reset the session counter? This action cannot be undone.
                            </p>
                            
                            <div className="flex w-full gap-3">
                                <button 
                                    onClick={() => setShowResetModal(false)}
                                    className="flex-1 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-gray-400 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        setCount(0);
                                        setShowResetModal(false);
                                    }}
                                    className="flex-1 py-3.5 rounded-2xl bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 uppercase tracking-widest hover:bg-red-500/30 hover:text-red-300 transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Athkar;
