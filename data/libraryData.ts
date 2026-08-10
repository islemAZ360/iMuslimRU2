export type ContentType = 'text' | 'hadith' | 'quran' | 'highlight' | 'step';

export interface LibraryContent {
    type: ContentType;
    content: string;
}

export interface LibrarySubTopic {
    id: string;
    title: string;
    blocks: LibraryContent[];
}

export interface LibraryTopic {
    id: string;
    title: string;
    icon: string;
    subTopics: LibrarySubTopic[];
}

export interface LibraryCategory {
    id: string;
    title: string;
    icon: string;
    topics: LibraryTopic[];
}

export const libraryData: LibraryCategory[] = [
    {
        id: 'aqeedah-tawheed',
        title: 'العقيدة والتوحيد',
        icon: 'auto_awesome',
        topics: [
            {
                id: 'tawheed-types',
                title: 'أقسام التوحيد',
                icon: 'fingerprint',
                subTopics: [
                    {
                        id: 'tawheed-rububiyyah',
                        title: 'توحيد الربوبية',
                        blocks: [
                            { type: 'text', content: 'هو إفراد الله تعالى بأفعاله كالخلق، والرزق، والإحياء، والإماتة، والتدبير.' },
                            { type: 'quran', content: 'اللَّهُ خَالِقُ كُلِّ شَيْءٍ ۖ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ وَكِيلٌ' },
                            { type: 'text', content: 'وقد كان المشركون في عهد النبي ﷺ يقرون بهذا النوع من التوحيد، لكنه لم يدخلهم في الإسلام لأنهم لم يفردوا الله بالعبادة.' },
                            { type: 'quran', content: 'وَلَئِن سَأَلْتَهُم مَّنْ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ لَيَقُولُنَّ اللَّهُ' }
                        ]
                    },
                    {
                        id: 'tawheed-uluhiyyah',
                        title: 'توحيد الألوهية (العبادة)',
                        blocks: [
                            { type: 'text', content: 'هو إفراد الله بأفعال العباد، كالدعاء، والخوف، والرجاء، والتوكل، والاستعانة، والذبح، والنذر.' },
                            { type: 'quran', content: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
                            { type: 'text', content: 'وهو الغاية من خلق الجن والإنس، والسبب الأساسي لبعثة الرسل جميعاً.' },
                            { type: 'quran', content: 'وَلَقَدْ بَعَثْنَا فِي كُلِّ أُمَّةٍ رَّسُولًا أَنِ اعْبُدُوا اللَّهَ وَاجْتَنِبُوا الطَّاغُوتَ' },
                            { type: 'highlight', content: 'شروط لا إله إلا الله:' },
                            { type: 'step', content: 'العلم المنافي للجهل.' },
                            { type: 'step', content: 'اليقين المنافي للشك.' },
                            { type: 'step', content: 'الإخلاص المنافي للشرك.' },
                            { type: 'step', content: 'الصدق المنافي للنفاق.' },
                            { type: 'step', content: 'المحبة المنافية للبغض.' },
                            { type: 'step', content: 'الانقياد المنافي للترك.' },
                            { type: 'step', content: 'القبول المنافي للرد.' }
                        ]
                    },
                    {
                        id: 'tawheed-asma-sifat',
                        title: 'توحيد الأسماء والصفات',
                        blocks: [
                            { type: 'text', content: 'هو إثبات ما أثبته الله لنفسه، أو أثبته له رسوله ﷺ من الأسماء والصفات، ونفي ما نفاه عن نفسه.' },
                            { type: 'highlight', content: 'القاعدة الذهبية:' },
                            { type: 'quran', content: 'لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ' },
                            { type: 'step', content: 'إثبات بلا تمثيل ولا تكييف (لا نقول صفات الله كصفات البشر).' },
                            { type: 'step', content: 'تنزيه بلا تعطيل ولا تحريف (نؤمن بها كما وردت في النصوص ونسلم لمعناها ونفوض كيفيتها لله).' }
                        ]
                    }
                ]
            },
            {
                id: 'pillars-of-faith',
                title: 'أركان الإيمان الستة',
                icon: 'psychology',
                subTopics: [
                    {
                        id: 'faith-overview',
                        title: 'الإيمان بالله والملائكة والكتب',
                        blocks: [
                            { type: 'hadith', content: 'في حديث جبريل الطويل: "أن تؤمن بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، وتؤمن بالقدر خيره وشره".' },
                            { type: 'highlight', content: 'الإيمان بالملائكة:' },
                            { type: 'text', content: 'خلقهم الله من نور. منهم جبريل (للوحي)، ميكائيل (للمطر)، إسرافيل (للنفخ في الصور)، وملك الموت.' },
                            { type: 'highlight', content: 'الإيمان بالكتب:' },
                            { type: 'text', content: 'القرآن (على محمد)، التوراة (على موسى)، الإنجيل (على عيسى)، الزبور (على داود)، وصحف إبراهيم وموسى. والقرآن هو المهيمن عليها والناسخ لها.' }
                        ]
                    },
                    {
                        id: 'faith-prophets-qadar',
                        title: 'الإيمان بالرسل واليوم الآخر والقدر',
                        blocks: [
                            { type: 'highlight', content: 'الإيمان بالرسل:' },
                            { type: 'text', content: 'أولهم نوح وآخرهم محمد ﷺ. وأولو العزم خمسة: نوح، إبراهيم، موسى، عيسى، ومحمد عليهم السلام.' },
                            { type: 'highlight', content: 'الإيمان بالقدر (مراتبه الأربع):' },
                            { type: 'step', content: 'العلم: علم الله الأزلي المحيط بكل شيء.' },
                            { type: 'step', content: 'الكتابة: كتابة المقادير في اللوح المحفوظ.' },
                            { type: 'step', content: 'المشيئة: ما شاء الله كان وما لم يشأ لم يكن.' },
                            { type: 'step', content: 'الخلق: الله خالق كل شيء ومن ضمنها أفعال العباد.' }
                        ]
                    }
                ]
            },
            {
                id: 'nawaqid-islam',
                title: 'نواقض الإسلام والشرك',
                icon: 'warning',
                subTopics: [
                    {
                        id: 'shirk-types',
                        title: 'الشرك الأكبر والأصغر',
                        blocks: [
                            { type: 'text', content: 'الشرك هو أعظم ذنب عُصي الله به، وهو الذنب الوحيد الذي لا يغفره الله لمن مات عليه دون توبة.' },
                            { type: 'quran', content: 'إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ' },
                            { type: 'highlight', content: 'الشرك الأكبر (مخرج من الملة):' },
                            { type: 'step', content: 'شرك الدعاء: كدعاء الأموات للاستغاثة بهم.' },
                            { type: 'step', content: 'شرك الطاعة: تحليل ما حرم الله أو العكس.' },
                            { type: 'step', content: 'شرك المحبة: أن يحب مخلوقاً كحب الله أو أشد.' },
                            { type: 'highlight', content: 'الشرك الأصغر (غير مخرج من الملة ولكنه من الكبائر):' },
                            { type: 'step', content: 'الرياء: العمل الصالح ليراه الناس.' },
                            { type: 'step', content: 'الحلف بغير الله: كالحلف بالنبي أو الشرف.' }
                        ]
                    },
                    {
                        id: 'ten-nullifiers',
                        title: 'النواقض العشرة المخرجة من الملة',
                        blocks: [
                            { type: 'text', content: 'من أهم نواقض الإسلام المجمع عليها:' },
                            { type: 'step', content: '1. الشرك في عبادة الله.' },
                            { type: 'step', content: '2. اتخاذ الوسائط بين العبد وربه يتوكل عليهم ويدعوهم.' },
                            { type: 'step', content: '3. من لم يكفر المشركين أو شك في كفرهم.' },
                            { type: 'step', content: '4. اعتقاد أن حكم غير النبي ﷺ أحسن من حكمه.' },
                            { type: 'step', content: '5. بغض شيء مما جاء به الرسول ﷺ ولو عمل به.' },
                            { type: 'step', content: '6. الاستهزاء بشيء من دين الله.' },
                            { type: 'step', content: '7. السحر فعلاً أو رضا.' },
                            { type: 'step', content: '8. مظاهرة المشركين ومعاونتهم على المسلمين.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'fiqh-ibadat',
        title: 'فقه العبادات',
        icon: 'mosque',
        topics: [
            {
                id: 'tahara',
                title: 'الطهارة والوضوء والغسل',
                icon: 'water_drop',
                subTopics: [
                    {
                        id: 'wudu-details',
                        title: 'الوضوء ونواقضه',
                        blocks: [
                            { type: 'hadith', content: 'قال ﷺ: "لا يقبل الله صلاة أحدكم إذا أحدث حتى يتوضأ".' },
                            { type: 'highlight', content: 'فرائض الوضوء (أركانه الستة):' },
                            { type: 'step', content: 'غسل الوجه (ومنه المضمضة والاستنشاق).' },
                            { type: 'step', content: 'غسل اليدين مع المرفقين.' },
                            { type: 'step', content: 'مسح الرأس (ومنه الأذنان).' },
                            { type: 'step', content: 'غسل الرجلين مع الكعبين.' },
                            { type: 'step', content: 'الترتيب بين الأعضاء.' },
                            { type: 'step', content: 'الموالاة (عدم التأخير حتى يجف العضو السابق).' },
                            { type: 'highlight', content: 'نواقض الوضوء:' },
                            { type: 'step', content: 'الخارج من السبيلين (بول، غائط، ريح، مذي).' },
                            { type: 'step', content: 'زوال العقل بسكر أو نوم مستغرق.' },
                            { type: 'step', content: 'أكل لحم الإبل.' }
                        ]
                    },
                    {
                        id: 'ghusl-tayammum',
                        title: 'الغسل والتيمم',
                        blocks: [
                            { type: 'highlight', content: 'موجبات الغسل:' },
                            { type: 'step', content: 'خروج المني بلذة.' },
                            { type: 'step', content: 'التقاء الختانين (الجماع).' },
                            { type: 'step', content: 'انقطاع دم الحيض والنفاس.' },
                            { type: 'step', content: 'دخول الكافر في الإسلام.' },
                            { type: 'highlight', content: 'التيمم (عند فقد الماء أو العجز عنه):' },
                            { type: 'quran', content: 'فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا فَامْسَحُوا بِوُجُوهِكُمْ وَأَيْدِيكُم مِّنْهُ' },
                            { type: 'text', content: 'ضرب الأرض بالكفين ضربة واحدة، ومسح الوجه وظاهر الكفين.' }
                        ]
                    }
                ]
            },
            {
                id: 'salah-comprehensive',
                title: 'الصلاة (عماد الدين)',
                icon: 'prayer_times',
                subTopics: [
                    {
                        id: 'salah-conditions',
                        title: 'شروط الصلاة وأركانها',
                        blocks: [
                            { type: 'highlight', content: 'شروط صحة الصلاة:' },
                            { type: 'step', content: 'الإسلام، والعقل، والتمييز.' },
                            { type: 'step', content: 'دخول الوقت.' },
                            { type: 'step', content: 'ستر العورة (من السرة للركبة للرجل، والمرأة كلها عورة في الصلاة عدا الوجه والكفين).' },
                            { type: 'step', content: 'الطهارة من الحدث والنجاسة واستقبال القبلة والنية.' },
                            { type: 'highlight', content: 'أركان الصلاة (لا تسقط سهواً ولا جهلاً):' },
                            { type: 'step', content: 'القيام مع القدرة في الفرض.' },
                            { type: 'step', content: 'تكبيرة الإحرام، وقراءة الفاتحة.' },
                            { type: 'step', content: 'الركوع، والرفع منه، والاعتدال.' },
                            { type: 'step', content: 'السجود على الأعضاء السبعة، والجلوس بين السجدتين.' },
                            { type: 'step', content: 'التشهد الأخير والجلوس له والتسليم والطمأنينة في الكل.' }
                        ]
                    },
                    {
                        id: 'jumuah-eid',
                        title: 'الجمعة والعيدين وسجود السهو',
                        blocks: [
                            { type: 'highlight', content: 'صلاة الجمعة:' },
                            { type: 'text', content: 'فرض عين على كل ذكر، بالغ، عاقل، مقيم، مستوطن. من تركها تهاوناً ثلاث مرات طبع الله على قلبه.' },
                            { type: 'highlight', content: 'صلاة العيدين:' },
                            { type: 'text', content: 'ركعتان قبل الخطبة. يكبر في الأولى سبع تكبيرات بعد تكبيرة الإحرام، وفي الثانية خمس تكبيرات.' },
                            { type: 'highlight', content: 'سجود السهو:' },
                            { type: 'text', content: 'يُشرع لجبر الخلل في الصلاة (الزيادة، النقص، الشك). وهو سجدتان قبل التسليم (إذا كان النقص) أو بعده (إذا كان الزيادة).' }
                        ]
                    }
                ]
            },
            {
                id: 'zakat-siyam',
                title: 'الزكاة والصيام',
                icon: 'monetization_on',
                subTopics: [
                    {
                        id: 'zakat-rules',
                        title: 'أحكام الزكاة',
                        blocks: [
                            { type: 'quran', content: 'خُذْ مِنْ أَمْوَالِهِمْ صَدَقَةً تُطَهِّرُهُمْ وَتُزَكِّيهِم بِهَا' },
                            { type: 'highlight', content: 'شروط وجوبها:' },
                            { type: 'step', content: 'بلوغ النصاب (مثلاً الذهب 85 جراماً، الفضة 595 جراماً).' },
                            { type: 'step', content: 'حولان الحول (مرور سنة قمرية)، ويخرج ربع العشر (2.5%) للأموال النقدية وعروض التجارة.' },
                            { type: 'highlight', content: 'مصارف الزكاة الثمانية:' },
                            { type: 'quran', content: 'إِنَّمَا الصَّدَقَاتُ لِلْفُقَرَاءِ وَالْمَسَاكِينِ وَالْعَامِلِينَ عَلَيْهَا وَالْمُؤَلَّفَةِ قُلُوبُهُمْ وَفِي الرِّقَابِ وَالْغَارِمِينَ وَفِي سَبِيلِ اللَّهِ وَابْنِ السَّبِيلِ' }
                        ]
                    },
                    {
                        id: 'siyam-rules',
                        title: 'أحكام الصيام',
                        blocks: [
                            { type: 'hadith', content: 'قال ﷺ: "من صام رمضان إيماناً واحتساباً غُفر له ما تقدم من ذنبه".' },
                            { type: 'highlight', content: 'مبطلات الصوم:' },
                            { type: 'step', content: 'الأكل والشرب متعمداً، والقيء متعمداً، والجماع، وخروج دم الحيض والنفاس، والحجامة (عند الحنابلة).' },
                            { type: 'highlight', content: 'الأعذار المبيحة للفطر:' },
                            { type: 'step', content: 'المرض الذي يشق معه الصوم، السفر، الحمل والرضاع (إذا خافت على نفسها أو ولدها)، الكبر الهرم.' }
                        ]
                    }
                ]
            },
            {
                id: 'hajj-umrah-details',
                title: 'الحج والعمرة',
                icon: 'place',
                subTopics: [
                    {
                        id: 'hajj-pillars-duties',
                        title: 'أركان وواجبات الحج',
                        blocks: [
                            { type: 'hadith', content: 'الحج المبرور ليس له جزاء إلا الجنة.' },
                            { type: 'highlight', content: 'أركان الحج (لا يصح بدونها):' },
                            { type: 'step', content: 'الإحرام (النية).' },
                            { type: 'step', content: 'الوقوف بعرفة (الركن الأعظم).' },
                            { type: 'step', content: 'طواف الإفاضة.' },
                            { type: 'step', content: 'السعي بين الصفا والمروة.' },
                            { type: 'highlight', content: 'واجبات الحج (يجبر تركها بدم):' },
                            { type: 'step', content: 'الإحرام من الميقات.' },
                            { type: 'step', content: 'البقاء بعرفة للغروب لمن وقف نهاراً.' },
                            { type: 'step', content: 'المبيت بمزدلفة وبمنى.' },
                            { type: 'step', content: 'رمي الجمرات، والحلق أو التقصير، وطواف الوداع.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'quran-sciences',
        title: 'القرآن وعلومه وتفسيره',
        icon: 'menu_book',
        topics: [
            {
                id: 'tajweed-science',
                title: 'أحكام التجويد',
                icon: 'record_voice_over',
                subTopics: [
                    {
                        id: 'nun-meem',
                        title: 'أحكام النون والميم الساكنتين',
                        blocks: [
                            { type: 'highlight', content: 'أحكام النون الساكنة والتنوين:' },
                            { type: 'step', content: 'الإظهار الحلقي: (ء، هـ، ع، ح، غ، خ).' },
                            { type: 'step', content: 'الإدغام: (يرملون)، وينقسم لغنة (ينمو) وبدون غنة (ل، ر).' },
                            { type: 'step', content: 'الإقلاب: حرف الباء، تقلب النون ميماً مخفاة بغنة.' },
                            { type: 'step', content: 'الإخفاء الحقيقي: باقي الـ 15 حرفاً.' },
                            { type: 'highlight', content: 'أحكام الميم الساكنة:' },
                            { type: 'step', content: 'الإخفاء الشفوي: إذا جاء بعدها (باء).' },
                            { type: 'step', content: 'إدغام المتماثلين الصغير: إذا جاء بعدها (ميم).' },
                            { type: 'step', content: 'الإظهار الشفوي: عند باقي الحروف، ويكون أشد إظهاراً عند الواو والفاء.' }
                        ]
                    },
                    {
                        id: 'mudood',
                        title: 'أحكام المدود',
                        blocks: [
                            { type: 'text', content: 'المد هو إطالة الصوت بحرف من حروف المد (الألف المفتوح ما قبلها، الواو المضموم ما قبلها، الياء المكسور ما قبلها).' },
                            { type: 'highlight', content: 'المد الأصلي (الطبيعي):' },
                            { type: 'text', content: 'ما لا تقوم ذات الحرف إلا به، ولا يتوقف على سبب، ومقداره حركتان.' },
                            { type: 'highlight', content: 'المد الفرعي (بسبب الهمز أو السكون):' },
                            { type: 'step', content: 'المد المتصل: أن يأتي حرف المد والهمز في كلمة واحدة (مثل: السَّمَاء)، يمد 4 أو 5 حركات.' },
                            { type: 'step', content: 'المد المنفصل: أن يأتي حرف المد في آخر الكلمة والهمز في أول الكلمة الثانية (مثل: بِمَا أُنزِل)، يمد 4 أو 5 حركات ويجوز حركتان.' },
                            { type: 'step', content: 'المد اللازم: أن يأتي بعد حرف المد سكون أصلي، يمد 6 حركات لزوماً (مثل: الضَّالِّين).' }
                        ]
                    }
                ]
            },
            {
                id: 'tafseer-quran',
                title: 'تفسير سور مختارة',
                icon: 'library_books',
                subTopics: [
                    {
                        id: 'tafseer-fatiha-kursi',
                        title: 'الفاتحة وآية الكرسي',
                        blocks: [
                            { type: 'highlight', content: 'سورة الفاتحة:' },
                            { type: 'text', content: 'أم الكتاب والسبع المثاني. بدأت بالحمد والثناء (الحمد لله رب العالمين..)، ثم التوحيد وإفراد العبادة (إياك نعبد وإياك نستعين)، ثم الدعاء بالهداية للصراط المستقيم.' },
                            { type: 'highlight', content: 'آية الكرسي (أعظم آية في القرآن):' },
                            { type: 'quran', content: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ...' },
                            { type: 'text', content: 'تضمنت خمسة من أسماء الله الحسنى، واشتملت على توحيد الألوهية والربوبية والأسماء والصفات. من قرأها دبر كل صلاة لم يمنعه من دخول الجنة إلا أن يموت.' }
                        ]
                    },
                    {
                        id: 'tafseer-kahf-mulk',
                        title: 'سورة الكهف وسورة الملك',
                        blocks: [
                            { type: 'highlight', content: 'سورة الكهف:' },
                            { type: 'hadith', content: 'من قرأ سورة الكهف في يوم الجمعة أضاء له من النور ما بين الجمعتين.' },
                            { type: 'text', content: 'تعالج السورة أربع فتن كبرى: فتنة الدين (قصة أصحاب الكهف)، فتنة المال (صاحب الجنتين)، فتنة العلم (موسى والخضر)، وفتنة السلطة (ذو القرنين).' },
                            { type: 'highlight', content: 'سورة الملك (تبارك):' },
                            { type: 'hadith', content: 'سورة من القرآن ثلاثون آية شفعت لرجل حتى غفر له، وهي تبارك الذي بيده الملك.' },
                            { type: 'text', content: 'تُعرف بـ "المانعة" لأنها تمنع وتنجي صاحبها من عذاب القبر.' }
                        ]
                    }
                ]
            },
            {
                id: 'quran-stories-details',
                title: 'قصص القرآن العظيم',
                icon: 'history_edu',
                subTopics: [
                    {
                        id: 'luqman-and-saba',
                        title: 'لقمان الحكيم وقصة سبأ',
                        blocks: [
                            { type: 'highlight', content: 'وصايا لقمان لابنه:' },
                            { type: 'quran', content: 'يَا بُنَيَّ لَا تُشْرِكْ بِاللَّهِ ۖ إِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ' },
                            { type: 'step', content: 'التحذير من الشرك.' },
                            { type: 'step', content: 'مراقبة الله (إن تك مثقال حبة من خردل...).' },
                            { type: 'step', content: 'إقامة الصلاة، الأمر بالمعروف، الصبر.' },
                            { type: 'step', content: 'النهي عن التكبر والخيلاء (ولا تصعر خدك للناس).' },
                            { type: 'highlight', content: 'قصة سبأ:' },
                            { type: 'text', content: 'أمة أنعم الله عليها بجنتين عن يمين وشمال، فلما أعرضوا عن شكر المنعم، أرسل الله عليهم سيل العرم فبدل جناتهم بأشجار لا تثمر إلا قليلاً.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'hadith-sciences',
        title: 'الحديث الشريف ومصطلحه',
        icon: 'gavel',
        topics: [
            {
                id: 'mustalah-hadith',
                title: 'مصطلح الحديث وأنواعه',
                icon: 'school',
                subTopics: [
                    {
                        id: 'hadith-types',
                        title: 'الصحيح والحسن والضعيف والموضوع',
                        blocks: [
                            { type: 'text', content: 'علم الحديث هو العلم الذي يُعرف به حال السند والمتن من حيث القبول والرد.' },
                            { type: 'highlight', content: 'الحديث الصحيح:' },
                            { type: 'text', content: 'ما اتصل سنده بنقل العدل الضابط عن مثله إلى منتهاه من غير شذوذ ولا علة.' },
                            { type: 'highlight', content: 'الحديث الحسن:' },
                            { type: 'text', content: 'كالصحيح إلا أن راويه خف ضبطه (قلت دقة حفظه قليلاً).' },
                            { type: 'highlight', content: 'الحديث الضعيف:' },
                            { type: 'text', content: 'ما فقد شرطاً من شروط القبول (كالانقطاع في السند أو سوء حفظ الراوي).' },
                            { type: 'highlight', content: 'الحديث الموضوع (المكذوب):' },
                            { type: 'text', content: 'هو الكذب المختلق المصنوع المنسوب للنبي ﷺ زورا، ولا تحل روايته إلا لبيان كذبه.' }
                        ]
                    }
                ]
            },
            {
                id: 'nawawi-forty',
                title: 'مقتطفات من الأربعين النووية',
                icon: 'format_list_numbered',
                subTopics: [
                    {
                        id: 'nawawi-selections',
                        title: 'أحاديث جوامع الكلم',
                        blocks: [
                            { type: 'highlight', content: 'الحديث الأول (الإخلاص):' },
                            { type: 'hadith', content: 'إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى...' },
                            { type: 'highlight', content: 'الحديث العاشر (أكل الحلال):' },
                            { type: 'hadith', content: 'إن الله تعالى طيب لا يقبل إلا طيبا... ثم ذكر الرجل يطيل السفر أشعث أغبر، يمد يديه إلى السماء، يا رب، يا رب، ومطعمه حرام، ومشربه حرام، وملبسه حرام، وغذي بالحرام، فأنى يستجاب لذلك؟' },
                            { type: 'highlight', content: 'الحديث الحادي عشر (ترك الشبهات):' },
                            { type: 'hadith', content: 'دع ما يريبك إلى ما لا يريبك.' },
                            { type: 'highlight', content: 'الحديث الخامس عشر (آداب إسلامية):' },
                            { type: 'hadith', content: 'من كان يؤمن بالله واليوم الآخر فليقل خيرا أو ليصمت، ومن كان يؤمن بالله واليوم الآخر فليكرم جاره، ومن كان يؤمن بالله واليوم الآخر فليكرم ضيفه.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'fiqh-muamalat',
        title: 'فقه المعاملات والمواريث',
        icon: 'account_balance',
        topics: [
            {
                id: 'trade-riba',
                title: 'البيوع والربا',
                icon: 'shopping_cart',
                subTopics: [
                    {
                        id: 'halal-haram-trade',
                        title: 'البيوع الجائزة والمحرمة',
                        blocks: [
                            { type: 'quran', content: 'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا' },
                            { type: 'text', content: 'الأصل في البيوع الإباحة إذا خلت من الموانع الشرعية كالربا والغرر والظلم.' },
                            { type: 'highlight', content: 'بيوع محرمة:' },
                            { type: 'step', content: 'بيع الغرر: ما كان مجهول العاقبة (كبيع الطير في الهواء أو السمك في الماء).' },
                            { type: 'step', content: 'بيع العينة: أن يبيع سلعة بثمن مؤجل ثم يشتريها نقداً بثمن أقل.' },
                            { type: 'step', content: 'النجش: الزيادة في ثمن السلعة في المزاد وهو لا يريد شراءها، بل ليخدع غيره.' }
                        ]
                    },
                    {
                        id: 'riba-types',
                        title: 'أنواع الربا',
                        blocks: [
                            { type: 'text', content: 'الربا من السبع الموبقات المهلكات.' },
                            { type: 'highlight', content: 'ربا النسيئة (الدين):' },
                            { type: 'text', content: 'كل قرض جر نفعاً، كالزيادة المشروطة مقابل تأجيل السداد.' },
                            { type: 'highlight', content: 'ربا الفضل:' },
                            { type: 'text', content: 'الزيادة في تبادل الأصناف الربوية الستة ببعضها من نفس الجنس (الذهب بالذهب، الفضة بالفضة، البر بالبر، الشعير بالشعير، التمر بالتمر، الملح بالملح). يُشترط فيها التماثل في الوزن والتقابض في المجلس.' }
                        ]
                    }
                ]
            },
            {
                id: 'inheritance',
                title: 'المواريث والوصايا',
                icon: 'gavel',
                subTopics: [
                    {
                        id: 'faraid-basics',
                        title: 'أصول علم الفرائض',
                        blocks: [
                            { type: 'text', content: 'الحقوق المتعلقة بالتركة بالترتيب: 1. مؤن التجهيز (الغسل والدفن)، 2. قضاء الديون، 3. تنفيذ الوصية (بشرط ألا تتجاوز الثلث لغير وارث)، 4. قسمة الباقي على الورثة.' },
                            { type: 'highlight', content: 'أصحاب النصف:' },
                            { type: 'step', content: 'الزوج (إن لم يكن للزوجة فرع وارث).' },
                            { type: 'step', content: 'البنت الواحدة، بنت الابن الواحدة، الأخت الشقيقة الواحدة، الأخت لأب الواحدة.' },
                            { type: 'highlight', content: 'أصحاب الربع والثمن:' },
                            { type: 'step', content: 'الربع: للزوج (إذا كان للزوجة فرع وارث)، وللزوجة (إن لم يكن للزوج فرع وارث).' },
                            { type: 'step', content: 'الثمن: للزوجة (إذا كان للزوج فرع وارث).' }
                        ]
                    }
                ]
            },
            {
                id: 'food-hunting',
                title: 'الأطعمة والأشربة والصيد',
                icon: 'restaurant',
                subTopics: [
                    {
                        id: 'halal-food',
                        title: 'المحرمات من الطعام وأحكام الذكاة',
                        blocks: [
                            { type: 'text', content: 'الأصل في الأشياء الإباحة. المحرمات تشمل: الميتة، الدم المسفوح، لحم الخنزير، وما أهل لغير الله به.' },
                            { type: 'highlight', content: 'شروط الذكاة (الذبح) الشرعية:' },
                            { type: 'step', content: 'أن يكون الذابح مسلماً أو كتابياً.' },
                            { type: 'step', content: 'ذكر اسم الله (التسمية) عند الذبح.' },
                            { type: 'step', content: 'قطع الحلقوم والمريء والودجين بآلة حادة تنهر الدم.' },
                            { type: 'text', content: 'يحل ميتتان (السمك والجراد) ودمان (الكبد والطحال).' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'fiqh-usra',
        title: 'فقه الأسرة والمرأة',
        icon: 'diversity_1',
        topics: [
            {
                id: 'marriage-divorce',
                title: 'الزواج والطلاق',
                icon: 'favorite',
                subTopics: [
                    {
                        id: 'marriage-conditions',
                        title: 'أحكام النكاح',
                        blocks: [
                            { type: 'text', content: 'الزواج سنة الأنبياء والمرسلين.' },
                            { type: 'highlight', content: 'شروط صحة عقد النكاح:' },
                            { type: 'step', content: 'تعيين الزوجين.' },
                            { type: 'step', content: 'رضا الزوجين.' },
                            { type: 'step', content: 'الولي للمرأة (لا نكاح إلا بولي).' },
                            { type: 'step', content: 'الشهادة على العقد (شاهدا عدل).' },
                            { type: 'highlight', content: 'حقوق الزوجة:' },
                            { type: 'text', content: 'المهر، النفقة بالمعروف، السكن، حسن العشرة، والعدل (إن كان معددًا).' },
                            { type: 'highlight', content: 'حقوق الزوج:' },
                            { type: 'text', content: 'الطاعة في المعروف، حفظه في ماله وعرضه، ألا تأذن في بيته لمن يكره.' }
                        ]
                    },
                    {
                        id: 'divorce-rules',
                        title: 'أحكام الطلاق والعدة',
                        blocks: [
                            { type: 'text', content: 'الطلاق أبغض الحلال، وله أحكام شرعية دقيقة تحمي حقوق الطرفين.' },
                            { type: 'highlight', content: 'الطلاق السني والبدعي:' },
                            { type: 'step', content: 'الطلاق السني: أن يطلقها طلقة واحدة في طهر لم يجامعها فيه.' },
                            { type: 'step', content: 'الطلاق البدعي: أن يطلقها وهي حائض، أو في طهر جامعها فيه (وهو محرم ويأثم فاعله).' },
                            { type: 'highlight', content: 'العدة:' },
                            { type: 'step', content: 'المطلقة التي تحيض: ثلاثة قروء (حيضات).' },
                            { type: 'step', content: 'الأرملة (المتوفى عنها زوجها): أربعة أشهر وعشرا.' },
                            { type: 'step', content: 'الحامل: عدتها بوضع الحمل.' }
                        ]
                    }
                ]
            },
            {
                id: 'women-fiqh',
                title: 'فقه النساء',
                icon: 'woman',
                subTopics: [
                    {
                        id: 'hijab-mahrams',
                        title: 'الحجاب والمحارم',
                        blocks: [
                            { type: 'quran', content: 'يَا أَيُّهَا النَّبِيُّ قُل لِّأَزْوَاجِكَ وَبَنَاتِكَ وَنِسَاءِ الْمُؤْمِنِينَ يُدْنِينَ عَلَيْهِنَّ مِن جَلَابِيبِهِنَّ' },
                            { type: 'highlight', content: 'شروط الحجاب الشرعي:' },
                            { type: 'step', content: 'استيعاب جميع البدن.' },
                            { type: 'step', content: 'ألا يكون زينة في نفسه.' },
                            { type: 'step', content: 'أن يكون صفيقاً (لا يشف) وواسعاً (لا يصف حجم الأعضاء).' },
                            { type: 'step', content: 'ألا يكون مبخراً أو مطيباً.' },
                            { type: 'step', content: 'ألا يشبه لباس الرجال أو الكافرات.' },
                            { type: 'highlight', content: 'المحارم من الرجال:' },
                            { type: 'text', content: 'بالنسب: الأب، الابن، الأخ، العم، الخال، ابن الأخ، ابن الأخت. بالرضاع: نظير النسب. بالمصاهرة: أبو الزوج، ابن الزوج، زوج الأم، زوج البنت.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'seerah-history',
        title: 'السيرة النبوية والتاريخ الإسلامي',
        icon: 'history_edu',
        topics: [
            {
                id: 'seerah-makkan-madinan',
                title: 'العهد المكي والمدني',
                icon: 'mosque',
                subTopics: [
                    {
                        id: 'makkan-period-details',
                        title: 'الدعوة في مكة والابتلاء',
                        blocks: [
                            { type: 'text', content: 'ولد النبي ﷺ عام الفيل. نزل عليه الوحي وهو في الأربعين بغار حراء.' },
                            { type: 'highlight', content: 'مراحل الدعوة المكية:' },
                            { type: 'step', content: 'الدعوة السرية (3 سنوات): دار الأرقم كانت المركز الأول.' },
                            { type: 'step', content: 'الجهر بالدعوة: تحمل النبي ﷺ والصحابة أذى شديداً (آل ياسر، بلال، خباب).' },
                            { type: 'step', content: 'المقاطعة: حوصر بنو هاشم في شعب أبي طالب 3 سنوات.' },
                            { type: 'step', content: 'عام الحزن: وفاة أبي طالب وزوجته خديجة. تلاها رحلة الطائف، ثم الإسراء والمعراج تكريماً له.' }
                        ]
                    },
                    {
                        id: 'madinan-battles',
                        title: 'العهد المدني والغزوات الكبرى',
                        blocks: [
                            { type: 'text', content: 'الهجرة النبوية شكلت بداية تأسيس الدولة. تم بناء المسجد والمؤاخاة وكتابة وثيقة المدينة.' },
                            { type: 'highlight', content: 'الغزوات الفاصلة:' },
                            { type: 'step', content: 'بدر (2 هـ): يوم الفرقان، 313 مسلماً هزموا 1000 مشرك.' },
                            { type: 'step', content: 'أحد (3 هـ): درس قاسي في مخالفة أمر القيادة، واستشهاد 70 صحابياً.' },
                            { type: 'step', content: 'الخندق (5 هـ): حصار المدينة، الخندق فكرة سلمان الفارسي، والنصر بالريح والملائكة.' },
                            { type: 'step', content: 'الحديبية (6 هـ): صلح وفتح مبين.' },
                            { type: 'step', content: 'خيبر (7 هـ): إنهاء الوجود اليهودي العسكري في الحجاز.' },
                            { type: 'step', content: 'فتح مكة (8 هـ): الدخول بـ 10 آلاف مقاتل والعفو العام.' },
                            { type: 'step', content: 'حجة الوداع (10 هـ): إرساء مبادئ حقوق الإنسان في الإسلام. والوفاة في ربيع الأول (11 هـ).' }
                        ]
                    }
                ]
            },
            {
                id: 'companions-prophets',
                title: 'الصحابة والأنبياء',
                icon: 'group',
                subTopics: [
                    {
                        id: 'rashidun-caliphs',
                        title: 'الخلفاء الراشدون',
                        blocks: [
                            { type: 'highlight', content: 'أبو بكر الصديق:' },
                            { type: 'text', content: 'أول من أسلم، ثبت الأمة يوم وفاة النبي ﷺ، حارب المرتدين، وجمع القرآن.' },
                            { type: 'highlight', content: 'عمر بن الخطاب (الفاروق):' },
                            { type: 'text', content: 'مؤسس الدواوين، قاهر الفرس والروم، في عهده فتحت القدس والشام ومصر.' },
                            { type: 'highlight', content: 'عثمان بن عفان (ذو النورين):' },
                            { type: 'text', content: 'تزوج ابنتي النبي، جهز جيش العسرة، وفي عهده جُمع المصحف العثماني ونسخ للأمصار.' },
                            { type: 'highlight', content: 'علي بن أبي طالب:' },
                            { type: 'text', content: 'فدائي الهجرة، بطل المعارك، المخصوص بالقرابة والعلم.' }
                        ]
                    },
                    {
                        id: 'ulul-azm',
                        title: 'أولو العزم من الرسل',
                        blocks: [
                            { type: 'text', content: 'هم أفضل الأنبياء صبراً وعزماً.' },
                            { type: 'step', content: 'نوح: 950 سنة دعوة، ثم الطوفان.' },
                            { type: 'step', content: 'إبراهيم: خليل الرحمن، كاسر الأصنام، باني الكعبة.' },
                            { type: 'step', content: 'موسى: كليم الله، قاهر فرعون بسلطان الله.' },
                            { type: 'step', content: 'عيسى: كلمة الله وروحه، المرفوع للسماء، سيقتل الدجال.' },
                            { type: 'step', content: 'محمد ﷺ: خاتمهم وسيد ولد آدم وإمام المتقين.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'adab-akhlaq',
        title: 'الآداب والأخلاق والرقائق',
        icon: 'self_improvement',
        topics: [
            {
                id: 'good-manners',
                title: 'الآداب الإسلامية',
                icon: 'favorite',
                subTopics: [
                    {
                        id: 'parents-relatives',
                        title: 'بر الوالدين وصلة الرحم',
                        blocks: [
                            { type: 'quran', content: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا' },
                            { type: 'text', content: 'بر الوالدين مقدم على الجهاد في سبيل الله. ومن البر: طاعتهما، الإنفاق عليهما، عدم التضجر (أف)، والدعاء لهما.' },
                            { type: 'hadith', content: 'من أحب أن يبسط له في رزقه، وينسأ له في أثره (أجله)، فليصل رحمه.' }
                        ]
                    },
                    {
                        id: 'tongue-manners',
                        title: 'حفظ اللسان والقلب',
                        blocks: [
                            { type: 'hadith', content: 'وهل يكب الناس في النار على وجوههم إلا حصائد ألسنتهم؟' },
                            { type: 'highlight', content: 'آفات اللسان:' },
                            { type: 'step', content: 'الغيبة: ذكرك أخاك بما يكره.' },
                            { type: 'step', content: 'النميمة: نقل الكلام للإفساد.' },
                            { type: 'step', content: 'الكذب، شهادة الزور، اللعن والفحش.' },
                            { type: 'highlight', content: 'آفات القلوب:' },
                            { type: 'text', content: 'الحسد (تمني زوال النعمة)، الكبر (بطر الحق وغمط الناس)، والرياء.' }
                        ]
                    }
                ]
            },
            {
                id: 'repentance-sins',
                title: 'التوبة والكبائر',
                icon: 'warning',
                subTopics: [
                    {
                        id: 'tawbah-conditions',
                        title: 'شروط التوبة النصوح',
                        blocks: [
                            { type: 'quran', content: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ' },
                            { type: 'text', content: 'باب التوبة مفتوح حتى تطلع الشمس من مغربها، أو تبلغ الروح الحلقوم.' },
                            { type: 'highlight', content: 'الشروط:' },
                            { type: 'step', content: '1. الإقلاع الفوري عن الذنب.' },
                            { type: 'step', content: '2. الندم الصادق على ما فات.' },
                            { type: 'step', content: '3. العزم الأكيد على عدم العودة.' },
                            { type: 'step', content: '4. رد المظالم (إن كان الذنب يتعلق بحقوق الناس).' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'adhkar-ruqyah',
        title: 'الأذكار والرقية والطب النبوي',
        icon: 'shield',
        topics: [
            {
                id: 'daily-adhkar',
                title: 'أذكار المسلم',
                icon: 'light_mode',
                subTopics: [
                    {
                        id: 'morning-evening',
                        title: 'أذكار الصباح والمساء',
                        blocks: [
                            { type: 'text', content: 'حصن المسلم المتين للحفظ من الشياطين والعين.' },
                            { type: 'quran', content: 'آية الكرسي + سورة الإخلاص والمعوذتين (3 مرات).' },
                            { type: 'hadith', content: 'سيد الاستغفار: اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي، فاغفر لي فإنه لا يغفر الذنوب إلا أنت.' },
                            { type: 'hadith', content: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم (3 مرات).' },
                            { type: 'hadith', content: 'أعوذ بكلمات الله التامات من شر ما خلق (3 مرات - في المساء).' }
                        ]
                    },
                    {
                        id: 'situational-adhkar',
                        title: 'أذكار النوم والمناسبات',
                        blocks: [
                            { type: 'highlight', content: 'عند النوم:' },
                            { type: 'text', content: 'النفث في الكفين بالمعوذات ومسح الجسد 3 مرات. قراءة آية الكرسي. وقول: "باسمك ربي وضعت جنبي وبك أرفعه".' },
                            { type: 'highlight', content: 'عند الخروج من المنزل:' },
                            { type: 'hadith', content: 'بسم الله، توكلت على الله، ولا حول ولا قوة إلا بالله. (يقال له: هديت وكفيت ووقيت وتنحى عنه الشيطان).' }
                        ]
                    }
                ]
            },
            {
                id: 'ruqyah-tibb',
                title: 'الرقية والطب النبوي',
                icon: 'medical_services',
                subTopics: [
                    {
                        id: 'ruqyah-shariyah',
                        title: 'الرقية الشرعية الشاملة',
                        blocks: [
                            { type: 'text', content: 'الرقية شفاء من العين والحسد والسحر والأمراض العضوية.' },
                            { type: 'highlight', content: 'من القرآن:' },
                            { type: 'text', content: 'الفاتحة (7 مرات)، آية الكرسي، خواتيم البقرة، آيات إبطال السحر في الأعراف ويونس وطه، وسور الإخلاص والفلق والناس.' },
                            { type: 'highlight', content: 'من السنة:' },
                            { type: 'hadith', content: 'أذهب الباس رب الناس، اشف أنت الشافي، لا شفاء إلا شفاؤك، شفاء لا يغادر سقماً.' },
                            { type: 'hadith', content: 'بسم الله أرقيك، من كل شيء يؤذيك، من شر كل نفس أو عين حاسد، الله يشفيك.' }
                        ]
                    },
                    {
                        id: 'tibb-nabawi',
                        title: 'العلاجات النبوية الطبيعية',
                        blocks: [
                            { type: 'step', content: 'العسل: فيه شفاء للناس ومضاد حيوي طبيعي.' },
                            { type: 'step', content: 'الحبة السوداء: شفاء من كل داء إلا الموت.' },
                            { type: 'step', content: 'ماء زمزم: طعام طعم وشفاء سقم، وهو لما شرب له.' },
                            { type: 'step', content: 'الحجامة: من أفضل ما تداوى به الناس، لتنقية الدم وعلاج الآلام.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'eschatology-akhirah',
        title: 'أشراط الساعة والدار الآخرة',
        icon: 'hourglass_bottom',
        topics: [
            {
                id: 'signs-of-hour',
                title: 'علامات الساعة الصغرى والكبرى',
                icon: 'visibility',
                subTopics: [
                    {
                        id: 'minor-signs',
                        title: 'أشراط الساعة الصغرى',
                        blocks: [
                            { type: 'text', content: 'منها ما وقع وانقضى، ومنها ما ظهر ولا يزال يتتابع.' },
                            { type: 'step', content: 'بعثة النبي ﷺ ووفاته.' },
                            { type: 'step', content: 'تطاول رعاة الغنم في البنيان.' },
                            { type: 'step', content: 'كثرة الزلازل والفتن والقتل.' },
                            { type: 'step', content: 'ضياع الأمانة وتوسيد الأمر لغير أهله.' },
                            { type: 'step', content: 'ظهور الكاسيات العاريات.' },
                            { type: 'step', content: 'تقارب الزمان والأسواق.' }
                        ]
                    },
                    {
                        id: 'major-signs',
                        title: 'العلامات الكبرى المتتابعة',
                        blocks: [
                            { type: 'text', content: 'عشر علامات متتابعة كنظام انقطع سلكه:' },
                            { type: 'step', content: '1. الدجال: أعظم فتنة على وجه الأرض، يدعي الألوهية.' },
                            { type: 'step', content: '2. نزول عيسى بن مريم: ينزل بدمشق، يقتل الدجال ويحكم بالإسلام.' },
                            { type: 'step', content: '3. يأجوج ومأجوج: أمتان مفسدتان يهلكهم الله بدعاء عيسى.' },
                            { type: 'step', content: '4، 5، 6. ثلاثة خسوف: خسف بالمشرق، والمغرب، وجزيرة العرب.' },
                            { type: 'step', content: '7. الدخان: يأخذ بأنفاس الناس.' },
                            { type: 'step', content: '8. طلوع الشمس من مغربها (عندها يغلق باب التوبة).' },
                            { type: 'step', content: '9. الدابة: تكلم الناس وتسمهم.' },
                            { type: 'step', content: '10. نار تخرج من اليمن تطرد الناس لمحشرهم.' }
                        ]
                    }
                ]
            },
            {
                id: 'afterlife',
                title: 'البرزخ والقيامة والجنة والنار',
                icon: 'nature_people',
                subTopics: [
                    {
                        id: 'barzakh-qiyamah',
                        title: 'القبر ويوم الحساب',
                        blocks: [
                            { type: 'text', content: 'حياة البرزخ هي الحياة بين الموت والبعث، وفي القبر يكون النعيم أو العذاب بناءً على إجابة أسئلة الملكين (من ربك؟ ما دينك؟ من نبيك؟).' },
                            { type: 'text', content: 'يوم القيامة يبعث الناس حفاة عراة غرلاً، تدنو الشمس من الرؤوس، وينصب الميزان وتتطاير الصحف.' }
                        ]
                    },
                    {
                        id: 'jannah-jahannam',
                        title: 'الجنة والنار',
                        blocks: [
                            { type: 'highlight', content: 'الجنة (دار المتقين):' },
                            { type: 'text', content: 'بناؤها لبنة من ذهب ولبنة من فضة، ملاطها المسك، وحصباؤها اللؤلؤ. فيها ما لا عين رأت، ولا أذن سمعت، ولا خطر على قلب بشر. أعظم نعيمها: رؤية وجه الله الكريم.' },
                            { type: 'highlight', content: 'النار (دار الكافرين):' },
                            { type: 'quran', content: 'كَلَّا ۖ إِنَّهَا لَظَىٰ * نَزَّاعَةً لِّلشَّوَىٰ' },
                            { type: 'text', content: 'نار الدنيا جزء من سبعين جزءاً من نار جهنم. طعامهم الزقوم وشرابهم الحميم والصُّديد. أعاذنا الله منها.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'duaas-adhkar',
        title: 'الأدعية والأذكار المأثورة',
        icon: 'spa',
        topics: [
            {
                id: 'daily-adhkar',
                title: 'أذكار اليوم والليلة',
                icon: 'brightness_4',
                subTopics: [
                    {
                        id: 'morning-evening',
                        title: 'أذكار الصباح والمساء',
                        blocks: [
                            { type: 'highlight', content: 'أعظم ما يُحفظ به العبد في يومه:' },
                            { type: 'hadith', content: 'سيد الاستغفار: اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي وأبوء بذنبي، فاغفر لي فإنه لا يغفر الذنوب إلا أنت.' },
                            { type: 'hadith', content: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم (3 مرات).' },
                            { type: 'hadith', content: 'أعوذ بكلمات الله التامات من شر ما خلق (3 مرات في المساء).' },
                            { type: 'quran', content: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ... (آية الكرسي).' }
                        ]
                    },
                    {
                        id: 'sleep-adhkar',
                        title: 'أذكار النوم والاستيقاظ',
                        blocks: [
                            { type: 'step', content: 'النفث في الكفين وقراءة المعوذات (الإخلاص، الفلق، الناس) ثلاثاً ومسح الجسد بها.' },
                            { type: 'hadith', content: 'باسمك ربي وضعت جنبي وبك أرفعه، إن أمسكت نفسي فارحمها، وإن أرسلتها فاحفظها بما تحفظ به عبادك الصالحين.' },
                            { type: 'hadith', content: 'دعاء الاستيقاظ: الحمد لله الذي أحيانا بعد ما أماتنا وإليه النشور.' }
                        ]
                    }
                ]
            },
            {
                id: 'comprehensive-duaas',
                title: 'جوامع الدعاء النبوي',
                icon: 'volunteer_activism',
                subTopics: [
                    {
                        id: 'prophet-duaas',
                        title: 'أدعية جامعة من السنة',
                        blocks: [
                            { type: 'hadith', content: 'اللهم إني أسألك الهدى والتقى والعفاف والغنى.' },
                            { type: 'hadith', content: 'اللهم أصلح لي ديني الذي هو عصمة أمري، وأصلح لي دنياي التي فيها معاشي، وأصلح لي آخرتي التي فيها معادي.' },
                            { type: 'hadith', content: 'يا مقلب القلوب ثبت قلبي على دينك (أكثر دعاء النبي ﷺ).' },
                            { type: 'hadith', content: 'اللهم إني أعوذ بك من زوال نعمتك، وتحول عافيتك، وفجاءة نقمتك، وجميع سخطك.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'islamic-finance',
        title: 'الاقتصاد والتمويل الإسلامي',
        icon: 'account_balance_wallet',
        topics: [
            {
                id: 'halal-investments',
                title: 'أحكام التجارة والاستثمار',
                icon: 'monetization_on',
                subTopics: [
                    {
                        id: 'business-ethics',
                        title: 'أخلاقيات التاجر المسلم',
                        blocks: [
                            { type: 'text', content: 'الاقتصاد الإسلامي يقوم على مبدأ العدل وتحريم الظلم وأكل أموال الناس بالباطل.' },
                            { type: 'hadith', content: 'التاجر الصدوق الأمين مع النبيين والصديقين والشهداء.' },
                            { type: 'step', content: 'الصدق والبيان: يحرم كتمان عيوب السلعة.' },
                            { type: 'step', content: 'السماحة: "رحم الله رجلاً سمحاً إذا باع، وإذا اشترى، وإذا اقتضى".' },
                            { type: 'step', content: 'تحريم الاحتكار: وهو حبس السلعة الأساسية ليرتفع ثمنها.' }
                        ]
                    },
                    {
                        id: 'modern-finance',
                        title: 'المعاملات المالية المعاصرة',
                        blocks: [
                            { type: 'highlight', content: 'أحكام الأسهم والبورصة:' },
                            { type: 'text', content: 'تجوز المساهمة في الشركات ذات النشاط المباح (كشركات التقنية والزراعة والتجارة الحلال)، وتحرم في الشركات ذات النشاط المحرم (كالبنوك الربوية والخمور والملاهي).' },
                            { type: 'highlight', content: 'التأمين:' },
                            { type: 'text', content: 'التأمين التجاري محرم لاشتماله على الغرر والربا، والبديل الشرعي هو "التأمين التعاوني" أو التكافلي المبني على التبرع لمعونة المتضرر.' },
                            { type: 'highlight', content: 'بطاقات الائتمان (الفيزا):' },
                            { type: 'text', content: 'تجوز إذا كانت بطاقة مغطاة (ديبت) أو بطاقة ائتمان لا تفرض غرامات تأخير عند التخلف عن السداد.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'dawah-tarbiyah',
        title: 'الدعوة والتربية الإسلامية',
        icon: 'diversity_3',
        topics: [
            {
                id: 'dawah-methods',
                title: 'أصول الدعوة إلى الله',
                icon: 'campaign',
                subTopics: [
                    {
                        id: 'wisdom-preaching',
                        title: 'الحكمة والموعظة الحسنة',
                        blocks: [
                            { type: 'quran', content: 'ادْعُ إِلَىٰ سَبِيلِ رَبِّكَ بِالْحِكْمَةِ وَالْمَوْعِظَةِ الْحَسَنَةِ ۖ وَجَادِلْهُم بِالَّتِي هِيَ أَحْسَنُ' },
                            { type: 'text', content: 'الداعية الناجح هو الذي يجمع بين العلم الشرعي والرفق بالمدعوين ومعرفة أحوالهم وعاداتهم.' },
                            { type: 'highlight', content: 'صفات الداعية:' },
                            { type: 'step', content: 'الإخلاص: أن يبتغي بدعوته وجه الله لا الرياء ولا السمعة.' },
                            { type: 'step', content: 'العلم: فلا يدعو على جهل فيفسد أكثر مما يصلح.' },
                            { type: 'step', content: 'الصبر: على أذى الناس وجفائهم، كما صبر أولو العزم من الرسل.' },
                            { type: 'step', content: 'القدوة: أن يطابق قوله فعله.' }
                        ]
                    }
                ]
            },
            {
                id: 'tarbiyah-islamiyah',
                title: 'تربية الأبناء في الإسلام',
                icon: 'family_restroom',
                subTopics: [
                    {
                        id: 'raising-children',
                        title: 'المسؤولية التربوية',
                        blocks: [
                            { type: 'quran', content: 'يَا أَيُّهَا الَّذِينَ آمَنُوا قُوا أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا وَقُودُهَا النَّاسُ وَالْحِجَارَةُ' },
                            { type: 'hadith', content: 'كلكم راع وكلكم مسئول عن رعيته... والرجل راع في أهله وهو مسئول عن رعيته.' },
                            { type: 'highlight', content: 'خطوات التربية النبوية:' },
                            { type: 'step', content: 'اختيار الاسم الحسن للطفل.' },
                            { type: 'step', content: 'تلقينه التوحيد (يا غلام إني أعلمك كلمات: احفظ الله يحفظك...).' },
                            { type: 'step', content: 'تعويده على الصلاة لسبع سنين وضربه عليها لعشر (ضرب تأديب غير مبرح).' },
                            { type: 'step', content: 'العدل بين الأبناء في العطية والمعاملة.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'prophets-miracles',
        title: 'معجزات الأنبياء ودلائل النبوة',
        icon: 'auto_fix_high',
        topics: [
            {
                id: 'quran-miracles',
                title: 'المعجزات الحسية والمعنوية',
                icon: 'star',
                subTopics: [
                    {
                        id: 'past-prophets-miracles',
                        title: 'معجزات الأنبياء السابقين',
                        blocks: [
                            { type: 'text', content: 'المعجزة أمر خارق للعادة يجريه الله على يد النبي تأييداً له وتحدياً لقومه، وتكون غالباً من جنس ما برع فيه القوم.' },
                            { type: 'highlight', content: 'إبراهيم عليه السلام:' },
                            { type: 'text', content: 'أُلقي في نار عظيمة فجعلها الله برداً وسلاماً عليه.' },
                            { type: 'highlight', content: 'موسى عليه السلام:' },
                            { type: 'text', content: 'العصا التي انقلبت حية تسعى وتلقف سحر السحرة، وانفلاق البحر العظيم طريقاً يابساً.' },
                            { type: 'highlight', content: 'عيسى عليه السلام:' },
                            { type: 'text', content: 'إحياء الموتى، وإبراء الأكمه والأبرص، والنفخ في الطين ليصير طيراً بإذن الله.' }
                        ]
                    },
                    {
                        id: 'muhammad-miracles',
                        title: 'دلائل نبوة محمد ﷺ',
                        blocks: [
                            { type: 'text', content: 'أُوتي النبي ﷺ من المعجزات ما فاق كل الأنبياء قبله.' },
                            { type: 'highlight', content: 'القرآن الكريم:' },
                            { type: 'text', content: 'المعجزة الخالدة الباقية إلى يوم القيامة، تحدى الله به الإنس والجن على أن يأتوا بسورة من مثله فعجزوا.' },
                            { type: 'highlight', content: 'المعجزات الحسية:' },
                            { type: 'step', content: 'انشقاق القمر له بمكة حين طالبه المشركون بآية.' },
                            { type: 'step', content: 'نبع الماء من بين أصابعه الشريفة يوم الحديبية حتى توضأ جيش كامل.' },
                            { type: 'step', content: 'حنين الجذع الذي كان يخطب عليه لما انتقل إلى المنبر.' },
                            { type: 'step', content: 'الإسراء والمعراج، وتجاوزه السماوات السبع في ليلة واحدة.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'islamic-thought',
        title: 'الفكر الإسلامي والتيارات المعاصرة',
        icon: 'psychology',
        topics: [
            {
                id: 'contemporary-challenges',
                title: 'مواجهة الشبهات والتحديات',
                icon: 'shield',
                subTopics: [
                    {
                        id: 'atheism-response',
                        title: 'الرد على الإلحاد والشبهات',
                        blocks: [
                            { type: 'quran', content: 'أَمْ خُلِقُوا مِنْ غَيْرِ شَيْءٍ أَمْ هُمُ الْخَالِقُونَ * أَمْ خَلَقُوا السَّمَاوَاتِ وَالْأَرْضَ ۚ بَل لَّا يُوقِنُونَ' },
                            { type: 'text', content: 'الإلحاد مرض فكري طارئ يناقض الفطرة البشرية ودلائل العقول.' },
                            { type: 'highlight', content: 'أدلة وجود الله العقلية:' },
                            { type: 'step', content: 'دليل الإيجاد (السببية): كل حادث لا بد له من محدث، والكون حادث فلا بد له من خالق عظيم.' },
                            { type: 'step', content: 'دليل الإتقان (العناية): التوازن الدقيق في الكون والغلاف الجوي والخلية الحية يستحيل أن ينشأ صدفة.' },
                            { type: 'step', content: 'دليل الفطرة: لجوء الإنسان عند الشدائد الخانقة إلى قوة عليا لا إرادياً.' }
                        ]
                    },
                    {
                        id: 'secularism-islam',
                        title: 'الإسلام والعلمانية',
                        blocks: [
                            { type: 'text', content: 'الإسلام دين شامل ينتظم شؤون العقيدة والعبادة والأخلاق والسياسة والاقتصاد، بخلاف العلمانية التي تفصل الدين عن الحياة.' },
                            { type: 'quran', content: 'قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ' },
                            { type: 'text', content: 'الشريعة الإسلامية صالحة لكل زمان ومكان، ومرونتها في "السياسة الشرعية" و"المقاصد" تجعلها قادرة على استيعاب كل النوازل والمستجدات بما يحقق مصالح العباد.' }
                        ]
                    }
                ]
            }
        ]
    }
];