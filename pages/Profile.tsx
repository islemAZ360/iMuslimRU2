import * as React from 'react';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { setApiKey as syncGeminiKey } from '../services/geminiService';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Profile: React.FC = () => {
    const { settings, updateSettings, profile, updateProfile, t, location: userLocation } = useUser();
    const { setLanguage } = useLanguage();
    const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
    const navigate = useNavigate();

    // Local state for form inputs to avoid excessive context updates
    const [formData, setFormData] = useState(profile);
    const [saved, setSaved] = useState(false);
    
    // Sync formData when profile loads from local storage
    React.useEffect(() => {
        setFormData(profile);
    }, [profile]);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                updateProfile({ ...profile, avatar: base64String }); // Immediate update to context for instant feedback
                setFormData(prev => ({ ...prev, avatar: base64String }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = () => {
        const dataToSave = { ...formData };
        
        // Clean up arrays before saving
        if (typeof dataToSave.allergies === 'string') {
            dataToSave.allergies = (dataToSave.allergies as string).split(',').map(s => s.trim()).filter(Boolean);
        }
        if (typeof dataToSave.diseases === 'string') {
            dataToSave.diseases = (dataToSave.diseases as string).split(',').map(s => s.trim()).filter(Boolean);
        }
        if (typeof dataToSave.medications === 'string') {
            dataToSave.medications = (dataToSave.medications as string).split(',').map(s => s.trim()).filter(Boolean);
        }

        updateProfile(dataToSave);
        // Sync API key to geminiService so it takes effect immediately
        if (formData.apiKey && formData.apiKey.length > 10) {
            syncGeminiKey(formData.apiKey);
        }
        // Show saved confirmation
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out", error);
        }
    };

    return (
        <div className="min-h-screen w-full relative overflow-y-auto flex flex-col font-sans text-white bg-black pb-32 animate-in fade-in duration-500">
            {/* Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/30 via-black to-black"></div>
            </div>

            {/* Header with Border */}
            <div className="relative z-10 pt-14 pb-8 flex flex-col items-center">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    className="hidden"
                    accept="image/*"
                />
                <div
                    className="relative size-32 mb-5 group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="absolute inset-0 rounded-full border border-gold-400/30"></div>
                    <div className="absolute inset-2 rounded-full border border-gold/50 shadow-inner"></div>
                    <div className="absolute inset-3 rounded-full overflow-hidden border-2 border-gold-400 bg-emerald-black/80 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-300">
                        {/* Avatar / Initial */}
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-950 to-black flex items-center justify-center text-4xl font-serif text-gold-400">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : (profile.email ? profile.email.charAt(0).toUpperCase() : 'U')}
                            </div>
                        )}

                        {/* Overlay for "Change Photo" on hover */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="material-symbols-outlined text-gold-400 text-3xl">add_a_photo</span>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-white to-gold-400 mb-3">
                    {profile.name || 'User'}
                </h2>

                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gradient-to-r from-gold/20 via-gold/10 to-gold/20 border border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)] animate-pulse-glow">
                    <span className="material-symbols-outlined text-gold-400 text-sm">workspace_premium</span>
                    <span className="text-[10px] font-bold text-gold-400 uppercase tracking-[0.3em] drop-shadow-md">{t('premium_member') || 'PREMIUM MEMBER'}</span>
                </div>
            </div>

            {/* Tab Switcher */}
            <div className="relative z-10 px-6 mb-8 max-w-md mx-auto w-full">
                <div className="flex p-1.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-lg">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden ${activeTab === 'profile' ? 'text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'text-gray-500 hover:text-gold-400 hover:bg-white/5'}`}
                    >
                        {activeTab === 'profile' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-300 via-gold to-gold-600"></div>
                        )}
                        <span className="relative z-10">{t('my_data')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-3.5 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden ${activeTab === 'settings' ? 'text-black shadow-[0_0_20px_rgba(212,175,55,0.3)]' : 'text-gray-500 hover:text-gold-400 hover:bg-white/5'}`}
                    >
                        {activeTab === 'settings' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-300 via-gold to-gold-600"></div>
                        )}
                        <span className="relative z-10">{t('app_settings')}</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="relative z-10 px-4 md:px-6 flex-1 max-w-2xl mx-auto w-full">
                <div className="bg-emerald-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-8 relative overflow-hidden">
                    {/* ---------------- PROFILE TAB ---------------- */}
                    {activeTab === 'profile' && (
                        <div className="space-y-5">
                            <div className="space-y-5">
                                {/* Identity Card */}
                                <div className="relative rounded-2xl bg-gradient-to-br from-emerald-950/40 via-black to-black border border-white/10 p-6 overflow-hidden shadow-lg">
                                    <div className="relative z-10">
                                        {/* Card Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="size-12 rounded-xl bg-gradient-to-br from-gold-500/10 to-black border border-gold-500/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-gold-500 text-2xl">fingerprint</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-serif font-bold text-white tracking-wide">Identity Card</h3>
                                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mt-0.5">Personal Biometrics</p>
                                                </div>
                                            </div>
                                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400 font-bold tracking-widest">
                                                ID: {profile.userId?.substring(0, 8) || 'USER-01'}
                                            </div>
                                        </div>

                                        {/* Inputs Grid - Redesigned with Internal Labels */}
                                        <div className="space-y-5">
                                            {/* Name Field */}
                                            <div className="relative group/input bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold-400 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                                                <label className="absolute top-3 left-5 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-500 transition-colors">
                                                    {t('display_name')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name || ''}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-white/20 focus:outline-none focus:ring-0 border-none font-medium text-sm tracking-wide"
                                                    placeholder="Enter your name"
                                                    autoComplete="off"
                                                />
                                                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-gold-500 transition-colors">person</span>
                                            </div>

                                            {/* Email Field */}
                                            <div className="relative group/input bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold-400 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                                                <label className="absolute top-3 left-5 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-500 transition-colors">
                                                    {t('email')}
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email || ''}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-white/20 focus:outline-none focus:ring-0 border-none font-medium text-sm tracking-wide"
                                                    placeholder="Enter your email"
                                                    autoComplete="off"
                                                />
                                                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-gold-500 transition-colors">mail</span>
                                            </div>

                                            {/* Gender Custom Toggle */}
                                            <div className="relative bg-white/5 border border-white/10 rounded-2xl p-2 pt-7 flex gap-2">
                                                <label className="absolute top-2 left-4 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none">
                                                    {t('gender')}
                                                </label>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, gender: 'male' })}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                                        formData.gender === 'male'
                                                            ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                                            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">man</span>
                                                    {t('male')}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, gender: 'female' })}
                                                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                                                        formData.gender === 'female'
                                                            ? 'bg-gold-500 text-black shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                                                            : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                                    }`}
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">woman</span>
                                                    {t('female')}
                                                </button>
                                            </div>

                                            {/* Metrics Row */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Weight */}
                                                <div className="relative group/input bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold-400 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-500 transition-colors">
                                                        {t('weight')}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.weight || ''}
                                                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-white/20 focus:outline-none focus:ring-0 border-none font-mono text-sm tracking-wide"
                                                        placeholder="00"
                                                        autoComplete="off"
                                                    />
                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 uppercase">kg</span>
                                                </div>

                                                {/* Height */}
                                                <div className="relative group/input bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold-400 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-500 transition-colors">
                                                        {t('height')}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.height || ''}
                                                        onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-white/20 focus:outline-none focus:ring-0 border-none font-mono text-sm tracking-wide"
                                                        placeholder="000"
                                                        autoComplete="off"
                                                    />
                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 uppercase">cm</span>
                                                </div>
                                            </div>

                                            {/* Medical Logic - Allergies & Diseases */}
                                            <div className="space-y-4">
                                                {/* Allergies */}
                                                <div className="relative group/input bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold-400 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-500 transition-colors">
                                                        {t('allergies_optional')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : (formData.allergies || '')}
                                                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value as any })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-white/20 focus:outline-none focus:ring-0 border-none font-medium text-sm tracking-wide"
                                                        placeholder={t('allergies_placeholder')}
                                                        autoComplete="off"
                                                    />
                                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-gold-500 transition-colors">warning</span>
                                                </div>

                                                {/* Chronic Diseases */}
                                                <div className="relative group/input bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold-400 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-500 transition-colors">
                                                        {t('diseases_optional')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={Array.isArray(formData.diseases) ? formData.diseases.join(', ') : (formData.diseases || '')}
                                                        onChange={(e) => setFormData({ ...formData, diseases: e.target.value as any })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-white/20 focus:outline-none focus:ring-0 border-none font-medium text-sm tracking-wide"
                                                        placeholder={t('diseases_placeholder')}
                                                        autoComplete="off"
                                                    />
                                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-gold-500 transition-colors">medical_services</span>
                                                </div>

                                                {/* Medications */}
                                                <div className="relative group/input bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold-400 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-500 transition-colors">
                                                        {t('medications_optional')}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={Array.isArray(formData.medications) ? formData.medications.join(', ') : (formData.medications || '')}
                                                        onChange={(e) => setFormData({ ...formData, medications: e.target.value as any })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-white/20 focus:outline-none focus:ring-0 border-none font-medium text-sm tracking-wide"
                                                        placeholder={t('medications_placeholder')}
                                                        autoComplete="off"
                                                    />
                                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-gold-500 transition-colors">pill</span>
                                                </div>
                                            </div>

                                            {/* API Key Field */}
                                            <div className="flex flex-col">
                                                <div className="relative group/input bg-white/5 border border-white/10 rounded-2xl focus-within:border-gold-400 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-gold-400/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-400 transition-colors">
                                                        {t('api_key')}
                                                    </label>
                                                    <input
                                                        type="password"
                                                        value={formData.apiKey || ''}
                                                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-white/20 focus:outline-none focus:ring-0 border-none font-mono text-xs tracking-wide"
                                                        placeholder={t('api_key_placeholder')}
                                                        autoComplete="off"
                                                    />
                                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-gold-500 transition-colors">key</span>
                                                </div>
                                                <div className="text-left mt-2 pl-2">
                                                    <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-[10px] text-emerald-400/80 hover:text-emerald-300 underline font-bold tracking-wide">
                                                        Get Free API Key from OpenRouter.ai
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Action */}
                                <button
                                    onClick={handleSaveProfile}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-900/40 via-gold-900/20 to-gold-900/40 border border-gold-500/30 text-gold-400 font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-gold-500/10 hover:border-gold-500/60 hover:text-gold-400 active:scale-[0.98] transition-all mb-4"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <span className="material-symbols-outlined text-lg">{saved ? 'check_circle' : 'save'}</span>
                                        {saved ? 'Saved Successfully!' : t('save_changes')}
                                    </span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ---------------- SETTINGS TAB ---------------- */}
                    {activeTab === 'settings' && (
                        <div className="space-y-5">

                            {/* Ramadan Mode Toggle */}
                            <div className="bg-gradient-to-r from-emerald-900/40 to-black border border-gold/30 rounded-2xl p-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`size-12 rounded-full border flex items-center justify-center transition-colors ${settings.ramadanMode ? 'bg-gold/20 border-gold text-gold' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                        <span className="material-symbols-outlined text-2xl">mosque</span>
                                    </div>
                                    <div>
                                        <h3 className={`text-sm font-bold uppercase tracking-wider ${settings.ramadanMode ? 'text-gold' : 'text-gray-300'}`}>Ramadan Mode</h3>
                                        <p className="text-[10px] text-gray-500 font-medium">Enable special features & countdowns</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => updateSettings({ ramadanMode: !settings.ramadanMode })}
                                    className={`relative w-14 h-8 rounded-full transition-colors border ${settings.ramadanMode ? 'bg-gold/20 border-gold' : 'bg-black/40 border-white/10'}`}
                                >
                                    <div className={`absolute top-1/2 -translate-y-1/2 size-6 rounded-full transition-all duration-300 ${settings.ramadanMode ? 'left-[calc(100%-1.75rem)] bg-gold' : 'left-1 bg-gray-500'}`}></div>
                                </button>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6 opacity-50"></div>

                            {/* Language Section - Enhanced */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gold-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2 opacity-80">
                                    <span className="material-symbols-outlined text-sm">translate</span>
                                    {t('language')}
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { code: 'en', label: 'English', native: 'English' },
                                        { code: 'ar', label: 'Arabic', native: 'العربية' },
                                        { code: 'ru', label: 'Russian', native: 'Русский' }
                                    ].map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => {
                                                updateSettings({ language: lang.code as any });
                                                setLanguage(lang.code as any);
                                            }}
                                            className={`relative rounded-xl p-4 border transition-all duration-300 ${settings.language === lang.code
                                                ? 'bg-gradient-to-r from-gold/20 to-gold/5 border-gold'
                                                : 'bg-black/40 border-white/5 hover:border-gold/30 hover:bg-black/60'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-10 rounded-full flex items-center justify-center font-bold text-xs border ${settings.language === lang.code ? 'bg-gold text-black border-gold' : 'bg-white/5 text-gray-400 border-white/10'
                                                        }`}>
                                                        {lang.code.toUpperCase()}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className={`text-sm font-bold ${settings.language === lang.code ? 'text-gold-400' : 'text-gray-300'}`}>
                                                            {lang.native}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{lang.label}</p>
                                                    </div>
                                                </div>
                                                {settings.language === lang.code && (
                                                    <span className="material-symbols-outlined text-gold-400">check_circle</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 opacity-50"></div>

                            {/* Location Info (Read Only) */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gold-400 uppercase tracking-[0.3em] ml-2 flex items-center gap-2 opacity-80">
                                    <span className="material-symbols-outlined text-sm">location_on</span>
                                    {t('location')}
                                </h3>
                                <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between group hover:border-gold/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                                            <span className="material-symbols-outlined text-lg">my_location</span>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white tracking-wide">
                                                {userLocation?.city || 'Unknown City'}, {userLocation?.country || 'Unknown Country'}
                                            </p>
                                            <p className="text-[9px] text-emerald-500/60 font-mono mt-0.5 tracking-wider">
                                                {userLocation?.lat ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Waiting for GPS...'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className="text-[8px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded border border-emerald-500/20 tracking-widest uppercase">
                                            AUTO
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 opacity-50"></div>

                            {auth.currentUser && (
                                <button onClick={handleSignOut} className="w-full py-4 mb-4 rounded-xl border border-gold/30 bg-gradient-to-r from-gold/10 via-gold/20 to-gold/10 text-gold-400 font-bold text-[10px] tracking-[0.5em] uppercase hover:bg-gold/30 transition-all flex items-center justify-center gap-3">
                                    <span className="material-symbols-outlined text-lg">logout</span>
                                    SIGN OUT
                                </button>
                            )}

                            <button className="w-full py-4 rounded-xl border border-red-900/30 bg-gradient-to-r from-red-900/10 via-red-900/20 to-red-900/10 text-red-400 font-bold text-[10px] tracking-[0.5em] uppercase hover:bg-red-900/30 hover:border-red-500/50 hover:text-red-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)] transition-all flex items-center justify-center gap-3">
                                <span className="material-symbols-outlined text-lg">delete_forever</span>
                                {t('clear_data')}
                            </button>

                            <div className="pt-6 flex flex-col items-center gap-2 opacity-30">
                                <p className="text-[9px] text-gold-400 text-center font-mono tracking-[0.4em] uppercase">
                                    iMuslimRu v1.0.0
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
