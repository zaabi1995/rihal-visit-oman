'use client';

import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function Badge({ children, active = false, onClick, className = '' }: BadgeProps) {
  const base = 'text-xs px-3 py-1.5 rounded-full font-medium transition-all duration-200';
  const colors = active
    ? 'bg-teal text-white shadow-sm'
    : 'bg-teal/10 text-teal hover:bg-teal/20';
  const clickable = onClick ? 'cursor-pointer' : '';

  return onClick ? (
    <button type="button" className={`${base} ${colors} ${clickable} ${className}`} onClick={onClick}>
      {children}
    </button>
  ) : (
    <span className={`${base} ${colors} ${className}`}>{children}</span>
  );
}
