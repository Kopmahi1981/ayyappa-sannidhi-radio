'use client';

import React, { useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

export const AmbientLayer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isPlaying, isDiyaGlowing } = useAudioPlayer();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle system: Sacred golden embers & incense smoke motes
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(245, 215, 127, ', // Gold
      'rgba(255, 153, 51, ',  // Saffron
      'rgba(255, 223, 140, ', // Warm cream
      'rgba(230, 81, 0, ',   // Deep orange
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.6,
        speedY: -(Math.random() * 0.5 + 0.15),
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        fadeSpeed: (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY * (isPlaying ? 1.4 : 1.0);
        p.x += p.speedX + Math.sin(p.y * 0.01) * 0.15;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.75) {
          p.opacity = 0.75;
          p.fadeSpeed = -Math.abs(p.fadeSpeed);
        } else if (p.opacity < 0.08) {
          p.opacity = 0.08;
          p.fadeSpeed = Math.abs(p.fadeSpeed);
        }

        // Reset when drifted out of view
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity.toFixed(2)})`;
        ctx.shadowColor = '#FF9933';
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying]);

  return (
    <>
      {/* Dynamic Incense & Ember Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-1"
      />

      {/* Diya Golden Glow Halo Overlay */}
      {isDiyaGlowing && (
        <div 
          className="absolute inset-0 pointer-events-none z-1 animate-diya-flicker mix-blend-screen opacity-70 transition-opacity duration-700"
          style={{
            background: 'radial-gradient(circle at 50% 45%, rgba(255, 179, 0, 0.14) 0%, rgba(230, 81, 0, 0.06) 40%, transparent 70%)',
          }}
        />
      )}
    </>
  );
};
