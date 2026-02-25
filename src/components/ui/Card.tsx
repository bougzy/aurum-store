import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-dark-800 border border-dark-600 rounded-xl p-6',
        hover && 'hover:border-gold-500/30 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300',
        className
      )}
    >
      {children}
    </div>
  );
}
