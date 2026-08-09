import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { usePrayer } from '../context/PrayerContext';
import { analyzeImage } from '../services/geminiService';
import { translations } from '../translations';

interface Macro {
    name: string;
    value: string;
    status: 'good' | 'warning' | 'bad';
}

interface AnalysisResult {
    foodName: string;
    calories: number;
    grade: string;
    verdict: string;
    tags: string[];
    macros: { protein: string; carbs: string; fats: string };
    ingredients: Macro[];
    burnExercises: string[];
    healthImpact: string;
    propheticInsight: string;
}

const Health: React.FC = () => {
    const navigate = useNavigate();
    const { profile, settings, updateHealthStats, isLoading } = useUser();
    const { timings } = usePrayer();
    const language = settings.language || 'en';
    const t = translations[language as keyof typeof translations] || translations.en;

    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [lastImage, setLastImage] = useState<string | null>(null);
    const todayStr = new Date().toISOString().split('T')[0];
    const [waterGlasses, setWaterGlasses] = useState<number>(() => parseInt(localStorage.getItem(`water_${todayStr}`) || '0', 10));
    const [isZamzamMode, setIsZamzamMode] = useState(false);
    const [zamzamDua, setZamzamDua] = useState('');
    const [zamzamIntentions, setZamzamIntentions] = useState<string[]>(() => {
        try { return JSON.parse(localStorage.getItem(`zamzam_intentions_${todayStr}`) || '[]'); } catch { return []; }
    });
    const [showWaterAction, setShowWaterAction] = useState(false);
    const [isFasting, setIsFasting] = useState(false);

    useEffect(() => {
        if (!settings.ramadanMode || !timings) {
            setIsFasting(false);
            return;
        }
        
        const checkFasting = () => {
            const now = new Date();
            const fajrTime = new Date();
            const [fH, fM] = timings.Fajr.split(' ')[0].split(':').map(Number);
            fajrTime.setHours(fH, fM, 0, 0);

            const maghribTime = new Date();
            const [mH, mM] = timings.Maghrib.split(' ')[0].split(':').map(Number);
            maghribTime.setHours(mH, mM, 0, 0);

            if (now >= fajrTime && now < maghribTime) {
                setIsFasting(true);
            } else {
                setIsFasting(false);
            }
        };
        
        checkFasting();
        const int = setInterval(checkFasting, 60000);
        return () => clearInterval(int);
    }, [settings.ramadanMode, timings]);

    useEffect(() => {
        localStorage.setItem(`water_${todayStr}`, waterGlasses.toString());
        localStorage.setItem(`zamzam_intentions_${todayStr}`, JSON.stringify(zamzamIntentions));
    }, [waterGlasses, zamzamIntentions, todayStr]);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);

    // Redirect if profile data is missing
    useEffect(() => {
        if (!isLoading && (!profile.name || !profile.height || !profile.weight)) {
            navigate('/profile');
        }
    }, [profile, isLoading, navigate]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];
                setLastImage(base64Data);
                runAnalysis(base64Data);
            };
            reader.readAsDataURL(file);
        }
    };

    const runAnalysis = async (base64Data: string) => {
        setAnalyzing(true);
        setResult(null);
        try {
            const context = `User Profile: Weight: ${profile.weight || '--'}kg, Height: ${profile.height || '--'}cm, Allergies: ${profile.allergies?.join(', ') || 'None'}, Diseases: ${profile.diseases?.join(', ') || 'None'}, Medications: ${profile.medications?.join(', ') || 'None'}`;
            const targetLang = language === 'ar' ? 'Arabic' : language === 'ru' ? 'Russian' : 'English';
            const prompt = `
                Analyze this image (it may be food, beverage, or medication) for a "Biometric Al-Shifa Analysis" dashboard. ${context}
                
                CRITICAL INSTRUCTION 1: You MUST translate and write ALL string values (foodName, verdict, tags, ingredients names, burnExercises, healthImpact, propheticInsight) entirely in ${targetLang}. DO NOT write them in English.
                CRITICAL INSTRUCTION 2: If the image is a medication, calories MUST be 0, macros MUST be "0g", and burnExercises MUST be an empty array [].
                CRITICAL INSTRUCTION 3: You MUST return ONLY a strictly valid JSON object. Do not add any text before or after the JSON.
                CRITICAL INSTRUCTION 4: DO NOT use double quotes (") inside the string values. Use single quotes (') if needed.
                
                Use this exact JSON structure:
                {
                    "foodName": "Name of item in target language",
                    "calories": 0,
                    "grade": "A",
                    "verdict": "Short summary in target language",
                    "tags": ["Tag in target language"],
                    "macros": {"protein": "Xg", "carbs": "Xg", "fats": "Xg"},
                    "ingredients": [{"name": "Ingredient in target language", "value": "Amount", "status": "good"}],
                    "burnExercises": ["Exercise in target language"],
                    "healthImpact": "Direct analysis on how this item affects the user given their diseases/allergies/medications. Flag warnings clearly. MUST BE IN target language",
                    "propheticInsight": "A short spiritual or health insight based on Prophetic Medicine (Tib An-Nabawi). MUST BE IN target language"
                }
            `;
            const aiResponse = await analyzeImage(base64Data, prompt);
            console.log("Raw AI Response:", aiResponse);
            if (aiResponse) {
                let cleaned = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
                const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    cleaned = jsonMatch[0];
                }
                const parsedResult = JSON.parse(cleaned);
                setResult(parsedResult);

                // Update Global Health Stats
                updateHealthStats({
                    calories: parsedResult.calories,
                    grade: parsedResult.grade,
                    lastScanDate: new Date().toISOString(),
                });

                // Haptic feedback on success
                try {
                    if (navigator.vibrate) {
                        if (parsedResult.grade === 'A' || parsedResult.grade === 'B') {
                            navigator.vibrate([50, 50, 50]);
                        } else {
                            navigator.vibrate([200, 100, 200]);
                        }
                    }
                } catch (e) {}

            }
        } catch (e) {
            console.error(e);
            alert("Analysis failed. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleAskDoctor = async () => {
        if (!result || !lastImage) return;
        try {
            const { createScanConversation } = await import('../services/aiChatService');
            const summary = {
                name: result.foodName,
                status: result.grade ? `Health Grade ${result.grade}` : 'Unknown',
                reason: `${result.verdict} — ${result.calories} kcal.\nExercises: ${result.burnExercises?.join(', ')}.\nImpact: ${result.healthImpact}`,
                origin: '',
                ingredients: result.ingredients?.map((i: any) => i.name) || [],
                alternatives: result.tags || [],
            };
            const conv = await createScanConversation(lastImage, summary, 'Doctor AI');
            navigate('/aichat', { state: { conversationId: conv.id } });
        } catch (error) {
            console.error('Failed to create Doctor AI conversation:', error);
        }
    };

    return (
        <div className="min-h-screen bg-[#000504] text-white font-sans relative overflow-x-hidden flex flex-col items-center pb-32" dir={language === 'ar' ? 'rtl' : 'ltr'}>

            {/* Dark Mode Fixed Background */}
            <div className="fixed inset-0 max-w-md mx-auto z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[#000504]"></div>

                {/* Subtle Ambient Glows */}
                <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-emerald-950/15 blur-[80px] rounded-full opacity-60"></div>
                <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-gold-950/15 blur-[80px] rounded-full opacity-60"></div>
            </div>

            {/* Header */}
            <div className="relative z-10 w-full max-w-md pt-14 pb-6 px-6 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="size-10 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-xl">{language === 'ar' ? 'arrow_forward' : 'arrow_back'}</span>
                </button>
                <div className="text-center">
                    <h1 className="text-2xl font-royal font-bold text-transparent bg-clip-text bg-gradient-to-b from-emerald-100 via-white to-emerald-200 tracking-wider">
                        {t.al_shifa}
                    </h1>
                </div>
                <div className="size-10"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-md flex-1 flex flex-col px-6">
                {!result ? (
                    <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-1000 my-10">

                        {/* MOLECULAR SCANNER HUD */}
                        <div
                            className="relative size-64 flex items-center justify-center mb-10 cursor-pointer group"
                            onClick={() => cameraInputRef.current?.click()}
                        >
                            {/* Outer Static Ring */}
                            <div className="absolute inset-0 rounded-full border border-emerald-500/10"></div>

                            {/* Static Dashed Ring */}
                            <div className="absolute inset-4 rounded-full border border-dashed border-gold/20"></div>

                            {/* Static Tech Ring */}
                            <div className="absolute inset-10 rounded-full border border-emerald-900/40"></div>

                            {/* Inner Circle / Button */}
                            <div className="absolute inset-16 rounded-full bg-gradient-to-br from-black to-[#052e25] border border-emerald-500/30 flex flex-col items-center justify-center z-10 group-hover:scale-105 transition-transform duration-300 overflow-hidden">

                                {analyzing ? (
                                    <>
                                        {/* Uploaded image as background (dimmed) */}
                                        {lastImage && (
                                            <div 
                                                className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity grayscale" 
                                                style={{ backgroundImage: `url(data:image/jpeg;base64,${lastImage})` }}
                                            />
                                        )}
                                        {/* Core pulsing background overlay */}
                                        <div className="absolute inset-0 bg-emerald-900/20 animate-pulse"></div>
                                        
                                        {/* Grid overlay for tech feel */}
                                        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:15px_15px] opacity-40"></div>
                                        
                                        {/* Spinning tech borders */}
                                        <div className="absolute inset-0 rounded-full border-[2px] border-emerald-900/30 border-t-emerald-400 border-b-emerald-400 animate-spin-slow"></div>
                                        <div className="absolute inset-2 rounded-full border-[1px] border-emerald-900/30 border-r-emerald-300 border-l-emerald-300 animate-spin-reverse-slow opacity-50"></div>
                                        
                                        {/* The scanning laser */}
                                        <div className="w-full h-[2px] bg-emerald-400 absolute left-0 animate-scan shadow-[0_0_20px_3px_rgba(16,185,129,0.8)] z-20"></div>
                                        
                                        {/* Scanning text pill */}
                                        <div className="relative z-20 flex items-center gap-2 bg-[#021812]/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/30 shadow-[0_0_15px_rgba(2,24,18,0.8)]">
                                            <span className="material-symbols-outlined text-[14px] text-emerald-400 animate-pulse">troubleshoot</span>
                                            <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-[0.3em] animate-pulse">
                                                {t.analyzing || 'Scanning'}
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-4xl text-gold/80 mb-2 group-hover:text-gold-bright transition-colors">biotech</span>
                                        <div className="h-px w-8 bg-emerald-500/30 mb-2"></div>
                                    </>
                                )}
                            </div>

                            {/* Targeting Corners */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 pointer-events-none">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold/60"></div>
                                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-gold/60"></div>
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-gold/60"></div>
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold/60"></div>
                            </div>
                        </div>

                        <div className="text-center mb-10">
                            <h2 className="text-[10px] font-bold text-gold/60 uppercase tracking-[0.4em] mb-3">
                                {t.align_food || 'Align Food for Molecular Scan'}
                            </h2>
                            <p className="text-xs text-white/30 max-w-[200px] mx-auto leading-relaxed">
                                {t.biometric_intelligence || 'AI-powered nutritional & prophetic analysis engine'}
                            </p>
                        </div>

                        {/* Prophetic Water Tracker 2.0 */}
                        <div className="w-full max-w-sm mx-auto mt-4 mb-8 bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
                            
                            {isFasting ? (
                                <div className="relative z-10 flex flex-col items-center justify-center h-64 text-center animate-in fade-in zoom-in-95 duration-500">
                                    <div className="size-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mb-4">
                                        <span className="material-symbols-outlined text-3xl text-gold">lock</span>
                                    </div>
                                    <h3 className="font-arabic text-2xl text-gold-light mb-3 tracking-wide">"الصوم جُنة"</h3>
                                    <p className="text-xs text-white/50 max-w-[200px] leading-relaxed font-arabic">
                                        {language === 'ar' 
                                            ? 'متتبع الماء مغلق أثناء ساعات الصيام. تقبل الله طاعتك.' 
                                            : 'Water tracker is locked during fasting hours. May Allah accept your fast.'}
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-8 relative z-10">
                                        <div className="flex flex-col">
                                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                                <span className="material-symbols-outlined text-blue-400">water_drop</span>
                                                {language === 'ar' ? 'متتبع الماء النبوي' : 'Prophetic Water Tracker'}
                                            </h3>
                                            <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">
                                                {language === 'ar' ? 'السُّنة: الشرب بتمهل' : 'Sunnah: Drink Slowly'}
                                            </p>
                                        </div>
                                        <div className="text-xs font-mono font-bold text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                            {waterGlasses} / 8
                                        </div>
                                    </div>
                                    
                                    <div className="relative flex justify-center items-center h-48 z-10">
                                        {/* The Glass */}
                                        <div 
                                            onClick={() => setShowWaterAction(true)}
                                            className={`relative w-24 h-40 rounded-b-[2rem] rounded-t-lg border-x-[3px] border-b-[3px] bg-white/[0.02] overflow-hidden cursor-pointer group shadow-[inset_0_-10px_20px_rgba(255,255,255,0.1)] transition-colors duration-700 ${
                                                isZamzamMode ? 'border-gold/40 hover:border-gold/60 shadow-[0_0_30px_rgba(212,175,55,0.2)]' : 'border-white/20 hover:border-white/40'
                                            }`}
                                        >
                                            {/* Liquid Fill */}
                                            <div 
                                                className={`absolute bottom-0 left-0 right-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                                                    isZamzamMode 
                                                        ? 'bg-gradient-to-b from-white/90 via-gold/50 to-gold/80 shadow-[0_-5px_15px_rgba(212,175,55,0.5)]' 
                                                        : 'bg-gradient-to-b from-blue-400/80 to-blue-600/80'
                                                }`}
                                                style={{ height: `${Math.min((waterGlasses / 8) * 100, 100)}%` }}
                                            >
                                                {/* Surface */}
                                                <div className={`absolute top-0 left-0 right-0 h-1.5 ${isZamzamMode ? 'bg-white/80' : 'bg-blue-300/50'}`}></div>
                                                
                                                {/* Bubbles / Particles */}
                                                <div className={`absolute bottom-2 left-4 size-1.5 rounded-full animate-bounce ${isZamzamMode ? 'bg-gold-light' : 'bg-white/40'}`}></div>
                                                <div className={`absolute bottom-6 right-5 size-2 rounded-full animate-bounce ${isZamzamMode ? 'bg-white' : 'bg-white/30'}`} style={{ animationDelay: '0.2s' }}></div>
                                                
                                                {/* Zamzam Floating Intentions */}
                                                {isZamzamMode && zamzamIntentions.map((intent, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="absolute w-max max-w-[80px] text-center text-[6px] font-bold text-black bg-white/70 px-1 py-0.5 rounded-full animate-float-slow backdrop-blur-sm shadow-sm truncate"
                                                        style={{ 
                                                            left: `${10 + (idx * 30) % 60}%`, 
                                                            bottom: `${20 + (idx * 15) % 60}%`,
                                                            animationDelay: `${idx * 0.5}s`
                                                        }}
                                                    >
                                                        {intent}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            {/* Glass reflection */}
                                            <div className="absolute inset-y-0 left-2 w-2 bg-gradient-to-r from-white/20 to-transparent rounded-full"></div>
                                            
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                                <span className="material-symbols-outlined text-white text-3xl">add</span>
                                            </div>
                                        </div>
                                        
                                        {/* Zamzam Toggle */}
                                        <div className="absolute right-0 bottom-0 flex flex-col items-center gap-2">
                                            <span className="text-[9px] font-bold text-gold/80 uppercase tracking-widest">{language === 'ar' ? 'ماء زمزم' : 'Zamzam'}</span>
                                            <button 
                                                onClick={() => setIsZamzamMode(!isZamzamMode)}
                                                className={`w-10 h-6 rounded-full p-1 transition-colors relative ${isZamzamMode ? 'bg-gold' : 'bg-white/10'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isZamzamMode ? 'translate-x-4 shadow-[0_0_10px_rgba(255,255,255,0.8)]' : 'translate-x-0'}`}></div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Water Action Popover */}
                                    {showWaterAction && (
                                        <div className="absolute inset-0 bg-[#020402]/95 backdrop-blur-md z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
                                            <h4 className="text-sm font-bold text-white mb-4">
                                                {isZamzamMode ? (language === 'ar' ? 'نية شرب زمزم' : 'Zamzam Intention') : (language === 'ar' ? 'آداب الشرب' : 'Drinking Sunnahs')}
                                            </h4>
                                            
                                            {!isZamzamMode ? (
                                                <div className="flex flex-col gap-3 text-xs text-white/70 mb-6 text-right w-full font-arabic" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                                        <span className="material-symbols-outlined text-blue-400 text-[16px]">check_circle</span>
                                                        <span>{language === 'ar' ? 'التسمية (بسم الله)' : 'Say Bismillah'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                                        <span className="material-symbols-outlined text-blue-400 text-[16px]">check_circle</span>
                                                        <span>{language === 'ar' ? 'الشرب جالساً' : 'Sit down while drinking'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                                        <span className="material-symbols-outlined text-blue-400 text-[16px]">check_circle</span>
                                                        <span>{language === 'ar' ? 'الشرب على 3 دفعات' : 'Drink in 3 breaths'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                                        <span className="material-symbols-outlined text-blue-400 text-[16px]">check_circle</span>
                                                        <span>{language === 'ar' ? 'الحمد لله بعد الانتهاء' : 'Say Alhamdulillah after'}</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full mb-6">
                                                    <p className="text-[10px] text-gold/70 mb-2 font-arabic">
                                                        {language === 'ar' ? '"ماء زمزم لما شُرب له"' : '"Zamzam water is for what it is drunk for"'}
                                                    </p>
                                                    <input 
                                                        type="text" 
                                                        value={zamzamDua}
                                                        onChange={(e) => setZamzamDua(e.target.value)}
                                                        placeholder={language === 'ar' ? 'اكتب نيتك أو دعاءك هنا...' : 'Write your dua/intention...'}
                                                        className="w-full bg-black/50 border border-gold/30 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-gold font-arabic"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex w-full gap-3">
                                                <button 
                                                    onClick={() => setShowWaterAction(false)}
                                                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                                                >
                                                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setWaterGlasses(prev => prev + 1);
                                                        setShowWaterAction(false);
                                                        if (isZamzamMode && zamzamDua) {
                                                            setZamzamIntentions(prev => [...prev, zamzamDua].slice(-5)); // keep max 5
                                                            setZamzamDua('');
                                                        }
                                                    }}
                                                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-bold uppercase tracking-widest hover:from-blue-500 hover:to-blue-400 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                                >
                                                    {language === 'ar' ? 'شربت' : 'I Drank'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 w-full justify-center">
                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-900/30 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-900/50 hover:border-emerald-500/50 transition-all text-emerald-100"
                            >
                                <span className="material-symbols-outlined text-lg">photo_camera</span>
                                {t.capture}
                            </button>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-6 py-3 rounded-full bg-gold-900/20 border border-gold/20 text-[10px] font-bold uppercase tracking-widest hover:bg-gold-900/40 hover:border-gold/50 transition-all text-gold-100"
                            >
                                <span className="material-symbols-outlined text-lg">upload_file</span>
                                {t.upload}
                            </button>
                        </div>

                        <input type="file" ref={cameraInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" capture="environment" />
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                    </div>
                ) : (
                    <div className="space-y-5 animate-in fade-in duration-500 pb-10">
                        {/* RESULT CARD */}
                        <div className="relative bg-[#05100e] border border-emerald-500/20 rounded-2xl p-6 overflow-hidden">
                            <div className="relative z-10">
                                <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest mb-3 border ${result.grade === 'A' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                                        result.grade === 'B' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                                            'bg-orange-500/10 border-orange-500/40 text-orange-400'
                                    }`}>
                                    Health Grade {result.grade}
                                </span>

                                <h2 className="text-2xl font-royal font-bold text-white mb-2">{result.foodName}</h2>
                                <p className="text-sm text-emerald-100/70 font-medium leading-relaxed mb-4">{result.verdict}</p>

                                {/* Tags */}
                                {result.tags && result.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-5">
                                        {result.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-gray-400 font-bold uppercase tracking-wider">{tag}</span>
                                        ))}
                                    </div>
                                )}

                                {/* Macros Grid (Only for food/items with calories) */}
                                {result.calories > 0 && (
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="bg-black/40 rounded-xl p-3 text-center border border-white/5">
                                            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">{t.calories}</div>
                                            <div className="text-lg font-bold text-white">{result.calories}</div>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-3 text-center border border-white/5">
                                            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">{t.protein}</div>
                                            <div className="text-lg font-bold text-emerald-400">{result.macros.protein || '0g'}</div>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-3 text-center border border-white/5">
                                            <div className="text-xs text-white/40 uppercase tracking-wider mb-1">{t.carbs}</div>
                                            <div className="text-lg font-bold text-gold-400">{result.macros.carbs || '0g'}</div>
                                        </div>
                                    </div>
                                )}

                                {/* Smart Ingredients List */}
                                {result.ingredients && result.ingredients.length > 0 && (
                                    <div className="mb-6 bg-black/30 rounded-xl border border-white/5 overflow-hidden">
                                        <div className="bg-white/5 px-4 py-2 border-b border-white/5 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[14px] text-gold-400">science</span>
                                            <h3 className="text-[10px] font-bold text-gold-400 uppercase tracking-widest">{t.molecular_profile || 'Molecular Profile'}</h3>
                                        </div>
                                        <div className="p-3 grid grid-cols-1 gap-2">
                                            {result.ingredients.map((ing, i) => (
                                                <div key={i} className={`flex items-center justify-between p-2 rounded-lg border ${
                                                    ing.status === 'good' ? 'bg-emerald-900/10 border-emerald-500/20 text-emerald-300' :
                                                    ing.status === 'bad' ? 'bg-red-900/10 border-red-500/20 text-red-300' :
                                                    'bg-orange-900/10 border-orange-500/20 text-orange-300'
                                                }`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="material-symbols-outlined text-[14px]">
                                                            {ing.status === 'good' ? 'check_circle' : ing.status === 'bad' ? 'warning' : 'info'}
                                                        </span>
                                                        <span className="text-xs font-medium">{ing.name}</span>
                                                    </div>
                                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{ing.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Health Impact & Exercises */}
                                <div className="space-y-4 mb-6">
                                    <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2 text-blue-400">
                                            <span className="material-symbols-outlined text-[16px]">monitor_heart</span>
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest">{t.health_impact || 'Health Impact'}</h3>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">{result.healthImpact}</p>
                                    </div>

                                    {result.burnExercises && result.burnExercises.length > 0 && (
                                        <div className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2 text-orange-400">
                                                <span className="material-symbols-outlined text-[16px]">fitness_center</span>
                                                <h3 className="text-[10px] font-bold uppercase tracking-widest">{t.required_exercise || 'Required Exercise to Burn'} ({result.calories} kcal)</h3>
                                            </div>
                                            <ul className="text-sm text-gray-300 leading-relaxed list-disc list-inside">
                                                {result.burnExercises.map((ex, i) => (
                                                    <li key={i}>{ex}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Prophetic Insight */}
                                <div className="bg-emerald-950/30 border border-emerald-500/10 rounded-xl p-5 mb-6 relative overflow-hidden">
                                    <span className="material-symbols-outlined absolute top-2 right-2 text-emerald-500/10 text-4xl">auto_awesome</span>
                                    <h3 className="text-[10px] font-bold text-gold uppercase tracking-widest mb-2">{t.prophetic_insight}</h3>
                                    <p className="text-sm text-gray-300 italic font-serif leading-relaxed">"{result.propheticInsight}"</p>
                                </div>

                                {/* Action */}
                                <div className="flex flex-col gap-2.5">
                                    <button
                                        onClick={handleAskDoctor}
                                        className="w-full py-4 rounded-xl bg-blue-900/20 border border-blue-500/30 hover:bg-blue-900/40 text-blue-300 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined text-base">medical_services</span>
                                        {t.discuss_doctor || 'Discuss with Doctor AI'}
                                    </button>
                                    <button
                                        onClick={() => setResult(null)}
                                        className="w-full py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase tracking-widest transition-all"
                                    >
                                        {t.scan_new}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Health;