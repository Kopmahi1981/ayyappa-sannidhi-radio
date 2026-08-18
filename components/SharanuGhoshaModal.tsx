'use client';

import React, { useState } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { SACRED_CHANTS } from '@/data/chants';
import { playTempleBell } from '@/lib/bellSynthesizer';
import { X, BookOpen, Volume2, Sparkles, Flame } from 'lucide-react';

export const SharanuGhoshaModal: React.FC = () => {
  const { isChantsOpen, setIsChantsOpen } = useAudioPlayer();
  const [selectedLang, setSelectedLang] = useState<'Telugu' | 'Tamil' | 'Malayalam' | 'English'>('Telugu');

  if (!isChantsOpen) return null;

  const handleChantTap = (chantId: number) => {
    // Unique bell pitch for each chant
    const freq = 440 + (chantId * 25);
    playTempleBell(freq, 3.5);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#120B05] border border-[#4A3219] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-[#382312] flex items-center justify-between bg-[#190E07]">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#FF9933]" />
            <div>
              <h3 className="text-base font-serif font-bold text-[#F5D77F]">
                18 Sacred Pilgrimage Chants (శరణు ఘోష)
              </h3>
              <p className="text-[11px] text-amber-300/70">
                Tap any chant to ring the sacred sanctum bell
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsChantsOpen(false)}
            className="p-1 rounded-lg text-amber-300/70 hover:text-[#F5D77F] hover:bg-[#281A0E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Script Selection Tabs */}
        <div className="px-4 py-2 bg-[#170D06] border-b border-[#2C1A0C] flex items-center gap-1.5 overflow-x-auto">
          {(['Telugu', 'Tamil', 'Malayalam', 'English'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors ${
                selectedLang === lang
                  ? 'bg-[#D4AF37] text-[#120802]'
                  : 'bg-[#22140A] text-amber-300/70 hover:bg-[#2E1B0E]'
              }`}
            >
              {lang === 'Telugu' ? 'తెలుగు' : lang === 'Tamil' ? 'தமிழ்' : lang === 'Malayalam' ? 'മലയാളം' : 'English'}
            </button>
          ))}
        </div>

        {/* Chants Scroll Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {SACRED_CHANTS.map((chant) => (
            <div
              key={chant.id}
              onClick={() => handleChantTap(chant.id)}
              className="group p-3 rounded-xl bg-[#180E07] hover:bg-[#26160B] border border-[#3A2411] hover:border-[#D4AF37]/60 cursor-pointer transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2E1D0E] text-[#F5D77F] text-xs font-bold shrink-0 mt-0.5 border border-[#523719]">
                  {chant.id}
                </span>

                <div>
                  <h4 className="text-sm md:text-base font-serif font-bold text-[#FDF6E2] group-hover:text-[#F5D77F] transition-colors">
                    {selectedLang === 'Telugu'
                      ? chant.telugu
                      : selectedLang === 'Tamil'
                      ? chant.tamil
                      : selectedLang === 'Malayalam'
                      ? chant.malayalam
                      : chant.transliteration}
                  </h4>

                  <p className="text-xs text-amber-300/80 mt-0.5 italic">
                    "{chant.transliteration}"
                  </p>

                  <p className="text-[11px] text-amber-400/60 mt-1">
                    {chant.meaning}
                  </p>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-[#24170C] text-[#FF9933] group-hover:bg-[#D4AF37] group-hover:text-[#120802] transition-colors shrink-0">
                <Volume2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
