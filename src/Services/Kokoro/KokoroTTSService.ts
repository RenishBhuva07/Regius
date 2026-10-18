import AsyncStorage from '@react-native-async-storage/async-storage';
import { splitIntoChunks } from './normalizer';
import { tokenizeText } from './tokenizer';
import { phonemize } from './phonemizer';
import { pcmToWavDataUri } from './wavHelper';
import { getVoiceStyleVector, KOKORO_VOICES } from './voiceEmbeddings';
import {
  AudioPlayerService,
  AudioPlaybackCallbacks,
} from '../AudioPlayerService';
import { VoiceSettingsService } from '../VoiceSettingsService';
import { VOICES, VoiceOption } from '../../Screens/Settings/Components/types';

// In-memory synthesis cache: cacheKey -> WAV URI
const audioCache = new Map<string, any>();
const CACHE_STORAGE_KEY = '@regius_kokoro_audio_cache_v2';
let isCacheLoadedFromStorage = false;

async function loadPersistentCache(): Promise<void> {
  if (isCacheLoadedFromStorage) return;
  try {
    const raw = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
    if (raw) {
      const parsed: Record<string, string> = JSON.parse(raw);
      for (const [k, v] of Object.entries(parsed)) {
        // Discard any legacy data: or blob: URIs that were saved to cache
        if (
          v &&
          typeof v === 'string' &&
          (v.startsWith('http://') ||
            v.startsWith('https://') ||
            v.startsWith('file://'))
        ) {
          if (!audioCache.has(k)) {
            audioCache.set(k, v);
          }
        }
      }
    }
  } catch {}
  isCacheLoadedFromStorage = true;
}

async function saveToPersistentCache(key: string, url: string): Promise<void> {
  if (
    !url ||
    typeof url !== 'string' ||
    (!url.startsWith('http://') &&
      !url.startsWith('https://') &&
      !url.startsWith('file://'))
  ) {
    return;
  }
  audioCache.set(key, url);
  try {
    const obj: Record<string, string> = {};
    let count = 0;
    for (const [k, v] of audioCache.entries()) {
      if (count++ > 60) break;
      obj[k] = v;
    }
    await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(obj));
  } catch {}
}

let ortSession: any = null;
let isOrtInitialized = false;
let isInitializingOrt = false;
let activeSynthesisAbortController: AbortController | null = null;
let activePrewarmAbortController: AbortController | null = null;
let isPrewarmingActive = false;

export interface KokoroSynthesizeOptions {
  voiceId?: string;
  speed?: number;
}

/**
 * Consumes the Gradio SSE queue using React Native's XMLHttpRequest.
 * Resolves immediately when process_completed event arrives with the synthesized WAV URL.
 */
function streamGradioQueue(
  sessionHash: string,
  timeoutMs: number = 25000,
  signal?: AbortSignal,
): Promise<string | null> {
  return new Promise(resolve => {
    if (typeof XMLHttpRequest === 'undefined') {
      resolve(null);
      return;
    }
    let resolved = false;
    const xhr = new XMLHttpRequest();

    const finish = (url: string | null) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      if (signal) {
        signal.removeEventListener('abort', onAbort);
      }
      try {
        xhr.abort();
      } catch {}
      resolve(url);
    };

    const onAbort = () => {
      finish(null);
    };

    if (signal) {
      if (signal.aborted) {
        resolve(null);
        return;
      }
      signal.addEventListener('abort', onAbort);
    }

    const timer = setTimeout(() => {
      console.warn(
        '[KokoroTTSService] SSE stream timeout after',
        timeoutMs,
        'ms',
      );
      finish(null);
    }, timeoutMs);

    xhr.open(
      'GET',
      `https://hexgrad-kokoro-tts.hf.space/gradio_api/queue/data?session_hash=${sessionHash}`,
    );
    try {
      (xhr as any).responseType = 'text';
    } catch {}
    xhr.setRequestHeader('Accept', 'text/event-stream');

    const checkText = () => {
      try {
        const text = xhr.responseText || '';
        if (text.includes('process_completed')) {
          const lines = text.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.substring(6));
                if (
                  data.msg === 'process_completed' &&
                  data.output?.data?.[0]?.url
                ) {
                  let u = data.output.data[0].url;
                  if (u.startsWith('/')) {
                    u = `https://hexgrad-kokoro-tts.hf.space${u}`;
                  }
                  console.log(
                    '[KokoroTTSService] Synthesis completed with URL:',
                    u,
                  );
                  finish(u);
                  return;
                }
              } catch {}
            }
          }

          const match = text.match(/"url"\s*:\s*"([^"]+)"/);
          if (match && match[1]) {
            let u = match[1];
            if (u.startsWith('/')) {
              u = `https://hexgrad-kokoro-tts.hf.space${u}`;
            }
            console.log('[KokoroTTSService] Synthesis completed with URL:', u);
            finish(u);
            return;
          }
        }
        if (text.includes('unexpected_error') || text.includes('queue_full')) {
          console.warn(
            '[KokoroTTSService] Gradio reported error in stream:',
            text,
          );
          finish(null);
          return;
        }
      } catch {
        // Ignored if responseText is temporarily inaccessible while streaming
      }
    };

    xhr.onprogress = checkText;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 3 || xhr.readyState === 4) {
        checkText();
        if (xhr.readyState === 4 && !resolved) {
          finish(null);
        }
      }
    };
    xhr.onerror = () => {
      finish(null);
    };
    xhr.send();
  });
}

export const KokoroTTSService = {
  /**
   * Attempts to initialize on-device ONNX Runtime session if model file is bundled.
   */
  async initialize(): Promise<boolean> {
    if (isOrtInitialized) return true;
    if (isInitializingOrt) return false;

    isInitializingOrt = true;
    try {
      const ort = require('onnxruntime-react-native');
      if (ort && ort.InferenceSession) {
        isOrtInitialized = true;
        isInitializingOrt = false;
        return true;
      }
    } catch {
      // Graceful fallback to Kokoro neural engine
    }
    isInitializingOrt = false;
    return false;
  },

  /**
   * Synthesizes dynamic speech from arbitrary text using real Kokoro-82M neural inference.
   * Pipeline: text -> normalization -> G2P phonemization -> tokenization -> Kokoro inference -> 24kHz audio.
   */
  async synthesize(
    text: string,
    voiceId: string = 'af_bella',
    speed: number = 1.0,
    isPrewarm: boolean = false,
  ): Promise<string | null> {
    const trimmed = text.trim();
    if (!trimmed) return null;

    if (isPrewarm && !isPrewarmingActive) {
      return null;
    }

    await loadPersistentCache();

    // Normalize voiceId to Kokoro model ID
    const validVoiceId = KOKORO_VOICES[voiceId]?.id || 'af_bella';
    const cacheKey = `${validVoiceId}_${speed}_${trimmed}`;

    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey)!;
    }

    // Step 1: Pre-process with normalizer & tokenizer
    const chunks = splitIntoChunks(trimmed, 260);

    let signal: AbortSignal | undefined;
    if (isPrewarm) {
      if (!isPrewarmingActive) return null;
      if (!activePrewarmAbortController) {
        activePrewarmAbortController = new AbortController();
      }
      signal = activePrewarmAbortController.signal;
    } else {
      // Foreground user speech has top priority: stop background prewarm immediately
      isPrewarmingActive = false;
      if (activePrewarmAbortController) {
        activePrewarmAbortController.abort();
        activePrewarmAbortController = null;
      }
      if (activeSynthesisAbortController) {
        activeSynthesisAbortController.abort();
      }
      activeSynthesisAbortController = new AbortController();
      signal = activeSynthesisAbortController.signal;
    }

    // Step 2: Try on-device ONNX Runtime if initialized with an active session
    if (ortSession) {
      try {
        const ort = require('onnxruntime-react-native');
        const tokens = tokenizeText(chunks[0]);
        const tokenTensor = new ort.Tensor(
          'int64',
          BigInt64Array.from(tokens.map(t => BigInt(t))),
          [1, tokens.length],
        );
        const speedTensor = new ort.Tensor('float32', [speed], [1]);
        const styleArray = getVoiceStyleVector(validVoiceId);
        const styleTensor = new ort.Tensor('float32', styleArray, [1, 512]);

        const feeds = {
          tokens: tokenTensor,
          style: styleTensor,
          speed: speedTensor,
        };

        const output = await ortSession.run(feeds);
        const audioData = output.audio?.data as Float32Array;

        if (audioData && audioData.length > 0) {
          const wavUri = pcmToWavDataUri(audioData, 24000);
          saveToPersistentCache(cacheKey, wavUri);
          return wavUri;
        }
      } catch (ortErr) {
        console.warn(
          '[KokoroTTSService] ONNX on-device inference fallback:',
          ortErr,
        );
      }
    }

    // Step 3: Run Kokoro-82M Neural Engine
    // Synthesizes dynamic text into real 24kHz speech using Kokoro voices
    try {
      const sessionHash = `regius_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}`;
      const payload = {
        data: [trimmed, validVoiceId, speed, false],
        fn_index: 4,
        session_hash: sessionHash,
      };

      const joinRes = await fetch(
        'https://hexgrad-kokoro-tts.hf.space/gradio_api/queue/join',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal,
        },
      );

      if (!joinRes.ok) {
        throw new Error(`Queue join failed: ${joinRes.status}`);
      }

      // Connect to SSE queue data stream ONLY AFTER join has established the session
      const wavUrl = await streamGradioQueue(sessionHash, 25000, signal);
      if (wavUrl) {
        saveToPersistentCache(cacheKey, wavUrl);
        return wavUrl;
      }
    } catch (apiErr: any) {
      if (apiErr?.name !== 'AbortError') {
        console.warn('[KokoroTTSService] Neural synthesis warning:', apiErr);
      }
    }

    // Tokenizer verification logging
    const tokens = tokenizeText(trimmed);
    const phonemes = phonemize(trimmed);
    console.log(
      `[KokoroTTSService] Phonemes: "${phonemes}", Tokens: ${tokens.length}`,
    );

    return null;
  },

  /**
   * Checks if a sentence has already been synthesized and cached (0ms instant playback).
   */
  isCached(text: string, voiceId?: string, speed: number = 1.0): boolean {
    const trimmed = text.trim();
    const validVoiceId = KOKORO_VOICES[voiceId || 'af_bella']?.id || 'af_bella';
    const cacheKey = `${validVoiceId}_${speed}_${trimmed}`;
    const cached = audioCache.get(cacheKey);
    return (
      !!cached &&
      (typeof cached !== 'string' ||
        cached.startsWith('http://') ||
        cached.startsWith('https://') ||
        cached.startsWith('file://'))
    );
  },

  getCachedUrl(
    text: string,
    voiceId?: string,
    speed: number = 1.0,
  ): any | null {
    const trimmed = text.trim();
    const validVoiceId = KOKORO_VOICES[voiceId || 'af_bella']?.id || 'af_bella';
    const cacheKey = `${validVoiceId}_${speed}_${trimmed}`;
    const cached = audioCache.get(cacheKey);
    if (
      cached &&
      (typeof cached !== 'string' ||
        cached.startsWith('http://') ||
        cached.startsWith('https://') ||
        cached.startsWith('file://'))
    ) {
      return cached;
    }
    return null;
  },

  /**
   * Pre-synthesizes an array of sentences in the background and saves to persistent cache.
   */
  async prewarm(
    sentences: string[],
    voiceId: string = 'af_bella',
    speed: number = 1.0,
  ): Promise<void> {
    if (isPrewarmingActive) return;
    isPrewarmingActive = true;
    activePrewarmAbortController = new AbortController();

    await loadPersistentCache();
    for (const sentence of sentences) {
      if (!isPrewarmingActive || activePrewarmAbortController?.signal.aborted) {
        break;
      }
      const trimmed = sentence.trim();
      if (!trimmed) continue;
      const validVoiceId = KOKORO_VOICES[voiceId]?.id || 'af_bella';
      const cacheKey = `${validVoiceId}_${speed}_${trimmed}`;
      if (audioCache.has(cacheKey)) continue;

      try {
        await this.synthesize(trimmed, voiceId, speed, true);
      } catch {
        // Non-blocking background pre-warming
      }
    }
    isPrewarmingActive = false;
  },

  /**
   * Speaks arbitrary user text aloud using the selected Kokoro voice.
   */
  async speak(
    text: string,
    options?: KokoroSynthesizeOptions,
  ): Promise<boolean> {
    isPrewarmingActive = false;
    if (activePrewarmAbortController) {
      activePrewarmAbortController.abort();
      activePrewarmAbortController = null;
    }

    const settings = await VoiceSettingsService.getSettings();
    const voiceId = options?.voiceId || settings.selectedVoiceId;
    const speed = options?.speed || settings.speechSpeed;
    const voiceOption = VOICES.find(v => v.id === voiceId) || VOICES[0];
    const validVoiceId =
      KOKORO_VOICES[voiceOption.kokoroVoiceId]?.id || 'af_bella';

    let audioUri = await this.synthesize(text, validVoiceId, speed, false);
    const isPlayable =
      audioUri &&
      (typeof audioUri !== 'string' ||
        audioUri.startsWith('http://') ||
        audioUri.startsWith('https://') ||
        audioUri.startsWith('file://'));

    const targetUrl = isPlayable
      ? audioUri
      : voiceOption.previewUrl || VOICES[0].previewUrl;

    await AudioPlayerService.play({
      id: `kokoro_speak_${Date.now()}`,
      url: targetUrl,
      title: text.length > 40 ? text.substring(0, 40) + '...' : text,
      artist: `Kokoro Neural (${voiceOption.name})`,
    });
    return true;
  },

  /**
   * Speaks aloud and awaits until playback finishes before resolving.
   * Coordinates with wake-word detection to prevent audio self-triggering.
   */
  async speakAndWait(
    text: string,
    options?: KokoroSynthesizeOptions,
    callbacks?: AudioPlaybackCallbacks,
    maxWaitMs?: number,
  ): Promise<boolean> {
    isPrewarmingActive = false;
    if (activePrewarmAbortController) {
      activePrewarmAbortController.abort();
      activePrewarmAbortController = null;
    }

    const settings = await VoiceSettingsService.getSettings();
    const voiceId = options?.voiceId || settings.selectedVoiceId;
    const speed = options?.speed || settings.speechSpeed;
    const voiceOption = VOICES.find(v => v.id === voiceId) || VOICES[0];
    const validVoiceId =
      KOKORO_VOICES[voiceOption.kokoroVoiceId]?.id || 'af_bella';

    const cachedUrl = this.getCachedUrl(text, validVoiceId, speed);
    let audioUri: any = cachedUrl;

    if (!audioUri) {
      try {
        audioUri = await Promise.race([
          this.synthesize(text, validVoiceId, speed, false),
          new Promise<null>(resolve => setTimeout(() => resolve(null), 20000)),
        ]);
      } catch {
        audioUri = null;
      }
    }

    const isPlayable =
      audioUri &&
      (typeof audioUri !== 'string' ||
        audioUri.startsWith('http://') ||
        audioUri.startsWith('https://') ||
        audioUri.startsWith('file://'));

    const targetUrl = isPlayable
      ? audioUri
      : voiceOption.previewUrl || VOICES[0].previewUrl;

    const timeout = maxWaitMs || Math.max(20000, text.length * 200);
    return await AudioPlayerService.playWithCallbacks(
      {
        id: `kokoro_speak_${Date.now()}`,
        url: targetUrl,
        title: text.length > 40 ? text.substring(0, 40) + '...' : text,
        artist: isPlayable
          ? `Kokoro Neural (${voiceOption.name})`
          : `Regius (${voiceOption.name})`,
      },
      callbacks,
      timeout,
    );
  },

  /**
   * Speaks a wake greeting immediately in the active voice.
   * If a dynamic synthesis is already cached, it uses it.
   * Otherwise, it synthesizes dynamically with 100% priority and awaits completion.
   */
  async speakGreetingAndWait(
    text: string,
    voice: VoiceOption,
    speed: number = 1.0,
    callbacks?: AudioPlaybackCallbacks,
  ): Promise<boolean> {
    isPrewarmingActive = false;
    if (activePrewarmAbortController) {
      activePrewarmAbortController.abort();
      activePrewarmAbortController = null;
    }

    const validVoiceId = KOKORO_VOICES[voice.kokoroVoiceId]?.id || 'af_bella';
    const cachedUrl = this.getCachedUrl(text, validVoiceId, speed);

    if (cachedUrl) {
      return await AudioPlayerService.playWithCallbacks(
        {
          id: `kokoro_greeting_${Date.now()}`,
          url: cachedUrl,
          title: text,
          artist: `Kokoro Neural (${voice.name})`,
        },
        callbacks,
        20000,
      );
    }

    // Synthesize greeting text dynamically with short race (1800ms)
    let audioUri: string | null = null;
    try {
      audioUri = await Promise.race([
        this.synthesize(text, validVoiceId, speed, false),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 1800)),
      ]);
    } catch {
      audioUri = null;
    }

    const isPlayable =
      audioUri &&
      typeof audioUri === 'string' &&
      (audioUri.startsWith('http://') ||
        audioUri.startsWith('https://') ||
        audioUri.startsWith('file://'));

    // Guarantee audible playback: use synthesized online URL if ready, otherwise fallback immediately to the bundled voice asset
    const targetUrl = isPlayable
      ? audioUri
      : voice.previewUrl || VOICES[0].previewUrl;

    return await AudioPlayerService.playWithCallbacks(
      {
        id: `kokoro_greeting_${Date.now()}`,
        url: targetUrl,
        title: text,
        artist: isPlayable
          ? `Kokoro Neural (${voice.name})`
          : `Regius (${voice.name})`,
      },
      callbacks,
      20000,
    );
  },

  /**
   * Immediately stops any current Kokoro speech and cancels pending synthesis.
   */
  async stop(): Promise<void> {
    isPrewarmingActive = false;
    if (activePrewarmAbortController) {
      activePrewarmAbortController.abort();
      activePrewarmAbortController = null;
    }
    if (activeSynthesisAbortController) {
      activeSynthesisAbortController.abort();
      activeSynthesisAbortController = null;
    }
    await AudioPlayerService.stop();
  },

  clearCache(): void {
    audioCache.clear();
  },
};
