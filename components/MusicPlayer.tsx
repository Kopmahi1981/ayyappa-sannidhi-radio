'use client';

import React, { useState } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { playTempleBell } from '@/lib/bellSynthesizer';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  ListMusic, 
  Bell, 
  Radio
} from 'lucide-react';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export const MusicPlayer: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    isShuffling,
    togglePlayPause,
    playNext,
    playPrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    setIsLibraryOpen,
  } = useAudioPlayer();

  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [seekValue, setSeekValue] = useState<number>(0);

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSeeking(true);
    setSeekValue(parseFloat(e.target.value));
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
    seekTo(seekValue);
  };

  const progressPercent = duration > 0 ? ((isSeeking ? seekValue : currentTime) / duration) * 100 : 0;

  const handleRingBell = () => {
    playTempleBell(659.25, 4.0);
  };

  return (
    <footer className="relative z-30 w-full bg-gradient-to-t from-[#080503] via-[#120B05] to-[#180E07]/95 border-t border-[#3d2912] px-3 py-2 md:px-6 md:py-3 shadow-2xl backdrop-blur-lg">
      
      {/* Top Progress Bar with Gold Glow Scrubbing */}
      <div className="w-full mb-2 flex items-center gap-2 group">
        <span className="text-[10px] md:text-xs font-mono text-amber-300/80 min-w-[34px] text-right">
          {formatTime(isSeeking ? seekValue : currentTime)}
        </span>

        <div className="relative flex-1 flex items-center h-4">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.5}
            value={isSeeking ? seekValue : currentTime}
            onChange={handleSeekChange}
            onMouseUp={handleSeekEnd}
            onTouchEnd={handleSeekEnd}
            className="w-full h-1.5 bg-[#2E1D0E] rounded-lg appearance-none cursor-pointer accent-[#D4AF37] focus:outline-none"
            style={{
              background: `linear-gradient(to right, #D4AF37 ${progressPercent}%, #2E1D0E ${progressPercent}%)`,
            }}
          />
        </div>

        <span className="text-[10px] md:text-xs font-mono text-amber-300/80 min-w-[34px]">
          {formatTime(duration)}
        </span>
      </div>

      {/* Main Controls Row */}
      <div className="flex items-center justify-between gap-2 md:gap-4">
        
        {/* Left: Track Info Snippet */}
        <div className="flex items-center gap-2.5 min-w-0 max-w-[200px] md:max-w-[300px]">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-[#24170c] border border-[#523719] shrink-0 shadow-inner">
            {currentSong?.sourceType === 'youtube' ? (
              <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            ) : (
              <Radio className="w-5 h-5 text-[#FF9933]" />
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-xs md:text-sm font-serif font-bold text-[#FDF6E2] truncate">
              {currentSong?.title || 'Swamiye Saranam Ayyappa'}
            </h4>
            <p className="text-[10px] md:text-xs text-amber-300/70 truncate">
              {currentSong?.artist || 'Sacred Sannidhi'}
            </p>
          </div>
        </div>

        {/* Center: Playback Transport Buttons */}
        <div className="flex items-center gap-2 md:gap-4">
          
          <button
            onClick={toggleShuffle}
            className={`p-1.5 rounded-full transition-colors hidden sm:block ${
              isShuffling ? 'text-[#FF9933] bg-[#2E1D0E]' : 'text-amber-200/60 hover:text-[#F5D77F]'
            }`}
            title="Toggle Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>

          <button
            onClick={playPrevious}
            className="p-1.5 md:p-2 rounded-full text-[#F5D77F] hover:bg-[#2E1D0E] active:scale-95 transition-all"
            title="Previous Track (Shift + Left Arrow)"
          >
            <SkipBack className="w-5 h-5 md:w-5 md:h-5" />
          </button>

          <button
            onClick={togglePlayPause}
            className="relative flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#FF9933] to-[#D4AF37] text-[#120802] shadow-lg shadow-amber-950/80 hover:brightness-110 active:scale-95 transition-all"
            title="Play / Pause (Spacebar)"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            ) : (
              <Play className="w-5 h-5 md:w-6 md:h-6 fill-current translate-x-0.5" />
            )}
          </button>

          <button
            onClick={playNext}
            className="p-1.5 md:p-2 rounded-full text-[#F5D77F] hover:bg-[#2E1D0E] active:scale-95 transition-all"
            title="Next Track (Shift + Right Arrow)"
          >
            <SkipForward className="w-5 h-5 md:w-5 md:h-5" />
          </button>

          <button
            onClick={toggleLoop}
            className={`p-1.5 rounded-full transition-colors hidden sm:block ${
              isLooping ? 'text-[#FF9933] bg-[#2E1D0E]' : 'text-amber-200/60 hover:text-[#F5D77F]'
            }`}
            title="Toggle Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>

        </div>

        {/* Right: Volume & Song Drawer Trigger */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Temple Bell Button */}
          <button
            onClick={handleRingBell}
            className="p-2 rounded-lg bg-[#24170c] hover:bg-[#382312] border border-[#523719] text-[#F5D77F] active:scale-90 transition-all hidden md:flex items-center gap-1.5 text-xs"
            title="Ring Sacred Temple Bell"
          >
            <Bell className="w-3.5 h-3.5 text-[#FF9933]" />
            <span className="text-[11px]">Chime</span>
          </button>

          {/* Volume Slider (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button 
              onClick={toggleMute} 
              className="text-amber-200/80 hover:text-[#F5D77F] transition-colors"
              title="Mute / Unmute (M)"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-16 h-1 bg-[#2E1D0E] rounded appearance-none cursor-pointer accent-[#D4AF37]"
            />
          </div>

          {/* Song Library Drawer Button */}
          <button
            onClick={() => setIsLibraryOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8B0000] to-[#5A0000] hover:from-[#A00000] hover:to-[#6A0000] border border-red-700/60 text-amber-100 text-xs font-semibold shadow-md active:scale-95 transition-all"
            title="Open Song Library"
          >
            <ListMusic className="w-4 h-4" />
            <span className="hidden sm:inline">Song Library</span>
          </button>

        </div>

      </div>
    </footer>
  );
};
