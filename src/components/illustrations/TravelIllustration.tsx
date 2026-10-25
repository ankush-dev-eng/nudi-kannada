import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export const TravelIllustration: React.FC<IllustrationProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Travel and exploration illustration"
  >
    {/* Background warm disc */}
    <circle cx="80" cy="60" r="48" fill="var(--sand)" opacity="0.6" />

    {/* Kempegowda Watchtower / Heritage Pavilion outline */}
    <path
      d="M50 85 L50 62 L60 52 L60 40 L80 25 L100 40 L100 52 L110 62 L110 85 Z"
      fill="none"
      stroke="var(--kumkuma)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Tower Pillar and arch */}
    <path
      d="M70 85 L70 65 Q80 58 90 65 L90 85"
      fill="var(--sand)"
      stroke="var(--kumkuma)"
      strokeWidth="2"
    />

    {/* Kalasha / Spire on top */}
    <line
      x1="80"
      y1="25"
      x2="80"
      y2="15"
      stroke="var(--turmeric)"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <circle cx="80" cy="14" r="3" fill="var(--turmeric)" />

    {/* Road and milestone */}
    <path d="M25 95 Q80 88 135 95" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M30 94 L30 80 Q37 72 44 80 L44 94 Z"
      fill="var(--paper)"
      stroke="var(--ghats)"
      strokeWidth="2"
    />
    <path d="M30 84 L44 84" stroke="var(--kumkuma)" strokeWidth="2" />

    {/* Sun accent */}
    <circle cx="118" cy="35" r="9" fill="var(--turmeric)" opacity="0.85" />
  </svg>
);
