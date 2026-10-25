import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { RomanizationStyle } from '@/types/progress';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { playSuccessSound, playCardFlipSound, triggerHaptic } from '@/lib/feedback';
import { ChevronLeftIcon, SunIcon, MoonIcon, CheckIcon } from '@/components/common/Icons';
import styles from './SettingsPage.module.css';

export const SettingsPage: React.FC = () => {
  const {
    settings,
    updateSettings,
    toggleTheme,
    exportData,
    importData,
    resetProgress,
  } = useAppStore();

  const { isSupported: synthSupported, hasKannadaVoice } = useSpeechSynthesis();
  const { isSupported: recogSupported } = useSpeechRecognition();

  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleTheme = () => {
    toggleTheme();
    playCardFlipSound();
    triggerHaptic('light');
  };

  const handleExportData = async () => {
    try {
      const data = await exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nudi-progress-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      playSuccessSound();
      showNotification('Progress exported successfully!');
    } catch {
      showNotification('Failed to export progress data.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        await importData(parsed);
        playSuccessSound();
        triggerHaptic('success');
        showNotification('Progress imported and restored successfully!');
      } catch {
        showNotification('Invalid JSON progress backup file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset
  };

  const handleResetData = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to reset all learning progress, streaks, and review cards? This cannot be undone.'
    );
    if (confirmed) {
      await resetProgress();
      playCardFlipSound();
      showNotification('All learning progress has been reset.');
    }
  };

  return (
    <main className={styles.pageContainer}>
      <header className={styles.topBar}>
        <Link to="/" className={styles.backLink} aria-label="Back to home">
          <ChevronLeftIcon size={16} /> Home
        </Link>
      </header>

      <section className={styles.pageHeader}>
        <h1 className={styles.titleKannada}>ಸಿದ್ಧತೆಗಳು & ಆದ್ಯತೆಗಳು</h1>
        <div className={styles.titleEnglish}>Settings & Offline Data</div>
      </section>

      {notification && (
        <aside
          style={{
            backgroundColor: 'var(--sand)',
            border: '1px solid var(--ghats)',
            color: 'var(--ghats)',
            padding: '0.65rem 1rem',
            borderRadius: 'var(--radius-sm)',
            marginBottom: '1rem',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
          role="status"
        >
          <CheckIcon size={16} /> {notification}
        </aside>
      )}

      {/* Visual & Audio Preferences */}
      <section className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>Visual & Audio Preferences</h2>

        <div className={styles.settingRow}>
          <div className={styles.settingLabelGroup}>
            <span className={styles.settingLabel}>Display Theme</span>
            <span className={styles.settingHelp}>
              {settings.theme === 'light' ? 'Sandalwood (ಶ್ರೀಗಂಧ) light palette' : 'Charcoal Ghats dark palette'}
            </span>
          </div>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={handleToggleTheme}
            aria-label="Toggle display theme"
          >
            {settings.theme === 'light' ? (
              <>
                <SunIcon size={16} /> Light Theme
              </>
            ) : (
              <>
                <MoonIcon size={16} /> Dark Theme
              </>
            )}
          </button>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLabelGroup}>
            <span className={styles.settingLabel}>Romanization Style</span>
            <span className={styles.settingHelp}>Conversational Baraha phonetics or ISO transliteration</span>
          </div>
          <select
            value={settings.romanizationStyle}
            onChange={(e) => updateSettings({ romanizationStyle: e.target.value as RomanizationStyle })}
            className={styles.selectInput}
            aria-label="Select romanization transliteration style"
          >
            <option value="conversational">Conversational (e.g. namaskara)</option>
            <option value="academic">Academic (ISO 15919)</option>
          </select>
        </div>

        <div className={styles.settingRow}>
          <div className={styles.settingLabelGroup}>
            <span className={styles.settingLabel}>Reference Audio Speed</span>
            <span className={styles.settingHelp}>Default speed for Kannada pronunciation audio</span>
          </div>
          <select
            value={settings.audioSpeed}
            onChange={(e) => updateSettings({ audioSpeed: parseFloat(e.target.value) })}
            className={styles.selectInput}
            aria-label="Select default audio playback speed"
          >
            <option value={1.0}>1.0x (Normal speed)</option>
            <option value={0.75}>0.75x (Slower for beginners)</option>
          </select>
        </div>
      </section>

      {/* Data Management & Backup */}
      <section className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>Data & Privacy (100% Local)</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', margin: 0 }}>
          Nudi stores all your progress, SM-2 flashcard schedules, and streak counts inside your device&apos;s browser IndexedDB. No personal data ever leaves your device.
        </p>

        <div className={styles.actionButtonRow}>
          <button type="button" className={styles.actionBtn} onClick={handleExportData}>
            Export Backup (.json)
          </button>

          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => fileInputRef.current?.click()}
          >
            Import Backup
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json,application/json"
            style={{ display: 'none' }}
          />

          <button type="button" className={`${styles.actionBtn} ${styles.danger}`} onClick={handleResetData}>
            Reset Progress
          </button>
        </div>
      </section>

      {/* Hardware Diagnostics */}
      <section className={styles.settingsSection}>
        <h2 className={styles.sectionTitle}>System & Offline Diagnostics</h2>
        <div className={styles.statusCard}>
          <div className={styles.statusItem}>
            <span>Offline PWA Service Worker:</span>
            <strong>Active & Pre-cached (100% Offline)</strong>
          </div>
          <div className={styles.statusItem}>
            <span>Speech Synthesis API:</span>
            <strong>{synthSupported ? 'Supported' : 'Not supported'}</strong>
          </div>
          <div className={styles.statusItem}>
            <span>Native Kannada Voice:</span>
            <strong>{hasKannadaVoice ? 'Available (kn-IN)' : 'Browser Default Fallback'}</strong>
          </div>
          <div className={styles.statusItem}>
            <span>Speech Recognition (Microphone):</span>
            <strong>{recogSupported ? 'Supported (kn-IN)' : 'Text Fallback Mode'}</strong>
          </div>
          <div className={styles.statusItem}>
            <span>Database Storage:</span>
            <strong>IndexedDB (idb keyval)</strong>
          </div>
        </div>
      </section>
    </main>
  );
};
