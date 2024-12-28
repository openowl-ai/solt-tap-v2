import { useCallback } from 'react';

export const useCircleInteraction = () => {
  const handleClick = useCallback((
    e: React.MouseEvent,
    onClick?: (e: React.MouseEvent) => void
  ) => {
    // Prevent event bubbling
    e.stopPropagation();
    
    // Call the provided onClick handler
    onClick?.(e);
  }, []);

  return { handleClick };
};
