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
    const [expandedEvent, setExpandedEvent] = React.useState<number | null>(null);

    // Helper to check if dates match
    const isSameDate = (d1: Date, d2: Date) => d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
    const today = new Date();

    if (!isOpen) return null;

    // Custom events injector
    const getCustomEventsForDate = (monthNum: number, dayNum: number): string[] => {
        const events = [];
        if (monthNum === 9 && dayNum === 17) events.push('Battle of Badr');
        if (monthNum === 9 && dayNum === 20) events.push('Conquest of Mecca');
        if (monthNum === 9 && dayNum === 21) events.push('Martyrdom of Imam Ali');
        if (monthNum === 9 && dayNum === 27) events.push('Expected Laylat al-Qadr');
        if (monthNum === 8 && dayNum === 15) events.push('Mid-Sha\'ban');
        if (monthNum === 10 && dayNum === 15) events.push('Battle of Uhud');
        return events;
    };

    // Enhance calendar data with custom events
    const enhancedCalendarData = React.useMemo(() => {
        if (!calendarData) return null;
        return calendarData.map(day => {
            const hMonth = day.date.hijri.month.number;
            const hDay = parseInt(day.date.hijri.day);
            const customEvents = getCustomEventsForDate(hMonth, hDay);
            
            if (customEvents.length > 0) {
                // Ensure holidays array exists
                const existingHolidays = day.date.hijri.holidays || [];
                // Only add if not already present (prevent duplicates)
                const newHolidays = [...existingHolidays];
                customEvents.forEach(evt => {
                    if (!newHolidays.includes(evt)) {
                        newHolidays.push(evt);
                    }
                });
                
                return {
                    ...day,
                    date: {
                        ...day.date,
                        hijri: {
                            ...day.date.hijri,
                            holidays: newHolidays
                        }
                    }
                };
            }
            return day;
        });
    }, [calendarData]);

    // Filter days with holidays using enhanced data
    const holidays = enhancedCalendarData?.filter(d => d.date.hijri.holidays && d.date.hijri.holidays.length > 0) || [];

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

    const getEventInfo = (holidayEn: string, lang: string) => {
        const h = holidayEn.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        
        let info = {
            description: '',
            actions: [] as string[]
        };

        if (h.includes('ashura')) {
            info.description = lang === 'ar' ? 'يوم عاشوراء هو اليوم العاشر من شهر محرم، وهو يوم نجى الله فيه موسى عليه السلام.' : (lang === 'ru' ? 'День Ашура - 10-й день месяца Мухаррам. В этот день Аллах спас Мусу (мир ему).' : 'Ashura is the 10th day of Muharram, the day Allah saved Musa (AS).');
            info.actions = lang === 'ar' ? ['صيام يوم عاشوراء', 'صيام يوم قبله أو بعده (تاسوعاء)'] : (lang === 'ru' ? ['Пост в день Ашура', 'Пост за день до или после'] : ['Fasting the day of Ashura', 'Fasting a day before or after (Tasu\'a)']);
        } else if (h.includes('veiling') && h.includes('muhammad')) {
            info.description = lang === 'ar' ? 'ذكرى وفاة (انتقال) النبي محمد ﷺ إلى الرفيق الأعلى.' : (lang === 'ru' ? 'Годовщина ухода Пророка Мухаммада ﷺ.' : 'The anniversary of the passing of Prophet Muhammad ﷺ.');
            info.actions = lang === 'ar' ? ['الإكثار من الصلاة على النبي ﷺ', 'قراءة سيرته العطرة', 'إحياء سنته'] : (lang === 'ru' ? ['Обильное чтение Салавата Пророку ﷺ', 'Чтение Сиры (жизнеописания)', 'Оживление его Сунны'] : ['Abundant Salawat upon the Prophet ﷺ', 'Reading his Seerah', 'Reviving his Sunnah']);
        } else if (h.includes('mawlid') || h.includes('al-nabi')) {
            info.description = lang === 'ar' ? 'ذكرى المولد النبوي الشريف، مولد خير الأنام محمد ﷺ.' : (lang === 'ru' ? 'Годовщина рождения Пророка Мухаммада ﷺ.' : 'The anniversary of the birth of Prophet Muhammad ﷺ.');
            info.actions = lang === 'ar' ? ['الإكثار من الصلاة والسلام على النبي ﷺ', 'قراءة السيرة النبوية', 'الصدقة وإطعام الطعام'] : (lang === 'ru' ? ['Обильное чтение Салавата Пророку ﷺ', 'Чтение Сиры (жизнеописания)', 'Раздача милостыни (Садака) и угощение едой'] : ['Abundant Salawat upon the Prophet ﷺ', 'Reading his Seerah', 'Giving charity and feeding people']);
        } else if (h.includes('isra')) {
            info.description = lang === 'ar' ? 'ذكرى الإسراء والمعراج، الرحلة المعجزة للنبي ﷺ من المسجد الحرام إلى المسجد الأقصى ثم إلى السماوات العلى.' : (lang === 'ru' ? 'Годовщина Исры и Мираджа, чудесного ночного путешествия Пророка ﷺ из Мекки в Иерусалим, а затем на небеса.' : 'The anniversary of Isra and Mi\'raj, the miraculous night journey of the Prophet ﷺ.');
            info.actions = lang === 'ar' ? ['قيام الليل', 'كثرة الذكر والدعاء', 'الصيام (مستحب)'] : (lang === 'ru' ? ['Выстаивание ночной молитвы (Тахаджуд)', 'Многократное поминание Аллаха (Зикр) и дуа', 'Пост (желательно)'] : ['Night prayers (Tahajjud)', 'Abundant Dhikr and Dua', 'Fasting (recommended)']);
        } else if (h.includes('ramadan')) {
            info.description = lang === 'ar' ? 'بداية شهر رمضان المبارك، شهر الصيام والقرآن والرحمة.' : (lang === 'ru' ? 'Начало благословенного месяца Рамадан, месяца поста, Корана и милости.' : 'The beginning of the blessed month of Ramadan, the month of fasting, Quran, and mercy.');
            info.actions = lang === 'ar' ? ['تجديد نية الصيام', 'المحافظة على صلاة التراويح', 'تلاوة القرآن', 'الإكثار من الدعاء والصدقات'] : (lang === 'ru' ? ['Намерение на пост', 'Молитва Таравих', 'Чтение Корана', 'Обильные дуа и милостыня (Садака)'] : ['Intention for fasting', 'Taraweeh prayers', 'Quran recitation', 'Abundant Dua and charity']);
        } else if (h.includes('fitr')) {
            info.description = lang === 'ar' ? 'عيد الفطر المبارك، الجائزة بعد إتمام شهر رمضان.' : (lang === 'ru' ? 'Праздник Ураза-байрам (Ид аль-Фитр), наступает после завершения месяца Рамадан.' : 'Eid ul-Fitr, the festival of breaking the fast after completing Ramadan.');
            info.actions = lang === 'ar' ? ['إخراج زكاة الفطر (قبل الصلاة)', 'حضور صلاة العيد', 'التكبير', 'صلة الرحم وإدخال السرور'] : (lang === 'ru' ? ['Выплата Закят аль-Фитр (до молитвы)', 'Праздничная молитва (Ид)', 'Такбир', 'Укрепление родственных связей'] : ['Giving Zakat al-Fitr', 'Eid prayer', 'Takbeer', 'Maintaining kinship ties']);
        } else if (h.includes('adha')) {
            info.description = lang === 'ar' ? 'عيد الأضحى المبارك، يوافق العاشر من ذي الحجة وهو يوم النحر.' : (lang === 'ru' ? 'Праздник Курбан-байрам (Ид аль-Адха), 10-е число месяца Зуль-Хиджа, день жертвоприношения.' : 'Eid ul-Adha, the festival of sacrifice falling on the 10th of Dhul Hijjah.');
            info.actions = lang === 'ar' ? ['حضور صلاة العيد', 'ذبح الأضحية', 'تكبيرات التشريق', 'صلة الرحم'] : (lang === 'ru' ? ['Праздничная молитва (Ид)', 'Жертвоприношение (Курбан)', 'Такбиры ат-Ташрик', 'Укрепление родственных связей'] : ['Eid prayer', 'Offering the sacrifice (Udhiyah)', 'Takbeerat al-Tashreeq', 'Maintaining kinship ties']);
        } else if (h.includes('arafa')) {
            info.description = lang === 'ar' ? 'يوم عرفة، التاسع من ذي الحجة، ركن الحج الأعظم وخير يوم طلعت عليه الشمس.' : (lang === 'ru' ? 'День Арафат, 9-е число Зуль-Хиджа, величайший день хаджа и лучший день.' : 'The Day of Arafah, the 9th of Dhul Hijjah, the greatest day of Hajj.');
            info.actions = lang === 'ar' ? ['صيام يوم عرفة (لغير الحاج)', 'الإكثار من الدعاء: "لا إله إلا الله وحده لا شريك له..."', 'التكبير والتهليل', 'التوبة والاستغفار'] : (lang === 'ru' ? ['Пост в день Арафат (для не паломников)', 'Многократное дуа', 'Такбир и Тахлиль', 'Покаяние и Истигфар'] : ['Fasting the day of Arafah (for non-pilgrims)', 'Abundant Dua', 'Takbeer and Tahlil', 'Repentance and Istighfar']);
        } else if (h.includes('muharram')) {
            info.description = lang === 'ar' ? 'رأس السنة الهجرية الجديدة، هجرة النبي ﷺ من مكة إلى المدينة.' : (lang === 'ru' ? 'Начало нового года по Хиджре.' : 'The Islamic New Year.');
            info.actions = lang === 'ar' ? ['التفكر والمحاسبة', 'الإكثار من الصيام في شهر الله المحرم'] : (lang === 'ru' ? ['Размышление и самоотчет', 'Обильный пост в месяц Мухаррам'] : ['Reflection and self-accountability', 'Abundant fasting in the month of Muharram']);
        } else if (h.includes('hassan') || h.includes('mujtaba')) {
            info.description = lang === 'ar' ? 'ذكرى استشهاد الإمام الحسن بن علي (عليهما السلام)، سبط رسول الله ﷺ وريحانته من الدنيا.' : (lang === 'ru' ? 'Годовщина мученической смерти Имама Хасана ибн Али, внука Посланника Аллаха ﷺ.' : 'The martyrdom anniversary of Imam Hasan ibn Ali, the grandson of the Messenger of Allah ﷺ.');
            info.actions = lang === 'ar' ? ['إهداء الفاتحة لروحه الطاهرة', 'قراءة سيرته ومناقبه', 'التصدق بنية ثوابه'] : (lang === 'ru' ? ['Чтение Фатихи за его чистую душу', 'Чтение его жизнеописания и достоинств', 'Раздача милостыни (Садака) от его имени'] : ['Reciting Al-Fatihah for his pure soul', 'Reading his biography and virtues', 'Giving charity on his behalf']);
        } else if (h.includes('rumi') || h.includes('baha') || h.includes('naqshband') || h.includes('masum') || h.includes('daghestani') || h.includes('hamadani') || h.includes('ghujdawani') || h.includes('ahrar') || h.includes('zahid') || h.includes('anjir') || h.includes('faghnawi') || h.includes('sughuri') || h.includes('kabbani')) {
            info.description = lang === 'ar' ? 'ذكرى لأحد سادات مشايخ الطريقة العلية.' : (lang === 'ru' ? 'Годовщина одного из великих шейхов благородного тариката.' : 'Anniversary of one of the great Shuyukh of the honorable Tariqah.');
            info.actions = lang === 'ar' ? ['قراءة سورة الفاتحة وإهداء ثوابها لروحه', 'التصدق بنية إيصال الثواب له', 'حضور مجالس الذكر أو ختم الخواجكان', 'قراءة سيرته للاقتداء به'] : (lang === 'ru' ? ['Чтение суры Аль-Фатиха и посвящение награды его душе', 'Раздача милостыни (Садака) за него', 'Посещение собраний зикра (Хатм Ходжаган)', 'Чтение его жизнеописания'] : ['Reciting Surah Al-Fatihah and sending the reward to his soul', 'Giving charity on his behalf', 'Attending Dhikr gatherings', 'Reading his biography']);
        } else {
            info.description = lang === 'ar' ? 'مناسبة هامة في التقويم الإسلامي.' : (lang === 'ru' ? 'Важное событие в исламском календаре.' : 'An important event in the Islamic calendar.');
        }

        return info;
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
                            {enhancedCalendarData ? enhancedCalendarData.map((day, idx) => {
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
                                    {holidays.map((day, idx) => {
                                        const eventNameEn = day.date.hijri.holidays[0];
                                        const eventInfo = getEventInfo(eventNameEn, language);
                                        const isExpanded = expandedEvent === idx;

                                        return (
                                            <div 
                                                key={idx} 
                                                className={`flex flex-col rounded-lg border transition-all duration-300 overflow-hidden cursor-pointer ${isExpanded ? 'bg-gold/10 border-gold/30' : 'bg-gold/5 border-gold/10 hover:bg-gold/10 hover:border-gold/20'}`}
                                                onClick={() => setExpandedEvent(isExpanded ? null : idx)}
                                            >
                                                <div className="flex items-center gap-3 p-3">
                                                    <div className="flex flex-col items-center justify-center min-w-10 h-10 w-10 bg-[#0a0a0a] rounded-md border border-gold/30">
                                                        <span className="text-[10px] font-bold text-gold">{day.date.hijri.day}</span>
                                                        <span className="text-[8px] text-white/40 uppercase">
                                                            {language === 'ar' ? day.date.hijri.month.ar : day.date.hijri.month.en.substring(0, 3)}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1 pr-2">
                                                        <p className="text-sm font-bold text-gold-metallic leading-tight">{translateHoliday(eventNameEn)}</p>
                                                        <p className="text-[10px] text-white/40 mt-0.5">{day.date.gregorian.date}</p>
                                                    </div>
                                                    <div className="text-gold/40 shrink-0 pr-2">
                                                        <span className={`material-symbols-outlined transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>expand_more</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Expanded Details Section */}
                                                <div 
                                                    className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                                                >
                                                    <div className="p-4 pt-0 border-t border-gold/10 mt-2">
                                                        {eventInfo.description && (
                                                            <p className="text-xs text-white/70 leading-relaxed mb-3">
                                                                {eventInfo.description}
                                                            </p>
                                                        )}
                                                        
                                                        {eventInfo.actions && eventInfo.actions.length > 0 && (
                                                            <div className="bg-black/20 rounded p-3">
                                                                <h5 className="text-[10px] font-bold text-gold/60 uppercase tracking-wider mb-2">
                                                                    {language === 'ar' ? 'الواجب القيام به' : (language === 'ru' ? 'Рекомендуемые действия' : 'Recommended Actions')}
                                                                </h5>
                                                                <ul className="space-y-1.5">
                                                                    {eventInfo.actions.map((action, i) => (
                                                                        <li key={i} className="flex items-start gap-2 text-xs text-white/80">
                                                                            <span className="text-gold mt-0.5">•</span>
                                                                            <span>{action}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
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
