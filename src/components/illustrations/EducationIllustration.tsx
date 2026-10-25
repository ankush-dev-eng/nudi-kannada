import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export const EducationIllustration: React.FC<IllustrationProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Education and college illustration"
  >
    {/* Background warm disc */}
    <circle cx="80" cy="60" r="48" fill="var(--sand)" opacity="0.6" />

    {/* Open Book Pages */}
    <path
      d="M35 78 C50 72 70 73 80 82 C90 73 110 72 125 78 L125 45 C110 40 90 41 80 50 C70 41 50 40 35 45 Z"
      fill="var(--paper)"
      stroke="var(--ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Book Spine Center */}
    <line x1="80" y1="50" x2="80" y2="82" stroke="var(--ink)" strokeWidth="2" />

    {/* Book Cover Edge */}
    <path
      d="M33 80 C49 74 69 75 80 84 C91 75 111 74 127 80"
      stroke="var(--kumkuma)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />

    {/* Kannada Letter 'ಅ' rendered cleanly as paths */}
    <text
      x="54"
      y="65"
      fill="var(--kumkuma)"
      fontSize="20"
      fontFamily="var(--font-kannada-serif)"
      fontWeight="bold"
      textAnchor="middle"
    >
      ಅ
    </text>

    {/* Traditional Quill / Pen on right page */}
    <path
      d="M106 36 Q116 38 114 58 L98 68 L104 60 Z"
      fill="var(--turmeric)"
      stroke="var(--ink)"
      strokeWidth="1.2"
    />
    <line x1="98" y1="68" x2="94" y2="72" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />

    {/* Scholarly bookmark ribbon */}
    <path d="M80 50 L80 90 L85 86 L90 90 L90 50" fill="var(--turmeric)" opacity="0.8" />
  </svg>
);
