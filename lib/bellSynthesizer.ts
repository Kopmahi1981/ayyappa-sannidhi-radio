/**
 * Temple Bell Sound Synthesizer using Web Audio API
 * Generates an authentic sacred bronze/brass temple bell (Ghanta / Mani) chime
 * with harmonic and inharmonic overtones, metal strike transient, and lingering meditative decay.
 */

let sharedAudioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedAudioContext) {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioContext = new AudioCtx();
  }
  if (sharedAudioContext.state === 'suspended') {
    sharedAudioContext.resume().catch(() => {});
  }
  return sharedAudioContext;
}

export function playTempleBell(frequency = 587.33, duration = 4.5): void {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Bell harmonic ratios corresponding to bronze temple bells (strike, fundamental, minor third, octave, fifth)
    const partials = [
      { ratio: 0.5, gain: 0.25, decay: duration * 0.9 },   // Hum note
      { ratio: 1.0, gain: 0.60, decay: duration * 1.0 },   // Prime / Fundamental (D5)
      { ratio: 1.19, gain: 0.40, decay: duration * 0.75 }, // Tierce (Minor 3rd)
      { ratio: 1.56, gain: 0.30, decay: duration * 0.6 },  // Quint (5th)
      { ratio: 2.0, gain: 0.35, decay: duration * 0.5 },   // Nominal (Octave)
      { ratio: 2.76, gain: 0.20, decay: duration * 0.35 }, // Superquint
      { ratio: 3.84, gain: 0.15, decay: duration * 0.25 }, // Octave nominal
      { ratio: 5.4, gain: 0.08, decay: duration * 0.15 },  // Metallic ring
    ];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.7, now);
    masterGain.connect(ctx.destination);

    // Initial strike metallic burst transient
    const strikeOsc = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    strikeOsc.type = 'triangle';
    strikeOsc.frequency.setValueAtTime(frequency * 3.2, now);
    strikeGain.gain.setValueAtTime(0.4, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
    strikeOsc.connect(strikeGain);
    strikeGain.connect(masterGain);
    strikeOsc.start(now);
    strikeOsc.stop(now + 0.1);

    // Partial resonant tones
    partials.forEach((p) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency * p.ratio, now);

      // Natural slight frequency detune for rich beating
      osc.detune.setValueAtTime((Math.random() - 0.5) * 6, now);

      gain.gain.setValueAtTime(p.gain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + p.decay + 0.1);
    });

  } catch (err) {
    console.warn('Temple bell synthesis error:', err);
  }
}
