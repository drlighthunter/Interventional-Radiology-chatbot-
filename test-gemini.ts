import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function test() {
  try {
    const config: any = {
      temperature: 0.7,
      tools: [
        { googleSearch: {} },
        {
          functionDeclarations: [
            {
              name: 'searchOpenFDA',
              description: 'Search the FDA database',
              parameters: { type: Type.OBJECT, properties: { drugName: { type: Type.STRING } }, required: ['drugName'] }
            }
          ]
        }
      ],
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Hello",
      config
    });
    console.log("Success:", response.text);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}

test();
