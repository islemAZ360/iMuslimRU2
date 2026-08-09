import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DhikrStats } from '../types';

const Stats: React.FC = () => {
    const navigate = useNavigate();
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
    const [displayedInsight, setDisplayedInsight] = useState('');

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

    useEffect(() => {
        if (insight) {
            setDisplayedInsight('');
            let i = 0;
            const interval = setInterval(() => {
                i++;
                setDisplayedInsight(insight.substring(0, i));
                if (i >= insight.length) clearInterval(interval);
            }, 30);
            return () => clearInterval(interval);
        }
    }, [insight]);

    const totalDhikr = Object.values(dhikrStats).reduce((sum, val) => sum + val, 0);
    const mostActiveCategory = Object.entries(dhikrStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    const quranPercentage = Math.min(100, Math.round((quranProgress / 30) * 100));

    // Spiritual Rank Calculation
    const currentXP = (totalDhikr * 1) + (totalFard * 50) + (totalSunnah * 20);
    const ranks = [
        { xp: 0, ar: 'البداية', en: 'Beginner', ru: 'Новичок', icon: '🌱' },
        { xp: 1000, ar: 'الذاكر', en: 'Rememberer', ru: 'Поминающий', icon: '🌿' },
        { xp: 5000, ar: 'المحافظ', en: 'Maintainer', ru: 'Соблюдающий', icon: '🛡️' },
        { xp: 15000, ar: 'الأوّاب', en: 'Oft-Returning', ru: 'Кающийся', icon: '🕊️' },
        { xp: 50000, ar: 'العابد', en: 'Worshipper', ru: 'Поклоняющийся', icon: '⭐' },
        { xp: 100000, ar: 'المقرّب', en: 'The Close One', ru: 'Приближенный', icon: '👑' }
    ];
    let currentRankIndex = 0;
    for (let i = 0; i < ranks.length; i++) {
        if (currentXP >= ranks[i].xp) currentRankIndex = i;
        else break;
    }
    const currentRank = ranks[currentRankIndex];
    const nextRank = currentRankIndex < ranks.length - 1 ? ranks[currentRankIndex + 1] : null;
    const progressToNext = nextRank ? ((currentXP - currentRank.xp) / (nextRank.xp - currentRank.xp)) * 100 : 100;

    // Rings calculations (Weekly basis)
    const fardProgress = Math.min((totalFard / 35) * 100, 100);
    const sunnahProgress = Math.min((totalSunnah / 50) * 100, 100); // 50 is a good weekly sunnah target
    const dhikrProgress = Math.min((totalDhikr / 5000) * 100, 100); // 5000 is a good baseline for visual

    const handleShareRank = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'My Spiritual Rank in iMuslim',
                    text: `Alhamdulillah! I have reached the rank of "${(currentRank as any)[language] || currentRank.en}" (${currentXP.toLocaleString()} XP) in iMuslim. Join me in my spiritual journey! 🌙`,
                });
            } catch (err) {
                console.log('Error sharing', err);
            }
        } else {
            alert(language === 'ar' ? 'عذراً، متصفحك لا يدعم المشاركة المباشرة' : 'Sorry, sharing is not supported on this browser');
        }
    };


    return (
        <div className="pb-32 pt-8 px-4 flex flex-col items-center min-h-screen animate-in fade-in duration-500" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Header */}
            <div className="text-center mb-8 relative w-full mt-4">
                <h1 className="font-arabic text-3xl text-gold-gradient mb-2">{t('statistics') || 'الإحصائيات'}</h1>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-px w-8 bg-gold/30"></div>
                    <p className="text-[10px] font-bold text-emerald-light uppercase tracking-[0.2em]">{t('prayer_analytics') || 'التحليلات الروحية'}</p>
                    <div className="h-px w-8 bg-gold/30"></div>
                </div>
            </div>

            {/* SPIRITUAL RANK WIDGET */}
            <div className="w-full mb-6">
                <div className="relative p-[1px] rounded-2xl bg-gradient-to-b from-gold/50 via-gold/10 to-transparent overflow-hidden group">
                    <div className="absolute inset-0 bg-gold/5 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    <div className="relative rounded-[15px] bg-[#020402] p-5">
                        <div className="absolute inset-0 islamic-pattern-bg opacity-20 mix-blend-overlay"></div>
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="size-14 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(212,175,55,0.2)] mb-3 relative">
                                <div className="absolute inset-0 rounded-full border-t border-gold animate-spin-slow"></div>
                                {currentRank.icon}
                            </div>
                            
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] text-gold/70 uppercase tracking-widest">{language === 'ar' ? 'الرتبة الروحية' : 'Spiritual Rank'}</span>
                                <button onClick={handleShareRank} className="p-1 rounded-full bg-gold/10 text-gold hover:bg-gold/20 transition-colors">
                                    <span className="material-symbols-outlined text-[14px]">share</span>
                                </button>
                            </div>
                            
                            <h2 className="text-2xl font-arabic font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-dark mb-4">
                                {(currentRank as any)[language] || currentRank.en}
                            </h2>
                            
                            <div className="w-full">
                                <div className="flex justify-between items-end mb-1 px-1">
                                    <span className="text-[9px] text-white/40">{currentXP.toLocaleString()} XP</span>
                                    {nextRank && <span className="text-[9px] text-gold/60">{nextRank.xp.toLocaleString()} XP</span>}
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                    <div 
                                        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-full transition-all duration-1000 shadow-[0_0_10px_gold]"
                                        style={{ width: `${progressToNext}%` }}
                                    ></div>
                                </div>
                                {nextRank && (
                                    <p className="text-center text-[9px] text-white/30 mt-2">
                                        {language === 'ar' ? `باقي ${(nextRank.xp - currentXP).toLocaleString()} نقطة لرتبة ${(nextRank as any)[language]}` : `${(nextRank.xp - currentXP).toLocaleString()} XP to ${(nextRank as any)[language]}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Insight Banner */}
            {insight && (
                <div className="w-full mb-6">
                    <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-emerald-500/40 via-emerald-500/10 to-emerald-500/40 animate-pulse-glow">
                        <div className="bg-[#050A08] rounded-[15px] p-4 flex items-center gap-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <span className="material-symbols-outlined text-emerald-400 text-3xl relative z-10 animate-bounce-subtle">psychology</span>
                            <div className="relative z-10 flex-1 min-h-[48px] flex flex-col justify-center">
                                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    {t('ai_spiritual_insight') || (language === 'ar' ? 'رؤية ذكية' : 'AI Insight')}
                                    <span className="flex h-1.5 w-1.5 relative">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                    </span>
                                </p>
                                <p className="text-sm font-serif text-white/90 leading-tight">
                                    {displayedInsight}
                                    <span className="inline-block w-1 h-3.5 ml-0.5 bg-emerald-500/50 animate-pulse align-middle"></span>
                                </p>
                            </div>
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

            {/* SOUL ACTIVITY RINGS */}
            <div className="w-full mb-6 bg-gradient-to-br from-black to-[#050A08] border border-white/5 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
                <div className="absolute right-0 bottom-0 w-48 h-48 bg-gold/5 blur-[80px] rounded-full pointer-events-none"></div>
                
                <h3 className="font-arabic text-xl text-gold-light mb-6 text-center">{language === 'ar' ? 'حلقات الروح' : 'Soul Rings'}</h3>
                
                <div className="flex items-center justify-between gap-4">
                    <div className="relative size-32 shrink-0">
                        <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
                            {/* Fard Ring (Green) */}
                            <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-transparent stroke-emerald-900/40" />
                            <circle cx="50" cy="50" r="42" strokeWidth="8" className="fill-transparent stroke-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.5)] transition-all duration-1000 ease-out" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={(2 * Math.PI * 42) * (1 - (fardProgress / 100))} strokeLinecap="round" />
                            
                            {/* Sunnah Ring (Gold) */}
                            <circle cx="50" cy="50" r="30" strokeWidth="8" className="fill-transparent stroke-gold-900/30" />
                            <circle cx="50" cy="50" r="30" strokeWidth="8" className="fill-transparent stroke-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.5)] transition-all duration-1000 delay-150 ease-out" strokeDasharray={2 * Math.PI * 30} strokeDashoffset={(2 * Math.PI * 30) * (1 - (sunnahProgress / 100))} strokeLinecap="round" />
                            
                            {/* Dhikr Ring (Blue) */}
                            <circle cx="50" cy="50" r="18" strokeWidth="8" className="fill-transparent stroke-blue-900/40" />
                            <circle cx="50" cy="50" r="18" strokeWidth="8" className="fill-transparent stroke-blue-500 drop-shadow-[0_0_6px_rgba(59,130,246,0.5)] transition-all duration-1000 delay-300 ease-out" strokeDasharray={2 * Math.PI * 18} strokeDashoffset={(2 * Math.PI * 18) * (1 - (dhikrProgress / 100))} strokeLinecap="round" />
                        </svg>
                        
                        {/* Perfect Days Flame Center */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            {perfectDays > 0 ? (
                                <div className="relative flex flex-col items-center group">
                                    <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-md animate-pulse"></div>
                                    <span className="material-symbols-outlined text-orange-400 text-xl animate-bounce-subtle drop-shadow-[0_0_8px_rgba(249,115,22,0.8)] z-10">local_fire_department</span>
                                    <span className="text-[10px] font-bold text-white z-10">{perfectDays}</span>
                                </div>
                            ) : (
                                <span className="material-symbols-outlined text-white/10 text-xl">mosque</span>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 flex-1 justify-center">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-3 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></div>
                                <span className="text-[10px] text-white/80 uppercase tracking-wider">{language === 'ar' ? 'الفريضة' : 'Fard'}</span>
                            </div>
                            <span className="text-[11px] font-bold text-white">{totalFard}<span className="text-white/40 text-[9px]">/35</span></span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-3 rounded-full bg-gold shadow-[0_0_5px_rgba(212,175,55,0.8)]"></div>
                                <span className="text-[10px] text-white/80 uppercase tracking-wider">{language === 'ar' ? 'السنة' : 'Sunnah'}</span>
                            </div>
                            <span className="text-[11px] font-bold text-white">{totalSunnah}<span className="text-white/40 text-[9px]">/50</span></span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-3 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.8)]"></div>
                                <span className="text-[10px] text-white/80 uppercase tracking-wider">{language === 'ar' ? 'الذكر' : 'Dhikr'}</span>
                            </div>
                            <span className="text-[11px] font-bold text-white">{totalDhikr > 1000 ? '1k+' : totalDhikr}</span>
                        </div>
                    </div>
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

            {/* DYNAMIC ACTION CARDS (SMART INTERVENTIONS) */}
            <div className="w-full flex flex-col gap-3 mb-8">
                {totalFard < 25 && (
                    <div 
                        onClick={() => navigate('/prayer')}
                        className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-red-900/40 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                                <span className="material-symbols-outlined">warning</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-red-200">
                                    {language === 'ar' ? 'تدارك ما فاتك' : 'Catch up on Prayers'}
                                </span>
                                <span className="text-[10px] text-red-300/70">
                                    {language === 'ar' ? 'بعض صلواتك ناقصة هذا الأسبوع' : 'You missed some prayers this week'}
                                </span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-red-400/50 group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                    </div>
                )}
                
                {totalDhikr < 500 && (
                    <div 
                        onClick={() => navigate('/athkar')}
                        className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-blue-900/40 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                                <span className="material-symbols-outlined">water_drop</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-blue-200">
                                    {language === 'ar' ? 'قلبك يحتاج إلى الطمأنينة' : 'Your heart needs Dhikr'}
                                </span>
                                <span className="text-[10px] text-blue-300/70">
                                    {language === 'ar' ? 'ابدأ جلسة تسبيح سريعة الآن' : 'Start a quick Tasbih session now'}
                                </span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-blue-400/50 group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                    </div>
                )}

                {quranProgress === 0 && (
                    <div 
                        onClick={() => navigate('/ramadan')}
                        className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-amber-900/40 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center">
                                <span className="material-symbols-outlined">menu_book</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-amber-200">
                                    {language === 'ar' ? 'ابدأ وردك القرآني' : 'Start your Quran Journey'}
                                </span>
                                <span className="text-[10px] text-amber-300/70">
                                    {language === 'ar' ? 'لم تقرأ شيئاً من الختمة بعد' : 'You haven\'t started your Khatmah'}
                                </span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-amber-400/50 group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                    </div>
                )}
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
                                <div 
                                    key={cat} 
                                    onClick={() => navigate('/athkar')}
                                    className="group flex flex-col gap-2 cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors -mx-2"
                                >
                                    <div className="flex justify-between items-end px-1">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-gray-500 group-hover:text-gold group-hover:border-gold/40 group-hover:bg-gold/10 transition-all">
                                                <span className="material-symbols-outlined text-xs">
                                                    {cat === 'Morning' ? 'wb_twilight' : cat === 'Evening' ? 'dark_mode' : cat === 'Istighfar' ? 'auto_fix_high' : 'favorite'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{t(cat.toLowerCase()) || cat}</span>
                                                <span className="text-[8px] text-gold/0 group-hover:text-gold/80 transition-colors uppercase tracking-widest">{language === 'ar' ? 'اضغط للبدء' : 'Tap to start'}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-serif font-bold text-white">{val.toLocaleString()}</span>
                                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">{t('counts') || 'Counts'}</span>
                                        </div>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mx-1">
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
