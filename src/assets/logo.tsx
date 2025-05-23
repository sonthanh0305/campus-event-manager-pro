
import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const PTITLogo: React.FC<LogoProps> = ({ className, size = 32 }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d="M50 0C22.4 0 0 22.4 0 50C0 77.6 22.4 100 50 100C77.6 100 100 77.6 100 50C100 22.4 77.6 0 50 0Z" 
          fill="#1E88E5"
        />
        <path 
          d="M65 25H35C32.2386 25 30 27.2386 30 30V70C30 72.7614 32.2386 75 35 75H65C67.7614 75 70 72.7614 70 70V30C70 27.2386 67.7614 25 65 25Z" 
          fill="white"
        />
        <path 
          d="M42 40H58V45H42V40ZM42 50H58V55H42V50ZM42 60H58V65H42V60Z" 
          fill="#D32F2F"
        />
      </svg>
      <span className="ml-2 font-bold tracking-tight">PTITHCM</span>
    </div>
  );
};

// Add export for Logo to fix the import issue in MainNavigation
export const Logo = PTITLogo;

