import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export const ShoppingIllustration: React.FC<IllustrationProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Shopping and markets illustration"
  >
    {/* Background warm disc */}
    <circle cx="80" cy="60" r="48" fill="var(--sand)" opacity="0.6" />

    {/* Traditional Market Scale Balance Beam */}
    <line x1="45" y1="42" x2="115" y2="42" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
    <polygon points="80,32 83,42 77,42" fill="var(--turmeric)" />
    <circle cx="80" cy="32" r="3.5" fill="var(--turmeric)" />
    <line x1="80" y1="42" x2="80" y2="88" stroke="var(--ink)" strokeWidth="2.5" />
    <path d="M68 88 L92 88" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />

    {/* Left scale pan */}
    <line x1="50" y1="42" x2="40" y2="65" stroke="var(--muted)" strokeWidth="1.2" />
    <line x1="50" y1="42" x2="60" y2="65" stroke="var(--muted)" strokeWidth="1.2" />
    <path d="M36 65 Q50 72 64 65 Z" fill="var(--turmeric)" stroke="var(--ink)" strokeWidth="1.5" />

    {/* Right scale pan with silk cloth drape */}
    <line x1="110" y1="42" x2="100" y2="65" stroke="var(--muted)" strokeWidth="1.2" />
    <line x1="110" y1="42" x2="120" y2="65" stroke="var(--muted)" strokeWidth="1.2" />
    <path d="M96 65 Q110 72 124 65 Z" fill="var(--kumkuma)" stroke="var(--ink)" strokeWidth="1.5" />

    {/* Silk Saree Fabric Drape Accent */}
    <path
      d="M100 68 Q115 80 135 75 Q125 90 110 88 Z"
      fill="var(--kumkuma)"
      opacity="0.9"
    />
    <path d="M102 71 Q117 83 133 77" stroke="var(--turmeric)" strokeWidth="1.5" strokeDasharray="3 2" />

    {/* Little coconut / produce accent */}
    <circle cx="48" cy="62" r="5" fill="var(--ghats)" />
  </svg>
);
