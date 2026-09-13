import React, { useRef, useState, useCallback } from 'react';

export const ThreeDCard = ({
  children,
  className = '',
  maxRotation = 10,
  glare = true,
  scale = 1.02,
  depth = 15,
  onClick,
  style = {}
}) => {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState({
    transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
    transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease'
  });
  const [glareStyle, setGlareStyle] = useState({
    opacity: 0,
    background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 65%)'
  });

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxRotation;
    const rotateY = ((x - centerX) / centerX) * maxRotation;

    setTransformStyle({
      transform: `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${depth}px) scale3d(${scale}, ${scale}, 1)`,
      transition: 'transform 0.1s ease-out, box-shadow 0.1s ease-out'
    });

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.65,
        background: `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 35%, transparent 70%)`
      });
    }
  }, [maxRotation, depth, scale, glare]);

  const handleTouchMove = useCallback((e) => {
    if (!cardRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -(maxRotation * 0.75);
    const rotateY = ((x - centerX) / centerX) * (maxRotation * 0.75);

    setTransformStyle({
      transform: `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(${depth * 0.5}px) scale3d(1.01, 1.01, 1)`,
      transition: 'transform 0.1s ease-out'
    });
  }, [maxRotation, depth]);

  const handleMouseLeave = useCallback(() => {
    setTransformStyle({
      transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease'
    });
    setGlareStyle(prev => ({
      ...prev,
      opacity: 0
    }));
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      onClick={onClick}
      style={{
        ...transformStyle,
        ...style,
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      className={`relative overflow-hidden ${className}`}
    >

      {glare && (
        <div
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-inherit"
          style={{
            ...glareStyle,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      <div className="relative z-10 h-full w-full" style={{ transformStyle: 'preserve-3d' }}>
        {children}
      </div>
    </div>
  );
};

