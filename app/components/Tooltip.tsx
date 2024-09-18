import { useState, useRef, useEffect, ReactNode, useCallback } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;  // Changed from string to ReactNode
}

function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setIsVisible(true);
    updatePosition(e as unknown as MouseEvent);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isVisible) {
      updatePosition(e);
    }
  }, [isVisible]);

  const updatePosition = useCallback((e: MouseEvent) => {
    if (tooltipRef.current) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let x = e.clientX + 10; // 10px offset from cursor
      let y = e.clientY + 10;

      // Adjust position if tooltip goes off screen
      if (x + tooltipWidth > windowWidth) {
        x = windowWidth - tooltipWidth - 10;
      }
      if (y + tooltipHeight > windowHeight) {
        y = windowHeight - tooltipHeight - 10;
      }

      setPosition({ x, y });
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('mousemove', handleMouseMove);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isVisible, handleMouseMove]);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 p-2 text-sm text-white bg-gray-800 rounded-lg shadow-lg"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            maxWidth: '250px',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;