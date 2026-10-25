import React, { useRef, useEffect } from 'react';
import { SearchIcon, CloseIcon } from '@/components/common/Icons';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'ಹುಡುಕಿ / Search in Kannada, English, or romanization (e.g. namaskara)...',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: '/' focuses search bar, 'Escape' clears
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === inputRef.current) {
        onChange('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onChange]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchIconWrapper} aria-hidden="true">
        <SearchIcon size={20} />
      </div>
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
        aria-label="Search phrases"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            inputRef.current?.focus();
          }}
          className={styles.clearBtn}
          aria-label="Clear search text"
        >
          <CloseIcon size={16} />
        </button>
      )}
      <div className={styles.searchHint}>
        <span>Search Kannada script, English meaning, or romanized phonetics</span>
        <span>Press <kbd>/</kbd> to focus</span>
      </div>
    </div>
  );
};
