'use client';

import React from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { playTempleBell } from '@/lib/bellSynthesizer';
import { Flame, Sparkles, Volume2, Disc3, ShieldCheck } from 'lucide-react';

export const ShrineCenter: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    togglePlayPause,
    hasUserInteracted,
    startAudioExperience,
    isDiyaGlowing,
    setIsDiyaGlowing,
  } = useAudioPlayer();

  const handleCenterClick = () => {
    playTempleBell(587.33, 4.5);
    if (!hasUserInteracted) {
      startAudioExperience();
    } else {
      setIsDiyaGlowing((prev) => !prev);
    }
  };

  return (
    <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-2 text-center select-none overflow-hidden max-h-[calc(100dvh-170px)]">
      
      {/* Sacred Sanctum Divine Aura */}
      <div className="relative flex items-center justify-center my-auto">
        
        {/* Animated Radiant Rings */}
        <div 
          className={`absolute w-64 h-64 md:w-96 md:h-96 rounded-full border border-[#D4AF37]/20 transition-all duration-1000 ${
            isPlaying ? 'scale-110 opacity-70 animate-spin-slow' : 'scale-95 opacity-30'
          }`}
          style={{ borderStyle: 'dashed' }}
        />

        <div 
          className={`absolute w-52 h-52 md:w-80 md:h-80 rounded-full bg-gradient-to-tr from-[#FF9933]/15 via-[#D4AF37]/20 to-transparent blur-2xl transition-transform duration-700 ${
            isPlaying ? 'scale-125 opacity-80' : 'scale-90 opacity-40'
          }`}
        />

        {/* Central Nilavilakku (Sacred Diya) & Sanctum Insignia */}
        <div 
          onClick={handleCenterClick}
          className="group relative cursor-pointer flex flex-col items-center justify-center w-36 h-36 md:w-48 md:h-48 rounded-full bg-gradient-to-b from-[#2A1C0E]/90 to-[#120B04]/95 border-2 border-[#D4AF37]/60 shadow-[0_0_50px_rgba(212,175,55,0.25)] hover:border-[#F5D77F] hover:shadow-[0_0_70px_rgba(255,153,51,0.45)] transition-all duration-500 transform hover:scale-105 active:scale-95"
        >
          {/* Flame Icon */}
          <div className="relative flex items-center justify-center">
            <Flame 
              className={`w-12 h-12 md:w-16 md:h-16 text-[#FF9933] drop-shadow-[0_0_15px_#FF9933] transition-transform duration-300 ${
                isPlaying ? 'animate-bounce-subtle text-[#FFB300]' : 'text-amber-500'
              }`} 
            />
            {isDiyaGlowing && (
              <span className="absolute -top-1 w-4 h-4 rounded-full bg-yellow-200 blur-sm animate-ping opacity-75" />
            )}
          </div>

          <span className="mt-1 text-[10px] md:text-xs font-serif tracking-widest text-[#F5D77F] uppercase font-bold">
            స్వామియే శరణం
          </span>
          <span className="text-[9px] md:text-[10px] text-amber-300/80 font-medium">
            (Tap for Sacred Bell)
          </span>

          {/* Glowing Ring on hover */}
          <div className="absolute inset-0 rounded-full border border-amber-400/0 group-hover:border-amber-400/50 transition-colors pointer-events-none" />
        </div>
      </div>

      {/* Current Devotional Track Info Card */}
      <div className="mt-3 md:mt-4 max-w-lg w-full bg-[#140D06]/85 border border-[#422C15]/70 backdrop-blur-md rounded-xl p-3 md:p-4 shadow-xl text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#8B0000]/70 text-amber-100 border border-red-800/60">
            {currentSong?.language || 'Devotional'}
          </span>
          {currentSong?.category && (
            <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-[#3D2912] text-[#F5D77F] border border-[#5E401E]">
              {currentSong.category}
            </span>
          )}
          {currentSong?.isUploaded && (
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-[#E65100]/80 text-white">
              User Offering
            </span>
          )}
        </div>

        <h2 className="text-base md:text-lg font-serif font-bold text-[#FDF6E2] tracking-wide truncate">
          {currentSong?.title || 'Swamiye Saranam Ayyappa'}
        </h2>

        {currentSong?.originalTitle && (
          <p className="text-xs md:text-sm text-[#F5D77F] font-medium mt-0.5 font-sans tracking-wide">
            {currentSong.originalTitle}
          </p>
        )}

        <p className="text-[11px] md:text-xs text-amber-300/70 mt-1">
          {currentSong?.artist || 'Traditional Sabarimala Chants'} 
          {currentSong?.year ? ` • ${currentSong.year}` : ''}
        </p>

        {/* Start Listening CTA if user hasn't interacted */}
        {!hasUserInteracted && (
          <button
            onClick={startAudioExperience}
            className="mt-2.5 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#E65100] via-[#FF9933] to-[#D4AF37] text-[#120802] font-bold text-xs shadow-lg shadow-amber-950/60 hover:brightness-110 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enter Sanctuary & Start Radio</span>
          </button>
        )}
      </div>

    </div>
  );
};
