import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { saveScanResult, getScanHistory, ScannedItem } from '../services/trackingService';
import { analyzeImage, hasValidApiKey, getApiKey, setApiKey } from '../services/geminiService';

const Scan: React.FC = () => {
    const navigate = useNavigate();
    const { profile, settings, t } = useUser();

    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [historyItems, setHistoryItems] = useState<ScannedItem[]>([]);
    const [lastImage, setLastImage] = useState<string | null>(null);
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showKeySetup, setShowKeySetup] = useState(false);
    const [apiKeyInput, setApiKeyInput] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Network status
    useEffect(() => {
        const onOnline = () => setIsOnline(true);
        const onOffline = () => setIsOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    // Load history when modal opens
    useEffect(() => {
        if (showHistory) {
            getScanHistory().then(setHistoryItems);
        }
    }, [showHistory]);

    // Proactively request camera permission on mount
    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(err => {
                console.log("Camera permission denied or dismissed:", err);
            });
    }, []);

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

    const handleSaveApiKey = () => {
        const key = apiKeyInput.trim();
        if (key.length > 10) {
            setApiKey(key);
            setShowKeySetup(false);
        }
    };

    const runAnalysis = async (base64Data: string) => {
        if (!hasValidApiKey()) {
            setShowKeySetup(true);
            return;
        }

        if (!isOnline) {
            setResult({
                name: "No Internet",
                status: "Unknown",
                reason: "No internet connection. Scanning requires an active internet connection.",
                origin: "?",
                ingredients: [],
                alternatives: []
            });
            return;
        }

        setScanning(true);
        setResult(null);

        try {
            const prompt = `
                Analyze this product image. Return a valid JSON object ONLY (no markdown formatting).
                IMPORTANT: You MUST provide all text (name, category, reason, origin, ingredients, alternatives) in this language code: ${settings.language || 'en'}.
                Fields:
                - name: string (Product Name, e.g. "HARIBO GOLDBEARS")
                - category: string (e.g. "GUMMY CANDY")
                - weight: string (e.g. "200G")
                - status: "Halal" | "Haram" | "Mushbooh" | "Boycott"
                - reason: string (Short explanation)
                - origin: string (Country of origin, e.g. "Germany / IL")
                - ingredients: string[] (List of key ingredients like Pork Gelatin)
                - alternatives: string[] (List of 2-3 safe alternatives)
                
                CRITICAL CHECKS:
                1. Check ingredients for Pork, Alcohol, Gelatin (unless plant-based), E120.
                2. Check BOYCOTT list (Israel-supporting brands: Starbucks, McDonald's, Coca-Cola, Pepsi, Nestle, Danone, etc.). If it's a boycott brand, set status to 'Boycott'.
            `;

            const aiResponse = await analyzeImage(base64Data, prompt);

            if (aiResponse) {
                const cleaned = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleaned);
                setResult(parsed);

                // Save scan result to history (excluding network/API errors handled later)
                if (parsed.status !== 'Unknown') {
                    saveScanResult({
                        name: parsed.name,
                        status: parsed.status,
                        reason: parsed.reason,
                        ingredients: parsed.ingredients,
                        origin: parsed.origin
                    });
                }

            } else {
                throw new Error("No response from AI");
            }
        } catch (e: any) {
            console.error(e);
            const errMsg = String(e?.message || e || '');
            
            let friendlyReason = 'Analysis failed. Check your internet connection and try again.';
            let friendlyName = 'Analysis Failed';
            
            if (errMsg.includes('429') || errMsg.includes('quota')) {
                const keySnippet = getApiKey().slice(-4);
                friendlyName = 'Rate Limit Reached';
                friendlyReason = `You have exceeded the API quota for key ending in ...${keySnippet}. If this is a paid key, make sure you enabled the generative language API on a valid billing project.`;
            } else if (errMsg.includes('401') || errMsg.includes('API key')) {
                friendlyName = 'Invalid API Key';
                friendlyReason = 'Your Gemini API key is invalid or expired. Please update it from the settings above.';
            } else if (errMsg.includes('network') || errMsg.includes('fetch')) {
                friendlyName = 'Network Error';
                friendlyReason = 'Could not connect to Gemini AI. Check your internet connection and try again.';
            }
            
            setResult({
                name: friendlyName,
                status: "Unknown",
                reason: friendlyReason,
                origin: "?",
                ingredients: [],
                alternatives: []
            });
        } finally {
            setScanning(false);
        }
    };

    const handleScanClick = () => {
        if (fileInputRef.current) fileInputRef.current.click();
    };

    const handleAskSheikh = async () => {
        if (!result || !lastImage) return;
        try {
            const { createScanConversation } = await import('../services/aiChatService');
            const conv = await createScanConversation(lastImage, result);
            navigate('/ai', { state: { conversationId: conv.id } });
        } catch (error) {
            console.error('Failed to create Sheikh AI conversation:', error);
        }
    };

    return (
        <div className="h-screen w-full bg-[#00100d] relative overflow-hidden font-sans text-white selection:bg-gold-500/30">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" capture="environment" />

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#022c22] via-[#00100d] to-[#000000]"></div>
            </div>

            {/* Header */}
            <div className="absolute top-0 left-0 w-full z-20 pt-14 pb-6 flex flex-col items-center justify-center pointer-events-none">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold-400/50"></div>
                    <h1 className="text-2xl font-royal font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-[#F3EACB] via-[#D4AF37] to-[#B48E26]">
                        {settings.language === 'ar' ? 'الماسح الذكي' : 'HALAL SCANNER'}
                    </h1>
                    <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold-400/50"></div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-400/80 font-medium">{settings.language === 'ar' ? 'مركز التحليل الشامل' : 'AI Scanner Hub'}</p>

                {/* Back Button (Interactive) */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-12 left-6 w-10 h-10 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:bg-emerald-900/40 hover:text-emerald-300 transition-all pointer-events-auto"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
            </div>

            {/* AI Status */}
            <div className="absolute top-40 left-0 right-0 z-20 flex flex-col items-center gap-2 px-6 pointer-events-none">
                <div className="w-full max-w-xs rounded-2xl border border-gold-500/20 bg-black/60 backdrop-blur-md p-3 pointer-events-auto">
                    {showKeySetup ? (
                        <div>
                            <p className="text-[9px] text-gold-200 text-center leading-relaxed mb-2">
                                Enter your Gemini API key to get started
                            </p>
                            <div className="flex gap-2">
                                <input
                                    value={apiKeyInput}
                                    onChange={e => setApiKeyInput(e.target.value)}
                                    placeholder="AIza..."
                                    className="flex-1 min-w-0 bg-black/50 border border-white/10 rounded-lg px-2 py-1.5 text-[10px] text-white placeholder-gray-600 focus:outline-none focus:border-gold/40"
                                />
                                <button
                                    onClick={handleSaveApiKey}
                                    disabled={apiKeyInput.trim().length <= 10}
                                    className="px-3 py-1.5 rounded-lg bg-gold-500/20 border border-gold-500/40 text-gold-200 text-[9px] font-bold uppercase hover:bg-gold-500/30 active:scale-95 transition-all disabled:opacity-40"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                            <span className={`size-2 rounded-full ${isOnline && hasValidApiKey() ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                            <span className={isOnline && hasValidApiKey() ? 'text-emerald-300' : 'text-red-300'}>
                                {!hasValidApiKey()
                                    ? t('api_required')
                                    : isOnline
                                        ? t('ai_ready')
                                        : t('ai_offline')}
                            </span>
                            {!hasValidApiKey() && (
                                <button
                                    onClick={() => setShowKeySetup(true)}
                                    className="ml-2 px-2 py-0.5 rounded bg-gold/20 text-gold-200 text-[8px] font-bold uppercase hover:bg-gold/30 transition-colors"
                                >
                                    {t('setup')}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Centerpiece: Golden Mandala & Scanner */}
            <div className={`absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-700 ${result || showHistory ? 'opacity-0 scale-90 translate-y-[-10%] pointer-events-none' : 'opacity-100 scale-100'}`}>
                <div className="relative w-[260px] h-[260px] flex items-center justify-center">

                    {/* Rotating Mandala Layers */}
                    <div className="absolute inset-0 animate-[spin_60s_linear_infinite]">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-gold-500/15">
                            <path d="M50 0 L55 40 L50 50 L45 40 Z" fill="currentColor" />
                            <path d="M50 100 L55 60 L50 50 L45 60 Z" fill="currentColor" />
                            <path d="M0 50 L40 45 L50 50 L40 55 Z" fill="currentColor" />
                            <path d="M100 50 L60 45 L50 50 L60 55 Z" fill="currentColor" />
                            <path d="M14.6 14.6 L42 42 L50 50 L42 42 Z" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M85.4 14.6 L58 42 L50 50 L58 42 Z" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M85.4 85.4 L58 58 L50 50 L58 58 Z" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M14.6 85.4 L42 58 L50 50 L42 58 Z" stroke="currentColor" strokeWidth="0.5" />
                        </svg>
                    </div>

                    {/* Main Gold Ring */}
                    <div className="absolute inset-12 rounded-full border-2 border-gold-400/50"></div>

                    {/* Inner Dashed Ring */}
                    <div className="absolute inset-16 rounded-full border border-dashed border-gold-200/40 animate-[spin_30s_linear_infinite]"></div>

                    {/* Scanner Rectangles (Frame) */}
                    <div className="absolute inset-0 p-8 pointer-events-none">
                        <div className="w-full h-full border border-white/10 rounded-2xl relative">
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-7 h-7 border-t-2 border-l-2 border-gold-400 rounded-tl-xl"></div>
                            <div className="absolute top-0 right-0 w-7 h-7 border-t-2 border-r-2 border-gold-400 rounded-tr-xl"></div>
                            <div className="absolute bottom-0 left-0 w-7 h-7 border-b-2 border-l-2 border-gold-400 rounded-bl-xl"></div>
                            <div className="absolute bottom-0 right-0 w-7 h-7 border-b-2 border-r-2 border-gold-400 rounded-br-xl"></div>
                        </div>
                    </div>

                    {/* Scanning Beam (Active) */}
                    {scanning && (
                        <div className="absolute inset-16 overflow-hidden rounded-full">
                            <div className="w-full h-1.5 bg-gradient-to-r from-transparent via-gold-300 to-transparent absolute top-0 animate-[scan_1.5s_ease-in-out_infinite]"></div>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-gold-bright text-[10px] font-bold uppercase tracking-widest animate-pulse bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-gold/20 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
                                    {settings.language === 'ar' ? 'جاري التحليل...' : 'Analyzing...'}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Center Point */}
                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>

                {/* Align Code Button */}
                <div className="mt-10 flex justify-center">
                    <button
                        onClick={handleScanClick}
                        disabled={scanning}
                        className={`relative group px-8 py-3 bg-gradient-to-r from-[#B48E26] via-[#D4AF37] to-[#B48E26] text-black font-royal font-bold tracking-[0.15em] text-sm rounded-full shadow-md transition-all ${scanning ? 'opacity-50' : 'active:scale-95'}`}
                    >
                        <span className="relative z-10">{scanning ? (settings.language === 'ar' ? 'يرجى الانتظار' : 'SCANNING...') : (settings.language === 'ar' ? 'امسح المنتج' : 'ALIGN CODE')}</span>
                    </button>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className={`absolute bottom-0 left-0 w-full z-20 pb-10 px-8 flex items-center justify-between transition-all duration-700 ${result || showHistory ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                {/* Upload Button */}
                <div onClick={handleScanClick} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#053B30] to-[#01201A] border border-gold-500/20 flex items-center justify-center shadow-md transition-all group-active:scale-95">
                        <span className="material-symbols-outlined text-gold-200/80 text-xl">image</span>
                    </div>
                    <span className="text-[10px] font-bold text-gold-500/70 tracking-widest uppercase">{settings.language === 'ar' ? 'رفع صورة' : 'UPLOAD'}</span>
                </div>

                {/* History Button */}
                <div onClick={() => setShowHistory(true)} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#053B30] to-[#01201A] border border-gold-500/20 flex items-center justify-center shadow-md transition-all group-active:scale-95">
                        <span className="material-symbols-outlined text-gold-200/80 text-xl">history</span>
                    </div>
                    <span className="text-[10px] font-bold text-gold-500/70 tracking-widest uppercase">{settings.language === 'ar' ? 'السجل' : 'HISTORY'}</span>
                </div>
            </div>

            {/* Decorative Golden Footer Border */}
            <div className="absolute bottom-6 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent pointer-events-none"></div>

            {/* History Modal */}
            <div className={`fixed inset-0 z-50 max-w-md mx-auto bg-black/90 backdrop-blur-md transition-opacity duration-300 ${showHistory ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowHistory(false)}>
                <div className={`absolute bottom-0 left-0 w-full h-[85vh] bg-[#011c16] rounded-t-[40px] border-t border-gold-500/30 shadow-[0_-10px_60px_rgba(0,0,0,1)] transition-transform duration-500 cubic-bezier(0.2, 1, 0.3, 1) ${showHistory ? 'translate-y-0' : 'translate-y-full'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="w-12 h-1 bg-gold-900/50 rounded-full mx-auto mt-4 mb-8"></div>
                    <div className="px-8 flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-royal font-bold text-gold-100">{settings.language === 'ar' ? 'سجل العمليات' : 'Scan History'}</h2>
                        <button onClick={() => setShowHistory(false)} className="text-gold-500/60 hover:text-gold-300 text-xs font-bold uppercase tracking-widest">{settings.language === 'ar' ? 'إغلاق' : 'Close'}</button>
                    </div>
                    {/* History List */}
                    <div className="px-6 overflow-y-auto h-[calc(85vh-120px)] pb-10 space-y-3">
                        {historyItems.length > 0 ? (
                            historyItems.map((item, i) => (
                                <div key={i} className="bg-[#03221C] rounded-xl border border-white/5 p-4 flex items-center gap-4 hover:border-gold-500/20 transition-all">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white border border-white/10 ${item.status === 'Haram' ? 'bg-red-900/20 text-red-500' : 'bg-orange-900/20 text-orange-500'}`}>
                                        <span className="material-symbols-outlined text-lg">{item.status === 'Haram' ? 'block' : 'warning'}</span>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-gold-100/90 font-bold text-sm mb-0.5">{item.name}</h3>
                                        <p className="text-[10px] text-white/40 uppercase tracking-wide">{item.origin || 'Unknown'}</p>
                                    </div>
                                    <span className={`text-[9px] font-bold px-2 py-1 rounded border ${item.status === 'Boycott' ? 'border-red-600 bg-red-950 text-red-500' : item.status === 'Haram' ? 'border-red-500/30 text-red-400' : 'border-orange-500/30 text-orange-400'}`}>{item.status}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-white/20">{settings.language === 'ar' ? 'لا يوجد سجل.' : 'No history found.'}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Result Card */}
            <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full z-40 flex justify-center pb-4 transition-transform duration-500 ${result ? 'translate-y-0' : 'translate-y-[120%]'}`}>
                <div className="w-[95%] max-w-md bg-[#001812] rounded-3xl border border-gold-500/30 shadow-2xl overflow-hidden relative">
                    {/* Content */}
                    <div className="p-6 relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h2 className="text-2xl font-royal font-bold text-gold-100 leading-tight mb-1">
                                    {result?.name || (settings.language === 'ar' ? 'منتج غير معروف' : 'Unknown Item')}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <div className="h-[1px] w-5 bg-gold-500/50"></div>
                                    <span className="text-xs font-bold text-gold-500/70 uppercase tracking-widest">{result?.category || (settings.language === 'ar' ? 'منتج' : 'Product')}</span>
                                </div>
                            </div>
                            {/* Status Stamp */}
                            <div className={`px-3 py-1.5 border-2 rounded-lg ${result?.status === 'Boycott' ? 'border-red-600 bg-red-950 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]' : result?.status === 'Haram' ? 'border-red-500/60 bg-red-900/10 text-red-500' :
                                result?.status === 'Halal' ? 'border-emerald-500/60 bg-emerald-900/10 text-emerald-500' :
                                    'border-orange-500/60 bg-orange-900/10 text-orange-500'
                                }`}>
                                <div className="text-center">
                                    <span className="block text-[8px] uppercase tracking-widest opacity-80">{t('status')}</span>
                                    <span className="block text-xs font-black font-royal">{result?.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Box */}
                        <div className="bg-[#000]/30 rounded-xl p-4 border border-white/5 mb-5">
                            <p className="text-sm font-medium text-emerald-100/80 leading-relaxed">
                                {result?.reason}
                            </p>
                            {/* Ingredients Tag */}
                            {result?.ingredients?.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {result.ingredients.map((ing: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-red-900/20 border border-red-500/20 rounded text-[10px] text-red-300 font-bold uppercase">{ing}</span>
                                    ))}
                                </div>
                            )}
                            
                            {/* Alternatives Box */}
                            {result?.alternatives?.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-xs">verified</span>
                                        {settings.language === 'ar' ? 'البدائل الآمنة' : 'Safe Alternatives'}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {result.alternatives.map((alt: string, i: number) => (
                                            <span key={i} className="px-2.5 py-1.5 bg-emerald-900/20 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-100 font-medium">{alt}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Close Action */}
                        <div className="flex flex-col gap-2.5">
                            <button
                                onClick={handleAskSheikh}
                                className="w-full py-3.5 bg-gold/15 hover:bg-gold/25 border border-gold/40 text-gold-200 font-bold tracking-widest text-xs uppercase rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span className="material-symbols-outlined text-base">auto_awesome</span>
                                {t('discuss_sheikh')}
                            </button>
                            <button onClick={() => setResult(null)} className="w-full py-3.5 bg-gradient-to-r from-[#064E3B] to-[#065F46] hover:from-[#065F46] hover:to-[#047857] text-emerald-100 font-bold tracking-widest text-xs uppercase rounded-xl border border-emerald-400/20 transition-all">
                                {t('scan_another')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scan;
