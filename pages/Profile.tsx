import * as React from 'react';
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { settings, updateSettings, profile, updateProfile, t, location: userLocation } = useUser();
    const [activeTab, setActiveTab] = useState<'profile' | 'settings'>('profile');
    const navigate = useNavigate();

    // Local state for form inputs to avoid excessive context updates
    const [formData, setFormData] = useState(profile);
    const [apiKey, setApiKey] = useState(profile.apiKey || '');
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
        updateProfile({ ...formData, apiKey });
        // Ideally show a toast
    };

    return (
        <div className="min-h-screen w-full relative overflow-hidden flex flex-col font-sans text-white bg-black pb-32 animate-in fade-in duration-1000">
            {/* Background - Divine Atmosphere */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-900/40 via-black to-black"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/5 blur-[120px]"></div>
            </div>

            {/* Header with Rotating Border */}
            <div className="relative z-10 pt-16 pb-10 flex flex-col items-center animate-in fade-in slide-in-from-top-6 duration-1000">
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    className="hidden"
                    accept="image/*"
                />
                <div
                    className="relative size-40 mb-6 group cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {/* Outer Rotating Halo */}
                    <div className="absolute inset-0 rounded-full border border-gold-bright/30 shadow-[0_0_30px_rgba(212,175,55,0.2)] animate-[spin-slow_15s_linear_infinite]"></div>
                    <div className="absolute inset-2 rounded-full border border-gold/50 shadow-inner"></div>
                    <div className="absolute inset-3 rounded-full overflow-hidden border-2 border-gold-bright bg-emerald-black/80 shadow-2xl divine-border group-hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center">
                        {/* Avatar / Initial */}
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-950 to-black flex items-center justify-center text-4xl font-serif text-gold-bright drop-shadow-md gold-glow">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : (profile.email ? profile.email.charAt(0).toUpperCase() : 'U')}
                            </div>
                        )}

                        {/* Overlay for "Change Photo" on hover */}
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="material-symbols-outlined text-gold-bright text-3xl">add_a_photo</span>
                        </div>
                    </div>
                    {/* Floating Glows */}
                    <div className="absolute -top-2 -right-2 size-8 bg-gold-bright/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 size-8 bg-emerald-500/20 rounded-full blur-xl animate-pulse delay-700"></div>
                </div>

                <h2 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-bright via-white to-gold-bright bg-[length:200%_auto] animate-[shimmer_4s_linear_infinite] drop-shadow-2xl mb-3">
                    {profile.name || 'User'}
                </h2>

                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gold/5 border border-gold/30 backdrop-blur-2xl shadow-gold-glow-sm">
                    <span className="material-symbols-outlined text-gold-bright text-sm animate-pulse">verified</span>
                    <span className="text-[10px] font-bold text-gold-bright uppercase tracking-[0.4em]">{t('premium_member') || 'PREMIUM MEMBER'}</span>
                </div>
            </div>

            {/* Tab Switcher - Premium Styling */}
            <div className="relative z-10 px-6 mb-8 max-w-md mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                <div className="flex p-1.5 rounded-[2rem] bg-emerald-black/60 border border-white/10 backdrop-blur-3xl shadow-3xl">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden group ${activeTab === 'profile' ? 'text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {activeTab === 'profile' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-gold-bright to-gold animate-in fade-in zoom-in-95 duration-500"></div>
                        )}
                        <span className="relative z-10">{t('my_data')}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('settings')}
                        className={`flex-1 py-4 rounded-[1.5rem] text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 relative overflow-hidden group ${activeTab === 'settings' ? 'text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                        {activeTab === 'settings' && (
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-emerald-600 animate-in fade-in zoom-in-95 duration-500"></div>
                        )}
                        <span className="relative z-10">{t('app_settings')}</span>
                    </button>
                </div>
            </div>

            {/* Content Area - Glass Card */}
            <div className="relative z-10 px-4 md:px-6 flex-1 max-w-2xl mx-auto w-full animate-in fade-in zoom-in-95 duration-1000 delay-500">
                <div className="bg-emerald-black/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative overflow-hidden divine-border shine-effect">
                    {/* Background Texture */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>

                    {/* ---------------- PROFILE TAB ---------------- */}
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">
                            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
                                {/* Divine Identity Card */}
                                <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#0c1210] to-black border border-white/10 p-8 overflow-hidden group divine-border shine-effect">
                                    {/* Card Background Effects */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-gold-500/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                                    <div className="relative z-10">
                                        {/* Card Header */}
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div className="size-14 rounded-2xl bg-gradient-to-br from-gold-500/10 to-black border border-gold-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                                                    <span className="material-symbols-outlined text-gold-500 text-3xl">fingerprint</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-serif font-bold text-white tracking-wide">Identity Card</h3>
                                                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mt-1">Personal Biometrics</p>
                                                </div>
                                            </div>
                                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400 font-bold tracking-widest">
                                                ID: {profile.userId?.substring(0, 8) || 'USER-01'}
                                            </div>
                                        </div>

                                        {/* Inputs Grid - Redesigned with Internal Labels */}
                                        <div className="space-y-5">
                                            {/* Name Field */}
                                            <div className="relative group/input bg-black/40 border border-white/10 rounded-2xl focus-within:border-gold-500/50 focus-within:bg-black/60 transition-all duration-300">
                                                <label className="absolute top-3 left-5 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-500 transition-colors">
                                                    {t('display_name')}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name || ''}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-transparent focus:outline-none font-medium text-sm tracking-wide"
                                                    placeholder="Enter your name"
                                                    autoComplete="off"
                                                />
                                                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-gold-500 transition-colors">person</span>
                                            </div>

                                            {/* Email Field */}
                                            <div className="relative group/input bg-black/40 border border-white/10 rounded-2xl focus-within:border-gold-500/50 focus-within:bg-black/60 transition-all duration-300">
                                                <label className="absolute top-3 left-5 text-[9px] text-gold-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-gold-500 transition-colors">
                                                    Email
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email || ''}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-transparent focus:outline-none font-medium text-sm tracking-wide"
                                                    placeholder="Enter your email"
                                                    autoComplete="off"
                                                />
                                                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-gold-500 transition-colors">mail</span>
                                            </div>

                                            {/* Metrics Row */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Weight */}
                                                <div className="relative group/input bg-black/40 border border-white/10 rounded-2xl focus-within:border-emerald-500/50 focus-within:bg-black/60 transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-emerald-500 transition-colors">
                                                        {t('weight')}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.weight || ''}
                                                        onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-transparent focus:outline-none font-mono text-sm tracking-wide"
                                                        placeholder="00"
                                                        autoComplete="off"
                                                    />
                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 uppercase">kg</span>
                                                </div>

                                                {/* Height */}
                                                <div className="relative group/input bg-black/40 border border-white/10 rounded-2xl focus-within:border-emerald-500/50 focus-within:bg-black/60 transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-emerald-500 transition-colors">
                                                        {t('height')}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.height || ''}
                                                        onChange={(e) => setFormData({ ...formData, height: parseFloat(e.target.value) || 0 })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-transparent focus:outline-none font-mono text-sm tracking-wide"
                                                        placeholder="000"
                                                        autoComplete="off"
                                                    />
                                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500 uppercase">cm</span>
                                                </div>
                                            </div>

                                            {/* Medical Logic - Allergies & Diseases */}
                                            <div className="space-y-4">
                                                {/* Allergies */}
                                                <div className="relative group/input bg-black/40 border border-white/10 rounded-2xl focus-within:border-orange-500/50 focus-within:bg-black/60 transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-orange-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-orange-500 transition-colors">
                                                        Allergies (Optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : (formData.allergies || '')}
                                                        onChange={(e) => setFormData({ ...formData, allergies: e.target.value.split(',').map(s => s.trim()) })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-transparent focus:outline-none font-medium text-sm tracking-wide"
                                                        placeholder="e.g. Peanuts, Gluten"
                                                        autoComplete="off"
                                                    />
                                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-orange-500 transition-colors">warning</span>
                                                </div>

                                                {/* Chronic Diseases */}
                                                <div className="relative group/input bg-black/40 border border-white/10 rounded-2xl focus-within:border-red-500/50 focus-within:bg-black/60 transition-all duration-300">
                                                    <label className="absolute top-3 left-5 text-[9px] text-red-500/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-red-500 transition-colors">
                                                        Chronic Diseases (Optional)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={Array.isArray(formData.diseases) ? formData.diseases.join(', ') : (formData.diseases || '')}
                                                        onChange={(e) => setFormData({ ...formData, diseases: e.target.value.split(',').map(s => s.trim()) })}
                                                        className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-transparent focus:outline-none font-medium text-sm tracking-wide"
                                                        placeholder="e.g. Diabetes, Hypertension"
                                                        autoComplete="off"
                                                    />
                                                    <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-red-500 transition-colors">medical_services</span>
                                                </div>
                                            </div>

                                            {/* API Key Field */}
                                            <div className="relative group/input bg-black/40 border border-white/10 rounded-2xl focus-within:border-blue-500/50 focus-within:bg-black/60 transition-all duration-300">
                                                <label className="absolute top-3 left-5 text-[9px] text-blue-400/60 font-bold uppercase tracking-widest pointer-events-none group-focus-within/input:text-blue-400 transition-colors">
                                                    Gemini API Key
                                                </label>
                                                <input
                                                    type="password"
                                                    value={formData.apiKey || ''}
                                                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                                    className="w-full h-[4.5rem] pt-6 pb-2 px-5 bg-transparent text-white placeholder-transparent focus:outline-none font-mono text-xs tracking-wide"
                                                    placeholder="Start with AI..."
                                                    autoComplete="off"
                                                />
                                                <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-white/10 group-focus-within/input:text-blue-500 transition-colors">key</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Save Action - Refined Elegant Button */}
                                <button
                                    onClick={handleSaveProfile}
                                    className="w-full py-5 rounded-2xl bg-gradient-to-r from-gold-900/40 via-gold-900/20 to-gold-900/40 border border-gold-500/30 text-gold-400 font-bold uppercase tracking-[0.3em] text-[10px] shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:bg-gold-500/10 hover:border-gold-500/60 hover:text-gold-bright hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] active:scale-[0.98] transition-all relative overflow-hidden group mb-4"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-3">
                                        <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">save</span>
                                        {t('save_changes')}
                                    </span>
                                    {/* Light sweep effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ---------------- SETTINGS TAB ---------------- */}
                    {activeTab === 'settings' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-700">

                            {/* Ramadan Mode Toggle */}
                            <div className="bg-gradient-to-r from-emerald-900/40 to-black border border-gold/30 rounded-2xl p-4 flex items-center justify-between shadow-lg relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="flex items-center gap-4 relative z-10">
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
                                    className={`relative w-14 h-8 rounded-full transition-all duration-300 border ${settings.ramadanMode ? 'bg-gold/20 border-gold' : 'bg-black/40 border-white/10'}`}
                                >
                                    <div className={`absolute top-1/2 -translate-y-1/2 size-6 rounded-full shadow-md transition-all duration-300 ${settings.ramadanMode ? 'left-[calc(100%-1.75rem)] bg-gold shadow-[0_0_10px_#d4af37]' : 'left-1 bg-gray-500'}`}></div>
                                </button>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6 opacity-50"></div>

                            {/* Language Section - Enhanced */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gold-bright uppercase tracking-[0.3em] ml-2 flex items-center gap-2 opacity-80">
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
                                            onClick={() => updateSettings({ language: lang.code as any })}
                                            className={`relative overflow-hidden rounded-xl p-4 border transition-all duration-300 group ${settings.language === lang.code
                                                ? 'bg-gradient-to-r from-gold/20 to-gold/5 border-gold shadow-[0_0_20px_rgba(212,175,55,0.1)]'
                                                : 'bg-black/40 border-white/5 hover:border-gold/30 hover:bg-black/60'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className={`size-10 rounded-full flex items-center justify-center font-bold text-xs border ${settings.language === lang.code ? 'bg-gold text-black border-gold' : 'bg-white/5 text-gray-400 border-white/10 group-hover:border-gold/30'
                                                        }`}>
                                                        {lang.code.toUpperCase()}
                                                    </div>
                                                    <div className="text-left">
                                                        <p className={`text-sm font-bold ${settings.language === lang.code ? 'text-gold-bright' : 'text-gray-300 group-hover:text-white'}`}>
                                                            {lang.native}
                                                        </p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-wider">{lang.label}</p>
                                                    </div>
                                                </div>
                                                {settings.language === lang.code && (
                                                    <span className="material-symbols-outlined text-gold-bright animate-in zoom-in spin-in-180 duration-500">check_circle</span>
                                                )}
                                            </div>
                                            {/* Hover Glow */}
                                            <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8 opacity-50"></div>

                            {/* Location Info (Read Only) */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-gold-bright uppercase tracking-[0.3em] ml-2 flex items-center gap-2 opacity-80">
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

                            <button className="w-full py-5 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500/60 font-bold text-[10px] tracking-[0.5em] uppercase hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 transition-all flex items-center justify-center gap-3 group">
                                <span className="material-symbols-outlined text-lg group-hover:animate-bounce">delete_forever</span>
                                {t('clear_data')}
                            </button>

                            <div className="pt-6 flex flex-col items-center gap-2 opacity-30">
                                <p className="text-[9px] text-gold-bright text-center font-mono tracking-[0.4em] uppercase">
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
