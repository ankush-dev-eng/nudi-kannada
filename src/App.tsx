import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { Header } from '@/components/common/Header';
import { BottomNav } from '@/components/common/BottomNav';
import { PWAStatusBanner } from '@/components/common/PWAStatusBanner';
import { KeyboardShortcutsModal } from '@/components/common/KeyboardShortcutsModal';

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
  const navigate = useNavigate();
  const { initializeStore, settings, toggleTheme } = useAppStore();
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const handleGlobalKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          (activeEl as HTMLElement).isContentEditable);

      if (isInput) return;

      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      } else if (e.key === 'h' || e.key === 'H') {
        navigate('/');
      } else if (e.key === 'r' || e.key === 'R') {
        navigate('/review');
      } else if (e.key === 's' || e.key === 'S') {
        navigate('/speak');
      } else if (e.key === 'p' || e.key === 'P') {
        navigate('/roleplay');
      } else if (e.key === 't' || e.key === 'T') {
        toggleTheme();
      }
    },
    [navigate, toggleTheme]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  return (
    <>
      <Header onOpenShortcuts={() => setIsShortcutsOpen(true)} />
      <PWAStatusBanner />
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/learn" element={<Navigate to="/learn/travel" replace />} />
          <Route path="/learn/:situationId" element={<LearnPage />} />
          <Route path="/speak" element={<SpeakPage />} />
          <Route path="/speak/:situationId" element={<SpeakPage />} />
          <Route path="/roleplay" element={<RoleplayPage />} />
          <Route path="/roleplay/:situationId" element={<RoleplayPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/script" element={<ScriptPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <BottomNav />
      <KeyboardShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </>
  );
};
export default App;
