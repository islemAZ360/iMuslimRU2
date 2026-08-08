import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
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
    const language = settings.language || 'en';
    const t = translations[language as keyof typeof translations] || translations.en;

    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [lastImage, setLastImage] = useState<string | null>(null);

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
                IMPORTANT: You MUST write your analysis (foodName, verdict, ingredients names, healthImpact, propheticInsight, burnExercises) entirely in ${targetLang}.
                Return a valid JSON object ONLY.
                Fields:
                {
                    "foodName": "Name of the item (food or medicine)",
                    "calories": Number (use 0 for medicine),
                    "grade": "A/B/C/D",
                    "verdict": "Short summary",
                    "tags": ["Nutrient-Dense", "Medical", "Prophetic", etc],
                    "macros": {"protein": "Xg", "carbs": "Xg", "fats": "Xg"} (use "0g" for medicine),
                    "ingredients": [{"name": "Ingredient/Active Substance", "value": "Amount/Detail", "status": "good/warning/bad"}],
                    "burnExercises": ["15 mins running", "30 mins walking"] (leave empty array for medicine or 0 calories),
                    "healthImpact": "Direct analysis on how this item affects the user given their diseases/allergies/medications. Flag warnings or dangerous interactions clearly.",
                    "propheticInsight": "A short spiritual or health insight based on Prophetic Medicine (Tib An-Nabawi) related to this item, if applicable."
                }
            `;
            const aiResponse = await analyzeImage(base64Data, prompt);
            if (aiResponse) {
                const cleaned = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsedResult = JSON.parse(cleaned);
                setResult(parsedResult);

                // Update Global Health Stats
                updateHealthStats({
                    calories: parsedResult.calories,
                    grade: parsedResult.grade,
                    lastScanDate: new Date().toISOString(),
                });
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
            navigate('/ai', { state: { conversationId: conv.id } });
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
                                        {/* Core pulsing background */}
                                        <div className="absolute inset-0 bg-emerald-500/10 animate-pulse"></div>
                                        {/* Spinning tech border */}
                                        <div className="absolute inset-0 rounded-full border-[3px] border-emerald-900/30 border-t-emerald-400 animate-spin-slow"></div>
                                        {/* The scanning laser */}
                                        <div className="w-[120%] h-0.5 bg-emerald-400 absolute -left-[10%] animate-scan shadow-[0_0_15px_rgba(52,211,153,0.9)] z-20"></div>
                                        {/* Scanning text */}
                                        <div className="relative z-20 flex flex-col items-center">
                                            <span className="material-symbols-outlined text-3xl text-emerald-400 mb-1 animate-pulse">troubleshoot</span>
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.3em] animate-pulse">{t.analyzing || 'Scanning'}</span>
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
                                Align Food for Molecular Scan
                            </h2>
                            <p className="text-xs text-white/30 max-w-[200px] mx-auto leading-relaxed">
                                AI-powered nutritional & prophetic analysis engine
                            </p>
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
                                <p className="text-sm text-emerald-100/70 font-medium leading-relaxed mb-5">{result.verdict}</p>

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

                                {/* Health Impact & Exercises */}
                                <div className="space-y-4 mb-6">
                                    <div className="bg-blue-950/20 border border-blue-500/20 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2 text-blue-400">
                                            <span className="material-symbols-outlined text-[16px]">monitor_heart</span>
                                            <h3 className="text-[10px] font-bold uppercase tracking-widest">Health Impact</h3>
                                        </div>
                                        <p className="text-sm text-gray-300 leading-relaxed">{result.healthImpact}</p>
                                    </div>

                                    {result.burnExercises && result.burnExercises.length > 0 && (
                                        <div className="bg-orange-950/20 border border-orange-500/20 rounded-xl p-4">
                                            <div className="flex items-center gap-2 mb-2 text-orange-400">
                                                <span className="material-symbols-outlined text-[16px]">fitness_center</span>
                                                <h3 className="text-[10px] font-bold uppercase tracking-widest">Required Exercise to Burn ({result.calories} kcal)</h3>
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
                                        Discuss with Doctor AI
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