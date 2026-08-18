export type Language = 'Telugu' | 'Tamil' | 'Malayalam' | 'Uploaded';

export type Category = 
  | 'Morning Suprabhatam' 
  | 'Padi Pooja' 
  | 'Sharanu Vili' 
  | 'Harivarasanam' 
  | 'Nagar Sankeerthana' 
  | 'Pilgrimage Chants'
  | 'User Upload';

export type DevotionalSong = {
  id: string;
  title: string;
  originalTitle?: string;
  artist?: string;
  album?: string;
  language: Language;
  year?: number;
  category?: Category;
  sourceType: 'youtube' | 'local';
  youtubeId?: string | null;
  audioBlobUrl?: string | null;
  duration?: number; // in seconds
  artwork?: string | null;
  isUploaded?: boolean;
  uploadedAt?: number;
};

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'buffering' | 'ended' | 'error';

export type PanchangamData = {
  tithi: string;
  nakshatra: string;
  muhurtham: string;
  rahuKaalam: string;
  samvatsara: string;
  ayanam: string;
  masa: string;
  sabarimalaSeason: string;
};

export type SacredChant = {
  id: number;
  transliteration: string;
  telugu: string;
  tamil: string;
  malayalam: string;
  meaning: string;
};
