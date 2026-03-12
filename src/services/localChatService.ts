import { GoogleGenAI, Type } from "@google/genai";
import { Language, Message, PatientDemographics } from "../types";
import { searchOpenFDA, searchPubMed, searchOSM, fetchProcedureImage } from "./apiServices";

const TRANSLATIONS: Partial<Record<Language, any>> = {
  en: {
    insurance_title: "### Insurance Justification Letter (Draft)",
    insurance_subject: "**Subject:** Medical Necessity for IR Procedure",
  },
  hi: {
    insurance_title: "### बीमा औचित्य पत्र (ड्राफ्ट)",
    insurance_subject: "**विषय:** IR प्रक्रिया की चिकित्सीय आवश्यकता",
  },
  // Add other translations if needed
};

export async function getChatResponse(messages: Message[], language: Language, demographics?: PatientDemographics): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const lastMessage = messages[messages.length - 1];
    const isInsuranceRequest = lastMessage.text.includes("Please generate a formal insurance justification letter");

    if (isInsuranceRequest) {
      const missingFields = [];
      if (!demographics?.symptoms) missingFields.push("Current Symptoms");
      if (!demographics?.diagnosis) missingFields.push("Confirmed Diagnosis");
      if (!demographics?.age) missingFields.push("Age");

      if (missingFields.length > 0) {
        return `### Information Needed for Insurance Justification\nTo generate a precise justification letter, I need a few more details. Please update your **Patient Profile** (user icon at the top) with the following:\n${missingFields.map(f => `- **${f}**`).join('\n')}\n\nOnce updated, ask me again for the insurance justification.`;
      }
    }

    // Prepare system instruction
    const systemInstruction = `You are a highly empathetic, patient-friendly Interventional Radiology (IR) Assistant. 
Your goal is to explain complex medical procedures in simple, reassuring, and easy-to-understand language.
Always maintain a supportive and professional tone. 
Do not provide definitive medical diagnoses; always remind the patient to consult their doctor.

Current Patient Context:
- Age/Gender: ${demographics?.age || 'Unknown'} / ${demographics?.gender || 'Unknown'}
- Symptoms: ${demographics?.symptoms || 'None reported'}
- Diagnosis: ${demographics?.diagnosis || 'None reported'}
- Medical History: ${demographics?.history || 'None reported'}

Language to respond in: ${language} (Respond primarily in this language, using appropriate medical terms).

If the user asks for an insurance justification letter, generate a formal, professional draft using their demographics and medical history, explaining why an IR procedure is medically necessary and cost-effective compared to traditional surgery.

If the user asks about Ayushman Bharat supported procedures and their tentative pricing for Interventional Radiology, use the googleSearch tool to find the latest information from the Karnataka SAST Arogya portal or other official sources.
If the user asks to find nearby Interventional Radiology providers or services, use the searchOSM tool to search for them based on their location.

If the user asks for an image, diagram, or visual of a procedure, use the fetchProcedureImage tool to get image URLs. You MUST embed the returned image URLs in your response using Markdown image syntax: ![Title](URL).

You have access to additional free tools:
- searchOpenFDA: Use this to check for drug warnings, side effects, or bleeding risks if the user mentions specific medications.
- searchPubMed: Use this to find recent medical research articles or abstracts if the user asks about the success rate or recent advancements of a procedure.
- searchOSM: Use this as an alternative to find nearby hospitals or clinics if needed.
- fetchProcedureImage: Fetch medical diagrams or images of a procedure from Wikipedia.`;

    // Format messages for Gemini
    const formattedContents = messages.map(msg => {
      const parts: any[] = [];
      
      if (msg.text) {
        parts.push({ text: msg.text });
      }

      if (msg.attachments && msg.attachments.length > 0) {
        msg.attachments.forEach(att => {
          // Extract base64 data from data URL (e.g., "data:image/jpeg;base64,/9j/4AAQ...")
          const base64Data = att.data.split(',')[1];
          if (base64Data) {
            parts.push({
              inlineData: {
                data: base64Data,
                mimeType: att.type
              }
            });
          }
        });
      }

      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts
      };
    });

    const config: any = {
      systemInstruction,
      temperature: 0.7,
      tools: [
        { googleSearch: {} },
        {
          functionDeclarations: [
            {
              name: 'searchOpenFDA',
              description: 'Search the FDA database for drug information, side effects, and warnings (e.g., bleeding risks).',
              parameters: { type: Type.OBJECT, properties: { drugName: { type: Type.STRING } }, required: ['drugName'] }
            },
            {
              name: 'searchPubMed',
              description: 'Search PubMed for recent medical research articles and abstracts.',
              parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING } }, required: ['query'] }
            },
            {
              name: 'searchOSM',
              description: 'Search OpenStreetMap for nearby hospitals or clinics.',
              parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING } }, required: ['query'] }
            },
            {
              name: 'fetchProcedureImage',
              description: 'Fetch medical diagrams or images of a procedure from Wikipedia.',
              parameters: { type: Type.OBJECT, properties: { query: { type: Type.STRING } }, required: ['query'] }
            }
          ]
        }
      ],
    };

    if (demographics?.latLng) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: demographics.latLng.latitude,
            longitude: demographics.latLng.longitude
          }
        }
      };
    }

    let response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: formattedContents,
      config
    });

    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionResponses = [];
      for (const call of response.functionCalls) {
        if (call.name === 'searchOpenFDA') {
          const result = await searchOpenFDA(call.args.drugName as string);
          functionResponses.push({ name: call.name, response: result });
        } else if (call.name === 'searchPubMed') {
          const result = await searchPubMed(call.args.query as string);
          functionResponses.push({ name: call.name, response: result });
        } else if (call.name === 'searchOSM') {
          const result = await searchOSM(call.args.query as string, demographics?.latLng?.latitude, demographics?.latLng?.longitude);
          functionResponses.push({ name: call.name, response: result });
        } else if (call.name === 'fetchProcedureImage') {
          const result = await fetchProcedureImage(call.args.query as string);
          functionResponses.push({ name: call.name, response: result });
        }
      }

      formattedContents.push({
        role: 'model',
        parts: response.functionCalls.map(fc => ({ functionCall: fc }))
      });
      formattedContents.push({
        role: 'user',
        parts: functionResponses.map(fr => ({
          functionResponse: {
            name: fr.name,
            response: fr.response
          }
        }))
      });

      response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: formattedContents,
        config
      });
    }

    let text = response.text || "I'm sorry, I couldn't generate a response.";
    
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
      const links: string[] = [];
      chunks.forEach((chunk: any) => {
        if (chunk.web?.uri && chunk.web?.title) {
          links.push(`- [${chunk.web.title}](${chunk.web.uri})`);
        }
        if (chunk.maps?.uri && chunk.maps?.title) {
          links.push(`- [${chunk.maps.title}](${chunk.maps.uri})`);
        }
      });
      
      // Deduplicate links
      const uniqueLinks = [...new Set(links)];
      if (uniqueLinks.length > 0) {
        text += `\n\n### References & Locations\n` + uniqueLinks.join('\n');
      }
    }

    // Append resources if it's a general medical query (simple heuristic)
    if (!isInsuranceRequest && messages.length < 5 && (!chunks || chunks.length === 0)) {
      text += `\n\n### Official Resources\n- **CIRSE**: [https://www.cirse.org/](https://www.cirse.org/)\n- **SIR**: [https://www.sirweb.org/](https://www.sirweb.org/)\n- **The II**: [https://theii.org/](https://theii.org/)`;
    }

    return text;
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    const errorStr = JSON.stringify(error) + (error.message || '');
    if (errorStr.includes('429') || errorStr.includes('RESOURCE_EXHAUSTED') || errorStr.includes('quota')) {
      return "I'm sorry, but the AI service has exceeded its current quota or rate limit. Please try again in a few moments.";
    }
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
}

export async function logAnalytics(data: any) {
  console.log('Analytics Log:', data);
  try {
    await fetch('https://formsubmit.co/ajax/sunilkalmath@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: "New Chatbot Telemetry Log",
        ...data
      })
    });
  } catch (error) {
    console.error('Failed to send telemetry:', error);
  }
}
