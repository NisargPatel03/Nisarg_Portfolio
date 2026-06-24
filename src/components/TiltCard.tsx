import React, { useRef, useState } from 'react';

interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;      // Max tilt angle in degrees
  perspective?: number;  // 3D perspective value in pixels
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  maxTilt = 8,
  perspective = 1000,
  className = '',
  style = {},
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({});
  const [sheenStyle, setSheenStyle] = useState<React.CSSProperties>({ opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // cursor X relative to card
    const y = e.clientY - rect.top;  // cursor Y relative to card
    
    // Normalize coordinates to ranges between -0.5 and 0.5
    const normX = (x / rect.width) - 0.5;
    const normY = (y / rect.height) - 0.5;

    // RotateX uses vertical movement, RotateY uses horizontal
    const rotateX = -normY * maxTilt;
    const rotateY = normX * maxTilt;

    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`,
      transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1)',
      transformStyle: 'preserve-3d',
    });

    // Glassmorphic sheen gradient tracking the cursor
    setSheenStyle({
      opacity: 1,
      background: `radial-gradient(circle 120px at ${x}px ${y}px, rgba(255, 255, 255, 0.08), transparent 75%)`,
      transition: 'opacity 0.2s ease',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    });
    setSheenStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease',
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
      style={{ ...style, ...tiltStyle }}
      {...props}
    >
      {/* Dynamic Sheen Overlay Layer */}
      <div 
        className="absolute inset-0 pointer-events-none z-10"
        style={sheenStyle}
      />
      {/* Inner container with preserve-3d to enable parallax depth on children */}
      <div className="relative h-full w-full flex flex-col justify-between" style={{ transform: 'translateZ(10px)' }}>
        {children}
      </div>
    </div>
  );
};
