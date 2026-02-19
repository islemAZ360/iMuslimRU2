import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { LanguageProvider } from './context/LanguageContext';
import { UserProvider } from './context/UserContext';
import { PrayerProvider } from './context/PrayerContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <UserProvider>
        <PrayerProvider>
          <App />
        </PrayerProvider>
      </UserProvider>
    </LanguageProvider>
  </React.StrictMode>
);