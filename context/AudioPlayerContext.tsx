'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { DevotionalSong, Language, Category, PlaybackState } from '@/types';
import { SEED_SONGS } from '@/data/songs';
import { getAllUserTracksFromDB, saveUserTrackToDB, deleteUserTrackFromDB } from '@/lib/db';
import { getAudioContext } from '@/lib/bellSynthesizer';

interface AudioPlayerContextType {
  currentSong: DevotionalSong | null;
  isPlaying: boolean;
  playbackState: PlaybackState;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  activeLanguage: Language | 'All';
  activeCategory: Category | 'All';
  searchQuery: string;
  filteredSongs: DevotionalSong[];
  userUploadedSongs: DevotionalSong[];
  
  // UI states
  isLibraryOpen: boolean;
  isUploaderOpen: boolean;
  isChantsOpen: boolean;
  isAboutOpen: boolean;
  isDiyaGlowing: boolean;
  hasUserInteracted: boolean;

  // Actions
  playSong: (song: DevotionalSong) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seekTo: (timeInSeconds: number) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setActiveLanguage: (lang: Language | 'All') => void;
  setActiveCategory: (cat: Category | 'All') => void;
  setSearchQuery: (query: string) => void;
  
  // Modals
  setIsLibraryOpen: (open: boolean) => void;
  setIsUploaderOpen: (open: boolean) => void;
  setIsChantsOpen: (open: boolean) => void;
  setIsAboutOpen: (open: boolean) => void;
  setIsDiyaGlowing: (glowing: boolean | ((prev: boolean) => boolean)) => void;
  
  // User Upload
  uploadUserTrack: (file: File, metadata: Partial<DevotionalSong>) => Promise<DevotionalSong>;
  deleteUserTrack: (id: string) => Promise<void>;
  startAudioExperience: () => void;

  // Dual engine hooks for synchronization
  internalUpdateProgress: (current: number, dur: number) => void;
  internalUpdateState: (state: PlaybackState) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<DevotionalSong | null>(SEED_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(SEED_SONGS[0]?.duration || 324);
  const [volume, setVolumeState] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [hasUserInteracted, setHasUserInteracted] = useState<boolean>(false);

  const [activeLanguage, setActiveLanguage] = useState<Language | 'All'>('All');
  const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [userUploadedSongs, setUserUploadedSongs] = useState<DevotionalSong[]>([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState<boolean>(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState<boolean>(false);
  const [isChantsOpen, setIsChantsOpen] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [isDiyaGlowing, setIsDiyaGlowing] = useState<boolean>(true);

  // Critical Memory Management: Track active Blob URLs to revoke and garbage collect
  const activeBlobUrlsRef = useRef<Map<string, string>>(new Map());

  // Load user tracks from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;

    async function loadSavedTracks() {
      try {
        const records = await getAllUserTracksFromDB();
        if (!isMounted) return;

        const loadedTracks: DevotionalSong[] = records.map((rec) => {
          const blobUrl = URL.createObjectURL(rec.audioBlob);
          activeBlobUrlsRef.current.set(rec.id, blobUrl);
          return {
            ...rec.songMetadata,
            sourceType: 'local',
            audioBlobUrl: blobUrl,
            isUploaded: true,
          };
        });

        setUserUploadedSongs(loadedTracks);
      } catch (err) {
        console.warn('Error loading indexedDB user tracks:', err);
      }
    }

    loadSavedTracks();

    // Cleanup all created Object URLs on unmount to prevent browser memory leaks
    return () => {
      isMounted = false;
      activeBlobUrlsRef.current.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // ignore
        }
      });
      activeBlobUrlsRef.current.clear();
    };
  }, []);

  // Filtered song list
  const filteredSongs = useMemo(() => {
    const combined = [...SEED_SONGS, ...userUploadedSongs];
    return combined.filter((song) => {
      const matchesLanguage = 
        activeLanguage === 'All' 
          ? true 
          : activeLanguage === 'Uploaded' 
            ? song.isUploaded 
            : song.language === activeLanguage;

      const matchesCategory = 
        activeCategory === 'All' ? true : song.category === activeCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        song.title.toLowerCase().includes(q) ||
        (song.originalTitle && song.originalTitle.toLowerCase().includes(q)) ||
        (song.artist && song.artist.toLowerCase().includes(q)) ||
        (song.category && song.category.toLowerCase().includes(q));

      return matchesLanguage && matchesCategory && matchesSearch;
    });
  }, [userUploadedSongs, activeLanguage, activeCategory, searchQuery]);

  const unlockAudioContext = useCallback(() => {
    if (!hasUserInteracted) {
      setHasUserInteracted(true);
      getAudioContext();
    }
  }, [hasUserInteracted]);

  const playSong = useCallback((song: DevotionalSong) => {
    unlockAudioContext();
    setCurrentSong(song);
    setCurrentTime(0);
    setDuration(song.duration || 300);
    setIsPlaying(true);
    setPlaybackState('playing');
  }, [unlockAudioContext]);

  const togglePlayPause = useCallback(() => {
    unlockAudioContext();
    if (!currentSong && filteredSongs.length > 0) {
      playSong(filteredSongs[0]);
      return;
    }
    setIsPlaying((prev) => !prev);
  }, [unlockAudioContext, currentSong, filteredSongs, playSong]);

  const playNext = useCallback(() => {
    if (filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex((s) => s.id === currentSong?.id);
    
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * filteredSongs.length);
      playSong(filteredSongs[randomIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % filteredSongs.length;
      playSong(filteredSongs[nextIndex]);
    }
  }, [filteredSongs, currentSong, isShuffling, playSong]);

  const playPrevious = useCallback(() => {
    if (filteredSongs.length === 0) return;
    const currentIndex = filteredSongs.findIndex((s) => s.id === currentSong?.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    playSong(filteredSongs[prevIndex]);
  }, [filteredSongs, currentSong, playSong]);

  const seekTo = useCallback((timeInSeconds: number) => {
    setCurrentTime(timeInSeconds);
  }, []);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const toggleLoop = useCallback(() => {
    setIsLooping((prev) => !prev);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffling((prev) => !prev);
  }, []);

  const startAudioExperience = useCallback(() => {
    unlockAudioContext();
    if (!isPlaying) {
      setIsPlaying(true);
      setPlaybackState('playing');
    }
  }, [unlockAudioContext, isPlaying]);

  const uploadUserTrack = useCallback(async (file: File, meta: Partial<DevotionalSong>): Promise<DevotionalSong> => {
    unlockAudioContext();
    const id = 'user-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    
    // Create new Object URL
    const blobUrl = URL.createObjectURL(file);
    activeBlobUrlsRef.current.set(id, blobUrl);

    const newSong: DevotionalSong = {
      id,
      title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
      originalTitle: meta.originalTitle || '',
      artist: meta.artist || 'Devotee Offering',
      album: meta.album || 'Personal Sannidhi Offering',
      language: (meta.language as Language) || 'Uploaded',
      category: meta.category || 'User Upload',
      sourceType: 'local',
      audioBlobUrl: blobUrl,
      duration: meta.duration || 240,
      year: new Date().getFullYear(),
      isUploaded: true,
      uploadedAt: Date.now(),
    };

    // Save raw Blob to IndexedDB
    await saveUserTrackToDB(newSong, file);

    setUserUploadedSongs((prev) => [newSong, ...prev]);
    playSong(newSong);

    return newSong;
  }, [unlockAudioContext, playSong]);

  const deleteUserTrack = useCallback(async (id: string) => {
    // Revoke object URL
    const existingUrl = activeBlobUrlsRef.current.get(id);
    if (existingUrl) {
      try {
        URL.revokeObjectURL(existingUrl);
      } catch {
        // ignore
      }
      activeBlobUrlsRef.current.delete(id);
    }

    await deleteUserTrackFromDB(id);
    setUserUploadedSongs((prev) => prev.filter((s) => s.id !== id));

    if (currentSong?.id === id) {
      playNext();
    }
  }, [currentSong, playNext]);

  const internalUpdateProgress = useCallback((current: number, dur: number) => {
    setCurrentTime(current);
    if (dur && dur > 0) {
      setDuration(dur);
    }
  }, []);

  const internalUpdateState = useCallback((state: PlaybackState) => {
    setPlaybackState(state);
    if (state === 'playing') {
      setIsPlaying(true);
    } else if (state === 'paused') {
      setIsPlaying(false);
    } else if (state === 'ended') {
      if (isLooping) {
        seekTo(0);
        setIsPlaying(true);
      } else {
        playNext();
      }
    }
  }, [isLooping, seekTo, playNext]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in inputs or textareas
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'Escape') {
        setIsLibraryOpen(false);
        setIsUploaderOpen(false);
        setIsChantsOpen(false);
        setIsAboutOpen(false);
      } else if (e.key === 'ArrowRight' && e.shiftKey) {
        e.preventDefault();
        playNext();
      } else if (e.key === 'ArrowLeft' && e.shiftKey) {
        e.preventDefault();
        playPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, toggleMute, playNext, playPrevious]);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        playbackState,
        currentTime,
        duration,
        volume,
        isMuted,
        isLooping,
        isShuffling,
        activeLanguage,
        activeCategory,
        searchQuery,
        filteredSongs,
        userUploadedSongs,
        isLibraryOpen,
        isUploaderOpen,
        isChantsOpen,
        isAboutOpen,
        isDiyaGlowing,
        hasUserInteracted,
        playSong,
        togglePlayPause,
        playNext,
        playPrevious,
        seekTo,
        setVolume,
        toggleMute,
        toggleLoop,
        toggleShuffle,
        setActiveLanguage,
        setActiveCategory,
        setSearchQuery,
        setIsLibraryOpen,
        setIsUploaderOpen,
        setIsChantsOpen,
        setIsAboutOpen,
        setIsDiyaGlowing,
        uploadUserTrack,
        deleteUserTrack,
        startAudioExperience,
        internalUpdateProgress,
        internalUpdateState,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};
