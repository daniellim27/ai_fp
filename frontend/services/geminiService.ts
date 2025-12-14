import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Vulnerability } from "../types";
import { SAMPLE_VULNERABILITY_PROMPT } from "../constants";

// Initialize Gemini
// Note: In a real production app, API keys should be handled securely on the backend.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const vulnerabilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    vulnerabilities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          severity: { type: Type.STRING },
          lineNumber: { type: Type.NUMBER },
          description: { type: Type.STRING },
          codeSnippet: { type: Type.STRING },
          suggestion: { type: Type.STRING },
        },
        required: ["type", "severity", "lineNumber", "description", "codeSnippet", "suggestion"]
      },
    },
  },
};

export const analyzeCodeForVulnerabilities = async (
  code: string,
  filename: string
): Promise<Vulnerability[]> => {
  try {
    const prompt = `${SAMPLE_VULNERABILITY_PROMPT}\n\nFileName: ${filename}\n\nCode:\n${code}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: vulnerabilitySchema,
        temperature: 0.1, // Low temperature for deterministic analysis
      },
    });

    const text = response.text;
    if (!text) return [];

    const result = JSON.parse(text);
    return result.vulnerabilities || [];
  } catch (error) {
    console.error(`Error analyzing ${filename}:`, error);
    return [];
  }
};
