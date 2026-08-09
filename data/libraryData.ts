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
                        id: 'wudu-steps',
                        title: 'صفة الوضوء الصحيحة',
                        blocks: [
                            { type: 'text', content: 'الوضوء هو مفتاح الصلاة، وإليك صفته الكاملة الثابتة عن النبي ﷺ:' },
                            { type: 'step', content: 'النية: ومحلها القلب.' },
                            { type: 'step', content: 'التسمية: قول "بسم الله".' },
                            { type: 'step', content: 'غسل الكفين: ثلاث مرات.' },
                            { type: 'step', content: 'المضمضة والاستنشاق: ثلاث مرات بغرفة واحدة.' },
                            { type: 'step', content: 'غسل الوجه: ثلاث مرات.' },
                            { type: 'step', content: 'غسل اليدين إلى المرفقين: ثلاث مرات، يبدأ باليمنى ثم اليسرى.' },
                            { type: 'step', content: 'مسح الرأس والأذنين: مرة واحدة يقبل بيديه ويدبر.' },
                            { type: 'step', content: 'غسل الرجلين إلى الكعبين: ثلاث مرات مع تخليل الأصابع.' },
                            { type: 'highlight', content: 'ما يقال بعد الوضوء:' },
                            { type: 'hadith', content: 'أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمداً عبده ورسوله. اللهم اجعلني من التوابين واجعلني من المتطهرين.' }
                        ]
                    },
                    {
                        id: 'wudu-nullifiers',
                        title: 'نواقض الوضوء',
                        blocks: [
                            { type: 'text', content: 'الأمور التي إذا حدثت يجب إعادة الوضوء للصلاة:' },
                            { type: 'step', content: 'الخارج من السبيلين (البول، الغائط، الريح، المذي، الودي).' },
                            { type: 'step', content: 'زوال العقل بسكر أو إغماء أو نوم عميق لا يشعر فيه الإنسان بما يخرج منه.' },
                            { type: 'step', content: 'أكل لحم الإبل (على الراجح من أقوال العلماء).' },
                            { type: 'step', content: 'مس الفرج باليد مباشرة بشهوة (على تفصيل عند الفقهاء).' }
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
    }
];
