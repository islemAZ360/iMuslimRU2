import * as React from 'react';
import { CalendarDay } from '../context/PrayerContext';
import { useLanguage } from '../context/LanguageContext';

interface CalendarModalProps {
    isOpen: boolean;
    onClose: () => void;
    calendarData: CalendarDay[] | null;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ isOpen, onClose, calendarData }) => {
    const { t, language } = useLanguage();

    // Helper to check if dates match
    const isSameDate = (d1: Date, d2: Date) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    const today = new Date();

    if (!isOpen) return null;

    // Filter days with holidays
    const holidays = calendarData?.filter(d => d.date.hijri.holidays && d.date.hijri.holidays.length > 0) || [];

    // Weekdays
    const weekdays = language === 'ar'
        ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
        : (language === 'ru'
            ? ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
            : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);

    // Simple Holiday Translator (Aladhan API sends them in English)
    const translateHoliday = (holidayEn: string) => {
        // Remove diacritics (like ā, ī, ū) so that simple matching works
        const h = holidayEn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (language === 'ar') {
            if (h.includes('ashura')) return 'يوم عاشوراء';
            if (h.includes('veiling') && h.includes('muhammad')) return 'وفاة النبي محمد ﷺ';
            if (h.includes('mawlid') || h.includes('al-nabi')) return 'المولد النبوي الشريف';
            if (h.includes('isra')) return 'الإسراء والمعراج';
            if (h.includes('ramadan')) return 'بداية رمضان';
            if (h.includes('fitr')) return 'عيد الفطر';
            if (h.includes('adha')) return 'عيد الأضحى';
            if (h.includes('arafa')) return 'يوم عرفة';
            if (h.includes('muharram')) return 'رأس السنة الهجرية';
            
            // Islamic figures and specific dates
            if (h.includes('hassan') || h.includes('mujtaba')) return 'استشهاد الإمام الحسن (ع)';
            if (h.includes('rumi')) return 'مولد مولانا جلال الدين الرومي';
            if (h.includes('baha') && h.includes('naqshband')) return 'ذكرى وفاة الشيخ بهاء الدين نقشبند (ق)';
            if (h.includes('masum')) return 'ذكرى وفاة الشيخ محمد المَعصُوم (ق)';
            if (h.includes('daghestani')) return 'مولد الشيخ عبد الله الدغستاني (ق)';
            if (h.includes('hamadani')) return 'ذكرى وفاة الشيخ أبو يعقوب يوسف الهمذاني (ق)';
            if (h.includes('ghujdawani')) return 'ذكرى وفاة الشيخ عبد الخالق الغجدواني (ق)';
            if (h.includes('ahrar')) return 'ذكرى وفاة مولانا عبيد الله أحرار (ق)';
            if (h.includes('zahid')) return 'ذكرى وفاة الشيخ محمد الزاهد (ق)';
            if (h.includes('anjir') || h.includes('faghnawi')) return 'ذكرى وفاة الشيخ محمود الأنجير الفغْنَوِي (ق)';
            if (h.includes('sughuri')) return 'ذكرى وفاة الشيخ أبو أحمد السغوري (ق)';
            if (h.includes('kabbani')) return 'ذكرى وفاة الشيخ عدنان قباني (ق)';
            
            // Generic fallback replacer
            let arText = holidayEn;
            arText = arText.replace(/Urs of /ig, 'ذكرى وفاة ');
            arText = arText.replace(/Birth of /ig, 'مولد ');
            arText = arText.replace(/Shaykh /ig, 'الشيخ ');
            arText = arText.replace(/Mawlana /ig, 'مولانا ');
            arText = arText.replace(/Shah /ig, 'شاه ');
            return arText;
        } else if (language === 'ru') {
            if (h.includes('ashura')) return 'Ашура';
            if (h.includes('veiling') && h.includes('muhammad')) return 'Уход Пророка Мухаммада ﷺ';
            if (h.includes('mawlid') || h.includes('al-nabi')) return 'Мавлид ан-Наби';
            if (h.includes('isra')) return 'Исра и Мирадж';
            if (h.includes('ramadan')) return 'Начало Рамадана';
            if (h.includes('fitr')) return 'Ураза-байрам (Ид аль-Фитр)';
            if (h.includes('adha')) return 'Курбан-байрам (Ид аль-Адха)';
            if (h.includes('arafa')) return 'День Арафат';
            if (h.includes('muharram')) return 'Исламский Новый Год';
            
            // Islamic figures and specific dates
            if (h.includes('hassan') || h.includes('mujtaba')) return 'Мученичество Имама Хасана';
            if (h.includes('rumi')) return 'Рождение Мавляны Джалалуддина Руми';
            if (h.includes('baha') && h.includes('naqshband')) return 'Годовщина Шейха Бахауддина Накшбанда (к)';
            if (h.includes('masum')) return 'Годовщина Шейха Мухаммада аль-Масума (к)';
            if (h.includes('daghestani')) return 'Рождение Шейха Абдуллы Дагестани (к)';
            if (h.includes('hamadani')) return 'Годовщина Шейха Абу Якуба Юсуфа аль-Хамадани (к)';
            if (h.includes('ghujdawani')) return 'Годовщина Шейха Абдул Халика аль-Гидждувани (к)';
            if (h.includes('ahrar')) return 'Годовщина Мавляны Убайдуллы Ахрара (к)';
            if (h.includes('zahid')) return 'Годовщина Шейха Мухаммада аз-Захида (к)';
            if (h.includes('anjir') || h.includes('faghnawi')) return 'Годовщина Шейха Махмуда аль-Анджира аль-Фагнави (к)';
            if (h.includes('sughuri')) return 'Годовщина Шейха Абу Ахмада ас-Сугури (к)';
            if (h.includes('kabbani')) return 'Годовщина Шейха Аднана Каббани (к)';
            
            let ruText = holidayEn;
            ruText = ruText.replace(/Urs of /ig, 'Годовщина ');
            ruText = ruText.replace(/Birth of /ig, 'Рождение ');
            ruText = ruText.replace(/Shaykh /ig, 'Шейх ');
            ruText = ruText.replace(/Mawlana /ig, 'Мавляна ');
            return ruText;
        }
        return holidayEn;
    };

    return (
        <div className="fixed inset-0 z-[100] max-w-md mx-auto overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" dir={language === 'ar' ? 'rtl' : 'ltr'}>
            {/* Background backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                {/* Modal panel */}
                <div className="relative transform overflow-hidden rounded-2xl bg-[#0a0a0a] border border-gold/30 p-6 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-royal font-bold text-gold-metallic" id="modal-title">
                                {t('calendar_title') || 'Islamic Calendar'}
                            </h3>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                            {weekdays.map(day => (
                                <div key={day} className="text-[10px] font-bold text-gold/70 uppercase tracking-widest">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-8">
                            {calendarData ? calendarData.map((day, idx) => {
                                const date = new Date(parseInt(day.date.timestamp) * 1000);
                                const isToday = isSameDate(date, today);
                                const hasHoliday = day.date.hijri.holidays && day.date.hijri.holidays.length > 0;

                                return (
                                    <div
                                        key={idx}
                                        className={`
                                            aspect-square flex flex-col items-center justify-center rounded-lg border relative transition-all duration-200
                                            ${isToday ? 'bg-gold/20 border-gold/60 text-white shadow-[0_0_10px_rgba(212,175,55,0.2)]' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}
                                            ${hasHoliday ? 'border-gold/40' : ''}
                                        `}
                                    >
                                        <span className={`text-sm font-bold font-royal ${hasHoliday ? 'text-gold' : ''}`}>
                                            {day.date.hijri.day}
                                        </span>
                                        {hasHoliday && <div className="absolute bottom-2 w-1 h-1 rounded-full bg-gold"></div>}
                                    </div>
                                );
                            }) : <div className="col-span-7 text-center text-white/40 py-10">{t('loading')}</div>}
                        </div>

                        {/* Religious Occasions List */}
                        <div className="border-t border-white/10 pt-4">
                            <h4 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-3">
                                {t('religious_events') || 'Religious Events'}
                            </h4>
                            {holidays.length > 0 ? (
                                <div className="space-y-2 pb-6">
                                    {holidays.map((day, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gold/5 border border-gold/10">
                                            <div className="flex flex-col items-center justify-center h-10 w-10 bg-[#0a0a0a] rounded-md border border-gold/30">
                                                <span className="text-[10px] font-bold text-gold">{day.date.hijri.day}</span>
                                                <span className="text-[8px] text-white/40 uppercase">
                                                    {language === 'ar' ? day.date.hijri.month.ar : day.date.hijri.month.en.substring(0, 3)}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gold-metallic leading-tight">{translateHoliday(day.date.hijri.holidays[0])}</p>
                                                <p className="text-[10px] text-white/40 mt-0.5">{day.date.gregorian.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-white/30 italic pb-6">
                                    {t('no_events') || 'No major religious events this month.'}
                                </p>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center pb-4">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-medium text-gold hover:bg-gold/20 focus:outline-none transition-colors uppercase tracking-widest font-bold"
                                onClick={onClose}
                            >
                                {t('close') || 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
