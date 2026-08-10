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
        id: 'purity',
        title: 'الطهارة',
        icon: 'water_drop',
        topics: [
            {
                id: 'wudu',
                title: 'الوضوء',
                icon: 'clean_hands',
                subTopics: [
                    {
                        id: 'wudu-comprehensive',
                        title: 'الوضوء: الموسوعة الشاملة (أحكام ومبطلات)',
                        blocks: [
                            { type: 'text', content: 'الوضوء لغة: مشتق من الوضاءة وهي الحسن والنظافة. واصطلاحاً: استعمال ماء طهور في الأعضاء الأربعة (الوجه، اليدان، الرأس، الرجلان) على صفة مخصوصة في الشرع بنية التعبد لله.' },
                            { type: 'highlight', content: 'فضل الوضوء العظيم' },
                            { type: 'hadith', content: 'قال رسول الله ﷺ: "إذا توضأ العبد المسلم أو المؤمن، فغسل وجهه خرج من وجهه كل خطيئة نظر إليها بعينيه مع الماء، أو مع آخر قطر الماء، فإذا غسل يديه خرج من يديه كل خطيئة كان بطشتها يداه مع الماء..." (رواه مسلم).' },
                            { type: 'highlight', content: 'شروط صحة الوضوء' },
                            { type: 'step', content: 'النية: ومحلها القلب، ولا يشرع التلفظ بها، لقوله ﷺ: "إنما الأعمال بالنيات".' },
                            { type: 'step', content: 'الماء الطهور: وهو الباقي على خلقته، الذي لم يتغير لونه أو طعمه أو ريحه بنجاسة.' },
                            { type: 'step', content: 'إزالة الموانع: كطلاء الأظافر للمرأة، والشحوم الكثيفة، أو أي مادة تمنع وصول الماء للبشرة.' },
                            { type: 'highlight', content: 'فرائض الوضوء (أركانه الستة)' },
                            { type: 'quran', content: 'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا قُمْتُمْ إِلَى الصَّلَاةِ فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ' },
                            { type: 'step', content: 'غسل الوجه: ومن حدوده منابت شعر الرأس المعتاد إلى الذقن، ومن الأذن إلى الأذن. (ويدخل فيه المضمضة والاستنشاق عند بعض العلماء).' },
                            { type: 'step', content: 'غسل اليدين مع المرفقين: والمرفق هو المفصل الذي يربط الذراع بالعضد.' },
                            { type: 'step', content: 'مسح الرأس: ويجزئ مسح معظمه، والسنة مسحه كله بإقبال اليدين وإدبارهما.' },
                            { type: 'step', content: 'غسل الرجلين مع الكعبين: والكعبان هما العظمان الناتئان أسفل الساق.' },
                            { type: 'step', content: 'الترتيب: بين الأعضاء كما ورد في الآية.' },
                            { type: 'step', content: 'الموالاة: ألا يؤخر غسل العضو حتى يجف العضو الذي قبله.' },
                            { type: 'highlight', content: 'نواقض الوضوء (مبطلاته)' },
                            { type: 'step', content: 'الخارج من السبيلين: كالبول، الغائط، الريح، المذي (وهو ماء رقيق يخرج عند الشهوة)، والودي.' },
                            { type: 'step', content: 'زوال العقل: سواء بالسكر، أو الإغماء، أو النوم العميق المستغرق الذي لا يشعر فيه النائم بمن حوله.' },
                            { type: 'step', content: 'أكل لحم الإبل: لحديث النبي ﷺ حين سئل: أنتوضأ من لحوم الإبل؟ قال: "نعم" (وهو مفرد للحنابلة).' },
                            { type: 'step', content: 'مس الفرج باليد مباشرة: بدون حائل وبشهوة (في تفصيل بين المذاهب).' }
                        ]
                    },
                    {
                        id: 'wiping-socks',
                        title: 'المسح على الخفين',
                        blocks: [
                            { type: 'text', content: 'من تيسير الشريعة جواز المسح على الخفين (أو الجوارب) بدلاً من غسل الرجلين.' },
                            { type: 'step', content: 'شروطه: أن يلبسهما على طهارة كاملة (بعد وضوء غسل فيه رجليه)، وأن يكونا طاهرين.' },
                            { type: 'step', content: 'مدته: يوم وليلة للمقيم (24 ساعة)، وثلاثة أيام بلياليها للمسافر.' },
                            { type: 'step', content: 'طريقته: يبلل يديه بالماء ويمسح ظاهر قدميه (من أطراف الأصابع إلى الساق) مرة واحدة.' }
                        ]
                    }
                ]
            },
            {
                id: 'ghusl',
                title: 'الغُسل',
                icon: 'shower',
                subTopics: [
                    {
                        id: 'ghusl-reasons',
                        title: 'موجبات الغسل',
                        blocks: [
                            { type: 'text', content: 'الغسل واجب في الحالات التالية:' },
                            { type: 'step', content: 'خروج المني بلذة.' },
                            { type: 'step', content: 'الجماع (التقاء الختانين).' },
                            { type: 'step', content: 'انقطاع دم الحيض والنفاس.' },
                            { type: 'step', content: 'الدخول في الإسلام.' }
                        ]
                    },
                    {
                        id: 'ghusl-steps',
                        title: 'طريقة الغسل الكاملة',
                        blocks: [
                            { type: 'text', content: 'الصفة المستحبة الواردة عن النبي ﷺ:' },
                            { type: 'step', content: 'النية والتسمية.' },
                            { type: 'step', content: 'غسل الكفين والفرج باليسرى.' },
                            { type: 'step', content: 'الوضوء كاملاً كوضوء الصلاة.' },
                            { type: 'step', content: 'حثو الماء على الرأس ثلاث مرات مع تخليل أصول الشعر.' },
                            { type: 'step', content: 'إفاضة الماء على سائر الجسد (الشق الأيمن ثم الأيسر).' }
                        ]
                    }
                ]
            },
            {
                id: 'tayammum',
                title: 'التيمم',
                icon: 'nature',
                subTopics: [
                    {
                        id: 'tayammum-steps',
                        title: 'صفة التيمم وشروطه',
                        blocks: [
                            { type: 'quran', content: 'فَلَمْ تَجِدُوا مَاءً فَتَيَمَّمُوا صَعِيدًا طَيِّبًا فَامْسَحُوا بِوُجُوهِكُمْ وَأَيْدِيكُم مِّنْهُ' },
                            { type: 'text', content: 'يشرع التيمم عند فقد الماء أو العجز عن استعماله لمرض أو برد شديد.' },
                            { type: 'highlight', content: 'طريقة التيمم:' },
                            { type: 'step', content: 'النية والتسمية.' },
                            { type: 'step', content: 'ضرب الأرض الطاهرة (أو ما صعد على الأرض من تراب أو رمل) باليدين ضربة واحدة.' },
                            { type: 'step', content: 'النفخ في الكفين لتخفيف التراب (سنة).' },
                            { type: 'step', content: 'مسح الوجه مرة واحدة.' },
                            { type: 'step', content: 'مسح ظاهر الكفين (يمسح اليمنى باليسرى، واليسرى باليمنى).' }
                        ]
                    }
                ]
            },
            {
                id: 'najasah',
                title: 'إزالة النجاسة',
                icon: 'cleaning_services',
                subTopics: [
                    {
                        id: 'types-najasah',
                        title: 'أنواع النجاسات وكيفية تطهيرها',
                        blocks: [
                            { type: 'text', content: 'النجاسة هي قذارة مخصوصة تمنع صحة الصلاة.' },
                            { type: 'highlight', content: 'النجاسة المغلظة (الكلب والخنزير):' },
                            { type: 'step', content: 'تُغسل سبع مرات إحداهن بالتراب (إذا ولغ الكلب في إناء).' },
                            { type: 'highlight', content: 'النجاسة المخففة (بول الصبي الرضيع الذي لم يأكل الطعام):' },
                            { type: 'step', content: 'يُكتفى برش الماء عليها ونضحه دون غسل.' },
                            { type: 'highlight', content: 'النجاسة المتوسطة (البول، الغائط، الدم المسفوح):' },
                            { type: 'step', content: 'تُغسل بالماء حتى يزول لونها وطعمها وريحها.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'pillars-of-islam',
        title: 'أركان الإسلام',
        icon: 'mosque',
        topics: [
            {
                id: 'shahada',
                title: 'الشهادتان',
                icon: 'looks_one',
                subTopics: [
                    {
                        id: 'shahada-meaning',
                        title: 'معنى لا إله إلا الله',
                        blocks: [
                            { type: 'text', content: 'الشهادتان هما الركن الأول، ولا يدخل الإنسان الإسلام إلا بهما.' },
                            { type: 'highlight', content: 'لا إله إلا الله:' },
                            { type: 'text', content: 'معناها: لا معبود بحق إلا الله. فيها نفي (لا إله) لكل ما يُعبد من دون الله، وإثبات (إلا الله) العبادة لله وحده.' },
                            { type: 'highlight', content: 'محمد رسول الله:' },
                            { type: 'text', content: 'معناها: طاعته فيما أمر، وتصديقه فيما أخبر، واجتناب ما نهى عنه وزجر، وأن لا يُعبد الله إلا بما شرع.' }
                        ]
                    }
                ]
            },
            {
                id: 'salah',
                title: 'الصلاة',
                icon: 'prayer_times',
                subTopics: [
                    {
                        id: 'salah-steps',
                        title: 'طريقة الصلاة الصحيحة',
                        blocks: [
                            { type: 'text', content: 'صفة الصلاة الثابتة خطوة بخطوة:' },
                            { type: 'step', content: 'الاستقبال والنية (في القلب).' },
                            { type: 'step', content: 'تكبيرة الإحرام (الله أكبر) مع رفع اليدين.' },
                            { type: 'step', content: 'دعاء الاستفتاح (سبحانك اللهم وبحمدك...)' },
                            { type: 'step', content: 'قراءة الفاتحة وما تيسر من القرآن.' },
                            { type: 'step', content: 'الركوع (سبحان ربي العظيم 3 مرات).' },
                            { type: 'step', content: 'الرفع من الركوع (سمع الله لمن حمده - ربنا ولك الحمد).' },
                            { type: 'step', content: 'السجود (سبحان ربي الأعلى 3 مرات).' },
                            { type: 'step', content: 'الجلوس بين السجدتين (رب اغفر لي).' }
                        ]
                    },
                    {
                        id: 'tashahhud',
                        title: 'نص التشهد الكامل',
                        blocks: [
                            { type: 'highlight', content: 'التشهد (يقرأ في الجلسة الأولى والأخيرة):' },
                            { type: 'hadith', content: 'التحيات لله والصلوات والطيبات، السلام عليك أيها النبي ورحمة الله وبركاته، السلام علينا وعلى عباد الله الصالحين، أشهد أن لا إله إلا الله، وأشهد أن محمداً عبده ورسوله.' },
                            { type: 'highlight', content: 'الصلاة الإبراهيمية (تضاف في التشهد الأخير فقط):' },
                            { type: 'hadith', content: 'اللهم صل على محمد وعلى آل محمد، كما صليت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد، اللهم بارك على محمد وعلى آل محمد كما باركت على إبراهيم وعلى آل إبراهيم إنك حميد مجيد.' },
                            { type: 'highlight', content: 'دعاء مستحب جداً قبل التسليم:' },
                            { type: 'hadith', content: 'اللهم إني أعوذ بك من عذاب جهنم، ومن عذاب القبر، ومن فتنة المحيا والممات، ومن شر فتنة المسيح الدجال.' }
                        ]
                    },
                    {
                        id: 'makruhat-salah',
                        title: 'مكروهات ومبطلات الصلاة',
                        blocks: [
                            { type: 'highlight', content: 'مبطلات الصلاة (تبطلها تماماً):' },
                            { type: 'step', content: 'الكلام العمد.' },
                            { type: 'step', content: 'الحركة الكثيرة المتوالية لغير حاجة.' },
                            { type: 'step', content: 'انتقاض الوضوء.' },
                            { type: 'step', content: 'الضحك بصوت.' },
                            { type: 'highlight', content: 'مكروهات الصلاة (تنقص الأجر):' },
                            { type: 'step', content: 'الالتفات بالوجه.' },
                            { type: 'step', content: 'العبث بالثوب أو اللحية أو الساعة.' },
                            { type: 'step', content: 'الصلاة مع مدافعة الأخبثين (البول والغائط).' }
                        ]
                    }
                ]
            },
            {
                id: 'zakat',
                title: 'الزكاة',
                icon: 'monetization_on',
                subTopics: [
                    {
                        id: 'zakat-conditions',
                        title: 'شروط وأنواع الزكاة',
                        blocks: [
                            { type: 'text', content: 'الزكاة هي حق واجب في مال مخصوص، لطائفة مخصوصة.' },
                            { type: 'highlight', content: 'شروط وجوبها:' },
                            { type: 'step', content: 'الإسلام والحرية.' },
                            { type: 'step', content: 'بلوغ النصاب (وهو القدر الذي إذا وصل إليه المال وجبت فيه الزكاة، ونصاب الذهب 85 جراماً).' },
                            { type: 'step', content: 'حولان الحول (مرور سنة قمرية كاملة على المال).' },
                            { type: 'highlight', content: 'مقدار زكاة المال:' },
                            { type: 'text', content: 'يجب إخراج ربع العشر (2.5%) من المال المدخر الذي حال عليه الحول.' }
                        ]
                    }
                ]
            },
            {
                id: 'fasting',
                title: 'الصيام',
                icon: 'wb_twilight',
                subTopics: [
                    {
                        id: 'fasting-rules',
                        title: 'أحكام الصيام',
                        blocks: [
                            { type: 'text', content: 'الصيام هو الإمساك عن المفطرات من طلوع الفجر الصادق إلى غروب الشمس بنية التعبد.' },
                            { type: 'highlight', content: 'مبطلات الصيام:' },
                            { type: 'step', content: 'الأكل أو الشرب متعمداً.' },
                            { type: 'step', content: 'القيء عمداً.' },
                            { type: 'step', content: 'الجماع.' },
                            { type: 'highlight', content: 'سنن الصيام:' },
                            { type: 'step', content: 'تأخير السحور.' },
                            { type: 'step', content: 'تعجيل الفطر (على رطب أو تمر أو ماء).' },
                            { type: 'step', content: 'الدعاء عند الفطر (ذهب الظمأ وابتلت العروق وثبت الأجر إن شاء الله).' }
                        ]
                    }
                ]
            },
            {
                id: 'hajj',
                title: 'الحج والعمرة',
                icon: 'place',
                subTopics: [
                    {
                        id: 'hajj-pillars',
                        title: 'أركان الحج',
                        blocks: [
                            { type: 'text', content: 'الحج فرض مرة واحدة في العمر على المستطيع.' },
                            { type: 'highlight', content: 'أركان الحج الأربعة:' },
                            { type: 'step', content: 'الإحرام (نية الدخول في النسك).' },
                            { type: 'step', content: 'الوقوف بعرفة (وهو الركن الأعظم).' },
                            { type: 'step', content: 'طواف الإفاضة.' },
                            { type: 'step', content: 'السعي بين الصفا والمروة.' },
                            { type: 'text', content: 'إذا ترك الحاج ركناً من هذه الأركان بطل حجه ولا ينجبر بدم.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'pillars-of-faith',
        title: 'أركان الإيمان',
        icon: 'psychology',
        topics: [
            {
                id: 'iman-allah',
                title: 'الإيمان بالله',
                icon: 'favorite',
                subTopics: [
                    {
                        id: 'iman-allah-details',
                        title: 'توحيد الله',
                        blocks: [
                            { type: 'text', content: 'الإيمان بالله يتضمن أربعة أمور:' },
                            { type: 'step', content: 'الإيمان بوجوده سبحانه.' },
                            { type: 'step', content: 'توحيد الربوبية: الإفراد بأفعاله كالخلق والرزق والإحياء والإماتة.' },
                            { type: 'step', content: 'توحيد الألوهية: الإفراد بالعبادة، فلا يعبد سواه.' },
                            { type: 'step', content: 'توحيد الأسماء والصفات: إثبات ما أثبته لنفسه أو أثبته له رسوله.' }
                        ]
                    },
                    {
                        id: 'asma-allah',
                        title: 'أسماء الله الحسنى',
                        blocks: [
                            { type: 'quran', content: 'وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا' },
                            { type: 'text', content: 'لله 99 اسماً من أحصاها (فهمها وحفظها وعمل بمقتضاها) دخل الجنة. منها:' },
                            { type: 'highlight', content: 'الرحمن الرحيم:' },
                            { type: 'text', content: 'ذو الرحمة الواسعة التي وسعت كل شيء.' },
                            { type: 'highlight', content: 'القدوس السلام:' },
                            { type: 'text', content: 'المنزه عن كل نقص وعيب، السالم من كل آفة.' },
                            { type: 'highlight', content: 'الغفور الودود:' },
                            { type: 'text', content: 'الذي يستر الذنوب ويتجاوز عنها، ويتودد لعباده بالنعم.' }
                        ]
                    }
                ]
            },
            {
                id: 'iman-angels',
                title: 'الإيمان بالملائكة',
                icon: 'flight',
                subTopics: [
                    {
                        id: 'angels-details',
                        title: 'عالم الملائكة',
                        blocks: [
                            { type: 'text', content: 'مخلوقات من نور، لا يعصون الله ما أمرهم ويفعلون ما يؤمرون.' },
                            { type: 'highlight', content: 'من أشهرهم وأعمالهم:' },
                            { type: 'step', content: 'جبريل عليه السلام: الموكل بالوحي.' },
                            { type: 'step', content: 'ميكائيل عليه السلام: الموكل بالمطر والنبات.' },
                            { type: 'step', content: 'إسرافيل عليه السلام: الموكل بالنفخ في الصور يوم القيامة.' },
                            { type: 'step', content: 'ملك الموت: الموكل بقبض الأرواح.' },
                            { type: 'step', content: 'الكرام الكاتبون: الموكلون بكتابة أعمال العباد.' }
                        ]
                    }
                ]
            },
            {
                id: 'iman-books',
                title: 'الإيمان بالكتب',
                icon: 'menu_book',
                subTopics: [
                    {
                        id: 'books-details',
                        title: 'الكتب السماوية',
                        blocks: [
                            { type: 'text', content: 'الإيمان بأن الله أنزل كتباً على رسله لهداية البشر.' },
                            { type: 'step', content: 'القرآن الكريم: أنزل على محمد ﷺ وهو المهيمن والناسخ لما قبله.' },
                            { type: 'step', content: 'التوراة: أنزلت على موسى عليه السلام.' },
                            { type: 'step', content: 'الإنجيل: أنزل على عيسى عليه السلام.' },
                            { type: 'step', content: 'الزبور: أنزل على داود عليه السلام.' },
                            { type: 'step', content: 'صحف إبراهيم وموسى.' }
                        ]
                    }
                ]
            },
            {
                id: 'iman-qadar',
                title: 'الإيمان بالقدر',
                icon: 'balance',
                subTopics: [
                    {
                        id: 'qadar-details',
                        title: 'مراتب القدر',
                        blocks: [
                            { type: 'hadith', content: 'عجباً لأمر المؤمن إن أمره كله خير، وليس ذاك لأحد إلا للمؤمن، إن أصابته سراء شكر فكان خيراً له، وإن أصابته ضراء صبر فكان خيراً له.' },
                            { type: 'text', content: 'للإيمان بالقدر أربع مراتب:' },
                            { type: 'step', content: 'العلم: علم الله الأزلي بكل شيء.' },
                            { type: 'step', content: 'الكتابة: كتابة كل المقادير في اللوح المحفوظ قبل خلق السماوات والأرض.' },
                            { type: 'step', content: 'المشيئة: نافذة في كل ما يقع في الكون.' },
                            { type: 'step', content: 'الخلق: فالله خالق كل شيء، ومن ذلك أفعال العباد.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'nawafil',
        title: 'النوافل والسنن',
        icon: 'star',
        topics: [
            {
                id: 'rawatib',
                title: 'السنن الرواتب',
                icon: 'format_list_numbered',
                subTopics: [
                    {
                        id: 'rawatib-details',
                        title: 'فضلها وعددها (١٢ ركعة)',
                        blocks: [
                            { type: 'quran', content: 'قال رسول الله ﷺ: «من ثابر على اثنتي عشرة ركعة من السنة بنى الله له بيتاً في الجنة».' },
                            { type: 'text', content: 'وتفصيل هذه الركعات كما ورد في السنة:' },
                            { type: 'step', content: 'ركعتان قبل صلاة الفجر.' },
                            { type: 'step', content: 'أربع ركعات قبل الظهر، وركعتان بعدها.' },
                            { type: 'step', content: 'ركعتان بعد المغرب.' },
                            { type: 'step', content: 'ركعتان بعد العشاء.' }
                        ]
                    }
                ]
            },
            {
                id: 'duha-witr',
                title: 'الضحى والوتر',
                icon: 'wb_sunny',
                subTopics: [
                    {
                        id: 'witr',
                        title: 'صلاة الوتر',
                        blocks: [
                            { type: 'text', content: 'الوتر هي الصلاة التي يختم بها المسلم صلاته في الليل، وهي سنة مؤكدة جداً.' },
                            { type: 'step', content: 'وقتها: من بعد صلاة العشاء إلى طلوع الفجر.' },
                            { type: 'step', content: 'عددها: أقلها ركعة واحدة، وأكثرها إحدى عشرة ركعة.' }
                        ]
                    },
                    {
                        id: 'duha',
                        title: 'صلاة الضحى',
                        blocks: [
                            { type: 'text', content: 'صلاة الأوابين (الرجاعين إلى الله).' },
                            { type: 'step', content: 'وقتها: بعد شروق الشمس بربع ساعة تقريباً إلى قبيل صلاة الظهر بـ 10 دقائق.' },
                            { type: 'step', content: 'عددها: أقلها ركعتان ولا حد لأكثرها.' }
                        ]
                    },
                    {
                        id: 'tahajjud',
                        title: 'قيام الليل (التهجد)',
                        blocks: [
                            { type: 'quran', content: 'تَتَجَافَىٰ جُنُوبُهُمْ عَنِ الْمَضَاجِعِ يَدْعُونَ رَبَّهُمْ خَوْفًا وَطَمَعًا' },
                            { type: 'text', content: 'أفضل الصلاة بعد المكتوبة صلاة جوف الليل. وهي شرف المؤمن.' },
                            { type: 'text', content: 'وقتها الأفضل: الثلث الأخير من الليل، حين ينزل الله إلى السماء الدنيا فيقول: هل من سائل فأعطيه؟ هل من مستغفر فأغفر له؟' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'seerah',
        title: 'سيرة النبي ﷺ',
        icon: 'history_edu',
        topics: [
            {
                id: 'makkan-period',
                title: 'العهد المكي',
                icon: 'brightness_4',
                subTopics: [
                    {
                        id: 'birth-revelation',
                        title: 'الميلاد والبعثة',
                        blocks: [
                            { type: 'text', content: 'ولد النبي محمد ﷺ في مكة عام الفيل. توفي والده عبدالله وهو في بطن أمه، وتوفيت أمه آمنة وهو في السادسة. كفله جده عبدالمطلب ثم عمه أبو طالب.' },
                            { type: 'highlight', content: 'نزول الوحي:' },
                            { type: 'text', content: 'كان يتعبد في غار حراء، وفي سن الأربعين نزل عليه جبريل عليه السلام بالوحي.' },
                            { type: 'quran', content: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ' }
                        ]
                    },
                    {
                        id: 'isra-miraj',
                        title: 'الإسراء والمعراج',
                        blocks: [
                            { type: 'text', content: 'بعد عام الحزن (وفاة عمه وزوجته خديجة)، أكرمه الله برحلة الإسراء والمعراج.' },
                            { type: 'text', content: 'أُسري به من مكة إلى المسجد الأقصى، ثم عُرج به إلى السماوات العلى، وهناك فُرضت الصلوات الخمس.' }
                        ]
                    }
                ]
            },
            {
                id: 'madinan-period',
                title: 'العهد المدني',
                icon: 'wb_twilight',
                subTopics: [
                    {
                        id: 'hijra',
                        title: 'الهجرة النبوية',
                        blocks: [
                            { type: 'text', content: 'بعد 13 سنة من الدعوة في مكة والاضطهاد، هاجر النبي ﷺ مع أبي بكر إلى يثرب (المدينة المنورة).' },
                            { type: 'text', content: 'أول ما فعله في المدينة: بناء المسجد النبوي، المؤاخاة بين المهاجرين والأنصار، وكتابة وثيقة المدينة.' }
                        ]
                    },
                    {
                        id: 'battles',
                        title: 'أهم الغزوات',
                        blocks: [
                            { type: 'highlight', content: 'غزوة بدر (2 هـ):' },
                            { type: 'text', content: 'أول معركة كبرى، انتصر فيها 313 مسلماً على 1000 من المشركين.' },
                            { type: 'highlight', content: 'غزوة أحد (3 هـ):' },
                            { type: 'text', content: 'استشهد فيها حمزة، وتعلم المسلمون درساً قاسياً عن خطورة مخالفة أمر النبي.' },
                            { type: 'highlight', content: 'غزوة الخندق (5 هـ):' },
                            { type: 'text', content: 'تحزبت القبائل لغزو المدينة، فأشار سلمان الفارسي بحفر خندق، ونصر الله المؤمنين بالريح والملائكة.' },
                            { type: 'highlight', content: 'فتح مكة (8 هـ):' },
                            { type: 'text', content: 'دخلها النبي ﷺ منتصراً بـ 10,000 مقاتل دون قتال، وعفا عن أهل مكة (اذهبوا فأنتم الطلقاء).' }
                        ]
                    },
                    {
                        id: 'death',
                        title: 'حجة الوداع والوفاة',
                        blocks: [
                            { type: 'text', content: 'في السنة 10 هـ حج النبي ﷺ وخطب خطبة الوداع التي أرسى فيها قواعد الإسلام الإنسانية.' },
                            { type: 'quran', content: 'الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا' },
                            { type: 'text', content: 'وفي شهر ربيع الأول من السنة 11 هـ، مرض النبي ﷺ وتوفي وهو يخير بين الدنيا والآخرة، فاختار "الرفيق الأعلى".' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'prophets',
        title: 'قصص الأنبياء',
        icon: 'auto_stories',
        topics: [
            {
                id: 'adam',
                title: 'آدم عليه السلام',
                icon: 'person',
                subTopics: [
                    {
                        id: 'adam-creation',
                        title: 'أبو البشر',
                        blocks: [
                            { type: 'text', content: 'خلق الله آدم بيده من طين، ونفخ فيه من روحه، وأمر الملائكة بالسجود له فسجدوا إلا إبليس أبى واستكبر.' },
                            { type: 'text', content: 'أسكنه الله الجنة مع حواء، فوسوس لهما الشيطان فأكلا من الشجرة، فأهبطهما الله إلى الأرض.' }
                        ]
                    }
                ]
            },
            {
                id: 'nuh',
                title: 'نوح عليه السلام',
                icon: 'sailing',
                subTopics: [
                    {
                        id: 'nuh-ark',
                        title: 'السفينة والطوفان',
                        blocks: [
                            { type: 'text', content: 'لبث في قومه 950 سنة يدعوهم للتوحيد، فلم يؤمن إلا قليل. أمره الله بصنع سفينة.' },
                            { type: 'quran', content: 'وَاصْنَعِ الْفُلْكَ بِأَعْيُنِنَا وَوَحْيِنَا وَلَا تُخَاطِبْنِي فِي الَّذِينَ ظَلَمُوا ۚ إِنَّهُم مُّغْرَقُونَ' },
                            { type: 'text', content: 'نجا نوح ومن معه في الفلك، وأغرق الله الكافرين ومنهم ابنه.' }
                        ]
                    }
                ]
            },
            {
                id: 'ibrahim',
                title: 'إبراهيم عليه السلام',
                icon: 'local_fire_department',
                subTopics: [
                    {
                        id: 'ibrahim-fire',
                        title: 'خليل الرحمن والنار',
                        blocks: [
                            { type: 'text', content: 'حطم الأصنام فقرر قومه حرقه في نار عظيمة.' },
                            { type: 'quran', content: 'قُلْنَا يَا نَارُ كُونِي بَرْدًا وَسَلَامًا عَلَىٰ إِبْرَاهِيمَ' },
                            { type: 'text', content: 'ابتلاه الله بذبح ابنه إسماعيل فامتثل، ففداه الله بكبش عظيم. وبنى مع ابنه الكعبة المشرفة.' }
                        ]
                    }
                ]
            },
            {
                id: 'yusuf',
                title: 'يوسف عليه السلام',
                icon: 'nightlight_round',
                subTopics: [
                    {
                        id: 'yusuf-story',
                        title: 'من الجب إلى العرش',
                        blocks: [
                            { type: 'text', content: 'حسده إخوته فألقوه في البئر، ثم بيع كعبد في مصر، ثم سُجن ظلماً، ثم أعزه الله وجعله عزيز مصر وعفا عن إخوته.' },
                            { type: 'quran', content: 'إِنَّهُ مَن يَتَّقِ وَيَصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ' }
                        ]
                    }
                ]
            },
            {
                id: 'musa',
                title: 'موسى عليه السلام',
                icon: 'waves',
                subTopics: [
                    {
                        id: 'musa-pharaoh',
                        title: 'مواجهة فرعون وانشقاق البحر',
                        blocks: [
                            { type: 'text', content: 'أرسل الله موسى إلى فرعون الذي طغى وادعى الربوبية. أيده الله بتسع آيات بينات أهمها العصا واليد البيضاء.' },
                            { type: 'quran', content: 'فَأَوْحَيْنَا إِلَىٰ مُوسَىٰ أَنِ اضْرِب بِّعَصَاكَ الْبَحْرَ ۖ فَانفَلَقَ فَكَانَ كُلُّ فِرْقٍ كَالطَّوْدِ الْعَظِيمِ' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'adab',
        title: 'الآداب والأخلاق',
        icon: 'self_improvement',
        topics: [
            {
                id: 'parents',
                title: 'بر الوالدين',
                icon: 'family_restroom',
                subTopics: [
                    {
                        id: 'parents-virtue',
                        title: 'فضل البر وعقوق الوالدين',
                        blocks: [
                            { type: 'quran', content: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا' },
                            { type: 'text', content: 'بر الوالدين من أعظم القربات بعد توحيد الله. رضا الرب في رضا الوالد، وسخط الرب في سخط الوالد.' },
                            { type: 'hadith', content: 'رغم أنف، ثم رغم أنف، ثم رغم أنف قيل: من يا رسول الله؟ قال: من أدرك أبويه عند الكبر، أحدهما أو كليهما فلم يدخل الجنة.' }
                        ]
                    }
                ]
            },
            {
                id: 'tongue',
                title: 'حفظ اللسان',
                icon: 'record_voice_over',
                subTopics: [
                    {
                        id: 'tongue-dangers',
                        title: 'خطر الغيبة والنميمة',
                        blocks: [
                            { type: 'hadith', content: 'من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت.' },
                            { type: 'text', content: 'الغيبة: ذكرك أخاك بما يكره. والنميمة: نقل الكلام بين الناس للإفساد بينهم.' },
                            { type: 'hadith', content: 'لا يدخل الجنة نمام.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'family-fiqh',
        title: 'الأسرة والزواج',
        icon: 'diversity_1',
        topics: [
            {
                id: 'marriage',
                title: 'الزواج وحقوق الزوجين',
                icon: 'favorite_border',
                subTopics: [
                    {
                        id: 'spouse-rights',
                        title: 'حقوق الزوجين',
                        blocks: [
                            { type: 'quran', content: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً' },
                            { type: 'text', content: 'الزواج ميثاق غليظ، ومبني على المودة والرحمة. لكل من الزوجين حقوق وعليه واجبات:' },
                            { type: 'highlight', content: 'من حقوق الزوجة:' },
                            { type: 'step', content: 'المهر، والنفقة بالمعروف (الطعام والكسوة والمسكن).' },
                            { type: 'step', content: 'حسن العشرة وعدم الإضرار بها.' },
                            { type: 'highlight', content: 'من حقوق الزوج:' },
                            { type: 'step', content: 'الطاعة في غير معصية الله.' },
                            { type: 'step', content: 'حفظه في ماله وعرضه في غيابه.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'finance',
        title: 'فقه المعاملات',
        icon: 'account_balance',
        topics: [
            {
                id: 'riba',
                title: 'الربا والبيوع',
                icon: 'money_off',
                subTopics: [
                    {
                        id: 'riba-danger',
                        title: 'خطر الربا وحرمته',
                        blocks: [
                            { type: 'quran', content: 'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا' },
                            { type: 'text', content: 'الربا من كبائر الذنوب، وهو إما زيادة مشروطة في القرض (ربا الديون)، أو التفاضل والتأخير في مبادلة الأصناف الربوية (ربا البيوع).' },
                            { type: 'hadith', content: 'لعن رسول الله ﷺ آكل الربا، وموكله، وكاتبه، وشاهديه.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'quran-sciences',
        title: 'القرآن وعلومه',
        icon: 'menu_book',
        topics: [
            {
                id: 'tajweed',
                title: 'أحكام التجويد',
                icon: 'record_voice_over',
                subTopics: [
                    {
                        id: 'nun-sakinah',
                        title: 'أحكام النون الساكنة والتنوين',
                        blocks: [
                            { type: 'text', content: 'للنون الساكنة والتنوين أربعة أحكام عند التقائها بحروف الهجاء:' },
                            { type: 'highlight', content: '1. الإظهار الحلقي' },
                            { type: 'step', content: 'حروفه ستة: (ء، هـ، ع، ح، غ، خ). إذا جاءت بعد النون تنطق النون بوضوح.' },
                            { type: 'highlight', content: '2. الإدغام' },
                            { type: 'step', content: 'حروفه مجموعة في كلمة (يرملون). وهو إدخال النون في الحرف الذي يليها.' },
                            { type: 'highlight', content: '3. الإقلاب' },
                            { type: 'step', content: 'حرفه الوحيد هو (الباء). تقلب النون ميماً مخفاة مع الغنة.' },
                            { type: 'highlight', content: '4. الإخفاء الحقيقي' },
                            { type: 'step', content: 'في باقي الحروف، وتخفى النون بغنة حركتين.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'adhkar',
        title: 'الأذكار والتحصين',
        icon: 'shield',
        topics: [
            {
                id: 'daily-adhkar',
                title: 'أذكار اليوم والليلة',
                icon: 'light_mode',
                subTopics: [
                    {
                        id: 'morning-adhkar',
                        title: 'أذكار الصباح والمساء',
                        blocks: [
                            { type: 'text', content: 'أذكار الصباح والمساء هي حصن المسلم المتين، تقال بعد صلاة الفجر وبعد العصر.' },
                            { type: 'quran', content: 'آية الكرسي: اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...' },
                            { type: 'hadith', content: 'سيد الاستغفار: اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك علي، وأبوء بذنبي، فاغفر لي فإنه لا يغفر الذنوب إلا أنت.' },
                            { type: 'hadith', content: 'بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم (٣ مرات).' }
                        ]
                    }
                ]
            },
            {
                id: 'ruqyah',
                title: 'الرُّقية الشرعية',
                icon: 'health_and_safety',
                subTopics: [
                    {
                        id: 'ruqyah-basics',
                        title: 'كيف ترقي نفسك؟',
                        blocks: [
                            { type: 'text', content: 'الرقية تكون بالقرآن والأدعية النبوية مع اليقين بأن الشافي هو الله.' },
                            { type: 'step', content: 'قراءة الفاتحة (٧ مرات).' },
                            { type: 'step', content: 'قراءة آية الكرسي وأواخر سورة البقرة.' },
                            { type: 'step', content: 'قراءة المعوذات (الإخلاص، الفلق، الناس) والنفث في اليدين ومسح الجسد.' },
                            { type: 'hadith', content: 'الدعاء: أذهب الباس رب الناس، اشف وأنت الشافي، لا شفاء إلا شفاؤك، شفاءً لا يغادر سقماً.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'seerah',
        title: 'السيرة النبوية',
        icon: 'history_edu',
        topics: [
            {
                id: 'meccan-era',
                title: 'العهد المكي (بناء العقيدة)',
                icon: 'mosque',
                subTopics: [
                    {
                        id: 'revelation',
                        title: 'نزول الوحي والدعوة السرية',
                        blocks: [
                            { type: 'text', content: 'نزل الوحي على النبي ﷺ في غار حراء وهو في الأربعين من عمره.' },
                            { type: 'quran', content: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ' },
                            { type: 'text', content: 'بدأت الدعوة سراً لمدة 3 سنوات، وكان دار الأرقم بن أبي الأرقم مركزاً لتربية الصحابة على العقيدة الصافية.' }
                        ]
                    },
                    {
                        id: 'hardships',
                        title: 'الجهر بالدعوة والابتلاءات',
                        blocks: [
                            { type: 'text', content: 'عندما أمر الله نبيه بالجهر، عانت قريش في تعذيب المسلمين (كآل ياسر وبلال).' },
                            { type: 'step', content: 'المقاطعة في شعب أبي طالب لمدة 3 سنوات.' },
                            { type: 'step', content: 'عام الحزن: وفاة أبي طالب وزوجته خديجة رضي الله عنها.' },
                            { type: 'step', content: 'رحلة الإسراء والمعراج تكريماً للنبي ﷺ.' }
                        ]
                    }
                ]
            },
            {
                id: 'medinan-era',
                title: 'العهد المدني (تأسيس الدولة)',
                icon: 'location_city',
                subTopics: [
                    {
                        id: 'hijrah',
                        title: 'الهجرة وتأسيس المسجد',
                        blocks: [
                            { type: 'text', content: 'هاجر النبي ﷺ مع أبي بكر الصديق إلى المدينة المنورة (يثرب سابقاً).' },
                            { type: 'step', content: 'أول عمل قام به: بناء مسجد قباء، ثم المسجد النبوي.' },
                            { type: 'step', content: 'المؤاخاة بين المهاجرين والأنصار.' },
                            { type: 'step', content: 'كتابة "صحيفة المدينة" لتنظيم العلاقة بين المسلمين واليهود.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'prophetic-medicine',
        title: 'الطب النبوي',
        icon: 'local_pharmacy',
        topics: [
            {
                id: 'natural-cures',
                title: 'العلاج الطبيعي النبوي',
                icon: 'spa',
                subTopics: [
                    {
                        id: 'black-seed',
                        title: 'الحبة السوداء والعسل',
                        blocks: [
                            { type: 'hadith', content: 'إن في الحبة السوداء شفاء من كل داء إلا السام (الموت).' },
                            { type: 'text', content: 'العسل فيه شفاء للناس كما ذكر القرآن، ويستخدم لعلاج أمراض المعدة والجروح والعديد من الأمراض.' },
                            { type: 'quran', content: 'يَخْرُجُ مِن بُطُونِهَا شَرَابٌ مُّخْتَلِفٌ أَلْوَانُهُ فِيهِ شِفَاءٌ لِّلنَّاسِ' }
                        ]
                    },
                    {
                        id: 'hijama',
                        title: 'الحجامة',
                        blocks: [
                            { type: 'text', content: 'الحجامة هي استخراج الدم الفاسد من الجسم، وهي من أفضل ما تداوى به الناس.' },
                            { type: 'hadith', content: 'الشفاء في ثلاثة: شربة عسل، وشرطة محجم، وكية نار، وأنهى أمتي عن الكي.' },
                            { type: 'step', content: 'أوقاتها المستحبة: الأيام ١٧، ١٩، ٢١ من الشهر الهجري.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'funerals',
        title: 'أحكام الجنائز',
        icon: 'airline_seat_flat',
        topics: [
            {
                id: 'funeral-rites',
                title: 'الجنازة والدفن',
                icon: 'church',
                subTopics: [
                    {
                        id: 'death-moment',
                        title: 'ما يُفعل عند الاحتضار وبعد الموت',
                        blocks: [
                            { type: 'text', content: 'الموت هو انتقال من دار العمل إلى دار الجزاء. يُستحب عند الاحتضار تلقين الميت.' },
                            { type: 'hadith', content: 'لقنوا موتاكم لا إله إلا الله.' },
                            { type: 'step', content: 'تغميض عينيه وتغطيته بثوب.' },
                            { type: 'step', content: 'الإسراع في تجهيزه (تغسيله، تكفينه، الصلاة عليه، دفنه).' }
                        ]
                    },
                    {
                        id: 'funeral-prayer',
                        title: 'صلاة الجنازة',
                        blocks: [
                            { type: 'text', content: 'صلاة الجنازة فرض كفاية، ولها أربع تكبيرات لا ركوع فيها ولا سجود.' },
                            { type: 'step', content: 'التكبيرة الأولى: قراءة الفاتحة.' },
                            { type: 'step', content: 'التكبيرة الثانية: الصلاة الإبراهيمية (كما في التشهد).' },
                            { type: 'step', content: 'التكبيرة الثالثة: الدعاء للميت.' },
                            { type: 'step', content: 'التكبيرة الرابعة: الدعاء للمسلمين ثم التسليم.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'contemporary-fiqh',
        title: 'فقه المسلم المعاصر',
        icon: 'public',
        topics: [
            {
                id: 'modern-issues',
                title: 'أحكام معاصرة',
                icon: 'work',
                subTopics: [
                    {
                        id: 'halal-food',
                        title: 'الطعام في الدول غير الإسلامية',
                        blocks: [
                            { type: 'text', content: 'الأصل في الأشياء الإباحة، لكن يُشترط في اللحوم أن تكون مذبوحة على الطريقة الإسلامية أو من ذبائح أهل الكتاب (إذا لم يُذكر عليها اسم غير الله).' },
                            { type: 'quran', content: 'وَطَعَامُ الَّذِينَ أُوتُوا الْكِتَابَ حِلٌّ لَّكُمْ وَطَعَامُكُمْ حِلٌّ لَّهُمْ' },
                            { type: 'step', content: 'تجنب الأطعمة التي تحتوي على الكحول ومشتقات الخنزير (مثل بعض أنواع الجيلاتين).' }
                        ]
                    }
                ]
            }
        ]
    },
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
    },
    {
        id: 'signs-of-hour',
        title: 'أشراط الساعة ويوم القيامة',
        icon: 'hourglass_bottom',
        topics: [
            {
                id: 'minor-signs',
                title: 'علامات الساعة الصغرى',
                icon: 'visibility',
                subTopics: [
                    {
                        id: 'minor-signs-list',
                        title: 'أشراط الساعة الصغرى التي ظهرت',
                        blocks: [
                            { type: 'text', content: 'أشراط الساعة هي العلامات التي تسبق يوم القيامة وتدل على قرب وقوعه. وقد ظهر الكثير من العلامات الصغرى.' },
                            { type: 'highlight', content: 'من العلامات التي وقعت وانقضت' },
                            { type: 'step', content: 'بعثة النبي ﷺ ووفاته: قال ﷺ "بُعثت أنا والساعة كهاتين" وأشار بالسبابة والوسطى.' },
                            { type: 'step', content: 'انشقاق القمر: حدث في عهد النبي ﷺ عندما طلب كفار قريش آية.' },
                            { type: 'quran', content: 'اقْتَرَبَتِ السَّاعَةُ وَانشَقَّ الْقَمَرُ' },
                            { type: 'step', content: 'نار الحجاز: خروج نار عظيمة من أرض الحجاز تضيء لها أعناق الإبل ببصرى (وقعت عام 654 هـ).' },
                            { type: 'highlight', content: 'من العلامات المستمرة' },
                            { type: 'step', content: 'تطاول الحفاة العراة رعاء الشاء في البنيان (كثرة الأبراج والمباني العالية).' },
                            { type: 'step', content: 'كثرة الزلازل والفتن والقتل (الهرج).' },
                            { type: 'step', content: 'تقارب الزمان: فتكون السنة كالشهر، والشهر كالجمعة.' },
                            { type: 'step', content: 'ظهور الكاسيات العاريات.' }
                        ]
                    }
                ]
            },
            {
                id: 'major-signs',
                title: 'علامات الساعة الكبرى',
                icon: 'warning',
                subTopics: [
                    {
                        id: 'major-signs-details',
                        title: 'الأشراط الكبرى (عشر علامات المتتابعة)',
                        blocks: [
                            { type: 'text', content: 'العلامات الكبرى إذا ظهرت أولاها تتابعت كحبات العقد إذا انفرط، وهي تنذر بنهاية العالم.' },
                            { type: 'highlight', content: 'المسيح الدجال' },
                            { type: 'text', content: 'أعظم فتنة على وجه الأرض منذ خلق آدم. رجل أعور يخرج في آخر الزمان، يعطيه الله قدرات خارقة لفتنة الناس، يأمر السماء فتمطر والأرض فتنبت. يقتله عيسى ابن مريم.' },
                            { type: 'highlight', content: 'نزول عيسى ابن مريم ويأجوج ومأجوج' },
                            { type: 'step', content: 'ينزل عيسى عليه السلام عند المنارة البيضاء بدمشق، فيحكم بالإسلام ويكسر الصليب ويقتل الخنزير.' },
                            { type: 'step', content: 'يأجوج ومأجوج: أمتان عظيمتان من بني آدم، يخرجون ويفسدون في الأرض، حتى يدعو عليهم عيسى والمؤمنون فيهلكهم الله.' },
                            { type: 'highlight', content: 'باقي العلامات الكبرى' },
                            { type: 'step', content: 'طلوع الشمس من مغربها (وعندها يغلق باب التوبة).' },
                            { type: 'step', content: 'خروج الدابة: تكلم الناس وتسم المؤمن والكافر.' },
                            { type: 'step', content: 'الدخان: يأخذ بأنفاس الكفار ويصيب المؤمنين منه كالزكام.' },
                            { type: 'step', content: 'ثلاثة خسوف: خسف بالمشرق، وخسف بالمغرب، وخسف بجزيرة العرب.' },
                            { type: 'step', content: 'نار تخرج من اليمن تطرد الناس إلى محشرهم.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'tafseer',
        title: 'تفسير القرآن الكريم',
        icon: 'menu_book',
        topics: [
            {
                id: 'short-surahs',
                title: 'تفسير قصار السور',
                icon: 'library_books',
                subTopics: [
                    {
                        id: 'tafseer-fatiha',
                        title: 'تفسير سورة الفاتحة',
                        blocks: [
                            { type: 'text', content: 'سورة الفاتحة هي أعظم سورة في القرآن، وهي أم الكتاب والسبع المثاني، ولا تصح الصلاة إلا بها.' },
                            { type: 'quran', content: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' },
                            { type: 'text', content: 'الثناء على الله بصفات الكمال، فهو المربي لجميع المخلوقات بنعمه.' },
                            { type: 'quran', content: 'الرَّحْمَٰنِ الرَّحِيمِ' },
                            { type: 'text', content: 'ذو الرحمة الواسعة التي شملت كل شيء، والرحيم بالمؤمنين.' },
                            { type: 'quran', content: 'مَالِكِ يَوْمِ الدِّينِ' },
                            { type: 'text', content: 'صاحب يوم الحساب والجزاء، وفيه إثبات للبعث.' },
                            { type: 'quran', content: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' },
                            { type: 'text', content: 'لا نعبد إلا أنت، ولا نطلب العون إلا منك.' },
                            { type: 'quran', content: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' },
                            { type: 'text', content: 'وفقنا وأرشدنا إلى طريق الإسلام الواضح الذي لا اعوجاج فيه.' }
                        ]
                    },
                    {
                        id: 'tafseer-muawwidhat',
                        title: 'تفسير المعوذتين والإخلاص',
                        blocks: [
                            { type: 'quran', content: 'قُلْ هُوَ اللَّهُ أَحَدٌ' },
                            { type: 'text', content: 'سورة الإخلاص تعدل ثلث القرآن، وفيها إثبات وحدانية الله وتنزيهه عن الولد والوالد.' },
                            { type: 'quran', content: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ' },
                            { type: 'text', content: 'الاستعاذة برب الصبح من شر المخلوقات، ومن شر الليل المظلم، ومن شر السواحر، ومن شر الحاسد.' },
                            { type: 'quran', content: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ' },
                            { type: 'text', content: 'الاستعاذة بالله من شر الشيطان الموسوس الذي يختفي عند ذكر الله.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'seerah-madani',
        title: 'السيرة النبوية (العهد المدني)',
        icon: 'mosque',
        topics: [
            {
                id: 'battles',
                title: 'الغزوات الكبرى',
                icon: 'swords',
                subTopics: [
                    {
                        id: 'badr',
                        title: 'غزوة بدر الكبرى (يوم الفرقان)',
                        blocks: [
                            { type: 'text', content: 'وقعت في 17 رمضان من السنة الثانية للهجرة. وهي أول وأهم معركة فاصلة في الإسلام.' },
                            { type: 'highlight', content: 'أحداث الغزوة' },
                            { type: 'step', content: 'كان عدد المسلمين 313 رجلاً، بينما قريش تجاوزت الـ 1000 مقاتل.' },
                            { type: 'step', content: 'أمد الله المسلمين بألف من الملائكة مردفين.' },
                            { type: 'step', content: 'قُتل فيها صناديد قريش وعلى رأسهم أبو جهل وأمية بن خلف.' },
                            { type: 'quran', content: 'وَلَقَدْ نَصَرَكُمُ اللَّهُ بِبَدْرٍ وَأَنتُمْ أَذِلَّةٌ ۖ فَاتَّقُوا اللَّهَ لَعَلَّكُمْ تَشْكُرُونَ' }
                        ]
                    },
                    {
                        id: 'uhud-khandaq',
                        title: 'أحد والخندق وفتح مكة',
                        blocks: [
                            { type: 'highlight', content: 'غزوة أحد (سنة 3 هـ)' },
                            { type: 'text', content: 'انتصر المسلمون في البداية، لكن مخالفة الرماة لأمر النبي ﷺ بنزولهم من الجبل أدى لانقلاب المعركة واستشهاد 70 من الصحابة، منهم حمزة بن عبد المطلب.' },
                            { type: 'highlight', content: 'غزوة الخندق (سنة 5 هـ)' },
                            { type: 'text', content: 'تحزبت القبائل (10 آلاف مقاتل) لحصار المدينة. أشار سلمان الفارسي بحفر الخندق، وأرسل الله ريحاً اقتلعت خيام المشركين وكفى الله المؤمنين القتال.' },
                            { type: 'highlight', content: 'فتح مكة (سنة 8 هـ)' },
                            { type: 'text', content: 'دخل النبي ﷺ مكة بعشرة آلاف مقاتل فاتحاً منتصراً دون قتال، وحطم الأصنام حول الكعبة، وعفا عن قريش قائلاً: "اذهبوا فأنتم الطلقاء".' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'companions',
        title: 'الصحابة والخلفاء الراشدون',
        icon: 'group',
        topics: [
            {
                id: 'rashidun',
                title: 'الخلفاء الراشدون الأربعة',
                icon: 'stars',
                subTopics: [
                    {
                        id: 'abu-bakr-umar',
                        title: 'أبو بكر وعمر (رضي الله عنهما)',
                        blocks: [
                            { type: 'highlight', content: 'أبو بكر الصديق' },
                            { type: 'text', content: 'أول من آمن من الرجال، صاحب النبي في الغار، وأول خليفة للمسلمين. حارب المرتدين وجمع القرآن.' },
                            { type: 'hadith', content: 'قال ﷺ: "لو كنت متخذاً من أمتي خليلاً لاتخذت أبا بكر".' },
                            { type: 'highlight', content: 'عمر بن الخطاب (الفاروق)' },
                            { type: 'text', content: 'ثاني الخلفاء الراشدين، أعز الله به الإسلام. أسقط إمبراطورية الفرس وفتح القدس ومصر.' },
                            { type: 'hadith', content: 'قال ﷺ: "إن الشيطان ليفرق (يهرب) من ظلك يا عمر".' }
                        ]
                    },
                    {
                        id: 'uthman-ali',
                        title: 'عثمان وعلي (رضي الله عنهما)',
                        blocks: [
                            { type: 'highlight', content: 'عثمان بن عفان (ذو النورين)' },
                            { type: 'text', content: 'تزوج ابنتي النبي ﷺ. تستحي منه الملائكة، جهّز جيش العسرة، وفي عهده جُمع القرآن في مصحف واحد.' },
                            { type: 'highlight', content: 'علي بن أبي طالب' },
                            { type: 'text', content: 'ابن عم النبي ﷺ وزوج فاطمة الزهراء. أول من فدى النبي بنفسه حين نام في فراشه ليلة الهجرة. بطل خيبر.' },
                            { type: 'hadith', content: 'قال ﷺ: "أنت مني بمنزلة هارون من موسى إلا أنه لا نبي بعدي".' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'hajj-umrah',
        title: 'فقه الحج والعمرة',
        icon: 'explore',
        topics: [
            {
                id: 'hajj-fiqh',
                title: 'أحكام الحج خطوة بخطوة',
                icon: 'flag',
                subTopics: [
                    {
                        id: 'hajj-pillars',
                        title: 'أركان الحج وواجباته',
                        blocks: [
                            { type: 'text', content: 'الحج هو الركن الخامس من أركان الإسلام، يجب على كل مسلم بالغ عاقل مستطيع مرة واحدة في العمر.' },
                            { type: 'quran', content: 'وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا' },
                            { type: 'highlight', content: 'أركان الحج الأربعة (لا يصح الحج إلا بها)' },
                            { type: 'step', content: 'الإحرام: وهو نية الدخول في النسك (وليس مجرد لبس ثياب الإحرام).' },
                            { type: 'step', content: 'الوقوف بعرفة: لقوله ﷺ: "الحج عرفة". ويبدأ من زوال شمس يوم التاسع إلى فجر يوم النحر.' },
                            { type: 'step', content: 'طواف الإفاضة: طواف الركن بعد الإفاضة من عرفة ومزدلفة.' },
                            { type: 'step', content: 'السعي بين الصفا والمروة: سبعة أشواط.' },
                            { type: 'highlight', content: 'واجبات الحج (من تركها وجب عليه دم "ذبيحة")' },
                            { type: 'step', content: 'الإحرام من الميقات المكاني.' },
                            { type: 'step', content: 'البقاء بعرفة إلى غروب الشمس لمن وقف نهاراً.' },
                            { type: 'step', content: 'المبيت بمزدلفة ليلة النحر.' },
                            { type: 'step', content: 'المبيت بمنى ليالي أيام التشريق.' },
                            { type: 'step', content: 'رمي الجمرات (جمرة العقبة الكبرى ثم الجمرات الثلاث).' },
                            { type: 'step', content: 'الحلق أو التقصير (والحلق للرجال أفضل).' },
                            { type: 'step', content: 'طواف الوداع قبل مغادرة مكة.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'prophetic-medicine',
        title: 'الطب النبوي والعلاج',
        icon: 'local_hospital',
        topics: [
            {
                id: 'healing-sunnah',
                title: 'العلاجات النبوية الثابتة',
                icon: 'spa',
                subTopics: [
                    {
                        id: 'honey-zamzam',
                        title: 'العسل وماء زمزم والحبة السوداء',
                        blocks: [
                            { type: 'highlight', content: 'الحبة السوداء (حبة البركة)' },
                            { type: 'hadith', content: 'قال النبي ﷺ: "إن في الحبة السوداء شفاء من كل داء إلا السام" (والسام هو الموت). رواه البخاري.' },
                            { type: 'text', content: 'استخدامها يكون باعتدال، إما بمضغها أو سفها مع العسل، وهي مقوية للمناعة ونافعة للأمراض الباطنية.' },
                            { type: 'highlight', content: 'العسل' },
                            { type: 'quran', content: 'يَخْرُجُ مِن بُطُونِهَا شَرَابٌ مُّخْتَلِفٌ أَلْوَانُهُ فِيهِ شِفَاءٌ لِّلنَّاسِ' },
                            { type: 'text', content: 'العسل مضاد حيوي طبيعي، وكان النبي ﷺ يشربه ممزوجاً بالماء على الريق.' },
                            { type: 'highlight', content: 'ماء زمزم' },
                            { type: 'hadith', content: 'قال ﷺ: "ماء زمزم لما شُرب له".' },
                            { type: 'text', content: 'فهو طعام طعم وشفاء سقم، ويُستحب التضلع منه والدعاء عند شربه.' }
                        ]
                    },
                    {
                        id: 'hijama',
                        title: 'الحجامة والتداوي',
                        blocks: [
                            { type: 'text', content: 'الحجامة هي استخراج الدم الفاسد من الجسم بواسطة كاسات زجاجية، وهي من أنفع العلاجات التي أوصى بها أهل السماء.' },
                            { type: 'hadith', content: 'قال ﷺ: "إن أمثل ما تداويتم به الحجامة".' },
                            { type: 'step', content: 'أفضل أوقاتها: الأيام الفردية (17، 19، 21) من الشهر الهجري إذا وافقت الاثنين أو الثلاثاء أو الخميس.' },
                            { type: 'step', content: 'فوائدها: تنقية الدم، تخفيف الآلام، علاج الصداع النصفي والشقيقة، وتنشيط الدورة الدموية.' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'mothers-of-believers',
        title: 'أمهات المؤمنين (زوجات النبي)',
        icon: 'woman',
        topics: [
            {
                id: 'wives-prophet',
                title: 'سير ومناقب أمهات المؤمنين',
                icon: 'favorite',
                subTopics: [
                    {
                        id: 'khadija-aisha',
                        title: 'خديجة وعائشة (رضي الله عنهما)',
                        blocks: [
                            { type: 'highlight', content: 'خديجة بنت خويلد' },
                            { type: 'text', content: 'أول زوجات النبي ﷺ وأول من آمن به من البشر. واسته بمالها ونفسها حين كذبه الناس. أقرأها الله السلام من فوق سبع سماوات عبر جبريل عليه السلام وبشرها ببيت في الجنة من قصب (لؤلؤ مجوف) لا صخب فيه ولا نصب.' },
                            { type: 'highlight', content: 'عائشة بنت أبي بكر' },
                            { type: 'text', content: 'أحب نسائه إليه بعد خديجة. العالمة الفقيهة التي روت أكثر من ألفي حديث عن النبي ﷺ. برأها الله من حادثة الإفك بآيات تتلى من فوق سبع سماوات في سورة النور.' },
                            { type: 'hadith', content: 'قال ﷺ: "فضل عائشة على النساء كفضل الثريد على سائر الطعام".' }
                        ]
                    }
                ]
            }
        ]
    },
    {
        id: 'funerals',
        title: 'أحكام الجنائز',
        icon: 'nature_people',
        topics: [
            {
                id: 'janazah-fiqh',
                title: 'تغسيل وتكفين الميت والصلاة عليه',
                icon: 'group',
                subTopics: [
                    {
                        id: 'washing-shrouding',
                        title: 'التغسيل والتكفين',
                        blocks: [
                            { type: 'text', content: 'إذا مات المسلم، وجب على الكفاية الإسراع في تجهيزه وستره.' },
                            { type: 'highlight', content: 'صفة الغسل' },
                            { type: 'step', content: 'يُستر عورة الميت (من السرة للركبة).' },
                            { type: 'step', content: 'يُعصر بطنه برفق لإخراج ما فضل، ثم يُنجى (يغسل فرجه بخرقة).' },
                            { type: 'step', content: 'يُوضأ كوضوء الصلاة.' },
                            { type: 'step', content: 'يُغسل جسده بالماء والسدر ثلاثاً أو خمساً أو سبعاً، ويجعل في الغسلة الأخيرة كافوراً (يطيب رائحته ويشد جسده).' },
                            { type: 'highlight', content: 'التكفين' },
                            { type: 'step', content: 'يُكفن الرجل في 3 لفائف بيضاء ليس فيها قميص ولا عمامة.' },
                            { type: 'step', content: 'تُكفن المرأة في 5 أثواب (إزار، وخمار للرأس، وقميص، ولفافتان).' }
                        ]
                    },
                    {
                        id: 'janazah-prayer',
                        title: 'صلاة الجنازة والدفن',
                        blocks: [
                            { type: 'text', content: 'صلاة الجنازة فرض كفاية، ولها فضل عظيم (قيراط من الأجر).' },
                            { type: 'highlight', content: 'صفة صلاة الجنازة (4 تكبيرات بدون ركوع ولا سجود)' },
                            { type: 'step', content: 'التكبيرة الأولى: تقرأ بعدها سورة الفاتحة.' },
                            { type: 'step', content: 'التكبيرة الثانية: تصلي على النبي ﷺ (الصلاة الإبراهيمية).' },
                            { type: 'step', content: 'التكبيرة الثالثة: الدعاء للميت بإخلاص (اللهم اغفر له وارحمه وعافه واعف عنه...).' },
                            { type: 'step', content: 'التكبيرة الرابعة: الدعاء للمسلمين وللنفس، ثم التسليم (تسليمة واحدة على اليمين).' },
                            { type: 'highlight', content: 'الدفن' },
                            { type: 'text', content: 'يُدخل الميت القبر من جهة رجليه، ويوجه ليُوضع على شقه الأيمن مستقبل القبلة، ويقول الذي يضعه: "بسم الله وعلى ملة رسول الله".' }
                        ]
                    }
                ]
            }
        ]
    }
];
