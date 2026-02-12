import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { PsychTestResult } from "../types";

// Use a stable model supported by @google/generative-ai
const MODEL_NAME = 'gemini-1.5-flash';

// Helper to safely get the model instance only when needed
const getModel = (useJson = false, responseSchema?: any) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your .env file or GitHub Secrets.");
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  if (useJson) {
    return genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });
  }
  
  return genAI.getGenerativeModel({ model: MODEL_NAME });
};

export const getDailyHoroscope = async (sign: string): Promise<string> => {
  try {
    const model = getModel();
    const result = await model.generateContent(
      `Write a short, witty, and fun daily horoscope for ${sign}. Keep it under 3 sentences. Be positive but sassy.`
    );
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error fetching horoscope:", error);
    return "The stars are cloudy today (API Key missing or Error). Try again later!";
  }
};

export const getPsychTest = async (): Promise<PsychTestResult | null> => {
  try {
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        question: { type: SchemaType.STRING },
        options: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              text: { type: SchemaType.STRING },
              interpretation: { type: SchemaType.STRING },
            },
            required: ["id", "text", "interpretation"],
          },
        },
      },
      required: ["question", "options"],
    };

    const model = getModel(true, schema);
    const result = await model.generateContent(
      "Create a fun, short psychological test. It should have 1 scenario/question and 4 distinct options. For each option, provide a brief personality interpretation."
    );

    const text = result.response.text();
    if (!text) return null;
    return JSON.parse(text) as PsychTestResult;
  } catch (error) {
    console.error("Error fetching psych test:", error);
    return null;
  }
};

export const getLuckyColor = async (): Promise<{ color: string; reason: string }> => {
  try {
    const schema = {
      type: SchemaType.OBJECT,
      properties: {
        color: { type: SchemaType.STRING },
        reason: { type: SchemaType.STRING },
      },
      required: ["color", "reason"],
    };

    const model = getModel(true, schema);
    const result = await model.generateContent(
      "Pick a random color for lucky color of the day and give a one sentence funny reason why it brings luck today."
    );
    
    const text = result.response.text();
    if (!text) throw new Error("No data");
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching lucky color:", error);
    return { color: "Gray", reason: "API Error or Key Missing. Everything is gray." };
  }
};

export const getDecisionHelp = async (optionA: string, optionB: string): Promise<string> => {
  try {
    const model = getModel();
    const result = await model.generateContent(
      `Help me decide between "${optionA}" and "${optionB}". Pick one decisively and give a humorous reason why.`
    );
    return result.response.text();
  } catch (error) {
    return "My circuits are undecided. (Check API Key)";
  }
};

export const getJoke = async (): Promise<string> => {
  try {
    const model = getModel();
    const result = await model.generateContent("Tell me a dad joke.");
    return result.response.text();
  } catch (error) {
    return "Why did the app crash? Because the API Key was missing!";
  }
};