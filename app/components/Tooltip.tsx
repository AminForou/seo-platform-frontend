import { useState, useRef, useEffect, ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
}

function Tooltip({ children, content }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (tooltipRef.current && childrenRef.current) {
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const rect = childrenRef.current.getBoundingClientRect();
      let x = rect.right + 10; // 10px offset from the right of the children
      let y = rect.top;

      // Adjust position if tooltip goes off screen
      if (x + tooltipWidth > windowWidth) {
        x = rect.left - tooltipWidth - 10;
      }
      if (y + tooltipHeight > windowHeight) {
        y = windowHeight - tooltipHeight - 10;
      }

      setPosition({ x, y });
    }
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
    updatePosition();
  };

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('mousemove', updatePosition);
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
    }
    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div
        ref={childrenRef}
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
            left: position ? `${position.x}px` : 'auto',
            top: position ? `${position.y}px` : 'auto',
            maxWidth: '250px',
            visibility: position ? 'visible' : 'hidden',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;