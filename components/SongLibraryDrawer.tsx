'use client';

import React from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Language, Category } from '@/types';
import { 
  X, 
  Search, 
  Play, 
  Pause, 
  Trash2, 
  Music, 
  Flame, 
  Radio
} from 'lucide-react';

function formatDuration(sec?: number): string {
  if (!sec) return '4:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export const SongLibraryDrawer: React.FC = () => {
  const {
    isLibraryOpen,
    setIsLibraryOpen,
    filteredSongs,
    currentSong,
    isPlaying,
    playSong,
    togglePlayPause,
    activeLanguage,
    setActiveLanguage,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    deleteUserTrack,
  } = useAudioPlayer();

  if (!isLibraryOpen) return null;

  const categories: Array<Category | 'All'> = [
    'All',
    'Morning Suprabhatam',
    'Padi Pooja',
    'Sharanu Vili',
    'Harivarasanam',
    'Nagar Sankeerthana',
    'User Upload',
  ];

  const languages: Array<Language | 'All'> = ['All', 'Telugu', 'Tamil', 'Malayalam', 'Uploaded'];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md md:max-w-lg h-full bg-[#110A05] border-l border-[#3d2912] shadow-2xl flex flex-col overflow-hidden animate-slide-left"
      >
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#3d2912] flex items-center justify-between bg-[#180E07]">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#FF9933]" />
            <h3 className="text-base font-serif font-bold text-[#F5D77F]">
              Sannidhi Song Library
            </h3>
            <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#2E1D0E] text-amber-200 border border-[#523719]">
              {filteredSongs.length} Tracks
            </span>
          </div>

          <button
            onClick={() => setIsLibraryOpen(false)}
            className="p-1.5 rounded-lg text-amber-300/70 hover:text-[#F5D77F] hover:bg-[#2E1D0E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-[#2E1D0E] bg-[#140C06]">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-amber-400/60" />
            <input
              type="text"
              placeholder="Search devotional songs, singers, or chants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#1F130A] border border-[#422915] rounded-lg text-xs text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-xs text-amber-400/60 hover:text-amber-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* Language Tabs */}
          <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-1 scrollbar-none">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLanguage(lang)}
                className={`px-2.5 py-0.5 text-[11px] rounded-full font-medium whitespace-nowrap transition-colors ${
                  activeLanguage === lang
                    ? 'bg-[#D4AF37] text-[#120802] font-semibold'
                    : 'bg-[#1E1208] text-amber-300/70 hover:bg-[#2E1D0E]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Category Mood Filter */}
          <div className="flex items-center gap-1 mt-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2 py-0.5 text-[10px] rounded border transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#8B0000] border-red-600 text-white font-semibold'
                    : 'border-[#3D2612] text-amber-300/60 hover:border-[#5E3A1D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Song List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {filteredSongs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center p-4">
              <Music className="w-8 h-8 text-amber-500/40 mb-2" />
              <p className="text-sm text-amber-200/80 font-medium">No devotional songs found</p>
              <p className="text-xs text-amber-400/50 mt-1">Try resetting filters or search query</p>
            </div>
          ) : (
            filteredSongs.map((song) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => {
                    if (isCurrent) {
                      togglePlayPause();
                    } else {
                      playSong(song);
                    }
                  }}
                  className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#2B1B0E] to-[#1E1208] border-[#D4AF37]/80 shadow-md'
                      : 'bg-[#150D06] hover:bg-[#1F130A] border-[#2A190C]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Play/Pause Button */}
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg shrink-0 ${
                      isCurrent ? 'bg-[#D4AF37] text-[#120802]' : 'bg-[#24170C] text-[#F5D77F] group-hover:bg-[#D4AF37] group-hover:text-[#120802]'
                    } transition-colors`}>
                      {isCurrent && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current translate-x-0.5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h5 className={`text-xs font-semibold truncate ${
                          isCurrent ? 'text-[#F5D77F]' : 'text-amber-100'
                        }`}>
                          {song.title}
                        </h5>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#2A1A0D] text-amber-300/80 shrink-0">
                          {song.language}
                        </span>
                      </div>

                      {song.originalTitle && (
                        <p className="text-[10px] text-amber-300/80 font-medium truncate">
                          {song.originalTitle}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-amber-400/60">
                        <span>{song.artist || 'Traditional'}</span>
                        {song.category && (
                          <>
                            <span>•</span>
                            <span>{song.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Duration & Delete */}
                  <div className="flex items-center gap-2 ml-2 shrink-0">
                    <span className="text-[10px] font-mono text-amber-300/60">
                      {formatDuration(song.duration)}
                    </span>

                    {song.isUploaded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteUserTrack(song.id);
                        }}
                        className="p-1 rounded text-red-400/60 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                        title="Delete uploaded track"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
