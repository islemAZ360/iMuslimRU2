import * as React from 'react';
import { useState, useEffect } from 'react';
import { usePrayer } from '../context/PrayerContext';
import { useUser } from '../context/UserContext';
import { useCompassHeading } from '../hooks/useCompassHeading';
import Compass from '../components/Compass';
import CalendarModal from '../components/CalendarModal';
import { translations } from '../translations';
import { useNavigate } from 'react-router-dom';

const Prayer: React.FC = () => {
    const { timings, hijriDate, nextPrayer, timeRemaining, loading, calendarData, qiblaDirection, error, refresh } = usePrayer();
    const { location, settings } = useUser();
    const { heading } = useCompassHeading();
    const navigate = useNavigate();
    const [distanceToKaaba, setDistanceToKaaba] = useState<string>("...");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    // Localization
    const lang = settings.language || 'en';
    const t = (translations as any)[lang] || translations.en;
    const isRtl = lang === 'ar';

    // Daily Prayer Tracker
    const [prayedStatus, setPrayedStatus] = useState<Record<string, boolean>>({});
    
    // Simple Holiday Translator (Aladhan API sends them in English)
    const translateHoliday = (holidayEn: string) => {
        if (!holidayEn) return '';
        const h = holidayEn.toLowerCase();
        if (lang === 'ar') {
            if (h.includes('ashura')) return 'يوم عاشوراء';
            if (h.includes('mawlid')) return 'المولد النبوي الشريف';
            if (h.includes('isra')) return 'الإسراء والمعراج';
            if (h.includes('ramadan')) return 'بداية رمضان';
            if (h.includes('eid ul fitr') || h.includes('eid al fitr') || h.includes('eid-ul-fitr')) return 'عيد الفطر';
            if (h.includes('eid ul adha') || h.includes('eid al adha') || h.includes('eid-ul-adha')) return 'عيد الأضحى';
            if (h.includes('arafa')) return 'يوم عرفة';
            if (h.includes('muharram')) return 'رأس السنة الهجرية';
            if (h.includes('hassan')) return 'استشهاد الإمام الحسن';
            if (h.includes('rumi')) return 'مولد جلال الدين الرومي';
            if (h.includes('urs')) return holidayEn.replace('Urs of', 'ذكرى وفاة');
        } else if (lang === 'ru') {
            if (h.includes('ashura')) return 'Ашура';
            if (h.includes('mawlid')) return 'Мавлид ан-Наби';
            if (h.includes('isra')) return 'Исра и Мирадж';
            if (h.includes('ramadan')) return 'Начало Рамадана';
            if (h.includes('fitr')) return 'Ураза-байрам (Ид аль-Фитр)';
            if (h.includes('adha')) return 'Курбан-байрам (Ид аль-Адха)';
            if (h.includes('arafa')) return 'День Арафат';
            if (h.includes('muharram')) return 'Исламский Новый Год';
        }
        return holidayEn;
    };

    useEffect(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const key = `prayer_tracker_${todayStr}`;
        const saved = localStorage.getItem(key);
        if (saved) setPrayedStatus(JSON.parse(saved));
        else setPrayedStatus({});
    }, []);

    const togglePrayed = (prayer: string) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const key = `prayer_tracker_${todayStr}`;
        const newStatus = { ...prayedStatus, [prayer]: !prayedStatus[prayer] };
        setPrayedStatus(newStatus);
        localStorage.setItem(key, JSON.stringify(newStatus));
    };

    // Sunnah Tracker
    const SUNNAH_PRAYERS: Record<string, { id: string, labelKey: string, type: 'before'|'after', infoKey: string }[]> = {
        Fajr: [{ id: 'fajr_before', labelKey: 'sunnah_2_before', type: 'before', infoKey: 'info_sunnah_fajr' }],
        Sunrise: [],
        Dhuhr: [
            { id: 'dhuhr_before', labelKey: 'sunnah_4_before', type: 'before', infoKey: 'info_sunnah_dhuhr_before' },
            { id: 'dhuhr_after', labelKey: 'sunnah_2_after', type: 'after', infoKey: 'info_sunnah_dhuhr_after' }
        ],
        Asr: [],
        Maghrib: [{ id: 'maghrib_after', labelKey: 'sunnah_2_after', type: 'after', infoKey: 'info_sunnah_maghrib' }],
        Isha: [{ id: 'isha_after', labelKey: 'sunnah_2_after', type: 'after', infoKey: 'info_sunnah_isha' }]
    };

    const [sunnahStatus, setSunnahStatus] = useState<Record<string, boolean>>({});
    const [activeSunnahInfo, setActiveSunnahInfo] = useState<string | null>(null);
    useEffect(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        const key = `sunnah_tracker_${todayStr}`;
        const saved = localStorage.getItem(key);
        if (saved) setSunnahStatus(JSON.parse(saved));
        else setSunnahStatus({});
    }, []);

    const toggleSunnah = (id: string) => {
        const todayStr = new Date().toISOString().split('T')[0];
        const key = `sunnah_tracker_${todayStr}`;
        const newStatus = { ...sunnahStatus, [id]: !sunnahStatus[id] };
        setSunnahStatus(newStatus);
        localStorage.setItem(key, JSON.stringify(newStatus));
    };



    // Calculate Distance to Kaaba
    useEffect(() => {
        if (location) {
            const R = 6371;
            const dLat = (21.4225 - location.lat) * (Math.PI / 180);
            const dLon = (39.8262 - location.lng) * (Math.PI / 180);
            const a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(location.lat * (Math.PI / 180)) * Math.cos(21.4225 * (Math.PI / 180)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            const d = R * c;
            setDistanceToKaaba(d.toFixed(0));
        }
    }, [location]);

    // Format Times
    const formatTime = (time: string | undefined) => {
        if (!time) return '--:--';
        const [h, m] = time.split(':');
        const hour = parseInt(h);
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} <span class="text-[10px] opacity-70">${suffix}</span>`;
    };

    // Correct 'Current Prayer' Logic
    // We want to know which prayer period we are IN.
    // After Fajr -> in Fajr (waiting for Sunrise)
    // After Sunrise -> in Dhuha (Waiting for Dhuhr) - *Sunrise is not a 'prayer' duration*
    // After Dhuhr -> in Dhuhr
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    let activePeriodName = '...';
    // If nextPrayer is Dhuhr, we are after Sunrise. 
    // If nextPrayer is Sunrise, we are after Fajr. 

    if (nextPrayer) {
        if (nextPrayer === 'Dhuhr') activePeriodName = 'Dhuha (Waiting)';
        else if (nextPrayer === 'Sunrise') activePeriodName = 'Fajr';
        else {
            const nextIndex = prayers.indexOf(nextPrayer);
            const currentIndex = nextIndex > 0 ? nextIndex - 1 : 5;
            activePeriodName = prayers[currentIndex];
        }
    }

    // Logic for "Active Now" Badge: Don't show it if it's "Sunrise" or "Dhuha" effectively, or customize text
    // Actually, user wants "Sunrise" NOT to be the big active thing if it's misleading.
    // If next is Dhuhr, we are in the morning wait. 
    // Let's just use the currentPeriodName derived above.

    // Calculate Progress dynamically
    const getProgress = () => {
        if (!timings || !nextPrayer || !activePeriodName) return 75; // fallback
        
        const parseTime = (timeStr: string, isNextDay: boolean) => {
            const [h, m] = timeStr.split(':');
            const d = new Date();
            if (isNextDay) d.setDate(d.getDate() + 1);
            d.setHours(parseInt(h), parseInt(m), 0, 0);
            return d.getTime();
        };

        const now = new Date().getTime();
        const startPrayer = activePeriodName === 'Dhuha (Waiting)' ? 'Sunrise' : activePeriodName;
        const endPrayer = nextPrayer;
        
        const startTimeStr = timings[startPrayer as keyof typeof timings] || '00:00';
        const endTimeStr = timings[endPrayer as keyof typeof timings] || '00:00';
        
        const isNextDay = endPrayer === 'Fajr' && startPrayer === 'Isha';
        
        const start = parseTime(startTimeStr.split(' ')[0], false);
        const end = parseTime(endTimeStr.split(' ')[0], isNextDay);
        
        if (now <= start || now >= end) return 100;
        
        const total = end - start;
        const elapsed = now - start;
        return Math.max(0, Math.min(100, (elapsed / total) * 100));
    };

    const progress = getProgress();

    // Next Holiday
    const nextHoliday = calendarData?.find(day => day.date.hijri.holidays && day.date.hijri.holidays.length > 0 && new Date(parseInt(day.date.timestamp) * 1000) >= new Date());

    // Prepare Calendar Days
    const today = new Date();
    const isSameDate = (d1: Date, d2: Date) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

    const calendarSubset = calendarData ? calendarData.filter(d => {
        const timestamp = parseInt(d.date.timestamp) * 1000;
        const date = new Date(timestamp);
        const diffTime = date.getTime() - today.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        return diffDays > -1 && diffDays < 10;
    }).slice(0, 10) : [];

    // Loading State
    if (loading && !timings) {
        return (
            <div className="min-h-screen bg-[#020402] flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gold/5 animate-pulse"></div>
                <div className="w-24 h-24 border-2 border-gold/30 rounded-full animate-spin-slow flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-t-gold border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    // Error state (no cached data either)
    if (!timings && error) {
        return (
            <div className="min-h-screen bg-[#020402] flex flex-col items-center justify-center px-8 text-center">
                <span className="material-symbols-outlined text-5xl text-gold/50 mb-4">cloud_off</span>
                <h2 className="text-xl font-royal font-bold text-white mb-2">Prayer times unavailable</h2>
                <p className="text-sm text-white/40 mb-6 max-w-xs leading-relaxed">{error}</p>
                <button
                    onClick={refresh}
                    className="px-6 py-3 rounded-full bg-gold/15 border border-gold/40 text-gold-200 text-xs font-bold uppercase tracking-widest hover:bg-gold/25 transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    // Background based on active period
    const getBgTheme = () => {
        switch (activePeriodName) {
            case 'Fajr': return 'bg-gradient-to-br from-[#0a1128] via-[#101b3b] to-[#020402]';
            case 'Dhuha (Waiting)': return 'bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#020402]';
            case 'Dhuhr': return 'bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#020402]';
            case 'Asr': return 'bg-gradient-to-br from-[#78350f] via-[#451a03] to-[#020402]';
            case 'Maghrib': return 'bg-gradient-to-br from-[#4c1d95] via-[#2e1065] to-[#020402]';
            case 'Isha': return 'bg-gradient-to-br from-[#020617] via-[#000000] to-[#020402]';
            default: return 'bg-[#020402]';
        }
    };

    return (
        <div className={`${getBgTheme()} font-display text-white antialiased min-h-screen relative overflow-x-hidden pb-32 transition-colors duration-1000`} dir={isRtl ? 'rtl' : 'ltr'}>

            {/* Subtle Background */}
            <div className="fixed inset-0 max-w-md mx-auto pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(212,175,55,0.05),_transparent_60%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_rgba(6,78,59,0.15),_transparent_60%)]"></div>
            </div>

            <div className="relative flex flex-col w-full z-10">

                {/* Header */}
                <header className="flex items-center justify-between px-6 pt-10 pb-6 relative z-10">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-gold-light/80 mb-2">
                            <span className="material-symbols-outlined text-sm text-gold animate-pulse">location_on</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">{location?.city || t.unknown_location || 'Unknown'}</span>
                        </div>
                        <h1 className="text-3xl font-royal font-bold tracking-tight text-transparent bg-clip-text bg-gold-metallic drop-shadow-md">
                            {hijriDate ? `${hijriDate.day} ${hijriDate.month.en}` : '...'}
                        </h1>
                        <p className="text-white/40 text-[10px] font-medium uppercase tracking-[0.2em] mt-1 pl-1">
                            {hijriDate?.year} AH • {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Daily Progress */}
                        {(() => {
                            const obligatory = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
                            const completedCount = obligatory.filter(p => prayedStatus[p]).length;
                            const strokeDasharray = `${(completedCount / 5) * 100}, 100`;
                            return (
                                <div className="flex flex-col items-center justify-center relative size-11 bg-white/5 border border-white/10 rounded-2xl shadow-[0_0_15px_rgba(212,175,55,0.05)]">
                                    <svg className="absolute inset-0 size-full transform -rotate-90 p-1.5" viewBox="0 0 36 36">
                                        <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                        <path className="text-emerald-500 drop-shadow-[0_0_3px_rgba(16,185,129,0.8)] transition-all duration-1000 ease-out" strokeDasharray={strokeDasharray} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                    </svg>
                                    <span className="text-[10px] font-bold text-gold-bright relative z-10">{completedCount}/5</span>
                                </div>
                            );
                        })()}
                        <button 
                            onClick={() => navigate('/stats')}
                            className="size-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gold-bright hover:bg-gold/10 hover:scale-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                        >
                            <span className="material-symbols-outlined text-xl">bar_chart</span>
                        </button>
                    </div>
                </header>

                {/* Background ambient lighting */}
                <div className="fixed inset-0 pointer-events-none -z-10">
                    <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-full max-w-lg h-96 bg-gold/10 blur-[100px] rounded-full opacity-50"></div>
                </div>

                    {/* HERO CARD - NEXT PRAYER */}
                    <div className="px-5 py-2 relative z-10">
                    <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-gold/60 via-gold/20 to-transparent shadow-[0_15px_40px_rgba(212,175,55,0.15)] group overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                        <div className="relative rounded-[23px] bg-emerald-950/40 backdrop-blur-xl p-6 min-h-[200px] flex flex-col justify-between">
                            {/* Islamic geometric background */}
                            <div className="absolute inset-0 islamic-pattern-bg opacity-40 mix-blend-overlay pointer-events-none"></div>
                            
                            <div className="relative z-10 flex flex-col justify-between h-full gap-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-3">
                                            <span className="relative flex h-2 w-2">
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 animate-ping"></span>
                                                <span className="absolute inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="text-[9px] font-bold text-gold uppercase tracking-widest">
                                                {activePeriodName === 'Dhuha (Waiting)' ? t.waiting_interval : t.active_now}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{t.upcoming_prayer}</span>
                                            <h2 className="text-4xl font-royal text-white tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#fff8e7] to-[#eaddcf]">
                                                {(() => {
                                                    if (!nextPrayer) return '...';
                                                    const isFriday = new Date().getDay() === 5;
                                                    if (isFriday && nextPrayer === 'Dhuhr') return (t as any)['prayer_jumuah'] || "Jumu'ah";
                                                    return (t as any)[`prayer_${nextPrayer.toLowerCase()}`] || nextPrayer;
                                                })()}
                                            </h2>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-gold/60 text-[10px] uppercase tracking-widest">Starts in</span>
                                            <p className="text-gold text-sm font-medium tracking-wide font-mono">
                                                {timeRemaining}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between pb-2">
                                    <div className="flex flex-col">
                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">{t.currently}</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white text-sm font-bold">
                                                {(() => {
                                                    const isFriday = new Date().getDay() === 5;
                                                    if (isFriday && activePeriodName === 'Dhuhr') return (t as any)['prayer_jumuah'] || "Jumu'ah";
                                                    return activePeriodName === 'Dhuha (Waiting)' ? t.waiting_interval : ((t as any)[`prayer_${activePeriodName.toLowerCase()}`] || activePeriodName);
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="size-11 border border-white/10 rounded-xl flex flex-col items-center justify-center bg-white/5">
                                        <span className="text-[8px] text-white/40">Juz</span>
                                        <span className="text-sm font-bold text-gold">14</span>
                                    </div>
                                </div>
                                
                                {/* Visual Progress Bar */}
                                <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/40 overflow-hidden backdrop-blur-sm z-20">
                                    <div 
                                        className="h-full bg-gradient-to-r from-gold/40 via-gold to-gold-bright relative transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(212,175,55,0.8)]" 
                                        style={{ width: `${progress}%` }}
                                    >
                                        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/60 to-transparent blur-[1px]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* PRAYER LIST */}
                <section className="px-5 mt-8 relative z-10">
                    <div className="flex items-center gap-4 mb-5">
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-gold/80 text-center">
                            {t.prayer_schedule}
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                    </div>

                    <div className="relative pl-6">
                        {/* Vertical Timeline Line */}
                        <div className="absolute left-[34px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-transparent via-white/10 to-transparent z-0"></div>

                        <div className="flex flex-col gap-2.5 relative z-10">
                            {prayers.map((prayer, idx) => {
                                const isNext = prayer === nextPrayer;
                                const isActive = prayer === activePeriodName;
                                const isPrayed = prayedStatus[prayer];
                                const showTracker = prayer !== 'Sunrise';
                                const isSunrise = prayer === 'Sunrise';

                                // Jumu'ah Logic
                                const isFriday = new Date().getDay() === 5;
                                const isJumuah = isFriday && prayer === 'Dhuhr';
                                const prayerNameKey = isJumuah ? 'prayer_jumuah' : `prayer_${prayer.toLowerCase()}`;
                                const prayerLabel = (t as any)[prayerNameKey] || (isJumuah ? "Jumu'ah" : prayer);
                                const prayerIcon = isJumuah ? 'diversity_3' : (prayer === 'Fajr' || prayer === 'Maghrib' ? 'wb_twilight' : (prayer === 'Isha' ? 'nights_stay' : 'wb_sunny'));

                                return (
                                    <React.Fragment key={prayer}>
                                        {/* Tahajjud Widget (Shows before Fajr if it's Isha period) */}
                                        {prayer === 'Fajr' && activePeriodName === 'Isha' && (
                                            <div className="mb-4 mt-2 ml-4 p-4 rounded-xl border border-gold/30 bg-gradient-to-r from-[#020617] to-[#0a1128] flex items-center justify-between shadow-[0_0_20px_rgba(212,175,55,0.1)] relative overflow-hidden group">
                                                <div className="absolute inset-0 islamic-pattern-bg opacity-20 pointer-events-none"></div>
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="size-10 rounded-full bg-gold/10 flex items-center justify-center text-gold-bright">
                                                        <span className="material-symbols-outlined text-[22px]">nights_stay</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-white tracking-wide">
                                                            {(t as any)['tahajjud_time'] || 'Tahajjud Time'}
                                                        </span>
                                                        <span className="text-[10px] text-white/60 mt-0.5 leading-tight max-w-[200px]">
                                                            {(t as any)['tahajjud_desc'] || 'The last third of the night has entered. A time of mercy and accepted prayers.'}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button onClick={() => navigate('/athkar')} className="px-3 py-1.5 rounded-lg bg-gold/20 text-gold-bright text-[10px] font-bold uppercase tracking-widest hover:bg-gold/30 transition-colors z-10">
                                                    {(t as any)['read_dua'] || 'Read Dua'}
                                                </button>
                                            </div>
                                        )}

                                        <div className={`
                                            flex flex-col p-4 rounded-xl border transition-all duration-500 overflow-hidden relative ml-4
                                            ${isActive ? 'bg-gradient-to-br from-gold/20 to-gold/5 border-gold/70 border-r-[6px] shadow-[0_0_25px_rgba(212,175,55,0.15)] scale-[1.02]' : (isNext ? 'bg-gold/10 border-gold/40' : (isSunrise ? 'bg-transparent border-dashed border-white/10 opacity-70 scale-95' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.08]'))}
                                        `}>
                                            {/* Timeline Node Connection */}
                                            <div className={`absolute top-1/2 -left-4 w-4 h-[2px] -translate-y-1/2 ${isActive ? 'bg-gold shadow-[0_0_8px_#D4AF37]' : 'bg-white/10'}`}></div>
                                            <div className={`absolute top-1/2 -left-6 size-4 -translate-y-1/2 rounded-full border-[3px] z-10 ${isActive ? 'bg-gold-bright border-gold-bright shadow-[0_0_12px_#D4AF37]' : (isPrayed ? 'bg-emerald-500 border-emerald-500' : 'bg-[#020402] border-white/20')}`}></div>

                                            {isActive && <div className="absolute inset-0 bg-gold/5 animate-pulse-glow rounded-xl pointer-events-none"></div>}
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    {showTracker && (
                                                        <button 
                                                            onClick={() => togglePrayed(prayer)}
                                                            className={`size-6 shrink-0 rounded-full border flex items-center justify-center transition-colors ${isPrayed ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 'border-white/20 hover:border-gold/50'}`}
                                                        >
                                                            {isPrayed && <span className="material-symbols-outlined text-[14px] text-white">check</span>}
                                                        </button>
                                                    )}
                                                    <div className="flex items-center gap-3">
                                                        <span className={`material-symbols-outlined text-xl ${isActive || isNext ? 'text-gold' : 'text-white/20'}`}>
                                                            {prayerIcon}
                                                        </span>
                                                        <span className={`font-medium tracking-wide text-sm ${isActive || isNext ? 'text-white' : 'text-white/60'} ${isJumuah ? 'text-gold-bright' : ''}`}>
                                                            {prayerLabel}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className={`font-medium font-mono text-sm ${isActive || isNext ? 'text-gold' : 'text-white/40'}`} dangerouslySetInnerHTML={{ __html: timings ? formatTime(timings[prayer as keyof typeof timings]) : '--:--' }}></span>
                                            </div>
                                    
                                    {/* SUNNAH SUB-MENU */}
                                    {(() => {
                                        const visibleSunnahs = SUNNAH_PRAYERS[prayer]?.filter(s => isPrayed ? true : s.type === 'before') || [];
                                        if (visibleSunnahs.length === 0) return null;
                                        
                                        return (
                                            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 pl-[40px] animate-in slide-in-from-top-2 fade-in duration-500 relative z-10">
                                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-gold-bright mb-1 font-arabic">
                                                    {(t as any)['sunnah_checklist'] || 'قائمة السنن والرواتب'}
                                                </h4>
                                                {visibleSunnahs.map(sunnah => (
                                                    <div key={sunnah.id} className="flex flex-col gap-1.5 group">
                                                        <div className="flex items-center justify-between bg-black/30 p-2.5 rounded-xl border border-white/10 hover:border-gold/30 transition-all shadow-sm">
                                                            <div className="flex items-center gap-3.5 flex-1 cursor-pointer" onClick={() => toggleSunnah(sunnah.id)}>
                                                                <button 
                                                                    className={`size-7 shrink-0 rounded-md border-[2px] flex items-center justify-center transition-all duration-300 ${sunnahStatus[sunnah.id] ? 'bg-gold border-gold shadow-[0_0_12px_rgba(212,175,55,0.5)] scale-110' : 'border-gold/40 group-hover:border-gold/70 bg-white/5'}`}
                                                                >
                                                                    {sunnahStatus[sunnah.id] && <span className="material-symbols-outlined text-[18px] text-[#020402] font-bold animate-in zoom-in">check</span>}
                                                                </button>
                                                                <span className={`text-[13px] font-arabic transition-colors duration-300 ${sunnahStatus[sunnah.id] ? 'text-gold-bright font-bold' : 'text-white/80 group-hover:text-white'}`}>
                                                                    {(t as any)[sunnah.labelKey] || sunnah.labelKey}
                                                                </span>
                                                            </div>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setActiveSunnahInfo(activeSunnahInfo === sunnah.id ? null : sunnah.id); }}
                                                                className={`p-1.5 rounded-full transition-colors shrink-0 ${activeSunnahInfo === sunnah.id ? 'text-gold bg-gold/10' : 'text-white/30 hover:text-white/80 hover:bg-white/5'}`}
                                                            >
                                                                <span className="material-symbols-outlined text-[16px]">info</span>
                                                            </button>
                                                        </div>
                                                        {activeSunnahInfo === sunnah.id && (
                                                            <div className="text-[11px] text-gold-200/80 bg-gold/5 p-3 rounded-xl ml-9 leading-relaxed animate-in fade-in slide-in-from-top-1 border border-gold/10">
                                                                {(t as any)[sunnah.infoKey]}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    })()}
                                    
                                    {/* POST PRAYER SMART ACTION (Shows if recently prayed) */}
                                    {isPrayed && isActive && (
                                        <div 
                                            onClick={() => navigate('/athkar')}
                                            className="mt-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 via-gold/10 to-emerald-500/10 border border-gold/30 flex items-center justify-between cursor-pointer hover:bg-gold/20 hover:scale-[1.02] transition-all relative overflow-hidden group shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                                        >
                                            <div className="absolute inset-0 bg-gold/5 animate-pulse-glow pointer-events-none"></div>
                                            <div className="flex items-center gap-3 relative z-10">
                                                <div className="size-8 rounded-lg bg-gold/20 flex items-center justify-center text-gold-bright">
                                                    <span className="material-symbols-outlined text-[16px]">menu_book</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[11px] font-bold text-white uppercase tracking-wider">
                                                        {(t as any)['post_prayer_athkar'] || 'أذكار ما بعد الصلاة'}
                                                    </span>
                                                    <span className="text-[9px] text-gold-bright/80 uppercase tracking-widest">
                                                        {(t as any)['read_now'] || 'Read Now'}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="material-symbols-outlined text-gold/50 text-sm group-hover:text-gold-bright group-hover:translate-x-1 transition-transform">arrow_forward_ios</span>
                                        </div>
                                    )}
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>
        </section>

                {/* SMART IFTAR / HEALTH BANNER (Shows during Asr) */}
                {activePeriodName === 'Asr' && (
                    <section className="px-5 mt-8 relative z-10 animate-in slide-in-from-bottom-4 duration-700 fade-in">
                        <div 
                            onClick={() => navigate('/health')}
                            className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-900/60 to-emerald-950 border border-emerald-500/30 flex items-center justify-between cursor-pointer hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)] overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-emerald-500/5 animate-pulse-glow pointer-events-none"></div>
                            <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                            
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="size-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                    <span className="material-symbols-outlined text-2xl">local_dining</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-0.5">
                                        {(t as any)['iftar_approaching'] || 'Iftar is Approaching'}
                                    </span>
                                    <span className="text-sm font-bold text-white tracking-wide">
                                        {(t as any)['track_nutrition'] || 'Track your nutrition'}
                                    </span>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-emerald-500/50 relative z-10">arrow_forward_ios</span>
                        </div>
                    </section>
                )}

                {/* ANCIENT QIBLA COMPASS */}
                <section className="px-5 mt-12 relative z-10">
                    <div className="relative p-6 rounded-3xl bg-gradient-to-b from-white/[0.03] to-transparent border border-white/5 shadow-2xl overflow-hidden group">
                        <div className="absolute inset-0 bg-gold/5 blur-3xl rounded-full opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity duration-1000"></div>
                        <div className="absolute inset-0 islamic-pattern-bg opacity-10 mix-blend-overlay pointer-events-none"></div>
                        <Compass heading={heading} qiblaDirection={qiblaDirection} distanceToKaaba={distanceToKaaba} />
                    </div>
                </section>

                {/* ROYAL SCROLL CALENDAR */}
                <section className="mt-12 mb-10 relative z-10">
                    <div className="px-6 mb-5 flex items-end justify-between">
                        <div>
                            <h3 className="text-xl font-royal font-bold text-white">{t.calendar_title || 'Calendar'}</h3>
                            <p className="text-xs text-gold/60 uppercase tracking-widest mt-1">{t.hijri_gregorian || 'Hijri & Gregorian'}</p>
                        </div>
                        <button
                            onClick={() => setIsCalendarOpen(true)}
                            className="text-[10px] font-bold text-gold border border-gold/30 px-3 py-1.5 rounded-full hover:bg-gold/10 transition-colors uppercase tracking-wider"
                        >
                            {t.view_all || 'View All'}
                        </button>
                    </div>

                    <div className="pl-6 w-full overflow-x-auto no-scrollbar pb-10">
                        <div className="flex gap-4 min-w-max pr-6">
                            {calendarSubset.map((day, i) => {
                                const date = new Date(parseInt(day.date.timestamp) * 1000);
                                const isToday = isSameDate(date, new Date());

                                return (
                                    <div
                                        key={i}
                                        className={`
                                            royal-scroll-card flex flex-col items-center justify-center w-[72px] h-[110px] rounded-[24px] transition-all duration-300
                                            ${isToday ? 'date-card-selected' : 'opacity-80'}
                                        `}
                                    >
                                        {isToday && <div className="absolute -top-1 w-8 h-1 bg-gold rounded-b-lg shadow-[0_2px_8px_gold]"></div>}

                                        <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isToday ? 'text-gold' : 'text-white/40'}`}>
                                            {day.date.gregorian.weekday.en.substring(0, 3)}
                                        </span>

                                        <span className={`text-2xl font-royal font-bold ${isToday ? 'text-white glowing-text' : 'text-white/80'}`}>
                                            {day.date.hijri.day}
                                        </span>

                                        <span className="text-[9px] text-white/30 mt-2 font-mono">
                                            {day.date.gregorian.day} {day.date.gregorian.month.en.substring(0, 3)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Holiday Banner (if upcoming) */}
                    {nextHoliday && (
                        <div className="px-5">
                            <div 
                                onClick={() => setIsCalendarOpen(true)}
                                className="relative rounded-2xl overflow-hidden border border-gold/30 group cursor-pointer hover:border-gold/60 transition-colors"
                            >
                                <div className="absolute inset-0 islamic-pattern-bg opacity-30"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B2D] to-black opacity-90"></div>

                                <div className="relative z-10 p-5 flex items-center gap-5">
                                    <div className="flex flex-col items-center justify-center size-12 rounded-xl bg-gold/10 border border-gold/30">
                                        <span className="material-symbols-outlined text-gold text-xl">star</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-royal font-bold text-white mb-0.5">{translateHoliday(nextHoliday.date.hijri.holidays[0])}</h4>
                                        <p className="text-xs text-gold/70 uppercase tracking-widest">
                                            {nextHoliday.date.hijri.day} {isRtl ? nextHoliday.date.hijri.month.ar : nextHoliday.date.hijri.month.en}
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-white/20 -rotate-45">arrow_forward</span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                <div className="pb-8 text-center text-white/10 flex justify-center gap-4">
                    <span className="material-symbols-outlined text-lg">mosque</span>
                </div>

            </div>



            {/* FULL CALENDAR MODAL */}
            <CalendarModal
                isOpen={isCalendarOpen}
                onClose={() => setIsCalendarOpen(false)}
                calendarData={calendarData}
            />
        </div>
    );
};

export default Prayer;
