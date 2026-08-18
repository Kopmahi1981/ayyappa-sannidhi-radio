'use client';

import React from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Info, X, ShieldCheck } from 'lucide-react';

export function SanctuaryInfoModal() {
  const { isAboutOpen, setIsAboutOpen } = useAudioPlayer();

  if (!isAboutOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={() => setIsAboutOpen(false)}
    >
      <div
        className="max-w-lg w-full bg-[#120f0d] border border-amber-500/30 rounded-2xl p-6 text-neutral-200 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-4 mb-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-lg">
            <Info className="w-5 h-5" />
            <span>Ayyappa Sannidhi Radio</span>
          </div>
          <button
            onClick={() => setIsAboutOpen(false)}
            className="text-neutral-400 hover:text-amber-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4 text-xs leading-relaxed text-neutral-300">
          <p>
            Welcome to <strong className="text-amber-300">Ayyappa Sannidhi Radio</strong> — a dedicated sanctuary for uninterrupted Ayyappa devotional hymns, Harivarasanam lullabies, and sacred daily chants.
          </p>

          {/* Copyright & Rights Reserved Section */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-medium text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>Devotional Media & Copyright Notice</span>
            </div>
            <p className="text-neutral-400 text-[11px] leading-normal">
              All devotional songs, audio recordings, chants, and video streams accessible on this platform are the sole intellectual property and copyright of their respective original artists, vocalists, composers, production houses, and record labels.
            </p>
            <p className="text-neutral-400 text-[11px] leading-normal">
              This application functions purely as an interactive media player and does not host, distribute, or monetize any copyrighted media files. All streamed tracks are served through YouTube’s official IFrame Player API in compliance with YouTube Terms of Service. All view counts and channel growth accrue directly to the original owners.
            </p>
          </div>

          <div className="text-[11px] text-neutral-400 pt-2 border-t border-neutral-800 flex justify-between items-center">
            <span>Swamiye Saranam Ayyappa 🙏</span>
            <button
              onClick={() => setIsAboutOpen(false)}
              className="bg-amber-600 hover:bg-amber-500 text-white font-medium px-4 py-1.5 rounded-lg text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}