import * as React from 'react';
import { useState, useEffect } from 'react';
import { usePrayer } from '../context/PrayerContext';
import { useUser } from '../context/UserContext';
import { useCompassHeading } from '../hooks/useCompassHeading';
import Compass from '../components/Compass';
import CalendarModal from '../components/CalendarModal';

const Prayer: React.FC = () => {
    const { timings, hijriDate, nextPrayer, timeRemaining, loading, calendarData, qiblaDirection, error, refresh } = usePrayer();
    const { location } = useUser();
    const { heading } = useCompassHeading();
    const [distanceToKaaba, setDistanceToKaaba] = useState<string>("...");
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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

    return (
        <div className="bg-[#020402] font-display text-white antialiased min-h-screen relative overflow-x-hidden pb-32">

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
                            <span className="material-symbols-outlined text-sm text-gold">location_on</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">{location?.city || 'Unknown'}</span>
                        </div>
                        <h1 className="text-3xl font-royal font-bold tracking-tight text-transparent bg-clip-text bg-gold-metallic">
                            {hijriDate ? `${hijriDate.day} ${hijriDate.month.en}` : '...'}
                        </h1>
                        <p className="text-white/40 text-[10px] font-medium uppercase tracking-[0.2em] mt-1 pl-1">
                            {hijriDate?.year} AH • {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                </header>

                {/* HERO CARD - NEXT PRAYER */}
                <div className="px-5 py-2 relative z-10">
                    <div className="relative rounded-[24px] p-[1px] bg-gradient-to-br from-[#D4AF37] via-[#F9E496] to-transparent shadow-lg">
                        <div className="relative rounded-[23px] glass-panel p-5 overflow-hidden min-h-[200px]">

                            <div className="relative z-10 flex flex-col justify-between h-full gap-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/5 mb-3">
                                            <span className="relative flex h-2 w-2">
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                            <span className="text-[9px] font-bold text-gold uppercase tracking-widest">
                                                {activePeriodName === 'Dhuha (Waiting)' ? 'Waiting Interval' : 'Active Now'}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Upcoming Prayer</span>
                                            <h2 className="text-4xl font-royal text-white tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#fff8e7] to-[#eaddcf]">
                                                {nextPrayer}
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

                                <div className="mt-auto pt-3 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-[9px] text-white/40 uppercase tracking-widest mb-1">Currently</p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-royal text-white/80">{activePeriodName}</span>
                                        </div>
                                    </div>
                                    <div className="size-11 border border-white/10 rounded-xl flex flex-col items-center justify-center bg-white/5">
                                        <span className="text-[8px] text-white/40">Juz</span>
                                        <span className="text-sm font-bold text-gold">14</span>
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
                            Prayer Schedule
                        </h3>
                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        {prayers.map((prayer, idx) => {
                            const isNext = prayer === nextPrayer;

                            return (
                                <div key={prayer} className={`
                                    flex items-center justify-between p-4 rounded-xl border transition-colors
                                    ${isNext ? 'bg-gold/10 border-gold/40' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'}
                                `}>
                                    <div className="flex items-center gap-4">
                                        <span className={`material-symbols-outlined text-xl ${isNext ? 'text-gold' : 'text-white/20'}`}>
                                            {prayer === 'Fajr' || prayer === 'Maghrib' ? 'wb_twilight' : (prayer === 'Isha' ? 'nights_stay' : 'wb_sunny')}
                                        </span>
                                        <span className={`font-medium tracking-wide text-sm ${isNext ? 'text-white' : 'text-white/60'}`}>{prayer}</span>
                                    </div>
                                    <span className={`font-medium font-mono text-sm ${isNext ? 'text-gold' : 'text-white/40'}`} dangerouslySetInnerHTML={{ __html: timings ? formatTime(timings[prayer]) : '--:--' }}></span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* ANCIENT QIBLA COMPASS */}
                <section className="px-5 mt-12 relative z-10">
                    <Compass heading={heading} qiblaDirection={qiblaDirection} distanceToKaaba={distanceToKaaba} />
                </section>

                {/* ROYAL SCROLL CALENDAR */}
                <section className="mt-12 mb-10 relative z-10">
                    <div className="px-6 mb-5 flex items-end justify-between">
                        <div>
                            <h3 className="text-xl font-royal font-bold text-white">Calendar</h3>
                            <p className="text-xs text-gold/60 uppercase tracking-widest mt-1">Hijri & Gregorian</p>
                        </div>
                        <button
                            onClick={() => setIsCalendarOpen(true)}
                            className="text-[10px] font-bold text-gold border border-gold/30 px-3 py-1.5 rounded-full hover:bg-gold/10 transition-colors uppercase tracking-wider"
                        >
                            View All
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
                            <div className="relative rounded-2xl overflow-hidden border border-gold/30 group">
                                <div className="absolute inset-0 islamic-pattern-bg opacity-30"></div>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0B3B2D] to-black opacity-90"></div>

                                <div className="relative z-10 p-5 flex items-center gap-5">
                                    <div className="flex flex-col items-center justify-center size-12 rounded-xl bg-gold/10 border border-gold/30">
                                        <span className="material-symbols-outlined text-gold text-xl">star</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xl font-royal font-bold text-white mb-0.5">{nextHoliday.date.hijri.holidays[0]}</h4>
                                        <p className="text-xs text-gold/70 uppercase tracking-widest">
                                            {nextHoliday.date.hijri.day} {nextHoliday.date.hijri.month.en}
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
