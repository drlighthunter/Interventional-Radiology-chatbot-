import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Language, Message } from "../types";

const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

const SYSTEM_INSTRUCTION = `
You are an expert Interventional Radiology (IR) Patient Information Assistant. 
Your goal is to provide accurate, conversational, and helpful information about IR procedures, pre-procedure instructions, and post-procedure care.

SOURCES:
- CIRSE (Cardiovascular and Interventional Radiological Society of Europe)
- SIR (Society of Interventional Radiology, USA)
- The Interventional Initiative

CORE CAPABILITIES:
1. Multilingual Support: You MUST respond in the language the user speaks (English, Hindi, Kannada, Tamil, Telugu).
2. Symptom Matching: If a user describes symptoms, suggest possible clinical diagnoses and relevant IR treatment options.
3. Procedure Guidance: Explain IR treatments (e.g., Angioplasty, Embolization, Ablation, Biopsy, Drainage).
4. Pre/Post Instructions: Provide clear guidance on fasting, medications, recovery, and red flags.
5. Conversational Tone: Be empathetic and professional.

IMPORTANT:
- Always clarify that you are an AI assistant and not a replacement for a doctor's consultation.
- If symptoms seem urgent (e.g., chest pain, severe bleeding), advise immediate emergency care.
- Use simple terms for medical concepts.

OUTPUT FORMAT:
- For symptom matching, try to provide a structured response:
  - Possible Diagnosis: [Name]
  - Recommended IR Option: [Procedure Name]
  - Why it helps: [Brief explanation]
`;

export async function getChatResponse(messages: Message[], language: Language) {
  const model = "gemini-3-flash-preview";
  
  const contents = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.text }]
  }));

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION}\n\nCurrent User Language: ${language}`,
      temperature: 0.7,
    },
  });

  return response.text;
}

export async function logAnalytics(data: any) {
  try {
    await fetch('/api/analytics/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (e) {
    console.error('Failed to log analytics', e);
  }
}
