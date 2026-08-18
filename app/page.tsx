'use client';

import React, { useState } from 'react';
import { DisclaimerModal } from '@/components/DisclaimerModal';
import { BackgroundScene } from '@/components/BackgroundScene';
import { AmbientLayer } from '@/components/AmbientLayer';
import { HeaderBar } from '@/components/HeaderBar';
import { ShrineCenter } from '@/components/ShrineCenter';
import { MusicPlayer } from '@/components/MusicPlayer';
import { YouTubeEngine } from '@/components/YouTubeEngine';
import { LocalAudioEngine } from '@/components/LocalAudioEngine';
import { SongLibraryDrawer } from '@/components/SongLibraryDrawer';
import { AudioUploaderModal } from '@/components/AudioUploaderModal';
import { SharanuGhoshaModal } from '@/components/SharanuGhoshaModal';
import { SanctuaryInfoModal } from '@/components/SanctuaryInfoModal';

export default function Home() {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden flex flex-col justify-between select-none">
      {/* Background Visual Scene */}
      <BackgroundScene />

      {/* Ambient Flame, Incense Embers, and Fog particles */}
      <AmbientLayer />

      {/* Headless Audio Playback Engines */}
      <YouTubeEngine />
      <LocalAudioEngine />

      {/* Top Header Bar */}
      <HeaderBar onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />

      {/* Center Shrine Visual & Bell Hotspot */}
      <ShrineCenter />

      {/* Bottom Floating Sacred Music Player */}
      <MusicPlayer />

      {/* Modals & Drawers */}
      <SongLibraryDrawer />
      <AudioUploaderModal />
      <SharanuGhoshaModal />
      <SanctuaryInfoModal />
      
      {/* Copyright Disclaimer Modal */}
      <DisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </main>
  );
}