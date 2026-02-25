'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gold-300 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 bg-dark-800 border border-dark-500 rounded-lg text-[#f5f0e1] placeholder-dark-500/70',
            'focus:outline-none focus:ring-2 focus:ring-gold-500/50 focus:border-gold-500/50',
            'transition-all duration-200',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
