import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export const HealthcareIllustration: React.FC<IllustrationProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Healthcare and clinical illustration"
  >
    {/* Background warm disc */}
    <circle cx="80" cy="60" r="48" fill="var(--sand)" opacity="0.6" />

    {/* Traditional Mortar & Pestle in Ghats Green */}
    <path
      d="M55 58 Q80 50 105 58 L100 85 Q80 92 60 85 Z"
      fill="var(--ghats)"
      stroke="var(--ink)"
      strokeWidth="2"
    />
    {/* Rim */}
    <ellipse cx="80" cy="58" rx="25" ry="6" fill="var(--sand)" stroke="var(--ink)" strokeWidth="2" />

    {/* Pestle angled */}
    <path
      d="M88 35 L72 65"
      stroke="var(--turmeric)"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <circle cx="88" cy="35" r="4" fill="var(--turmeric)" />

    {/* Ayurvedic Tulsi Leaf sprout */}
    <path
      d="M80 52 C70 42 62 44 65 30 C78 30 84 42 80 52 Z"
      fill="var(--ghats)"
      stroke="var(--ink)"
      strokeWidth="1.2"
    />
    <path
      d="M80 52 C90 42 98 44 95 30 C82 30 76 42 80 52 Z"
      fill="var(--ghats)"
      opacity="0.8"
      stroke="var(--ink)"
      strokeWidth="1.2"
    />

    {/* Clinical Healthcare Cross in Kumkuma */}
    <g transform="translate(112, 68)">
      <rect x="-3" y="-10" width="6" height="20" rx="2" fill="var(--kumkuma)" />
      <rect x="-10" y="-3" width="20" height="6" rx="2" fill="var(--kumkuma)" />
    </g>
  </svg>
);
