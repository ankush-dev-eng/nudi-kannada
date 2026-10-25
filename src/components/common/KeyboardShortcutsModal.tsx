import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './Icons';
import styles from './KeyboardShortcutsModal.module.css';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape or click outside
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <div className={styles.modal} ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2 id="shortcuts-title" className={styles.title}>
            ಕೀಬೋರ್ಡ್ ಶಾರ್ಟ್‌ಕಟ್‌ಗಳು (Keyboard Shortcuts)
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close shortcuts modal"
          >
            <CloseIcon size={18} />
          </button>
        </header>

        <div className={styles.shortcutGrid}>
          <div className={styles.groupTitle}>Global Navigation</div>
          <div className={styles.shortcutRow}>
            <span>Search dictionary</span>
            <span className={styles.kbd}>/</span>
          </div>
          <div className={styles.shortcutRow}>
            <span>Go to Situations (Home)</span>
            <span className={styles.kbd}>H</span>
          </div>
          <div className={styles.shortcutRow}>
            <span>Go to Daily Review</span>
            <span className={styles.kbd}>R</span>
          </div>
          <div className={styles.shortcutRow}>
            <span>Go to Speak Practice</span>
            <span className={styles.kbd}>S</span>
          </div>
          <div className={styles.shortcutRow}>
            <span>Toggle Light / Dark Theme</span>
            <span className={styles.kbd}>T</span>
          </div>
          <div className={styles.shortcutRow}>
            <span>Show this shortcuts guide</span>
            <span className={styles.kbd}>?</span>
          </div>

          <div className={styles.groupTitle}>Learning & Flashcards</div>
          <div className={styles.shortcutRow}>
            <span>Flip card for English translation</span>
            <span className={styles.kbd}>Space / Enter</span>
          </div>
          <div className={styles.shortcutRow}>
            <span>Next / Previous phrase</span>
            <span className={styles.kbd}>← / →</span>
          </div>

          <div className={styles.groupTitle}>Review Quality Rating</div>
          <div className={styles.shortcutRow}>
            <span>Rate Again (1) / Hard (2) / Good (3) / Easy (4)</span>
            <span className={styles.kbd}>1, 2, 3, 4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
