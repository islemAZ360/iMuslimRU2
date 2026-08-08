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

    return (
        <div className="fixed inset-0 z-50 max-w-md mx-auto overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
                                {t('calendar') || 'Islamic Calendar'}
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
                                {language === 'ar' ? 'المناسبات الدينية' : (language === 'ru' ? 'Религиозные события' : 'Religious Events')}
                            </h4>
                            {holidays.length > 0 ? (
                                <div className="space-y-2">
                                    {holidays.map((day, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-gold/5 border border-gold/10">
                                            <div className="flex flex-col items-center justify-center h-10 w-10 bg-[#0a0a0a] rounded-md border border-gold/30">
                                                <span className="text-[10px] font-bold text-gold">{day.date.hijri.day}</span>
                                                <span className="text-[8px] text-white/40 uppercase">{day.date.hijri.month.en.substring(0, 3)}</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gold-metallic">{day.date.hijri.holidays[0]}</p>
                                                <p className="text-[10px] text-white/40">{day.date.gregorian.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-white/30 italic">
                                    {language === 'ar' ? 'لا توجد مناسبات قريبة' : (language === 'ru' ? 'Нет событий в этом месяце' : 'No major religious events this month.')}
                                </p>
                            )}
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                type="button"
                                className="w-full inline-flex justify-center rounded-xl border border-gold/30 bg-gold/10 px-4 py-3 text-sm font-medium text-gold hover:bg-gold/20 focus:outline-none transition-colors uppercase tracking-widest font-bold"
                                onClick={onClose}
                            >
                                {language === 'ar' ? 'إغلاق' : (language === 'ru' ? 'Закрыть' : 'Close Calendar')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarModal;
