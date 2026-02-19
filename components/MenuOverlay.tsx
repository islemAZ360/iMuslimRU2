import * as React from 'react';
import { useNavigate } from 'react-router-dom';

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNav = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-x-0 bottom-24 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-64 animate-[slide-up_0.3s_ease-out]">
        <div className="bg-[#030e0a]/95 backdrop-blur-2xl border border-gold/50 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] pb-2 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_center,_rgba(212,175,55,0.15),_transparent_70%)] pointer-events-none"></div>

          <div className="flex flex-col p-2 space-y-1">
            <button onClick={() => handleNav('/stats')} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gold/10 transition-colors group border border-transparent hover:border-gold/20">
              <span className="material-symbols-outlined text-gold group-hover:text-gold-light text-2xl transition-colors drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]">bar_chart</span>
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-gold-dim group-hover:text-gold-light transition-colors">Statistics</span>
            </button>

            <button onClick={() => handleNav('/athkar')} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gold/10 transition-colors group border border-transparent hover:border-gold/20">
              <span className="material-symbols-outlined text-gold group-hover:text-gold-light text-2xl transition-colors drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]">volunteer_activism</span>
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-gold-dim group-hover:text-gold-light transition-colors">Iman & Athkar</span>
            </button>

            {/* Link to new Ramadan Page */}
            <button onClick={() => handleNav('/ramadan')} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gold/10 transition-colors group border border-transparent hover:border-gold/20">
              <span className="material-symbols-outlined text-gold group-hover:text-gold-light text-2xl transition-colors drop-shadow-[0_2px_4px_rgba(212,175,55,0.4)]">nights_stay</span>
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-gold-dim group-hover:text-gold-light transition-colors">Ramadan</span>
            </button>

            <div className="h-px bg-gold/10 my-1 mx-4"></div>

            <button onClick={() => handleNav('/profile')} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gold/10 transition-colors group border border-transparent hover:border-gold/20">
              <span className="material-symbols-outlined text-gold group-hover:text-gold-light text-2xl transition-colors">settings</span>
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-gold-dim group-hover:text-gold-light transition-colors">Settings</span>
            </button>
          </div>
        </div>
        {/* Pointer Triangle */}
        <div className="w-6 h-6 bg-[#030e0a] border-r border-b border-gold/50 transform rotate-45 mx-auto -mt-3 relative z-40"></div>
      </div>
    </div>
  );
};

export default MenuOverlay;