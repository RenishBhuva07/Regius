// Encodes Float32Array PCM samples (24kHz) into WAV buffer/data URI

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

export function pcmToWavBuffer(
  samples: Float32Array,
  sampleRate: number = 24000,
): ArrayBuffer {
  const numChannels = 1; // Mono
  const bytesPerSample = 2; // 16-bit PCM
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const bufferSize = 44 + dataSize;

  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // RIFF Chunk Descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size for PCM
  view.setUint16(20, 1, true); // AudioFormat: 1 = PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); // BitsPerSample = 16

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM 16-bit samples with clipping
  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    // Clamp sample between -1.0 and 1.0
    const s = Math.max(-1, Math.min(1, samples[i]));
    // Convert to 16-bit signed integer
    const int16 = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  return buffer;
}

export function bufferToBase64(buffer: ArrayBuffer): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  let result = '';
  let i = 0;

  while (i < len) {
    const b1 = bytes[i++];
    const b2 = i < len ? bytes[i++] : 0;
    const b3 = i < len ? bytes[i++] : 0;

    const c1 = b1 >> 2;
    const c2 = ((b1 & 3) << 4) | (b2 >> 4);
    let c3 = ((b2 & 15) << 2) | (b3 >> 6);
    let c4 = b3 & 63;

    if (i - 1 > len) {
      c3 = c4 = 64;
    } else if (i > len) {
      c4 = 64;
    }

    result +=
      chars.charAt(c1) +
      chars.charAt(c2) +
      (c3 === 64 ? '=' : chars.charAt(c3)) +
      (c4 === 64 ? '=' : chars.charAt(c4));
  }
  return result;
}

export function pcmToWavDataUri(
  samples: Float32Array,
  sampleRate: number = 24000,
): string {
  const buffer = pcmToWavBuffer(samples, sampleRate);
  const base64 = bufferToBase64(buffer);
  return `data:audio/wav;base64,${base64}`;
}
