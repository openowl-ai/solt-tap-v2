import React from 'react';
import { CircleProps } from './types';
import { useCircleInteraction } from './useCircleInteraction';

export const Circle: React.FC<CircleProps> = ({
  size = 100,
  onClick,
  className = '',
  children,
  expandClickArea = 1.15, // 15% larger clickable area by default
}) => {
  const { handleClick } = useCircleInteraction();

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Invisible clickable area */}
      <div
        className="absolute rounded-full cursor-pointer"
        style={{
          width: `${size * expandClickArea}px`,
          height: `${size * expandClickArea}px`,
          left: `${(size * (1 - expandClickArea)) / 2}px`,
          top: `${(size * (1 - expandClickArea)) / 2}px`,
        }}
        onClick={(e) => handleClick(e, onClick)}
      />
      {/* Visible circle content */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          backgroundColor: 'transparent',
        }}
      >
        {children}
      </div>
    </div>
  );
};
