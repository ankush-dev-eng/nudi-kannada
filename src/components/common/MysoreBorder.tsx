import React from 'react';
import styles from './MysoreBorder.module.css';

interface MysoreBorderProps {
  className?: string;
  variant?: 'kumkuma' | 'turmeric' | 'ghats';
  height?: number;
}

/**
 * MysoreBorder: An authentic Karnataka-inspired SVG motif reflecting the geometric
 * temple triangles (gopura) and zari diamond weaves found on traditional Mysore silk sarees.
 */
export const MysoreBorder: React.FC<MysoreBorderProps> = ({
  className = '',
  variant = 'kumkuma',
  height = 10,
}) => {
  const variantClass =
    variant === 'turmeric' ? styles.turmericAccent : variant === 'ghats' ? styles.ghatsAccent : '';

  return (
    <div
      className={`${styles.borderContainer} ${variantClass} ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <svg
        className={styles.borderSvg}
        style={{ height: `${height}px` }}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 12"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="mysore-saree-pattern" width="24" height="12" patternUnits="userSpaceOnUse">
            {/* Top thin zari rule */}
            <line
              x1="0"
              y1="1"
              x2="24"
              y2="1"
              stroke="currentColor"
              strokeWidth="0.8"
              opacity="0.7"
            />
            {/* Temple chevron (gopura peak) */}
            <path d="M 2,10 L 6,3 L 10,10 Z" fill="currentColor" opacity="0.9" />
            {/* Intricate center diamond */}
            <polygon
              points="12,3 15,6.5 12,10 9,6.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.9"
            />
            <circle cx="12" cy="6.5" r="1.1" fill="currentColor" />
            {/* Stepped chevron */}
            <path d="M 14,10 L 18,3 L 22,10 Z" fill="currentColor" opacity="0.9" />
            {/* Bottom rule */}
            <line
              x1="0"
              y1="11"
              x2="24"
              y2="11"
              stroke="currentColor"
              strokeWidth="0.8"
              opacity="0.7"
            />
          </pattern>
        </defs>
        <rect width="100%" height="12" fill="url(#mysore-saree-pattern)" />
      </svg>
    </div>
  );
};
