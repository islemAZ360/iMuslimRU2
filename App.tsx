import * as React from 'react';
import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Prayer from './pages/Prayer';
import Scan from './pages/Scan';
import Health from './pages/Health';
import Athkar from './pages/Athkar';
import Profile from './pages/Profile';
import Ramadan from './pages/Ramadan';
import Stats from './pages/Stats';
import AiChat from './pages/AiChat';
import BottomNav from './components/BottomNav';
import MenuOverlay from './components/MenuOverlay';
import { useUser } from './context/UserContext';
import { useLanguage } from './context/LanguageContext';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useUser();
  const { language, setLanguage } = useLanguage();

  React.useEffect(() => {
      if (settings && settings.language && settings.language !== language) {
          setLanguage(settings.language as any);
      }
  }, [settings.language, language, setLanguage]);

  return (
    <Router>
      <div className="min-h-screen bg-desktop-pattern flex justify-center text-white font-sans selection:bg-gold selection:text-black">
        <div className="w-full max-w-md min-h-screen bg-black relative shadow-2xl border-x border-white/5 flex flex-col overflow-x-hidden">
          <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/home" element={<Home />} />
          <Route path="/prayer" element={<Prayer />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/health" element={<Health />} />
          <Route path="/athkar" element={<Athkar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ramadan" element={<Ramadan />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/ai" element={<AiChat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* This component now listens to route changes properly */}
        <ConditionalNav
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
        </div>
      </div>
    </Router>
  );
};

// Separate component to use useLocation hook inside Router context
const ConditionalNav: React.FC<{ isMenuOpen: boolean, setIsMenuOpen: (v: boolean) => void }> = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const path = location.pathname;

  // Hide nav on onboarding (root) and immersive scan page
  if (path === '/' || path === '/scan') return null;

  return (
    <>
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <BottomNav
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />
    </>
  );
};

export default App;