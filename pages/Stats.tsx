import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { DhikrStats } from '../types';

const Stats: React.FC = () => {
    const { t, language } = useLanguage();
    const today = new Date().toISOString().split('T')[0];

    // Stats State
    const [dhikrStats, setDhikrStats] = useState<DhikrStats>({});
    const [dailyTotal, setDailyTotal] = useState(0);
    const [weeklyTrend, setWeeklyTrend] = useState<number[]>([]);
    const [insight, setInsight] = useState('');

    useEffect(() => {
        // Load Dhikr Category Stats
        const savedStats = localStorage.getItem('dhikr_stats');
        if (savedStats) setDhikrStats(JSON.parse(savedStats));

        // Load Daily Total
        const savedDaily = localStorage.getItem(`dhikr_daily_${today}`);
        if (savedDaily) setDailyTotal(parseInt(savedDaily, 10));

        // Load Weekly Trend (Last 7 days)
        const trendData = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = parseInt(localStorage.getItem(`dhikr_daily_${dateStr}`) || '0', 10);
            trendData.push(count);
        }
        setWeeklyTrend(trendData);

        // Generate Smart Insight
        const total = Object.values(JSON.parse(savedStats || '{}')).reduce((a: number, b: number) => a + b, 0) as number;
        if (total === 0) {
            setInsight(language === 'ar' ? "ابدأ رحلتك الروحية اليوم بذكر الله." : "Start your spiritual journey today with Dhikr.");
        } else if (trendData[6] > trendData[5]) {
            setInsight(language === 'ar' ? "ما شاء الله، نشاطك في ازدياد!" : "MashaAllah, your devotion is increasing!");
        } else {
            setInsight(language === 'ar' ? "ثابر على الذكر، فالقليل الدائم خير." : "Keep valid consistancy, consistent small deeds are beloved.");
        }
    }, [today, language]);

    const totalDhikr = Object.values(dhikrStats).reduce((sum, val) => sum + val, 0);
    const mostActiveCategory = Object.entries(dhikrStats).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    const maxTrend = Math.max(...weeklyTrend, 10); // Avoid division by zero, min scale 10

    return (
        <div className="pb-32 pt-8 px-4 flex flex-col items-center min-h-screen animate-in fade-in duration-500" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Header */}
            <div className="text-center mb-8 relative w-full">
                <h1 className="font-arabic text-3xl text-gold-gradient mb-2">{t('statistics')}</h1>
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="h-px w-8 bg-gold/30"></div>
                    <p className="text-[10px] font-bold text-emerald-light uppercase tracking-[0.2em]">Spiritual Analytics</p>
                    <div className="h-px w-8 bg-gold/30"></div>
                </div>
            </div>

            {/* Smart Insight Banner */}
            {insight && (
                <div className="w-full mb-6">
                    <div className="bg-emerald-900/40 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
                        <span className="material-symbols-outlined text-emerald-400 text-3xl">psychology</span>
                        <div>
                            <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mb-1">AI Spiritual Insight</p>
                            <p className="text-sm font-serif text-white italic">"{insight}"</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Summary Cards */}
            <div className="grid grid-cols-2 gap-3 w-full mb-6">
                <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-gold/30 rounded-2xl p-5 relative overflow-hidden">
                    <p className="text-[9px] font-bold text-gold/60 uppercase tracking-widest mb-1">Total Dhikr</p>
                    <h2 className="text-3xl font-serif font-bold text-white mb-1">{totalDhikr.toLocaleString()}</h2>
                    <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-bold uppercase">
                        <span className="material-symbols-outlined text-[10px]">trending_up</span>
                        Lifetime
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-900/40 to-black border border-gold/30 rounded-2xl p-5 relative overflow-hidden">
                    <p className="text-[9px] font-bold text-gold/60 uppercase tracking-widest mb-1">Most Active</p>
                    <h2 className="text-2xl font-serif font-bold text-white mb-1 truncate">{mostActiveCategory}</h2>
                    <div className="text-[8px] text-gold/80 font-bold uppercase">Main Focus</div>
                </div>
            </div>

            {/* Weekly Activity Real Data Chart */}
            <div className="w-full bg-[#050A08] border border-gold/10 rounded-2xl p-6 relative overflow-hidden mb-6">
                <h3 className="font-serif font-bold text-white text-lg mb-6 relative z-10 flex items-center gap-3">
                    <div className="size-1 rounded-full bg-gold"></div>
                    Weekly Devotion Trend
                </h3>

                <div className="h-40 w-full relative flex items-end justify-between px-2 gap-2">
                    {weeklyTrend.map((val, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-3 group relative h-full justify-end">
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gold text-black text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                {val}
                            </div>
                            <div
                                className="w-full max-w-[12px] bg-gradient-to-t from-gold/5 via-gold/40 to-gold rounded-full relative transition-all duration-500"
                                style={{ height: `${Math.max((val / maxTrend) * 100, 5)}%` }} // Min 5% height for visual
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
                            <h3 className="font-arabic text-2xl text-gold">إحصائيات الأذكار</h3>
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
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] group-hover:text-white transition-colors">{cat}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-serif font-bold text-white">{val.toLocaleString()}</span>
                                            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Counts</span>
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
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Spiritual data pending...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Stats;
