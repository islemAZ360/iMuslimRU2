import * as React from 'react';
import { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
          <AnimatedRoutes />

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

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Onboarding /></PageWrapper>} />
        <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/prayer" element={<PageWrapper><Prayer /></PageWrapper>} />
        <Route path="/scan" element={<PageWrapper><Scan /></PageWrapper>} />
        <Route path="/health" element={<PageWrapper><Health /></PageWrapper>} />
        <Route path="/athkar" element={<PageWrapper><Athkar /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/ramadan" element={<PageWrapper><Ramadan /></PageWrapper>} />
        <Route path="/stats" element={<PageWrapper><Stats /></PageWrapper>} />
        <Route path="/ai" element={<PageWrapper><AiChat /></PageWrapper>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const PageWrapper: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
      exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex-1 flex flex-col relative z-0"
    >
      {children}
    </motion.div>
  );
};

export default App;