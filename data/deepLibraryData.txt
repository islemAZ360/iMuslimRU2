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
        id: 'aqeedah',
        title: 'العقيدة الإسلامية',
        icon: 'auto_awesome',
        topics: [
            {
                id: 'tawheed',
                title: 'التوحيد وأقسامه',
                icon: 'fingerprint',
                subTopics: [
                    {
                        id: 'tawheed-types',
                        title: 'أنواع التوحيد بالتفصيل',
                        blocks: [
                            { type: 'text', content: 'التوحيد هو إفراد الله سبحانه وتعالى بما يختص به من الربوبية والألوهية والأسماء والصفات. وهو الغاية التي خُلق لأجلها الإنس والجن.' },
                            { type: 'quran', content: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ' },
                            { type: 'highlight', content: '1. توحيد الربوبية' },
                            { type: 'text', content: 'هو إفراد الله بأفعاله، كالخلق والرزق والإحياء والإماتة والتدبير. ومعناه أن تعتقد يقيناً أن الله وحده هو الخالق الرازق المدبر لهذا الكون، لا شريك له في ذلك.' },
                            { type: 'quran', content: 'اللَّهُ خَالِقُ كُلِّ شَيْءٍ ۖ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ وَكِيلٌ' },
                            { type: 'highlight', content: '2. توحيد الألوهية (توحيد العبادة)' },
                            { type: 'text', content: 'هو إفراد الله بأفعال العباد، كالدعاء والنذر والذبح والخوف والرجاء والمحبة. فلا يُصرف شيء من العبادة إلا لله وحده.' },
                            { type: 'quran', content: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
                            { type: 'highlight', content: '3. توحيد الأسماء والصفات' },
                            { type: 'text', content: 'هو إثبات ما أثبته الله لنفسه أو أثبته له رسوله ﷺ من الأسماء الحسنى والصفات العلى، ونفي ما نفاه الله عن نفسه، من غير تحريف ولا تعطيل، ومن غير تكييف ولا تمثيل.' },
                            { type: 'quran', content: 'لَيْسَ كَمِثْلِهِ شَيْءٌ ۖ وَهُوَ السَّمِيعُ الْبَصِيرُ' }
                        ]
                    },
                    {
                        id: 'shirk',
                        title: 'الشرك وخطره',
                        blocks: [
                            { type: 'text', content: 'الشرك هو أعظم ذنب عُصي الله به، وهو الذنب الوحيد الذي لا يغفره الله لمن مات عليه دون توبة.' },
                            { type: 'quran', content: 'إِنَّ اللَّهَ لَا يَغْفِرُ أَن يُشْرَكَ بِهِ وَيَغْفِرُ مَا دُونَ ذَٰلِكَ لِمَن يَشَاءُ' },
                            { type: 'highlight', content: 'الشرك الأكبر' },
                            { type: 'step', content: 'شرك الدعاء: كأن يدعو غير الله لجلب نفع أو دفع ضر لا يقدر عليه إلا الله (كدعاء الأموات).' },
                            { type: 'step', content: 'شرك الطاعة: كطاعة غير الله في تحليل ما حرم الله أو تحريم ما أحل الله.' },
                            { type: 'step', content: 'شرك المحبة: أن يحب مخلوقاً كحب الله أو أشد.' },
                            { type: 'highlight', content: 'الشرك الأصغر (الخفي)' },
                            { type: 'step', content: 'الرياء: أن يعمل العمل الصالح ليراه الناس ويمدحوه، قال ﷺ: "أخوف ما أخاف عليكم الشرك الأصغر، فسئل عنه فقال: الرياء".' },
                            { type: 'step', content: 'الحلف بغير الله: كالحلف بالكعبة أو بالشرف أو بالنبي، قال ﷺ: "من حلف بغير الله فقد كفر أو أشرك".' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'purity',
        title: 'فقه الطهارة',
        icon: 'water_drop',
        topics: [
            {
                id: 'wudu',
                title: 'الوضوء',
                icon: 'clean_hands',
                subTopics: [
                    {
                        id: 'wudu-comprehensive',
                        title: 'الوضوء (الأركان والسنن والمبطلات)',
                        blocks: [
                            { type: 'text', content: 'الوضوء في اللغة مشتق من الوضاءة وهي الحسن والنظافة. وفي الاصطلاح: استعمال الماء الطهور في الأعضاء الأربعة على صفة مخصوصة.' },
                            { type: 'highlight', content: 'شروط صحة الوضوء' },
                            { type: 'step', content: 'الإسلام والعقل والتمييز.' },
                            { type: 'step', content: 'النية: ومحلها القلب.' },
                            { type: 'step', content: 'الماء الطهور: الباقي على خلقته.' },
                            { type: 'step', content: 'إزالة الموانع: كطلاء الأظافر والشحوم.' },
                            { type: 'highlight', content: 'فرائض الوضوء (أركانه الستة)' },
                            { type: 'quran', content: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ' },
                            { type: 'step', content: 'غسل الوجه (ومنه المضمضة والاستنشاق).' },
                            { type: 'step', content: 'غسل اليدين مع المرفقين.' },
                            { type: 'step', content: 'مسح الرأس كله.' },
                            { type: 'step', content: 'غسل الرجلين مع الكعبين.' },
                            { type: 'step', content: 'الترتيب بين الأعضاء.' },
                            { type: 'step', content: 'الموالاة (عدم التأخير).' },
                            { type: 'highlight', content: 'نواقض الوضوء' },
                            { type: 'step', content: 'الخارج من السبيلين: بول، غائط، ريح.' },
                            { type: 'step', content: 'زوال العقل بنوم عميق أو إغماء.' },
                            { type: 'step', content: 'أكل لحم الإبل.' },
                            { type: 'step', content: 'مس الفرج باليد بشهوة بدون حائل.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'salah',
        title: 'فقه الصلاة',
        icon: 'prayer_times',
        topics: [
            {
                id: 'salah-rules',
                title: 'أحكام الصلاة',
                icon: 'mosque',
                subTopics: [
                    {
                        id: 'salah-comprehensive',
                        title: 'الصلاة (شروطها وأركانها بالتفصيل)',
                        blocks: [
                            { type: 'text', content: 'الصلاة هي عماد الدين وأول ما يُحاسب عليه العبد.' },
                            { type: 'highlight', content: 'شروط صحة الصلاة' },
                            { type: 'step', content: 'دخول الوقت: لا تصح قبل وقتها.' },
                            { type: 'step', content: 'ستر العورة: من السرة للركبة للرجل، والمرأة كلها عورة في الصلاة إلا وجهها وكفيها.' },
                            { type: 'step', content: 'طهارة البدن والثوب والمكان.' },
                            { type: 'step', content: 'استقبال القبلة.' },
                            { type: 'step', content: 'النية.' },
                            { type: 'highlight', content: 'أركان الصلاة (لا تسقط أبداً)' },
                            { type: 'step', content: 'القيام في الفريضة للقادر.' },
                            { type: 'step', content: 'تكبيرة الإحرام.' },
                            { type: 'step', content: 'قراءة الفاتحة.' },
                            { type: 'step', content: 'الركوع والاعتدال منه.' },
                            { type: 'step', content: 'السجود على الأعضاء السبعة والجلوس بين السجدتين.' },
                            { type: 'step', content: 'التشهد الأخير والجلوس له.' },
                            { type: 'step', content: 'التسليم والطمأنينة.' },
                            { type: 'highlight', content: 'مبطلات الصلاة' },
                            { type: 'step', content: 'الكلام العمد، الأكل، الشرب، الضحك بصوت، والحركة الكثيرة لغير حاجة.' }
                        ]
                    },
                    {
                        id: 'sujud-sahw',
                        title: 'سجود السهو',
                        blocks: [
                            { type: 'text', content: 'يشرع سجود السهو لجبر الخلل الحاصل في الصلاة من زيادة أو نقص أو شك.' },
                            { type: 'highlight', content: 'أسباب سجود السهو' },
                            { type: 'step', content: 'الزيادة: كأن يزيد ركعة ناسياً، فيسجد للسهو بعد السلام.' },
                            { type: 'step', content: 'النقص: كأن ينسى التشهد الأول ويقوم، فلا يرجع إليه بل يسجد للسهو قبل السلام.' },
                            { type: 'step', content: 'الشك: كأن يشك هل صلى ثلاثاً أم أربعاً، فيبني على الأقل (ثلاثاً) ويكمل ويسجد للسهو قبل السلام.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'family',
        title: 'فقه الأسرة',
        icon: 'family_restroom',
        topics: [
            {
                id: 'marriage',
                title: 'الزواج وحقوق الزوجين',
                icon: 'favorite',
                subTopics: [
                    {
                        id: 'marriage-rules',
                        title: 'أحكام النكاح',
                        blocks: [
                            { type: 'text', content: 'الزواج ميثاق غليظ ومؤسسة عظيمة في الإسلام.' },
                            { type: 'highlight', content: 'شروط صحة النكاح' },
                            { type: 'step', content: 'تعيين الزوجين: فلا يصح (زوجتك ابنتي) وله عدة بنات.' },
                            { type: 'step', content: 'رضا الزوجين: لا يجوز إجبار أحد على الزواج.' },
                            { type: 'step', content: 'الولي: لحديث "لا نكاح إلا بولي".' },
                            { type: 'step', content: 'الشهود: لحديث "لا نكاح إلا بولي وشاهدي عدل".' },
                            { type: 'highlight', content: 'حقوق الزوجة' },
                            { type: 'step', content: 'المهر: حق خالص لها.' },
                            { type: 'step', content: 'النفقة: توفير المسكن والمطعم والملبس بالمعروف.' },
                            { type: 'step', content: 'المعاشرة بالمعروف واللطف.' },
                            { type: 'highlight', content: 'حقوق الزوج' },
                            { type: 'step', content: 'الطاعة في غير معصية الله.' },
                            { type: 'step', content: 'حفظ ماله وعرضه في غيابه.' },
                            { type: 'step', content: 'عدم إدخال من يكره بيته.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'prophets',
        title: 'قصص الأنبياء',
        icon: 'menu_book',
        topics: [
            {
                id: 'ulul-azm',
                title: 'أولو العزم من الرسل',
                icon: 'star',
                subTopics: [
                    {
                        id: 'ibrahim',
                        title: 'إبراهيم خليل الرحمن',
                        blocks: [
                            { type: 'text', content: 'إبراهيم عليه السلام هو أبو الأنبياء، ابتلاه الله بكلمات فأتمهن، وجعله إماماً للناس.' },
                            { type: 'highlight', content: 'كسر الأصنام وإلقاؤه في النار' },
                            { type: 'text', content: 'حطم إبراهيم أصنام قومه ليثبت لهم عجزها. فقرر النمرود وقومه حرقه.' },
                            { type: 'quran', content: 'قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ' },
                            { type: 'highlight', content: 'بناء الكعبة' },
                            { type: 'text', content: 'أمره الله ببناء الكعبة مع ابنه إسماعيل ليكون مثابة للناس وأمناً.' },
                            { type: 'quran', content: 'وَإِذْ يَرْفَعُ إِبْرَاهِيمُ الْقَوَاعِدَ مِنَ الْبَيْتِ وَإِسْمَاعِيلُ رَبَّنَا تَقَبَّلْ مِنَّا' }
                        ]
                    },
                    {
                        id: 'musa',
                        title: 'موسى كليم الله',
                        blocks: [
                            { type: 'text', content: 'أكثر نبي ذُكر في القرآن، أُرسل إلى فرعون طاغية مصر.' },
                            { type: 'highlight', content: 'المعجزات التسع' },
                            { type: 'step', content: 'العصا التي تتحول لثعبان، واليد البيضاء.' },
                            { type: 'step', content: 'الجراد، القمل، الضفادع، الدم.' },
                            { type: 'step', content: 'شق البحر العظيم لإنقاذ بني إسرائيل وإغراق فرعون.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'morals',
        title: 'الآداب والأخلاق',
        icon: 'volunteer_activism',
        topics: [
            {
                id: 'rights',
                title: 'الحقوق الإسلامية',
                icon: 'handshake',
                subTopics: [
                    {
                        id: 'parents',
                        title: 'بر الوالدين',
                        blocks: [
                            { type: 'text', content: 'قرن الله حقه بحق الوالدين لعظم فضلهما.' },
                            { type: 'quran', content: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا' },
                            { type: 'highlight', content: 'مظاهر البر' },
                            { type: 'step', content: 'خفض الجناح لهما والتواضع.' },
                            { type: 'step', content: 'عدم قول "أف" أو التضجر منهما عند الكبر.' },
                            { type: 'step', content: 'الدعاء لهما في الحياة وبعد الممات: "رب ارحمهما كما ربياني صغيراً".' }
                        ]
                    },
                    {
                        id: 'tongue',
                        title: 'حفظ اللسان',
                        blocks: [
                            { type: 'hadith', content: 'قال ﷺ: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت".' },
                            { type: 'highlight', content: 'آفات اللسان' },
                            { type: 'step', content: 'الغيبة: ذكرك أخاك بما يكره.' },
                            { type: 'step', content: 'النميمة: نقل الكلام بين الناس للإفساد بينهم.' },
                            { type: 'step', content: 'الكذب والسب والشتم واللعن.' }
                        ]
                    }
                ]
            }
        ]
    }
];
