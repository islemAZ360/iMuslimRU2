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
import BottomNav from './components/BottomNav';
import MenuOverlay from './components/MenuOverlay';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-gold selection:text-black">
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* This component now listens to route changes properly */}
        <ConditionalNav
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />
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