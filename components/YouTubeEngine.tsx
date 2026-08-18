'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

// Utility to cleanly extract 11-character video ID from raw IDs or full URLs
export function extractYouTubeId(inputUrlOrId?: string): string {
  if (!inputUrlOrId) return '';
  const match = inputUrlOrId.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : inputUrlOrId.trim();
}

export function YouTubeEngine() {
  const {
    currentSong,
    isPlaying,
    isMuted,
    volume,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    nextSong,
  } = useAudioPlayer();

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isReadyRef = useRef(false);
  const timeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const cleanVideoId = extractYouTubeId(currentSong?.youtubeId);
  const isYouTube = currentSong?.sourceType === 'youtube' && Boolean(cleanVideoId);

  // Load YouTube IFrame API script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // Initialize or re-create player
  useEffect(() => {
    let isMounted = true;

    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
    }

    if (!isYouTube || !cleanVideoId) {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
      isReadyRef.current = false;
      return;
    }

    function initPlayer() {
      if (!window.YT || !window.YT.Player || !containerRef.current) return;

      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }

      isReadyRef.current = false;

      try {
        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '100%',
          width: '100%',
          videoId: cleanVideoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            disablekb: 0,
            enablejsapi: 1,
            fs: 1,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              isReadyRef.current = true;
              event.target.setVolume(isMuted ? 0 : Math.round(volume * 100));

              const dur = event.target.getDuration();
              if (dur && dur > 0 && typeof setDuration === 'function') {
                setDuration(dur);
              }

              if (isPlaying) {
                event.target.playVideo();
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              const YTState = window.YT.PlayerState;

              if (event.data === YTState.PLAYING) {
                if (typeof setIsPlaying === 'function') setIsPlaying(true);

                const dur = event.target.getDuration();
                if (dur && dur > 0 && typeof setDuration === 'function') {
                  setDuration(dur);
                }

                if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
                timeIntervalRef.current = setInterval(() => {
                  if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
                    const curr = playerRef.current.getCurrentTime();
                    if (typeof setCurrentTime === 'function') {
                      setCurrentTime(curr);
                    }
                  }
                }, 500);
              } else if (event.data === YTState.PAUSED) {
                if (typeof setIsPlaying === 'function') setIsPlaying(false);
                if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
              } else if (event.data === YTState.ENDED) {
                if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
                if (typeof nextSong === 'function') nextSong();
              }
            },
            onError: (err: any) => {
              console.warn('YouTube playback error code:', err?.data);
              if ([150, 101, 100, 2].includes(err?.data)) {
                if (typeof nextSong === 'function') {
                  nextSong();
                }
              }
            },
          },
        });
      } catch (err) {
        console.error('Failed to construct YT.Player:', err);
      }
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = () => {
        if (isMounted) initPlayer();
      };
    }

    return () => {
      isMounted = false;
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
      }
    };
  }, [currentSong?.id, cleanVideoId, isYouTube]);

  // Handle Play/Pause toggle
  useEffect(() => {
    if (!isReadyRef.current || !playerRef.current || !isYouTube) return;
    try {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    } catch (e) {
      console.warn('Playback toggle error:', e);
    }
  }, [isPlaying, isYouTube]);

  // Handle Volume toggle
  useEffect(() => {
    if (!isReadyRef.current || !playerRef.current) return;
    try {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(Math.round(volume * 100));
      }
    } catch (e) {
      console.warn('Volume sync error:', e);
    }
  }, [volume, isMuted]);

  if (!isYouTube) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '24px',
        width: isMinimized ? '0px' : '280px',
        height: isMinimized ? '0px' : '182px',
        backgroundColor: '#120f0d',
        borderRadius: '12px',
        boxShadow: isMinimized
          ? 'none'
          : '0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(251, 191, 36, 0.25)',
        overflow: 'hidden',
        zIndex: 50,
        opacity: isMinimized ? 0 : 1,
        pointerEvents: isMinimized ? 'none' : 'auto',
        transition: 'all 0.25s ease-in-out',
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 10px',
          background: 'rgba(20, 15, 10, 0.95)',
          color: '#fbbf24',
          fontSize: '11px',
          fontWeight: 600,
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '220px',
          }}
        >
          {currentSong?.title || 'YouTube Feed'}
        </span>
        <button
          onClick={() => setIsMinimized(true)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '14px',
            lineHeight: 1,
            padding: '2px',
          }}
          title="Close Video Preview"
        >
          ✕
        </button>
      </div>

      {/* Video Canvas */}
      <div style={{ width: '100%', height: 'calc(100% - 28px)' }}>
        <div ref={containerRef} id="youtube-player" style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  );
}