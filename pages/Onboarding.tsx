import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { updateProfile, setLocation, t } = useUser();
  const [authMode, setAuthMode] = useState<'initial' | 'email_signup' | 'email_login' | 'health_profile'>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    dob: '',
    height: '',
    weight: '',
    allergies: '',
    diseases: ''
  });

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Update profile with Google data
      updateProfile({
        name: user.displayName || 'User',
      });

      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        // User exists, load data and go home
        console.log("User found in Firestore, redirecting to Home");
        const userData = userDoc.data();
        // Update context with fetched data
        updateProfile(userData);
        navigate('/home');
      } else {
        // New user, go to setup
        console.log("New user, redirecting to Health Profile");
        setAuthMode('health_profile');
      }
    } catch (err: any) {
      console.error("Google Login Error:", err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (authMode === 'email_signup') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        updateProfile({ name: email.split('@')[0] });
        setAuthMode('health_profile');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // If login successful, check if they have health data? For now go to health profile to verify/edit
        // Or directly to home if profile is complete.
        // Let's go to health profile to be safe and ensure data collection
        setAuthMode('health_profile');
      }
    } catch (err: any) {
      console.error("Email Auth Error:", err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteIndices = async () => {
    try {
      setLoading(true);
      const profileData = {
        dob: formData.dob,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        allergies: formData.allergies.split(',').map(s => s.trim()).filter(s => s),
        diseases: formData.diseases.split(',').map(s => s.trim()).filter(s => s),
        name: auth.currentUser?.displayName || email.split('@')[0] || 'User'
      };

      updateProfile(profileData);
      // Set default location to London/User's choice if we had a picker. For now mock.
      setLocation({ lat: 51.5074, lng: -0.1278, city: 'London', country: 'UK' });

      // Save to Firestore
      if (auth.currentUser) {
        await setDoc(doc(db, 'users', auth.currentUser.uid), profileData, { merge: true });
      }

      navigate('/home');
    } catch (e) {
      console.error("Error saving profile:", e);
      setError("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col justify-center px-6 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-luxury-gradient opacity-80 z-0"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md mx-auto space-y-8">

        {/* Logo Area */}
        <div className="flex flex-col items-center mb-4">
          <div className="size-20 mb-4 rounded-full bg-gradient-to-br from-gold-light via-gold to-gold-dark p-[2px] shadow-gold-glow">
            <div className="w-full h-full bg-emerald-black rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-gold-light">mosque</span>
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-gold-gradient text-center">iMuslimRU</h1>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-gold to-transparent mt-2"></div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif text-white">{t('join_ummah')}</h2>
          <p className="text-sm text-gray-400 font-light max-w-xs mx-auto">{t('onboarding_subtitle')}</p>
        </div>

        {error && (
          <div className="w-full p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs text-center">
            {error}
          </div>
        )}

        {/* ---------------- INITIAL STATE ---------------- */}
        {authMode === 'initial' && (
          <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 rounded-xl glass-panel flex items-center justify-center gap-3 hover:bg-emerald-900/40 transition-all border border-gold/20 group disabled:opacity-50"
            >
              <span className="font-bold text-sm tracking-wide text-white group-hover:text-gold-light transition-colors">
                {loading ? 'Connecting...' : t('sign_up_google')}
              </span>
            </button>
            <button
              onClick={() => setAuthMode('email_signup')}
              className="w-full py-4 rounded-xl glass-panel flex items-center justify-center gap-3 hover:bg-emerald-900/40 transition-all border border-gold/20 group"
            >
              <span className="material-symbols-outlined text-gold-dim">mail</span>
              <span className="font-bold text-sm tracking-wide text-white group-hover:text-gold-light transition-colors">{t('sign_up_email')}</span>
            </button>

            <button
              onClick={() => setAuthMode('email_login')}
              className="w-full py-2 text-xs text-gray-400 hover:text-gold transition-colors underline"
            >
              Already have an account? Sign In
            </button>

            {/* Guest Login */}
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 rounded-xl border border-white/10 flex items-center justify-center gap-2 hover:bg-white/5 transition-all group mt-2"
            >
              <span className="material-symbols-outlined text-gray-400 group-hover:text-white transition-colors text-lg">person_off</span>
              <span className="font-bold text-sm tracking-wide text-gray-400 group-hover:text-white transition-colors">{t('continue_guest')}</span>
            </button>
          </div>
        )}

        {/* ---------------- EMAIL AUTH FORM ---------------- */}
        {(authMode === 'email_signup' || authMode === 'email_login') && (
          <form onSubmit={handleEmailAuth} className="w-full space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gold/80 uppercase tracking-widest pl-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-emerald-black/80 border border-gold/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gold/80 uppercase tracking-widest pl-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-emerald-black/80 border border-gold/20 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl diamond-btn bg-gold text-emerald-black font-serif font-bold tracking-widest text-sm hover:shadow-gold-glow transition-all active:scale-[0.98] mt-4"
            >
              {loading ? 'Processing...' : (authMode === 'email_signup' ? 'Sign Up' : 'Sign In')}
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('initial')}
              className="w-full py-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              Back to options
            </button>
          </form>
        )}

        {/* ---------------- HEALTH FORM (After Auth) ---------------- */}
        {authMode === 'health_profile' && (
          <div className="w-full animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Divider */}
            <div className="flex items-center w-full gap-4 opacity-70 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-gold"></div>
              <div className="rotate-45 size-2 border border-gold bg-emerald-black"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">{t('health_profile')}</span>
              <div className="rotate-45 size-2 border border-gold bg-emerald-black"></div>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-gold"></div>
            </div>

            <form className="w-full space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gold/80 uppercase tracking-widest pl-1">{t('dob')}</label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-gold/20 to-emerald/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                  <input
                    type="text"
                    placeholder={t('dob_placeholder')}
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="relative w-full bg-emerald-black/80 border border-gold/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gold/80 uppercase tracking-widest pl-1">{t('height')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="175"
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      className="w-full bg-emerald-black/80 border border-gold/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 text-xs font-bold">cm</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gold/80 uppercase tracking-widest pl-1">{t('weight')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="70"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full bg-emerald-black/80 border border-gold/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gold/50 text-xs font-bold">kg</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gold/80 uppercase tracking-widest pl-1">{t('allergies')} (Optional)</label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="e.g. Peanuts, Gluten (comma separated)"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full bg-emerald-black/80 border border-gold/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gold/80 uppercase tracking-widest pl-1">{t('medical_conditions')} (Optional)</label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="e.g. Diabetes, Hypertension (comma separated)"
                    value={formData.diseases}
                    onChange={(e) => setFormData({ ...formData, diseases: e.target.value })}
                    className="w-full bg-emerald-black/80 border border-gold/20 rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={handleCompleteIndices}
                  className="w-full py-4 rounded-xl diamond-btn bg-gold text-emerald-black font-serif font-bold tracking-widest text-sm hover:shadow-gold-glow transition-all active:scale-[0.98] relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t('complete_registration')}
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}

        <p className="text-[10px] text-gray-500 text-center px-4 leading-relaxed">
          {t('terms_privacy')}
        </p>

      </div>
    </div>
  );
};

export default Onboarding;