import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface FestiveCardProps {
  children: ReactNode;
  className?: string;
}

export function FestiveCard({ children, className }: FestiveCardProps) {
  return (
    <div
      className={cn(
        'relative bg-card rounded-xl shadow-lg border-2 border-christmas-gold/30 p-6 md:p-8',
        'before:absolute before:inset-0 before:rounded-xl before:border-4 before:border-christmas-green/10 before:pointer-events-none',
        className
      )}
    >
      {/* Corner decorations */}
      <div className="absolute -top-2 -left-2 w-6 h-6 text-christmas-gold text-xl">✦</div>
      <div className="absolute -top-2 -right-2 w-6 h-6 text-christmas-gold text-xl">✦</div>
      <div className="absolute -bottom-2 -left-2 w-6 h-6 text-christmas-gold text-xl">✦</div>
      <div className="absolute -bottom-2 -right-2 w-6 h-6 text-christmas-gold text-xl">✦</div>
      {children}
    </div>
  );
}
