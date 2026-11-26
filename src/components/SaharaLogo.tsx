import React from 'react';

interface SaharaLogoProps {
  showTagline?: boolean;
  inverted?: boolean;
  iconOnly?: boolean;
  className?: string;
}

/**
 * Sahara Senior Care Brand Mark:
 * Two caring hands (Deep Trust Blue #1A5276) supporting a vibrant leaf/heart (Care Green #239B56).
 */
export const SaharaMark: React.FC<{ className?: string; inverted?: boolean }> = ({
  className = 'w-9 h-9',
  inverted = false,
}) => {
  const handStroke = inverted ? '#FFFFFF' : '#1A5276';
  const leafFill = inverted ? '#239B56' : '#239B56';
  const leafStroke = inverted ? '#D5F5E3' : '#1A5276';

  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M8 23.5C8 33 14.5 40 24 41.8C33.5 40 40 33 40 23.5C40 20 37.6 18.2 35.2 20C32.5 22 32 27.2 29.5 30.6C27.6 33.2 25.2 34.5 24 34.5C22.8 34.5 20.4 33.2 18.5 30.6C16 27.2 15.5 22 12.8 20C10.4 18.2 8 20 8 23.5Z"
        stroke={handStroke}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 28.5C28 26.6 30.2 22.8 30.2 18.2C30.2 14.2 27.6 10.8 24 8.2C20.4 10.8 17.8 14.2 17.8 18.2C17.8 22.8 20 26.6 24 28.5Z"
        fill={leafFill}
        stroke={leafStroke}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M24 14.5V26"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const SaharaLogo: React.FC<SaharaLogoProps> = ({
  showTagline = false,
  inverted = false,
  iconOnly = false,
  className = '',
}) => {
  const titleColor = inverted ? 'text-white' : 'text-[#1A5276]';
  const taglineColor = inverted ? 'text-slate-300' : 'text-[#475569]';

  if (iconOnly) {
    return <SaharaMark className={`w-9 h-9 ${className}`} inverted={inverted} />;
  }

  if (!showTagline) {
    return (
      <span className={`inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 ${className}`}>
        <SaharaMark className="w-8 h-8 shrink-0" inverted={inverted} />
        <span className={`font-display text-lg font-bold tracking-tight ${titleColor}`}>
          Sahara Senior Care
        </span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-start gap-3 ${className}`}>
      <SaharaMark className="w-10 h-10 shrink-0 mt-0.5" inverted={inverted} />
      <div className="min-w-0">
        <div className={`font-display text-lg font-bold tracking-tight leading-snug ${titleColor}`}>
          Sahara Senior Care
        </div>
        <p className={`text-xs leading-relaxed mt-0.5 ${taglineColor}`}>
          Compassionate Care. Trusted Support. Peace of Mind.
        </p>
      </div>
    </div>
  );
};
