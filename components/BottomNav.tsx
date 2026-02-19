import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  onMenuToggle: () => void;
  isMenuOpen: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ onMenuToggle, isMenuOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useLanguage();

  const isActive = (path: string) => location.pathname === path;
  const isRTL = language === 'ar';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] safe-area-bottom pb-3 pointer-events-none flex justify-center" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Height reduced from h-20 to h-16, Max width adjustments */}
      <nav className="pointer-events-auto nav-dock w-[90%] max-w-sm h-16 rounded-[2rem] flex items-center justify-between px-5 relative shadow-[0_5px_20px_rgba(0,0,0,0.6)] border border-gold/20">
        {/* Left Section */}
        <div className={`flex items-center justify-between w-[38%] ${isRTL ? 'pl-1' : 'pl-1'}`}>
          <button
            onClick={() => navigate('/home')}
            className={`flex flex-col items-center gap-0.5 group w-10 transition-all duration-300 ${isActive('/home') ? 'opacity-100 -translate-y-1' : 'opacity-60 hover:opacity-100'}`}
          >
            <span className={`material-symbols-outlined text-[26px] ${isActive('/home') ? 'text-gold' : 'text-white'} transition-colors`}>home</span>
            {isActive('/home') && <span className="text-[8px] font-sans font-bold text-white tracking-wider uppercase drop-shadow-md animate-in fade-in">{t('nav_home')}</span>}
          </button>

          <button
            onClick={() => navigate('/prayer')}
            className={`flex flex-col items-center gap-0.5 group w-10 transition-all duration-300 ${isActive('/prayer') ? 'opacity-100 -translate-y-1' : 'opacity-60 hover:opacity-100'}`}
          >
            <span className={`material-symbols-outlined text-[26px] ${isActive('/prayer') ? 'text-gold' : 'text-white'} transition-colors`}>mosque</span>
            {isActive('/prayer') && <span className="text-[8px] font-sans font-bold text-white tracking-wider uppercase drop-shadow-md animate-in fade-in">{t('nav_prayer')}</span>}
          </button>
        </div>

        {/* Center Diamond Button - Significantly reduced size */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 z-20">
          <div className="relative group cursor-pointer" onClick={onMenuToggle}>
            <div className={`absolute -inset-3 bg-emerald-500/30 blur-lg rounded-full ${isMenuOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}></div>
            {/* Size reduced from 4.5rem to 3.5rem (w-14 h-14) */}
            <div className={`w-14 h-14 diamond-btn flex items-center justify-center transform rotate-45 border-2 border-[#FFF8DC] transition-transform duration-300 ${isMenuOpen ? 'scale-110' : 'hover:scale-105 active:scale-95'} relative z-10 shadow-lg`}>
              <span className={`material-symbols-outlined text-white text-3xl font-bold transform -rotate-45 drop-shadow-md transition-transform duration-300 ${isMenuOpen ? 'rotate-[-225deg]' : ''}`}>
                {isMenuOpen ? 'close' : 'grid_view'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className={`flex items-center justify-between w-[38%] ${isRTL ? 'pr-1' : 'pr-1'}`}>
          <button
            onClick={() => navigate('/scan')}
            className={`flex flex-col items-center gap-0.5 group w-10 transition-all duration-300 ${isActive('/scan') ? 'opacity-100 -translate-y-1' : 'opacity-60 hover:opacity-100'}`}
          >
            <span className={`material-symbols-outlined text-[26px] ${isActive('/scan') ? 'text-gold' : 'text-white'} transition-colors`}>qr_code_scanner</span>
            {isActive('/scan') && <span className="text-[8px] font-sans font-bold text-white tracking-wider uppercase drop-shadow-md animate-in fade-in">{t('nav_scan')}</span>}
          </button>

          <button
            onClick={() => navigate('/health')}
            className={`flex flex-col items-center gap-0.5 group w-10 transition-all duration-300 ${isActive('/health') ? 'opacity-100 -translate-y-1' : 'opacity-60 hover:opacity-100'}`}
          >
            <span className={`material-symbols-outlined text-[26px] ${isActive('/health') ? 'text-gold' : 'text-white'} transition-colors`}>ecg_heart</span>
            {isActive('/health') && <span className="text-[8px] font-sans font-bold text-white tracking-wider uppercase drop-shadow-md animate-in fade-in">{t('nav_health')}</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default BottomNav;