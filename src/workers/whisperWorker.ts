// @ts-ignore
import { pipeline, env } from '@huggingface/transformers?v=3';

// Disable local models, use browser cache
env.allowLocalModels = false;
env.useBrowserCache = true;

let transcriber: any = null;

self.onmessage = async (e) => {
  const { type, audioData } = e.data;

  if (type === 'load') {
    try {
      self.postMessage({ status: 'loading' });
      transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
      self.postMessage({ status: 'ready' });
    } catch (err: any) {
      self.postMessage({ status: 'error', error: err.message });
    }
  } else if (type === 'transcribe') {
    if (!transcriber) {
      self.postMessage({ status: 'error', error: 'Model not loaded' });
      return;
    }
    try {
      self.postMessage({ status: 'transcribing' });
      const result = await transcriber(audioData);
      self.postMessage({ status: 'complete', text: result.text });
    } catch (err: any) {
      self.postMessage({ status: 'error', error: err.message });
    }
  }
};
