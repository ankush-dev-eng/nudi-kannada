import React, { useState, useEffect } from 'react';
import { CloseIcon } from '@/components/common/Icons';
import styles from './PWAStatusBanner.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAStatusBanner: React.FC = () => {
  const [isOffline, setIsOffline] = useState<boolean>(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setShowInstallPrompt(false);
    }
  };

  return (
    <div className={styles.bannerContainer}>
      {isOffline && (
        <div className={styles.offlineBanner} role="status">
          <span className={styles.offlineDot} aria-hidden="true" />
          <span>ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ — Offline mode active. All phrases & reviews work offline.</span>
        </div>
      )}

      {showInstallPrompt && (
        <div className={styles.installPrompt} role="region" aria-label="Install app">
          <div className={styles.installText}>
            <span className={styles.installTitle}>Install Nudi on your device</span>
            <span className={styles.installSub}>Learn Kannada anywhere with instant offline access</span>
          </div>
          <button type="button" onClick={handleInstall} className={styles.installButton}>
            Install App
          </button>
          <button
            type="button"
            onClick={() => setShowInstallPrompt(false)}
            className={styles.dismissButton}
            aria-label="Dismiss install banner"
          >
            <CloseIcon size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
