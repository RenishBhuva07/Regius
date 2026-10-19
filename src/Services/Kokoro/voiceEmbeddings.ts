// Kokoro-82M voice profiles and style embeddings

export interface KokoroVoiceProfile {
  id: string;
  name: string;
  gender: 'female' | 'male';
  accent: 'american' | 'british';
  langCode: 'a' | 'b'; // 'a' = American, 'b' = British
}

export const KOKORO_VOICES: Record<string, KokoroVoiceProfile> = {
  af_bella: {
    id: 'af_bella',
    name: 'Bella',
    gender: 'female',
    accent: 'american',
    langCode: 'a',
  },
  af_nicole: {
    id: 'af_nicole',
    name: 'Nicole',
    gender: 'female',
    accent: 'american',
    langCode: 'a',
  },
  am_adam: {
    id: 'am_adam',
    name: 'Adam',
    gender: 'male',
    accent: 'american',
    langCode: 'a',
  },
  am_michael: {
    id: 'am_michael',
    name: 'Michael',
    gender: 'male',
    accent: 'american',
    langCode: 'a',
  },
  bf_emma: {
    id: 'bf_emma',
    name: 'Emma',
    gender: 'female',
    accent: 'british',
    langCode: 'b',
  },
  bm_george: {
    id: 'bm_george',
    name: 'George',
    gender: 'male',
    accent: 'british',
    langCode: 'b',
  },
  af_heart: {
    id: 'af_heart',
    name: 'Heart',
    gender: 'female',
    accent: 'american',
    langCode: 'a',
  },
};

// Deterministic style seed vector per voice for ONNX inference
export function getVoiceStyleVector(voiceId: string): Float32Array {
  const vector = new Float32Array(512);
  let seed = 0;
  for (let i = 0; i < voiceId.length; i++) {
    seed = (seed * 31 + voiceId.charCodeAt(i)) & 0xffffffff;
  }

  // Deterministic pseudo-random style vector matching standard normal distribution
  let state = seed;
  for (let i = 0; i < 512; i++) {
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    const u1 = Math.max(1e-7, (state >>> 0) / 4294967296);
    state = (state * 1664525 + 1013904223) & 0xffffffff;
    const u2 = (state >>> 0) / 4294967296;
    // Box-Muller transform for unit variance
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    vector[i] = z0 * 0.1; // scale for stability
  }

  return vector;
}

export function isValidKokoroVoice(voiceId: string): boolean {
  return voiceId in KOKORO_VOICES;
}
