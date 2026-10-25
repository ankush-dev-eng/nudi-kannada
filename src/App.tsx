import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { PWAStatusBanner } from '@/components/common/PWAStatusBanner';

import { HomePage } from '@/pages/HomePage';
import { LearnPage } from '@/pages/LearnPage';
import { SpeakPage } from '@/pages/SpeakPage';
import { RoleplayPage } from '@/pages/RoleplayPage';
import { ReviewPage } from '@/pages/ReviewPage';
import { ScriptPage } from '@/pages/ScriptPage';
import { SearchPage } from '@/pages/SearchPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { AboutPage } from '@/pages/AboutPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  const { initializeStore, settings } = useAppStore();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  return (
    <>
      <Header />
      <PWAStatusBanner />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn/:situationId" element={<LearnPage />} />
          <Route path="/speak" element={<SpeakPage />} />
          <Route path="/roleplay" element={<RoleplayPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/script" element={<ScriptPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <BottomNav />
    </>
  );
};
export default App;
