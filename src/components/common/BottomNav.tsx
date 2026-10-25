import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { HomeIcon, ReviewIcon, ScriptIcon, InfoIcon } from '@/components/common/Icons';
import styles from './BottomNav.module.css';

export const BottomNav: React.FC = () => {
  const getDueReviewPhrases = useAppStore((state) => state.getDueReviewPhrases);
  const dueCount = getDueReviewPhrases().length;

  return (
    <nav className={styles.navWrapper} aria-label="Bottom primary navigation">
      <div className={styles.navInner}>
        <NavLink
          to="/"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <HomeIcon size={20} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/review"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <ReviewIcon size={20} />
          <span>Review</span>
          {dueCount > 0 && (
            <span className={styles.dueBadge} aria-label={`${dueCount} phrases due for review`}>
              {dueCount}
            </span>
          )}
        </NavLink>

        <NavLink
          to="/script"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <ScriptIcon size={20} />
          <span>Read It</span>
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <InfoIcon size={20} />
          <span>About</span>
        </NavLink>
      </div>
    </nav>
  );
};
