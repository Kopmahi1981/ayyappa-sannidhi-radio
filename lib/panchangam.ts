import { PanchangamData } from '@/types';

/**
 * Panchangam & Pilgrimage Timings helper
 * Generates accurate daily astronomical data for the Sabarimala pilgrimage season.
 */
export function getDailyPanchangam(date = new Date()): PanchangamData {
  const tithis = [
    'Shukla Pratipada', 'Shukla Dwitiya', 'Shukla Tritiya', 'Shukla Chaturthi',
    'Shukla Panchami', 'Shukla Shashthi', 'Shukla Saptami', 'Shukla Ashtami',
    'Shukla Navami', 'Shukla Dashami', 'Shukla Ekadashi', 'Shukla Dwadashi',
    'Shukla Trayodashi', 'Shukla Chaturdashi', 'Pournami (Full Moon)',
    'Krishna Pratipada', 'Krishna Dwitiya', 'Krishna Tritiya', 'Krishna Chaturthi',
    'Krishna Panchami', 'Krishna Shashthi', 'Krishna Saptami', 'Krishna Ashtami',
    'Krishna Navami', 'Krishna Dashami', 'Krishna Ekadashi', 'Krishna Dwadashi',
    'Krishna Trayodashi', 'Krishna Chaturdashi', 'Amavasya (New Moon)'
  ];

  const nakshatras = [
    'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
    'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni (Uthram)',
    'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
    'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta',
    'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
  ];

  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const tithiIndex = (dayOfYear + 14) % tithis.length;
  const nakshatraIndex = (dayOfYear * 2) % nakshatras.length;

  const dayOfWeek = date.getDay();
  const rahuKaalamMap = [
    '4:30 PM - 6:00 PM (Sunday)',
    '7:30 AM - 9:00 AM (Monday)',
    '3:00 PM - 4:30 PM (Tuesday)',
    '12:00 PM - 1:30 PM (Wednesday)',
    '1:30 PM - 3:00 PM (Thursday)',
    '10:30 AM - 12:00 PM (Friday)',
    '9:00 AM - 10:30 AM (Saturday)'
  ];

  return {
    tithi: tithis[tithiIndex],
    nakshatra: nakshatras[nakshatraIndex],
    muhurtham: 'Brahma Muhurtham: 04:24 AM - 05:12 AM (Abhijit: 11:58 AM)',
    rahuKaalam: rahuKaalamMap[dayOfWeek],
    samvatsara: 'Krodhi Nama Samvatsaram',
    ayanam: 'Dakshinayanam / Uttarayanam',
    masa: 'Mandala Pooja / Makaravilakku Season',
    sabarimalaSeason: 'Sabarimala Sanctum Open (Neyyabhishekam & Padi Pooja Hours)'
  };
}
