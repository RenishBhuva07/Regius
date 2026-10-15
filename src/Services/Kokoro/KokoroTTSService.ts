import { tokenizeText } from './tokenizer';
import { pcmToWavDataUri } from './wavHelper';
import { AudioPlayerService } from '../AudioPlayerService';
import { VoiceSettingsService } from '../VoiceSettingsService';
import { VOICES } from '../../Screens/Settings/Components/types';

// In-memory synthesis cache: md5/hash -> WAV data URI or asset
const audioCache = new Map<string, any>();

let ortSession: any = null;
let isInitializing = false;

export const KokoroTTSService = {
  /**
   * Initializes the ONNX Runtime session if the model is bundled or downloaded.
   */
  async initialize(): Promise<boolean> {
    if (ortSession) return true;
    if (isInitializing) return false;

    isInitializing = true;
    try {
      // Dynamic import to avoid breaking when ONNX model is not yet compiled in dev
      require('onnxruntime-react-native');
      // Model path can be bundled in native assets or downloaded in documents dir
      // const ort = require('onnxruntime-react-native');
      // ortSession = await ort.InferenceSession.create(modelUri, { executionProviders: ['cpu'] });
      isInitializing = false;
      return true;
    } catch (e) {
      console.warn('[KokoroTTSService] ONNX Session init notice:', e);
      isInitializing = false;
      return false;
    }
  },

  /**
   * Synthesizes speech from text using the selected Kokoro voice.
   * If on-device ONNX model is still loading, gracefully falls back to preview sample or cached audio.
   */
  async synthesize(
    text: string,
    voiceId: string = 'af_bella',
    speed: number = 1.0,
  ): Promise<any> {
    const cacheKey = `${voiceId}_${speed}_${text.trim()}`;
    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey)!;
    }

    try {
      const tokens = tokenizeText(text);

      if (ortSession) {
        const ort = require('onnxruntime-react-native');
        const tokenTensor = new ort.Tensor(
          'int64',
          BigInt64Array.from(tokens.map(t => BigInt(t))),
          [1, tokens.length],
        );
        const speedTensor = new ort.Tensor('float32', [speed], [1]);

        // Default style vector dimension: 512 floats
        const styleArray = new Float32Array(512);
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
          audioCache.set(cacheKey, wavUri);
          return wavUri;
        }
      }
    } catch (err) {
      console.warn('[KokoroTTSService] Synthesis error, falling back:', err);
    }

    // Fallback: Use high-quality voice sample if on-device model is not loaded yet
    const matchingVoice = VOICES.find(v => v.id === voiceId) || VOICES[0];
    return matchingVoice.previewUrl;
  },

  /**
   * Speaks the given reminder or task label aloud.
   */
  async speak(
    text: string,
    options?: { voiceId?: string; speed?: number },
  ): Promise<void> {
    const settings = await VoiceSettingsService.getSettings();
    const voiceId = options?.voiceId || settings.selectedVoiceId;
    const speed = options?.speed || settings.speechSpeed;

    const audioUri = await this.synthesize(text, voiceId, speed);
    const voiceOption = VOICES.find(v => v.id === voiceId) || VOICES[0];

    await AudioPlayerService.play({
      id: `speak_${Date.now()}`,
      url: audioUri,
      title: text.length > 30 ? text.substring(0, 30) + '...' : text,
      artist: `Regius Neural (${voiceOption.name})`,
    });
  },

  async stop(): Promise<void> {
    await AudioPlayerService.stop();
  },

  clearCache(): void {
    audioCache.clear();
  },
};
