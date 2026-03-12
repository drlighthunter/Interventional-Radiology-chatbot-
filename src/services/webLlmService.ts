// @ts-ignore
import { CreateMLCEngine, InitProgressReport, MLCEngine } from "@mlc-ai/web-llm?v=4";
import { Message, Language, PatientDemographics } from "../types";

let engine: MLCEngine | null = null;
// Using TinyLlama (1.1B parameters, 16-bit floats, 1k context) to minimize VRAM usage (~675MB) for budget smartphones
const MODEL_ID = "TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC-1k"; 

export async function initLocalModel(
  onProgress: (progress: InitProgressReport) => void
): Promise<MLCEngine> {
  if (engine) return engine;
  
  try {
    engine = await CreateMLCEngine(MODEL_ID, {
      initProgressCallback: onProgress,
    });
    return engine;
  } catch (error) {
    console.error("Failed to initialize local model:", error);
    throw error;
  }
}

export async function getLocalChatResponse(
  messages: Message[],
  language: Language,
  demographics?: PatientDemographics
): Promise<string> {
  if (!engine) {
    throw new Error("Local model not initialized");
  }

  const systemPrompt = `You are a helpful, empathetic, and highly knowledgeable Interventional Radiology (IR) AI assistant.
Your goal is to educate patients about minimally invasive IR procedures in simple, easy-to-understand language.
Current User Language: ${language}
${demographics ? `Patient Context: Age: ${demographics.age || 'Unknown'}, Gender: ${demographics.gender || 'Unknown'}, History: ${demographics.history || 'Unknown'}` : ''}
Please respond directly to the user's query in their language. Keep responses concise.`;

  const formattedMessages = [
    { role: "system" as const, content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.text
    }))
  ];

  try {
    const reply = await engine.chat.completions.create({
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 512,
    });

    return reply.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Local model generation error:", error);
    return "I'm sorry, the local model encountered an error while generating a response.";
  }
}
