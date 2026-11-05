import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  minimal?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  minimal = false,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className="flex items-center gap-2.5">
      {/* Modern Education Startup Logo Mark */}
      <div
        className={`${iconSizes[size]} rounded-xl bg-gradient-to-br from-[#F07857] to-[#DE6240] text-white flex items-center justify-center relative overflow-hidden shadow-xs shrink-0 border border-[#F07857]/30`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="w-4 h-4 text-white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Open book spine & wings */}
          <path d="M4 19.5v-13A2.5 2.5 0 0 1 6.5 4H12v15H6.5A2.5 2.5 0 0 0 4 19.5" />
          <path d="M20 19.5v-13A2.5 2.5 0 0 0 17.5 4H12v15h5.5A2.5 2.5 0 0 1 20 19.5" />
          {/* Sunshine yellow spark */}
          <path d="M12 4v5" stroke="#F3C969" strokeWidth="2.5" />
        </svg>
      </div>

      {!minimal && (
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`font-heading font-black tracking-tight text-[#202C45] ${textSizes[size]}`}>
              MENTORA
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-[#E5EDFC] text-[#5478D4] border border-[#5478D4]/20">
              PRO
            </span>
          </div>
          {showSubtitle && (
            <p className="text-[11px] font-medium text-[#64748B] tracking-tight leading-none mt-0.5">
              Better Connections. Smarter Mentorship.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
