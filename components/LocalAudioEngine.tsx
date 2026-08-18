'use client';

import React, { useEffect, useRef } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

export const LocalAudioEngine: React.FC = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    isMuted,
    currentTime,
    internalUpdateProgress,
    internalUpdateState,
  } = useAudioPlayer();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isLocal = currentSong?.sourceType === 'local' && !!currentSong?.audioBlobUrl;

  // Handle Play/Pause and source change
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!isLocal) {
      audio.pause();
      return;
    }

    if (currentSong.audioBlobUrl && audio.src !== currentSong.audioBlobUrl) {
      audio.src = currentSong.audioBlobUrl;
      audio.load();
    }

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Local audio play interrupted/blocked:', err);
        });
      }
    } else {
      audio.pause();
    }
  }, [currentSong, isLocal, isPlaying]);

  // Handle Volume & Mute
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Event handlers
  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !isLocal) return;
    internalUpdateProgress(audio.currentTime, audio.duration || currentSong?.duration || 0);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio || !isLocal) return;
    internalUpdateProgress(audio.currentTime, audio.duration);
  };

  const handleEnded = () => {
    internalUpdateState('ended');
  };

  const handlePlaying = () => {
    internalUpdateState('playing');
  };

  const handlePause = () => {
    internalUpdateState('paused');
  };

  const handleWaiting = () => {
    internalUpdateState('buffering');
  };

  return (
    <audio
      ref={audioRef}
      onTimeUpdate={handleTimeUpdate}
      onLoadedMetadata={handleLoadedMetadata}
      onEnded={handleEnded}
      onPlaying={handlePlaying}
      onPause={handlePause}
      onWaiting={handleWaiting}
      preload="auto"
      className="hidden"
    />
  );
};
