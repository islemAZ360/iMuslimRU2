import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../services/geminiService';
import { useUser } from '../context/UserContext';
import { saveScanResult, getScanHistory, ScannedItem } from '../services/trackingService';

const Scan: React.FC = () => {
    const navigate = useNavigate();
    const { profile } = useUser();

    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [historyItems, setHistoryItems] = useState<ScannedItem[]>([]);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load history when modal opens
    useEffect(() => {
        if (showHistory) {
            getScanHistory().then(setHistoryItems);
        }
    }, [showHistory]);

    // Proactively request camera permission on mount
    useEffect(() => {
        // This forces the browser to show the "Allow Camera" prompt if not already granted.
        // We don't actually need the stream here, just the permission.
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                // Permission granted. Stop the stream immediately to release the camera.
                stream.getTracks().forEach(track => track.stop());
            })
            .catch(err => {
                console.log("Camera permission denied or dismissed:", err);
                // We can't force it, but at least we asked.
            });
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                const base64Data = base64String.split(',')[1];
                runAnalysis(base64Data);
            };
            reader.readAsDataURL(file);
        }
    };

    const runAnalysis = async (base64Data: string) => {
        setScanning(true);
        setResult(null);
        try {
            const prompt = `
                Analyze this product image. Return a valid JSON object ONLY (no markdown formatting).
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

            const aiResponse = await analyzeImage(base64Data, prompt, profile.apiKey);

            if (aiResponse) {
                const cleaned = aiResponse.replace(/```json/g, '').replace(/```/g, '').trim();
                const parsed = JSON.parse(cleaned);
                setResult(parsed);

                // SAVE TO FIREBASE IF NOT HALAL
                if (parsed.status !== 'Halal' && parsed.status !== 'Unknown') {
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
        } catch (e) {
            console.error(e);
            setResult({ // Fallback for demo/error
                name: "Scan Failed",
                status: "Unknown",
                reason: "Could not analyze image. Please try again.",
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

    return (
        <div className="h-screen w-full bg-[#00100d] relative overflow-hidden font-sans text-white selection:bg-gold-500/30">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" capture="environment" />

            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#022c22] via-[#00100d] to-[#000000]"></div>
                {/* Gold Particles (CSS) */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
            </div>

            {/* Header: DIVINE MASTERPIECE */}
            <div className="absolute top-0 left-0 w-full z-20 pt-14 pb-6 flex flex-col items-center justify-center pointer-events-none">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold-400/50"></div>
                    <h1 className="text-3xl font-royal font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-[#F3EACB] via-[#D4AF37] to-[#B48E26] drop-shadow-[0_2px_10px_rgba(212,175,55,0.3)]">
                        DIVINE MASTERPIECE
                    </h1>
                    <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-gold-400/50"></div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-400/80 font-medium">AI Scanner Hub</p>

                {/* Back Button (Interactive) */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-12 left-6 w-10 h-10 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm flex items-center justify-center text-white/60 hover:bg-emerald-900/40 hover:text-emerald-300 transition-all pointer-events-auto"
                >
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                </button>
            </div>

            {/* Centerpiece: Golden Mandala & Scanner */}
            <div className={`absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-700 ${result || showHistory ? 'opacity-0 scale-90 translate-y-[-10%] pointer-events-none' : 'opacity-100 scale-100'}`}>
                <div className="relative w-[340px] h-[340px] flex items-center justify-center">

                    {/* Rotating Mandala Layers */}
                    {/* Layer 1: Outer Rays */}
                    <div className="absolute inset-0 animate-[spin_60s_linear_infinite]">
                        <svg viewBox="0 0 100 100" className="w-full h-full text-gold-500/20 drop-shadow-[0_0_10px_rgba(234,179,8,0.3)]">
                            <path d="M50 0 L55 40 L50 50 L45 40 Z" fill="currentColor" />
                            <path d="M50 100 L55 60 L50 50 L45 60 Z" fill="currentColor" />
                            <path d="M0 50 L40 45 L50 50 L40 55 Z" fill="currentColor" />
                            <path d="M100 50 L60 45 L50 50 L60 55 Z" fill="currentColor" />
                            {/* Diagonals */}
                            <path d="M14.6 14.6 L42 42 L50 50 L42 42 Z" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M85.4 14.6 L58 42 L50 50 L58 42 Z" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M85.4 85.4 L58 58 L50 50 L58 58 Z" stroke="currentColor" strokeWidth="0.5" />
                            <path d="M14.6 85.4 L42 58 L50 50 L42 58 Z" stroke="currentColor" strokeWidth="0.5" />
                        </svg>
                    </div>

                    {/* Layer 2: Intricate Geometric Circle */}
                    <div className="absolute inset-8 border-[1px] border-gold-500/30 rounded-full animate-[spin_40s_linear_infinite_reverse] flex items-center justify-center">
                        <div className="w-[90%] h-[90%] border-[1px] border-gold-500/20 rounded-full rotate-45"></div>
                        <div className="absolute w-full h-full border-t border-b border-gold-500/10"></div>
                        <div className="absolute w-full h-full border-l border-r border-gold-500/10"></div>
                    </div>

                    {/* Layer 3: Main Gold Ring */}
                    <div className="absolute inset-16 rounded-full border-[3px] border-gold-400/60 shadow-[0_0_20px_rgba(234,179,8,0.4)]"></div>

                    {/* Layer 4: Inner Dashed Ring */}
                    <div className="absolute inset-20 rounded-full border border-dashed border-gold-200/50 animate-[spin_20s_linear_infinite]"></div>

                    {/* Scanner Rectangles (Frame) */}
                    <div className="absolute inset-0 p-10 pointer-events-none">
                        <div className="w-full h-full border border-white/10 rounded-3xl relative">
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-400 rounded-tl-xl drop-shadow-[0_0_8px_gold]"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-400 rounded-tr-xl drop-shadow-[0_0_8px_gold]"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-400 rounded-bl-xl drop-shadow-[0_0_8px_gold]"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-400 rounded-br-xl drop-shadow-[0_0_8px_gold]"></div>
                        </div>
                    </div>

                    {/* Scanning Beam (Active) */}
                    {scanning && (
                        <div className="absolute inset-20 overflow-hidden rounded-full">
                            <div className="w-full h-2 bg-gradient-to-r from-transparent via-gold-300 to-transparent absolute top-0 animate-[scan_1.5s_ease-in-out_infinite] shadow-[0_0_20px_gold]"></div>
                        </div>
                    )}

                    {/* Center Point */}
                    <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white,0_0_20px_gold]"></div>
                </div>

                {/* Align Code Button */}
                <div className="mt-12 flex justify-center">
                    <button
                        onClick={handleScanClick}
                        className="relative group px-10 py-3 bg-gradient-to-r from-[#B48E26] via-[#D4AF37] to-[#B48E26] text-black font-royal font-bold tracking-[0.15em] text-sm rounded-full shadow-[0_5px_20px_rgba(212,175,55,0.3)] overflow-hidden transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="relative z-10">ALIGN CODE</span>
                        <div className="absolute inset-0 bg-white/30 skew-x-12 -translate-x-full group-hover:animate-[shimmer_1s_infinite]"></div>
                    </button>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className={`absolute bottom-0 left-0 w-full z-20 pb-10 px-8 flex items-center justify-between transition-all duration-700 ${result || showHistory ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
                {/* Upload Button */}
                <div onClick={handleScanClick} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#053B30] to-[#01201A] border border-gold-500/20 flex items-center justify-center shadow-lg group-hover:border-gold-500/60 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all">
                        <span className="material-symbols-outlined text-gold-200/80 text-xl group-hover:text-gold-100">image</span>
                    </div>
                    <span className="text-[10px] font-bold text-gold-500/70 tracking-widest uppercase">UPLOAD</span>
                </div>

                {/* History Button */}
                <div onClick={() => setShowHistory(true)} className="flex flex-col items-center gap-2 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#053B30] to-[#01201A] border border-gold-500/20 flex items-center justify-center shadow-lg group-hover:border-gold-500/60 group-hover:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all">
                        <span className="material-symbols-outlined text-gold-200/80 text-xl group-hover:text-gold-100">history</span>
                    </div>
                    <span className="text-[10px] font-bold text-gold-500/70 tracking-widest uppercase">HISTORY</span>
                </div>
            </div>

            {/* Decorative Golden Footer Border */}
            <div className="absolute bottom-6 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-gold-500/30 to-transparent pointer-events-none"></div>

            {/* History Modal */}
            <div className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-md transition-opacity duration-300 ${showHistory ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowHistory(false)}>
                <div className={`absolute bottom-0 left-0 w-full h-[85vh] bg-[#011c16] rounded-t-[40px] border-t border-gold-500/30 shadow-[0_-10px_60px_rgba(0,0,0,1)] transition-transform duration-500 cubic-bezier(0.2, 1, 0.3, 1) ${showHistory ? 'translate-y-0' : 'translate-y-full'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="w-12 h-1 bg-gold-900/50 rounded-full mx-auto mt-4 mb-8"></div>
                    <div className="px-8 flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-royal font-bold text-gold-100">Scan History</h2>
                        <button onClick={() => setShowHistory(false)} className="text-gold-500/60 hover:text-gold-300 text-xs font-bold uppercase tracking-widest">Close</button>
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
                                    <span className={`text-[9px] font-bold px-2 py-1 rounded border ${item.status === 'Haram' ? 'border-red-500/30 text-red-400' : 'border-orange-500/30 text-orange-400'}`}>{item.status}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-white/20">No history found.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Result Card: Divine Masterpiece Style */}
            <div className={`fixed bottom-0 left-0 w-full z-40 flex justify-center pb-6 perspective-[1000px] transition-transform duration-700 ${result ? 'translate-y-0' : 'translate-y-[120%]'}`}>
                <div className="w-[95%] max-w-md bg-[#001812] rounded-[2rem] border border-gold-500/40 shadow-[0_0_50px_rgba(0,0,0,0.8),inset_0_0_30px_rgba(234,179,8,0.05)] overflow-hidden relative">

                    {/* Ornate Corner Decorations */}
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-gold-500/30 rounded-tl-2xl"></div>
                    <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-500/30 rounded-tr-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-500/30 rounded-bl-2xl"></div>
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-gold-500/30 rounded-br-2xl"></div>

                    {/* Content */}
                    <div className="p-8 relative z-10">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-royal font-bold text-gold-100 leading-tight mb-2 drop-shadow-md">
                                    {result?.name || 'Unknown Item'}
                                </h2>
                                <div className="flex items-center gap-2">
                                    <div className="h-[1px] w-6 bg-gold-500/50"></div>
                                    <span className="text-xs font-bold text-gold-500/70 uppercase tracking-widest">{result?.category || 'Product'}</span>
                                </div>
                            </div>
                            {/* Status Stamp */}
                            <div className={`px-3 py-1.5 border-2 rounded-lg backdrop-blur-md ${result?.status === 'Haram' ? 'border-red-500/60 bg-red-900/10 text-red-500' :
                                result?.status === 'Halal' ? 'border-emerald-500/60 bg-emerald-900/10 text-emerald-500' :
                                    'border-orange-500/60 bg-orange-900/10 text-orange-500'
                                }`}>
                                <div className="text-center">
                                    <span className="block text-[8px] uppercase tracking-widest opacity-80">STATUS</span>
                                    <span className="block text-xs font-black font-royal">{result?.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* Analysis Box */}
                        <div className="bg-[#000]/30 rounded-xl p-5 border border-white/5 mb-6 relative">
                            <span className="material-symbols-outlined absolute top-4 left-4 text-gold-600/30 text-4xl -z-10">format_quote</span>
                            <p className="text-sm font-medium text-emerald-100/80 leading-relaxed pl-2 relative">
                                {result?.reason}
                            </p>
                            {/* Ingredients Tag */}
                            {result?.ingredients?.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {result.ingredients.map((ing: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-red-900/20 border border-red-500/20 rounded text-[10px] text-red-300 font-bold uppercase">{ing}</span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Close Action */}
                        <button onClick={() => setResult(null)} className="w-full py-3.5 bg-gradient-to-r from-[#064E3B] to-[#065F46] hover:from-[#065F46] hover:to-[#047857] text-emerald-100 font-bold tracking-widest text-xs uppercase rounded-xl border border-emerald-400/20 shadow-lg transition-all">
                            Scan Another
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Scan;