import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export const WorkplaceIllustration: React.FC<IllustrationProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Workplace and office illustration"
  >
    {/* Background warm disc */}
    <circle cx="80" cy="60" r="48" fill="var(--sand)" opacity="0.6" />

    {/* Modern Laptop Workstation on Left */}
    {/* Screen */}
    <rect x="35" y="45" width="46" height="30" rx="3" fill="var(--sand)" stroke="var(--ink)" strokeWidth="2" />
    <rect x="39" y="49" width="38" height="22" rx="1" fill="var(--paper)" />
    {/* Code lines on screen */}
    <line x1="43" y1="55" x2="60" y2="55" stroke="var(--ghats)" strokeWidth="2" strokeLinecap="round" />
    <line x1="43" y1="60" x2="70" y2="60" stroke="var(--kumkuma)" strokeWidth="2" strokeLinecap="round" />
    <line x1="43" y1="65" x2="52" y2="65" stroke="var(--turmeric)" strokeWidth="2" strokeLinecap="round" />

    {/* Laptop Base */}
    <path d="M28 75 L88 75 L84 79 L32 79 Z" fill="var(--muted)" stroke="var(--ink)" strokeWidth="1.5" />

    {/* South Indian Filter Coffee Davarah-Tumbler on Right in Brass/Turmeric */}
    {/* Davarah (bottom wide cup) */}
    <path
      d="M102 78 Q118 84 134 78 L130 86 Q118 90 106 86 Z"
      fill="var(--turmeric)"
      stroke="var(--ink)"
      strokeWidth="1.8"
    />
    {/* Tumbler (tall tapering glass) */}
    <path
      d="M110 56 L126 56 L124 78 L112 78 Z"
      fill="var(--turmeric)"
      stroke="var(--ink)"
      strokeWidth="1.8"
    />
    {/* Steaming Coffee Aroma lines */}
    <path
      d="M114 48 Q118 42 114 36"
      stroke="var(--kumkuma)"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M122 48 Q126 42 122 36"
      stroke="var(--kumkuma)"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Desk surface line */}
    <line x1="20" y1="88" x2="140" y2="88" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
