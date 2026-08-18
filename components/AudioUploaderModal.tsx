'use client';

import React, { useState, useRef } from 'react';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Language, Category } from '@/types';
import { X, Upload, Music, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const AudioUploaderModal: React.FC = () => {
  const { isUploaderOpen, setIsUploaderOpen, uploadUserTrack } = useAudioPlayer();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState<string>('');
  const [originalTitle, setOriginalTitle] = useState<string>('');
  const [artist, setArtist] = useState<string>('');
  const [language, setLanguage] = useState<Language>('Telugu');
  const [category, setCategory] = useState<Category>('User Upload');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isUploaderOpen) return null;

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('audio/') && !/\.(mp3|wav|aac|m4a|ogg)$/i.test(file.name)) {
      setStatusMsg({ type: 'error', text: 'Please select a valid audio file (MP3, WAV, AAC, M4A).' });
      return;
    }

    setSelectedFile(file);
    setStatusMsg(null);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSaveAndPlay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMsg({ type: 'error', text: 'Please select an audio file first.' });
      return;
    }

    try {
      setIsUploading(true);
      await uploadUserTrack(selectedFile, {
        title: title.trim() || selectedFile.name,
        originalTitle: originalTitle.trim(),
        artist: artist.trim() || 'Devotee Offering',
        language,
        category,
      });

      setStatusMsg({ type: 'success', text: 'Sacred song uploaded and playing!' });
      setTimeout(() => {
        setIsUploaderOpen(false);
        setSelectedFile(null);
        setTitle('');
        setOriginalTitle('');
        setArtist('');
      }, 1000);
    } catch (err) {
      console.error('Upload failed:', err);
      setStatusMsg({ type: 'error', text: 'Failed to save audio to browser storage.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#130B05] border border-[#4A3219] rounded-2xl shadow-2xl p-5 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#382312]">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-[#FF9933]" />
            <h3 className="text-base font-serif font-bold text-[#F5D77F]">
              Upload Devotional Song
            </h3>
          </div>
          <button
            onClick={() => setIsUploaderOpen(false)}
            className="p-1 rounded-lg text-amber-300/70 hover:text-[#F5D77F] hover:bg-[#281A0E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSaveAndPlay} className="mt-4 space-y-3.5">
          
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#523719] hover:border-[#D4AF37] rounded-xl bg-[#1A0F08]/80 hover:bg-[#24150B] transition-all text-center"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*,.mp3,.wav,.aac,.m4a"
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              className="hidden"
            />
            
            <Music className="w-8 h-8 text-[#FF9933] mb-1.5" />
            {selectedFile ? (
              <div>
                <p className="text-xs font-semibold text-emerald-300 truncate max-w-[260px]">
                  {selectedFile.name}
                </p>
                <p className="text-[10px] text-amber-300/60 mt-0.5">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click to change
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-amber-200">
                  Drag and drop audio file here, or <span className="text-[#FF9933] underline">browse</span>
                </p>
                <p className="text-[10px] text-amber-400/50 mt-0.5">
                  Supports MP3, WAV, AAC, M4A (stored locally in IndexedDB)
                </p>
              </div>
            )}
          </div>

          {/* Song Metadata Fields */}
          <div>
            <label className="block text-[11px] font-medium text-amber-300/80 mb-1">Song Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Pallikattu Sabarimalaikku"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-1.5 bg-[#1F130A] border border-[#422915] rounded-lg text-xs text-amber-100 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-amber-300/80 mb-1">Regional Script Title</label>
              <input
                type="text"
                placeholder="తెలుగు / தமிழ் / മലയാളം"
                value={originalTitle}
                onChange={(e) => setOriginalTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#1F130A] border border-[#422915] rounded-lg text-xs text-amber-100 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-amber-300/80 mb-1">Artist / Singer</label>
              <input
                type="text"
                placeholder="e.g. K.J. Yesudas"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#1F130A] border border-[#422915] rounded-lg text-xs text-amber-100 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-amber-300/80 mb-1">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="w-full px-2.5 py-1.5 bg-[#1F130A] border border-[#422915] rounded-lg text-xs text-amber-100 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Malayalam">Malayalam (മലയാളം)</option>
                <option value="Uploaded">General Devotional</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-amber-300/80 mb-1">Category / Mood</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-2.5 py-1.5 bg-[#1F130A] border border-[#422915] rounded-lg text-xs text-amber-100 focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="User Upload">User Offering</option>
                <option value="Morning Suprabhatam">Morning Suprabhatam</option>
                <option value="Padi Pooja">Padi Pooja</option>
                <option value="Sharanu Vili">Sharanu Vili</option>
                <option value="Harivarasanam">Harivarasanam</option>
                <option value="Nagar Sankeerthana">Nagar Sankeerthana</option>
              </select>
            </div>
          </div>

          {/* Status Message */}
          {statusMsg && (
            <div className={`flex items-center gap-2 p-2 rounded-lg text-xs ${
              statusMsg.type === 'success' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-red-950/60 text-red-300 border border-red-800'
            }`}>
              {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{statusMsg.text}</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isUploading || !selectedFile}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#E65100] via-[#FF9933] to-[#D4AF37] text-[#120802] font-bold text-xs shadow-lg disabled:opacity-50 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isUploading ? 'Storing in Sanctuary...' : 'Offer & Play Song'}</span>
          </button>

        </form>

      </div>
    </div>
  );
};
