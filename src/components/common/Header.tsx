import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { MysoreBorder } from '@/components/common/MysoreBorder';
import { FlameIcon, SunIcon, MoonIcon, SearchIcon, SettingsIcon, KeyboardIcon } from '@/components/common/Icons';
import styles from './Header.module.css';

interface HeaderProps {
  onOpenShortcuts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenShortcuts }) => {
  const streak = useAppStore((state) => state.streak);
  const theme = useAppStore((state) => state.settings.theme);
  const toggleTheme = useAppStore((state) => state.toggleTheme);

  return (
    <header className={styles.headerWrapper} role="banner">
      <div className={styles.headerInner}>
        <Link to="/" className={styles.brandLink} aria-label="Nudi Home">
          <span className={styles.brandKannada}>ನುಡಿ</span>
          <span className={styles.brandEnglish}>Nudi</span>
          <span className={styles.brandTagline}>— Kannada for Everyday Life</span>
        </Link>

        <div className={styles.headerActions}>
          <div
            className={styles.streakBadge}
            title={`${streak.currentStreak} day learning streak!`}
            aria-label={`${streak.currentStreak} day streak`}
          >
            <FlameIcon size={16} />
            <span>{streak.currentStreak}</span>
          </div>

          <Link
            to="/search"
            className={styles.actionButton}
            aria-label="Search all Kannada phrases"
            title="Search phrases"
          >
            <SearchIcon size={18} />
          </Link>

          <button
            type="button"
            onClick={toggleTheme}
            className={styles.actionButton}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
            title={`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} />}
          </button>

          <button
            type="button"
            onClick={onOpenShortcuts}
            className={styles.actionButton}
            aria-label="View keyboard shortcuts"
            title="Keyboard shortcuts (?)"
          >
            <KeyboardIcon size={18} />
          </button>

          <Link
            to="/settings"
            className={styles.actionButton}
            aria-label="Settings and progress"
            title="Settings"
          >
            <SettingsIcon size={18} />
          </Link>
        </div>
      </div>
      <MysoreBorder height={6} variant="kumkuma" />
    </header>
  );
};
