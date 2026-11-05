import React from 'react';

interface IllustrationProps {
  className?: string;
  opacity?: number;
}

/**
 * Signature Bloom & Knowledge Hero Illustration:
 * Modern educational startup vector artwork featuring:
 * - Floating vibrant open book with curved pages
 * - Stacked colorful volumes (vibrant coral #F07857, cobalt blue #5478D4, sunshine yellow #F3C969, fresh teal #63AFA3)
 * - Modern minimalist study lamp with warm soft glow
 * - Sparking knowledge stars and mentorship connection arcs
 * - Floating notes and botanical laurel/leaf details
 */
export const HeroLibraryScene: React.FC<IllustrationProps> = ({
  className = '',
  opacity = 1,
}) => {
  return (
    <div
      className={`relative select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          {/* Ambient Warm Glow */}
          <radialGradient
            id="bloomLampGlow"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(320 180) rotate(70) scale(360 400)"
          >
            <stop stopColor="#F3C969" stopOpacity="0.25" />
            <stop offset="0.5" stopColor="#F9E3D9" stopOpacity="0.15" />
            <stop offset="1" stopColor="#FFF9F0" stopOpacity="0" />
          </radialGradient>

          {/* Book Gradients */}
          <linearGradient id="coralBook" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F07857" />
            <stop offset="100%" stopColor="#DE6240" />
          </linearGradient>

          <linearGradient id="cobaltBook" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5478D4" />
            <stop offset="100%" stopColor="#3E61BF" />
          </linearGradient>

          <linearGradient id="yellowBook" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F3C969" />
            <stop offset="100%" stopColor="#E2B34B" />
          </linearGradient>

          <linearGradient id="tealBook" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#63AFA3" />
            <stop offset="100%" stopColor="#4D968A" />
          </linearGradient>

          {/* Soft White Pages */}
          <linearGradient id="whitePage" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#FFF4E6" />
          </linearGradient>
        </defs>

        {/* Ambient Warm Aura */}
        <circle cx="400" cy="300" r="280" fill="url(#bloomLampGlow)" />

        {/* Abstract Mentorship Connection Arcs */}
        <path
          d="M 140 380 Q 280 180 500 240 T 700 320"
          stroke="#F3C969"
          strokeWidth="2.5"
          strokeDasharray="6 8"
          strokeOpacity="0.7"
        />
        <path
          d="M 200 420 Q 360 280 620 300"
          stroke="#5478D4"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          strokeOpacity="0.5"
        />

        {/* Knowledge Connection Nodes / Stars */}
        <g>
          {/* Node 1 */}
          <circle cx="280" cy="235" r="7" fill="#F07857" />
          <circle cx="280" cy="235" r="14" stroke="#F07857" strokeOpacity="0.3" strokeWidth="1.5" />
          {/* Node 2 */}
          <circle cx="500" cy="240" r="9" fill="#5478D4" />
          <circle cx="500" cy="240" r="18" stroke="#5478D4" strokeOpacity="0.3" strokeWidth="1.5" />
          {/* Node 3 */}
          <circle cx="620" cy="300" r="6" fill="#63AFA3" />
          <circle cx="620" cy="300" r="12" stroke="#63AFA3" strokeOpacity="0.3" strokeWidth="1.5" />
        </g>

        {/* Subtle Decorative Stars */}
        <g fill="#F3C969">
          {/* Star Top Left */}
          <path d="M 210 140 Q 210 155 195 155 Q 210 155 210 170 Q 210 155 225 155 Q 210 155 210 140 Z" />
          {/* Star Top Right */}
          <path d="M 640 160 Q 640 172 628 172 Q 640 172 640 184 Q 640 172 652 172 Q 640 172 640 160 Z" />
          {/* Star Mid */}
          <path d="M 460 120 Q 460 130 450 130 Q 460 130 460 140 Q 460 130 470 130 Q 460 130 460 120 Z" />
        </g>

        {/* Base Study Surface / Desk */}
        <rect x="100" y="490" width="600" height="12" rx="6" fill="#EAE2D8" />
        <rect x="140" y="502" width="520" height="3" fill="#D8CEBF" opacity="0.6" />

        {/* Modern Minimalist Desk Lamp (Left) */}
        <g transform="translate(140, 240)">
          {/* Lamp Base */}
          <path d="M 20 250 C 20 240 70 240 70 250 Z" fill="#202C45" />
          {/* Lamp Stem */}
          <path d="M 45 240 L 50 140 L 110 90" stroke="#202C45" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Joint Hinges */}
          <circle cx="50" cy="140" r="6" fill="#F3C969" />
          <circle cx="110" cy="90" r="6" fill="#F3C969" />
          {/* Lamp Shade */}
          <path d="M 95 70 L 140 100 L 120 125 L 75 95 Z" fill="#F07857" />
          {/* Inner Light Cone */}
          <polygon points="120,125 75,95 140,300 280,300" fill="url(#bloomLampGlow)" opacity="0.4" />
        </g>

        {/* Stacked Colorful Books (Center Left) */}
        <g transform="translate(260, 390)">
          {/* Bottom Teal Book */}
          <g>
            <rect x="0" y="70" width="180" height="28" rx="5" fill="url(#tealBook)" />
            <rect x="25" y="74" width="145" height="20" rx="3" fill="#FFFFFF" opacity="0.95" />
            <line x1="35" y1="79" x2="160" y2="79" stroke="#EAE2D8" strokeWidth="1.5" />
            <line x1="35" y1="84" x2="155" y2="84" stroke="#EAE2D8" strokeWidth="1.5" />
            <line x1="35" y1="89" x2="140" y2="89" stroke="#EAE2D8" strokeWidth="1.5" />
            {/* Spine detail */}
            <rect x="0" y="70" width="22" height="28" rx="4" fill="#4D968A" />
            <line x1="11" y1="75" x2="11" y2="93" stroke="#F3C969" strokeWidth="2" strokeDasharray="3 3" />
          </g>

          {/* Middle Cobalt Book */}
          <g transform="translate(10, -26)">
            <rect x="0" y="65" width="165" height="26" rx="5" fill="url(#cobaltBook)" />
            <rect x="22" y="69" width="135" height="18" rx="3" fill="#FFFFFF" opacity="0.95" />
            <line x1="32" y1="74" x2="148" y2="74" stroke="#EAE2D8" strokeWidth="1.5" />
            <line x1="32" y1="80" x2="135" y2="80" stroke="#EAE2D8" strokeWidth="1.5" />
            {/* Spine */}
            <rect x="0" y="65" width="20" height="26" rx="4" fill="#3E61BF" />
            {/* Ribbon Bookmark */}
            <path d="M 95 65 L 95 98 L 100 93 L 105 98 L 105 65 Z" fill="#F07857" />
          </g>

          {/* Top Yellow Book */}
          <g transform="translate(25, -50)">
            <rect x="0" y="60" width="140" height="22" rx="4" fill="url(#yellowBook)" />
            <rect x="20" y="64" width="112" height="14" rx="2" fill="#FFFFFF" opacity="0.95" />
            {/* Spine */}
            <rect x="0" y="60" width="18" height="22" rx="3" fill="#E2B34B" />
          </g>
        </g>

        {/* Signature Open Book (Center Right, Elevated) */}
        <g transform="translate(450, 340)">
          {/* Subtle Shadow */}
          <ellipse cx="140" cy="140" rx="140" ry="12" fill="#202C45" opacity="0.08" />

          {/* Hardbound Cover (Coral) */}
          <path
            d="M 15 115 Q 140 128 140 120 Q 140 128 265 115 L 265 125 Q 140 138 140 130 Q 140 138 15 125 Z"
            fill="url(#coralBook)"
          />

          {/* Left Page Curved */}
          <path
            d="M 140 120 C 100 115 50 100 20 85 L 20 115 C 50 128 100 132 140 125 Z"
            fill="url(#whitePage)"
            stroke="#EAE2D8"
            strokeWidth="1.5"
          />

          {/* Right Page Curved */}
          <path
            d="M 140 120 C 180 115 230 100 260 85 L 260 115 C 230 128 180 132 140 125 Z"
            fill="#FFFFFF"
            stroke="#EAE2D8"
            strokeWidth="1.5"
          />

          {/* Elegant Page Spine Fold */}
          <path d="M 138 60 L 138 126 L 142 126 L 142 60 Z" fill="#EAE2D8" />
          <path d="M 140 60 L 140 126" stroke="#5478D4" strokeWidth="1.5" />

          {/* Floating Flowing Upper Pages */}
          <path
            d="M 140 115 C 100 95 60 70 30 50 C 60 75 100 98 140 105 Z"
            fill="#FFFFFF"
            opacity="0.9"
            stroke="#EAE2D8"
            strokeWidth="1"
          />
          <path
            d="M 140 115 C 180 95 220 70 250 50 C 220 75 180 98 140 105 Z"
            fill="#FFFFFF"
            opacity="0.9"
            stroke="#EAE2D8"
            strokeWidth="1"
          />

          {/* Text/Notation Lines on Open Book */}
          {/* Left Lines */}
          <line x1="45" y1="95" x2="115" y2="108" stroke="#5478D4" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round" />
          <line x1="48" y1="102" x2="110" y2="114" stroke="#64748B" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
          <line x1="52" y1="109" x2="95" y2="120" stroke="#64748B" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />

          {/* Right Lines */}
          <line x1="165" y1="108" x2="235" y2="95" stroke="#F07857" strokeWidth="2" strokeOpacity="0.8" strokeLinecap="round" />
          <line x1="170" y1="114" x2="232" y2="102" stroke="#64748B" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
          <line x1="175" y1="120" x2="218" y2="109" stroke="#64748B" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />

          {/* Golden Bookmark Ribbon */}
          <path d="M 140 60 Q 145 90 152 140 L 157 135 L 162 140 Q 150 90 142 60 Z" fill="#F3C969" />
        </g>

        {/* Floating Sparks and Learning Symbols */}
        <g>
          {/* Floating Idea Spark */}
          <g transform="translate(560, 210)">
            <circle cx="15" cy="15" r="14" fill="#F9E3D9" />
            <path d="M 15 5 L 18 12 L 25 15 L 18 18 L 15 25 L 12 18 L 5 15 L 12 12 Z" fill="#F07857" />
          </g>

          {/* Floating Graph Connection Badge */}
          <g transform="translate(230, 160)">
            <rect x="0" y="0" width="34" height="34" rx="8" fill="#E5EDFC" stroke="#5478D4" strokeWidth="1.5" />
            <circle cx="11" cy="22" r="3.5" fill="#5478D4" />
            <circle cx="23" cy="12" r="3.5" fill="#F07857" />
            <line x1="11" y1="22" x2="23" y2="12" stroke="#202C45" strokeWidth="1.5" />
          </g>

          {/* Floating Degree Cap Motif */}
          <g transform="translate(650, 250)">
            <path d="M 2 12 L 20 4 L 38 12 L 20 20 Z" fill="#202C45" />
            <path d="M 10 16 L 10 24 C 10 27 30 27 30 24 L 30 16" fill="none" stroke="#202C45" strokeWidth="2" />
            <line x1="34" y1="13" x2="36" y2="25" stroke="#F3C969" strokeWidth="2" strokeLinecap="round" />
            <circle cx="36" cy="25" r="2" fill="#F3C969" />
          </g>
        </g>
      </svg>
    </div>
  );
};

/**
 * Open Book Motif (Compact vector for cards and headers)
 */
export const OpenBookMotif: React.FC<IllustrationProps> = ({
  className = '',
  opacity = 1,
}) => {
  return (
    <svg
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {/* Cover */}
      <path
        d="M 10 55 C 30 62 55 58 60 52 C 65 58 90 62 110 55 L 110 60 C 90 67 65 63 60 57 C 55 63 30 67 10 60 Z"
        fill="#F07857"
      />
      {/* Left Page */}
      <path
        d="M 60 52 C 45 48 25 35 12 25 L 12 52 C 25 60 45 60 60 56 Z"
        fill="#FFFFFF"
        stroke="#EAE2D8"
        strokeWidth="1.5"
      />
      {/* Right Page */}
      <path
        d="M 60 52 C 75 48 95 35 108 25 L 108 52 C 95 60 75 60 60 56 Z"
        fill="#FFFFFF"
        stroke="#EAE2D8"
        strokeWidth="1.5"
      />
      {/* Center Spine */}
      <line x1="60" y1="20" x2="60" y2="56" stroke="#5478D4" strokeWidth="1.5" />
      {/* Bookmark */}
      <path d="M 60 20 Q 62 35 66 62 L 69 58 L 72 62 Q 65 35 61 20 Z" fill="#F3C969" />
      {/* Page lines */}
      <line x1="24" y1="38" x2="48" y2="44" stroke="#5478D4" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
      <line x1="26" y1="44" x2="45" y2="49" stroke="#64748B" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
      <line x1="72" y1="44" x2="96" y2="38" stroke="#F07857" strokeWidth="1.5" strokeOpacity="0.6" strokeLinecap="round" />
      <line x1="75" y1="49" x2="94" y2="44" stroke="#64748B" strokeWidth="1.2" strokeOpacity="0.4" strokeLinecap="round" />
    </svg>
  );
};

/**
 * Stacked Colorful Books Motif
 */
export const BookStackMotif: React.FC<IllustrationProps> = ({
  className = '',
  opacity = 1,
}) => {
  return (
    <svg
      viewBox="0 0 100 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      {/* Bottom Teal Book */}
      <rect x="10" y="52" width="80" height="15" rx="3" fill="#63AFA3" />
      <rect x="22" y="54" width="65" height="11" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="10" y="52" width="12" height="15" rx="2" fill="#4D968A" />

      {/* Middle Cobalt Book */}
      <rect x="15" y="34" width="70" height="15" rx="3" fill="#5478D4" />
      <rect x="25" y="36" width="57" height="11" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="15" y="34" width="10" height="15" rx="2" fill="#3E61BF" />
      {/* Bookmark */}
      <path d="M 55 34 L 55 52 L 58 48 L 61 52 L 61 34 Z" fill="#F07857" />

      {/* Top Yellow Book */}
      <rect x="22" y="16" width="58" height="15" rx="3" fill="#F3C969" />
      <rect x="30" y="18" width="47" height="11" rx="2" fill="#FFFFFF" opacity="0.9" />
      <rect x="22" y="16" width="8" height="15" rx="2" fill="#E2B34B" />

      {/* Spark on top */}
      <path d="M 68 8 L 70 12 L 74 14 L 70 16 L 68 20 L 66 16 L 62 14 L 66 12 Z" fill="#F07857" />
    </svg>
  );
};

/**
 * Minimalist Study Desk Lamp Motif
 */
export const DeskLampMotif: React.FC<IllustrationProps> = ({
  className = '',
  opacity = 1,
}) => {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none ${className}`}
      style={{ opacity }}
    >
      <path d="M 15 72 C 15 68 45 68 45 72 Z" fill="#202C45" />
      <path d="M 30 68 L 34 38 L 55 24" stroke="#202C45" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="34" cy="38" r="3.5" fill="#F3C969" />
      <circle cx="55" cy="24" r="3.5" fill="#F3C969" />
      <path d="M 48 16 L 68 28 L 58 38 L 38 26 Z" fill="#F07857" />
      {/* Light glow cone */}
      <polygon points="58,38 38,26 40,75 75,75" fill="#F3C969" opacity="0.2" />
    </svg>
  );
};

/**
 * Subtle Decorative Header Illustration for Authenticated Dashboard
 */
export const DashboardHeaderIllustration: React.FC<IllustrationProps> = ({
  className = '',
  opacity = 0.85,
}) => {
  return (
    <div
      className={`select-none pointer-events-none overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 320 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <radialGradient id="dashGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 60) scale(120)">
            <stop stopColor="#F3C969" stopOpacity="0.25" />
            <stop offset="0.6" stopColor="#F9E3D9" stopOpacity="0.1" />
            <stop offset="1" stopColor="#FFF9F0" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="260" cy="60" r="80" fill="url(#dashGlow)" />

        {/* Abstract connecting dashed arc */}
        <path d="M 10 90 Q 120 20 230 50 T 310 70" stroke="#F3C969" strokeWidth="2" strokeDasharray="4 6" opacity="0.7" />
        <path d="M 60 100 Q 180 40 280 60" stroke="#5478D4" strokeWidth="1.5" strokeDasharray="3 5" opacity="0.5" />

        {/* Nodes */}
        <circle cx="120" cy="38" r="4.5" fill="#F07857" />
        <circle cx="120" cy="38" r="9" stroke="#F07857" strokeOpacity="0.3" strokeWidth="1.5" />
        <circle cx="230" cy="50" r="5" fill="#5478D4" />
        <circle cx="230" cy="50" r="10" stroke="#5478D4" strokeOpacity="0.3" strokeWidth="1.5" />

        {/* Open Book in Corner */}
        <g transform="translate(230, 45) scale(0.65)">
          <path d="M 10 55 C 30 62 55 58 60 52 C 65 58 90 62 110 55 L 110 60 C 90 67 65 63 60 57 C 55 63 30 67 10 60 Z" fill="#F07857" />
          <path d="M 60 52 C 45 48 25 35 12 25 L 12 52 C 25 60 45 60 60 56 Z" fill="#FFFFFF" stroke="#EAE2D8" strokeWidth="1.5" />
          <path d="M 60 52 C 75 48 95 35 108 25 L 108 52 C 95 60 75 60 60 56 Z" fill="#FFFFFF" stroke="#EAE2D8" strokeWidth="1.5" />
          <line x1="60" y1="20" x2="60" y2="56" stroke="#5478D4" strokeWidth="1.5" />
          <path d="M 60 20 Q 62 35 66 62 L 69 58 L 72 62 Q 65 35 61 20 Z" fill="#F3C969" />
        </g>

        {/* Star */}
        <path d="M 180 20 Q 180 26 174 26 Q 180 26 180 32 Q 180 26 186 26 Q 180 26 180 20 Z" fill="#F3C969" />
      </svg>
    </div>
  );
};
