import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DhikrStats } from '../types';

const Stats: React.FC = () => {
    const { t, language } = useLanguage();
    const today = new Date().toISOString().split('T')[0];

    // Stats State
    const [dhikrStats, setDhikrStats] = useState<DhikrStats>({});
    const [weeklyDhikrTrend, setWeeklyDhikrTrend] = useState<number[]>([]);
    
    const [weeklyPrayerTrend, setWeeklyPrayerTrend] = useState<number[]>([]);
    const [perfectDays, setPerfectDays] = useState(0);
    const [totalFard, setTotalFard] = useState(0);
    const [totalSunnah, setTotalSunnah] = useState(0);
    
    // Ramadan State
    const [quranProgress, setQuranProgress] = useState(0);

    const [insight, setInsight] = useState('');

    useEffect(() => {
        let statsObj: any = {};
        // Load Dhikr Category Stats
        try {
            const savedStats = localStorage.getItem('dhikr_stats');
            if (savedStats && savedStats !== '[object Object]') {
                statsObj = JSON.parse(savedStats);
                setDhikrStats(statsObj);
            }
        } catch (e) { console.error('Error parsing dhikr_stats', e); }

        const dTrend = [];
        const pTrend = [];
        let pDays = 0;
        let tFard = 0;
        let tSunnah = 0;

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            
            // Dhikr
            const dCount = parseInt(localStorage.getItem(`dhikr_daily_${dateStr}`) || '0', 10);
            dTrend.push(isNaN(dCount) ? 0 : dCount);

            // Prayer
            try {
                const savedPrayers = localStorage.getItem(`prayer_tracker_${dateStr}`);
                let fardCount = 0;
                if (savedPrayers && savedPrayers !== '[object Object]') {
                    const pObj = JSON.parse(savedPrayers);
                    const count = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].filter(p => pObj[p]).length;
                    fardCount = count;
                    tFard += count;
                    if (count === 5) pDays++;
                }
                pTrend.push(fardCount);
            } catch (e) { pTrend.push(0); }

            // Sunnah
            try {
                const savedSunnah = localStorage.getItem(`sunnah_tracker_${dateStr}`);
                if (savedSunnah && savedSunnah !== '[object Object]') {
                    const sObj = JSON.parse(savedSunnah);
                    tSunnah += Object.values(sObj).filter(Boolean).length;
                }
            } catch (e) {}
        }
        
        setWeeklyDhikrTrend(dTrend);
        setWeeklyPrayerTrend(pTrend);
        setPerfectDays(pDays);
        setTotalFard(tFard);
        setTotalSunnah(tSunnah);

        // Load Ramadan Quran Tracker
        let quranJuzCount = 0;
        try {
            const savedJuz = localStorage.getItem('quran_tracker_ramadan');
            if (savedJuz && savedJuz !== '[object Object]') {
                const juzArr = JSON.parse(savedJuz);
                quranJuzCount = Array.isArray(juzArr) ? juzArr.length : 0;
                setQuranProgress(quranJuzCount);
            }
        } catch (e) { console.error(e); }

        // Generate Smart Insight
        const totalD = Object.values(statsObj).reduce((a: any, b: any) => (Number(a) || 0) + (Number(b) || 0), 0) as number;
        
        if (quranJuzCount > 0 && pDays === 7) {
            setInsight(language === 'ar' ? "أنت تجمع بين نور القرآن وكمال الصلاة، استمر في هذا العطاء الروحي الرائع!" : (language === 'ru' ? "Вы сочетаете свет Корана и идеальные молитвы, так держать!" : "You combine the light of Quran and perfect prayers, keep it up!"));
        } else if (pDays === 7) {
            setInsight(language === 'ar' ? "أسبوع مثالي في الصلاة! تقبل الله طاعتك." : (language === 'ru' ? "Идеальная неделя молитв! Пусть Аллах примет." : "A perfect week of prayers! May Allah accept."));
        } else if (quranJuzCount > 0 && dTrend[6] > 100) {
            setInsight(language === 'ar' ? "قراءة القرآن وكثرة الذكر تجلي القلب، يومك مليء بالبركات!" : (language === 'ru' ? "Чтение Корана и частый зикр очищают сердце!" : "Quran and Dhikr purify the heart, your day is full of blessings!"));
        } else if (pTrend[6] === 5) {
            setInsight(language === 'ar' ? "ما شاء الله، أتممت صلواتك الخمس اليوم، حافظ عليها!" : (language === 'ru' ? "МашаАллах, вы завершили 5 молитв сегодня!" : "MashaAllah, you completed all 5 prayers today!"));
        } else if (tSunnah > 10) {
            setInsight(language === 'ar' ? "حرصك على السنن الرواتب رائع، استمر." : (language === 'ru' ? "Ваша преданность Сунне прекрасна." : "Your dedication to Sunnah prayers is beautiful."));
        } else if (totalD === 0 && tFard === 0) {
            setInsight(language === 'ar' ? "ابدأ رحلتك الروحية اليوم بذكر الله والصلاة." : (language === 'ru' ? "Начните свое духовное путешествие сегодня." : "Start your spiritual journey today with Dhikr."));
        } else if (dTrend[6] > dTrend[5]) {
            setInsight(language === 'ar' ? "ما شاء الله، نشاطك في الذكر بازدياد!" : (language === 'ru' ? "МашаАллах, ваша преданность растет!" : "MashaAllah, your devotion is increasing!"));
        } else {
            setInsight(language === 'ar' ? "ثابر على الطاعة، فالقليل الدائم خير." : (language === 'ru' ? "Продолжайте, постоянство любимо Аллахом." : "Keep consistency, small consistent deeds are beloved."));
        }
    }, [today, language]);

    const totalDhikr = Object.values(dhikrStats).reduce((sum, val) => sum + val, 0);
    const mostActiveCategory = Object.entries(dhikrStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    const quranPercentage = Math.min(100, Math.round((quranProgress / 30) * 100));

    return (
        <div className="pb-32 pt-8 px-4 flex flex-col items-center min-h-screen animate-in fade-in duration-500" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Header */}
            <div className="text-center mb-8 relative w-full">
                <h1 className="font-arabic text-3xl text-gold-gradient mb-2">{t('statistics') || 'الإحصائيات'}</h1>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-px w-8 bg-gold/30"></div>
                    <p className="text-[10px] font-bold text-emerald-light uppercase tracking-[0.2em]">{t('prayer_analytics') || 'التحليلات الروحية'}</p>
                    <div className="h-px w-8 bg-gold/30"></div>
                </div>
            </div>

            {/* Smart Insight Banner */}
            {insight && (
                <div className="w-full mb-6">
                    <div className="bg-emerald-900/40 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
                        <span className="material-symbols-outlined text-emerald-400 text-3xl">psychology</span>
                        <div>
                            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">{t('ai_spiritual_insight') || (language === 'ar' ? 'رؤية ذكية' : 'AI Insight')}</p>
                            <p className="text-sm font-serif text-white italic">"{insight}"</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Ramadan & Quran Summary Cards */}
            <div className="w-full mb-6">
                <div className="bg-gradient-to-br from-amber-900/40 to-black border border-gold/30 rounded-2xl p-5 relative overflow-hidden">
                    <div className="flex justify-between items-end mb-3">
                        <div>
                            <p className="text-[9px] font-bold text-gold/60 uppercase tracking-widest mb-1">{language === 'ar' ? 'ختم القرآن - رمضان' : 'Ramadan Quran Tracker'}</p>
                            <h2 className="text-2xl font-serif font-bold text-white mb-1">
                                {quranProgress} <span className="text-sm text-gold/60">{language === 'ar' ? 'جزء' : 'Juz'}</span>
                            </h2>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-gold-light">{quranPercentage}%</span>
                        </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-all duration-1000"
                            style={{ width: `${quranPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Prayer Summary Cards */}
            <div className="grid grid-cols-3 gap-3 w-full mb-6">
                <div className="bg-gradient-to-br from-gold/20 to-black border border-gold/30 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                    <h2 className="text-2xl font-serif font-bold text-white mb-1">{perfectDays}</h2>
                    <p className="text-[8px] font-bold text-gold uppercase tracking-widest text-center">{t('perfect_days') || (language === 'ar' ? 'أيام مثالية' : 'Perfect Days')}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                    <h2 className="text-2xl font-serif font-bold text-white mb-1">{totalFard}</h2>
                    <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest text-center">{t('fard_prayers') || (language === 'ar' ? 'صلوات الفريضة' : 'Fard Logged')}</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/30 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden">
                    <h2 className="text-2xl font-serif font-bold text-white mb-1">{totalSunnah}</h2>
                    <p className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest text-center">{t('sunnah_prayers') || (language === 'ar' ? 'السنن الرواتب' : 'Sunnah Logged')}</p>
                </div>
            </div>

            {/* Dhikr Summary Cards */}
            <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-gold/30 rounded-2xl p-5 relative overflow-hidden">
                    <p className="text-[9px] font-bold text-gold/60 uppercase tracking-widest mb-1">{t('total_dhikr') || (language === 'ar' ? 'مجموع الأذكار' : 'Total Dhikr')}</p>
                    <h2 className="text-3xl font-serif font-bold text-white mb-1">{totalDhikr.toLocaleString()}</h2>
                    <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-bold uppercase">
                        <span className="material-symbols-outlined text-[10px]">trending_up</span>
                        {t('lifetime') || (language === 'ar' ? 'طوال الوقت' : 'Lifetime')}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-gold/30 rounded-2xl p-5 relative overflow-hidden">
                    <p className="text-[9px] font-bold text-gold/60 uppercase tracking-widest mb-1">{t('most_active') || (language === 'ar' ? 'الذكر الأكثر' : 'Most Active')}</p>
                    <h2 className="text-2xl font-serif font-bold text-white mb-1 truncate">{t(mostActiveCategory.toLowerCase()) || mostActiveCategory}</h2>
                    <div className="text-[8px] text-gold/80 font-bold uppercase">{t('main_focus') || (language === 'ar' ? 'التركيز الأساسي' : 'Main Focus')}</div>
                </div>
            </div>

            {/* Weekly Prayer Trend Chart */}
            <div className="w-full bg-[#050A08] border border-gold/10 rounded-2xl p-6 relative overflow-hidden mb-6">
                <h3 className="font-serif font-bold text-white text-lg mb-6 relative z-10 flex items-center gap-3">
                    <div className="size-1 rounded-full bg-gold"></div>
                    {t('weekly_prayer_trend') || 'Weekly Prayer Trend'}
                </h3>

                <div className="h-40 w-full relative flex items-end justify-between px-2 gap-2">
                    <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none opacity-20 z-0">
                        {[5, 4, 3, 2, 1, 0].map(n => (
                            <div key={n} className="w-full h-px bg-white/20"></div>
                        ))}
                    </div>

                    {weeklyPrayerTrend.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end z-10">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold text-black text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                {val}/5
                            </div>
                            <div
                                className="w-full max-w-[12px] bg-gradient-to-t from-gold/10 via-gold/50 to-gold rounded-full relative transition-all duration-500"
                                style={{ height: `${Math.max((val / 5) * 100, 5)}%` }} // Min 5% height for visual
                            >
                            </div>
                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest font-mono">
                                {new Date(Date.now() - (6 - i) * 86400000).toLocaleDateString(language, { weekday: 'narrow' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dhikr Insights Breakdown */}
            <div className="w-full bg-black/40 border border-gold/20 rounded-2xl p-6 relative overflow-hidden mb-8">
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6 px-1">
                        <div className="flex items-center gap-3">
                            <div className="w-1.5 h-8 bg-gold rounded-full"></div>
                            <h3 className="font-arabic text-2xl text-gold">{t('dhikr_analytics') || 'إحصائيات الأذكار'}</h3>
                        </div>
                        <div className="size-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                            <span className="material-symbols-outlined text-sm">bar_chart</span>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {Object.entries(dhikrStats).length > 0 ? (
                            Object.entries(dhikrStats).sort((a, b) => b[1] - a[1]).map(([cat, val]) => (
                                <div key={cat} className="group flex flex-col gap-2">
                                    <div className="flex justify-between items-end px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-500 group-hover:text-gold group-hover:border-gold/40 transition-all">
                                                <span className="material-symbols-outlined text-xs">
                                                    {cat === 'Morning' ? 'wb_twilight' : cat === 'Evening' ? 'dark_mode' : cat === 'Istighfar' ? 'auto_fix_high' : 'favorite'}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{t(cat.toLowerCase()) || cat}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-serif font-bold text-white">{val.toLocaleString()}</span>
                                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{t('counts') || 'Counts'}</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-gold/40 to-gold rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min((val / (totalDhikr || 1)) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-12 text-center bg-white/2 rounded-3xl border border-dashed border-gold/10">
                                <span className="material-symbols-outlined text-gold/20 text-4xl mb-3">analytics</span>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">{t('spiritual_data_pending') || 'Spiritual data pending...'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Stats;
