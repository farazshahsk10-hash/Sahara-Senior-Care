import React, { useState } from 'react';
import { HeartHandshake } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#D5F5E3]/55 via-[#EBF5FB] to-[#1A5276]/10 text-[#1A5276] p-6 text-center ${className}`}
      >
        <HeartHandshake className="w-8 h-8 mb-2 opacity-80" strokeWidth={1.6} />
        <p className="text-xs font-medium text-[#475569] max-w-[22ch]">
          {fallbackLabel || alt}
        </p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
