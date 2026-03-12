// @ts-ignore
import { pipeline, TextGenerationPipeline, env } from "@huggingface/transformers";
import { Message, Language, PatientDemographics } from "../types";
import { GoogleGenAI } from "@google/genai";

// Configure transformers.js for maximum compatibility in restricted environments (like iframes)
env.allowLocalModels = false;
env.useBrowserCache = true;
// Disable multi-threading to avoid SharedArrayBuffer issues in sandboxed environments
// @ts-ignore
if (env.backends && env.backends.onnx && env.backends.onnx.wasm) {
  // @ts-ignore
  env.backends.onnx.wasm.numThreads = 1;
}

let generator: any = null;
const MODEL_ID = "Xenova/Qwen1.5-0.5B-Chat"; // Using Xenova's optimized repo for better compatibility

export async function initLocalModel(
  onProgress: (progress: { text: string; loaded?: number; total?: number }) => void
): Promise<any> {
  if (generator) return generator;
  
  try {
    onProgress({ text: "Loading democratic AI engine (CPU/GPU compatible)..." });
    
    generator = await pipeline('text-generation', MODEL_ID, {
      device: 'webgpu', // Try WebGPU first
      dtype: 'q4', // 4-bit quantization for speed and low memory
      progress_callback: (p: any) => {
        if (p.status === 'progress') {
          onProgress({ 
            text: `Downloading AI model: ${Math.round(p.progress)}%`,
            loaded: p.loaded,
            total: p.total
          });
        } else if (p.status === 'done') {
          onProgress({ text: "Model downloaded. Initializing..." });
        }
      }
    });
    
    return generator;
  } catch (error) {
    console.warn("WebGPU failed, falling back to CPU (Wasm). This will be slower but works on all devices.", error);
    
    // Fallback to CPU (Wasm) if WebGPU fails
    generator = await pipeline('text-generation', MODEL_ID, {
      device: 'wasm', 
      dtype: 'q4',
      progress_callback: (p: any) => {
        if (p.status === 'progress') {
          onProgress({ 
            text: `Downloading AI model (CPU mode): ${Math.round(p.progress)}%`
          });
        }
      }
    });
    
    return generator;
  }
}

async function getGeminiFallback(
  messages: Message[],
  language: Language,
  demographics?: PatientDemographics
): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const systemPrompt = `You are a helpful, empathetic, and highly knowledgeable Interventional Radiology (IR) AI assistant.
Your goal is to educate patients about minimally invasive IR procedures in simple, easy-to-understand language.
Current User Language: ${language}
${demographics ? `Patient Context: Age: ${demographics.age || 'Unknown'}, Gender: ${demographics.gender || 'Unknown'}, History: ${demographics.history || 'Unknown'}, Medications: ${demographics.medications || 'None'}, Allergies: ${demographics.allergies || 'None'}, Procedure: ${demographics.procedure || 'Not Specified'}` : ''}
Please respond directly to the user's query in their language. Keep responses concise.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      })),
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini fallback error:", error);
    return "I'm sorry, both the local model and the cloud fallback encountered errors.";
  }
}

export async function getLocalChatResponse(
  messages: Message[],
  language: Language,
  demographics?: PatientDemographics
): Promise<string> {
  if (!generator) {
    console.warn("Local model not initialized, falling back to Gemini Cloud.");
    return getGeminiFallback(messages, language, demographics);
  }

  const systemPrompt = `You are a helpful, empathetic, and highly knowledgeable Interventional Radiology (IR) AI assistant.
Current User Language: ${language}
${demographics ? `Patient Context: Age: ${demographics.age || 'Unknown'}, Gender: ${demographics.gender || 'Unknown'}, History: ${demographics.history || 'Unknown'}, Medications: ${demographics.medications || 'None'}, Allergies: ${demographics.allergies || 'None'}, Procedure: ${demographics.procedure || 'Not Specified'}` : ''}
Respond directly to the user's query in their language.`;

  // Format for Qwen2 Chat
  const prompt = `<|im_start|>system
${systemPrompt}<|im_end|>
${messages.map(m => `<|im_start|>${m.role === 'user' ? 'user' : 'assistant'}
${m.text}<|im_end|>`).join('\n')}
<|im_start|>assistant
`;

  try {
    const output = await generator(prompt, {
      max_new_tokens: 256,
      temperature: 0.7,
      do_sample: true,
      top_k: 50,
      return_full_text: false,
    });

    // @ts-ignore
    const content = output[0].generated_text.trim();
    return content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Local model generation error, falling back to Gemini Cloud:", error);
    return getGeminiFallback(messages, language, demographics);
  }
}
