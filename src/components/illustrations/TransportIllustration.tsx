import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

export const TransportIllustration: React.FC<IllustrationProps> = ({ className, size = 120 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 160 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Transport and autorickshaw illustration"
  >
    {/* Background warm disc */}
    <circle cx="80" cy="60" r="48" fill="var(--sand)" opacity="0.6" />

    {/* Bengaluru Autorickshaw Outline */}
    {/* Upper yellow canopy */}
    <path
      d="M45 52 Q60 36 100 36 L118 52 Z"
      fill="var(--turmeric)"
      stroke="var(--ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Windshield */}
    <path
      d="M100 40 L115 54 L92 54 L85 40 Z"
      fill="var(--paper)"
      stroke="var(--ink)"
      strokeWidth="1.5"
    />

    {/* Lower Green Body */}
    <path
      d="M40 52 L120 52 L122 75 L112 80 L52 80 L40 70 Z"
      fill="var(--ghats)"
      stroke="var(--ink)"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Passenger entrance cutout */}
    <rect x="62" y="55" width="26" height="24" rx="2" fill="var(--sand)" stroke="var(--ink)" strokeWidth="1.5" />

    {/* Front Headlight */}
    <circle cx="122" cy="64" r="5" fill="var(--turmeric)" stroke="var(--ink)" strokeWidth="1.5" />
    <path d="M127 64 L138 60 M127 66 L139 66 M127 68 L137 72" stroke="var(--turmeric)" strokeWidth="1.5" />

    {/* Front Wheel */}
    <circle cx="112" cy="84" r="11" fill="var(--ink)" />
    <circle cx="112" cy="84" r="5" fill="var(--sand)" />

    {/* Back Wheel */}
    <circle cx="52" cy="84" r="11" fill="var(--ink)" />
    <circle cx="52" cy="84" r="5" fill="var(--sand)" />

    {/* Road ground line */}
    <line x1="25" y1="95" x2="135" y2="95" stroke="var(--line)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
