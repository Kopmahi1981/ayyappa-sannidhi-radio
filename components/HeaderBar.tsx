'use client';

import React, { useState, useEffect } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { getDailyPanchangam } from '@/lib/panchangam';
import { Language } from '@/types';
import { 
  Sparkles, 
  Upload, 
  BookOpen, 
  Info, 
  Users, 
  Volume2, 
  Clock, 
  Music,
  Flame
} from 'lucide-react';
import { playTempleBell } from '@/lib/bellSynthesizer';

export const HeaderBar: React.FC = () => {
  const {
    activeLanguage,
    setActiveLanguage,
    setIsLibraryOpen,
    setIsUploaderOpen,
    setIsChantsOpen,
    setIsAboutOpen,
    userUploadedSongs,
    isDiyaGlowing,
    setIsDiyaGlowing,
  } = useAudioPlayer();

  const [panchangam, setPanchangam] = useState(getDailyPanchangam());
  const [timeString, setTimeString] = useState<string>('');
  const [devoteeCount, setDevoteeCount] = useState<number>(1408);

  // Digital Clock & Realtime Refresh
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subtle Live Devotee count fluctuation for spiritual realism
  useEffect(() => {
    const interval = setInterval(() => {
      setDevoteeCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        return Math.max(1250, prev + delta);
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleRingBell = () => {
    playTempleBell(587.33, 4.0);
    setIsDiyaGlowing((prev) => !prev);
  };

  const languages: Array<{ id: Language | 'All'; label: string; regional: string }> = [
    { id: 'All', label: 'All', regional: 'అన్నీ' },
    { id: 'Telugu', label: 'Telugu', regional: 'తెలుగు' },
    { id: 'Tamil', label: 'Tamil', regional: 'தமிழ்' },
    { id: 'Malayalam', label: 'Malayalam', regional: 'മലയാളം' },
  ];

  return (
    <header className="relative z-20 w-full px-3 py-2 md:px-6 md:py-3 flex flex-col md:flex-row items-center justify-between gap-2 border-b border-[#3d2912]/50 bg-[#0c0905]/75 backdrop-blur-md">
      
      {/* Top Left: Logo & Panchangam Ticker */}
      <div className="flex items-center justify-between w-full md:w-auto gap-3">
        <div className="flex items-center gap-2.5">
          <div 
            onClick={handleRingBell}
            title="Click to ring sacred Temple Bell"
            className="cursor-pointer relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B4513] p-0.5 shadow-md shadow-amber-950/40 hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="w-full h-full rounded-full bg-[#120a05] flex items-center justify-center">
              <Flame className="w-4 h-4 text-[#F5D77F] animate-pulse" />
            </div>
          </div>

          <div>
            <h1 className="text-sm md:text-base font-serif font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#F5D77F] via-[#FF9933] to-[#F5D77F] leading-tight">
              Ayyappa Sannidhi Radio
            </h1>
            <p className="text-[10px] md:text-xs text-[#E6A15C] font-medium tracking-wider flex items-center gap-1">
              <span>అయ్యప్ప శరణం</span> • <span>ஐயப்ப சரணம்</span> • <span>സ്വാമി ശരണം</span>
            </p>
          </div>
        </div>

        {/* Mobile Live Indicator */}
        <div className="flex md:hidden items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1e140a]/80 border border-[#4a3419]/60 text-[11px] text-[#D4AF37]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>{devoteeCount} Online</span>
        </div>
      </div>

      {/* Center: Realtime Devotees & Panchangam Pill */}
      <div className="hidden lg:flex items-center gap-3 px-3 py-1 rounded-full bg-[#160f08]/80 border border-[#3d2912]/80 text-xs shadow-inner">
        <div className="flex items-center gap-1.5 text-[#F5D77F]">
          <Clock className="w-3.5 h-3.5 text-[#FF9933]" />
          <span className="font-mono text-[11px] tracking-wide text-amber-200">{timeString}</span>
        </div>

        <span className="text-[#5A3E1B]">|</span>

        <div className="text-[11px] text-amber-100/85 max-w-[320px] truncate" title={`${panchangam.tithi} • ${panchangam.nakshatra} • ${panchangam.muhurtham}`}>
          <span className="text-[#FF9933] font-semibold">{panchangam.tithi}</span> • <span>{panchangam.nakshatra}</span>
        </div>

        <span className="text-[#5A3E1B]">|</span>

        <div className="flex items-center gap-1.5 text-[#E6A15C]">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-emerald-300">{devoteeCount}</span>
          <span className="text-[10px] text-amber-300/70">Devotees Listening</span>
        </div>
      </div>

      {/* Top Right: Language Filter Tabs & Action CTAs */}
      <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2">
        {/* Language Switcher Buttons */}
        <div className="flex items-center bg-[#181109] p-0.5 rounded-lg border border-[#3d2912]">
          {languages.map((lang) => {
            const isActive = activeLanguage === lang.id;
            return (
              <button
                key={lang.id}
                onClick={() => setActiveLanguage(lang.id)}
                className={`px-2 md:px-2.5 py-1 text-[11px] md:text-xs rounded font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#120902] font-semibold shadow-sm'
                    : 'text-[#d6be96] hover:text-[#F5D77F] hover:bg-[#281b0f]/60'
                }`}
              >
                <span>{lang.label}</span>
              </button>
            );
          })}
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsUploaderOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] md:text-xs rounded-lg bg-[#24170c] hover:bg-[#382312] border border-[#523719] text-[#F5D77F] transition-colors"
            title="Upload custom devotional song"
          >
            <Upload className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="hidden sm:inline">Upload</span>
            {userUploadedSongs.length > 0 && (
              <span className="px-1.5 py-0.2 text-[9px] rounded-full bg-[#E65100] text-amber-100 font-bold">
                {userUploadedSongs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsChantsOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] md:text-xs rounded-lg bg-[#24170c] hover:bg-[#382312] border border-[#523719] text-[#F5D77F] transition-colors"
            title="18 Sacred Pilgrimage Chants"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="hidden sm:inline">Chants</span>
          </button>

          <button
            onClick={() => setIsAboutOpen(true)}
            className="flex items-center justify-center p-1.5 rounded-lg bg-[#24170c] hover:bg-[#382312] border border-[#523719] text-[#d6be96] hover:text-[#F5D77F] transition-colors"
            title="About Sabarimala & Sannidhi Radio"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
