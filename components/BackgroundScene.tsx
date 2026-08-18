'use client';

import React from 'react';

export const BackgroundScene: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none select-none z-0">
      {/* 
        Responsive Layered Temple Sanctum Scene:
        Desktop & Mobile separate artwork compositions with deep golden brass, dusk hill gradients, 
        and Sabarimala 18-step sacred geometry.
      */}

      {/* Deep Sanctuary Atmosphere Gradient */}
      <div 
        className="absolute inset-0 bg-[#0c0905] transition-opacity duration-1000"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 50% 35%, rgba(212, 175, 55, 0.18) 0%, rgba(230, 81, 0, 0.12) 35%, rgba(18, 14, 10, 0.95) 75%, #080604 100%),
            linear-gradient(to bottom, rgba(8, 6, 4, 0.6) 0%, rgba(18, 14, 10, 0.4) 50%, rgba(8, 6, 4, 0.95) 100%)
          `,
        }}
      />

      {/* Desktop Sacred Visual Landscape (Hidden on Mobile) */}
      <div className="hidden md:block absolute inset-0 w-full h-full opacity-60">
        <svg 
          viewBox="0 0 1920 1080" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full object-cover preserve-3d"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="sanctumGlow" cx="50%" cy="40%" r="45%">
              <stop offset="0%" stopColor="#FFB300" stopOpacity="0.4" />
              <stop offset="40%" stopColor="#E65100" stopOpacity="0.2" />
              <stop offset="80%" stopColor="#2E0800" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            
            <linearGradient id="hillDusk" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1E140C" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#0A0704" stopOpacity="0.98" />
            </linearGradient>

            <linearGradient id="goldPillar" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5A3E1B" />
              <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#3D2912" />
            </linearGradient>
          </defs>

          {/* Central Sanctum Golden Halo */}
          <circle cx="960" cy="420" r="480" fill="url(#sanctumGlow)" />

          {/* Sabarimala Hill Forest Ridges at Dusk */}
          <path d="M0 650 Q 320 560, 680 630 T 1350 600 T 1920 680 L 1920 1080 L 0 1080 Z" fill="url(#hillDusk)" opacity="0.6" />
          <path d="M0 760 Q 450 680, 960 740 T 1920 730 L 1920 1080 L 0 1080 Z" fill="#120D08" opacity="0.8" />

          {/* Temple Pillars Left & Right */}
          <g opacity="0.25">
            <rect x="120" y="100" width="48" height="980" fill="url(#goldPillar)" />
            <rect x="220" y="140" width="32" height="940" fill="url(#goldPillar)" />
            <rect x="1668" y="140" width="32" height="940" fill="url(#goldPillar)" />
            <rect x="1752" y="100" width="48" height="980" fill="url(#goldPillar)" />
          </g>

          {/* Sacred Golden 18 Steps Silhouette Perspective */}
          <g opacity="0.35">
            {[...Array(18)].map((_, i) => {
              const y = 820 + i * 13;
              const w = 420 + i * 36;
              const x = 960 - w / 2;
              return (
                <path
                  key={i}
                  d={`M ${x} ${y} L ${x + w} ${y} L ${x + w + 12} ${y + 10} L ${x - 12} ${y + 10} Z`}
                  fill={i === 17 ? '#F5D77F' : '#D4AF37'}
                  fillOpacity={0.15 + (i / 18) * 0.4}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Mobile Sacred Visual Portrait (Hidden on Desktop) */}
      <div className="block md:hidden absolute inset-0 w-full h-full opacity-65">
        <svg 
          viewBox="0 0 450 850" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="mobileSanctum" cx="50%" cy="38%" r="55%">
              <stop offset="0%" stopColor="#FFB300" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#E65100" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#120A05" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="225" cy="320" r="280" fill="url(#mobileSanctum)" />

          {/* Mobile Hills */}
          <path d="M0 520 Q 120 460, 225 500 T 450 490 L 450 850 L 0 850 Z" fill="#1A120B" opacity="0.8" />
          <path d="M0 600 Q 180 550, 320 590 T 450 570 L 450 850 L 0 850 Z" fill="#0F0A06" opacity="0.95" />

          {/* Mobile 18 Steps */}
          <g opacity="0.35">
            {[...Array(18)].map((_, i) => {
              const y = 620 + i * 11;
              const w = 180 + i * 12;
              const x = 225 - w / 2;
              return (
                <rect
                  key={i}
                  x={x}
                  y={y}
                  width={w}
                  height={8}
                  rx={2}
                  fill="#D4AF37"
                  fillOpacity={0.15 + (i / 18) * 0.45}
                />
              );
            })}
          </g>
        </svg>
      </div>

      {/* Subtle Temple Arch Silhouette & Vignette Frame */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 120px 40px rgba(0, 0, 0, 0.85), inset 0 0 40px 10px rgba(230, 81, 0, 0.1)',
        }}
      />
    </div>
  );
};
