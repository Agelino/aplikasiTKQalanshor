import React, { useState } from 'react';
import { PredikatQuran, AssessmentScore } from '../../types';

export const predikatQuranToStars = (predikat?: PredikatQuran): number => {
  switch (predikat) {
    case 'Mumtaz':
      return 4;
    case 'Jayyid Jiddan':
      return 3;
    case 'Jayyid':
      return 2;
    case 'Maqbul':
      return 1;
    default:
      return 3;
  }
};

export const starsToPredikatQuran = (stars: number): PredikatQuran => {
  switch (stars) {
    case 4:
      return 'Mumtaz';
    case 3:
      return 'Jayyid Jiddan';
    case 2:
      return 'Jayyid';
    case 1:
      return 'Maqbul';
    default:
      return 'Jayyid Jiddan';
  }
};

export const merdekaScoreToStars = (score?: AssessmentScore): number => {
  switch (score) {
    case 'BSB':
      return 4;
    case 'BSH':
      return 3;
    case 'MB':
      return 2;
    case 'BB':
      return 1;
    default:
      return 3;
  }
};

export const starsToMerdekaScore = (stars: number): AssessmentScore => {
  switch (stars) {
    case 4:
      return 'BSB';
    case 3:
      return 'BSH';
    case 2:
      return 'MB';
    case 1:
      return 'BB';
    default:
      return 'BSH';
  }
};

interface StarDisplayProps {
  stars: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textPrefix?: string;
  className?: string;
}

export const StarDisplay: React.FC<StarDisplayProps> = ({
  stars = 0,
  max = 4,
  size = 'sm',
  showText = false,
  textPrefix = '',
  className = '',
}) => {
  const sizeMap = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };

  const getLabel = (count: number) => {
    switch (count) {
      case 4:
        return '4 Bintang (Mumtaz / BSB)';
      case 3:
        return '3 Bintang (Jayyid Jiddan / BSH)';
      case 2:
        return '2 Bintang (Jayyid / MB)';
      case 1:
        return '1 Bintang (Maqbul / BB)';
      default:
        return `${count} Bintang`;
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < stars;
          return (
            <svg
              key={i}
              className={`${sizeMap[size]} ${
                filled
                  ? 'text-amber-400 fill-amber-400 drop-shadow-[0_1px_1px_rgba(245,158,11,0.35)]'
                  : 'text-slate-200 fill-slate-100'
              } transition-colors`}
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
      </div>
      {showText && (
        <span className="text-[10px] font-bold text-amber-900 bg-amber-50/90 px-1.5 py-0.5 rounded border border-amber-200/80 whitespace-nowrap">
          {textPrefix ? `${textPrefix} ` : ''}{getLabel(stars)}
        </span>
      )}
    </div>
  );
};

interface StarInputProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const StarInput: React.FC<StarInputProps> = ({
  value = 0,
  onChange,
  max = 4,
  size = 'md',
  label,
  className = '',
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeMap = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const activeValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {label && <span className="text-xs font-semibold text-slate-700">{label}:</span>}
      <div
        className="flex items-center gap-1 cursor-pointer select-none py-0.5 px-1 rounded-lg bg-amber-50/50 hover:bg-amber-50 border border-amber-200/60 transition-colors"
        onMouseLeave={() => setHoverValue(null)}
        title={`Klik untuk memberi rating ${value} dari ${max} bintang`}
      >
        {Array.from({ length: max }).map((_, i) => {
          const starNumber = i + 1;
          const isFilled = starNumber <= activeValue;

          return (
            <button
              key={i}
              type="button"
              onClick={() => onChange(starNumber)}
              onMouseEnter={() => setHoverValue(starNumber)}
              className="p-0.5 rounded hover:scale-115 transition-transform focus:outline-none"
            >
              <svg
                className={`${sizeMap[size]} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_1px_2px_rgba(245,158,11,0.4)]'
                    : 'text-slate-300 fill-slate-100 hover:text-amber-200 hover:fill-amber-100'
                } transition-colors`}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          );
        })}
      </div>
      <span className="text-[11px] font-bold text-amber-900 bg-amber-100/70 px-1.5 py-0.5 rounded border border-amber-200">
        {value} ★
      </span>
    </div>
  );
};
