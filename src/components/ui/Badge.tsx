import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'red' | 'yellow' | 'gray';
  className?: string;
}

export default function Badge({ children, variant = 'gold', className }: BadgeProps) {
  const variants = {
    gold: 'bg-gold-500/10 text-gold-400 border-gold-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    gray: 'bg-dark-600 text-dark-500/80 border-dark-500/20',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
