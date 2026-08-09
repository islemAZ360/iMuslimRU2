import * as React from 'react';
import { useState, useEffect } from 'react';
import { usePrayer } from '../context/PrayerContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import CalendarModal from '../components/CalendarModal';
import { useLanguage } from '../context/LanguageContext';

const Ramadan: React.FC = () => {
    const { timings, hijriDate, calendarData } = usePrayer();
    const { settings } = useUser();
    const { language, t } = useLanguage();
    const navigate = useNavigate();

    const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);
    const [fastingPhase, setFastingPhase] = useState<'fasting' | 'eating' | null>(null);
    const [formattedForecast, setFormattedForecast] = useState<any[]>([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [displayTimings, setDisplayTimings] = useState<{fajr: string, maghrib: string} | null>(null);

    const isRamadanEnabled = settings.ramadanMode;

    // Redirect or show disabled state if not enabled
    // Ideally we show a nice "Enable Ramadan Mode" screen

    // Calculate time left to Suhoor (Fajr) or Iftar (Maghrib)
    useEffect(() => {
        if (!timings) return;

        const calculateTime = () => {
            const now = new Date();
            // Timings format is "HH:MM (TZ)" usually, so simple split works
            const fajrTime = new Date();
            const [fH, fM] = timings.Fajr.split(' ')[0].split(':').map(Number);
            fajrTime.setHours(fH, fM, 0, 0);

            const maghribTime = new Date();
            const [mH, mM] = timings.Maghrib.split(' ')[0].split(':').map(Number);
            maghribTime.setHours(mH, mM, 0, 0);

            let targetTime: Date;
            let phase: 'fasting' | 'eating';

            if (now < fajrTime) {
                targetTime = fajrTime;
                phase = 'eating'; // Before Fajr, we are eating (Suhoor time)
            } else if (now < maghribTime) {
                targetTime = maghribTime;
                phase = 'fasting'; // Between Fajr and Maghrib
            } else {
                // After Maghrib, target next Fajr (tomorrow)
                targetTime = new Date(fajrTime);
                targetTime.setDate(targetTime.getDate() + 1);
                phase = 'eating'; // After Iftar
            }

            let dFajr = timings.Fajr;
            let dMaghrib = timings.Maghrib;

            // If it's after Maghrib, we should pull tomorrow's accurate times from calendarData if available
            if (now > maghribTime && calendarData) {
                const todayStr = String(now.getDate()).padStart(2, '0');
                const todayIdx = calendarData.findIndex(d => d.date.gregorian.day === todayStr);
                if (todayIdx !== -1 && todayIdx + 1 < calendarData.length) {
                    const nextDay = calendarData[todayIdx + 1];
                    dFajr = nextDay.timings.Fajr;
                    dMaghrib = nextDay.timings.Maghrib;
                    
                    // Update targetTime accurately to tomorrow's actual Fajr time
                    const [nextH, nextM] = dFajr.split(' ')[0].split(':').map(Number);
                    targetTime.setHours(nextH, nextM, 0, 0);
                }
            }

            setFastingPhase(phase);
            setDisplayTimings({ fajr: dFajr, maghrib: dMaghrib });

            const diff = targetTime.getTime() - now.getTime();
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        };

        calculateTime();
        const interval = setInterval(calculateTime, 1000);
        return () => clearInterval(interval);
    }, [timings, calendarData]);

    // Prepare Forecast Data
    useEffect(() => {
        if (calendarData) {
            const todayStr = String(new Date().getDate()).padStart(2, '0');
            const todayIndex = calendarData.findIndex(d => d.date.gregorian.day === todayStr);
            
            if (todayIndex !== -1) {
                const next7Days = calendarData.slice(todayIndex, todayIndex + 7);
                setFormattedForecast(next7Days);
            }
        }
    }, [calendarData]);

    // Format time 12h
    const formatTime = (timeStr: string) => {
        if (!timeStr) return '--:--';
        const [h, m] = timeStr.split(' ')[0].split(':');
        const hour = parseInt(h);
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${m} ${suffix}`;
    };

    const getWeekday = (enDay: string) => {
        if (language === 'ar') {
            const map: any = { Sunday: 'الأحد', Monday: 'الاثنين', Tuesday: 'الثلاثاء', Wednesday: 'الأربعاء', Thursday: 'الخميس', Friday: 'الجمعة', Saturday: 'السبت' };
            return map[enDay] || enDay;
        }
        if (language === 'ru') {
            const map: any = { Sunday: 'Воскресенье', Monday: 'Понедельник', Tuesday: 'Вторник', Wednesday: 'Среда', Thursday: 'Четверг', Friday: 'Пятница', Saturday: 'Суббота' };
            return map[enDay] || enDay;
        }
        return enDay;
    };

    const formatHijriDate = (dayInfo: any) => {
        if (language === 'ar') {
            return `${dayInfo.date.hijri.day} ${dayInfo.date.hijri.month.ar} ${dayInfo.date.hijri.year}`;
        }
        return `${dayInfo.date.hijri.day} ${dayInfo.date.hijri.month.en} ${dayInfo.date.hijri.year}`;
    };

    // Progress Calculation
    const getProgress = () => {
        if (!timings) return 0;
        const now = new Date();

        const [fH, fM] = timings.Fajr.split(' ')[0].split(':').map(Number);
        const fajr = new Date(); fajr.setHours(fH, fM, 0, 0);

        const [mH, mM] = timings.Maghrib.split(' ')[0].split(':').map(Number);
        const maghrib = new Date(); maghrib.setHours(mH, mM, 0, 0);

        const current = now.getTime();

        if (current < fajr.getTime()) return 100; // Eating time
        if (current > maghrib.getTime()) return 100; // Iftar done

        const total = maghrib.getTime() - fajr.getTime();
        const elapsed = current - fajr.getTime();
        return Math.min(100, Math.max(0, (elapsed / total) * 100));
    };

    if (!isRamadanEnabled) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                <div className="size-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6 animate-pulse">
                    <span className="material-symbols-outlined text-4xl text-gray-400">mosque</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-white mb-2">{t('ramadan_mode_off')}</h2>
                <p className="text-sm text-gray-400 max-w-xs mb-8">{t('enable_ramadan_mode')}</p>
                <button
                    onClick={() => navigate('/settings')}
                    className="px-8 py-3 rounded-full bg-gold/20 border border-gold text-gold font-bold uppercase tracking-widest hover:bg-gold/30 transition-all shadow-gold-glow"
                >
                    {t('go_to_settings')}
                </button>
            </div>
        );
    }

    return (
        <div className="pb-52 pt-8 px-4 flex flex-col items-center min-h-screen relative" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Decorative Fixed Background Elements */}
            <div className="fixed inset-0 max-w-md mx-auto pointer-events-none z-0 overflow-hidden">
                {fastingPhase === 'fasting' ? (
                    <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-amber-900/20 via-transparent to-transparent transition-colors duration-1000"></div>
                ) : (
                    <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-indigo-950/40 via-purple-900/10 to-transparent transition-colors duration-1000">
                        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, white 1px, transparent 1px), radial-gradient(circle at 85% 30%, white 1px, transparent 1px), radial-gradient(circle at 50% 10%, white 1px, transparent 1px)' }}></div>
                    </div>
                )}
            </div>

            {/* Header */}
            <div className="text-center mb-8 relative w-full z-10">
                <h1 className="font-arabic text-4xl text-transparent bg-clip-text bg-gradient-to-b from-[#FFD700] via-[#FFFACD] to-[#C5A059] mb-2 relative z-10">
                    {t('ramadan_kareem')}
                </h1>
                <div className="inline-flex items-center justify-center px-5 py-1.5 border-y border-gold/30 bg-black/30">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-gold uppercase">
                        {hijriDate ? `${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year} AH` : 'Ramadan 1445 AH'}
                    </span>
                </div>
            </div>

            {/* Countdown Card */}
            <div className="w-full relative mb-8 z-10">
                <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
                    {/* Tezhip Corners */}
                    <div className="absolute top-0 left-0 w-14 h-14 border-t border-l border-gold/30 rounded-tl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-14 h-14 border-b border-r border-gold/30 rounded-br-2xl"></div>

                    <div className="text-center mb-5">
                        <span className="text-[10px] font-bold text-gold-light/60 uppercase tracking-[0.2em]">
                            {fastingPhase === 'fasting' ? t('time_until_iftar') : t('time_until_suhoor')}
                        </span>
                    </div>

                    {/* Timer */}
                    {timeLeft ? (
                        <div className="flex items-end justify-center gap-4 mb-6">
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-serif font-bold text-gold-gradient">{timeLeft.hours.toString().padStart(2, '0')}</span>
                                <span className="text-[9px] font-bold text-gold-dim uppercase tracking-widest mt-1">{t('hrs')}</span>
                            </div>
                            <span className="text-2xl text-gold/40 mb-2">:</span>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-serif font-bold text-gold-gradient">{timeLeft.minutes.toString().padStart(2, '0')}</span>
                                <span className="text-[9px] font-bold text-gold-dim uppercase tracking-widest mt-1">{t('min')}</span>
                            </div>
                            <span className="text-2xl text-gold/40 mb-2">:</span>
                            <div className="flex flex-col items-center">
                                <span className="text-4xl font-serif font-bold text-gold-gradient">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                                <span className="text-[9px] font-bold text-gold-dim uppercase tracking-widest mt-1">{t('sec')}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-20 mb-6">
                            <div className="size-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-4 px-2">
                        <div className="flex justify-between text-[9px] font-bold text-gold-dim uppercase tracking-wider mb-2">
                            <span>{t('suhoor')}</span>
                            <span className="text-center">{fastingPhase === 'fasting' ? t('fasting_progress') : t('eating_allowed')}</span>
                            <span>{t('iftar')}</span>
                        </div>
                        <div className="h-2 bg-black/50 rounded-full overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-all duration-500"
                                style={{ width: `${getProgress()}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Duas Card */}
            <div className="w-full relative mb-6 z-10 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                <div className="glass-panel rounded-3xl p-5 border border-gold/20 relative">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="material-symbols-outlined text-gold">menu_book</span>
                        <h3 className="font-bold text-white font-serif text-sm">
                            {language === 'ar' ? (fastingPhase === 'fasting' ? 'دعاء الإفطار' : 'دعاء نية الصيام') : (fastingPhase === 'fasting' ? 'Iftar Dua' : 'Fasting Intention')}
                        </h3>
                    </div>
                    {fastingPhase === 'fasting' ? (
                        <p className="text-xl font-arabic text-gold-light leading-loose text-center py-2">
                            "ذَهَبَ الظَّمَأُ، وَابْتَلَّتِ الْعُرُوقُ، وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ"
                        </p>
                    ) : (
                        <p className="text-xl font-arabic text-gold-light leading-loose text-center py-2">
                            "وَبِصَوْمِ غَدٍ نَّوَيْتُ مِنْ شَهْرِ رَمَضَانَ"
                        </p>
                    )}
                    <p className="text-[10px] text-center text-white/50 mt-2 italic px-4">
                        {language === 'ar' 
                            ? (fastingPhase === 'fasting' ? 'يقال عند الإفطار' : 'يقال في الليل قبل الفجر')
                            : (fastingPhase === 'fasting' ? 'The thirst is gone, the veins are moistened, and the reward is confirmed, if Allah wills.' : 'I intend to keep the fast for tomorrow in the month of Ramadan.')}
                    </p>
                </div>
            </div>

            {/* Night Prayers (Taraweeh & Qiyam) */}
            {timings && (
                <div className="w-full relative mb-6 z-10 animate-in slide-in-from-bottom-4 duration-700 delay-300">
                    <div className="glass-panel rounded-3xl p-5 border border-gold/20 flex divide-x divide-white/10" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                        <div className="flex-1 text-center px-2">
                            <span className="material-symbols-outlined text-gold mb-1">mosque</span>
                            <h4 className="font-bold text-white text-xs mb-1">{language === 'ar' ? 'صلاة التراويح' : 'Taraweeh'}</h4>
                            <p className="text-xs text-gold-dim">{language === 'ar' ? 'بعد العشاء' : 'After Isha'}</p>
                            <p className="text-lg font-serif font-bold text-white mt-1">{formatTime(timings.Isha)}</p>
                        </div>
                        <div className="flex-1 text-center px-2 border-l border-white/10">
                            <span className="material-symbols-outlined text-gold mb-1">bedtime</span>
                            <h4 className="font-bold text-white text-xs mb-1">{language === 'ar' ? 'قيام الليل' : 'Qiyam Al-Layl'}</h4>
                            <p className="text-xs text-gold-dim">{language === 'ar' ? 'الثلث الأخير' : 'Last Third'}</p>
                            <p className="text-lg font-serif font-bold text-white mt-1" dir="ltr">
                                {(() => {
                                    const [mH, mM] = timings.Maghrib.split(' ')[0].split(':').map(Number);
                                    const [fH, fM] = timings.Fajr.split(' ')[0].split(':').map(Number);
                                    let totalMins = ((fH < mH ? fH + 24 : fH) - mH) * 60 + (fM - mM);
                                    let thirdMins = totalMins / 3;
                                    let startH = Math.floor((fH < mH ? fH + 24 : fH) - (thirdMins / 60));
                                    let startM = Math.floor(fM - (thirdMins % 60));
                                    if (startM < 0) { startM += 60; startH -= 1; }
                                    return formatTime(`${startH % 24}:${startM.toString().padStart(2, '0')}`);
                                })()}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quran Tracker */}
            {hijriDate && hijriDate.month.en === 'Ramadan' && (
                <div className="w-full relative mb-6 z-10 animate-in slide-in-from-bottom-4 duration-700 delay-[400ms]">
                    <div className="glass-panel rounded-3xl p-5 border border-gold/20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-gold text-2xl">auto_stories</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-sm mb-1">{language === 'ar' ? 'ورد القرآن اليومي' : 'Daily Quran Target'}</h3>
                                <p className="text-xs text-gold-dim">{language === 'ar' ? `الجزء ${hijriDate.day}` : `Juz ${hijriDate.day}`}</p>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => {
                                const btn = e.currentTarget;
                                btn.classList.toggle('bg-gold');
                                btn.classList.toggle('text-black');
                                btn.classList.toggle('border-gold');
                                btn.classList.toggle('text-gold/40');
                            }}
                            className="size-8 rounded-full border border-gold/40 flex items-center justify-center text-gold/40 transition-all duration-300"
                        >
                            <span className="material-symbols-outlined text-sm">check</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Daily Sunnah */}
            <div className="w-full relative mb-8 z-10 animate-in slide-in-from-bottom-4 duration-700 delay-[500ms]">
                <div className="bg-gradient-to-r from-gold/10 to-transparent rounded-3xl p-5 border-l-4 border-gold relative overflow-hidden" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-6xl">favorite</span>
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                        <span className="material-symbols-outlined text-gold text-sm">lightbulb</span>
                        {language === 'ar' ? 'سُنة وعمل اليوم' : 'Daily Sunnah'}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed relative z-10">
                        {parseInt(hijriDate?.day || '1') % 4 === 0 
                            ? (language === 'ar' ? 'تصدق ولو بالقليل، فالصدقة تطفئ غضب الرب.' : 'Give a small charity (Sadaqah).') :
                         parseInt(hijriDate?.day || '1') % 4 === 1 
                            ? (language === 'ar' ? 'أطعم صائماً عند الإفطار لتنال مثل أجره.' : 'Feed a fasting person at Iftar.') :
                         parseInt(hijriDate?.day || '1') % 4 === 2
                            ? (language === 'ar' ? 'صلة الرحم: اتصل بشخص من عائلتك للاطمئنان عليه.' : 'Call a family member to maintain kinship ties.') :
                            (language === 'ar' ? 'أكثر من الاستغفار في وقت السحر (قبل الفجر).' : 'Seek forgiveness often during the last third of the night.')}
                    </p>
                </div>
            </div>

            {/* 7 Day Forecast Title */}
            <div className="w-full flex items-center justify-between mb-4 px-2 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-gold to-gold-dark rounded-full"></div>
                    <h3 className="text-xl font-serif font-bold text-white">{t('seven_day_forecast')}</h3>
                </div>
                <button 
                    onClick={() => setIsCalendarOpen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-gold/30 text-[10px] font-bold text-gold uppercase tracking-wider hover:bg-gold/10 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">calendar_month</span>
                    {t('calendar_title')}
                </button>
            </div>

            {/* Forecast List (Dynamic) */}
            <div className="w-full space-y-3 relative z-10 mb-24">
                <div className="absolute left-[2.25rem] top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent z-0"></div>

                {formattedForecast.length > 0 ? (
                    formattedForecast.map((day, index) => (
                        <div key={index} className={`relative z-10 p-4 rounded-2xl flex items-center justify-between border ${index === 0 ? 'bg-black/60 border-gold/40' : 'bg-black/20 border-white/5 opacity-80'}`}>
                            <div className="flex items-center gap-4">
                                <div className={`size-11 rounded-full flex items-center justify-center border ${index === 0 ? 'bg-emerald-950 border-gold/30' : 'bg-white/5 border-white/10'}`}>
                                    <span className={`material-symbols-outlined ${index === 0 ? 'text-gold' : 'text-gray-400 text-sm'}`}>
                                        {index === 0 ? 'notifications_active' : 'wb_sunny'}
                                    </span>
                                </div>
                                <div>
                                    <h4 className={`font-bold ${index === 0 ? 'text-base text-white' : 'text-sm text-gray-200'}`}>
                                        {index === 0 ? t('today') : getWeekday(day.date.gregorian.weekday.en)} 
                                    </h4>
                                    <p className="text-[10px] font-bold text-gold-dim uppercase tracking-wide">
                                        {formatHijriDate(day)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 text-center">
                                <div>
                                    <p className={`font-serif font-bold ${index === 0 ? 'text-white text-base' : 'text-gray-300'}`}>
                                        {formatTime(day.timings.Fajr)}
                                    </p>
                                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{t('suhoor')}</p>
                                </div>
                                <div className="h-8 w-px bg-gold/20"></div>
                                <div>
                                    <p className={`font-serif font-bold ${index === 0 ? 'text-gold text-base' : 'text-gray-300'}`}>
                                        {formatTime(day.timings.Maghrib)}
                                    </p>
                                    <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">{t('iftar')}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 opacity-50 text-xs">{t('loading')}</div>
                )}
            </div>

            {/* Sticky Brief Footer */}
            {displayTimings && (
                <div className="fixed bottom-[5.5rem] left-0 right-0 max-w-md mx-auto px-4 z-50">
                    <div className="bg-black/80 backdrop-blur-md border border-gold/30 rounded-2xl p-3 flex justify-between items-center shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                                <span className="material-symbols-outlined text-emerald-400">wb_twilight</span>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t('next_suhoor')}</p>
                                <p className="font-serif font-bold text-white leading-none">{formatTime(displayTimings.fajr)}</p>
                            </div>
                        </div>
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="flex items-center gap-3 text-right">
                            <div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{t('next_iftar')}</p>
                                <p className="font-serif font-bold text-gold leading-none">{formatTime(displayTimings.maghrib)}</p>
                            </div>
                            <div className="bg-gold/10 p-2 rounded-lg border border-gold/20">
                                <span className="material-symbols-outlined text-gold">nights_stay</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CalendarModal 
                isOpen={isCalendarOpen} 
                onClose={() => setIsCalendarOpen(false)} 
                calendarData={calendarData} 
            />
        </div>
    );
};

export default Ramadan;