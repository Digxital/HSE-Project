import React from 'react';
import { cn } from '@/utils/className';
import logoImage from '@/assets/images/aegix-logo.png'; // Update extension if needed (.svg, .jpg, etc.)

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <img 
      src={logoImage} 
      alt="Aegix Logo" 
      className={cn(sizes[size], className)}
    />
  );
};