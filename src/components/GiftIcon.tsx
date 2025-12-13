import { cn } from '@/lib/utils';

interface GiftIconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GiftIcon({ className, size = 'md' }: GiftIconProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className={cn('relative float-animation', sizeClasses[size], className)}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Box body */}
        <rect
          x="10"
          y="40"
          width="80"
          height="55"
          rx="4"
          className="fill-christmas-red"
        />
        {/* Box lid */}
        <rect
          x="5"
          y="30"
          width="90"
          height="15"
          rx="3"
          className="fill-christmas-red-light"
        />
        {/* Vertical ribbon */}
        <rect
          x="45"
          y="30"
          width="10"
          height="65"
          className="fill-christmas-gold"
        />
        {/* Horizontal ribbon */}
        <rect
          x="10"
          y="55"
          width="80"
          height="10"
          className="fill-christmas-gold"
        />
        {/* Bow center */}
        <circle
          cx="50"
          cy="25"
          r="8"
          className="fill-christmas-gold"
        />
        {/* Bow left */}
        <ellipse
          cx="35"
          cy="22"
          rx="12"
          ry="8"
          className="fill-christmas-gold-light"
        />
        {/* Bow right */}
        <ellipse
          cx="65"
          cy="22"
          rx="12"
          ry="8"
          className="fill-christmas-gold-light"
        />
      </svg>
    </div>
  );
}
